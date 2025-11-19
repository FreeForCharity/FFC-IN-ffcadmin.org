/**
 * Lighthouse Configuration Tests
 *
 * These tests verify that the Lighthouse CI configuration is valid and properly set up.
 */

const fs = require('fs')
const path = require('path')

describe('Lighthouse Configuration Tests', () => {
  const lighthouseConfigPath = path.join(process.cwd(), 'lighthouserc.json')
  const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'lighthouse.yml')

  describe('Test Case: Lighthouse Configuration File Exists', () => {
    it('should have a lighthouserc.json file', () => {
      expect(fs.existsSync(lighthouseConfigPath)).toBe(true)
    })

    it('should be valid JSON', () => {
      if (fs.existsSync(lighthouseConfigPath)) {
        const content = fs.readFileSync(lighthouseConfigPath, 'utf8')
        expect(() => JSON.parse(content)).not.toThrow()
      }
    })
  })

  describe('Test Case: Lighthouse Configuration Structure', () => {
    let config

    beforeAll(() => {
      if (fs.existsSync(lighthouseConfigPath)) {
        const content = fs.readFileSync(lighthouseConfigPath, 'utf8')
        config = JSON.parse(content)
      }
    })

    it('should have ci property', () => {
      expect(config).toHaveProperty('ci')
    })

    it('should have collect configuration', () => {
      expect(config.ci).toHaveProperty('collect')
      expect(config.ci.collect).toHaveProperty('staticDistDir')
      expect(config.ci.collect.staticDistDir).toBe('./out')
    })

    it('should have assert configuration', () => {
      expect(config.ci).toHaveProperty('assert')
      expect(config.ci.assert).toHaveProperty('assertions')
    })

    it('should configure audits for key pages', () => {
      expect(config.ci.collect).toHaveProperty('url')
      expect(Array.isArray(config.ci.collect.url)).toBe(true)
      expect(config.ci.collect.url.length).toBeGreaterThan(0)
    })

    it('should run multiple times for consistent results', () => {
      expect(config.ci.collect).toHaveProperty('numberOfRuns')
      expect(config.ci.collect.numberOfRuns).toBeGreaterThanOrEqual(3)
    })

    it('should check performance, accessibility, best-practices, and seo', () => {
      const assertions = config.ci.assert.assertions
      expect(assertions).toHaveProperty('categories:performance')
      expect(assertions).toHaveProperty('categories:accessibility')
      expect(assertions).toHaveProperty('categories:best-practices')
      expect(assertions).toHaveProperty('categories:seo')
    })
  })

  describe('Test Case: Lighthouse Workflow Exists', () => {
    it('should have a lighthouse.yml workflow file', () => {
      expect(fs.existsSync(workflowPath)).toBe(true)
    })

    it('should be valid YAML', () => {
      if (fs.existsSync(workflowPath)) {
        const content = fs.readFileSync(workflowPath, 'utf8')
        // Basic YAML validation - check it's not empty and has expected structure
        expect(content.length).toBeGreaterThan(0)
        expect(content).toContain('name: Lighthouse CI')
        expect(content).toContain('workflow_run')
      }
    })

    it('should run after deployment workflow', () => {
      if (fs.existsSync(workflowPath)) {
        const content = fs.readFileSync(workflowPath, 'utf8')
        expect(content).toContain("workflows: ['Deploy to GitHub Pages']")
      }
    })
  })
})
