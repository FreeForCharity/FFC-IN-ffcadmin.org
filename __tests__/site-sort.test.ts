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

  it('sorts SSL expiry by date, whatever format the badge accepts', () => {
    const sites = [
      site('later', { sslExpiry: 'Feb 1 12:00:00 2027 GMT' }),
      site('sooner', { sslExpiry: 'Mar 1 12:00:00 2026 GMT' }),
    ]
    // As text, "Feb 2027" would sort before "Mar 2026".
    expect(domains(sortSites(sites, { column: 'SSL', direction: 'ascending' }))).toEqual([
      'sooner',
      'later',
    ])
  })

  it('sorts zero open PRs with the empty cells, as the table shows a dash for both', () => {
    const sites = [site('zero', { openPrs: '0' }), site('one', { openPrs: '1' })]
    expect(domains(sortSites(sites, { column: 'Open PRs', direction: 'descending' }))).toEqual([
      'one',
      'zero',
    ])
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
    // Alphabetically Error comes before Redirect; by health it is after.
    const sites = [
      site('error', { siteHealth: 'Error' }),
      site('redirect', { siteHealth: 'Redirect' }),
    ]
    expect(domains(sortSites(sites, { column: 'Health', direction: 'ascending' }))).toEqual([
      'redirect',
      'error',
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
