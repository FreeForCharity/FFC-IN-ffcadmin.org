#!/usr/bin/env node
/**
 * Upsert ONE hub issue listing fleet sites whose smoke monitoring has stopped
 * (FFC-Cloudflare-Automation#753, part d).
 *
 * Reads public/data/fleet-smoke-status.json (produced by
 * generate-fleet-smoke-status.mjs) and, for every site in the `stale-monitor`
 * state, maintains a single auto-managed issue in THIS repo labeled
 * `smoke-failure` + `priority: high`:
 *
 *   - stale sites present, no managed issue  -> create it
 *   - stale sites present, managed issue open -> update its body
 *   - no stale sites, managed issue open      -> comment + close (auto-close)
 *   - no stale sites, no managed issue        -> no-op
 *
 * The managed issue is identified by a hidden marker in its body, so the title
 * can change with the site list without orphaning the issue. Mirrors the
 * per-repo smoke-failure auto-close pattern of the smoke engine.
 *
 * Auth: the workflow's built-in GITHUB_TOKEN (scoped to this repo). Degrades
 * gracefully — a missing token or API error is logged and the step exits 0.
 */
import { readFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const DATA = join(SCRIPT_DIR, '..', 'public', 'data', 'fleet-smoke-status.json')

export const MANAGED_MARKER = '<!-- fleet-stale-monitor-report -->'
// Distinctive slug inside the marker, used for the label-independent search
// fallback so a manually stripped label can't orphan the managed issue.
export const MARKER_SLUG = 'fleet-stale-monitor-report'
export const LABELS = ['smoke-failure', 'priority: high']

/** Stable-ish title; the marker (not the title) is what identifies the issue. */
export function issueTitle(staleSites) {
  const n = staleSites.length
  return `⚠️ Fleet smoke monitoring has stopped on ${n} site${n === 1 ? '' : 's'}`
}

/** Build the managed issue body (pure — unit-tested). */
export function buildIssueBody(staleSites, generatedAt) {
  const rows = staleSites
    .map((s) => {
      const site = s.domain || s.repo.replace(/^FFC-EX-/, '')
      const reason = s.staleReason || 'monitoring stopped'
      const runLink = s.smoke?.runUrl ? `[latest run](${s.smoke.runUrl})` : '_no run_'
      return `| \`${s.repo}\` | ${site} | ${reason} | ${runLink} |`
    })
    .join('\n')

  return [
    MANAGED_MARKER,
    '',
    '## Fleet smoke monitoring has stopped',
    '',
    'The daily Post-Deploy Smoke Test has not run recently on the sites below,',
    'or their smoke workflow is no longer `active`. GitHub auto-disables',
    'scheduled workflows after 60 days of repo inactivity, so a site can go dark',
    'while its last tile still reads green. Re-enable the workflow (Actions tab →',
    'the disabled workflow → **Enable workflow**) or push a commit to wake it.',
    '',
    '| Repo | Site | Why | Run |',
    '| ---- | ---- | --- | --- |',
    rows,
    '',
    `_Auto-managed by \`scripts/report-stale-monitors.mjs\`; closes itself when every site resumes. Snapshot generated ${generatedAt}._`,
  ].join('\n')
}

function readStaleData() {
  const raw = JSON.parse(readFileSync(DATA, 'utf8'))
  const sites = Array.isArray(raw.sites) ? raw.sites : []
  return {
    generatedAt: raw.generatedAt || new Date().toISOString(),
    staleSites: sites.filter((s) => s.state === 'stale-monitor'),
  }
}

/**
 * Locate the managed issue by its hidden body marker — identity is the marker,
 * NOT the label. Fast path filters by the `smoke-failure` label (cheap, always
 * consistent); if that misses (e.g. the label was manually stripped) it falls
 * back to a label-independent body search so the issue is never orphaned into a
 * duplicate. `gh` is the caller's request helper.
 */
async function findManagedIssue(gh, owner, repo) {
  const hasMarker = (i) => i && !i.pull_request && (i.body || '').includes(MANAGED_MARKER)

  const labeled =
    (await gh(
      `/repos/${owner}/${repo}/issues?state=open&labels=${encodeURIComponent('smoke-failure')}&per_page=100`
    )) || []
  const viaLabel = labeled.find(hasMarker)
  if (viaLabel) return viaLabel

  const q = `repo:${owner}/${repo} is:issue is:open in:body "${MARKER_SLUG}"`
  const searched = await gh(`/search/issues?q=${encodeURIComponent(q)}&per_page=20`)
  return (searched?.items || []).find(hasMarker) || null
}

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (!token) {
    console.warn('No GITHUB_TOKEN; skipping stale-monitor issue upsert.')
    return
  }
  const slug = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
  const [owner, repo] = slug.split('/')

  // `okStatuses` lists extra non-2xx codes to tolerate for a specific call
  // (only used for label creation, where 422 means "already exists"). Every
  // other call surfaces a non-2xx as an error so issue create/update/close
  // failures are never silently swallowed.
  async function gh(path, init = {}, okStatuses = []) {
    const res = await fetch(`https://api.github.com${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${token}`,
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers || {}),
      },
    })
    if (!res.ok && !okStatuses.includes(res.status)) {
      throw new Error(`GitHub API ${init.method || 'GET'} ${path} -> ${res.status}`)
    }
    const text = await res.text()
    return text ? JSON.parse(text) : null
  }

  const { generatedAt, staleSites } = readStaleData()
  console.log(`${staleSites.length} stale-monitor site(s).`)

  const managed = await findManagedIssue(gh, owner, repo)

  if (staleSites.length === 0) {
    if (managed) {
      await gh(`/repos/${owner}/${repo}/issues/${managed.number}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          body: '✅ Every fleet site has resumed smoke monitoring — auto-closing.',
        }),
      })
      await gh(`/repos/${owner}/${repo}/issues/${managed.number}`, {
        method: 'PATCH',
        body: JSON.stringify({ state: 'closed', state_reason: 'completed' }),
      })
      console.log(`Closed recovered issue #${managed.number}.`)
    } else {
      console.log('No stale sites and no managed issue — nothing to do.')
    }
    return
  }

  // Ensure the labels exist (idempotent; 422 == already there, tolerated only
  // for these two label-create calls).
  await gh(
    `/repos/${owner}/${repo}/labels`,
    { method: 'POST', body: JSON.stringify({ name: 'smoke-failure', color: 'b60205' }) },
    [422]
  )
  await gh(
    `/repos/${owner}/${repo}/labels`,
    { method: 'POST', body: JSON.stringify({ name: 'priority: high', color: 'd93f0b' }) },
    [422]
  )

  const title = issueTitle(staleSites)
  const body = buildIssueBody(staleSites, generatedAt)

  if (managed) {
    await gh(`/repos/${owner}/${repo}/issues/${managed.number}`, {
      method: 'PATCH',
      body: JSON.stringify({ title, body }),
    })
    // Re-assert the contract labels (additive — POST .../labels never removes
    // human-added ones) so a manually stripped label is restored and the
    // label-filtered lookup keeps finding this issue next run.
    await gh(`/repos/${owner}/${repo}/issues/${managed.number}/labels`, {
      method: 'POST',
      body: JSON.stringify({ labels: LABELS }),
    })
    console.log(`Updated managed issue #${managed.number}.`)
  } else {
    const created = await gh(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({ title, body, labels: LABELS }),
    })
    console.log(`Created managed issue #${created?.number}.`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.warn(`stale-monitor report failed: ${err.message}`)
  })
}
