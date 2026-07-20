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
  'not-deployed': 0,
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

/**
 * Read a repo's GitHub Pages configuration — the *serving* truth (#742). The
 * committed public/CNAME file is only the build's claim of a domain; the Pages
 * `cname` is what the site is actually served on, and the two can disagree.
 * Returns:
 *   { enabled: true,  cname, htmlUrl, status } — Pages on (cname null when
 *                                                served on the default *.github.io URL).
 *   { enabled: false, ... }                    — Pages disabled (404).
 *   { enabled: null,  ... }                    — could not determine (network /
 *                                                permission / other error).
 * Pages metadata on a public repo is world-readable with the ambient token,
 * like the actions/workflows and actions/runs endpoints this script already
 * reads cross-repo.
 */
async function pagesInfo(repo) {
  try {
    const res = await fetch(`https://api.github.com/repos/${ORG}/${repo}/pages`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (res.status === 404) return { enabled: false, cname: null, htmlUrl: null, status: null }
    if (!res.ok) return { enabled: null, cname: null, htmlUrl: null, status: null }
    const body = await res.json()
    const cname = body?.cname ? String(body.cname).trim() : ''
    return {
      enabled: true,
      cname: cname || null,
      htmlUrl: body?.html_url || null,
      status: body?.status || null,
    }
  } catch {
    return { enabled: null, cname: null, htmlUrl: null, status: null }
  }
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
 * `pagesEnabled` is the serving truth from the Pages API (#742): `true` when
 * Pages is on, `false` when it is disabled (404), and `null`/`undefined` when
 * we could not read the Pages config (treated as unknown, not disabled).
 *
 * `identityUnknown` is true when serving identity could not be determined from
 * either source — the Pages config was unreadable AND there is no committed
 * CNAME file to fall back to. In that case a null `domain` means "we don't
 * know", not "not cut over".
 *
 * Precedence, most specific first:
 *   not-deployed — Pages disabled, nothing is served, so nothing to monitor.
 *   unknown      — serving identity undeterminable (Pages unreadable + no CNAME file).
 *   not-cutover  — no serving domain yet, nothing to monitor.
 *   running      — a run is queued/in progress right now.
 *   stale-monitor — workflow not active (disabled or missing), OR latest run older than 48h.
 *   passing/failing — latest run's conclusion, when recent.
 *   pending      — cut over, workflow known 'active', no run yet.
 *   unknown      — no run and the workflow state is unknown (list unreadable).
 */
export function computeSiteState({
  domain,
  run,
  workflowState,
  pagesEnabled,
  identityUnknown = false,
  now = new Date(),
} = {}) {
  // GitHub Pages disabled — the site is not served, so nothing to monitor.
  // Mirror smoke engine v3's neutral skip. Only a definitive `false` triggers
  // this; `null`/`undefined` (Pages config unreadable) falls through so a
  // transient Pages-read failure never mislabels a live site as not-deployed.
  if (pagesEnabled === false) return { state: 'not-deployed', staleReason: null }

  if (!domain) {
    // No serving domain. Distinguish "genuinely not cut over" (we *could* read
    // the serving identity — it just has no custom domain) from "we couldn't
    // determine it at all" (Pages unreadable AND no committed CNAME to fall
    // back to). The latter can happen on a build-emitted-CNAME repo during a
    // transient Pages-read/rate-limit failure; reporting `unknown` there is
    // more honest than claiming a cut-over site isn't cut over.
    if (identityUnknown) return { state: 'unknown', staleReason: null }
    return { state: 'not-cutover', staleReason: null }
  }
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

  // Only judge staleness by age when we have a finite age. A run object without
  // a usable `updated_at` yields Infinity; rather than render "Infinityh old",
  // fall through to the conclusion-based states below.
  const ageH = hoursSince(run?.updated_at, now)
  if (run && Number.isFinite(ageH) && ageH > STALE_HOURS)
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
  const [cname, issues, workflows, pages] = await Promise.all([
    ghJson(`/repos/${ORG}/${repo}/contents/public/CNAME`).catch(() => null),
    ghJson(`/repos/${ORG}/${repo}/issues?state=open&labels=smoke-failure&per_page=1`).catch(
      () => null
    ),
    // per_page=100 so the smoke workflow is never off-page and mis-flagged
    // 'missing' (default page size is 30). FFC repos have far fewer than 100.
    ghJson(`/repos/${ORG}/${repo}/actions/workflows?per_page=100`).catch(() => null),
    // Serving identity — one bounded Pages call per repo (#742).
    pagesInfo(repo),
  ])

  // The committed public/CNAME file is only the build's *claim* of a domain;
  // keep it as a secondary field so drift from the serving truth stays visible
  // on the page instead of being silently masked (#742 / #740).
  const cnameFile = cname?.content
    ? Buffer.from(cname.content, 'base64').toString('utf8').trim() || null
    : null

  // Primary identity is the Pages `cname` (the serving truth). When Pages is
  // enabled but has no custom domain, `cname` is null — the site serves on its
  // default *.github.io URL, i.e. not yet cut over. When the Pages config could
  // not be read at all (enabled === null) fall back to the committed CNAME file
  // so a transient Pages-read failure degrades to the pre-#742 behaviour rather
  // than blanking the domain. When Pages is disabled (enabled === false) there
  // is no serving domain and computeSiteState resolves it to `not-deployed`.
  const domain = pages.enabled === true ? pages.cname : pages.enabled === null ? cnameFile : null
  // Serving identity is undeterminable only when the Pages config was unreadable
  // (not a definitive 404) AND there is no committed CNAME to fall back to — then
  // a null domain means "we don't know", so computeSiteState reports 'unknown'
  // rather than mislabelling a (possibly cut-over) site as 'not-cutover'.
  const identityUnknown = pages.enabled === null && !cnameFile
  const issue = Array.isArray(issues) && issues[0] ? issues[0] : null

  // workflowState: null when the workflows list couldn't be read (unknown —
  // don't flag stale); 'missing' when it was readable but the smoke workflow is
  // absent; otherwise the workflow's own state ('active', 'disabled_inactivity').
  const workflowsReadable = Array.isArray(workflows?.workflows)
  let workflowState = null
  let smokeWorkflowId = null
  if (workflowsReadable) {
    const smokeWorkflow = workflows.workflows.find((w) => w.name === SMOKE_WORKFLOW_NAME)
    workflowState = smokeWorkflow ? smokeWorkflow.state : 'missing'
    smokeWorkflowId = smokeWorkflow ? smokeWorkflow.id : null
  }

  // Prefer the smoke workflow's *own* runs endpoint: the cross-workflow
  // /actions/runs feed would bury the daily smoke run beneath unrelated CI in a
  // busy repo, dropping the site to pending/unknown and hiding by-age staleness.
  let run = null
  if (smokeWorkflowId) {
    const runs = await ghJson(
      `/repos/${ORG}/${repo}/actions/workflows/${smokeWorkflowId}/runs?per_page=1`
    ).catch(() => null)
    run = runs?.workflow_runs?.[0] || null
  } else if (!workflowsReadable) {
    // Best-effort fallback ONLY when the workflows list itself was unreadable
    // (not when it was readable and the workflow is genuinely 'missing'): recover
    // the latest smoke run from the cross-workflow feed so a transient
    // workflows-list outage doesn't blank the tile or mask real by-age staleness.
    const runs = await ghJson(`/repos/${ORG}/${repo}/actions/runs?per_page=30`).catch(() => null)
    run = (runs?.workflow_runs || []).find((r) => r.name === SMOKE_WORKFLOW_NAME) || null
  }

  const { state, staleReason } = computeSiteState({
    domain,
    run,
    workflowState,
    pagesEnabled: pages.enabled,
    identityUnknown,
    now,
  })

  return {
    repo,
    domain,
    cnameFile,
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
  // Small batches: ~4 API calls per repo (CNAME, issues, workflows, and the
  // smoke workflow's runs) across a ~60-repo fleet.
  const BATCH = 8
  for (let i = 0; i < repos.length; i += BATCH) {
    const chunk = await Promise.all(
      repos.slice(i, i + BATCH).map((r) =>
        siteStatus(r, now).catch((err) => {
          console.warn(`${r}: ${err.message}`)
          return {
            repo: r,
            domain: null,
            cnameFile: null,
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
