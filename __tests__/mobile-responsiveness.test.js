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
    // Next.js 16 with Turbopack uses static/chunks instead of static/css
    const outDirs = [
      path.join(__dirname, '..', 'out', '_next', 'static', 'chunks'),
      path.join(__dirname, '..', 'out', '_next', 'static', 'css'),
    ]

    for (const outDir of outDirs) {
      if (fs.existsSync(outDir)) {
        const cssFiles = fs.readdirSync(outDir).filter((file) => file.endsWith('.css'))
        if (cssFiles.length > 0) {
          const cssPath = path.join(outDir, cssFiles[0])
          cssContent = fs.readFileSync(cssPath, 'utf8')
          break
        }
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
    it('should have mobile hamburger menu button with xl:hidden class', () => {
      expect(htmlContent).toContain('xl:hidden')
      expect(htmlContent).toContain('Toggle menu')
    })

    it('should have desktop navigation with hidden xl:flex classes', () => {
      expect(htmlContent).toContain('hidden xl:flex')
    })

    it('should hide brand text on small screens with hidden sm:block', () => {
      expect(htmlContent).toContain('hidden sm:block')
    })
  })

  describe('CSS Media Queries', () => {
    it('should have sm breakpoint (640px = 40rem)', () => {
      // Tailwind v4 uses rem units: 40rem = 640px
      expect(cssContent).toMatch(/@media\s*\(min-width:40rem\)/)
    })

    it('should have md breakpoint (768px = 48rem)', () => {
      // Tailwind v4 uses rem units: 48rem = 768px
      expect(cssContent).toMatch(/@media\s*\(min-width:48rem\)/)
    })

    it('should have lg breakpoint (1024px = 64rem)', () => {
      // Tailwind v4 uses rem units: 64rem = 1024px
      expect(cssContent).toMatch(/@media\s*\(min-width:64rem\)/)
    })

    it('should include md:flex utility class', () => {
      expect(cssContent).toMatch(/\.md\\:flex\{display:flex\}/)
    })

    it('should include md:hidden utility class', () => {
      expect(cssContent).toMatch(/\.md\\:hidden\{display:none\}/)
    })

    it('should include sm:block utility class', () => {
      expect(cssContent).toMatch(/\.sm\\:block\{display:block\}/)
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
      expect(htmlContent).toMatch(/href="\/_next\/static\/(css|chunks)\//)
    })
  })
})
