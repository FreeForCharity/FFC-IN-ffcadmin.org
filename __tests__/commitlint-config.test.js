/**
 * Commitlint Configuration Tests
 *
 * These tests validate the commit message linting configuration.
 */

const fs = require('fs')
const path = require('path')

describe('Commitlint Configuration Tests', () => {
  const commitlintConfigPath = path.join(process.cwd(), 'commitlint.config.js')
  const commitMsgHookPath = path.join(process.cwd(), '.husky/commit-msg')
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  describe('Commitlint Configuration File', () => {
    it('should have commitlint.config.js file', () => {
      expect(fs.existsSync(commitlintConfigPath)).toBe(true)
    })

    it('should extend conventional commits configuration', () => {
      const configContent = fs.readFileSync(commitlintConfigPath, 'utf-8')
      expect(configContent).toContain('@commitlint/config-conventional')
    })
  })

  describe('Commitlint Dependencies', () => {
    it('should have @commitlint/cli as devDependency', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.devDependencies).toBeDefined()
      expect(packageJson.devDependencies['@commitlint/cli']).toBeDefined()
    })

    it('should have @commitlint/config-conventional as devDependency', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.devDependencies).toBeDefined()
      expect(packageJson.devDependencies['@commitlint/config-conventional']).toBeDefined()
    })
  })

  describe('Husky commit-msg Hook', () => {
    it('should have commit-msg hook file', () => {
      expect(fs.existsSync(commitMsgHookPath)).toBe(true)
    })

    it('should run commitlint in commit-msg hook', () => {
      const hookContent = fs.readFileSync(commitMsgHookPath, 'utf-8')
      expect(hookContent).toContain('commitlint')
    })

    it('should pass commit message file to commitlint', () => {
      const hookContent = fs.readFileSync(commitMsgHookPath, 'utf-8')
      expect(hookContent).toContain('--edit')
    })

    it('should be executable', () => {
      const stats = fs.statSync(commitMsgHookPath)
      // Check if the file has execute permission (owner, group, or others)
      const isExecutable = (stats.mode & 0o111) !== 0
      expect(isExecutable).toBe(true)
    })
  })
})
