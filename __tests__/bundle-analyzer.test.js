/**
 * Bundle Analyzer Configuration Tests
 *
 * These tests validate the bundle analyzer configuration.
 */

const fs = require('fs')
const path = require('path')

describe('Bundle Analyzer Configuration Tests', () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const nextConfigPath = path.join(process.cwd(), 'next.config.js')

  describe('Bundle Analyzer Dependencies', () => {
    it('should have @next/bundle-analyzer as devDependency', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.devDependencies).toBeDefined()
      expect(packageJson.devDependencies['@next/bundle-analyzer']).toBeDefined()
    })
  })

  describe('Bundle Analyzer Scripts', () => {
    it('should have analyze script in package.json', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.scripts).toBeDefined()
      expect(packageJson.scripts.analyze).toBeDefined()
    })

    it('should set ANALYZE=true in analyze script', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.scripts.analyze).toContain('ANALYZE=true')
    })

    it('should run build in analyze script', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      expect(packageJson.scripts.analyze).toContain('build')
    })
  })

  describe('Next.js Configuration', () => {
    it('should have next.config.js file', () => {
      expect(fs.existsSync(nextConfigPath)).toBe(true)
    })

    it('should import withBundleAnalyzer', () => {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8')
      expect(nextConfigContent).toContain('@next/bundle-analyzer')
    })

    it('should configure bundle analyzer with ANALYZE environment variable', () => {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8')
      expect(nextConfigContent).toContain('ANALYZE')
    })

    it('should wrap nextConfig with withBundleAnalyzer', () => {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8')
      expect(nextConfigContent).toContain('withBundleAnalyzer')
    })

    it('should maintain static export configuration', () => {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8')
      expect(nextConfigContent).toContain("output: 'export'")
    })

    it('should maintain unoptimized images configuration', () => {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8')
      expect(nextConfigContent).toContain('unoptimized: true')
    })

    it('should maintain trailingSlash configuration', () => {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8')
      expect(nextConfigContent).toContain('trailingSlash: true')
    })
  })
})
