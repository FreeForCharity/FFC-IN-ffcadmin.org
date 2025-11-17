/**
 * @jest-environment jsdom
 */

const fs = require('fs')
const path = require('path')

describe('Mobile Responsiveness', () => {
  let htmlContent
  let cssContent

  beforeAll(() => {
    // Read the HTML file
    const indexPath = path.join(__dirname, '..', 'out', 'index.html')
    if (fs.existsSync(indexPath)) {
      htmlContent = fs.readFileSync(indexPath, 'utf8')
    }

    // Find and read the CSS file
    const outDir = path.join(__dirname, '..', 'out', '_next', 'static', 'css')
    if (fs.existsSync(outDir)) {
      const cssFiles = fs.readdirSync(outDir).filter((file) => file.endsWith('.css'))
      if (cssFiles.length > 0) {
        const cssPath = path.join(outDir, cssFiles[0])
        cssContent = fs.readFileSync(cssPath, 'utf8')
      }
    }
  })

  describe('Viewport Configuration', () => {
    it('should have viewport meta tag with device-width', () => {
      expect(htmlContent).toContain('name="viewport"')
      expect(htmlContent).toContain('width=device-width')
    })

    it('should have initial-scale=1', () => {
      expect(htmlContent).toContain('initial-scale=1')
    })
  })

  describe('Responsive Navigation', () => {
    it('should have mobile hamburger menu button with md:hidden class', () => {
      expect(htmlContent).toContain('md:hidden')
      expect(htmlContent).toContain('Toggle menu')
    })

    it('should have desktop navigation with hidden md:flex classes', () => {
      expect(htmlContent).toContain('hidden md:flex')
    })

    it('should hide brand text on small screens with hidden sm:block', () => {
      expect(htmlContent).toContain('hidden sm:block')
    })
  })

  describe('CSS Media Queries', () => {
    it('should have sm breakpoint (640px)', () => {
      expect(cssContent).toMatch(/@media\s*\(min-width:\s*640px\)/)
    })

    it('should have md breakpoint (768px)', () => {
      expect(cssContent).toMatch(/@media\s*\(min-width:\s*768px\)/)
    })

    it('should have lg breakpoint (1024px)', () => {
      expect(cssContent).toMatch(/@media\s*\(min-width:\s*1024px\)/)
    })

    it('should include md:flex utility class', () => {
      expect(cssContent).toMatch(/\.md\\:flex\s*\{\s*display\s*:\s*flex\s*\}/)
    })

    it('should include md:hidden utility class', () => {
      expect(cssContent).toMatch(/\.md\\:hidden\s*\{\s*display\s*:\s*none\s*\}/)
    })

    it('should include sm:block utility class', () => {
      expect(cssContent).toMatch(/\.sm\\:block\s*\{\s*display\s*:\s*block\s*\}/)
    })
  })

  describe('Mobile Layout Classes', () => {
    it('should have flex-col for mobile stacking', () => {
      expect(htmlContent).toContain('flex-col')
    })

    it('should have sm:flex-row for desktop horizontal layout', () => {
      expect(htmlContent).toContain('sm:flex-row')
    })

    it('should have responsive padding classes', () => {
      expect(htmlContent).toMatch(/px-4|sm:px-6|lg:px-8/)
    })

    it('should have responsive text sizes', () => {
      expect(htmlContent).toMatch(/text-\w+\s+md:text-\w+/)
    })
  })

  describe('GitHub Pages Compatibility', () => {
    it('should have .nojekyll file to prevent Jekyll processing', () => {
      const nojekyllPath = path.join(__dirname, '..', 'out', '.nojekyll')
      expect(fs.existsSync(nojekyllPath)).toBe(true)
    })

    it('should reference CSS from root path (custom domain)', () => {
      expect(htmlContent).toMatch(/href="\/_next\/static\/css\//)
    })
  })
})
