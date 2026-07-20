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

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (!token) {
    console.warn('No GITHUB_TOKEN; skipping stale-monitor issue upsert.')
    return
  }
  const slug = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
  const [owner, repo] = slug.split('/')

  async function gh(path, init = {}) {
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
    // 422 on label create == already exists; treat as success.
    if (!res.ok && res.status !== 422) {
      throw new Error(`GitHub API ${init.method || 'GET'} ${path} -> ${res.status}`)
    }
    const text = await res.text()
    return text ? JSON.parse(text) : null
  }

  const { generatedAt, staleSites } = readStaleData()
  console.log(`${staleSites.length} stale-monitor site(s).`)

  // Find the existing managed issue (open, labeled smoke-failure, marker in body).
  const open =
    (await gh(
      `/repos/${owner}/${repo}/issues?state=open&labels=${encodeURIComponent('smoke-failure')}&per_page=100`
    )) || []
  const managed =
    open.find((i) => !i.pull_request && (i.body || '').includes(MANAGED_MARKER)) || null

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

  // Ensure the labels exist (idempotent; 422 == already there).
  await gh(`/repos/${owner}/${repo}/labels`, {
    method: 'POST',
    body: JSON.stringify({ name: 'smoke-failure', color: 'b60205' }),
  })
  await gh(`/repos/${owner}/${repo}/labels`, {
    method: 'POST',
    body: JSON.stringify({ name: 'priority: high', color: 'd93f0b' }),
  })

  const title = issueTitle(staleSites)
  const body = buildIssueBody(staleSites, generatedAt)

  if (managed) {
    await gh(`/repos/${owner}/${repo}/issues/${managed.number}`, {
      method: 'PATCH',
      body: JSON.stringify({ title, body }),
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
