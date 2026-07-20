/**
 * Gate-3 auto-validation (semi-automated Section-4b checklist).
 *
 * Given a website-provisioning work-order issue number (and/or an explicit
 * URL), this script runs the machine-checkable subset of the Gate-3
 * "website validated" checklist (docs/application-prerequisites-inventory.md
 * §4b) against the charity's live site and emits a markdown verdict table:
 *
 *   - HTTP 200 on the "Live site:" URL (redirect loops / fetch errors = FAIL)
 *   - Host sanity: github.io = staging (expected at Gate 3); custom domain noted
 *   - FFC footer markers: "Free For Charity" text, freeforcharity.org link,
 *     and an EIN pattern
 *   - basePath sanity: up to 10 root-relative href/src asset refs fetched;
 *     404s indicate a broken Next.js basePath
 *   - viewport meta present (mobile baseline only)
 *
 * Items that need human judgment (content approval, accessibility, console
 * errors, ...) are listed as MANUAL so reviewers see exactly what remains.
 * The workflow .github/workflows/gate3-validate.yml posts the table as an
 * issue comment. Plain node, no dependencies; network only to GitHub's REST
 * API (issue lookup) and the target site.
 *
 * Usage:
 *   node scripts/gate3-validate.mjs --issue 123 [--repo owner/name] [--url https://...]
 *   node scripts/gate3-validate.mjs --url https://freeforcharity.github.io/FFC-EX-example/
 */
import { pathToFileURL } from 'url'
// The ONE liveUrlFrom implementation, shared with scripts/generate-roadmap-data.ts
// so both tools read the same work-order field (re-exported for existing consumers).
import { liveUrlFrom } from './lib/roadmap-fields.mjs'

export { liveUrlFrom }

export const DEFAULT_REPO = 'FreeForCharity/FFC-IN-ffcadmin.org'
const MAX_ASSET_CHECKS = 10
// Polite-probe budget, mirroring scripts/fleet-audit.mjs: every outbound fetch
// aborts after 10s (a hung host must not hang the workflow) and successive
// asset HEADs are paced 250ms apart.
export const REQUEST_TIMEOUT_MS = 10_000
export const PACING_MS = 250

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Fetch the work-order issue body via the GitHub REST API. */
export async function fetchIssueBody(repo, issueNumber, token, fetchFn = fetch) {
  const res = await fetchFn(`https://api.github.com/repos/${repo}/issues/${issueNumber}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub API issues/${issueNumber} -> ${res.status}`)
  const issue = await res.json()
  return issue.body || ''
}

/**
 * HTTP check: 200 after following redirects. node's fetch throws on a
 * redirect loop ("redirect count exceeded"), which we surface as a FAIL
 * rather than a crash. Returns { ok, status, finalUrl, error?, html? }.
 */
export async function checkHttp(url, fetchFn = fetch) {
  try {
    const res = await fetchFn(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    const html = res.ok ? await res.text() : ''
    return { ok: res.ok && res.status === 200, status: res.status, finalUrl: res.url || url, html }
  } catch (err) {
    return { ok: false, status: 0, finalUrl: url, html: '', error: err?.message || String(err) }
  }
}

/** Host sanity: github.io is the expected Gate-3 staging host. */
export function checkHost(url) {
  try {
    const host = new URL(url).hostname.toLowerCase()
    const isGithubIo = host === 'github.io' || host.endsWith('.github.io')
    return { ok: true, isGithubIo, host }
  } catch {
    return { ok: false, isGithubIo: false, host: '' }
  }
}

/**
 * FFC footer markers: brand text, a freeforcharity.org link, and an EIN.
 * All three must be present for a PASS.
 */
export function checkFooter(html) {
  const brand = /Free ?For ?Charity/i.test(html)
  const link = /freeforcharity\.org/i.test(html)
  const ein = /EIN[:\s]*\d{2}-?\d{7}/i.test(html)
  return { ok: brand && link && ein, brand, link, ein }
}

/** Viewport meta present (mobile baseline only — not a full responsive check). */
export function checkViewport(html) {
  return { ok: /<meta[^>]+name=["']viewport["']/i.test(html) }
}

/**
 * Collect root-relative href/src refs ("/style.css") from the page. On a
 * GitHub Pages *project* site these resolve to the origin root instead of the
 * repo's basePath, so 404s here are the classic broken-basePath signal.
 * Protocol-relative ("//cdn...") refs are excluded. Deduped, capped later.
 */
export function extractRootRelativeRefs(html) {
  const refs = new Set()
  const re = /(?:href|src)=["'](\/[^"'\s>]*)["']/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const ref = m[1]
    if (!ref.startsWith('//')) refs.add(ref)
  }
  return [...refs]
}

/** HEAD statuses that don't prove anything: many hosts reject HEAD outright. */
const HEAD_INCONCLUSIVE = new Set([403, 405])

/**
 * basePath sanity: fetch up to MAX_ASSET_CHECKS root-relative refs resolved
 * against the final page URL and report any that 404. No refs = trivially ok
 * (a correctly basePath'd export emits repo-prefixed absolute refs).
 *
 * Only a real 404 is a broken-basePath verdict:
 *   - a thrown fetch (DNS/TLS/timeout) is a transient network failure, NOT a
 *     404 — reported separately in `unreachable` so it warns instead of fails;
 *   - 403/405 on HEAD usually means the host rejects HEAD, not that the asset
 *     is missing — retried with a ranged GET, and if still blocked recorded in
 *     `inconclusive` (unknown, never a FAIL).
 *
 * `pacingMs` (default PACING_MS) spaces successive asset requests; tests pass
 * 0 to stay fast.
 */
export async function checkAssets(html, baseUrl, fetchFn = fetch, { pacingMs = PACING_MS } = {}) {
  const refs = extractRootRelativeRefs(html).slice(0, MAX_ASSET_CHECKS)
  const broken = []
  const unreachable = []
  const inconclusive = []
  let first = true
  for (const ref of refs) {
    if (!first && pacingMs > 0) await sleep(pacingMs)
    first = false
    const target = new URL(ref, baseUrl).href
    try {
      let res = await fetchFn(target, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      if (HEAD_INCONCLUSIVE.has(res.status)) {
        // The host may simply reject HEAD; confirm with a 1-byte ranged GET.
        if (pacingMs > 0) await sleep(pacingMs)
        res = await fetchFn(target, {
          method: 'GET',
          redirect: 'follow',
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          headers: { range: 'bytes=0-0' },
        })
        if (HEAD_INCONCLUSIVE.has(res.status)) {
          inconclusive.push(ref)
          continue
        }
      }
      if (res.status === 404) broken.push(ref)
    } catch {
      unreachable.push(ref)
    }
  }
  return { ok: broken.length === 0, checked: refs.length, broken, unreachable, inconclusive }
}

/** Run every automated check against a live URL. */
export async function runChecks(url, fetchFn = fetch, { pacingMs = PACING_MS } = {}) {
  const http = await checkHttp(url, fetchFn)
  const host = checkHost(http.finalUrl || url)
  const footer = checkFooter(http.html)
  const viewport = checkViewport(http.html)
  const assets = http.ok
    ? await checkAssets(http.html, http.finalUrl || url, fetchFn, { pacingMs })
    : { ok: false, checked: 0, broken: [], unreachable: [], inconclusive: [] }
  return { url, http, host, footer, viewport, assets }
}

const pass = (detail) => ({ status: 'PASS', detail })
const fail = (detail) => ({ status: 'FAIL', detail })
const warn = (detail) => ({ status: 'WARN', detail })
const manual = (detail) => ({ status: 'MANUAL', detail })

/**
 * Map check results onto the Section-4b checklist (same order and wording
 * family as VALIDATION_CHECKLIST in scripts/lib/intake-issues.mjs). Items the
 * script cannot verify stay MANUAL so humans see exactly what remains.
 */
export function buildVerdictRows(results) {
  const { http, host, footer, viewport, assets } = results
  const rows = []

  rows.push({
    item: "CI green on the charity's FFC-EX repo",
    ...manual('Check the latest default-branch run on the FFC-EX repo.'),
  })

  if (!http.ok) {
    rows.push({
      item: 'Site loads at its GitHub Pages URL (HTTP 200, no redirect loops)',
      ...fail(
        http.error
          ? `Fetch failed: ${http.error} (redirect loop or unreachable).`
          : `HTTP ${http.status} at ${results.url}`
      ),
    })
  } else if (host.isGithubIo) {
    rows.push({
      item: 'Site loads at its GitHub Pages URL (HTTP 200, no redirect loops)',
      ...pass(`HTTP 200 on staging host \`${host.host}\`.`),
    })
  } else {
    // A non-github.io host is exactly the wrong-URL case this item exists to
    // catch: Gate 3 validates the GitHub Pages STAGING URL (the custom domain
    // comes later, at Gate 4). A reachable custom domain must not pass it.
    rows.push({
      item: 'Site loads at its GitHub Pages URL (HTTP 200, no redirect loops)',
      ...fail(
        `HTTP 200, but \`${host.host}\` is a custom domain, not the GitHub Pages staging URL — ` +
          "Gate 3 validates the `*.github.io` staging URL. Paste the repo's " +
          '`https://freeforcharity.github.io/FFC-EX-…/` URL as `Live site:` and re-run.'
      ),
    })
  }

  if (!http.ok) {
    rows.push({
      item: 'FFC-standard footer present and populated',
      ...fail('Page did not load; footer not checked.'),
    })
  } else {
    const missing = []
    if (!footer.brand) missing.push('"Free For Charity" text')
    if (!footer.link) missing.push('freeforcharity.org link')
    if (!footer.ein) missing.push('EIN')
    rows.push({
      item: 'FFC-standard footer present and populated',
      ...(footer.ok
        ? pass('Brand text, freeforcharity.org link, and EIN all found.')
        : fail(`Missing: ${missing.join(', ')}. (Policy/social links still need a human check.)`)),
    })
  }

  rows.push({
    item: 'All required sections/pages present per the chosen template',
    ...manual('Compare the site against the chosen template section list.'),
  })

  if (!http.ok) {
    rows.push({
      item: 'Mobile responsive (spot-check at 375px)',
      ...fail('Page did not load; viewport meta not checked.'),
    })
  } else {
    rows.push({
      item: 'Mobile responsive (spot-check at 375px)',
      ...(viewport.ok
        ? pass('Viewport meta present (baseline only — the 375px spot-check is still manual).')
        : fail('No viewport meta tag — the page cannot render responsively.')),
    })
  }

  rows.push({
    item: 'No browser console errors on any page',
    ...manual('Open DevTools on each page and confirm a clean console.'),
  })
  rows.push({
    item: 'Accessibility pass (axe clean or Lighthouse a11y ≥ 90)',
    ...manual('Run axe or Lighthouse against the staging URL.'),
  })
  rows.push({
    item: 'Content reviewed and approved by the charity',
    ...manual('The charity ticks this box on the work order.'),
  })

  // Auxiliary automated signal (not a Section-4b line item, but a common
  // failure mode on project-site staging URLs): broken basePath asset refs.
  // Only a confirmed 404 FAILs; network errors and HEAD-blocked hosts WARN —
  // "the asset is missing" and "the check could not run" are different verdicts.
  const assetVerdict = () => {
    if (!http.ok) return fail('Page did not load; assets not checked.')
    if (assets.broken.length > 0)
      return fail(`404 on: ${assets.broken.join(', ')} — likely a broken Next.js basePath.`)
    const caveats = []
    if (assets.unreachable.length > 0)
      caveats.push(
        `${assets.unreachable.join(', ')} unreachable during check — transient? Re-run to confirm.`
      )
    if (assets.inconclusive.length > 0)
      caveats.push(
        `${assets.inconclusive.join(', ')} inconclusive (host rejects HEAD and ranged GET) — verify manually.`
      )
    if (caveats.length > 0) return warn(caveats.join(' '))
    return pass(
      assets.checked === 0
        ? 'No root-relative asset refs found (basePath-prefixed refs expected).'
        : `${assets.checked} root-relative ref(s) checked, none 404.`
    )
  }
  rows.push({ item: 'basePath sanity (root-relative asset refs resolve)', ...assetVerdict() })

  return rows
}

const STATUS_EMOJI = { PASS: '✅', FAIL: '❌', WARN: '⚠️', MANUAL: '📝' }

/** Render the verdict rows as the markdown comment body. */
export function buildVerdictTable(results, { issueNumber } = {}) {
  const rows = buildVerdictRows(results)
  const failed = rows.filter((r) => r.status === 'FAIL').length
  const warned = rows.filter((r) => r.status === 'WARN').length
  const manualLeft = rows.filter((r) => r.status === 'MANUAL').length
  const lines = [
    '## Gate-3 auto-validation',
    '',
    `Automated check of the machine-verifiable [Section-4b](https://github.com/${DEFAULT_REPO}/blob/main/docs/application-prerequisites-inventory.md#4b-the-website-validated-checklist-gate-3-definition) items against ${results.url}${issueNumber ? ` (work order #${issueNumber})` : ''}.`,
    '',
    '| Gate-3 item | Status | Detail |',
    '| --- | --- | --- |',
    ...rows.map((r) => `| ${r.item} | ${STATUS_EMOJI[r.status]} ${r.status} | ${r.detail} |`),
    '',
    failed > 0
      ? `**${failed} automated check(s) FAILED** — fix these before ticking the corresponding boxes.`
      : '**All automated checks passed.**',
    ...(warned > 0
      ? [`${warned} check(s) WARN — could not be verified conclusively; see the detail column.`]
      : []),
    `${manualLeft} item(s) remain MANUAL — this tool does not replace the human checklist; tick boxes on the work order as each item is verified.`,
    '',
    '_Posted by `.github/workflows/gate3-validate.yml` (`scripts/gate3-validate.mjs`)._',
  ]
  return lines.join('\n')
}

async function main() {
  const args = process.argv.slice(2)
  const opt = (name) => {
    const i = args.indexOf(`--${name}`)
    return i !== -1 ? args[i + 1] : undefined
  }
  const issueNumber = opt('issue')
  let url = opt('url')
  const repo = opt('repo') || process.env.GITHUB_REPOSITORY || DEFAULT_REPO

  if (!url && !issueNumber) {
    console.error('Usage: node scripts/gate3-validate.mjs --issue <number> [--url <url>]')
    process.exit(2)
  }
  if (!url) {
    const body = await fetchIssueBody(repo, issueNumber, process.env.GITHUB_TOKEN)
    url = liveUrlFrom(body)
    if (!url) {
      // Still a useful outcome: tell the humans the work order has no URL yet.
      console.log(
        [
          '## Gate-3 auto-validation',
          '',
          `No \`Live site:\` URL found on work order #${issueNumber} — nothing to validate yet.`,
          'Paste the https GitHub Pages URL after "Live site:" on the issue body and re-run.',
          '',
          '_Posted by `.github/workflows/gate3-validate.yml` (`scripts/gate3-validate.mjs`)._',
        ].join('\n')
      )
      return
    }
  }

  const results = await runChecks(url)
  console.log(buildVerdictTable(results, { issueNumber }))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
