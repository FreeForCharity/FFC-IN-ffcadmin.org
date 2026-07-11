/**
 * Unit tests for the footer-config bridge (scripts/generate-footer-config.mjs).
 *
 * The transform is pure — a validated WHMCS application record in, the
 * FFC-standard footer config out — so these tests lock in the happy-path
 * mapping (org name, EIN, GuideStar link, social URLs, policy stack,
 * copyright) and the loud failure when required fields are missing (missing
 * data = application not validated for footer generation).
 */

let buildFooterConfig, validateApplication, selectRecord
let REQUIRED_FIELDS, POLICY_LINKS, SAMPLE_APPLICATION

beforeAll(async () => {
  const mod = await import('../scripts/generate-footer-config.mjs')
  buildFooterConfig = mod.buildFooterConfig
  validateApplication = mod.validateApplication
  selectRecord = mod.selectRecord
  REQUIRED_FIELDS = mod.REQUIRED_FIELDS
  POLICY_LINKS = mod.POLICY_LINKS
  SAMPLE_APPLICATION = mod.SAMPLE_APPLICATION
})

describe('buildFooterConfig — happy path', () => {
  it('maps a validated application onto the FFC footer shape', () => {
    const now = new Date('2026-07-11T12:00:00.000Z')
    const config = buildFooterConfig(SAMPLE_APPLICATION, { now })

    expect(config.source).toMatchObject({
      applicationId: 'ffc-90',
      system: 'WHMCS',
      generatedBy: 'scripts/generate-footer-config.mjs',
    })
    expect(config.organization).toEqual({
      legalName: 'Helping Hands Shelter',
      ein: '12-3456789',
      charityStage: '501c3',
      missionStatement: 'We provide shelter, food, and job placement to families in crisis.',
    })
    expect(config.endorsements).toEqual({
      guidestarProfileUrl: 'https://www.guidestar.org/profile/12-3456789',
      einLine: 'Helping Hands Shelter EIN: 12-3456789',
    })
    expect(config.socialLinks).toEqual([
      {
        platform: 'facebook',
        label: 'Facebook',
        url: 'https://www.facebook.com/helpinghandsshelter',
      },
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/company/helping-hands-shelter/',
      },
    ])
    expect(config.policyLinks).toEqual(POLICY_LINKS)
    expect(config.copyright).toEqual({
      holder: 'Helping Hands Shelter',
      year: 2026,
      line: '© 2026 All Rights Are Reserved by Helping Hands Shelter a US 501c3 Non Profit',
      projectOf: { name: 'Free For Charity', url: 'https://freeforcharity.org' },
    })
    // Contact details are PII the sync never surfaces — emitted as explicit
    // volunteer-fill placeholders, not silently omitted.
    expect(config.contact).toEqual({ email: null, phone: null, addressLines: [] })
  })

  it('covers the FFC-standard policy stack routes', () => {
    expect(POLICY_LINKS.map((l) => l.href)).toEqual([
      '/free-for-charity-donation-policy',
      '/privacy-policy',
      '/cookie-policy',
      '/terms-of-service',
      '/vulnerability-disclosure-policy',
      '/security-acknowledgements',
    ])
  })

  it('omits social links the record does not carry and rejects off-host URLs', () => {
    const record = {
      ...SAMPLE_APPLICATION,
      facebookUrl: undefined,
      linkedinUrl: 'https://evil.example.com/spoof', // not linkedin.com -> dropped
    }
    const config = buildFooterConfig(record)
    expect(config.socialLinks).toEqual([])
  })

  it('omits missionStatement when the sync record has no mission excerpt', () => {
    const record = { ...SAMPLE_APPLICATION }
    delete record.missionExcerpt
    const config = buildFooterConfig(record)
    expect(config.organization).not.toHaveProperty('missionStatement')
  })
})

describe('buildFooterConfig — missing data fails loudly', () => {
  it('throws listing EVERY missing required field (missing = not validated)', () => {
    const record = { id: 'ffc-91', charityStage: '501c3' }
    expect(() => buildFooterConfig(record)).toThrow(/not validated/)
    try {
      buildFooterConfig(record)
    } catch (err) {
      // All three gaps reported at once, so a volunteer sees the full picture.
      expect(err.message).toMatch(/missing "charityName"/)
      expect(err.message).toMatch(/missing "ein"/)
      expect(err.message).toMatch(/missing "candidUrl"/)
    }
  })

  it('rejects a pre-501c3 application (footer asserts US 501c3 status)', () => {
    const record = { ...SAMPLE_APPLICATION, charityStage: 'pre-501c3' }
    expect(() => buildFooterConfig(record)).toThrow(/pre-501c3/)
  })

  it('rejects a malformed EIN', () => {
    const problems = validateApplication({ ...SAMPLE_APPLICATION, ein: '123456789' })
    expect(problems.some((p) => /invalid "ein"/.test(p))).toBe(true)
  })

  it('rejects non-record input', () => {
    expect(validateApplication(null)).toEqual(['input is not an application record object'])
    expect(validateApplication([])).toEqual(['input is not an application record object'])
  })

  it('validateApplication returns [] for the documented sample', () => {
    expect(validateApplication(SAMPLE_APPLICATION)).toEqual([])
    // The sample stays honest: it satisfies exactly the documented bar.
    for (const [field] of REQUIRED_FIELDS) {
      expect(String(SAMPLE_APPLICATION[field] ?? '').trim()).not.toBe('')
    }
  })
})

describe('selectRecord — array input (sync dry-run output)', () => {
  it('picks by --id from an array and passes single records through', () => {
    const a = { id: 'ffc-1' }
    const b = { id: 'ffc-2' }
    expect(selectRecord([a, b], 'ffc-2')).toBe(b)
    expect(selectRecord([a], '')).toBe(a)
    expect(selectRecord(a, '')).toBe(a)
  })

  it('fails loudly on a multi-record array without --id or an unknown id', () => {
    expect(() => selectRecord([{ id: 'a' }, { id: 'b' }], '')).toThrow(/--id/)
    expect(() => selectRecord([{ id: 'a' }], 'ffc-99')).toThrow(/no application with id/)
  })
})
