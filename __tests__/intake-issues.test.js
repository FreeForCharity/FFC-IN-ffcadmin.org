/**
 * Unit tests for the shared intake-issue plumbing (`scripts/lib/intake-issues.mjs`).
 *
 * Locks in the approval-gated work-order model: the stub body announces itself
 * as the website-provisioning work order for an approved charity, and the
 * `createNewSince` flood guard stops first-time issue creation for historical
 * WHMCS services that predate the cutover — while ids already in the dedup
 * state keep their refresh behaviour. `syncIntakeIssues` is exercised with a
 * mocked `fetch`, so no network or real repo is touched.
 */

import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

let stubBody, passesCreationCutoff, syncIntakeIssues, writeState, ID_MARKER

beforeAll(async () => {
  const mod = await import('../scripts/lib/intake-issues.mjs')
  stubBody = mod.stubBody
  passesCreationCutoff = mod.passesCreationCutoff
  syncIntakeIssues = mod.syncIntakeIssues
  writeState = mod.writeState
  ID_MARKER = mod.ID_MARKER
})

describe('stubBody', () => {
  it('describes the issue as a work order for an approved charity, with the dedup marker', () => {
    const body = stubBody(
      { id: 'ffc-1', charityName: 'Helping Hands Shelter' },
      'FreeForCharity/FFC-IN-ffcadmin.org'
    )
    expect(body).toContain('website-provisioning work order')
    expect(body).toContain('approved')
    // The refresh detector and the dedup search both depend on these markers.
    expect(body).toContain('Auto-created from an FFC')
    expect(body).toContain(`${ID_MARKER}: ffc-1`)
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

describe('syncIntakeIssues flood guard', () => {
  const repo = 'FreeForCharity/FFC-IN-ffcadmin.org'
  let tmp, stateFile, calls, realFetch

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'intake-issues-'))
    stateFile = join(tmp, 'state.json')
    calls = []
    realFetch = global.fetch
    global.fetch = jest.fn(async (url, init = {}) => {
      calls.push({ url: String(url), method: init.method || 'GET' })
      const ok = (json) => ({ ok: true, status: 200, json: async () => json })
      if (String(url).includes('/search/issues')) return ok({ items: [] })
      return ok({ number: 1 })
    })
  })

  afterEach(() => {
    global.fetch = realFetch
    rmSync(tmp, { recursive: true, force: true })
  })

  it('creates issues only for services on/after createNewSince; historical ones are silent', async () => {
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
    const creates = calls.filter((c) => c.method === 'POST' && c.url.endsWith('/issues'))
    expect(creates).toHaveLength(1)
    // Guarded records are skipped BEFORE the issue search (no API quota burned).
    const searches = calls.filter((c) => c.url.includes('/search/issues'))
    expect(searches).toHaveLength(1)
  })

  it('still refreshes an existing issue for a pre-cutoff id recorded in the dedup state', async () => {
    writeState(stateFile, new Set(['ffc-old']))
    const staleIssue = {
      number: 7,
      user: { login: 'github-actions[bot]' },
      title: 'stale title',
      body: `_Auto-created from an FFC application for **Historical Org**._\n<!-- ffc-application-id: ffc-old -->\n`,
    }
    global.fetch = jest.fn(async (url, init = {}) => {
      calls.push({ url: String(url), method: init.method || 'GET' })
      const ok = (json) => ({ ok: true, status: 200, json: async () => json })
      if (String(url).includes('/search/issues')) return ok({ items: [staleIssue] })
      return ok({})
    })

    const result = await syncIntakeIssues({
      applications: [
        { id: 'ffc-old', charityName: 'Historical Org', submittedAt: '2025-03-01T00:00:00.000Z' },
      ],
      repo,
      token: 'test-token',
      stateFile,
      source: 'test',
      createNewSince: '2026-07-11',
    })

    expect(result.created).toBe(0)
    expect(result.updated).toBe(1)
    const patches = calls.filter((c) => c.method === 'PATCH')
    expect(patches).toHaveLength(1)
  })
})
