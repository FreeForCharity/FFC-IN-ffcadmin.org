/**
 * @jest-environment jsdom
 */

const fs = require('fs')
const path = require('path')

describe('Responsive Design', () => {
  let cssContent

  beforeAll(() => {
    // Find and read the CSS file from the build output
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

  describe('Tailwind CSS Responsive Utilities', () => {
    it('should include the hidden utility class', () => {
      // Tailwind v4 uses .hidden{display:none}
      expect(cssContent).toMatch(/\.hidden\{display:none\}/)
    })

    it('should include the block utility class', () => {
      // Tailwind v4 uses .block{display:block}
      expect(cssContent).toMatch(/\.block\{display:block\}/)
    })

    it('should include the flex utility class', () => {
      // Tailwind v4 uses .flex{display:flex}
      expect(cssContent).toMatch(/\.flex\{display:flex\}/)
    })

    it('should include md:flex responsive utility', () => {
      // Tailwind v4 uses rem units: 48rem = 768px
      expect(cssContent).toMatch(/@media\s*\(min-width:48rem\)/)
      expect(cssContent).toMatch(/\.md\\:flex\{display:flex\}/)
    })

    it('should include md:hidden responsive utility', () => {
      // Tailwind v4 uses .md\:hidden{display:none}
      expect(cssContent).toMatch(/\.md\\:hidden\{display:none\}/)
    })

    it('should include md:block responsive utility', () => {
      // Tailwind v4 uses .md\:block{display:block}
      expect(cssContent).toMatch(/\.md\\:block\{display:block\}/)
    })
  })

  describe('Navigation Responsive Classes', () => {
    let htmlContent

    beforeAll(() => {
      const indexPath = path.join(__dirname, '..', 'out', 'index.html')
      if (fs.existsSync(indexPath)) {
        htmlContent = fs.readFileSync(indexPath, 'utf8')
      }
    })

    it('should have desktop navigation with hidden md:flex classes', () => {
      expect(htmlContent).toContain('hidden md:flex')
    })

    it('should have mobile menu button with md:hidden class', () => {
      expect(htmlContent).toContain('md:hidden')
    })
  })

  describe('Breakpoint Configuration', () => {
    it('should have sm breakpoint at 640px (40rem)', () => {
      // Tailwind v4 uses rem units: 40rem = 640px
      expect(cssContent).toMatch(/@media\s*\(min-width:40rem\)/)
    })

    it('should have md breakpoint at 768px (48rem)', () => {
      // Tailwind v4 uses rem units: 48rem = 768px
      expect(cssContent).toMatch(/@media\s*\(min-width:48rem\)/)
    })

    it('should have lg breakpoint at 1024px (64rem)', () => {
      // Tailwind v4 uses rem units: 64rem = 1024px
      expect(cssContent).toMatch(/@media\s*\(min-width:64rem\)/)
    })
  })
})
