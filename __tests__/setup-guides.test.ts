import { SETUP_GUIDES, getSetupGuide } from '../src/data/setup-guides'

describe('Account & tool setup guides', () => {
  it('has unique slugs', () => {
    const slugs = SETUP_GUIDES.map((g) => g.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('includes the required onboarding accounts', () => {
    const slugs = SETUP_GUIDES.map((g) => g.slug)
    for (const required of [
      'github-account',
      'multi-factor-authentication',
      'linkedin',
      'facebook',
      'microsoft-365-email',
      'google-workspace',
      'password-manager',
      'canva',
    ]) {
      expect(slugs).toContain(required)
    }
  })

  it('every guide has intro + at least 3 steps with content', () => {
    for (const g of SETUP_GUIDES) {
      expect(g.intro.length).toBeGreaterThan(0)
      expect(g.steps.length).toBeGreaterThanOrEqual(3)
      for (const s of g.steps) {
        expect(s.title.length).toBeGreaterThan(0)
        expect(s.body.length).toBeGreaterThan(0)
      }
    }
  })

  it('every guide has a principle callout and at least one FAQ', () => {
    for (const g of SETUP_GUIDES) {
      expect(g.principle).toBeDefined()
      expect(g.principle.title.length).toBeGreaterThan(0)
      expect(g.principle.body.length).toBeGreaterThan(0)
      expect(Array.isArray(g.faqs)).toBe(true)
      expect(g.faqs.length).toBeGreaterThan(0)
      for (const f of g.faqs) {
        expect(f.q.length).toBeGreaterThan(0)
        expect(f.a.length).toBeGreaterThan(0)
      }
    }
  })

  it('every related slug resolves to a real guide', () => {
    for (const g of SETUP_GUIDES) {
      for (const rel of g.related) {
        expect(getSetupGuide(rel)).toBeDefined()
      }
    }
  })

  it('every counterpart resolves and is reciprocal across tracks', () => {
    for (const g of SETUP_GUIDES) {
      if (!g.counterpart) continue
      const other = getSetupGuide(g.counterpart)
      expect(other).toBeDefined()
      // The counterpart must point back to this guide.
      expect(other?.counterpart).toBe(g.slug)
      // A personal guide pairs with an organizational one and vice versa.
      expect(g.track === 'organizational').toBe(other?.track !== 'organizational')
    }
  })

  it('the GitHub guide carries the person-not-entity principle', () => {
    const gh = getSetupGuide('github-account')
    expect(gh?.principle).toBeDefined()
    const text = `${gh?.principle?.title} ${gh?.principle?.body}`.toLowerCase()
    expect(text).toContain('person')
  })

  it('the MFA guide documents new-phone precautions', () => {
    const mfa = getSetupGuide('multi-factor-authentication')
    expect(mfa?.newPhone?.length ?? 0).toBeGreaterThan(0)
  })
})
