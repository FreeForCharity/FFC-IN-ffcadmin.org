/**
 * Configuration Validation Tests
 *
 * These tests validate the project configuration files.
 */

const fs = require('fs')
const path = require('path')

describe('Configuration Validation Tests', () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const pnpmLockPath = path.join(process.cwd(), 'pnpm-lock.yaml')

  describe('Test Case 5.1: Package.json Node Version', () => {
    it('should have package.json file', () => {
      expect(fs.existsSync(packageJsonPath)).toBe(true)
    })

    it('should specify Node.js version requirement', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.engines).toBeDefined()
      expect(packageJson.engines.node).toBeDefined()
    })

    it('should require Node.js version >= 20.0.0', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const nodeVersion = packageJson.engines?.node
      expect(nodeVersion).toMatch(/>=?\s*20/)
    })

    it('should have pnpm as package manager', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.packageManager).toBeDefined()
      expect(packageJson.packageManager).toMatch(/pnpm@/)
    })
  })

  describe('Test Case 5.2: Package Manager Lock File', () => {
    it('should have pnpm-lock.yaml file', () => {
      expect(fs.existsSync(pnpmLockPath)).toBe(true)
    })

    it('should have pnpm-lock.yaml be a file', () => {
      if (fs.existsSync(pnpmLockPath)) {
        const stats = fs.statSync(pnpmLockPath)
        expect(stats.isFile()).toBe(true)
      }
    })

    it('should have pnpm-lock.yaml with valid YAML content', () => {
      if (fs.existsSync(pnpmLockPath)) {
        const content = fs.readFileSync(pnpmLockPath, 'utf-8')
        // Check for lockfile version indicator
        expect(content).toContain('lockfileVersion')
      }
    })

    it('should have dependencies locked in pnpm-lock.yaml', () => {
      if (fs.existsSync(pnpmLockPath)) {
        const content = fs.readFileSync(pnpmLockPath, 'utf-8')
        // Check that it contains package references
        expect(content.length).toBeGreaterThan(1000)
      }
    })
  })

  describe('Test Case 5.3: TypeScript Configuration', () => {
    it('should have type-check script in package.json', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.scripts['type-check']).toBeDefined()
      expect(packageJson.scripts['type-check']).toContain('tsc')
      expect(packageJson.scripts['type-check']).toContain('--noEmit')
    })
  })

  describe('Test Case 5.4: lint-staged Configuration', () => {
    it('should have lint-staged configuration in package.json', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson['lint-staged']).toBeDefined()
    })

    it('should include correct file patterns for JS/TS files', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const lintStaged = packageJson['lint-staged']
      expect(lintStaged['*.{js,jsx,ts,tsx}']).toBeDefined()
    })

    it('should include correct file patterns for JSON/MD/CSS files', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const lintStaged = packageJson['lint-staged']
      expect(lintStaged['*.{json,md,css}']).toBeDefined()
    })

    it('should run prettier before eslint for JS/TS files', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const commands = packageJson['lint-staged']['*.{js,jsx,ts,tsx}']
      expect(commands).toBeInstanceOf(Array)
      expect(commands.length).toBeGreaterThanOrEqual(2)
      // Prettier should come before ESLint (format before lint)
      expect(commands[0]).toContain('prettier')
      expect(commands[1]).toContain('eslint')
    })

    it('should run prettier for JSON/MD/CSS files', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const commands = packageJson['lint-staged']['*.{json,md,css}']
      expect(commands).toBeInstanceOf(Array)
      expect(commands.some((cmd) => cmd.includes('prettier'))).toBe(true)
    })
  })

  describe('Test Case 5.5: Test Coverage Configuration', () => {
    const jestConfigPath = path.join(process.cwd(), 'jest.config.js')

    it('should have jest.config.js file', () => {
      expect(fs.existsSync(jestConfigPath)).toBe(true)
    })

    it('should have coverage thresholds defined in jest.config.js', () => {
      const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf-8')
      expect(jestConfigContent).toContain('coverageThreshold')
    })

    it('should have global coverage thresholds', () => {
      const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf-8')
      expect(jestConfigContent).toContain('global')
    })

    it('should specify branches threshold', () => {
      const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf-8')
      expect(jestConfigContent).toContain('branches')
    })

    it('should specify functions threshold', () => {
      const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf-8')
      expect(jestConfigContent).toContain('functions')
    })

    it('should specify lines threshold', () => {
      const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf-8')
      expect(jestConfigContent).toContain('lines')
    })

    it('should specify statements threshold', () => {
      const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf-8')
      expect(jestConfigContent).toContain('statements')
    })
  })
})
