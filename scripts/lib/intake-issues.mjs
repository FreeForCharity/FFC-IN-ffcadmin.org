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

function stubBody(app, repo, source) {
  const name = app.charityName || 'your charity'
  const tier = app.serviceTier ? `\n\n**Service requested:** ${app.serviceTier}` : ''
  const origin = source
    ? `_Auto-created from an FFC ${source} application for **${name}**._${tier}`
    : `_Auto-created from an FFC application for **${name}**._${tier}`
  return [
    origin,
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

  const issueExistsForId = async (id) => {
    const q = encodeURIComponent(
      `repo:${repo} is:issue label:kind:intake in:body "${ID_MARKER}: ${id}"`
    )
    const result = await gh(`/search/issues?q=${q}`)
    return (result.total_count ?? 0) > 0
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
          body: stubBody(app, repo, source),
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
    writeState(stateFile, seen)
    console.log(`Intake sync: ${created} stub issue(s) created; state updated.`)
  } else {
    console.log('Intake sync: no new applications; state unchanged.')
  }
  return { created, changed }
}
