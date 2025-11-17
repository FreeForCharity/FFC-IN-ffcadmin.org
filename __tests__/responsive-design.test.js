/**
 * @jest-environment jsdom
 */

const fs = require('fs')
const path = require('path')

describe('Responsive Design', () => {
  let cssContent

  beforeAll(() => {
    // Find and read the CSS file from the build output
    const outDir = path.join(__dirname, '..', 'out', '_next', 'static', 'css')
    if (fs.existsSync(outDir)) {
      const cssFiles = fs.readdirSync(outDir).filter((file) => file.endsWith('.css'))
      if (cssFiles.length > 0) {
        const cssPath = path.join(outDir, cssFiles[0])
        cssContent = fs.readFileSync(cssPath, 'utf8')
      }
    }
  })

  describe('Tailwind CSS Responsive Utilities', () => {
    it('should include the hidden utility class', () => {
      expect(cssContent).toContain('.hidden{display:none}')
    })

    it('should include the block utility class', () => {
      expect(cssContent).toContain('.block{display:block}')
    })

    it('should include the flex utility class', () => {
      expect(cssContent).toContain('.flex{display:flex}')
    })

    it('should include md:flex responsive utility', () => {
      expect(cssContent).toMatch(/@media\s*\(min-width:768px\)/)
      expect(cssContent).toContain('.md\\:flex{display:flex}')
    })

    it('should include md:hidden responsive utility', () => {
      expect(cssContent).toContain('.md\\:hidden{display:none}')
    })

    it('should include md:block responsive utility', () => {
      expect(cssContent).toContain('.md\\:block{display:block}')
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
    it('should have sm breakpoint at 640px', () => {
      expect(cssContent).toMatch(/@media\s*\(min-width:640px\)/)
    })

    it('should have md breakpoint at 768px', () => {
      expect(cssContent).toMatch(/@media\s*\(min-width:768px\)/)
    })

    it('should have lg breakpoint at 1024px', () => {
      expect(cssContent).toMatch(/@media\s*\(min-width:1024px\)/)
    })
  })
})
