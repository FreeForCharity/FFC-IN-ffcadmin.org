import { cloudflareZoneUrl, FFC_CLOUDFLARE_ACCOUNT_ID } from '../src/app/sites-list/sitesData'

describe('cloudflareZoneUrl quick-link (#187)', () => {
  it('builds a per-zone dashboard URL for domains in FFC Cloudflare', () => {
    const url = cloudflareZoneUrl({ domain: 'example.org', inCloudflare: 'Yes' })
    expect(url).toBe(`https://dash.cloudflare.com/${FFC_CLOUDFLARE_ACCOUNT_ID}/example.org`)
  })

  it('is case-insensitive on the In Cloudflare flag', () => {
    expect(cloudflareZoneUrl({ domain: 'example.org', inCloudflare: 'yes' })).toContain(
      'dash.cloudflare.com'
    )
  })

  it('returns empty string when the site is not in Cloudflare', () => {
    expect(cloudflareZoneUrl({ domain: 'example.org', inCloudflare: 'No' })).toBe('')
    expect(cloudflareZoneUrl({ domain: 'example.org', inCloudflare: '' })).toBe('')
  })

  it('returns empty string when there is no domain', () => {
    expect(cloudflareZoneUrl({ domain: '', inCloudflare: 'Yes' })).toBe('')
  })
})
