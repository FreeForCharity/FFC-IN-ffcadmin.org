/**
 * EditorConfig Tests
 *
 * These tests validate the EditorConfig file existence and basic structure.
 */

const fs = require('fs')
const path = require('path')

describe('EditorConfig Tests', () => {
  const editorconfigPath = path.join(process.cwd(), '.editorconfig')

  describe('EditorConfig File Existence', () => {
    it('should have .editorconfig file', () => {
      expect(fs.existsSync(editorconfigPath)).toBe(true)
    })

    it('should be a valid file', () => {
      const stats = fs.statSync(editorconfigPath)
      expect(stats.isFile()).toBe(true)
    })
  })

  describe('EditorConfig Content', () => {
    let editorconfigContent

    beforeAll(() => {
      editorconfigContent = fs.readFileSync(editorconfigPath, 'utf-8')
    })

    it('should specify root = true', () => {
      expect(editorconfigContent).toContain('root = true')
    })

    it('should configure charset', () => {
      expect(editorconfigContent).toContain('charset')
    })

    it('should configure end_of_line', () => {
      expect(editorconfigContent).toContain('end_of_line')
    })

    it('should configure indent_style', () => {
      expect(editorconfigContent).toContain('indent_style')
    })

    it('should configure indent_size', () => {
      expect(editorconfigContent).toContain('indent_size')
    })

    it('should configure insert_final_newline', () => {
      expect(editorconfigContent).toContain('insert_final_newline')
    })

    it('should configure trim_trailing_whitespace', () => {
      expect(editorconfigContent).toContain('trim_trailing_whitespace')
    })

    it('should have markdown-specific configuration', () => {
      expect(editorconfigContent).toContain('[*.md]')
    })

    it('should have YAML-specific configuration', () => {
      expect(editorconfigContent).toMatch(/\[.*ya?ml.*\]/)
    })

    it('should have JSON-specific configuration', () => {
      expect(editorconfigContent).toContain('[*.json]')
    })
  })
})
