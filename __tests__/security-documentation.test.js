/**
 * Security Documentation Tests
 *
 * These tests verify that security documentation is properly configured.
 */

const fs = require('fs')
const path = require('path')

describe('Security Documentation Tests', () => {
  const rootDir = process.cwd()
  const securityPath = path.join(rootDir, 'SECURITY.md')

  describe('SECURITY.md File', () => {
    it('should have SECURITY.md file in root directory', () => {
      expect(fs.existsSync(securityPath)).toBe(true)
    })

    it('should have SECURITY.md be a file (not directory)', () => {
      if (fs.existsSync(securityPath)) {
        const stats = fs.statSync(securityPath)
        expect(stats.isFile()).toBe(true)
      }
    })

    it('should have SECURITY.md with substantial content', () => {
      if (fs.existsSync(securityPath)) {
        const content = fs.readFileSync(securityPath, 'utf-8')
        expect(content.length).toBeGreaterThan(100)
      }
    })
  })

  describe('Required Security Policy Sections', () => {
    let securityContent

    beforeAll(() => {
      if (fs.existsSync(securityPath)) {
        securityContent = fs.readFileSync(securityPath, 'utf-8')
      }
    })

    it('should contain Supported Versions section', () => {
      if (securityContent) {
        expect(securityContent).toMatch(/##\s*Supported\s+Versions/i)
      }
    })

    it('should contain Reporting a Vulnerability section', () => {
      if (securityContent) {
        expect(securityContent).toMatch(/##\s*Reporting\s+a?\s*Vulnerability/i)
      }
    })

    it('should contain Security Features section', () => {
      if (securityContent) {
        expect(securityContent).toMatch(/##\s*Security\s+Features/i)
      }
    })

    it('should mention CodeQL security scanning', () => {
      if (securityContent) {
        expect(securityContent).toMatch(/CodeQL/i)
      }
    })

    it('should mention Dependabot', () => {
      if (securityContent) {
        expect(securityContent).toMatch(/Dependabot/i)
      }
    })

    it('should mention GPG signing', () => {
      if (securityContent) {
        expect(securityContent).toMatch(/GPG/i)
      }
    })

    it('should provide contact information or reporting process', () => {
      if (securityContent) {
        expect(
          securityContent.match(/security\s+advisory/i) ||
            securityContent.match(/report/i) ||
            securityContent.match(/contact/i)
        ).toBeTruthy()
      }
    })
  })

  describe('Security Best Practices', () => {
    let securityContent

    beforeAll(() => {
      if (fs.existsSync(securityPath)) {
        securityContent = fs.readFileSync(securityPath, 'utf-8')
      }
    })

    it('should reference the project repository', () => {
      if (securityContent) {
        expect(securityContent).toMatch(/github\.com\/FreeForCharity\/ffcadmin\.org/i)
      }
    })

    it('should link to other security documentation', () => {
      if (securityContent) {
        // Should reference at least one of these docs
        const hasDocLinks =
          securityContent.includes('GPG_SIGNING.md') ||
          securityContent.includes('CODE_QUALITY.md') ||
          securityContent.includes('CONTRIBUTING.md')
        expect(hasDocLinks).toBe(true)
      }
    })

    it('should have a last updated date', () => {
      if (securityContent) {
        expect(securityContent).toMatch(/last\s+updated/i)
      }
    })
  })
})
