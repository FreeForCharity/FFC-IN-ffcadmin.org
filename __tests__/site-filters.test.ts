import {
  EMPTY_FILTERS,
  FILTER_PRESETS,
  filterSites,
  hasActiveFilters,
  filtersToQuery,
  filtersFromQuery,
  sitesToCsv,
  sitesToJson,
} from '../src/app/sites-list/siteFilters'
import { SiteData } from '../src/app/sites-list/sitesShared'

function site(overrides: Partial<SiteData>): SiteData {
  return {
    section: '',
    domain: 'example.org',
    status: 'Active',
    inWhmcs: 'Yes',
    inCloudflare: 'Yes',
    inWpmudev: '',
    serverInUse: 'GitHub Pages',
    oldServerAbandoned: '',
    notes: '',
    cloudflareIp: '',
    repoUrl: 'https://github.com/FreeForCharity/FFC-EX-example.org',
    siteHealth: 'Live',
    priority: 'Standard',
    repoArchived: '',
    lastPrClosed: '',
    openPrs: '',
    lastCommit: '',
    devStatus: '',
    workTier: '4 - Done / Stable',
    leftFfc: '',
    hostCategory: 'GitHub Pages',
    isStaging: '',
    domainAge: '',
    expiry: '',
    recurring: '',
    migrationScore: 0,
    maintenanceScore: 0,
    devScore: 0,
    sslExpiry: '',
    nsMatch: '',
    redirectTarget: '',
    lighthouse: '',
    owner: '',
    changed: '',
    ...overrides,
  }
}

const SITES: SiteData[] = [
  site({ domain: 'alpha.org' }),
  site({
    domain: 'bravo.org',
    siteHealth: 'Error',
    workTier: '3 - Needs Migration',
    hostCategory: 'HostPapa',
  }),
  site({ domain: 'charlie.org', siteHealth: 'No Response', repoUrl: '', inCloudflare: 'No' }),
]

describe('filterSites (#415)', () => {
  it('returns everything with no active filters', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false)
    expect(filterSites(SITES, EMPTY_FILTERS)).toHaveLength(3)
  })

  it('searches domain and repo url', () => {
    expect(filterSites(SITES, { ...EMPTY_FILTERS, q: 'bravo' })).toHaveLength(1)
    expect(filterSites(SITES, { ...EMPTY_FILTERS, q: 'FFC-EX-example' })).toHaveLength(2)
  })

  it('filters by health including the problem rollup', () => {
    expect(filterSites(SITES, { ...EMPTY_FILTERS, health: 'live' })).toHaveLength(1)
    expect(filterSites(SITES, { ...EMPTY_FILTERS, health: 'problem' })).toHaveLength(2)
  })

  it('filters by tier, host, cloudflare, and repo presence', () => {
    expect(filterSites(SITES, { ...EMPTY_FILTERS, tier: '3' })[0].domain).toBe('bravo.org')
    expect(filterSites(SITES, { ...EMPTY_FILTERS, host: 'HostPapa' })).toHaveLength(1)
    expect(filterSites(SITES, { ...EMPTY_FILTERS, cf: 'no' })[0].domain).toBe('charlie.org')
    expect(filterSites(SITES, { ...EMPTY_FILTERS, repo: 'no' })[0].domain).toBe('charlie.org')
  })

  it('combines facets with AND', () => {
    expect(filterSites(SITES, { ...EMPTY_FILTERS, health: 'problem', cf: 'no' })).toHaveLength(1)
  })
})

describe('presets (#413)', () => {
  it('every preset matches at least one defined facet', () => {
    for (const p of FILTER_PRESETS) {
      expect(Object.keys(p.filters).length).toBeGreaterThan(0)
    }
  })
})

describe('url sync (#412)', () => {
  it('round-trips filter state through the query string', () => {
    const f = { ...EMPTY_FILTERS, q: 'host papa', health: 'problem', tier: '3' }
    expect(filtersFromQuery(filtersToQuery(f))).toEqual(f)
  })

  it('produces an empty string for empty filters', () => {
    expect(filtersToQuery(EMPTY_FILTERS)).toBe('')
    expect(filtersFromQuery('')).toEqual(EMPTY_FILTERS)
  })

  it('ignores unknown params', () => {
    expect(filtersFromQuery('?utm_source=x&tier=3').tier).toBe('3')
  })
})

describe('export (#426)', () => {
  it('quotes csv fields containing commas or quotes', () => {
    const csv = sitesToCsv([site({ notes: 'a, "b"', domain: 'x.org' })])
    expect(csv).toContain('"a, ""b"""')
    expect(csv.split('\n')[0]).toContain('Domain,Work Tier,Health')
  })

  it('emits a json array of row objects', () => {
    const rows = JSON.parse(sitesToJson(SITES))
    expect(rows).toHaveLength(3)
    expect(rows[0]).toHaveProperty('Domain', 'alpha.org')
    expect(rows[0]).toHaveProperty('Work Tier')
  })
})
