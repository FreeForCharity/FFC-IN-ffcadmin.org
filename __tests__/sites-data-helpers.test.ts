import {
  cloudflareDnsRecordsUrl,
  dnsCheckerUrl,
  pagesSettingsUrl,
  newIssueUrl,
  rowMarkdown,
  migrationSteps,
  diffSummary,
  daysUntil,
  sslBadge,
  lighthouseBadge,
  dataGeneratedAt,
  dataIsStale,
  FFC_CLOUDFLARE_ACCOUNT_ID,
} from '../src/app/sites-list/sitesData'

describe('per-row quick-action links (#410, #411, #423)', () => {
  it('builds the cloudflare dns-records url for sites in cloudflare', () => {
    expect(cloudflareDnsRecordsUrl({ domain: 'example.org', inCloudflare: 'Yes' })).toBe(
      `https://dash.cloudflare.com/${FFC_CLOUDFLARE_ACCOUNT_ID}/example.org/dns/records`
    )
    expect(cloudflareDnsRecordsUrl({ domain: 'example.org', inCloudflare: 'No' })).toBe('')
  })

  it('builds a dns checker url', () => {
    expect(dnsCheckerUrl('example.org')).toBe('https://dnschecker.org/#A/example.org')
    expect(dnsCheckerUrl('')).toBe('')
  })

  it('links pages settings only for github pages sites with a repo', () => {
    const repoUrl = 'https://github.com/FreeForCharity/FFC-EX-example.org'
    expect(pagesSettingsUrl({ repoUrl, serverInUse: 'GitHub Pages' })).toBe(
      `${repoUrl}/settings/pages`
    )
    expect(pagesSettingsUrl({ repoUrl, serverInUse: 'HostPapa' })).toBe('')
    expect(pagesSettingsUrl({ repoUrl: '', serverInUse: 'GitHub Pages' })).toBe('')
  })

  it('prefills the new-issue link, preferring the site repo', () => {
    const site = {
      domain: 'example.org',
      repoUrl: 'https://github.com/FreeForCharity/FFC-EX-example.org',
      workTier: '3 - Needs Migration',
      siteHealth: 'Live',
      serverInUse: 'HostPapa',
    }
    const url = newIssueUrl(site)
    expect(url).toContain(`${site.repoUrl}/issues/new?title=`)
    expect(url).toContain(encodeURIComponent('[example.org] '))
    expect(decodeURIComponent(url)).toContain('Work tier: 3 - Needs Migration')
    const noRepo = newIssueUrl({ ...site, repoUrl: '' })
    expect(noRepo).toContain('FFC-IN-ffcadmin.org/issues/new')
  })
})

describe('copy-row markdown (#409)', () => {
  it('summarizes the row on a single line', () => {
    const md = rowMarkdown({
      domain: 'example.org',
      workTier: '3 - Needs Migration',
      siteHealth: 'Live',
      serverInUse: 'HostPapa',
      repoUrl: 'https://github.com/FreeForCharity/FFC-EX-example.org',
    })
    expect(md).toContain('**example.org**')
    expect(md).toContain('tier: 3 - Needs Migration')
    expect(md).toContain('repo: https://github.com/FreeForCharity/FFC-EX-example.org')
    expect(md).not.toContain('\n')
  })
})

describe('migration progress (#424)', () => {
  it('derives the four steps from existing fields', () => {
    const steps = migrationSteps({
      inCloudflare: 'Yes',
      repoUrl: 'https://github.com/x/y',
      serverInUse: 'GitHub Pages',
      siteHealth: 'Live',
    })
    expect(steps).toHaveLength(4)
    expect(steps.every((s) => s.done)).toBe(true)
  })

  it('marks pending steps for an unmigrated site', () => {
    const steps = migrationSteps({
      inCloudflare: 'Yes',
      repoUrl: '',
      serverInUse: 'HostPapa',
      siteHealth: 'Live',
    })
    expect(steps.filter((s) => s.done)).toHaveLength(2)
  })
})

describe('refresh diff (#425)', () => {
  it('summarizes field movement between snapshots', () => {
    const prev = {
      'Site Health': 'Live',
      Status: 'Active',
      'Work Tier': '3',
      'Server In Use': 'HostPapa',
    }
    const curr = {
      'Site Health': 'Error',
      Status: 'Active',
      'Work Tier': '3',
      'Server In Use': 'HostPapa',
    }
    expect(diffSummary(prev, curr)).toBe('Health: Live → Error')
  })

  it('flags domains new since the last refresh', () => {
    expect(diffSummary(undefined, { Domain: 'new.org' })).toBe('New since last refresh')
  })

  it('returns empty when nothing the team cares about changed', () => {
    const rec = {
      'Site Health': 'Live',
      Status: 'Active',
      'Work Tier': '4',
      'Server In Use': 'GitHub Pages',
    }
    expect(diffSummary(rec, { ...rec })).toBe('')
  })
})

describe('optional data-signal badges (#418, #421)', () => {
  it('computes days until a date', () => {
    const in20Days = new Date(Date.now() + 20 * 86_400_000).toISOString()
    expect(daysUntil(in20Days)).toBeGreaterThanOrEqual(19)
    expect(daysUntil('')).toBeNull()
    expect(daysUntil('not a date')).toBeNull()
  })

  it('colors ssl expiry by urgency', () => {
    const soon = new Date(Date.now() + 5 * 86_400_000).toISOString()
    const later = new Date(Date.now() + 90 * 86_400_000).toISOString()
    expect(sslBadge(soon)).toContain('red')
    expect(sslBadge(later)).toContain('green')
    expect(sslBadge('')).toContain('gray')
  })

  it('colors lighthouse scores by standard thresholds', () => {
    expect(lighthouseBadge(95)).toContain('green')
    expect(lighthouseBadge(70)).toContain('yellow')
    expect(lighthouseBadge(30)).toContain('red')
  })
})

describe('snapshot freshness (#416)', () => {
  it('dates the snapshot by the newest activity it recorded', () => {
    const sites = [
      { lastCommit: '2026-06-01', lastPrClosed: '2026-06-08' },
      { lastCommit: '2026-05-20', lastPrClosed: '' },
    ]
    expect(dataGeneratedAt(sites)).toBe('2026-06-08')
  })

  it('flags stale snapshots and trusts fresh ones', () => {
    const old = [{ lastCommit: '2020-01-01', lastPrClosed: '' }]
    const fresh = [{ lastCommit: new Date().toISOString().slice(0, 10), lastPrClosed: '' }]
    expect(dataIsStale(old)).toBe(true)
    expect(dataIsStale(fresh)).toBe(false)
    expect(dataIsStale([{ lastCommit: '', lastPrClosed: '' }])).toBe(false)
  })
})
