/**
 * Shared intake-issue plumbing: given a list of PII-safe application records,
 * create one `kind:intake` issue per new applicant and persist a non-PII dedup
 * state file. Used by both the local WHMCS intake (`whmcs-applications.mjs`) and
 * the published-feed consumer (`sync-applications.mjs`) so the dedup, body, and
 * labelling stay identical regardless of where applications come from.
 *
 * An "application record" is the PII-safe shape:
 *   { id, charityName, serviceTier?, missionExcerpt?, status?, submittedAt? }
 * `id` must be stable and non-PII — it is the dedup key.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

export const ID_MARKER = 'ffc-application-id'

/** Normalize a thrown value to a string — `err` isn't guaranteed to be an Error. */
export const errMsg = (err) => (err instanceof Error ? err.message : String(err))

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

export function labelsFor(app) {
  const status = VALID_STATUSES.has(app.status) ? app.status : 'intake'
  return ['kind:intake', `status:${status}`]
}

export function loadState(stateFile) {
  if (!existsSync(stateFile)) return { lastSyncedAt: null, seenApplicationIds: [] }
  try {
    return JSON.parse(readFileSync(stateFile, 'utf8'))
  } catch {
    return { lastSyncedAt: null, seenApplicationIds: [] }
  }
}

export function writeState(stateFile, seen) {
  mkdirSync(dirname(stateFile), { recursive: true })
  writeFileSync(
    stateFile,
    `${JSON.stringify(
      { lastSyncedAt: new Date().toISOString(), seenApplicationIds: [...seen].sort() },
      null,
      2
    )}\n`
  )
}

/** Minimal GitHub REST helper bound to a token. */
export function makeGh(token) {
  return async function gh(path, init = {}) {
    const res = await fetch(`https://api.github.com${path}`, {
      ...init,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${token}`,
        ...(init.headers || {}),
      },
    })
    if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`)
    return res.json()
  }
}

/**
 * Build the stub issue body. The leading block is a human-facing welcome plus
 * the dedup marker; the issue-form parser drops that preamble (it has no `###`
 * heading) and reads the structured fields below. Pre-filling the fields we know
 * from the application makes the readiness engine + roadmap card show an
 * accurate charity status, mission, and tier instead of empty defaults.
 */
export function stubBody(app, repo) {
  const name = app.charityName || 'your charity'
  const tier = app.serviceTier ? `\n\n**Service requested:** ${app.serviceTier}` : ''
  const lines = [
    `_Auto-created from an FFC application for **${name}**._${tier}`,
    '',
    'Welcome to Free For Charity! Complete or correct your structured intake with the',
    `[charity intake form](https://github.com/${repo}/issues/new?template=charity-intake.yml),`,
    'or reply here and an FFC admin will help. Your charity already appears on the',
    '[public roadmap](https://ffcadmin.org/roadmap) — completing intake raises your readiness score.',
    '',
    'Not comfortable with GitHub? Text **520-222-8104**.',
    '',
    `<!-- ${ID_MARKER}: ${app.id} -->`,
    '',
  ]
  const field = (label, value) => {
    const v = String(value ?? '').trim()
    if (v) lines.push(`### ${label}`, '', v, '')
  }
  field('Charity name', app.charityName)
  field('Charity status', app.charityStatusOption)
  field('Brief mission', app.missionExcerpt)
  field('EIN', app.ein)
  field('Candid / GuideStar profile URL', app.candidUrl)
  return `${lines.join('\n').trimEnd()}\n`
}

/** A bot-created stub we may safely refresh (vs. an issue a human has edited). */
function isRefreshableStub(issue) {
  const login = issue?.user?.login || ''
  return (
    (login === 'github-actions' || login === 'github-actions[bot]') &&
    typeof issue.body === 'string' &&
    issue.body.includes(ID_MARKER) &&
    issue.body.includes('Auto-created from an FFC')
  )
}

/**
 * Create `kind:intake` issues for any applications not already seen.
 *
 * Dedup is two-layered: the non-PII state file (fast path) and an issue-search
 * for the `ffc-application-id` marker (survives a state reset). Writes state /
 * returns `changed: true` only when something actually changed, so a daily run
 * with no new applicants produces no churn.
 */
export async function syncIntakeIssues({ applications, repo, token, stateFile, source }) {
  if (!token) {
    console.warn('No GITHUB_TOKEN; cannot create issues. Skipping.')
    return { created: 0, changed: false }
  }
  const gh = makeGh(token)
  const state = loadState(stateFile)
  const seen = new Set(state.seenApplicationIds || [])

  const findIssueForId = async (id) => {
    const q = encodeURIComponent(
      `repo:${repo} is:issue label:kind:intake in:body "${ID_MARKER}: ${id}"`
    )
    const result = await gh(`/search/issues?q=${q}`)
    return result.items?.[0] ?? null
  }

  let created = 0
  let updated = 0
  for (const app of applications) {
    const id = String(app.id ?? '').trim()
    if (!id) continue
    try {
      const title = `[Intake] ${app.charityName || id}`
      const body = stubBody(app, repo)
      const existing = await findIssueForId(id)
      if (existing) {
        // Refresh the body when our application data has changed, but never
        // clobber an issue a human (or the applicant) has edited.
        if (isRefreshableStub(existing) && (existing.body !== body || existing.title !== title)) {
          await gh(`/repos/${repo}/issues/${existing.number}`, {
            method: 'PATCH',
            body: JSON.stringify({ title, body }),
          })
          updated++
        }
        seen.add(id)
        continue
      }
      await gh(`/repos/${repo}/issues`, {
        method: 'POST',
        body: JSON.stringify({ title, body, labels: labelsFor(app) }),
      })
      seen.add(id)
      created++
    } catch (err) {
      console.warn(`Skipping application ${id}: ${errMsg(err)}`)
    }
  }

  const changed = created > 0 || updated > 0
  if (changed) {
    writeState(stateFile, seen)
    console.log(`Intake sync: ${created} created, ${updated} updated; state updated.`)
  } else {
    console.log('Intake sync: no changes.')
  }
  return { created, updated, changed }
}
