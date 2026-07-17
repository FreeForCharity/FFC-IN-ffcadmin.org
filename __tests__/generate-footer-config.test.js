/**
 * Unit tests for the site-config bridge (scripts/generate-footer-config.mjs).
 *
 * The transform is pure — a validated WHMCS application record in, a
 * siteConfig PARTIAL in the shared SiteConfig shape out (template
 * convergence, FreeForCharity/FFC-Cloudflare-Automation#693) — so these
 * tests lock in the happy-path mapping (name, EIN, description, guidestar,
 * social, the always-present supportedBy attribution), the manual-fill
 * checklist, and the loud failure when required fields are missing (missing
 * data = application not validated for footer generation).
 */

let buildSiteConfigPartial, validateApplication, selectRecord
let REQUIRED_FIELDS, MANUAL_FIELDS_BASE, SUPPORTED_BY, SAMPLE_APPLICATION

beforeAll(async () => {
  const mod = await import('../scripts/generate-footer-config.mjs')
  buildSiteConfigPartial = mod.buildSiteConfigPartial
  validateApplication = mod.validateApplication
  selectRecord = mod.selectRecord
  REQUIRED_FIELDS = mod.REQUIRED_FIELDS
  MANUAL_FIELDS_BASE = mod.MANUAL_FIELDS_BASE
  SUPPORTED_BY = mod.SUPPORTED_BY
  SAMPLE_APPLICATION = mod.SAMPLE_APPLICATION
})

describe('buildSiteConfigPartial — happy path', () => {
  it('maps a validated application onto the shared SiteConfig shape', () => {
    const now = new Date('2026-07-11T12:00:00.000Z')
    const out = buildSiteConfigPartial(SAMPLE_APPLICATION, { now })

    expect(out.source).toEqual({
      applicationId: 'ffc-90',
      system: 'WHMCS',
      generatedBy: 'scripts/generate-footer-config.mjs',
      generatedAt: '2026-07-11T12:00:00.000Z',
      charityStage: '501c3',
    })
    // The partial's keys are named and nested exactly as in the template's
    // typed SiteConfig (src/lib/site.config.ts) — directly transcribable. The
    // hardened onboarding forms now supply the public footer contact fields and
    // the extra social pages, so they flow straight through.
    expect(out.siteConfig).toEqual({
      name: 'Helping Hands Shelter',
      description: 'We provide shelter, food, and job placement to families in crisis.',
      social: [
        { label: 'Facebook', href: 'https://www.facebook.com/helpinghandsshelter' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/helping-hands-shelter/' },
        { label: 'Instagram', href: 'https://www.instagram.com/helpinghandsshelter' },
        { label: 'X (Twitter)', href: 'https://x.com/helpinghands' },
        { label: 'YouTube', href: 'https://www.youtube.com/@helpinghandsshelter' },
      ],
      contactEmail: 'hello@example.org',
      phone: { display: '+1 520-555-0100', tel: '+15205550100' },
      addresses: [{ label: 'Location', lines: ['Tucson, AZ'] }],
      ein: '12-3456789',
      guidestar: {
        profileUrl: 'https://www.guidestar.org/profile/12-3456789',
        // The direct "shared profile" link is now captured too (public-by-design).
        directProfileUrl: 'https://www.guidestar.org/profile/shared/12-3456789',
      },
      supportedBy: {
        name: 'Free For Charity',
        url: 'https://freeforcharity.org',
        hubUrl: 'https://freeforcharity.org/hub/',
      },
    })
  })

  it('flows the public contact fields into contact/phone/address and drops them from manual', () => {
    const out = buildSiteConfigPartial(SAMPLE_APPLICATION)
    expect(out.siteConfig.contactEmail).toBe('hello@example.org')
    expect(out.siteConfig.phone).toEqual({ display: '+1 520-555-0100', tel: '+15205550100' })
    expect(out.siteConfig.addresses).toEqual([{ label: 'Location', lines: ['Tucson, AZ'] }])
    // Supplied -> not on the manual-fill checklist.
    const manualKeys = out.manualFields.map((f) => f.key)
    expect(manualKeys).not.toContain('contactEmail')
    expect(manualKeys).not.toContain('phone')
    expect(manualKeys).not.toContain('addresses')
    expect(manualKeys).not.toContain('guidestar.directProfileUrl')
  })

  it('emits all five social networks when present, in a fixed order', () => {
    const out = buildSiteConfigPartial(SAMPLE_APPLICATION)
    expect(out.siteConfig.social.map((s) => s.label)).toEqual([
      'Facebook',
      'LinkedIn',
      'Instagram',
      'X (Twitter)',
      'YouTube',
    ])
  })

  it('omits contact fields (and re-lists them manual) when the record lacks them', () => {
    const record = { ...SAMPLE_APPLICATION }
    delete record.contactEmail
    delete record.contactPhone
    delete record.contactCityState
    delete record.candidDirectUrl
    const out = buildSiteConfigPartial(record)
    expect(out.siteConfig).not.toHaveProperty('contactEmail')
    expect(out.siteConfig).not.toHaveProperty('phone')
    expect(out.siteConfig).not.toHaveProperty('addresses')
    // guidestar.directProfileUrl stays in the object (as '') to keep the shape.
    expect(out.siteConfig.guidestar.directProfileUrl).toBe('')
    const manualKeys = out.manualFields.map((f) => f.key)
    expect(manualKeys).toEqual(
      expect.arrayContaining(['contactEmail', 'phone', 'addresses', 'guidestar.directProfileUrl'])
    )
  })

  it('drops individual socials that are absent or on the wrong host', () => {
    const record = {
      ...SAMPLE_APPLICATION,
      instagramUrl: undefined, // absent -> omitted
      xUrl: 'https://evil.example.com/@spoof', // wrong host -> rejected
      youtubeUrl: 'https://youtu.be/abcd1234', // short host allowed
    }
    const out = buildSiteConfigPartial(record)
    const labels = out.siteConfig.social.map((s) => s.label)
    expect(labels).toContain('YouTube')
    expect(labels).not.toContain('Instagram')
    expect(labels).not.toContain('X (Twitter)')
    expect(out.siteConfig.social.find((s) => s.label === 'YouTube').href).toBe(
      'https://youtu.be/abcd1234'
    )
  })

  it('rejects a wrong-host Candid direct link (empty directProfileUrl)', () => {
    const out = buildSiteConfigPartial({
      ...SAMPLE_APPLICATION,
      candidDirectUrl: 'https://evil.example.com/profile/shared/12-3456789',
    })
    expect(out.siteConfig.guidestar.directProfileUrl).toBe('')
    expect(out.manualFields.map((f) => f.key)).toContain('guidestar.directProfileUrl')
  })

  it('lists every never-suppliable SiteConfig key in manualFields', () => {
    const out = buildSiteConfigPartial(SAMPLE_APPLICATION)
    // The sample record supplies description, social, AND every public contact
    // field, so only the always-manual base list applies.
    expect(out.manualFields).toEqual(MANUAL_FIELDS_BASE)
    expect(out.manualFields.map((f) => f.key)).toEqual(['integrations', 'url', 'tagline'])
    // Every manual field carries a note telling the volunteer where to get it.
    for (const f of out.manualFields) {
      expect(typeof f.note).toBe('string')
      expect(f.note.length).toBeGreaterThan(0)
    }
    // Omitted-key contract: never-suppliable keys are NOT emitted in the partial
    // — so a volunteer never transcribes a placeholder as real data.
    expect(out.siteConfig).not.toHaveProperty('integrations')
    expect(out.siteConfig).not.toHaveProperty('url')
    expect(out.siteConfig).not.toHaveProperty('tagline')
  })

  it('ALWAYS emits the FFC supportedBy attribution (footer standard, never from the record)', () => {
    // Even a record that (maliciously or accidentally) carries its own
    // supportedBy cannot repoint the attribution.
    const record = {
      ...SAMPLE_APPLICATION,
      supportedBy: { name: 'Evil Corp', url: 'https://evil.example.com', hubUrl: 'x' },
    }
    const out = buildSiteConfigPartial(record)
    expect(out.siteConfig.supportedBy).toEqual({
      name: 'Free For Charity',
      url: 'https://freeforcharity.org',
      hubUrl: 'https://freeforcharity.org/hub/',
    })
    expect(out.siteConfig.supportedBy).toEqual(SUPPORTED_BY)
    // And it is never on the manual-fill list — nothing to fill by hand.
    expect(out.manualFields.map((f) => f.key)).not.toContain('supportedBy')
  })

  it('omits social links the record does not carry and rejects off-host URLs', () => {
    const record = {
      ...SAMPLE_APPLICATION,
      facebookUrl: undefined,
      linkedinUrl: 'https://evil.example.com/spoof', // not linkedin.com -> dropped
      instagramUrl: undefined,
      xUrl: undefined,
      youtubeUrl: undefined,
    }
    const out = buildSiteConfigPartial(record)
    expect(out.siteConfig.social).toEqual([])
    // With no usable page URLs, social joins the manual-fill checklist.
    expect(out.manualFields.some((f) => f.key === 'social')).toBe(true)
  })

  it('omits description (and flags it manual) when the record has no mission excerpt', () => {
    const record = { ...SAMPLE_APPLICATION }
    delete record.missionExcerpt
    const out = buildSiteConfigPartial(record)
    expect(out.siteConfig).not.toHaveProperty('description')
    expect(out.manualFields.some((f) => f.key === 'description')).toBe(true)
  })
})

describe('buildSiteConfigPartial — missing data fails loudly', () => {
  it('throws listing EVERY missing required field (missing = not validated)', () => {
    const record = { id: 'ffc-91', charityStage: '501c3' }
    expect(() => buildSiteConfigPartial(record)).toThrow(/not validated/)
    try {
      buildSiteConfigPartial(record)
    } catch (err) {
      // All three gaps reported at once, so a volunteer sees the full picture.
      expect(err.message).toMatch(/missing "charityName"/)
      expect(err.message).toMatch(/missing "ein"/)
      expect(err.message).toMatch(/missing "candidUrl"/)
    }
  })

  it('rejects a pre-501c3 application (footer asserts US 501c3 status)', () => {
    const record = { ...SAMPLE_APPLICATION, charityStage: 'pre-501c3' }
    expect(() => buildSiteConfigPartial(record)).toThrow(/pre-501c3/)
  })

  it('rejects a record with NO charityStage — never fail-open into a 501c3 assertion', () => {
    const record = { ...SAMPLE_APPLICATION }
    delete record.charityStage
    const problems = validateApplication(record)
    expect(problems.some((p) => /missing "charityStage"/.test(p))).toBe(true)
    expect(() => buildSiteConfigPartial(record)).toThrow(/charityStage/)
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
