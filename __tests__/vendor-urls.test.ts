import { VENDOR_URLS, VENDOR_URL_FRESHNESS_DAYS, staleVendorUrls } from '@/data/vendor-urls'

describe('Vendor URL registry', () => {
  test('every entry has a non-empty URL and ISO lastVerified date', () => {
    for (const [key, entry] of Object.entries(VENDOR_URLS)) {
      expect(entry.url).toMatch(/^(https?:\/\/|mailto:|tel:)/)
      expect(entry.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(entry.description.length).toBeGreaterThan(0)
      // Sanity: the key should not be empty.
      expect(key.length).toBeGreaterThan(0)
    }
  })

  test('freshness window is reasonable', () => {
    // Months-long not days-long not years-long.
    expect(VENDOR_URL_FRESHNESS_DAYS).toBeGreaterThanOrEqual(30)
    expect(VENDOR_URL_FRESHNESS_DAYS).toBeLessThanOrEqual(365)
  })

  test('staleVendorUrls reports nothing for a recently-verified registry', () => {
    // Today minus 30 days — all entries should still be fresh assuming
    // every lastVerified in the registry is within the freshness window.
    const today = new Date('2026-06-23')
    const stale = staleVendorUrls(today)
    expect(stale).toEqual([])
  })

  test('staleVendorUrls reports entries when the clock advances past freshness', () => {
    // 200 days after the verification cluster — all should be stale.
    const today = new Date('2026-12-15')
    const stale = staleVendorUrls(today)
    expect(stale.length).toBe(Object.keys(VENDOR_URLS).length)
  })
})
