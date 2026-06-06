import {
  LEGACY_WP_ADMIN_BASE,
  LEGACY_WP_ADMIN_CATEGORIES,
  LEGACY_WP_ADMIN_PAGES,
  getLegacyWpAdminHref,
  getLegacyWpAdminPageBySlug,
  getLegacyWpAdminPagesByCategory,
} from '@/data/legacy-wordpress-administration'

describe('Legacy WordPress Administration data', () => {
  test('exposes exactly the documented page count', () => {
    expect(LEGACY_WP_ADMIN_PAGES).toHaveLength(13)
  })

  test('every slug is prefixed `wordpress-`', () => {
    for (const page of LEGACY_WP_ADMIN_PAGES) {
      expect(page.slug).toMatch(/^wordpress-/)
    }
  })

  test('slugs are unique', () => {
    const slugs = LEGACY_WP_ADMIN_PAGES.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  test('every page belongs to a declared category', () => {
    const ids = new Set(LEGACY_WP_ADMIN_CATEGORIES.map((c) => c.id))
    for (const page of LEGACY_WP_ADMIN_PAGES) {
      expect(ids.has(page.category)).toBe(true)
    }
  })

  test('every page declares a public-source URL on freeforcharity.org', () => {
    for (const page of LEGACY_WP_ADMIN_PAGES) {
      expect(page.publicSourceUrl).toMatch(/^https:\/\/freeforcharity\.org\//)
    }
  })

  test('public-source URLs are unique', () => {
    const urls = LEGACY_WP_ADMIN_PAGES.map((p) => p.publicSourceUrl)
    expect(new Set(urls).size).toBe(urls.length)
  })

  test('every category contains at least one page', () => {
    for (const category of LEGACY_WP_ADMIN_CATEGORIES) {
      expect(getLegacyWpAdminPagesByCategory(category.id).length).toBeGreaterThan(0)
    }
  })

  test('category counts match the documented structure (5 / 4 / 3 / 1)', () => {
    expect(getLegacyWpAdminPagesByCategory('wordpress-operations')).toHaveLength(5)
    expect(getLegacyWpAdminPagesByCategory('charity-onboarding')).toHaveLength(4)
    expect(getLegacyWpAdminPagesByCategory('volunteer-programs')).toHaveLength(3)
    expect(getLegacyWpAdminPagesByCategory('reference')).toHaveLength(1)
  })

  test('getLegacyWpAdminHref returns the canonical path shape', () => {
    expect(getLegacyWpAdminHref('wordpress-domains')).toBe(
      `${LEGACY_WP_ADMIN_BASE}/wordpress-domains`
    )
  })

  test('getLegacyWpAdminPageBySlug round-trips for every known slug', () => {
    for (const page of LEGACY_WP_ADMIN_PAGES) {
      expect(getLegacyWpAdminPageBySlug(page.slug).slug).toBe(page.slug)
    }
    // Note: the slug parameter is type-constrained to the literal union
    // LegacyWpAdminSlug, so a "nonexistent" call would not compile.
    // TypeScript is the gate; no runtime test needed.
  })

  test('relatedFfcAdminPaths (when present) point at known top-level routes', () => {
    const allowedRelatedRoots = ['/training-plan', '/contributor-ladder', '/tech-stack']
    for (const page of LEGACY_WP_ADMIN_PAGES) {
      if (!page.relatedFfcAdminPaths) continue
      for (const related of page.relatedFfcAdminPaths) {
        expect(allowedRelatedRoots).toContain(related)
      }
    }
  })
})
