/**
 * GitHub Actions Workflow Dependencies Tests
 *
 * These tests ensure that workflows are properly configured with dependencies
 * to prevent premature deployment before CI and security checks complete.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

describe('Workflow Dependencies Tests', () => {
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows')
  const deployWorkflowPath = path.join(workflowsDir, 'deploy.yml')
  const ciWorkflowPath = path.join(workflowsDir, 'ci.yml')
  const codeqlWorkflowPath = path.join(workflowsDir, 'codeql-analysis.yml')

  describe('Test Case: Deploy Workflow Dependencies', () => {
    let deployWorkflow

    beforeAll(() => {
      const deployContent = fs.readFileSync(deployWorkflowPath, 'utf-8')
      deployWorkflow = yaml.load(deployContent)
    })

    it('should have deploy.yml workflow file', () => {
      expect(fs.existsSync(deployWorkflowPath)).toBe(true)
    })

    it('should use workflow_run trigger instead of push', () => {
      expect(deployWorkflow.on).toHaveProperty('workflow_run')
      expect(deployWorkflow.on).not.toHaveProperty('push')
    })

    it('should depend on CI - Build and Test workflow', () => {
      const workflows = deployWorkflow.on.workflow_run.workflows
      expect(workflows).toContain('CI - Build and Test')
    })

    it('should depend on CodeQL Security Analysis workflow', () => {
      const workflows = deployWorkflow.on.workflow_run.workflows
      expect(workflows).toContain('CodeQL Security Analysis')
    })

    it('should trigger on workflow completion', () => {
      const types = deployWorkflow.on.workflow_run.types
      expect(types).toContain('completed')
    })

    it('should only run on main branch', () => {
      const branches = deployWorkflow.on.workflow_run.branches
      expect(branches).toContain('main')
    })

    it('should check for successful workflow conclusion', () => {
      const buildJob = deployWorkflow.jobs.build
      expect(buildJob.if).toBeDefined()
      expect(buildJob.if).toMatch(/github\.event\.workflow_run\.conclusion/)
      expect(buildJob.if).toMatch(/success/)
    })

    it('should allow manual workflow_dispatch', () => {
      expect(deployWorkflow.on).toHaveProperty('workflow_dispatch')
    })

    it('should allow workflow_dispatch to bypass success check', () => {
      const buildJob = deployWorkflow.jobs.build
      expect(buildJob.if).toMatch(/workflow_dispatch/)
    })
  })

  describe('Test Case: CI and CodeQL Workflow Names', () => {
    it('should verify CI workflow has correct name', () => {
      const ciContent = fs.readFileSync(ciWorkflowPath, 'utf-8')
      const ciWorkflow = yaml.load(ciContent)
      expect(ciWorkflow.name).toBe('CI - Build and Test')
    })

    it('should verify CodeQL workflow has correct name', () => {
      const codeqlContent = fs.readFileSync(codeqlWorkflowPath, 'utf-8')
      const codeqlWorkflow = yaml.load(codeqlContent)
      expect(codeqlWorkflow.name).toBe('CodeQL Security Analysis')
    })
  })

  describe('Test Case: Workflow Independence', () => {
    it('should allow CI and CodeQL to run in parallel (no dependencies)', () => {
      const ciContent = fs.readFileSync(ciWorkflowPath, 'utf-8')
      const ciWorkflow = yaml.load(ciContent)

      // CI should trigger on push, not workflow_run
      expect(ciWorkflow.on).toHaveProperty('push')
      expect(ciWorkflow.on).not.toHaveProperty('workflow_run')
    })

    it('should allow CodeQL to run independently', () => {
      const codeqlContent = fs.readFileSync(codeqlWorkflowPath, 'utf-8')
      const codeqlWorkflow = yaml.load(codeqlContent)

      // CodeQL should trigger on push, not workflow_run
      expect(codeqlWorkflow.on).toHaveProperty('push')
      expect(codeqlWorkflow.on).not.toHaveProperty('workflow_run')
    })
  })
})
