#!/usr/bin/env node
/**
 * Generate public/data/fleet-smoke-status.json (FFC-Cloudflare-Automation#738).
 *
 * Sweeps every non-archived FFC-EX-* repo (plus the two site templates) and
 * records the latest "Post-Deploy Smoke Test" run, whether the site is cut
 * over (public/CNAME present), the smoke workflow's enabled/disabled state,
 * and any open auto-managed smoke-failure issue. The static /fleet-status page
 * renders this as per-site green/red tiles.
 *
 * Stale-monitor detection (FFC-Cloudflare-Automation#753): a cut-over site
 * whose latest smoke run is older than 48h — or whose smoke workflow is no
 * longer `active` — is flagged `stale-monitor`. That covers GitHub's 60-day
 * scheduled-workflow auto-disable, broken triggers, and anything else that
 * silently stops the daily pass. The upsert step in the refresh workflow
 * surfaces those sites in one hub issue.
 *
 * All data read here is public; auth is the workflow's built-in GITHUB_TOKEN
 * (rate limit only). If the token or network is unavailable it leaves the
 * existing file untouched and exits 0 so the pipeline degrades gracefully.
 */
import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const OUT = join(SCRIPT_DIR, '..', 'public', 'data', 'fleet-smoke-status.json')

const ORG = 'FreeForCharity'
const SMOKE_WORKFLOW_NAME = 'Post-Deploy Smoke Test'
const EXTRA_REPOS = ['FFC-IN-FFC_Single_Page_Template', 'FFC-IN-Footer_Only_Template']

// A cut-over site whose latest smoke run (or, for a disabled workflow, whose
// monitoring) is older than this is considered "monitoring stopped". Smoke
// runs daily, so 48h leaves a full missed day of buffer before we flag it.
export const STALE_HOURS = 48

// Empty summary shape — every state key present with a 0 count so the page's
// chip loop and the summary object stay in sync with FleetSmokeState.
export const EMPTY_SUMMARY = {
  passing: 0,
  failing: 0,
  running: 0,
  'stale-monitor': 0,
  'not-cutover': 0,
  pending: 0,
  unknown: 0,
}

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

async function ghJson(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`)
  return res.json()
}

async function listFleetRepos() {
  const names = []
  for (let page = 1; page <= 5; page++) {
    const batch = await ghJson(`/orgs/${ORG}/repos?type=public&per_page=100&page=${page}`)
    if (!batch || batch.length === 0) break
    for (const r of batch) {
      if (!r.archived && r.name.startsWith('FFC-EX-')) names.push(r.name)
    }
    if (batch.length < 100) break
  }
  return [...names.sort((a, b) => a.localeCompare(b)), ...EXTRA_REPOS]
}

/** Fractional hours between an ISO timestamp and `now` (null/invalid -> Infinity). */
export function hoursSince(iso, now = new Date()) {
  if (!iso) return Infinity
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return Infinity
  return (now.getTime() - then) / 3_600_000
}

/**
 * Pure tile-state decision (unit-tested). Given the cut-over domain, the latest
 * smoke run, and the smoke workflow's `state`, return the tile state plus a
 * human-readable `staleReason` when monitoring has stopped.
 *
 * `workflowState` is the smoke workflow's `state` ('active' / a GitHub
 * disabled reason such as 'disabled_inactivity'), the sentinel 'missing' when
 * the workflows list was readable but the workflow is absent, or null/undefined
 * when we could not read the workflows list (treated as unknown, not stale).
 *
 * Precedence, most specific first:
 *   not-cutover  — no CNAME, nothing to monitor.
 *   running      — a run is queued/in progress right now.
 *   stale-monitor — workflow not active (disabled or missing), OR latest run older than 48h.
 *   passing/failing — latest run's conclusion, when recent.
 *   pending      — cut over, workflow known 'active', no run yet.
 *   unknown      — no run and the workflow state is unknown (list unreadable).
 */
export function computeSiteState({ domain, run, workflowState, now = new Date() } = {}) {
  if (!domain) return { state: 'not-cutover', staleReason: null }
  if (run && (run.status === 'in_progress' || run.status === 'queued'))
    return { state: 'running', staleReason: null }

  // A smoke workflow that is not `active` — GitHub-disabled (e.g.
  // `disabled_inactivity` after 60 days) or absent from the repo ('missing') —
  // means the daily pass has stopped regardless of run history. Strongest stale
  // signal, so it wins even over a recent passing run. `null`/`undefined` means
  // we could not read the workflows list, so we can't conclude stale here.
  if (workflowState && workflowState !== 'active')
    return {
      state: 'stale-monitor',
      staleReason:
        workflowState === 'missing'
          ? 'no active smoke workflow found in the repo'
          : `smoke workflow is ${workflowState} (not active)`,
    }

  const ageH = hoursSince(run?.updated_at, now)
  if (run && ageH > STALE_HOURS)
    return {
      state: 'stale-monitor',
      // Round up so a just-stale run never reads "48h old (> 48h)".
      staleReason: `latest smoke run is ${Math.ceil(ageH)}h old (> ${STALE_HOURS}h)`,
    }

  if (run?.conclusion === 'success') return { state: 'passing', staleReason: null }
  if (run?.conclusion === 'failure') return { state: 'failing', staleReason: null }
  // No run: only "awaiting first run" when we positively know the workflow is
  // active. If the workflows list was unreadable (workflowState null/undefined)
  // we can't tell a fresh cutover from a transient API failure, so report
  // 'unknown' rather than mislabelling it 'pending'.
  if (!run) return { state: workflowState === 'active' ? 'pending' : 'unknown', staleReason: null }
  return { state: 'unknown', staleReason: null }
}

async function siteStatus(repo, now = new Date()) {
  const [cname, runs, issues, workflows] = await Promise.all([
    ghJson(`/repos/${ORG}/${repo}/contents/public/CNAME`).catch(() => null),
    ghJson(`/repos/${ORG}/${repo}/actions/runs?per_page=10`).catch(() => null),
    ghJson(`/repos/${ORG}/${repo}/issues?state=open&labels=smoke-failure&per_page=1`).catch(
      () => null
    ),
    ghJson(`/repos/${ORG}/${repo}/actions/workflows`).catch(() => null),
  ])

  const domain = cname?.content
    ? Buffer.from(cname.content, 'base64').toString('utf8').trim()
    : null
  const run = (runs?.workflow_runs || []).find((r) => r.name === SMOKE_WORKFLOW_NAME) || null
  const issue = Array.isArray(issues) && issues[0] ? issues[0] : null
  // null when the workflows list couldn't be read (unknown — don't flag stale);
  // 'missing' when it was readable but the smoke workflow is absent; otherwise
  // the workflow's own state ('active', 'disabled_inactivity', …).
  let workflowState = null
  if (Array.isArray(workflows?.workflows)) {
    const smokeWorkflow = workflows.workflows.find((w) => w.name === SMOKE_WORKFLOW_NAME)
    workflowState = smokeWorkflow ? smokeWorkflow.state : 'missing'
  }

  const { state, staleReason } = computeSiteState({ domain, run, workflowState, now })

  return {
    repo,
    domain,
    state,
    smoke: run
      ? {
          status: run.status,
          conclusion: run.conclusion,
          event: run.event,
          runUrl: run.html_url,
          updatedAt: run.updated_at,
        }
      : null,
    smokeWorkflowState: workflowState,
    staleReason,
    failureIssue: issue ? { number: issue.number, url: issue.html_url } : null,
  }
}

async function main() {
  if (!token) {
    console.warn('No GITHUB_TOKEN; leaving fleet-smoke-status.json unchanged.')
    return
  }

  const now = new Date()
  const repos = await listFleetRepos()
  console.log(`Sweeping ${repos.length} repos…`)

  const sites = []
  // Small batches: ~5 API calls per repo across a ~60-repo fleet.
  const BATCH = 8
  for (let i = 0; i < repos.length; i += BATCH) {
    const chunk = await Promise.all(
      repos.slice(i, i + BATCH).map((r) =>
        siteStatus(r, now).catch((err) => {
          console.warn(`${r}: ${err.message}`)
          return {
            repo: r,
            domain: null,
            state: 'unknown',
            smoke: null,
            smokeWorkflowState: null,
            staleReason: null,
            failureIssue: null,
          }
        })
      )
    )
    sites.push(...chunk)
  }

  const summary = { ...EMPTY_SUMMARY }
  for (const s of sites) summary[s.state] = (summary[s.state] || 0) + 1

  const out = {
    generatedAt: now.toISOString(),
    org: ORG,
    repoCount: sites.length,
    summary,
    sites,
  }

  const next = JSON.stringify(out, null, 2) + '\n'
  let prev = ''
  try {
    prev = readFileSync(OUT, 'utf8')
  } catch {
    // first run
  }
  if (prev === next) {
    console.log('No changes.')
    return
  }
  writeFileSync(OUT, next)
  console.log(
    `Wrote ${OUT}: ${sites.length} sites (${summary.passing} passing, ${summary.failing} failing, ${summary['stale-monitor']} stale-monitor, ${summary['not-cutover']} not cut over)`
  )
}

// Only run the sweep when invoked directly (not when imported by unit tests).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    // Degrade gracefully: keep the previous committed file rather than failing
    // the whole data-refresh pipeline on a transient API error.
    console.warn(`fleet-smoke-status generation failed: ${err.message}`)
  })
}
