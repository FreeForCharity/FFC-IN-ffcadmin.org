/**
 * Route Generation Tests
 *
 * These tests verify that all defined routes are properly generated as static pages.
 */

const fs = require('fs')
const path = require('path')

describe('Route Generation Tests', () => {
  const outDir = path.join(process.cwd(), 'out')

  describe('Test Case 4.1: Home Page Generation', () => {
    const indexPath = path.join(outDir, 'index.html')

    it('should generate index.html for home page', () => {
      expect(fs.existsSync(indexPath)).toBe(true)
    })

    it('should have home page with HTML content', () => {
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8')
        expect(content).toContain('<!DOCTYPE html>')
        expect(content).toContain('<html')
      }
    })

    it('should have home page with expected content', () => {
      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8')
        // Check for some expected content from the home page
        expect(content.length).toBeGreaterThan(1000)
      }
    })
  })

  describe('Test Case 4.1b: What FFC Delivers Page Generation', () => {
    const pagePath = path.join(outDir, 'what-ffc-delivers', 'index.html')

    it('should generate index.html for the what-ffc-delivers page', () => {
      expect(fs.existsSync(pagePath)).toBe(true)
    })

    it('should set a self-canonical URL', () => {
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf-8')
        expect(content).toContain(
          '<link rel="canonical" href="https://ffcadmin.org/what-ffc-delivers/"/>'
        )
      }
    })
  })

  describe('Test Case 4.2: Tech Stack Page Generation', () => {
    const techStackPath = path.join(outDir, 'tech-stack', 'index.html')

    it('should generate index.html for tech stack page', () => {
      expect(fs.existsSync(techStackPath)).toBe(true)
    })

    it('should have tech stack page with HTML content', () => {
      if (fs.existsSync(techStackPath)) {
        const content = fs.readFileSync(techStackPath, 'utf-8')
        expect(content).toContain('<!DOCTYPE html>')
        expect(content).toContain('<html')
      }
    })

    it('should have tech stack directory', () => {
      const techStackDir = path.join(outDir, 'tech-stack')
      expect(fs.existsSync(techStackDir)).toBe(true)
      if (fs.existsSync(techStackDir)) {
        const stats = fs.statSync(techStackDir)
        expect(stats.isDirectory()).toBe(true)
      }
    })
  })

  describe('Test Case 4.3: Training Plan Page Generation', () => {
    const trainingPlanPath = path.join(outDir, 'training-plan', 'index.html')

    it('should generate index.html for training plan page', () => {
      expect(fs.existsSync(trainingPlanPath)).toBe(true)
    })

    it('should have training plan page with HTML content', () => {
      if (fs.existsSync(trainingPlanPath)) {
        const content = fs.readFileSync(trainingPlanPath, 'utf-8')
        expect(content).toContain('<!DOCTYPE html>')
        expect(content).toContain('<html')
      }
    })

    it('should have training plan directory', () => {
      const trainingPlanDir = path.join(outDir, 'training-plan')
      expect(fs.existsSync(trainingPlanDir)).toBe(true)
      if (fs.existsSync(trainingPlanDir)) {
        const stats = fs.statSync(trainingPlanDir)
        expect(stats.isDirectory()).toBe(true)
      }
    })

    it('should have training plan page with expected content', () => {
      if (fs.existsSync(trainingPlanPath)) {
        const content = fs.readFileSync(trainingPlanPath, 'utf-8')
        expect(content).toContain('Operation Digital Sovereignty')
        expect(content).toContain('MS-900')
        expect(content).toContain('GitHub Foundations')
      }
    })
  })

  describe('Test Case 4.2b: Volunteer Recognition Page', () => {
    const pagePath = path.join(outDir, 'recognition', 'index.html')

    it('should generate index.html for the recognition page', () => {
      expect(fs.existsSync(pagePath)).toBe(true)
    })

    it('should set a self-canonical URL', () => {
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf-8')
        expect(content).toContain(
          '<link rel="canonical" href="https://ffcadmin.org/recognition/"/>'
        )
      }
    })
  })

  describe('Test Case 4.2d: Continuing Education Pages', () => {
    const pillarPath = path.join(outDir, 'continuing-education', 'index.html')
    // Derive slugs from the data so the test never drifts as bodies are added/removed.
    const { CE_LANDING_BODIES } = require('../src/data/ce-bodies')
    const landingSlugs = CE_LANDING_BODIES.map((b) => b.landing.slug)

    it('should generate the CE pillar page with a self-canonical URL', () => {
      expect(fs.existsSync(pillarPath)).toBe(true)
      if (fs.existsSync(pillarPath)) {
        const content = fs.readFileSync(pillarPath, 'utf-8')
        expect(content).toContain(
          '<link rel="canonical" href="https://ffcadmin.org/continuing-education/"/>'
        )
      }
    })

    it('should generate each per-body landing page with a self-canonical URL', () => {
      for (const slug of landingSlugs) {
        const p = path.join(outDir, 'continuing-education', slug, 'index.html')
        expect(fs.existsSync(p)).toBe(true)
        if (fs.existsSync(p)) {
          const content = fs.readFileSync(p, 'utf-8')
          expect(content).toContain(
            `<link rel="canonical" href="https://ffcadmin.org/continuing-education/${slug}/"/>`
          )
        }
      }
    })
  })

  describe('Test Case 4.2c: MOVSM Funnel Page', () => {
    const pagePath = path.join(outDir, 'movsm', 'index.html')

    it('should generate index.html for the MOVSM page', () => {
      expect(fs.existsSync(pagePath)).toBe(true)
    })

    it('should set a self-canonical URL and carry the DRAFT marker', () => {
      if (fs.existsSync(pagePath)) {
        const content = fs.readFileSync(pagePath, 'utf-8')
        expect(content).toContain('<link rel="canonical" href="https://ffcadmin.org/movsm/"/>')
        expect(content).toContain('DRAFT')
      }
    })
  })

  describe('Test Case 4.3a: New Volunteer Training Tracks', () => {
    const trackSlugs = ['google-workspace-admin', 'data-analytics']

    it('should generate index.html for each new training track', () => {
      for (const slug of trackSlugs) {
        const trackPath = path.join(outDir, 'training', slug, 'index.html')
        expect(fs.existsSync(trackPath)).toBe(true)
      }
    })

    it('each new track sets a self-canonical URL', () => {
      for (const slug of trackSlugs) {
        const trackPath = path.join(outDir, 'training', slug, 'index.html')
        if (fs.existsSync(trackPath)) {
          const content = fs.readFileSync(trackPath, 'utf-8')
          const expected = `https://ffcadmin.org/training/${slug}/`
          expect(content).toContain(`<link rel="canonical" href="${expected}"/>`)
        }
      }
    })
  })

  describe('Test Case 4.3b: Volunteer Recruitment Landing Pages', () => {
    const roleSlugs = [
      'web-developer',
      'microsoft-365-admin',
      'google-workspace-admin',
      'data-analytics',
      'canva-designer',
      'military-volunteers',
    ]

    it('should generate index.html for every volunteer role page', () => {
      for (const slug of roleSlugs) {
        const rolePath = path.join(outDir, 'volunteer', slug, 'index.html')
        expect(fs.existsSync(rolePath)).toBe(true)
      }
    })

    it('every role page sets a self-canonical URL', () => {
      for (const slug of roleSlugs) {
        const rolePath = path.join(outDir, 'volunteer', slug, 'index.html')
        if (fs.existsSync(rolePath)) {
          const content = fs.readFileSync(rolePath, 'utf-8')
          const expected = `https://ffcadmin.org/volunteer/${slug}/`
          expect(content).toContain(`<link rel="canonical" href="${expected}"/>`)
        }
      }
    })
  })

  describe('Test Case 4.1c: OpenGraph Images (#255)', () => {
    // The metadata image route is emitted as a static file; tolerate any
    // extension (e.g. `opengraph-image` or `opengraph-image.png`).
    const hasOgFile = (dir) =>
      fs.existsSync(dir) && fs.readdirSync(dir).some((f) => /^opengraph-image/.test(f))

    it('generates a branded site-wide OG image and sets og:image on the home page', () => {
      const home = path.join(outDir, 'index.html')
      if (fs.existsSync(home)) {
        const content = fs.readFileSync(home, 'utf-8')
        expect(content).toMatch(/property="og:image"[^>]*opengraph-image/)
      }
      expect(hasOgFile(outDir)).toBe(true)
    })

    it('gives every legacy WP admin leaf its own per-page OG image', () => {
      // Derive from the data so coverage never drifts as leaves are added.
      const { LEGACY_WP_ADMIN_PAGES } = require('../src/data/legacy-wordpress-administration')
      for (const { slug } of LEGACY_WP_ADMIN_PAGES) {
        const dir = path.join(outDir, 'legacy-wordpress-administration', slug)
        const leaf = path.join(dir, 'index.html')
        if (fs.existsSync(leaf)) {
          const content = fs.readFileSync(leaf, 'utf-8')
          // Each leaf points at its own opengraph-image, not the root one.
          expect(content).toMatch(
            new RegExp(
              `property="og:image"[^>]*legacy-wordpress-administration/${slug}/opengraph-image`
            )
          )
          expect(hasOgFile(dir)).toBe(true)
        }
      }
    })
  })

  describe('Test Case 4.4: Legacy WordPress Administration Section', () => {
    const sectionRoot = path.join(outDir, 'legacy-wordpress-administration')
    const hubPath = path.join(sectionRoot, 'index.html')

    const leafSlugs = [
      'wordpress-hosting-techstack',
      'wordpress-web-hosting',
      'wordpress-domains',
      'wordpress-cpanel-backup-sop',
      'wordpress-online-impacts-onboarding',
      'wordpress-charity-validation',
      'wordpress-guidestar-guide',
      'wordpress-service-delivery-stages',
      'wordpress-training-programs',
      'wordpress-web-developer-training',
      'wordpress-tools-for-success',
      'wordpress-volunteer-core-competencies',
      'wordpress-charity-offboarding',
      'wordpress-escalation-runbook',
    ]

    it('should generate the hub page', () => {
      expect(fs.existsSync(hubPath)).toBe(true)
    })

    it('should generate index.html for every leaf page', () => {
      for (const slug of leafSlugs) {
        const leafPath = path.join(sectionRoot, slug, 'index.html')
        expect(fs.existsSync(leafPath)).toBe(true)
      }
    })

    it('hub page contains the section title and at least one category', () => {
      if (fs.existsSync(hubPath)) {
        const content = fs.readFileSync(hubPath, 'utf-8')
        expect(content).toContain('Legacy WordPress Administration')
        expect(content).toContain('WordPress Operations')
      }
    })

    it('every leaf page contains the audience callout', () => {
      for (const slug of leafSlugs) {
        const leafPath = path.join(sectionRoot, slug, 'index.html')
        if (fs.existsSync(leafPath)) {
          const content = fs.readFileSync(leafPath, 'utf-8')
          // The PageHeader component renders this audience callout.
          expect(content).toMatch(/Looking to apply for a free FFC site\?/)
        }
      }
    })

    it('every leaf page sets a self-canonical URL', () => {
      for (const slug of leafSlugs) {
        const leafPath = path.join(sectionRoot, slug, 'index.html')
        if (fs.existsSync(leafPath)) {
          const content = fs.readFileSync(leafPath, 'utf-8')
          const expected = `https://ffcadmin.org/legacy-wordpress-administration/${slug}/`
          expect(content).toContain(`<link rel="canonical" href="${expected}"/>`)
        }
      }
    })
  })
})
