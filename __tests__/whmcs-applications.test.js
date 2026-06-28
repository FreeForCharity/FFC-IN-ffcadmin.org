/**
 * Unit tests for the pure WHMCS -> application-record transform.
 *
 * The WHMCS HTTP calls can't run here, but `buildApplicationRecords` is pure:
 * it turns per-client working records into the PII-safe published shape. These
 * tests lock in the allowlist (no PII fields leak), the company-name gate, the
 * 501c3 tier mapping, mission truncation, and the sort order.
 */

let buildApplicationRecords, TIER_BY_PID, MISSION_MAX_LENGTH

beforeAll(async () => {
  const mod = await import('../scripts/whmcs-applications.mjs')
  buildApplicationRecords = mod.buildApplicationRecords
  TIER_BY_PID = mod.TIER_BY_PID
  MISSION_MAX_LENGTH = mod.MISSION_MAX_LENGTH
})

const ALLOWED_KEYS = ['id', 'charityName', 'serviceTier', 'missionExcerpt', 'submittedAt']

describe('buildApplicationRecords', () => {
  it('emits only the PII-safe allowlist and gates on a public org name', () => {
    const byClient = new Map([
      [
        '10',
        {
          clientId: '10',
          pid: '33',
          company: 'Helping Hands Shelter',
          mission: '  We help   families  ',
          regIso: '2026-06-25T00:00:00.000Z',
        },
      ],
      // No company name -> skipped (a published record needs a public name).
      ['11', { clientId: '11', pid: '16', company: '', mission: 'x', regIso: undefined }],
      ['12', { clientId: '12', pid: '16', company: 'Food Pantry', mission: undefined }],
    ])

    const apps = buildApplicationRecords(byClient)

    expect(apps).toHaveLength(2)
    for (const a of apps) {
      expect(Object.keys(a).every((k) => ALLOWED_KEYS.includes(k))).toBe(true)
    }

    const shelter = apps.find((a) => a.id === 'ffc-10')
    expect(shelter).toMatchObject({
      id: 'ffc-10',
      charityName: 'Helping Hands Shelter',
      serviceTier: TIER_BY_PID[33],
      missionExcerpt: 'We help families', // whitespace collapsed + trimmed
      submittedAt: '2026-06-25T00:00:00.000Z',
    })

    const pantry = apps.find((a) => a.id === 'ffc-12')
    expect(pantry.serviceTier).toBe(TIER_BY_PID[16])
    expect(pantry).not.toHaveProperty('missionExcerpt')
    expect(pantry).not.toHaveProperty('submittedAt')
  })

  it('decodes HTML entities WHMCS stores in name and mission', () => {
    const byClient = new Map([
      [
        '5',
        {
          clientId: '5',
          pid: '16',
          company: 'Sierra Vista Woman&#039;s Club',
          mission: 'Health &amp; hope for &quot;all&quot;',
        },
      ],
    ])
    const [app] = buildApplicationRecords(byClient)
    expect(app.charityName).toBe("Sierra Vista Woman's Club")
    expect(app.missionExcerpt).toBe('Health & hope for "all"')
  })

  it('prefers the 501c3 tier label and truncates a long mission', () => {
    const longMission = 'A'.repeat(500)
    const byClient = new Map([
      ['7', { clientId: '7', pid: '16', company: 'Big Org', mission: longMission }],
    ])
    const [app] = buildApplicationRecords(byClient)
    expect(app.missionExcerpt.length).toBeLessThanOrEqual(MISSION_MAX_LENGTH)
    expect(app.missionExcerpt.endsWith('…')).toBe(true)
  })

  it('sorts by submission date then name', () => {
    const byClient = new Map([
      ['1', { clientId: '1', pid: '16', company: 'Zebra', regIso: '2026-01-02T00:00:00.000Z' }],
      ['2', { clientId: '2', pid: '16', company: 'Alpha', regIso: '2026-01-01T00:00:00.000Z' }],
    ])
    expect(buildApplicationRecords(byClient).map((a) => a.charityName)).toEqual(['Alpha', 'Zebra'])
  })
})
