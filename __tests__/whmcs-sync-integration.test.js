/**
 * Integration tests for the WHMCS sync's production filter path, driven by
 * realistic GetClientsProducts payload fixtures
 * (`__tests__/fixtures/whmcs-get-clients-products.json`).
 *
 * Round-2 review gap: the status filter inside `collect()` was unexported and
 * untested against real WHMCS response shapes. The filter path is now pure and
 * exported (`productsFromResponse` + `isIntakeStatus`/`isPendingStatus` +
 * `ingestProducts`), so these tests run the exact production code from raw
 * payload to created/refreshed GitHub issues (mocked `fetch` — no network):
 *
 *   fixture response -> productsFromResponse -> ingestProducts
 *     -> buildApplicationRecords -> syncIntakeIssues
 *
 * Covered: Active-vs-Pending filtering incl. case variants; the
 * WHMCS_INTAKE_SINCE creation cutoff with pre-/post-/missing-date services;
 * the pendingSeen-turned-Active bypass; single-element vs multi-element vs
 * empty WHMCS response shapes; and the auto-attached site-config partial
 * (attached on create — validated JSON or the fail-open gap list — and never
 * regenerated on refresh).
 */

import { readFileSync } from 'fs'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const fixtures = JSON.parse(
  readFileSync(join(__dirname, 'fixtures', 'whmcs-get-clients-products.json'), 'utf8')
)

let productsFromResponse, isIntakeStatus, isPendingStatus, ingestProducts, buildApplicationRecords
let syncIntakeIssues, loadState, stubBody, configAttachment, withStalenessNote

beforeAll(async () => {
  const whmcs = await import('../scripts/whmcs-applications.mjs')
  productsFromResponse = whmcs.productsFromResponse
  isIntakeStatus = whmcs.isIntakeStatus
  isPendingStatus = whmcs.isPendingStatus
  ingestProducts = whmcs.ingestProducts
  buildApplicationRecords = whmcs.buildApplicationRecords
  const issues = await import('../scripts/lib/intake-issues.mjs')
  syncIntakeIssues = issues.syncIntakeIssues
  loadState = issues.loadState
  stubBody = issues.stubBody
  configAttachment = issues.configAttachment
  withStalenessNote = issues.withStalenessNote
})

const repo = 'FreeForCharity/FFC-IN-ffcadmin.org'
const CUTOFF = '2026-07-11'

/** Public company names GetClientsDetails would resolve (collect() step 2). */
const COMPANIES = {
  90: 'Helping Hands Shelter',
  91: 'Neighborhood Tool Library',
  92: 'Applied Early Org',
  95: 'Historical Active Org',
  96: 'Undated Org',
}

/**
 * Run the production pipeline exactly as collect() does, minus the network:
 * normalize the fixture response, ingest through the status filter, resolve
 * company names, and build the PII-safe published records.
 */
function recordsFromResponse(resp) {
  const byClient = new Map()
  const pendingIds = new Set()
  // collect() queries GetClientsProducts once per onboarding pid ('16,33') and
  // ingests each response under that pid; the fixture folds both queries into
  // one payload, so split it back out per pid here.
  const products = productsFromResponse(resp)
  for (const pid of ['16', '33']) {
    ingestProducts(
      pid,
      products.filter((p) => p.pid === pid),
      byClient,
      pendingIds
    )
  }
  for (const [clientId, rec] of byClient) rec.company = COMPANIES[clientId] || ''
  return { applications: buildApplicationRecords(byClient), pendingIds }
}

describe('WHMCS response shapes (products.product)', () => {
  it('normalizes the multi-element array shape', () => {
    const products = productsFromResponse(fixtures.multi)
    expect(Array.isArray(products)).toBe(true)
    expect(products).toHaveLength(9)
  })

  it('normalizes the single-element OBJECT shape (one service -> no array)', () => {
    const products = productsFromResponse(fixtures.single)
    expect(products).toHaveLength(1)
    expect(products[0].clientid).toBe('90')
  })

  it('normalizes the empty shape (products key omitted entirely)', () => {
    expect(productsFromResponse(fixtures.empty)).toEqual([])
    expect(productsFromResponse({})).toEqual([])
    expect(productsFromResponse(undefined)).toEqual([])
  })
})

describe('production status filter (Active vs Pending vs everything else)', () => {
  it('accepts intake statuses case-insensitively and rejects all lifecycle rest', () => {
    const products = productsFromResponse(fixtures.multi)
    const eligible = products.filter(isIntakeStatus).map((p) => p.clientid)
    // 'Active', 'active', 'ACTIVE' all pass; Pending/Cancelled/Completed/
    // Terminated/Fraud never do.
    expect(eligible.sort()).toEqual(['90', '91', '95', '96'])
    const pending = products.filter(isPendingStatus).map((p) => p.clientid)
    expect(pending).toEqual(['92'])
  })

  it('never treats a missing or unknown status as eligible', () => {
    expect(isIntakeStatus({})).toBe(false)
    expect(isIntakeStatus({ status: '' })).toBe(false)
    expect(isIntakeStatus({ status: 'Suspended' })).toBe(false)
    expect(isPendingStatus({})).toBe(false)
  })

  it('ingestProducts partitions the payload: eligible merged, pending tracked without a record', () => {
    const byClient = new Map()
    const pendingIds = new Set()
    const { eligibleCount, pendingCount } = ingestProducts(
      '33',
      productsFromResponse(fixtures.multi),
      byClient,
      pendingIds
    )
    expect(eligibleCount).toBe(4)
    expect(pendingCount).toBe(1)
    expect([...byClient.keys()].sort()).toEqual(['90', '91', '95', '96'])
    // Pending services get NO working record — only the tracked id.
    expect(byClient.has('92')).toBe(false)
    expect([...pendingIds]).toEqual(['ffc-92'])
  })

  it('derives the PII-safe fields through the real custom-field extractors', () => {
    const { applications } = recordsFromResponse(fixtures.multi)
    const shelter = applications.find((a) => a.id === 'ffc-90')
    expect(shelter).toMatchObject({
      charityName: 'Helping Hands Shelter',
      charityStage: '501c3',
      ein: '12-3456789',
      candidUrl: 'https://www.guidestar.org/profile/12-3456789',
      facebookUrl: 'https://www.facebook.com/helpinghandsshelter',
      linkedinUrl: 'https://www.linkedin.com/company/helping-hands-shelter/',
      submittedAt: '2026-07-12T00:00:00.000Z',
    })
    // WHMCS's null date '0000-00-00' must not become a submittedAt.
    expect(applications.find((a) => a.id === 'ffc-96')).not.toHaveProperty('submittedAt')
  })
})

describe('fixture payload -> issues (mocked GitHub)', () => {
  let tmp, stateFile, calls, realFetch, existingIssues

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
    tmp = mkdtempSync(join(tmpdir(), 'whmcs-sync-'))
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
  const createdBodies = () => creates().map((c) => JSON.parse(c.body))

  const sync = (resp, overrides = {}) => {
    const { applications, pendingIds } = recordsFromResponse(resp)
    return syncIntakeIssues({
      applications,
      repo,
      token: 'test-token',
      stateFile,
      source: 'WHMCS',
      createNewSince: CUTOFF,
      pendingIds,
      ...overrides,
    })
  }

  it('creates issues only for post-cutoff approved services; pre-cutoff and undated stay silent', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const result = await sync(fixtures.multi)

    // 90 + 91 postdate the cutover; 95 (2026-06-01) is flood-guarded; 96 has
    // WHMCS's null date; 92 is Pending (tracked, no issue); the rest are
    // Cancelled/Completed/Terminated/Fraud and never reach the sync at all.
    expect(result.created).toBe(2)
    const titles = createdBodies().map((b) => b.title)
    expect(titles).toEqual(['[Intake] Helping Hands Shelter', '[Intake] Neighborhood Tool Library'])
    // The undated-but-approved service is named for human follow-up.
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Undated Org (ffc-96)'))
    // The Pending id is persisted for the post-approval bypass.
    expect(loadState(stateFile).pendingSeenIds).toEqual(['ffc-92'])
    warn.mockRestore()
  })

  it('pendingSeen-turned-Active: a pre-cutoff application creates its work order once approved', async () => {
    // Run 1: the service is Pending in WHMCS — tracked, no issue.
    await sync(fixtures.singlePending)
    expect(creates()).toHaveLength(0)
    expect(loadState(stateFile).pendingSeenIds).toEqual(['ffc-92'])

    // Run 2: the SAME service is now Active. Its application date (2026-07-01)
    // predates the cutoff, but the pendingSeen record bypasses the flood guard.
    calls = []
    const result = await sync(fixtures.singleTurnedActive)
    expect(result.created).toBe(1)
    expect(createdBodies()[0].title).toBe('[Intake] Applied Early Org')
    // The id graduates out of pending tracking once its issue exists.
    const state = loadState(stateFile)
    expect(state.seenApplicationIds).toEqual(['ffc-92'])
    expect(state.pendingSeenIds).toEqual([])
  })

  describe('auto-attached site-config partial', () => {
    it('a validated 501(c)(3) record gets the collapsed JSON partial on create', async () => {
      await sync(fixtures.multi)
      const shelter = createdBodies().find((b) => b.title.includes('Helping Hands'))
      expect(shelter.body).toContain(
        '<details><summary>Generated site.config partial (from validated application data)</summary>'
      )
      expect(shelter.body).toContain('```json')
      // Real values from the fixture payload flow into the SiteConfig shape.
      expect(shelter.body).toContain('"name": "Helping Hands Shelter"')
      expect(shelter.body).toContain('"ein": "12-3456789"')
      expect(shelter.body).toContain('"profileUrl": "https://www.guidestar.org/profile/12-3456789"')
      expect(shelter.body).toContain('"href": "https://www.facebook.com/helpinghandsshelter"')
      // Permanent FFC attribution + the fill-by-hand list ride along.
      expect(shelter.body).toContain('"supportedBy"')
      expect(shelter.body).toContain('Manual fields:')
      expect(shelter.body).toContain('`contactEmail`')
      // The attachment must sit BEFORE the volunteer-owned validation block.
      expect(shelter.body.indexOf('</details>')).toBeLessThan(
        shelter.body.indexOf('### Validation checklist (Gate 3)')
      )
    })

    it('a record failing bridge validation gets the fail-open gap list instead', async () => {
      await sync(fixtures.multi)
      const library = createdBodies().find((b) => b.title.includes('Tool Library'))
      expect(library.body).toContain('config not generatable — missing:')
      // pre-501(c)(3), no EIN, no Candid URL — every gap is itemized.
      expect(library.body).toContain('missing "ein"')
      expect(library.body).toContain('missing "candidUrl"')
      expect(library.body).toContain('footer generation requires a validated 501c3 application')
      expect(library.body).not.toContain('```json')
    })

    it('refresh never regenerates or invents an attachment (pre-attachment stubs stay bare)', async () => {
      const { applications } = recordsFromResponse(fixtures.single)
      const app = applications[0]
      // An existing bot stub created BEFORE the auto-attach feature, with stale
      // data so the refresh has something to update.
      existingIssues = [
        {
          number: 7,
          user: { login: 'github-actions[bot]' },
          title: '[Intake] Old Name',
          body: stubBody({ ...app, charityName: 'Old Name' }, repo),
        },
      ]
      const result = await sync(fixtures.single)
      expect(result.created).toBe(0)
      expect(result.updated).toBe(1)
      const patched = JSON.parse(patches()[0].body)
      expect(patched.body).not.toContain('Generated site.config partial')
    })

    it('refresh carries an existing attachment over (no churn, no clobber)', async () => {
      const { applications } = recordsFromResponse(fixtures.multi)
      const app = applications.find((a) => a.id === 'ffc-90')
      // A steady-state issue: the attachment already carries the staleness
      // note (added by a previous refresh). Identical data -> identical body
      // -> no PATCH at all (no churn).
      const noted = withStalenessNote(configAttachment(app, repo))
      existingIssues = [
        {
          number: 8,
          user: { login: 'github-actions[bot]' },
          title: '[Intake] Helping Hands Shelter',
          body: stubBody(app, repo, { attachment: noted }),
        },
      ]
      let result = await sync(fixtures.multi)
      expect(result.updated).toBe(0)
      expect(patches()).toHaveLength(0)

      // Changed data -> the refresh updates the fields but keeps the
      // creation-time attachment byte-for-byte (note included).
      calls = []
      existingIssues = [
        {
          number: 8,
          user: { login: 'github-actions[bot]' },
          title: '[Intake] Old Shelter Name',
          body: stubBody({ ...app, charityName: 'Old Shelter Name' }, repo, { attachment: noted }),
        },
      ]
      result = await sync(fixtures.multi)
      expect(result.updated).toBe(1)
      const patched = JSON.parse(patches()[0].body)
      expect(patched.body).toContain(noted)
      expect(patched.title).toBe('[Intake] Helping Hands Shelter')
    })

    it('a note-less attachment gains the staleness note exactly once on refresh', async () => {
      const { applications } = recordsFromResponse(fixtures.multi)
      const app = applications.find((a) => a.id === 'ffc-90')
      const attachment = configAttachment(app, repo)
      // A creation-time issue (no note yet): the first refresh is a one-time
      // migration PATCH that only adds the note.
      existingIssues = [
        {
          number: 8,
          user: { login: 'github-actions[bot]' },
          title: '[Intake] Helping Hands Shelter',
          body: stubBody(app, repo, { attachment }),
        },
      ]
      let result = await sync(fixtures.multi)
      expect(result.updated).toBe(1)
      const patched = JSON.parse(patches()[0].body)
      expect(patched.body).toContain('Generated at issue creation from then-current WHMCS data')

      // Once noted, the next identical run is quiet again (idempotent).
      calls = []
      existingIssues = [
        {
          number: 8,
          user: { login: 'github-actions[bot]' },
          title: '[Intake] Helping Hands Shelter',
          body: patched.body,
        },
      ]
      result = await sync(fixtures.multi)
      expect(result.updated).toBe(0)
      expect(patches()).toHaveLength(0)
    })
  })
})
