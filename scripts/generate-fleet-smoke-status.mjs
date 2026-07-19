#!/usr/bin/env node
/**
 * Generate public/data/fleet-smoke-status.json (FFC-Cloudflare-Automation#738).
 *
 * Sweeps every non-archived FFC-EX-* repo (plus the two site templates) and
 * records the latest "Post-Deploy Smoke Test" run, whether the site is cut
 * over (public/CNAME present), and any open auto-managed smoke-failure issue.
 * The static /fleet-status page renders this as per-site green/red tiles.
 *
 * All data read here is public; auth is the workflow's built-in GITHUB_TOKEN
 * (rate limit only). If the token or network is unavailable it leaves the
 * existing file untouched and exits 0 so the pipeline degrades gracefully.
 */
import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'data', 'fleet-smoke-status.json')

const ORG = 'FreeForCharity'
const SMOKE_WORKFLOW_NAME = 'Post-Deploy Smoke Test'
const EXTRA_REPOS = ['FFC-IN-FFC_Single_Page_Template', 'FFC-IN-Footer_Only_Template']
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

async function siteStatus(repo) {
  const [cname, runs, issues] = await Promise.all([
    ghJson(`/repos/${ORG}/${repo}/contents/public/CNAME`).catch(() => null),
    ghJson(`/repos/${ORG}/${repo}/actions/runs?per_page=10`).catch(() => null),
    ghJson(`/repos/${ORG}/${repo}/issues?state=open&labels=smoke-failure&per_page=1`).catch(
      () => null
    ),
  ])

  const domain = cname?.content
    ? Buffer.from(cname.content, 'base64').toString('utf8').trim()
    : null
  const run = (runs?.workflow_runs || []).find((r) => r.name === SMOKE_WORKFLOW_NAME) || null
  const issue = Array.isArray(issues) && issues[0] ? issues[0] : null

  // Tile state, most specific first. A repo with no CNAME is "not cut over"
  // regardless of run history (the v2 engine skips those neutrally anyway).
  let state = 'unknown'
  if (!domain) state = 'not-cutover'
  else if (run && (run.status === 'in_progress' || run.status === 'queued')) state = 'running'
  else if (run?.conclusion === 'success') state = 'passing'
  else if (run?.conclusion === 'failure') state = 'failing'
  else if (!run) state = 'pending' // cut over, engine present, no run yet

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
    failureIssue: issue ? { number: issue.number, url: issue.html_url } : null,
  }
}

async function main() {
  if (!token) {
    console.warn('No GITHUB_TOKEN; leaving fleet-smoke-status.json unchanged.')
    return
  }

  const repos = await listFleetRepos()
  console.log(`Sweeping ${repos.length} repos…`)

  const sites = []
  // Small batches: ~4 API calls per repo across a ~60-repo fleet.
  const BATCH = 8
  for (let i = 0; i < repos.length; i += BATCH) {
    const chunk = await Promise.all(
      repos.slice(i, i + BATCH).map((r) =>
        siteStatus(r).catch((err) => {
          console.warn(`${r}: ${err.message}`)
          return { repo: r, domain: null, state: 'unknown', smoke: null, failureIssue: null }
        })
      )
    )
    sites.push(...chunk)
  }

  const summary = { passing: 0, failing: 0, running: 0, 'not-cutover': 0, pending: 0, unknown: 0 }
  for (const s of sites) summary[s.state] = (summary[s.state] || 0) + 1

  const out = {
    generatedAt: new Date().toISOString(),
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
    `Wrote ${OUT}: ${sites.length} sites (${summary.passing} passing, ${summary.failing} failing, ${summary['not-cutover']} not cut over)`
  )
}

main().catch((err) => {
  // Degrade gracefully: keep the previous committed file rather than failing
  // the whole data-refresh pipeline on a transient API error.
  console.warn(`fleet-smoke-status generation failed: ${err.message}`)
})
