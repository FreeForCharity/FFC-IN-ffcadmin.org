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

    // Note: workflow_run with multiple workflows triggers when ANY ONE completes.
    // The actual verification that BOTH succeeded is handled by a separate check-workflows job
    // using GitHub Actions API to check both workflow statuses.
    it('should have check-workflows job to verify both workflows succeeded', () => {
      expect(deployWorkflow.jobs).toHaveProperty('check-workflows')
      const checkWorkflowsJob = deployWorkflow.jobs['check-workflows']
      expect(checkWorkflowsJob.outputs).toHaveProperty('should_deploy')

      const checkStep = checkWorkflowsJob.steps.find(
        (step) => step.id === 'check' || step.name.includes('workflows status')
      )
      expect(checkStep).toBeDefined()
      expect(checkStep.uses).toBe('actions/github-script@v8')
      expect(checkStep.with.script).toContain('CI - Build and Test')
      expect(checkStep.with.script).toContain('CodeQL Security Analysis')
      expect(checkStep.with.script).toContain("conclusion !== 'success'")
    })

    it('should have build job depend on check-workflows job', () => {
      const buildJob = deployWorkflow.jobs.build
      expect(buildJob.needs).toBe('check-workflows')
    })

    it('should conditionally run build job only when should_deploy is true', () => {
      const buildJob = deployWorkflow.jobs.build
      expect(buildJob.if).toBe("needs.check-workflows.outputs.should_deploy == 'true'")
    })

    it('should trigger on workflow completion', () => {
      const types = deployWorkflow.on.workflow_run.types
      expect(types).toContain('completed')
    })

    it('should only run on main branch', () => {
      const branches = deployWorkflow.on.workflow_run.branches
      expect(branches).toContain('main')
    })

    it('should allow manual workflow_dispatch', () => {
      expect(deployWorkflow.on).toHaveProperty('workflow_dispatch')
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
