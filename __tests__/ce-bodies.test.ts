import {
  CE_BODIES,
  SUPPORTED_CE_BODIES,
  UNSUPPORTED_CE_BODIES,
  CE_LANDING_BODIES,
  getCeBody,
  getCeBodyByLandingSlug,
  CE_DISCLAIMER,
} from '../src/data/ce-bodies'

describe('CE compliance matrix (#356)', () => {
  it('has unique body slugs', () => {
    const slugs = CE_BODIES.map((b) => b.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('includes the in-scope supported bodies and unsupported vendors', () => {
    const supported = SUPPORTED_CE_BODIES.map((b) => b.slug)
    for (const s of ['isc2', 'pmi', 'comptia', 'isaca', 'cfre', 'giac', 'ec-council']) {
      expect(supported).toContain(s)
    }
    const unsupported = UNSUPPORTED_CE_BODIES.map((b) => b.slug)
    for (const s of ['microsoft', 'google-cloud', 'aws']) {
      expect(unsupported).toContain(s)
    }
  })

  it('every unsupported body explains why and carries a source', () => {
    for (const b of UNSUPPORTED_CE_BODIES) {
      expect(b.unsupportedReason && b.unsupportedReason.length).toBeGreaterThan(0)
      expect(b.sourceUrl).toMatch(/^https:\/\//)
      expect(b.landing).toBeUndefined()
    }
  })

  it('every supported body defines all three channels and a source URL', () => {
    for (const b of SUPPORTED_CE_BODIES) {
      for (const ch of ['education', 'teaching', 'work'] as const) {
        expect(['yes', 'limited', 'no']).toContain(b.channels[ch].support)
        expect(b.channels[ch].note.length).toBeGreaterThan(0)
      }
      expect(b.sourceUrl).toMatch(/^https:\/\//)
    }
  })

  it('landing bodies have unique, keyword-front-loaded slugs', () => {
    const slugs = CE_LANDING_BODIES.map((b) => b.landing!.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toContain('free-cpe-credits-isc2')
    expect(slugs).toContain('free-pdus-pmi')
    expect(slugs).toContain('free-ceus-comptia')
  })

  it('lookup helpers resolve by slug and landing slug', () => {
    expect(getCeBody('isc2')?.name).toBe('ISC2')
    expect(getCeBodyByLandingSlug('free-pdus-pmi')?.slug).toBe('pmi')
    expect(getCeBody('nope')).toBeUndefined()
  })

  it('ships the compliance disclaimer', () => {
    expect(CE_DISCLAIMER).toMatch(/not an accredited\/approved CE provider/)
  })

  it('CompTIA does not credit volunteer work (headline rule)', () => {
    expect(getCeBody('comptia')?.channels.work.support).toBe('no')
  })
})
