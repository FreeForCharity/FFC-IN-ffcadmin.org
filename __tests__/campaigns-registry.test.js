/**
 * Unit tests for the campaign-registry collector
 * (FFC-Cloudflare-Automation#746, child of #745).
 *
 * The URL canonicalization, kind/surface derivation, classification, HTML
 * extraction, and previous-registry merge are all pure (no network), so these
 * lock in the dedupe behaviour (embed ≡ link), the FFC-vs-charity split the
 * epic's acceptance criterion depends on, and first-seen preservation.
 */

let normalizeZeffyUrl,
  campaignKind,
  surfaceOf,
  classifyCampaign,
  extractZeffyUrls,
  mergeRegistries,
  siteUrls,
  loadFfcCampaignSet,
  FFC_CAMPAIGNS_FALLBACK

beforeAll(async () => {
  const mod = await import('../scripts/generate-campaigns-registry.mjs')
  ;({
    normalizeZeffyUrl,
    campaignKind,
    surfaceOf,
    classifyCampaign,
    extractZeffyUrls,
    mergeRegistries,
    siteUrls,
    loadFfcCampaignSet,
    FFC_CAMPAIGNS_FALLBACK,
  } = mod)
})

const ffcSet = () => {
  const s = new Set()
  for (const u of FFC_CAMPAIGNS_FALLBACK) s.add(normalizeZeffyUrl(u))
  return s
}

describe('normalizeZeffyUrl', () => {
  it('drops www, embed prefix, locale, query and trailing slash', () => {
    expect(normalizeZeffyUrl('https://www.zeffy.com/embed/donation-form/abc?modal=true#x')).toBe(
      'https://zeffy.com/donation-form/abc'
    )
    expect(normalizeZeffyUrl('https://zeffy.com/en-US/ticketing/gala/')).toBe(
      'https://zeffy.com/ticketing/gala'
    )
  })

  it('canonicalizes an embed and its plain link to the same URL (dedupe)', () => {
    const a = normalizeZeffyUrl(
      'https://www.zeffy.com/embed/donation-form/state-college-independence-day-parade'
    )
    const b = normalizeZeffyUrl(
      'https://www.zeffy.com/donation-form/state-college-independence-day-parade'
    )
    expect(a).toBe(b)
  })

  it('strips an entity-encoded query fragment that leaked into the path', () => {
    expect(
      normalizeZeffyUrl('https://www.zeffy.com/embed/donation-form/aariasblueelephant&amp;margin=2')
    ).toBe('https://zeffy.com/donation-form/aariasblueelephant')
  })

  it('returns null for non-Zeffy or unparseable input', () => {
    expect(normalizeZeffyUrl('https://example.com/donate')).toBeNull()
    expect(normalizeZeffyUrl('not a url')).toBeNull()
    expect(normalizeZeffyUrl('https://zeffy.com/')).toBeNull()
  })
})

describe('campaignKind', () => {
  it('reads the type from the canonical first segment', () => {
    expect(campaignKind('https://zeffy.com/ticketing/gala')).toBe('ticketing')
    expect(campaignKind('https://zeffy.com/donation-form/abc')).toBe('donation-form')
    expect(campaignKind('https://zeffy.com/peer-to-peer/run')).toBe('peer-to-peer')
    expect(campaignKind('https://zeffy.com/something/else')).toBe('other')
  })
})

describe('surfaceOf', () => {
  it('distinguishes an embed URL from a plain link', () => {
    expect(surfaceOf('https://www.zeffy.com/embed/donation-form/abc')).toBe('embed')
    expect(surfaceOf('https://www.zeffy.com/donation-form/abc')).toBe('link')
  })
})

describe('classifyCampaign', () => {
  const set = () => ffcSet()

  it('labels an FFC campaign ffc-owned', () => {
    const url = normalizeZeffyUrl('https://www.zeffy.com/ticketing/free-for-charity-annual-gala')
    expect(classifyCampaign(url, set())).toBe('ffc-owned')
  })

  it("labels freedomrisingusa's parade form charity-specific (acceptance criterion)", () => {
    const url = normalizeZeffyUrl(
      'https://www.zeffy.com/embed/donation-form/state-college-independence-day-parade'
    )
    expect(classifyCampaign(url, set())).toBe('charity-specific')
  })

  it('falls back to unknown when the FFC set is empty', () => {
    expect(classifyCampaign('https://zeffy.com/ticketing/x', new Set())).toBe('unknown')
  })
})

describe('extractZeffyUrls', () => {
  it('pulls Zeffy URLs out of iframes and anchors, ignoring other hosts', () => {
    const html = `
      <iframe src="https://www.zeffy.com/embed/donation-form/abc"></iframe>
      <a href="https://www.zeffy.com/ticketing/gala">Buy tickets</a>
      <a href="https://example.com/other">Nope</a>
    `
    const urls = extractZeffyUrls(html)
    expect(urls).toContain('https://www.zeffy.com/embed/donation-form/abc')
    expect(urls).toContain('https://www.zeffy.com/ticketing/gala')
    // Only the two Zeffy URLs — the example.com anchor is not captured.
    expect(urls).toHaveLength(2)
    for (const u of urls) expect(new URL(u).hostname).toBe('www.zeffy.com')
  })

  it('returns an empty array for empty/no-match HTML', () => {
    expect(extractZeffyUrls('')).toEqual([])
    expect(extractZeffyUrls('<p>no campaigns here</p>')).toEqual([])
  })
})

describe('siteUrls', () => {
  it('gives apex + default URL for a cut-over site', () => {
    expect(siteUrls({ repo: 'FFC-EX-x.org', domain: 'x.org' })).toEqual([
      'https://x.org/',
      'https://freeforcharity.github.io/FFC-EX-x.org/',
    ])
  })
  it('gives only the default URL for a not-cutover site', () => {
    expect(siteUrls({ repo: 'FFC-EX-x.org', domain: null })).toEqual([
      'https://freeforcharity.github.io/FFC-EX-x.org/',
    ])
  })
})

describe('mergeRegistries', () => {
  const NOW = '2026-07-21T12:00:00.000Z'
  const detected = new Map([
    [
      'https://zeffy.com/donation-form/parade',
      { kind: 'donation-form', surfaces: new Set(['embed']), sites: new Set(['a.org', 'b.org']) },
    ],
  ])

  it('dedupes a multi-site campaign and sorts sites', () => {
    const { campaigns, sites } = mergeRegistries(detected, null, ffcSet(), NOW)
    expect(campaigns).toHaveLength(1)
    expect(campaigns[0].sites).toEqual(['a.org', 'b.org'])
    expect(sites['a.org']).toEqual(['https://zeffy.com/donation-form/parade'])
    expect(sites['b.org']).toEqual(['https://zeffy.com/donation-form/parade'])
  })

  it('preserves firstSeen from the previous registry and updates lastSeen', () => {
    const previous = {
      campaigns: [
        {
          url: 'https://zeffy.com/donation-form/parade',
          kind: 'donation-form',
          surfaces: ['link'],
          class: 'charity-specific',
          sites: ['a.org'],
          firstSeen: '2026-01-01T00:00:00.000Z',
          lastSeen: '2026-07-01T00:00:00.000Z',
        },
      ],
    }
    const { campaigns } = mergeRegistries(detected, previous, ffcSet(), NOW)
    expect(campaigns[0].firstSeen).toBe('2026-01-01T00:00:00.000Z')
    expect(campaigns[0].lastSeen).toBe(NOW)
  })

  it('carries forward a previously-seen campaign not detected this run', () => {
    const previous = {
      campaigns: [
        {
          url: 'https://zeffy.com/ticketing/old-campaign',
          kind: 'ticketing',
          surfaces: ['link'],
          class: 'charity-specific',
          sites: ['c.org'],
          firstSeen: '2026-02-02T00:00:00.000Z',
          lastSeen: '2026-06-06T00:00:00.000Z',
        },
      ],
    }
    const { campaigns } = mergeRegistries(detected, previous, ffcSet(), NOW)
    const carried = campaigns.find((c) => c.url.endsWith('old-campaign'))
    expect(carried).toBeTruthy()
    expect(carried.lastSeen).toBe('2026-06-06T00:00:00.000Z')
  })
})

describe('loadFfcCampaignSet', () => {
  it('uses the committed hub list when reachable', async () => {
    const fakeFetch = async () =>
      JSON.stringify([{ url: 'https://www.zeffy.com/ticketing/only-one' }])
    const set = await loadFfcCampaignSet(fakeFetch)
    expect(set.has('https://zeffy.com/ticketing/only-one')).toBe(true)
    expect(set.size).toBe(1)
  })

  it('falls back to the embedded ground truth when the hub list is unreachable', async () => {
    const fakeFetch = async () => null
    const set = await loadFfcCampaignSet(fakeFetch)
    expect(set.size).toBe(FFC_CAMPAIGNS_FALLBACK.length)
    expect(
      set.has(normalizeZeffyUrl('https://www.zeffy.com/ticketing/free-for-charity-annual-gala'))
    ).toBe(true)
  })
})
