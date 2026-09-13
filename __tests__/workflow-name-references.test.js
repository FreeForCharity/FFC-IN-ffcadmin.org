/**
 * Workflow name references resolve to a real workflow.
 *
 * `workflow_run.workflows` and the Actions API's `run.name` both match a
 * workflow's top-level `name:`, never a job's display name. Pointing either at
 * a job name fails silently: the trigger never fires, and the lookup falls
 * through to a fallback. ci-status.json published `status: "unknown"` for
 * weeks because `update-ci-status.yml` and `generate-ci-status.mjs` tracked
 * `Build, Test, and Verify` (ci.yml's job) instead of `CI - Build and Test`
 * (ci.yml's workflow). That is also why data PR #1079 sat unmergeable.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const workflowsDir = path.join(process.cwd(), '.github', 'workflows')

function loadWorkflows() {
  return fs
    .readdirSync(workflowsDir)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((file) => ({
      file,
      doc: yaml.load(fs.readFileSync(path.join(workflowsDir, file), 'utf-8')),
    }))
}

describe('Workflow name references', () => {
  const workflows = loadWorkflows()
  const declaredNames = new Set(workflows.map((w) => w.doc.name))

  it('finds workflow_run triggers to check', () => {
    const withTrigger = workflows.filter((w) => w.doc.on && w.doc.on.workflow_run)
    expect(withTrigger.length).toBeGreaterThan(0)
  })

  it('every workflow_run.workflows entry names a declared workflow, not a job', () => {
    const unresolved = []
    for (const { file, doc } of workflows) {
      const trigger = doc.on && doc.on.workflow_run
      if (!trigger) continue
      for (const name of trigger.workflows || []) {
        if (!declaredNames.has(name)) unresolved.push(`${file} -> ${name}`)
      }
    }
    expect(unresolved).toEqual([])
  })

  it('every workflow generate-ci-status.mjs tracks names a declared workflow', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'scripts', 'generate-ci-status.mjs'),
      'utf-8'
    )
    const match = source.match(/const TRACKED = \[([^\]]*)\]/)
    expect(match).not.toBeNull()
    const tracked = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
    expect(tracked.length).toBeGreaterThan(0)
    expect(tracked.filter((name) => !declaredNames.has(name))).toEqual([])
  })
})
