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
