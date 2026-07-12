/**
 * Unit tests for the pure WHMCS -> application-record transform.
 *
 * The WHMCS HTTP calls can't run here, but `buildApplicationRecords` is pure:
 * it turns per-client working records into the PII-safe published shape. These
 * tests lock in the allowlist (no PII fields leak), the company-name gate, the
 * 501c3 tier mapping, mission truncation, and the sort order.
 */

let buildApplicationRecords, TIER_BY_PID, MISSION_MAX_LENGTH, sanitizeCandidUrl, sanitizeEin
let missionCategoryOption, missionTierFromProduct, MISSION_OPTION, INTAKE_STATUSES, INTAKE_SINCE
let PENDING_STATUSES, sanitizeSocialUrl

beforeAll(async () => {
  const mod = await import('../scripts/whmcs-applications.mjs')
  buildApplicationRecords = mod.buildApplicationRecords
  TIER_BY_PID = mod.TIER_BY_PID
  MISSION_MAX_LENGTH = mod.MISSION_MAX_LENGTH
  sanitizeCandidUrl = mod.sanitizeCandidUrl
  sanitizeEin = mod.sanitizeEin
  missionCategoryOption = mod.missionCategoryOption
  missionTierFromProduct = mod.missionTierFromProduct
  MISSION_OPTION = mod.MISSION_OPTION
  INTAKE_STATUSES = mod.INTAKE_STATUSES
  INTAKE_SINCE = mod.INTAKE_SINCE
  PENDING_STATUSES = mod.PENDING_STATUSES
  sanitizeSocialUrl = mod.sanitizeSocialUrl
})

const ALLOWED_KEYS = [
  'id',
  'charityName',
  'charityStage',
  'charityStatusOption',
  'missionCategoryOption',
  'serviceTier',
  'missionExcerpt',
  'candidUrl',
  'ein',
  'facebookUrl',
  'linkedinUrl',
  'submittedAt',
]

describe('approval-gated intake defaults', () => {
  it('surfaces only APPROVED services by default (Active), never Pending', () => {
    // GitHub issues are website-provisioning work orders created after WHMCS
    // approval; a Pending application must not open one.
    expect([...INTAKE_STATUSES]).toEqual(['active'])
    expect(INTAKE_STATUSES.has('pending')).toBe(false)
  })

  it('tracks Pending services separately so a post-cutover approval still gets a work order', () => {
    // Pending ids are recorded in the sync state (no issue); when the same id
    // later turns Active it bypasses the date cutoff (the date compared is the
    // APPLICATION date — approval can happen long after it).
    expect([...PENDING_STATUSES]).toEqual(['pending'])
  })

  it('has a flood-guard cutover date so historical Active services never mass-create issues', () => {
    expect(INTAKE_SINCE).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    // The cutover marker: the date the Active default shipped.
    expect(Date.parse(INTAKE_SINCE)).toBeGreaterThanOrEqual(Date.parse('2026-07-11'))
  })
})

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

  it('sanitizes Candid/GuideStar URLs (unwrap HTML, reject placeholders)', () => {
    expect(sanitizeCandidUrl('<a href="https://app.candid.org/profile/123/x">x</a>')).toBe(
      'https://app.candid.org/profile/123/x'
    )
    expect(sanitizeCandidUrl('https://www.guidestar.org/profile/12-3456789')).toBe(
      'https://www.guidestar.org/profile/12-3456789'
    )
    expect(sanitizeCandidUrl('https://none.org')).toBe('')
    expect(sanitizeCandidUrl('not a url')).toBe('')
    expect(sanitizeCandidUrl('')).toBe('')
  })

  it('validates EIN format', () => {
    expect(sanitizeEin('41-3950250')).toBe('41-3950250')
    expect(sanitizeEin('413950250')).toBe('41-3950250')
    expect(sanitizeEin('none')).toBe('')
    expect(sanitizeEin('')).toBe('')
  })

  it('sanitizes charity social PAGE URLs (host-checked, no personal LinkedIn profiles)', () => {
    const fb = /(^|\.)facebook\.com$/i
    const li = /(^|\.)linkedin\.com$/i
    expect(sanitizeSocialUrl('https://www.facebook.com/helpinghands', fb)).toBe(
      'https://www.facebook.com/helpinghands'
    )
    // WHMCS may store link fields HTML-wrapped, like the Candid URL.
    expect(sanitizeSocialUrl('<a href="https://facebook.com/org">x</a>', fb)).toBe(
      'https://facebook.com/org'
    )
    expect(sanitizeSocialUrl('https://www.linkedin.com/company/helping-hands/', li)).toBe(
      'https://www.linkedin.com/company/helping-hands/'
    )
    // Wrong host, not a URL, or empty -> dropped.
    expect(sanitizeSocialUrl('https://evil.example.com/facebook.com', fb)).toBe('')
    expect(sanitizeSocialUrl('not a url', fb)).toBe('')
    expect(sanitizeSocialUrl('', fb)).toBe('')
    // A personal LinkedIn profile (/in/...) is PII-adjacent — never published.
    expect(sanitizeSocialUrl('https://www.linkedin.com/in/jane-doe/', li)).toBe('')
  })

  it('carries the charity social page URLs onto the published record', () => {
    const byClient = new Map([
      [
        '30',
        {
          clientId: '30',
          pid: '33',
          company: 'Social Org',
          facebookUrl: 'https://www.facebook.com/socialorg',
          linkedinUrl: 'https://www.linkedin.com/company/social-org/',
        },
      ],
      ['31', { clientId: '31', pid: '16', company: 'No Social Org' }],
    ])
    const apps = buildApplicationRecords(byClient)
    expect(apps.find((a) => a.id === 'ffc-30')).toMatchObject({
      facebookUrl: 'https://www.facebook.com/socialorg',
      linkedinUrl: 'https://www.linkedin.com/company/social-org/',
    })
    const bare = apps.find((a) => a.id === 'ffc-31')
    expect(bare).not.toHaveProperty('facebookUrl')
    expect(bare).not.toHaveProperty('linkedinUrl')
  })

  it('maps the live WHMCS onboarding options to the three tiers', () => {
    // The exact option strings from the FFC onboarding dropdown.
    expect(missionCategoryOption('501(c)(3) Food, Water, or Shelter Organization')).toBe(
      MISSION_OPTION.basicNeeds
    )
    expect(missionCategoryOption('501(c)(19) Veterans Organization')).toBe(MISSION_OPTION.veterans)
    expect(missionCategoryOption('Other Veterans Organization')).toBe(MISSION_OPTION.veterans)
    // "Other 501(c)(3) Organization" carries no tier keyword -> neutral baseline.
    expect(missionCategoryOption('Other 501(c)(3) Organization')).toBe(MISSION_OPTION.general)
    // Absent field -> omitted (caller falls back to text classification).
    expect(missionCategoryOption('')).toBe('')
    expect(missionCategoryOption(undefined)).toBe('')
  })

  it('resolves the tier from the org-type dropdown by value shape, not the mission prose', () => {
    // Dropdown found even though its field name is "Organization Type", and the
    // free-text mission (which mentions veterans + food) must NOT win.
    const product = {
      customfields: {
        customfield: [
          { name: 'Organization Type', value: '501(c)(3) Food, Water, or Shelter Organization' },
          { name: 'Mission Statement', value: 'We help homeless veterans access food.' },
        ],
      },
    }
    expect(missionTierFromProduct(product)).toBe(MISSION_OPTION.basicNeeds)

    // No org-type field -> '' so the caller falls back to text classification,
    // even when the mission prose mentions a tier keyword.
    const noDropdown = {
      customfields: { customfield: [{ name: 'Mission Statement', value: 'We support veterans.' }] },
    }
    expect(missionTierFromProduct(noDropdown)).toBe('')
  })

  it('carries the self-attested mission tier onto the published record', () => {
    const byClient = new Map([
      [
        '20',
        {
          clientId: '20',
          pid: '16',
          company: 'Hope Pantry',
          missionOption: MISSION_OPTION.basicNeeds,
        },
      ],
      ['21', { clientId: '21', pid: '16', company: 'No Tier Org' }],
    ])
    const apps = buildApplicationRecords(byClient)
    expect(apps.find((a) => a.id === 'ffc-20').missionCategoryOption).toBe(
      MISSION_OPTION.basicNeeds
    )
    // No self-attestation -> field omitted (roadmap classifies from mission text).
    expect(apps.find((a) => a.id === 'ffc-21')).not.toHaveProperty('missionCategoryOption')
  })

  it('keeps angle brackets entity-encoded (no markup injection)', () => {
    const byClient = new Map([
      [
        '8',
        {
          clientId: '8',
          pid: '16',
          company: 'Safe Org',
          mission: '&lt;script&gt;x&lt;/script&gt; &#60;b&#62; &#x3c;i&#x3e;',
        },
      ],
    ])
    const [app] = buildApplicationRecords(byClient)
    expect(app.missionExcerpt).not.toMatch(/[<>]/)
    expect(app.missionExcerpt).toContain('&lt;')
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

  it('carries accurate stage/status and validated Candid URL + EIN', () => {
    const byClient = new Map([
      [
        '90',
        {
          clientId: '90',
          pid: '33',
          company: 'Wenatchee Valley Islamic Center',
          candidUrl: 'https://app.candid.org/profile/16302238/x',
          ein: '12-3456789',
        },
      ],
      ['91', { clientId: '91', pid: '16', company: 'Pre Org' }],
    ])
    const apps = buildApplicationRecords(byClient)
    const c501 = apps.find((a) => a.id === 'ffc-90')
    expect(c501).toMatchObject({
      charityStage: '501c3',
      charityStatusOption: 'Approved 501(c)(3)',
      candidUrl: 'https://app.candid.org/profile/16302238/x',
      ein: '12-3456789',
    })
    const pre = apps.find((a) => a.id === 'ffc-91')
    expect(pre.charityStage).toBe('pre-501c3')
    expect(pre).not.toHaveProperty('candidUrl')
    expect(pre).not.toHaveProperty('ein')
  })

  it('sorts by submission date then name', () => {
    const byClient = new Map([
      ['1', { clientId: '1', pid: '16', company: 'Zebra', regIso: '2026-01-02T00:00:00.000Z' }],
      ['2', { clientId: '2', pid: '16', company: 'Alpha', regIso: '2026-01-01T00:00:00.000Z' }],
    ])
    expect(buildApplicationRecords(byClient).map((a) => a.charityName)).toEqual(['Alpha', 'Zebra'])
  })
})
