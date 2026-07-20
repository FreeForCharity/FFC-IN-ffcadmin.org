/**
 * Unit tests for the shared intake-issue plumbing (`scripts/lib/intake-issues.mjs`).
 *
 * Locks in the approval-gated work-order model: the stub body announces itself
 * as the website-provisioning work order for an approved charity and carries
 * the Gate-3 validation checklist, and the `createNewSince` flood guard stops
 * first-time issue creation for historical WHMCS services that predate the
 * cutover — while ids with an existing issue keep their refresh behaviour
 * (marker lookup runs BEFORE the cutoff, so a lost state file cannot silence
 * refreshes) and ids observed Pending since the cutover may create issues once
 * approved. `syncIntakeIssues` is exercised with a mocked `fetch`, so no
 * network or real repo is touched.
 */

import { mkdtempSync, rmSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { parseIssueForm } from '@/lib/readiness/parseIntake'

let stubBody,
  passesCreationCutoff,
  syncIntakeIssues,
  writeState,
  loadState,
  labelsFor,
  hasHumanEdits,
  configAttachment,
  extractConfigAttachment,
  withStalenessNote,
  ID_MARKER,
  CONFIG_ATTACHMENT_HEADING,
  ATTACHMENT_STALENESS_NOTE,
  VALIDATION_CHECKLIST,
  SAMPLE_APPLICATION,
  cleanCandidUrl

beforeAll(async () => {
  const mod = await import('../scripts/lib/intake-issues.mjs')
  stubBody = mod.stubBody
  passesCreationCutoff = mod.passesCreationCutoff
  syncIntakeIssues = mod.syncIntakeIssues
  writeState = mod.writeState
  loadState = mod.loadState
  labelsFor = mod.labelsFor
  hasHumanEdits = mod.hasHumanEdits
  configAttachment = mod.configAttachment
  extractConfigAttachment = mod.extractConfigAttachment
  withStalenessNote = mod.withStalenessNote
  ID_MARKER = mod.ID_MARKER
  CONFIG_ATTACHMENT_HEADING = mod.CONFIG_ATTACHMENT_HEADING
  ATTACHMENT_STALENESS_NOTE = mod.ATTACHMENT_STALENESS_NOTE
  VALIDATION_CHECKLIST = mod.VALIDATION_CHECKLIST
  SAMPLE_APPLICATION = (await import('../scripts/generate-footer-config.mjs')).SAMPLE_APPLICATION
  cleanCandidUrl = (await import('../scripts/lib/roadmap-fields.mjs')).cleanCandidUrl
})

const repo = 'FreeForCharity/FFC-IN-ffcadmin.org'

describe('stubBody', () => {
  it('describes the issue as a work order for an approved charity, with the dedup marker', () => {
    const body = stubBody({ id: 'ffc-1', charityName: 'Helping Hands Shelter' }, repo)
    expect(body).toContain('website-provisioning work order')
    expect(body).toContain('approved')
    // The refresh detector and the dedup search both depend on these markers.
    expect(body).toContain('Auto-created from an FFC')
    expect(body).toContain(`${ID_MARKER}: ffc-1`)
  })

  it('embeds the full Gate-3 validation checklist, unticked', () => {
    const body = stubBody({ id: 'ffc-1', charityName: 'Org' }, repo)
    expect(VALIDATION_CHECKLIST).toHaveLength(8)
    for (const item of VALIDATION_CHECKLIST) {
      expect(body).toContain(`- [ ] ${item}`)
    }
    expect(body).not.toMatch(/- \[[xX]\]/)
    // Links the objective definition (docs Section 4b).
    expect(body).toContain('#4b-the-website-validated-checklist-gate-3-definition')
  })

  it('carries a "Live site:" placeholder that liveUrlFrom() ignores until a real URL is pasted', () => {
    const body = stubBody({ id: 'ffc-1', charityName: 'Org' }, repo)
    // Same regex as scripts/generate-roadmap-data.ts liveUrlFrom().
    const liveUrlRe = /^[ \t>*-]*live\s*(?:site|url)\s*[:：]\s*(https?:\/\/\S+)/im
    expect(body).toMatch(/^Live site:/m) // the line the volunteer fills in
    expect(body).not.toMatch(liveUrlRe) // the placeholder itself never parses as a URL
    const filled = body.replace(/^Live site:.*$/m, 'Live site: https://a.github.io/b/')
    expect(filled.match(liveUrlRe)?.[1]).toBe('https://a.github.io/b/')
  })
})

describe('configAttachment / extractConfigAttachment', () => {
  it('a validated record yields the collapsed SiteConfig partial with the manual-fields list', () => {
    const block = configAttachment(SAMPLE_APPLICATION, repo)
    expect(block).toMatch(
      /^<details><summary>Generated site\.config partial \(from validated application data\)<\/summary>/
    )
    expect(block).toMatch(/<\/details>$/)
    expect(block).toContain('```json')
    expect(block).toContain(`"name": "${SAMPLE_APPLICATION.charityName}"`)
    expect(block).toContain(`"ein": "${SAMPLE_APPLICATION.ein}"`)
    expect(block).toContain('"supportedBy"')
    expect(block).toContain('Manual fields:')
    expect(block).toContain('`integrations`')
    // Deterministic: no timestamp, so the block never churns on its own.
    expect(configAttachment(SAMPLE_APPLICATION, repo)).toBe(block)
  })

  it('a record failing bridge validation yields the fail-open gap list instead', () => {
    const block = configAttachment({ id: 'ffc-1', charityName: 'Bare Org' }, repo)
    expect(block).toContain('config not generatable — missing:')
    expect(block).toContain('missing "ein"')
    expect(block).toContain('missing "candidUrl"')
    expect(block).toContain('missing "charityStage"')
    expect(block).not.toContain('```json')
  })

  it('round-trips through extractConfigAttachment from a full stub body', () => {
    const attachment = configAttachment(SAMPLE_APPLICATION, repo)
    const body = stubBody(SAMPLE_APPLICATION, repo, { attachment })
    expect(extractConfigAttachment(body)).toBe(attachment)
    // The attachment sits BEFORE the volunteer-owned Gate-3 block, keeping the
    // validation checklist the last block in the body.
    expect(body.indexOf('</details>')).toBeLessThan(body.indexOf('### Validation checklist'))
    // A body without an attachment extracts to '' (pre-feature stubs).
    expect(extractConfigAttachment(stubBody(SAMPLE_APPLICATION, repo))).toBe('')
    expect(extractConfigAttachment(undefined)).toBe('')
  })

  it('an attached stub still refreshes cleanly: the attachment is not a human edit', () => {
    const attachment = configAttachment(SAMPLE_APPLICATION, repo)
    const existing = stubBody(SAMPLE_APPLICATION, repo, { attachment })
    // The refresh path rebuilds the body with new data + the carried-over block.
    const fresh = stubBody({ ...SAMPLE_APPLICATION, missionExcerpt: 'New mission' }, repo, {
      attachment: extractConfigAttachment(existing),
    })
    expect(hasHumanEdits(existing, fresh)).toBe(false)
  })

  it('places the attachment under its OWN "### Generated site config" heading', () => {
    const attachment = configAttachment(SAMPLE_APPLICATION, repo)
    const body = stubBody(SAMPLE_APPLICATION, repo, { attachment })
    const headingIdx = body.indexOf(`### ${CONFIG_ATTACHMENT_HEADING}`)
    expect(headingIdx).toBeGreaterThan(-1)
    // Heading directly precedes the block; no data field sits between them.
    expect(headingIdx).toBeLessThan(body.indexOf('<details>'))
    // A bare stub has no orphan heading.
    expect(stubBody(SAMPLE_APPLICATION, repo)).not.toContain(`### ${CONFIG_ATTACHMENT_HEADING}`)
  })

  it('REGRESSION (#697 block 8): the attachment never folds into the Candid-URL field', () => {
    // The real parseIssueForm (scripts/generate-roadmap-data.ts's field parser)
    // splits fields on "### " headings: before the own-heading fix, the whole
    // ~2KB <details> block glued onto the Candid-URL value, cleanCandidUrl
    // passed it, and a percent-encoded monster URL reached the PUBLIC
    // public/data/roadmap.json.
    const candidUrl = 'https://www.guidestar.org/profile/12-3456789'
    const app = { ...SAMPLE_APPLICATION, candidUrl }
    const body = stubBody(app, repo, { attachment: configAttachment(app, repo) })
    const form = parseIssueForm(body)
    const parsed = form.get('candid / guidestar profile url')
    expect(parsed).toBe(candidUrl)
    expect(parsed).not.toContain('<details>')
    // The attachment parses as its own separate field instead.
    expect(form.get(CONFIG_ATTACHMENT_HEADING.toLowerCase())).toContain('<details>')
    // And the published value stays the clean profile URL.
    expect(cleanCandidUrl(parsed)).toBe(candidUrl)
  })

  it('old-format bodies (attachment glued after the Candid field) still publish a clean candidUrl', () => {
    // Simulate a pre-fix issue body that is still live on GitHub: the block
    // sits inside the Candid field's value. Defense in depth: cleanCandidUrl
    // takes only the field's first line and rejects markup outright.
    const candidUrl = 'https://www.guidestar.org/profile/12-3456789'
    const glued = `${candidUrl}\n\n${configAttachment(SAMPLE_APPLICATION, repo)}`
    expect(cleanCandidUrl(glued)).toBe(candidUrl)
    // Even a value that IS the block never becomes a published URL.
    expect(cleanCandidUrl(configAttachment(SAMPLE_APPLICATION, repo))).toBeUndefined()
  })
})

describe('withStalenessNote', () => {
  it('inserts the note after the <summary> line, idempotently', () => {
    const attachment = configAttachment(SAMPLE_APPLICATION, repo)
    const noted = withStalenessNote(attachment)
    expect(noted).toContain(ATTACHMENT_STALENESS_NOTE)
    expect(noted.indexOf(ATTACHMENT_STALENESS_NOTE)).toBeGreaterThan(noted.indexOf('</summary>'))
    expect(noted.indexOf(ATTACHMENT_STALENESS_NOTE)).toBeLessThan(noted.indexOf('```json'))
    // Idempotent: a second pass changes nothing (no refresh churn).
    expect(withStalenessNote(noted)).toBe(noted)
    // Empty/absent attachments stay empty.
    expect(withStalenessNote('')).toBe('')
    expect(withStalenessNote(undefined)).toBe('')
  })

  it('the noted attachment still round-trips through extract + stub rebuild', () => {
    const noted = withStalenessNote(configAttachment(SAMPLE_APPLICATION, repo))
    const body = stubBody(SAMPLE_APPLICATION, repo, { attachment: noted })
    expect(extractConfigAttachment(body)).toBe(noted)
  })

  it('adding the note is not a human edit (the migration refresh may proceed)', () => {
    const attachment = configAttachment(SAMPLE_APPLICATION, repo)
    const existing = stubBody(SAMPLE_APPLICATION, repo, { attachment })
    const fresh = stubBody(SAMPLE_APPLICATION, repo, { attachment: withStalenessNote(attachment) })
    expect(hasHumanEdits(existing, fresh)).toBe(false)
  })

  it('a pre-fix glued body (no attachment heading) migrates on refresh, not frozen as human-edited', () => {
    const attachment = configAttachment(SAMPLE_APPLICATION, repo)
    // Replicate the pre-fix stub layout: the block sat directly between the
    // last data field and the validation checklist, with no own heading.
    const oldFormat = stubBody(SAMPLE_APPLICATION, repo).replace(
      '### Validation checklist',
      `${attachment}\n\n### Validation checklist`
    )
    const fresh = stubBody(SAMPLE_APPLICATION, repo, {
      attachment: withStalenessNote(extractConfigAttachment(oldFormat)),
    })
    expect(extractConfigAttachment(oldFormat)).toBe(attachment)
    expect(hasHumanEdits(oldFormat, fresh)).toBe(false)
  })
})

describe('labelsFor', () => {
  it('labels sync-created work orders status:needs-admin (approved, awaiting admin)', () => {
    // status:intake would show the approved charity as "application under
    // review" on the roadmap/pipeline; needs-admin maps to "approved".
    expect(labelsFor({ id: 'ffc-1' })).toEqual(['kind:intake', 'status:needs-admin'])
    expect(labelsFor({ id: 'ffc-1', status: 'not-a-status' })).toEqual([
      'kind:intake',
      'status:needs-admin',
    ])
  })

  it('keeps an explicit valid lifecycle status from the record', () => {
    expect(labelsFor({ id: 'ffc-1', status: 'live' })).toEqual(['kind:intake', 'status:live'])
  })
})

describe('passesCreationCutoff', () => {
  const cutoff = '2026-07-11'

  it('passes services dated on/after the cutover', () => {
    expect(passesCreationCutoff({ submittedAt: '2026-07-11T00:00:00.000Z' }, cutoff)).toBe(true)
    expect(passesCreationCutoff({ submittedAt: '2026-08-01T12:00:00.000Z' }, cutoff)).toBe(true)
  })

  it('blocks historical services and, conservatively, records without a date', () => {
    expect(passesCreationCutoff({ submittedAt: '2026-07-10T23:59:59.000Z' }, cutoff)).toBe(false)
    expect(passesCreationCutoff({ submittedAt: '2024-01-01T00:00:00.000Z' }, cutoff)).toBe(false)
    expect(passesCreationCutoff({}, cutoff)).toBe(false)
    expect(passesCreationCutoff({ submittedAt: 'not-a-date' }, cutoff)).toBe(false)
  })

  it('is disabled when no cutoff is configured', () => {
    expect(passesCreationCutoff({ submittedAt: '2020-01-01T00:00:00.000Z' }, undefined)).toBe(true)
    expect(passesCreationCutoff({}, '')).toBe(true)
  })
})

describe('hasHumanEdits', () => {
  const app = { id: 'ffc-1', charityName: 'Org', missionExcerpt: 'Old mission' }
  const fresh = () => stubBody({ ...app, missionExcerpt: 'New mission' }, repo)

  it('a pure data change is NOT a human edit (refresh allowed)', () => {
    expect(hasHumanEdits(stubBody(app, repo), fresh())).toBe(false)
  })

  it('a ticked validation checkbox is a human edit', () => {
    const ticked = stubBody(app, repo).replace('- [ ] CI green', '- [x] CI green')
    expect(hasHumanEdits(ticked, fresh())).toBe(true)
  })

  it('a filled "Live site:" URL is a human edit', () => {
    const filled = stubBody(app, repo).replace(
      /^Live site:.*$/m,
      'Live site: https://freeforcharity.github.io/FFC-EX-org/'
    )
    expect(hasHumanEdits(filled, fresh())).toBe(true)
  })

  it('added or removed lines outside the data fields are a human edit', () => {
    const edited = `${stubBody(app, repo)}\nA note from the charity.\n`
    expect(hasHumanEdits(edited, fresh())).toBe(true)
  })
})

describe('syncIntakeIssues', () => {
  let tmp, stateFile, calls, realFetch, existingIssues

  /** Mock GitHub: listing returns `existingIssues`; creates/patches recorded. */
  const installFetchMock = () => {
    global.fetch = jest.fn(async (url, init = {}) => {
      const u = String(url)
      const method = init.method || 'GET'
      calls.push({ url: u, method, body: init.body })
      const ok = (json) => ({ ok: true, status: 200, json: async () => json })
      if (method === 'GET' && u.includes('/issues?labels=')) {
        return ok(u.includes('page=1') ? existingIssues : [])
      }
      if (method === 'POST' && u.endsWith('/issues')) return ok({ number: 100 })
      return ok({})
    })
  }

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'intake-issues-'))
    stateFile = join(tmp, 'state.json')
    calls = []
    existingIssues = []
    realFetch = global.fetch
    installFetchMock()
  })

  afterEach(() => {
    global.fetch = realFetch
    rmSync(tmp, { recursive: true, force: true })
  })

  const creates = () => calls.filter((c) => c.method === 'POST' && c.url.endsWith('/issues'))
  const patches = () => calls.filter((c) => c.method === 'PATCH')

  it('creates issues only for services on/after createNewSince; historical ones are silent', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const applications = [
      { id: 'ffc-old', charityName: 'Historical Org', submittedAt: '2025-03-01T00:00:00.000Z' },
      { id: 'ffc-undated', charityName: 'Undated Org' },
      { id: 'ffc-new', charityName: 'Fresh Org', submittedAt: '2026-07-12T00:00:00.000Z' },
    ]
    const result = await syncIntakeIssues({
      applications,
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
    })

    expect(result.created).toBe(1)
    expect(creates()).toHaveLength(1)
    expect(JSON.parse(creates()[0].body).labels).toEqual(['kind:intake', 'status:needs-admin'])
    // Approved-but-undated records are named for human attention, not silent.
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Undated Org (ffc-undated)'))
    warn.mockRestore()
  })

  it('creates an issue for a pre-cutoff application previously observed Pending (approval after cutover)', async () => {
    // Run 1: the service is Pending — tracked in state, no issue.
    await syncIntakeIssues({
      applications: [],
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
      pendingIds: new Set(['ffc-77']),
    })
    expect(creates()).toHaveLength(0)
    expect(loadState(stateFile).pendingSeenIds).toEqual(['ffc-77'])

    // Run 2: the same id is now approved (Active) with a PRE-cutoff application
    // date — the pendingSeen record bypasses the date cutoff.
    calls = []
    const result = await syncIntakeIssues({
      applications: [
        { id: 'ffc-77', charityName: 'Applied Early Org', submittedAt: '2026-07-05T00:00:00.000Z' },
      ],
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
    })
    expect(result.created).toBe(1)
    expect(creates()).toHaveLength(1)
    // Once the issue exists the id graduates out of pending tracking.
    const state = loadState(stateFile)
    expect(state.seenApplicationIds).toContain('ffc-77')
    expect(state.pendingSeenIds).toEqual([])
  })

  it('refreshes an existing pre-cutoff issue even when the state file was lost (marker lookup before cutoff)', async () => {
    const app = {
      id: 'ffc-old',
      charityName: 'Historical Org',
      missionExcerpt: 'New mission',
      submittedAt: '2025-03-01T00:00:00.000Z',
    }
    existingIssues = [
      {
        number: 7,
        user: { login: 'github-actions[bot]' },
        title: '[Intake] Historical Org',
        body: stubBody({ ...app, missionExcerpt: 'Old mission' }, repo),
      },
    ]
    // NOTE: no writeState — the dedup state is empty, as after a state loss.
    const result = await syncIntakeIssues({
      applications: [app],
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
    })

    expect(result.created).toBe(0)
    expect(result.updated).toBe(1)
    expect(patches()).toHaveLength(1)
    // The recovered id is reconciled back into the state file.
    expect(loadState(stateFile).seenApplicationIds).toEqual(['ffc-old'])
  })

  it('never clobbers human edits: a ticked checkbox blocks the body refresh', async () => {
    const app = {
      id: 'ffc-old',
      charityName: 'Historical Org',
      missionExcerpt: 'New mission',
      submittedAt: '2025-03-01T00:00:00.000Z',
    }
    existingIssues = [
      {
        number: 7,
        user: { login: 'github-actions[bot]' },
        title: '[Intake] Historical Org',
        body: stubBody({ ...app, missionExcerpt: 'Old mission' }, repo).replace(
          '- [ ] CI green',
          '- [x] CI green'
        ),
      },
    ]
    writeState(stateFile, new Set(['ffc-old']))
    const result = await syncIntakeIssues({
      applications: [app],
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
    })

    expect(result.updated).toBe(0)
    expect(patches()).toHaveLength(0)
  })

  it('allowCreate(app) gates NEW creation (published-feed approval gate) but not refreshes', async () => {
    const fresh = {
      id: 'ffc-feed',
      charityName: 'Feed Org',
      submittedAt: '2026-08-01T00:00:00.000Z',
    }
    const result = await syncIntakeIssues({
      applications: [fresh],
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
      allowCreate: () => false, // feed cannot prove approval -> refresh-only
    })
    expect(result.created).toBe(0)
    expect(creates()).toHaveLength(0)

    // The same record WITH an existing issue is still refreshed.
    calls = []
    existingIssues = [
      {
        number: 9,
        user: { login: 'github-actions[bot]' },
        title: '[Intake] Feed Org',
        body: stubBody({ ...fresh, missionExcerpt: 'Old' }, repo),
      },
    ]
    const second = await syncIntakeIssues({
      applications: [{ ...fresh, missionExcerpt: 'New' }],
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
      allowCreate: () => false,
    })
    expect(second.updated).toBe(1)
    expect(patches()).toHaveLength(1)
  })

  it('persists pendingSeenIds through the state file round-trip', async () => {
    await syncIntakeIssues({
      applications: [],
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
      pendingIds: new Set(['ffc-b', 'ffc-a']),
    })
    const raw = JSON.parse(readFileSync(stateFile, 'utf8'))
    expect(raw.pendingSeenIds).toEqual(['ffc-a', 'ffc-b'])
    expect(raw.seenApplicationIds).toEqual([])
  })
})
