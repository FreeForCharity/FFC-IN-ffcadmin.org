/**
 * Gate-3 auto-validation (Section-4b "website validated" checklist).
 *
 * Given a website-provisioning work-order issue number (and/or an explicit
 * URL), this script runs every machine-checkable item of the Gate-3 checklist
 * (docs/application-prerequisites-inventory.md §4b) against the charity's live
 * GitHub Pages site and emits a markdown verdict table:
 *
 *   - CI green: latest completed default-branch run of every active workflow on
 *     the charity's FFC-EX repo concluded success/neutral/skipped (REST API)
 *   - HTTP 200 on the "Live site:" URL (redirect loops / fetch errors = FAIL);
 *     github.io = the expected staging host, a custom domain FAILs
 *   - FFC footer markers: "Free For Charity" text, freeforcharity.org link, EIN
 *   - Required sections/pages per the chosen template
 *     (scripts/lib/gate3-requirements.json)
 *   - 375px responsive: viewport meta, no horizontal scroll, usable navigation
 *   - No browser console errors (allowlist in gate3-requirements.json)
 *   - Accessibility: no serious/critical axe-core violations (WCAG 2.1 A/AA)
 *   - basePath sanity: up to 10 root-relative asset refs checked for 404s
 *
 * Only "Content reviewed and approved by the charity" stays MANUAL. A check
 * that could not run (GitHub API down, browser launch failure, unreachable
 * asset) reports WARN — "the site fails" and "the check could not run" are
 * different verdicts. The workflow .github/workflows/gate3-validate.yml posts
 * the table as an issue comment. Network only to GitHub's REST API and the
 * target site; the browser checks live in scripts/lib/gate3-browser.mjs
 * (Playwright + @axe-core/playwright, imported lazily).
 *
 * Usage:
 *   node scripts/gate3-validate.mjs --issue 123 [--repo owner/name] [--url https://...]
 *        [--site-repo FreeForCharity/FFC-EX-example] [--template auto|single-page|footer-only]
 *        [--no-browser]
 *   node scripts/gate3-validate.mjs --url https://freeforcharity.github.io/FFC-EX-example/
 *
 * --repo is the repo holding the work-order issue (default: this repo);
 * --site-repo is the charity's FFC-EX repo whose CI is checked (default:
 * derived from the github.io URL path).
 */
import { readFileSync } from 'fs'
import { pathToFileURL } from 'url'
// The ONE liveUrlFrom implementation, shared with scripts/generate-roadmap-data.ts
// so both tools read the same work-order field (re-exported for existing consumers).
import { liveUrlFrom } from './lib/roadmap-fields.mjs'

export { liveUrlFrom }

export const DEFAULT_REPO = 'FreeForCharity/FFC-IN-ffcadmin.org'
const MAX_ASSET_CHECKS = 10
/** Pages scanned for console errors and axe (home + nav links + required pages). */
export const MAX_BROWSER_PAGES = 10
// Polite-probe budget, mirroring scripts/fleet-audit.mjs: every outbound fetch
// aborts after 10s (a hung host must not hang the workflow) and successive
// asset HEADs are paced 250ms apart.
export const REQUEST_TIMEOUT_MS = 10_000
export const PACING_MS = 250

/** Canonical requirements: template sections/pages, console allowlist, axe threshold. */
export const REQUIREMENTS = JSON.parse(
  readFileSync(new URL('./lib/gate3-requirements.json', import.meta.url), 'utf8')
)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const GITHUB_HEADERS = (token) => ({
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

/** GET a GitHub REST API path; throws (with `.status`) on a non-2xx response. */
export async function githubGet(path, token, fetchFn = fetch) {
  const res = await fetchFn(`https://api.github.com${path}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: GITHUB_HEADERS(token),
  })
  if (!res.ok) {
    const err = new Error(`GitHub API ${path.split('?')[0]} -> ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

/** Fetch the work-order issue body via the GitHub REST API. */
export async function fetchIssueBody(repo, issueNumber, token, fetchFn = fetch) {
  const res = await fetchFn(`https://api.github.com/repos/${repo}/issues/${issueNumber}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: GITHUB_HEADERS(token),
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

/** Viewport meta present (a prerequisite of the 375px check). */
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

// ---------------------------------------------------------------------------
// CI green
// ---------------------------------------------------------------------------

const REPO_NAME_RE = /^[A-Za-z0-9._-]+$/

/** True for an `owner/name` GitHub repo slug. */
export function isRepoSlug(value) {
  if (typeof value !== 'string') return false
  const parts = value.split('/')
  return parts.length === 2 && parts.every((p) => p && REPO_NAME_RE.test(p))
}

/**
 * Derive the charity repo from a GitHub Pages project URL:
 * `https://freeforcharity.github.io/FFC-EX-example.org/` ->
 * `FreeForCharity/FFC-EX-example.org`. The owner is the github.io subdomain
 * (canonical `FreeForCharity` casing for FFC's org); the repo is the first
 * path segment. Returns undefined for custom domains and user/org root sites.
 */
export function deriveRepoFromUrl(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return undefined
  }
  const host = parsed.hostname.toLowerCase()
  if (!host.endsWith('.github.io')) return undefined
  const owner = host.slice(0, -'.github.io'.length)
  const segment = decodeURIComponent(parsed.pathname.split('/').filter(Boolean)[0] || '')
  if (!owner || !segment || !REPO_NAME_RE.test(segment)) return undefined
  return `${owner === 'freeforcharity' ? 'FreeForCharity' : owner}/${segment}`
}

/** Run conclusions that count as green (neutral/skipped never block). */
export const CI_OK_CONCLUSIONS = new Set(['success', 'neutral', 'skipped'])

/**
 * Verdict over the latest completed default-branch run of each active
 * workflow. `entries` = [{ name, path, run: { conclusion, url } | null }].
 * Workflows whose path matches `ignorePaths` (config `ci.ignoreWorkflowPaths`:
 * Dependabot / Copilot agent jobs) are skipped, as are workflows with no
 * default-branch run (PR-only workflows); at least one workflow must have run
 * for a PASS.
 */
export function evaluateCiRuns(entries, ignorePaths = REQUIREMENTS.ci.ignoreWorkflowPaths) {
  const ignoreRes = ignorePaths.map((p) => new RegExp(p.path))
  const ignored = entries.filter((e) => ignoreRes.some((re) => re.test(e.path || '')))
  const considered = entries.filter((e) => !ignored.includes(e))
  const withRuns = considered.filter((e) => e.run)
  const failing = withRuns.filter((e) => !CI_OK_CONCLUSIONS.has(e.run.conclusion))
  return {
    ok: withRuns.length > 0 && failing.length === 0,
    checked: withRuns.length,
    failing,
    ignored: ignored.map((e) => e.name),
    noRuns: considered.filter((e) => !e.run).map((e) => e.name),
  }
}

/**
 * Read the charity repo's default branch, template origin, and the latest
 * completed default-branch run of every active workflow. Public repo, so the
 * workflow's GITHUB_TOKEN (or no token) is enough.
 */
export async function fetchCiStatus(repo, token, fetchFn = fetch) {
  const info = await githubGet(`/repos/${repo}`, token, fetchFn)
  const defaultBranch = info.default_branch || 'main'
  const list = await githubGet(`/repos/${repo}/actions/workflows?per_page=100`, token, fetchFn)
  const active = (list.workflows || []).filter((w) => w.state === 'active')
  const entries = []
  for (const w of active) {
    const runs = await githubGet(
      `/repos/${repo}/actions/workflows/${w.id}/runs?branch=${encodeURIComponent(defaultBranch)}` +
        '&status=completed&exclude_pull_requests=true&per_page=1',
      token,
      fetchFn
    )
    const run = runs.workflow_runs?.[0]
    entries.push({
      name: w.name,
      path: w.path,
      run: run ? { conclusion: run.conclusion, url: run.html_url } : null,
    })
  }
  return { repo, defaultBranch, templateRepo: info.template_repository?.full_name, entries }
}

// ---------------------------------------------------------------------------
// Required sections / pages
// ---------------------------------------------------------------------------

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** True when the html has an element with exactly this id. */
export function hasElementId(html, id) {
  const v = escapeRegExp(id)
  return new RegExp(`<[^>]*\\sid\\s*=\\s*(?:"${v}"|'${v}'|${v}(?=[\\s/>]))`).test(html || '')
}

/** Ids from `ids` that the html does not contain. */
export function findMissingSections(html, ids) {
  return ids.filter((id) => !hasElementId(html, id))
}

/**
 * Which template's requirements apply: explicit input, else the FFC-EX repo's
 * GitHub `template_repository`, else the section-id heuristic, else the
 * config default. Returns { key, source } (key undefined = unknown input).
 */
export function resolveTemplate({ explicit, templateRepo, html }, config = REQUIREMENTS) {
  const templates = config.templates
  if (explicit && explicit !== 'auto') {
    return templates[explicit]
      ? { key: explicit, source: 'input' }
      : { key: undefined, source: 'input' }
  }
  if (templateRepo) {
    const wanted = templateRepo.toLowerCase()
    const hit = Object.entries(templates).find(([, t]) =>
      [t.repo, ...(t.repoAliases || [])].some((r) => r.toLowerCase() === wanted)
    )
    if (hit) return { key: hit[0], source: 'template_repository' }
  }
  for (const [key, t] of Object.entries(templates)) {
    const ids = t.detectSectionIds || []
    if (ids.length > 0 && ids.every((id) => hasElementId(html, id))) {
      return { key, source: 'detected' }
    }
  }
  return { key: config.defaultTemplate, source: 'default' }
}

/**
 * The site's root directory URL: `.../FFC-EX-x/index.html` and `.../FFC-EX-x`
 * both become `.../FFC-EX-x/`, so template page paths resolve under it.
 */
export function siteBaseUrl(url) {
  const u = new URL(url)
  u.hash = ''
  u.search = ''
  if (!u.pathname.endsWith('/')) {
    const last = u.pathname.split('/').pop()
    u.pathname = last.includes('.') ? u.pathname.slice(0, -last.length) : `${u.pathname}/`
  }
  return u.href
}

/** Resolve a template page path ("/privacy-policy/") under the site's basePath. */
export const resolveSitePath = (base, path) => new URL(path.replace(/^\/+/, ''), base).href

/**
 * Required sections (home-page element ids) and required pages (HTTP 200) for
 * the resolved template. A thrown page fetch is `unreachable` (transient,
 * WARN), not missing.
 */
export async function checkSections(
  html,
  finalUrl,
  template,
  fetchFn = fetch,
  { pacingMs = PACING_MS, config = REQUIREMENTS } = {}
) {
  const spec = config.templates[template.key]
  if (!spec) return { ok: false, template, unknownTemplate: true, missingSections: [], pages: [] }
  const base = siteBaseUrl(finalUrl)
  const missingSections = findMissingSections(html, spec.homeSectionIds)
  const pages = []
  for (const path of spec.pages) {
    if (pacingMs > 0) await sleep(pacingMs)
    const res = await checkHttp(resolveSitePath(base, path), fetchFn)
    pages.push({ path, status: res.status, ok: res.ok })
  }
  const missingPages = pages.filter((p) => !p.ok && p.status !== 0)
  return {
    ok: missingSections.length === 0 && pages.every((p) => p.ok),
    template,
    missingSections,
    pages,
    missingPages,
    unreachablePages: pages.filter((p) => p.status === 0),
  }
}

// ---------------------------------------------------------------------------
// Browser checks: page selection, console allowlist, verdict inputs
// ---------------------------------------------------------------------------

const NON_PAGE_EXT = /\.(pdf|png|jpe?g|gif|svg|webp|avif|ico|zip|xml|txt|json|js|css|mp4|webm)$/i

/**
 * Pages to scan in the browser: the home page, then same-origin pages under
 * the site's basePath linked from the header/nav, then the template's required
 * pages — deduped (hash and index.html/trailing-slash insensitive), files and
 * external links dropped, capped at `max`.
 */
export function selectCrawlPages(homeUrl, navHrefs = [], extraPaths = [], max = MAX_BROWSER_PAGES) {
  const base = new URL(siteBaseUrl(homeUrl))
  const out = []
  const seen = new Set()
  const add = (href, relativeTo) => {
    let u
    try {
      u = new URL(href, relativeTo)
    } catch {
      return
    }
    if (!/^https?:$/.test(u.protocol) || u.origin !== base.origin) return
    if (!u.pathname.startsWith(base.pathname) && `${u.pathname}/` !== base.pathname) return
    if (NON_PAGE_EXT.test(u.pathname)) return
    u.hash = ''
    const key = `${u.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '')}${u.search}`
    if (seen.has(key)) return
    seen.add(key)
    out.push(u.href)
  }
  add(homeUrl, homeUrl)
  for (const href of navHrefs) add(href, homeUrl)
  for (const path of extraPaths) add(path.replace(/^\/+/, ''), base.href)
  return out.slice(0, max)
}

/**
 * True when a console error matches an allowlist entry. An entry needs a
 * `message` and/or `source` regex and every given regex must match; entries
 * with neither are ignored (they would silence everything).
 */
export function isAllowlisted(error, allowlist = REQUIREMENTS.consoleAllowlist) {
  return allowlist.some((entry) => {
    if (!entry.message && !entry.source) return false
    if (entry.message && !new RegExp(entry.message, 'i').test(error.text || '')) return false
    if (entry.source && !new RegExp(entry.source, 'i').test(error.url || '')) return false
    return true
  })
}

/**
 * Flatten a browser run's per-page console errors, page errors and HTTP
 * failures into { page, text } items, splitting off allowlisted noise.
 */
export function collectConsoleErrors(pages, allowlist = REQUIREMENTS.consoleAllowlist) {
  const errors = []
  let allowlisted = 0
  for (const p of pages) {
    if (p.error) errors.push({ page: p.url, text: `page failed to load: ${p.error}` })
    else if (p.status >= 400) errors.push({ page: p.url, text: `HTTP ${p.status} loading page` })
    for (const e of p.consoleErrors || []) {
      if (isAllowlisted(e, allowlist)) allowlisted++
      else errors.push({ page: p.url, text: e.text })
    }
    for (const text of p.pageErrors || []) {
      if (isAllowlisted({ text, url: '' }, allowlist)) allowlisted++
      else errors.push({ page: p.url, text: `uncaught: ${text}` })
    }
  }
  return { errors, allowlisted }
}

/**
 * axe results across pages: violations at a failing impact (default
 * serious/critical) grouped by rule id, plus pages whose scan errored.
 */
export function collectAxeViolations(pages, failImpacts = REQUIREMENTS.axe.failImpacts) {
  const byRule = new Map()
  const scanErrors = []
  let scanned = 0
  for (const p of pages) {
    if (!p.axe) continue
    if (p.axe.error) {
      scanErrors.push({ page: p.url, error: p.axe.error })
      continue
    }
    scanned++
    for (const v of p.axe.violations || []) {
      if (!failImpacts.includes(v.impact)) continue
      const entry = byRule.get(v.id) || { id: v.id, impact: v.impact, nodes: 0, pages: [] }
      entry.nodes += v.nodes
      entry.pages.push(p.url)
      byRule.set(v.id, entry)
    }
  }
  return { blocking: [...byRule.values()], scanErrors, scanned }
}

/**
 * 375px verdict inputs. No horizontal scroll: scrollWidth <= innerWidth + 1
 * (1px rounding slack). Nav usable: a visible menu toggle must reveal more
 * links when clicked; with no toggle, at least two header links (logo + a nav
 * link) must be visible — unless the template ships no header menu
 * (`headerNavRequired: false`, the footer-only layout), where the footer links
 * are the navigation.
 */
export function evaluateResponsive(r, { headerNavRequired = true } = {}) {
  const noHorizontalScroll = r.scrollWidth <= r.innerWidth + 1
  const headerLinksVisible = r.linksBefore >= 2
  let navUsable
  let navMode
  if (r.toggleVisible) {
    navUsable = r.toggleOpened
    navMode = 'toggle'
  } else if (headerLinksVisible) {
    navUsable = true
    navMode = 'links'
  } else {
    navUsable = !headerNavRequired
    navMode = 'none'
  }
  return { ok: noHorizontalScroll && navUsable, noHorizontalScroll, navUsable, navMode }
}

async function defaultBrowserRunner(opts) {
  const { runBrowserChecks } = await import('./lib/gate3-browser.mjs')
  return runBrowserChecks(opts)
}

/**
 * Run every automated check against a live URL.
 *
 * Options: `siteRepo` (explicit FFC-EX repo), `template` (auto|single-page|
 * footer-only), `token` (GitHub API), `browserRunner` (injected in tests; null
 * skips the browser checks, which then WARN), `pacingMs`, `config`.
 */
export async function runChecks(
  url,
  fetchFn = fetch,
  {
    pacingMs = PACING_MS,
    siteRepo,
    template = 'auto',
    token,
    browserRunner = defaultBrowserRunner,
    config = REQUIREMENTS,
  } = {}
) {
  const http = await checkHttp(url, fetchFn)
  const finalUrl = http.finalUrl || url
  const host = checkHost(finalUrl)
  const footer = checkFooter(http.html)
  const viewport = checkViewport(http.html)
  const assets = http.ok
    ? await checkAssets(http.html, finalUrl, fetchFn, { pacingMs })
    : { ok: false, checked: 0, broken: [], unreachable: [], inconclusive: [] }

  // CI: explicit repo wins; otherwise derive it from the (pre-redirect) URL —
  // a github.io URL redirecting to a custom domain still names its repo.
  const repo = siteRepo || deriveRepoFromUrl(url) || deriveRepoFromUrl(finalUrl)
  let ci
  if (!repo) ci = { repo: undefined }
  else {
    try {
      const status = await fetchCiStatus(repo, token, fetchFn)
      ci = { ...status, ...evaluateCiRuns(status.entries, config.ci.ignoreWorkflowPaths) }
    } catch (err) {
      ci = { repo, error: err?.message || String(err), notFound: err?.status === 404 }
    }
  }

  const resolved = resolveTemplate(
    { explicit: template, templateRepo: ci.templateRepo, html: http.html },
    config
  )
  const sections = http.ok
    ? await checkSections(http.html, finalUrl, resolved, fetchFn, { pacingMs, config })
    : null

  let browser
  if (!http.ok) browser = null
  else if (!browserRunner) browser = { error: 'browser checks disabled (--no-browser)' }
  else {
    const extraPaths = config.templates[resolved.key]?.pages || []
    try {
      browser = await browserRunner({
        url: finalUrl,
        axe: config.axe,
        selectPages: (homeUrl, navHrefs) => selectCrawlPages(homeUrl, navHrefs, extraPaths),
      })
    } catch (err) {
      browser = { error: err?.message || String(err) }
    }
  }

  return {
    url,
    http,
    host,
    footer,
    viewport,
    assets,
    ci,
    template: resolved,
    sections,
    browser,
    config,
  }
}

// ---------------------------------------------------------------------------
// Verdict
// ---------------------------------------------------------------------------

const pass = (detail) => ({ status: 'PASS', detail })
const fail = (detail) => ({ status: 'FAIL', detail })
const warn = (detail) => ({ status: 'WARN', detail })
const manual = (detail) => ({ status: 'MANUAL', detail })

/** Make free text safe inside a markdown table cell. */
export function mdCell(text, max = 160) {
  const flat = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim()
  const cut = flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
  return cut.replace(/\|/g, '\\|').replace(/`/g, "'")
}

/** Short page label for details: path relative to the site root. */
function pageLabel(pageUrl, homeUrl) {
  try {
    const base = new URL(siteBaseUrl(homeUrl))
    const u = new URL(pageUrl)
    const rel = u.pathname.startsWith(base.pathname)
      ? u.pathname.slice(base.pathname.length)
      : u.pathname
    return `/${rel}`
  } catch {
    return pageUrl
  }
}

const listMore = (items, n = 3) =>
  items.length > n ? `${items.slice(0, n).join('; ')}; +${items.length - n} more` : items.join('; ')

function ciVerdict(ci) {
  if (!ci.repo)
    return fail(
      'Could not derive the FFC-EX repo from the URL (expected `https://freeforcharity.github.io/FFC-EX-…/`). ' +
        'Re-run with the `repo` input.'
    )
  if (ci.notFound)
    return fail(`Repo \`${ci.repo}\` not found (404). Re-run with the correct \`repo\` input.`)
  if (ci.error)
    return warn(`Could not read CI for \`${ci.repo}\`: ${mdCell(ci.error)}. Re-run to confirm.`)
  if (ci.checked === 0)
    return fail(`No completed workflow runs on \`${ci.repo}\` \`${ci.defaultBranch}\`.`)
  if (ci.failing.length > 0)
    return fail(
      `\`${ci.repo}\` \`${ci.defaultBranch}\`: ` +
        listMore(
          ci.failing.map((e) => `${mdCell(e.name, 60)} → ${e.run.conclusion} ([run](${e.run.url}))`)
        )
    )
  const skipped = ci.ignored?.length ? ` (${ci.ignored.length} bot/agent workflow(s) ignored)` : ''
  return pass(
    `\`${ci.repo}\` \`${ci.defaultBranch}\`: latest run of all ${ci.checked} workflow(s) succeeded${skipped}.`
  )
}

function sectionsVerdict(results) {
  const { http, sections } = results
  if (!http.ok) return fail('Page did not load; sections not checked.')
  const t = sections.template
  if (sections.unknownTemplate)
    return fail(
      `Unknown template \`${mdCell(t.key ?? 'input')}\` — use auto, single-page or footer-only.`
    )
  const spec = results.config.templates[t.key]
  const label = `Template \`${t.key}\` (${t.source.replace('_', ' ')})`
  const problems = []
  if (sections.missingSections.length > 0)
    problems.push(`missing section(s) ${sections.missingSections.map((id) => `#${id}`).join(', ')}`)
  if (sections.missingPages.length > 0)
    problems.push(
      `page(s) not 200: ${sections.missingPages.map((p) => `${p.path} (${p.status})`).join(', ')}`
    )
  if (problems.length > 0) return fail(`${label}: ${problems.join('; ')}.`)
  if (sections.unreachablePages.length > 0)
    return warn(
      `${label}: ${sections.unreachablePages.map((p) => p.path).join(', ')} unreachable during check — re-run to confirm.`
    )
  return pass(
    `${label}: sections ${spec.homeSectionIds.map((id) => `#${id}`).join(', ')} present; ` +
      `all ${spec.pages.length} required pages return 200.`
  )
}

function responsiveVerdict(results) {
  const { http, viewport, browser } = results
  if (!http.ok) return fail('Page did not load; 375px check not run.')
  if (!viewport.ok) return fail('No viewport meta tag — the page cannot render responsively.')
  if (browser?.error)
    return warn(
      `Viewport meta present, but the browser check could not run: ${mdCell(browser.error)}`
    )
  const r = browser.responsive
  const spec = results.config.templates[results.template?.key]
  const v = evaluateResponsive(r, { headerNavRequired: spec?.headerNavRequired ?? true })
  const problems = []
  if (!v.noHorizontalScroll)
    problems.push(`horizontal scroll (scrollWidth ${r.scrollWidth}px > ${r.innerWidth}px)`)
  if (!v.navUsable)
    problems.push(
      v.navMode === 'toggle'
        ? 'menu toggle did not reveal navigation links when clicked'
        : 'no visible navigation links or menu toggle in the header'
    )
  if (problems.length > 0) return fail(`At 375×812: ${problems.join('; ')}.`)
  const how = {
    toggle: 'menu toggle opens the menu',
    links: 'header links visible',
    none: `no header menu in the \`${results.template?.key}\` layout; footer links are the navigation`,
  }[v.navMode]
  return pass(`At 375×812: no horizontal scroll; navigation usable (${how}).`)
}

function consoleVerdict(results) {
  const { http, browser } = results
  if (!http.ok) return fail('Page did not load; console not checked.')
  if (browser?.error) return warn(`Browser check could not run: ${mdCell(browser.error)}`)
  const { errors, allowlisted } = collectConsoleErrors(
    browser.pages,
    results.config.consoleAllowlist
  )
  const note = allowlisted > 0 ? ` (${allowlisted} allowlisted third-party message(s) ignored)` : ''
  if (errors.length > 0)
    return fail(
      `${errors.length} error(s) across ${browser.pages.length} page(s)${note}: ` +
        listMore(errors.map((e) => `${pageLabel(e.page, results.url)}: ${mdCell(e.text, 100)}`))
    )
  return pass(`${browser.pages.length} page(s) checked, no console errors${note}.`)
}

function a11yVerdict(results) {
  const { http, browser } = results
  if (!http.ok) return fail('Page did not load; accessibility not checked.')
  if (browser?.error) return warn(`Browser check could not run: ${mdCell(browser.error)}`)
  const impacts = results.config.axe.failImpacts
  const { blocking, scanErrors, scanned } = collectAxeViolations(browser.pages, impacts)
  if (blocking.length > 0)
    return fail(
      `axe-core: ${blocking.length} ${impacts.join('/')} rule(s) violated: ` +
        listMore(
          blocking.map(
            (b) =>
              `${b.id} (${b.impact}, ${b.nodes} node(s) on ${b.pages.map((p) => pageLabel(p, results.url)).join(', ')})`
          )
        )
    )
  if (scanErrors.length > 0 || scanned === 0)
    return warn(
      `axe-core scan failed on ${scanErrors.map((e) => pageLabel(e.page, results.url)).join(', ') || 'every page'} — re-run to confirm.`
    )
  return pass(
    `axe-core: no ${impacts.join('/')} WCAG 2.1 A/AA violations on ${scanned} page(s) (moderate/minor findings are not gated).`
  )
}

/**
 * Map check results onto the Section-4b checklist (same order and wording
 * family as VALIDATION_CHECKLIST in scripts/lib/intake-issues.mjs). Only the
 * charity's content approval stays MANUAL.
 */
export function buildVerdictRows(checkResults) {
  const results = { config: REQUIREMENTS, ...checkResults }
  const { http, host, footer, assets } = results
  const rows = []

  rows.push({ item: "CI green on the charity's FFC-EX repo", ...ciVerdict(results.ci) })

  if (!http.ok) {
    rows.push({
      item: 'Site loads at its GitHub Pages URL (HTTP 200, no redirect loops)',
      ...fail(
        http.error
          ? `Fetch failed: ${mdCell(http.error)} (redirect loop or unreachable).`
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
    ...sectionsVerdict(results),
  })
  rows.push({ item: 'Mobile responsive (spot-check at 375px)', ...responsiveVerdict(results) })
  rows.push({ item: 'No browser console errors on any page', ...consoleVerdict(results) })
  rows.push({
    item: 'Accessibility pass (axe clean or Lighthouse a11y ≥ 90)',
    ...a11yVerdict(results),
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

/** Parse CLI flags (`--name value`, boolean `--no-browser`). */
export function parseArgs(argv) {
  const opt = (name) => {
    const i = argv.indexOf(`--${name}`)
    return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : undefined
  }
  return {
    issueNumber: opt('issue'),
    url: opt('url'),
    repo: opt('repo'),
    siteRepo: opt('site-repo'),
    template: opt('template') || 'auto',
    browser: !argv.includes('--no-browser'),
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const { issueNumber } = args
  let { url } = args
  const repo = args.repo || process.env.GITHUB_REPOSITORY || DEFAULT_REPO
  const token = process.env.GITHUB_TOKEN

  if (!url && !issueNumber) {
    console.error(
      'Usage: node scripts/gate3-validate.mjs --issue <number> [--url <url>] [--site-repo owner/name] [--template auto|single-page|footer-only] [--no-browser]'
    )
    process.exit(2)
  }
  if (args.siteRepo && !isRepoSlug(args.siteRepo)) {
    console.error(`--site-repo must be owner/name, got "${args.siteRepo}"`)
    process.exit(2)
  }
  if (!url) {
    const body = await fetchIssueBody(repo, issueNumber, token)
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

  const results = await runChecks(url, fetch, {
    siteRepo: args.siteRepo,
    template: args.template,
    token,
    ...(args.browser ? {} : { browserRunner: null }),
  })
  console.log(buildVerdictTable(results, { issueNumber }))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
