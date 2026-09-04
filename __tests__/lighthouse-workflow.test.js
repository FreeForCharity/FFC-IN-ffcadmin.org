/**
 * Lighthouse Workflow Configuration Tests
 *
 * These tests ensure that the Lighthouse CI workflow is properly configured
 * to build its own artifact instead of relying on artifact downloads.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

describe('Lighthouse Workflow Tests', () => {
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows')
  const lighthouseWorkflowPath = path.join(workflowsDir, 'lighthouse.yml')

  let lighthouseWorkflow

  beforeAll(() => {
    const lighthouseContent = fs.readFileSync(lighthouseWorkflowPath, 'utf-8')
    lighthouseWorkflow = yaml.load(lighthouseContent)
  })

  describe('Test Case: Lighthouse Workflow Exists', () => {
    it('should have lighthouse.yml workflow file', () => {
      expect(fs.existsSync(lighthouseWorkflowPath)).toBe(true)
    })

    it('should be named "Lighthouse CI"', () => {
      expect(lighthouseWorkflow.name).toBe('Lighthouse CI')
    })
  })

  describe('Test Case: Workflow Triggers', () => {
    it('should trigger on deployment workflow completion', () => {
      expect(lighthouseWorkflow.on).toHaveProperty('workflow_run')
      const workflowRun = lighthouseWorkflow.on.workflow_run
      expect(workflowRun.workflows).toContain('Deploy to GitHub Pages')
      expect(workflowRun.types).toContain('completed')
      expect(workflowRun.branches).toContain('main')
    })

    it('should allow manual workflow_dispatch', () => {
      expect(lighthouseWorkflow.on).toHaveProperty('workflow_dispatch')
    })
  })

  describe('Test Case: Build Own Artifact (No Download)', () => {
    let lighthouseJob

    beforeAll(() => {
      lighthouseJob = lighthouseWorkflow.jobs.lighthouse
    })

    it('should NOT have artifact download step', () => {
      const downloadStep = lighthouseJob.steps.find(
        (step) =>
          step.name &&
          step.name.toLowerCase().includes('download') &&
          step.uses?.includes('artifact')
      )
      expect(downloadStep).toBeUndefined()
    })

    it('should have pnpm setup step without conditions', () => {
      const pnpmStep = lighthouseJob.steps.find((step) => step.uses?.includes('pnpm/action-setup'))
      expect(pnpmStep).toBeDefined()
      expect(pnpmStep.if).toBeUndefined() // No conditional - runs for all triggers
    })

    it('should have Node.js setup step without conditions', () => {
      const nodeStep = lighthouseJob.steps.find((step) => step.uses?.includes('actions/setup-node'))
      expect(nodeStep).toBeDefined()
      expect(nodeStep.if).toBeUndefined() // No conditional - runs for all triggers
    })

    it('should have install dependencies step without conditions', () => {
      const installStep = lighthouseJob.steps.find(
        (step) => step.name && step.name.includes('Install dependencies')
      )
      expect(installStep).toBeDefined()
      expect(installStep.if).toBeUndefined() // No conditional - runs for all triggers
      expect(installStep.run).toContain('pnpm install --frozen-lockfile')
    })

    it('should have build project step without conditions', () => {
      const buildStep = lighthouseJob.steps.find(
        (step) => step.name && step.name.includes('Build project')
      )
      expect(buildStep).toBeDefined()
      expect(buildStep.if).toBeUndefined() // No conditional - runs for all triggers
      expect(buildStep.run).toContain('pnpm run build')
    })
  })

  describe('Test Case: Lighthouse Execution', () => {
    let lighthouseJob

    beforeAll(() => {
      lighthouseJob = lighthouseWorkflow.jobs.lighthouse
    })

    it('should verify build output exists before running Lighthouse', () => {
      const verifyStep = lighthouseJob.steps.find(
        (step) => step.name && step.name.includes('Verify build output')
      )
      expect(verifyStep).toBeDefined()
      expect(verifyStep.run).toContain('./out')
    })

    // Lighthouse CI used to be fetched at run time with
    // `npm install -g @lhci/cli`, which bypassed both the lockfile and the
    // repo's 7-day release cooldown. It is now a pinned devDependency, so
    // the assertions below check that stronger contract instead: the tool
    // must be declared in package.json, resolved by `pnpm install`, and
    // invoked through `pnpm exec` -- and no step may fetch it ad hoc.
    it('should declare @lhci/cli as a devDependency rather than fetching it at run time', () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'))
      expect(pkg.devDependencies).toHaveProperty('@lhci/cli')
    })

    it('should install dependencies before running Lighthouse', () => {
      const stepRuns = lighthouseJob.steps.map((step) => step.run || '')
      const installIndex = stepRuns.findIndex((run) => run.includes('pnpm install'))
      const lhciIndex = stepRuns.findIndex((run) => run.includes('lhci autorun'))
      expect(installIndex).toBeGreaterThanOrEqual(0)
      expect(lhciIndex).toBeGreaterThan(installIndex)
    })

    it('should not fetch Lighthouse CI outside the lockfile', () => {
      // @lhci/cli is declared in package.json, so no workflow step has any
      // reason to name the package: a step that does is fetching it. This
      // catches every ad-hoc form, not just the npm ones — `pnpm add`,
      // `pnpm add -g`, `pnpm dlx`, `npx` and `yarn add` all name it.
      for (const step of lighthouseJob.steps) {
        expect(step.run || '').not.toContain('@lhci/cli')
      }
      // And the binary itself must not be invoked through a fetching runner.
      for (const step of lighthouseJob.steps) {
        expect(step.run || '').not.toMatch(/\b(npx|pnpm dlx|yarn dlx|bunx)\s+(--\S+\s+)*lhci\b/)
      }
    })

    it('should run Lighthouse audit', () => {
      const runStep = lighthouseJob.steps.find(
        (step) => step.name && step.name.includes('Run Lighthouse CI')
      )
      expect(runStep).toBeDefined()
      // pnpm exec, so the pinned devDependency is what runs.
      expect(runStep.run).toContain('pnpm exec lhci autorun')
    })

    it('should upload Lighthouse results', () => {
      const uploadStep = lighthouseJob.steps.find(
        (step) => step.name && step.name.includes('Upload Lighthouse results')
      )
      expect(uploadStep).toBeDefined()
      expect(uploadStep.uses).toContain('actions/upload-artifact')
      expect(uploadStep.with.name).toBe('lighthouse-results')
      expect(uploadStep.with.path).toBe('.lighthouseci')
    })
  })

  describe('Test Case: Job Conditions', () => {
    let lighthouseJob

    beforeAll(() => {
      lighthouseJob = lighthouseWorkflow.jobs.lighthouse
    })

    it('should only run if deployment succeeded or manual trigger', () => {
      expect(lighthouseJob.if).toBeDefined()
      expect(lighthouseJob.if).toContain("github.event.workflow_run.conclusion == 'success'")
      expect(lighthouseJob.if).toContain("github.event_name == 'workflow_dispatch'")
    })
  })
})
