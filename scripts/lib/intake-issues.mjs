/**
 * Shared intake-issue plumbing: given a list of PII-safe application records
 * (approved charities), create one `kind:intake` issue — the
 * website-provisioning work order — per new one and persist a non-PII dedup
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
// The site-config bridge (Gate 3): pure transform + validator, no CLI side
// effects on import (its main() is guarded by an argv check).
import { buildSiteConfigPartial, validateApplication } from '../generate-footer-config.mjs'

export const ID_MARKER = 'ffc-application-id'

/**
 * The work-order cutover date (shared default for `createNewSince`): services
 * whose application predates it never get a FIRST-TIME issue unless they were
 * observed Pending after the cutover (see `pendingIds`) or already have an
 * issue. Override via WHMCS_INTAKE_SINCE (YYYY-MM-DD).
 */
export const DEFAULT_CREATE_NEW_SINCE = '2026-07-11'

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
  // Sync-created work orders exist only for APPROVED charities (the WHMCS
  // service is Active), so the default lifecycle label is status:needs-admin —
  // "approved; waiting for a sponsoring admin", which the pipeline/roadmap map
  // to the "approved" stage. status:intake would misfile an approved charity
  // as "application under review".
  const status = VALID_STATUSES.has(app.status) ? app.status : 'needs-admin'
  return ['kind:intake', `status:${status}`]
}

export function loadState(stateFile) {
  const empty = { lastSyncedAt: null, seenApplicationIds: [], pendingSeenIds: [] }
  if (!existsSync(stateFile)) return empty
  try {
    const parsed = JSON.parse(readFileSync(stateFile, 'utf8'))
    return {
      lastSyncedAt: parsed.lastSyncedAt ?? null,
      seenApplicationIds: parsed.seenApplicationIds || [],
      // Older state files predate the pending tracking; default to empty.
      pendingSeenIds: parsed.pendingSeenIds || [],
    }
  } catch {
    return empty
  }
}

export function writeState(stateFile, seen, pendingSeen = new Set()) {
  mkdirSync(dirname(stateFile), { recursive: true })
  writeFileSync(
    stateFile,
    `${JSON.stringify(
      {
        lastSyncedAt: new Date().toISOString(),
        seenApplicationIds: [...seen].sort(),
        // Application ids observed as Pending in WHMCS since the cutover: when
        // one of these later turns Active (approved), it gets a work order even
        // though its application DATE predates the flood-guard cutoff.
        pendingSeenIds: [...pendingSeen].sort(),
      },
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
 * The objective Gate-3 "website validated" checklist (docs Section 4b),
 * embedded unticked in every work-order stub so the sponsoring admin ticks the
 * boxes on the issue itself (and the charity ticks the final content-review
 * box). Exported for unit testing.
 */
export const VALIDATION_CHECKLIST = [
  "CI green on the charity's FFC-EX repo (latest default-branch run passing)",
  'Site loads at its GitHub Pages URL (HTTP 200, no redirect loops)',
  'FFC-standard footer present and populated from the approved application data (org legal name, EIN, policy links, social links)',
  'All required sections/pages present per the chosen template',
  'Mobile responsive (spot-check at 375px — no horizontal scroll, nav usable)',
  'No browser console errors on any page',
  'Accessibility pass (axe clean or Lighthouse accessibility score ≥ 90)',
  'Content reviewed and approved by the charity',
]

// The auto-attached site-config block is identified by this exact <summary>
// text — the extractor below greps for it, so keep builder and regex in sync.
const CONFIG_ATTACHMENT_SUMMARY = 'Generated site.config partial (from validated application data)'
const CONFIG_ATTACHMENT_RE = new RegExp(
  `<details><summary>${CONFIG_ATTACHMENT_SUMMARY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</summary>[\\s\\S]*?</details>`
)

/**
 * The issue-form heading the attachment lives under. CRITICAL: the attachment
 * must sit under its OWN `### ` heading — `parseIssueForm` (the roadmap
 * generator's field parser) splits fields on `\n### `, so a block appended
 * directly after a data field's value becomes part of THAT FIELD. That exact
 * bug once glued the whole ~2KB attachment onto the Candid-URL field and
 * published a percent-encoded blob to public/data/roadmap.json (#697 block 8).
 */
export const CONFIG_ATTACHMENT_HEADING = 'Generated site config'
const CONFIG_ATTACHMENT_HEADING_RE = new RegExp(`^###\\s+${CONFIG_ATTACHMENT_HEADING}\\s*$`, 'im')

/**
 * One-line staleness note the daily refresh maintains inside a carried-over
 * attachment: the block is generated once at creation and never regenerated,
 * so after any refresh its data may lag the fields around it.
 */
export const ATTACHMENT_STALENESS_NOTE =
  '_Generated at issue creation from then-current WHMCS data; the refreshed data fields on this issue may be newer — regenerate via `node scripts/generate-footer-config.mjs` if the application data changed._'

/**
 * Ensure a carried-over attachment carries the staleness note (idempotent:
 * an attachment that already has it is returned unchanged, so the refresh
 * causes exactly one migration PATCH and no churn afterwards). Exported for
 * unit testing.
 */
export function withStalenessNote(attachment) {
  const block = String(attachment ?? '').trim()
  if (!block || block.includes(ATTACHMENT_STALENESS_NOTE)) return block
  // Insert directly after the opening <summary> line; a block a volunteer
  // rewrote beyond recognition (no summary line) is left untouched.
  return block.replace(/(<\/summary>\n?)/, `$1\n${ATTACHMENT_STALENESS_NOTE}\n`)
}

/**
 * Build the collapsed site-config attachment for a NEW work-order issue: the
 * SiteConfig partial generated from the validated application record by the
 * footer bridge (scripts/generate-footer-config.mjs), plus the manual-fields
 * checklist. Fail-open per record: when the record fails the bridge's
 * validation, the block carries the failure list instead — the volunteer sees
 * exactly which onboarding gaps to chase in WHMCS rather than a silent gap.
 * Deliberately timestamp-free so the attachment is deterministic for a given
 * record. Exported for unit testing.
 */
export function configAttachment(app, repo) {
  const open = [`<details><summary>${CONFIG_ATTACHMENT_SUMMARY}</summary>`, '']
  const close = ['', '</details>']
  const bridgeDoc = `https://github.com/${repo}/blob/main/docs/footer-bridge.md`
  let problems = validateApplication(app)
  if (problems.length === 0) {
    let partial
    try {
      partial = buildSiteConfigPartial(app)
    } catch (err) {
      problems = [errMsg(err)] // fail open: attach the reason, never abort the create
    }
    if (partial) {
      return [
        ...open,
        "_Transcribe into the charity repo's `src/lib/site.config.ts` (key names and nesting_",
        `_match one-for-one). See [footer-bridge.md](${bridgeDoc}); never change or drop \`supportedBy\`._`,
        '',
        '```json',
        JSON.stringify(partial.siteConfig, null, 2),
        '```',
        '',
        'Manual fields: the application cannot supply these — fill each by hand:',
        '',
        ...partial.manualFields.map((f) => `- \`${f.key}\` — ${f.note}`),
        ...close,
      ].join('\n')
    }
  }
  return [
    ...open,
    'config not generatable — missing:',
    '',
    ...problems.map((p) => `- ${p}`),
    '',
    '_These are onboarding gaps: complete them in WHMCS (see_',
    `_[footer-bridge.md](${bridgeDoc})), then regenerate with_`,
    '_`node scripts/generate-footer-config.mjs` — never guess values._',
    ...close,
  ].join('\n')
}

/**
 * Pull the auto-attached site-config block out of an existing issue body ('' if
 * absent). The daily refresh carries it over VERBATIM — including any edits a
 * volunteer made inside it — because the attachment is generated once, at issue
 * creation, and never regenerated. Exported for unit testing.
 */
export function extractConfigAttachment(body) {
  const m = String(body ?? '').match(CONFIG_ATTACHMENT_RE)
  return m ? m[0] : ''
}

/**
 * Build the stub issue body. The leading block is a human-facing welcome plus
 * the dedup marker; the issue-form parser drops that preamble (it has no `###`
 * heading) and reads the structured fields below. Pre-filling the fields we know
 * from the application makes the readiness engine + roadmap card show an
 * accurate charity status, mission, and tier instead of empty defaults.
 *
 * `attachment` (optional) is a pre-built site-config <details> block (see
 * configAttachment): the creation path generates it fresh; the refresh path
 * passes through whatever block the existing issue already carries.
 */
export function stubBody(app, repo, { attachment = '' } = {}) {
  const name = app.charityName || 'your charity'
  const tier = app.serviceTier ? `\n\n**Service requested:** ${app.serviceTier}` : ''
  const lines = [
    `_Auto-created from an FFC application for **${name}**. This issue is the_`,
    `_**website-provisioning work order** for an approved charity._${tier}`,
    '',
    'Welcome to Free For Charity! Your application has been approved — this issue tracks your',
    'website build. Complete or correct your structured intake with the',
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
  // Self-attested mission tier (WHMCS dropdown). Written as the canonical intake
  // option so parseIntakeIssue uses it directly instead of guessing from text.
  field('Mission category', app.missionCategoryOption)
  field('Brief mission', app.missionExcerpt)
  field('EIN', app.ein)
  field('Candid / GuideStar profile URL', app.candidUrl)
  // Collapsed site-config attachment (creation-time only; carried over on
  // refresh). Sits BETWEEN the data fields and the validation checklist so
  // the volunteer-owned validation block stays last (see hasHumanEdits) —
  // and under its OWN `### ` heading so parseIssueForm reads it as a separate
  // field instead of folding it into the preceding Candid-URL value (see
  // CONFIG_ATTACHMENT_HEADING).
  if (attachment) lines.push(`### ${CONFIG_ATTACHMENT_HEADING}`, '', String(attachment).trim(), '')
  // Gate-3 validation checklist (docs Section 4b): the work order carries the
  // checklist where the sponsoring admin ticks it. Keep this block LAST — the
  // human-edit detector treats everything from its heading onward as the
  // volunteer-owned validation block.
  lines.push(
    '### Validation checklist (Gate 3)',
    '',
    '_All boxes ticked = **validated** → the charity may order its domain. Objective definition:_',
    `_[prerequisites inventory, Section 4b](https://github.com/${repo}/blob/main/docs/application-prerequisites-inventory.md#4b-the-website-validated-checklist-gate-3-definition)._`,
    '_The sponsoring admin ticks each box as it passes; the charity ticks the final content-review box._',
    '',
    ...VALIDATION_CHECKLIST.map((item) => `- [ ] ${item}`),
    '',
    // The exact "Live site:" format the roadmap generator's liveUrlFrom() greps.
    // The placeholder deliberately contains no http(s) URL, so the pipeline's
    // "validated" stage only lights up once a real URL replaces it.
    'Live site: (paste the https GitHub Pages URL here once the site loads)',
    ''
  )
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

/** Everything from the Gate-3 validation heading onward (volunteer-owned). */
const VALIDATION_BLOCK_RE = /^#{2,4} Validation checklist[\s\S]*$/m
const stripValidationBlock = (body) => String(body).replace(VALIDATION_BLOCK_RE, '')
const validationBlock = (body) => (String(body).match(VALIDATION_BLOCK_RE) || [''])[0].trimEnd()

/**
 * Drop the site-config attachment (its heading + <details> block) from a body.
 * The attachment is bot-generated and carried over mechanically on refresh, so
 * it must never count toward the human-edit skeleton — and stripping it lets
 * pre-heading bodies (attachment glued after the Candid field, the #697
 * block-8 bug) migrate to the own-heading placement on their next refresh
 * instead of being frozen as "human-edited".
 */
function stripConfigAttachment(body) {
  return String(body)
    .replace(CONFIG_ATTACHMENT_RE, '')
    .replace(CONFIG_ATTACHMENT_HEADING_RE, '')
    .replace(/\n{3,}/g, '\n\n')
}

/**
 * Reduce a stub body to its data-independent skeleton: field values, the
 * charity name/tier interpolations, and the id marker are normalized, and the
 * volunteer-owned validation block and bot-owned site-config attachment are
 * dropped. Two bodies generated by `stubBody` from different application data
 * share a skeleton; a human adding or removing lines changes it.
 */
function stubSkeleton(body) {
  return stripValidationBlock(stripConfigAttachment(String(body).replace(/\r\n/g, '\n')))
    .replace(/application for \*\*[^*]+\*\*/, 'application for **NAME**')
    .replace(/\*\*Service requested:\*\* [^\n]*/, '**Service requested:** TIER')
    .replace(new RegExp(`<!-- ${ID_MARKER}: [^>]+ -->`), `<!-- ${ID_MARKER}: ID -->`)
    .replace(/(^### [^\n]+\n\n)[^\n]*/gm, '$1VALUE')
    .trimEnd()
}

/**
 * True when the existing issue body carries human work the daily refresh must
 * never clobber: a ticked validation checkbox, a filled "Live site:" URL, or
 * any structural edit outside the data fields. Exported for unit testing.
 */
export function hasHumanEdits(existingBody, freshBody) {
  const existing = String(existingBody ?? '')
  // A ticked checkbox anywhere is human progress (e.g. the Gate-3 checklist).
  if (/- \[[xX]\]/.test(existing)) return true
  // A filled "Live site:" URL is the volunteer recording validation.
  if (/^[ \t>*-]*live\s*(?:site|url)\s*[:：]\s*https?:\/\//im.test(existing)) return true
  // The validation block is volunteer-owned and data-independent: once present,
  // ANY divergence from the generated block (edited items, appended notes) is a
  // human edit. An absent block (a pre-checklist stub) is not — that lets old
  // stubs upgrade to gain the checklist on their next data refresh.
  const existingBlock = validationBlock(existing)
  if (existingBlock && existingBlock !== validationBlock(freshBody)) return true
  // Structural drift beyond the data sections = human edit (conservative).
  return stubSkeleton(existing) !== stubSkeleton(freshBody)
}

/**
 * Flood guard for FIRST-TIME issue creation: returns true when the record's
 * `submittedAt` is on/after `sinceIso` (a date like '2026-07-11'). Records with
 * no usable date fail the guard — conservative, so a pile of historical
 * applications without dates can never mass-create issues. An unset/invalid
 * `sinceIso` disables the guard. Exported for unit testing.
 */
export function passesCreationCutoff(app, sinceIso) {
  const cutoff = Date.parse(String(sinceIso || ''))
  if (!Number.isFinite(cutoff)) return true
  const submitted = Date.parse(String(app?.submittedAt || ''))
  return Number.isFinite(submitted) && submitted >= cutoff
}

/**
 * Fetch every `kind:intake` issue once and index it by its embedded
 * `ffc-application-id` marker. One listing call per 100 issues replaces a
 * search-API call per application, and — because it is unconditional — an
 * existing issue is always found even when the dedup state file was lost.
 */
async function fetchIssuesByMarker(gh, repo) {
  const byId = new Map()
  const markerRe = new RegExp(`${ID_MARKER}:\\s*(\\S+?)\\s*-->`)
  for (let page = 1; page <= 20; page++) {
    const batch = await gh(
      `/repos/${repo}/issues?labels=${encodeURIComponent('kind:intake')}&state=all&per_page=100&page=${page}`
    )
    if (!Array.isArray(batch) || batch.length === 0) break
    for (const issue of batch) {
      if (issue.pull_request) continue
      const m = typeof issue.body === 'string' ? issue.body.match(markerRe) : null
      if (m && !byId.has(m[1])) byId.set(m[1], issue)
    }
    if (batch.length < 100) break
  }
  return byId
}

/**
 * Create `kind:intake` website-provisioning work-order issues for any approved
 * applications not already seen, and refresh the stub bodies of existing ones.
 *
 * Order of gates per record (the marker lookup comes FIRST — the flood-guard
 * cutoff only ever guards NEW creation, so charities with existing issues keep
 * being refreshed even after a state-file loss):
 *
 *   1. Existing issue (marker lookup) -> refresh path (unless human-edited).
 *   2. No issue -> creation requires `allowCreate(app)` AND (the record was
 *      observed Pending since the cutover (`pendingIds`/state) OR its
 *      `submittedAt` passes `createNewSince`).
 *
 * `createNewSince` (optional, YYYY-MM-DD) is the first-time-creation flood
 * guard: WHMCS holds hundreds of historical Active services that predate the
 * work-order model and must not mass-create issues. A charity that applied
 * BEFORE the cutover but is approved AFTER it still gets its work order via the
 * pendingSeen mechanism: each run records currently-Pending service ids
 * (`pendingIds`) in the state file, and an Active record whose id was ever seen
 * Pending bypasses the date cutoff.
 *
 * `allowCreate(app)` (optional) gates creation per record — the published-feed
 * path uses it to refuse work orders for records it cannot prove approved.
 *
 * Dedup state is written only when something actually changed, so a daily run
 * with no new applicants produces no churn.
 */
export async function syncIntakeIssues({
  applications,
  repo,
  token,
  stateFile,
  source,
  createNewSince,
  pendingIds = new Set(),
  allowCreate = () => true,
}) {
  if (!token) {
    console.warn('No GITHUB_TOKEN; cannot create issues. Skipping.')
    return { created: 0, changed: false }
  }
  const gh = makeGh(token)
  const state = loadState(stateFile)
  const knownIds = new Set(state.seenApplicationIds || [])
  const knownPending = new Set(state.pendingSeenIds || [])
  const seen = new Set(knownIds)
  const pendingSeen = new Set([...knownPending, ...pendingIds])

  // Marker index of ALL existing intake issues (see fetchIssuesByMarker). If
  // the listing fails we fall back to a per-id search so a transient API error
  // doesn't stop the run.
  let issuesById = null
  try {
    issuesById = await fetchIssuesByMarker(gh, repo)
  } catch (err) {
    console.warn(`Could not list existing intake issues (${errMsg(err)}); using per-id search.`)
  }
  const findIssueForId = async (id) => {
    if (issuesById) return issuesById.get(id) ?? null
    const q = encodeURIComponent(
      `repo:${repo} is:issue label:kind:intake in:body "${ID_MARKER}: ${id}"`
    )
    const result = await gh(`/search/issues?q=${q}`)
    return result.items?.[0] ?? null
  }

  let created = 0
  let updated = 0
  let skippedPreCutoff = 0
  const undatedSkipped = []
  for (const app of applications) {
    const id = String(app.id ?? '').trim()
    if (!id) continue
    try {
      const title = `[Intake] ${app.charityName || id}`
      // Marker lookup FIRST: an existing issue is always refreshed (the cutoff
      // below only guards NEW creation), so pre-cutoff charities keep their
      // refresh behaviour even if the state file is ever lost.
      const existing = await findIssueForId(id)
      if (existing) {
        // Refresh path: NEVER regenerate the site-config attachment — carry
        // whatever block the issue already has (or none) over, so the
        // creation-time attachment (and any volunteer edits inside it) survives
        // data refreshes without producing churn of its own. The only touch is
        // the one-line staleness note (idempotent), flagging that the frozen
        // block may lag the refreshed fields around it.
        const body = stubBody(app, repo, {
          attachment: withStalenessNote(extractConfigAttachment(existing.body)),
        })
        if (isRefreshableStub(existing) && (existing.body !== body || existing.title !== title)) {
          // Never clobber human edits — ticked validation checkboxes, a filled
          // "Live site:" URL, or any structural change survive the refresh.
          if (hasHumanEdits(existing.body, body)) {
            console.log(
              `Intake sync: issue #${existing.number} (${id}) has human edits; skipping body refresh.`
            )
          } else {
            await gh(`/repos/${repo}/issues/${existing.number}`, {
              method: 'PATCH',
              body: JSON.stringify({ title, body }),
            })
            updated++
          }
        }
        seen.add(id)
        continue
      }
      // Flood guard (NEW creation only): allow when the source vouches for the
      // record AND it either postdates the cutover or was observed Pending
      // since the cutover (applied pre-cutoff, approved post-cutoff).
      const allowed = allowCreate(app)
      const eligible = allowed && (pendingSeen.has(id) || passesCreationCutoff(app, createNewSince))
      if (!eligible) {
        skippedPreCutoff++
        if (allowed && !Number.isFinite(Date.parse(String(app?.submittedAt || '')))) {
          undatedSkipped.push(`${app.charityName || '(unnamed)'} (${id})`)
        }
        continue
      }
      // Creation path: the ONE place the site-config attachment is generated
      // (validated partial, or the fail-open gap list for the volunteer).
      const body = stubBody(app, repo, { attachment: configAttachment(app, repo) })
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
  if (skippedPreCutoff > 0) {
    console.log(
      `Intake sync: skipped ${skippedPreCutoff} historical application(s) predating the ` +
        `work-order cutover (${createNewSince}); no issues created for them.`
    )
  }
  if (undatedSkipped.length > 0) {
    // Approved but undated records need a human look: they fail the date cutoff
    // forever, so they must be resolved in WHMCS (or via WHMCS_INTAKE_SINCE).
    console.warn(
      `Intake sync WARNING: ${undatedSkipped.length} approved application(s) have a missing or ` +
        `unparseable submission date and were skipped by the flood guard — review manually: ` +
        undatedSkipped.join(', ')
    )
  }

  // Ids with an issue no longer need pending tracking.
  for (const id of seen) pendingSeen.delete(id)

  // Persist when issues changed OR when the dedup/pending state drifted from
  // reality — e.g. the state file was reset/lost but the matching issues
  // already exist, so `seen` grew without a create/update. Without this the
  // recovered ids would be re-derived on every run and never written back.
  const setsDiffer = (a, b) => a.size !== b.size || [...a].some((x) => !b.has(x))
  const stateDrifted = setsDiffer(seen, knownIds) || setsDiffer(pendingSeen, knownPending)
  const changed = created > 0 || updated > 0
  if (changed || stateDrifted) {
    writeState(stateFile, seen, pendingSeen)
    console.log(
      `Intake sync (${source}): ${created} created, ${updated} updated; state ${
        changed ? 'updated' : 'reconciled'
      }.`
    )
  } else {
    console.log(`Intake sync (${source}): no changes.`)
  }
  return { created, updated, changed }
}
