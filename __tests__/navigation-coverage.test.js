/**
 * Navigation Coverage Tests
 *
 * These tests ensure that all application pages are accessible through at least one
 * navigation area (desktop navigation, mobile navigation, or footer navigation).
 *
 * This prevents the scenario where pages exist but users cannot discover or access them.
 */

const fs = require('fs')
const path = require('path')

describe('Navigation Coverage', () => {
  // Define all application pages that should be accessible
  const applicationPages = [
    { path: '/', name: 'Home' },
    { path: '/tech-stack', name: 'Tech Stack' },
    { path: '/contributor-ladder', name: 'Contributor Ladder' },
    { path: '/documentation', name: 'Documentation' },
    { path: '/testing', name: 'Testing' },
    { path: '/training-plan', name: 'Training Plan' },
    { path: '/privacy-policy', name: 'Privacy Policy' },
    { path: '/cookie-policy', name: 'Cookie Policy' },
  ]

  let navigationComponent
  let footerComponent

  beforeAll(() => {
    // Read Navigation component
    const navPath = path.join(__dirname, '../app/components/Navigation.tsx')
    navigationComponent = fs.readFileSync(navPath, 'utf8')

    // Read Footer component
    const footerPath = path.join(__dirname, '../app/components/Footer.tsx')
    footerComponent = fs.readFileSync(footerPath, 'utf8')
  })

  describe('All pages must be accessible from navigation', () => {
    applicationPages.forEach((page) => {
      test(`${page.name} (${page.path}) is accessible from at least one navigation area`, () => {
        const isInNavigation = navigationComponent.includes(page.path)
        const isInFooter = footerComponent.includes(page.path)

        expect(isInNavigation || isInFooter).toBe(true)

        // Log where the page is accessible from for debugging
        const locations = []
        if (isInNavigation) locations.push('Navigation')
        if (isInFooter) locations.push('Footer')

        console.log(`  ✓ ${page.name} accessible from: ${locations.join(', ')}`)
      })
    })
  })

  describe('Navigation component structure', () => {
    test('Navigation component file exists', () => {
      expect(navigationComponent).toBeDefined()
      expect(navigationComponent.length).toBeGreaterThan(0)
    })

    test('Navigation has desktop menu section', () => {
      expect(navigationComponent).toContain('Desktop Navigation')
    })

    test('Navigation has mobile menu section', () => {
      expect(navigationComponent).toContain('Mobile menu')
    })

    test('Navigation contains Link imports from Next.js', () => {
      expect(navigationComponent).toContain("import Link from 'next/link'")
    })
  })

  describe('Footer component structure', () => {
    test('Footer component file exists', () => {
      expect(footerComponent).toBeDefined()
      expect(footerComponent.length).toBeGreaterThan(0)
    })

    test('Footer has Quick Links section', () => {
      expect(footerComponent).toContain('Quick Links')
    })

    test('Footer has Learning Paths section', () => {
      expect(footerComponent).toContain('Learning Paths')
    })

    test('Footer has Free For Charity Policy section', () => {
      expect(footerComponent).toContain('Free For Charity Policy')
    })

    test('Footer contains Link imports from Next.js', () => {
      expect(footerComponent).toContain("import Link from 'next/link'")
    })
  })

  describe('External links', () => {
    test('GitHub link is present in navigation', () => {
      expect(navigationComponent).toContain('https://github.com/FreeForCharity')
    })

    test('Social media links are present in footer', () => {
      expect(footerComponent).toContain('facebook.com/FreeForCharity')
      expect(footerComponent).toContain('youtube.com/@FreeForCharity')
      expect(footerComponent).toContain('twitter.com/FreeForCharity')
      expect(footerComponent).toContain('linkedin.com/company/freeforcharity')
    })
  })

  describe('Accessibility - All pages discoverable', () => {
    test('No orphaned pages - all pages have at least one navigation entry point', () => {
      const orphanedPages = applicationPages.filter((page) => {
        const isInNavigation = navigationComponent.includes(page.path)
        const isInFooter = footerComponent.includes(page.path)
        return !isInNavigation && !isInFooter
      })

      if (orphanedPages.length > 0) {
        console.error('Orphaned pages found:', orphanedPages)
      }

      expect(orphanedPages).toEqual([])
    })
  })
})
