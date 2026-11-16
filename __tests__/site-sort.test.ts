import { nextSort, sortSites } from '../src/app/sites-list/siteSort'
import { SiteData } from '../src/app/sites-list/sitesShared'

function site(domain: string, overrides: Partial<SiteData> = {}): SiteData {
  return {
    domain,
    siteHealth: 'Live',
    lastPrClosed: '',
    openPrs: '',
    lighthouse: '',
    ...overrides,
  } as SiteData
}

const domains = (sites: SiteData[]) => sites.map((s) => s.domain)

describe('sortSites', () => {
  it('sorts by domain both ways', () => {
    const sites = [site('b.org'), site('a.org'), site('c.org')]
    expect(domains(sortSites(sites, { column: 'Domain', direction: 'ascending' }))).toEqual([
      'a.org',
      'b.org',
      'c.org',
    ])
    expect(domains(sortSites(sites, { column: 'Domain', direction: 'descending' }))).toEqual([
      'c.org',
      'b.org',
      'a.org',
    ])
  })

  it('sorts numbers as numbers, not text', () => {
    const sites = [site('a', { lighthouse: '9' }), site('b', { lighthouse: '100' })]
    expect(domains(sortSites(sites, { column: 'LH', direction: 'ascending' }))).toEqual(['a', 'b'])
  })

  it('keeps empty cells last in both directions', () => {
    const sites = [site('empty'), site('two', { openPrs: '2' }), site('one', { openPrs: '1' })]
    expect(domains(sortSites(sites, { column: 'Open PRs', direction: 'ascending' }))).toEqual([
      'one',
      'two',
      'empty',
    ])
    expect(domains(sortSites(sites, { column: 'Open PRs', direction: 'descending' }))).toEqual([
      'two',
      'one',
      'empty',
    ])
  })

  it('orders health from live to unknown', () => {
    const sites = [site('down', { siteHealth: 'Unreachable' }), site('up', { siteHealth: 'Live' })]
    expect(domains(sortSites(sites, { column: 'Health', direction: 'ascending' }))).toEqual([
      'up',
      'down',
    ])
  })

  it('keeps the existing order for ties and does not change the input', () => {
    const sites = [site('z', { status: 'Active' }), site('a', { status: 'Active' })]
    expect(domains(sortSites(sites, { column: 'Status', direction: 'ascending' }))).toEqual([
      'z',
      'a',
    ])
    expect(domains(sites)).toEqual(['z', 'a'])
  })
})

describe('nextSort', () => {
  it('goes ascending, then descending, then back to the tier order', () => {
    const first = nextSort(null, 'Domain')
    expect(first).toEqual({ column: 'Domain', direction: 'ascending' })
    const second = nextSort(first, 'Domain')
    expect(second).toEqual({ column: 'Domain', direction: 'descending' })
    expect(nextSort(second, 'Domain')).toBeNull()
  })

  it('starts ascending when a different column is chosen', () => {
    expect(nextSort({ column: 'Domain', direction: 'descending' }, 'LH')).toEqual({
      column: 'LH',
      direction: 'ascending',
    })
  })
})
