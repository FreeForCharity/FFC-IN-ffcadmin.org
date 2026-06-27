#!/usr/bin/env node
/**
 * Create charity-intake stub issues from the applications feed published by the
 * repo that owns the WHMCS / Zeffy "flows" (FreeForCharity/FFC-Cloudflare-Automation).
 *
 * FFCadmin deliberately holds NO WHMCS/Zeffy credentials. The flow-owning repo
 * runs the GitHub Actions that have that access, extracts the real applicants,
 * and publishes a PII-safe `applications.json` (the same way it already
 * publishes `sites-list`). This script just reads that public file and opens a
 * `kind:intake` issue per new applicant; downstream, build-roadmap-data scores
 * and renders those issues on the public roadmap.
 *
 * Product gating and PII stripping happen UPSTREAM in the publishing repo: the
 * feed must contain only genuine applicants (the right WHMCS product / Zeffy
 * application form) and carry NO raw emails — only a stable non-PII application
 * id, org name, service tier, and an optional lifecycle status.
 *
 * Auth: built-in GITHUB_TOKEN (to create issues) — no Zeffy/WHMCS secret here.
 * Graceful: a missing/unpublished feed (404) or empty list is a no-op. State is
 * written (and a PR opened) only when something changed, so the daily run with
 * no new applicants produces no churn.
 *
 * Run: node scripts/sync-applications.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, '..', 'automation', 'applications-sync-state.json')
const ID_MARKER = 'ffc-application-id'

/** Normalize a thrown value to a string — `err` isn't guaranteed to be an Error. */
const errMsg = (err) => (err instanceof Error ? err.message : String(err))

const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const feedUrl =
  process.env.APPLICATIONS_SRC_URL ||
  'https://raw.githubusercontent.com/FreeForCharity/FFC-Cloudflare-Automation/main/applications/applications.json'

function loadState() {
  if (!existsSync(STATE_FILE)) return { lastSyncedAt: null, seenApplicationIds: [] }
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'))
  } catch {
    return { lastSyncedAt: null, seenApplicationIds: [] }
  }
}

function writeState(seen) {
  mkdirSync(dirname(STATE_FILE), { recursive: true })
  writeFileSync(
    STATE_FILE,
    `${JSON.stringify({ lastSyncedAt: new Date().toISOString(), seenApplicationIds: [...seen].sort() }, null, 2)}\n`
  )
}

async function fetchApplications() {
  const res = await fetch(feedUrl, { headers: { Accept: 'application/json' } })
  if (res.status === 404) {
    console.warn(`Applications feed not published yet (${feedUrl}); nothing to do.`)
    return []
  }
  if (!res.ok) throw new Error(`applications feed -> ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : Array.isArray(data?.applications) ? data.applications : []
}

async function gh(path, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${ghToken}`,
      ...(init.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`)
  return res.json()
}

/** Idempotency across state resets: look for the application-id marker in a body. */
async function issueExistsForId(id) {
  const q = encodeURIComponent(`repo:${repo} is:issue label:kind:intake in:body "${ID_MARKER}: ${id}"`)
  const result = await gh(`/search/issues?q=${q}`)
  return (result.total_count ?? 0) > 0
}

const VALID_STATUSES = new Set([
  'intake',
  'needs-info',
  'needs-admin',
  'active-build',
  'sponsored',
  'live',
  'on-hold',
  'graduated',
])

function labelsFor(app) {
  const status = VALID_STATUSES.has(app.status) ? app.status : 'intake'
  return ['kind:intake', `status:${status}`]
}

function stubBody(app) {
  const name = app.charityName || 'your charity'
  const tier = app.serviceTier ? `\n\n**Service requested:** ${app.serviceTier}` : ''
  return [
    `_Auto-created from an FFC application (published by FFC-Cloudflare-Automation) for **${name}**._${tier}`,
    '',
    'Welcome to Free For Charity! Please complete your structured intake by editing this issue',
    `with the [charity intake form](https://github.com/${repo}/issues/new?template=charity-intake.yml),`,
    'or reply here and an FFC admin will help. Your charity already appears on the',
    '[public roadmap](https://ffcadmin.org/roadmap) — completing intake raises your readiness score.',
    '',
    'Not comfortable with GitHub? Text **520-222-8104**.',
    '',
    `<!-- ${ID_MARKER}: ${app.id} -->`,
  ].join('\n')
}

async function main() {
  if (!ghToken) {
    console.warn('No GITHUB_TOKEN; cannot create issues. Skipping.')
    return
  }

  const state = loadState()
  const seen = new Set(state.seenApplicationIds || [])
  let applications = []
  try {
    applications = await fetchApplications()
  } catch (err) {
    console.warn(`Applications fetch failed: ${errMsg(err)}. Leaving state unchanged.`)
    return
  }

  let created = 0
  let changed = false
  for (const app of applications) {
    const id = String(app.id ?? '').trim()
    if (!id || seen.has(id)) continue
    try {
      if (await issueExistsForId(id)) {
        seen.add(id)
        changed = true
        continue
      }
      await gh(`/repos/${repo}/issues`, {
        method: 'POST',
        body: JSON.stringify({
          title: `[Intake] ${app.charityName || id}`,
          body: stubBody(app),
          labels: labelsFor(app),
        }),
      })
      seen.add(id)
      changed = true
      created++
    } catch (err) {
      console.warn(`Skipping application ${id}: ${errMsg(err)}`)
    }
  }

  if (changed) {
    writeState(seen)
    console.log(`Applications sync: ${created} stub issue(s) created; state updated.`)
  } else {
    console.log('Applications sync: no new applications; state unchanged.')
  }
}

main().catch((err) => {
  console.warn(`Applications sync skipped: ${errMsg(err)}`)
})
