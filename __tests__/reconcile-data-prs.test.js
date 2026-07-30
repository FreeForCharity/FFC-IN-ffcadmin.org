/**
 * Unit tests for the data-PR reconciler (`scripts/reconcile-data-prs.mjs`) and
 * its workflow — FFC-Cloudflare-Automation#908.
 *
 * Two things are locked in here:
 *
 *  1. The decision logic, exercised directly (no network): what gets updated,
 *     what gets auto-merge armed, what is left alone, and when the run must go
 *     red instead of reporting a silent success.
 *  2. Coverage against drift: every workflow that opens a PR on a long-lived
 *     refresh branch must use a branch the reconciler actually sweeps. A future
 *     data workflow on a differently-named branch would otherwise be quietly
 *     uncovered — the same class of invisibility this issue is about.
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const HOUR = 3600000

let isDataBranch,
  planFor,
  decideRunOutcome,
  buildSummary,
  main,
  DATA_BRANCH_PREFIX,
  DEFAULT_STUCK_AFTER_MS

beforeAll(async () => {
  // Read at module scope by the script, so they must be set before the import.
  process.env.GITHUB_TOKEN = 'test-token'
  process.env.GITHUB_REPOSITORY = 'FreeForCharity/FFC-IN-ffcadmin.org'
  delete process.env.GITHUB_STEP_SUMMARY
  const mod = await import('../scripts/reconcile-data-prs.mjs')
  isDataBranch = mod.isDataBranch
  planFor = mod.planFor
  decideRunOutcome = mod.decideRunOutcome
  buildSummary = mod.buildSummary
  main = mod.main
  DATA_BRANCH_PREFIX = mod.DATA_BRANCH_PREFIX
  DEFAULT_STUCK_AFTER_MS = mod.DEFAULT_STUCK_AFTER_MS
})

/** The long-lived data branches named in the issue's acceptance criteria. */
const ACCEPTANCE_BRANCHES = [
  'data/applications-sync-state',
  'data/campaigns-registry',
  'data/ci-status',
  'data/domain-expiry',
  'data/fleet-smoke-status',
  'data/roadmap',
  'data/sites-list-sync',
  'data/volunteer-hours',
]

const NOW = Date.UTC(2026, 6, 30, 12, 0, 0)
const pr = (over = {}) => ({
  number: 1,
  headRef: 'data/ci-status',
  draft: false,
  autoMergeEnabled: true,
  behindBy: 0,
  createdAtMs: NOW - 10 * 60 * 1000,
  ...over,
})

describe('branch selection', () => {
  it('covers every long-lived data branch the issue names', () => {
    for (const branch of ACCEPTANCE_BRANCHES) {
      expect(isDataBranch(branch)).toBe(true)
    }
  })

  it('ignores branches that are not data-refresh branches', () => {
    expect(isDataBranch('main')).toBe(false)
    expect(isDataBranch('dependabot/npm_and_yarn/js-yaml-5.2.2')).toBe(false)
    expect(isDataBranch('claude/some-feature')).toBe(false)
    // Not a prefix match by accident: the separator has to be there.
    expect(isDataBranch('database-migration')).toBe(false)
  })

  it('tolerates a missing or non-string ref', () => {
    expect(isDataBranch(undefined)).toBe(false)
    expect(isDataBranch(null)).toBe(false)
    expect(isDataBranch(42)).toBe(false)
  })
})

describe('planFor', () => {
  it('asks for nothing when the PR is current and already armed', () => {
    const plan = planFor(pr(), { nowMs: NOW })
    expect(plan.needsUpdate).toBe(false)
    expect(plan.needsAutoMerge).toBe(false)
    expect(plan.old).toBe(false)
  })

  it('asks for an update when the branch is behind', () => {
    const plan = planFor(pr({ behindBy: 4 }), { nowMs: NOW })
    expect(plan.needsUpdate).toBe(true)
    expect(plan.behindBy).toBe(4)
  })

  it('arms auto-merge when the creating workflow never did', () => {
    // The live case: update-sites-data.yml has no auto-merge step at all, so
    // PR #732 sat open for three days at behind=28 and could not merge itself
    // even from behind=0.
    const plan = planFor(
      pr({ headRef: 'data/sites-list-sync', autoMergeEnabled: false, behindBy: 28 }),
      { nowMs: NOW }
    )
    expect(plan.needsAutoMerge).toBe(true)
    expect(plan.needsUpdate).toBe(true)
  })

  it('leaves a draft data PR entirely alone', () => {
    // Auto-merge cannot be armed on a draft, and a draft data PR is a human
    // holding it deliberately.
    const plan = planFor(pr({ draft: true, behindBy: 9, autoMergeEnabled: false }), { nowMs: NOW })
    expect(plan.needsUpdate).toBe(false)
    expect(plan.needsAutoMerge).toBe(false)
    expect(plan.old).toBe(false)
  })

  it('does not call a young PR old', () => {
    const plan = planFor(pr({ behindBy: 2, createdAtMs: NOW - 20 * 60 * 1000 }), { nowMs: NOW })
    expect(plan.needsUpdate).toBe(true)
    expect(plan.old).toBe(false)
  })

  it('marks a PR past the threshold as old, on age alone', () => {
    // Deliberately age-only: whether it is stuck is decided from the state after
    // this cycle's remedies, so a PR the reconciler just rescued is not flagged
    // for the plan it arrived with.
    expect(planFor(pr({ behindBy: 2, createdAtMs: NOW - 6 * HOUR }), { nowMs: NOW }).old).toBe(true)
    expect(planFor(pr({ createdAtMs: NOW - 24 * HOUR }), { nowMs: NOW }).old).toBe(true)
  })

  it('honours an overridden stuck threshold', () => {
    const args = { nowMs: NOW, stuckAfterMs: 30 * 60 * 1000 }
    expect(planFor(pr({ behindBy: 1, createdAtMs: NOW - HOUR }), args).old).toBe(true)
  })

  it('defaults the threshold to three hours', () => {
    expect(DEFAULT_STUCK_AFTER_MS).toBe(3 * HOUR)
  })
})

describe('decideRunOutcome', () => {
  const result = (over = {}) => ({
    number: 5,
    headRef: 'data/ci-status',
    behindBy: 0,
    autoMergeEnabled: true,
    ageMs: HOUR,
    old: false,
    progressing: false,
    outcome: 'ok',
    reason: '',
    actions: [],
    ...over,
  })

  it('passes when there is nothing open', () => {
    expect(decideRunOutcome([]).failed).toBe(false)
  })

  it('passes when every PR is current', () => {
    expect(decideRunOutcome([result(), result({ number: 6 })]).failed).toBe(false)
  })

  it('passes on a young PR reconciled this cycle', () => {
    // Recovering without a human, within the cycle, is a success — not an alert.
    const verdict = decideRunOutcome([
      result({ outcome: 'reconciled', actions: ['update-branch'], old: false }),
    ])
    expect(verdict.failed).toBe(false)
  })

  it('still reports a long-stuck PR it managed to rescue', () => {
    // Reconciliation makes the dashboards current again; it does not make the
    // six-hour stall un-happen, and the producer workflow needs fixing.
    const verdict = decideRunOutcome([
      result({ outcome: 'reconciled', old: true, ageMs: 6 * HOUR, actions: ['update-branch'] }),
    ])
    expect(verdict.failed).toBe(true)
    expect(verdict.reasons[0]).toMatch(/open 6h, now current and armed but not merged/)
  })

  it('does not report a PR the merge queue already owns', () => {
    const verdict = decideRunOutcome([
      result({ outcome: 'reconciled', old: true, ageMs: 5 * HOUR, progressing: true }),
    ])
    expect(verdict.failed).toBe(false)
  })

  it('fails on a blocked PR even when it is young', () => {
    const verdict = decideRunOutcome([
      result({ outcome: 'blocked', reason: 'update-branch 409: merge conflict' }),
    ])
    expect(verdict.failed).toBe(true)
    expect(verdict.reasons.join(' ')).toContain('merge conflict')
  })

  it('fails on a stuck PR that reconciliation did not fix', () => {
    const verdict = decideRunOutcome([
      result({ outcome: 'reconciled', old: true, ageMs: 6 * HOUR, behindBy: 4 }),
    ])
    expect(verdict.failed).toBe(true)
    expect(verdict.reasons[0]).toMatch(/still un-reconciled after 6h/)
  })

  it('does not double-report a PR that is both blocked and stuck', () => {
    const verdict = decideRunOutcome([
      result({ outcome: 'blocked', reason: 'boom', old: true, ageMs: 5 * HOUR }),
    ])
    expect(verdict.reasons).toHaveLength(1)
  })

  it('reports but does not enforce the verdict in dry-run', () => {
    // Nothing was attempted, so "still needs work" is the expected state; a red
    // run for a preview would be a lie about the repo's health.
    const results = [result({ outcome: 'blocked', reason: 'boom' })]
    expect(decideRunOutcome(results, { dryRun: true }).failed).toBe(false)
    expect(decideRunOutcome(results, { dryRun: true }).reasons).toHaveLength(1)
  })

  it('ignores a skipped draft', () => {
    const verdict = decideRunOutcome([
      result({ outcome: 'skipped', reason: 'draft', old: true, ageMs: 30 * HOUR }),
    ])
    expect(verdict.failed).toBe(false)
  })
})

describe('buildSummary', () => {
  const rec = {
    number: 732,
    headRef: 'data/sites-list-sync',
    behindBy: 28,
    autoMergeEnabled: false,
    ageMs: 72 * HOUR,
    old: true,
    progressing: false,
    outcome: 'reconciled',
    reason: '',
    actions: ['update-branch', 'enable auto-merge'],
  }

  it('says so plainly when there is nothing to do', () => {
    expect(buildSummary([])).toContain('Nothing to reconcile')
  })

  it('renders one row per PR with the action taken', () => {
    const out = buildSummary([rec])
    expect(out).toContain('#732')
    expect(out).toContain('data/sites-list-sync')
    expect(out).toContain('update-branch')
    expect(out).toContain('enable auto-merge')
  })

  it('surfaces the needs-attention reasons under their own heading', () => {
    const verdict = { failed: true, reasons: ['#732 (data/sites-list-sync): conflict'] }
    const out = buildSummary([rec], { verdict })
    expect(out).toContain('Needs attention')
    expect(out).toContain('#732 (data/sites-list-sync): conflict')
  })

  it('marks a dry-run as unenforced so a green run is not misread', () => {
    const verdict = { failed: false, reasons: ['#732: would update'] }
    expect(buildSummary([rec], { dryRun: true, verdict })).toContain('not enforced')
  })
})

describe('reconcile-data-prs.yml workflow contract', () => {
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows')
  const workflowPath = path.join(workflowsDir, 'reconcile-data-prs.yml')
  let workflow

  beforeAll(() => {
    workflow = yaml.load(fs.readFileSync(workflowPath, 'utf-8'))
  })

  it('exists and runs on a schedule as well as on demand', () => {
    expect(fs.existsSync(workflowPath)).toBe(true)
    // js-yaml parses a bare `on:` key as the boolean true.
    const on = workflow.on ?? workflow[true]
    expect(on).toHaveProperty('schedule')
    expect(on).toHaveProperty('workflow_dispatch')
    expect(on.schedule[0].cron).toBe('*/30 5-15 * * *')
  })

  it('covers the window the data workflows actually run in', () => {
    // Every data cron must fall inside the reconciler's hour range, or a
    // producer could open a PR the reconciler never looks at that day.
    const [, hourRange] = (workflow.on ?? workflow[true]).schedule[0].cron.split(' ')
    const [from, to] = hourRange.split('-').map(Number)
    const producerHours = fs
      .readdirSync(workflowsDir)
      .filter((f) => f.endsWith('.yml') && f !== 'reconcile-data-prs.yml')
      .flatMap((f) => {
        const doc = yaml.load(fs.readFileSync(path.join(workflowsDir, f), 'utf-8'))
        const on = doc?.on ?? doc?.[true]
        const schedule = on?.schedule
        if (!Array.isArray(schedule)) return []
        const opensDataPr = JSON.stringify(doc).includes(DATA_BRANCH_PREFIX)
        if (!opensDataPr) return []
        return schedule.map((s) => Number(String(s.cron).split(' ')[1]))
      })
    expect(producerHours.length).toBeGreaterThan(0)
    for (const hour of producerHours) {
      expect(hour).toBeGreaterThanOrEqual(from)
      expect(hour).toBeLessThanOrEqual(to)
    }
  })

  it('has the write scopes both remedies need, and no more', () => {
    const job = workflow.jobs.reconcile
    expect(job.permissions.contents).toBe('write') // update-branch
    expect(job.permissions['pull-requests']).toBe('write') // auto-merge
    expect(job.permissions.issues).toBeUndefined()
  })

  it('is ungated — no deployment environment', () => {
    expect(workflow.jobs.reconcile.environment).toBeUndefined()
  })

  it('serializes runs so two cycles cannot race the same branch', () => {
    expect(workflow.concurrency.group).toBe('reconcile-data-prs')
    expect(workflow.concurrency['cancel-in-progress']).toBe(false)
  })

  it('runs the reconciler script with a token', () => {
    const step = workflow.jobs.reconcile.steps.find((s) => s.run?.includes('reconcile-data-prs'))
    expect(step).toBeDefined()
    expect(step.run).toContain('node scripts/reconcile-data-prs.mjs')
    expect(step.env.GITHUB_TOKEN).toContain('secrets.GITHUB_TOKEN')
    expect(step.env.DRY_RUN).toBeDefined()
  })
})

describe('main() wiring (mocked API, no network)', () => {
  const realFetch = global.fetch
  const hoursAgo = (h) => new Date(Date.now() - h * HOUR).toISOString()

  const reply = (status, body) => ({
    ok: status < 300,
    status,
    text: async () => JSON.stringify(body),
    json: async () => body,
  })

  const apiPr = (over = {}) => ({
    number: 100,
    node_id: 'PR_kwnode1',
    draft: false,
    auto_merge: { merge_method: 'merge' },
    created_at: hoursAgo(0.2),
    head: { ref: 'data/ci-status' },
    base: { ref: 'main' },
    ...over,
  })

  /** Routes the four calls the script makes, and records them in order. */
  const fakeApi = ({ pulls, behind = {}, updateBranch = {}, graphqlError = null }) => {
    const calls = []
    global.fetch = jest.fn(async (url, init = {}) => {
      const u = String(url).replace('https://api.github.com', '')
      calls.push(`${init.method || 'GET'} ${u}`)
      if (u.includes('/pulls?state=open')) return reply(200, pulls)
      if (u.includes('/compare/')) {
        const head = decodeURIComponent(u.split('...')[1])
        return reply(200, { behind_by: behind[head] ?? 0 })
      }
      if (u.endsWith('/update-branch')) {
        const status = updateBranch.status ?? 202
        return reply(status, { message: updateBranch.message ?? 'Updating pull request branch.' })
      }
      if (u === '/graphql') {
        return reply(200, graphqlError ? { errors: [{ message: graphqlError }] } : { data: {} })
      }
      throw new Error(`unexpected request: ${u}`)
    })
    return calls
  }

  afterEach(() => {
    global.fetch = realFetch
    delete process.env.DRY_RUN
    jest.restoreAllMocks()
  })

  it('ignores PRs that are not on data branches', async () => {
    const calls = fakeApi({
      pulls: [apiPr({ number: 730, head: { ref: 'dependabot/npm_and_yarn/js-yaml-5.2.2' } })],
    })
    await main()
    expect(calls).toEqual([
      'GET /repos/FreeForCharity/FFC-IN-ffcadmin.org/pulls?state=open&per_page=100',
    ])
  })

  it('updates a branch that has fallen behind', async () => {
    const calls = fakeApi({
      pulls: [apiPr({ number: 739, head: { ref: 'data/ci-status' } })],
      behind: { 'data/ci-status': 4 },
    })
    await main()
    expect(calls).toContain('PUT /repos/FreeForCharity/FFC-IN-ffcadmin.org/pulls/739/update-branch')
    // Already armed by its creating workflow — do not touch auto-merge.
    expect(calls.some((c) => c.includes('/graphql'))).toBe(false)
  })

  it('arms auto-merge when the creating workflow never did', async () => {
    const calls = fakeApi({
      pulls: [apiPr({ number: 732, auto_merge: null, head: { ref: 'data/sites-list-sync' } })],
    })
    await main()
    expect(calls).toContain('POST /graphql')
    expect(calls.some((c) => c.includes('update-branch'))).toBe(false)
  })

  it('does both for the live #732 case: 28 behind and never armed', async () => {
    const calls = fakeApi({
      pulls: [
        apiPr({
          number: 732,
          auto_merge: null,
          created_at: hoursAgo(72),
          head: { ref: 'data/sites-list-sync' },
        }),
      ],
      behind: { 'data/sites-list-sync': 28 },
    })
    // It applies both remedies AND goes red: the PR had been open three days,
    // which is the producer-workflow defect the humans need told about. Fixing
    // the dashboard silently would leave that invisible all over again.
    await expect(main()).rejects.toThrow(/#732/)
    expect(calls).toContain('PUT /repos/FreeForCharity/FFC-IN-ffcadmin.org/pulls/732/update-branch')
    expect(calls).toContain('POST /graphql')
  })

  it('mutates nothing in dry-run', async () => {
    process.env.DRY_RUN = 'true'
    const calls = fakeApi({
      pulls: [apiPr({ auto_merge: null, created_at: hoursAgo(48) })],
      behind: { 'data/ci-status': 12 },
    })
    await main() // must not throw despite being stuck: nothing was attempted
    expect(calls.some((c) => c.startsWith('PUT') || c === 'POST /graphql')).toBe(false)
  })

  it('treats an already-queued PR as progressing, not broken', async () => {
    // The hub's lesson: a queued branch rejects an update with 422 telling you to
    // dequeue it. Reacting to that would fight the merge queue.
    fakeApi({
      pulls: [apiPr({ created_at: hoursAgo(5) })],
      behind: { 'data/ci-status': 2 },
      updateBranch: { status: 422, message: 'you must dequeue the associated pull request' },
    })
    await expect(main()).resolves.toBeUndefined()
  })

  it('fails the run on a conflict a human has to resolve', async () => {
    fakeApi({
      pulls: [apiPr({ number: 741 })],
      behind: { 'data/ci-status': 3 },
      updateBranch: { status: 409, message: 'merge conflict between base and head' },
    })
    await expect(main()).rejects.toThrow(/merge conflict/)
  })

  it('accepts an already-enabled auto-merge as success', async () => {
    fakeApi({
      // Young, so the age-based report cannot mask what this asserts: a
      // race where another actor armed auto-merge first is a success, not an error.
      pulls: [apiPr({ auto_merge: null, created_at: hoursAgo(0.2) })],
      graphqlError: 'Pull request Auto merge is already enabled.',
    })
    await expect(main()).resolves.toBeUndefined()
  })

  it('fails the run when auto-merge cannot be armed at all', async () => {
    fakeApi({
      pulls: [apiPr({ auto_merge: null })],
      graphqlError: 'Auto merge is not allowed on this repository',
    })
    await expect(main()).rejects.toThrow(/not allowed/)
  })

  it('surfaces an API failure instead of exiting clean', async () => {
    global.fetch = jest.fn(async () => reply(500, { message: 'server error' }))
    await expect(main()).rejects.toThrow(/500/)
  })
})

describe('coverage of the data workflows (drift guard)', () => {
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows')

  /** Every `branch:` a create-pull-request step pushes to, with its workflow. */
  const prBranches = () => {
    const found = []
    for (const file of fs.readdirSync(workflowsDir).filter((f) => f.endsWith('.yml'))) {
      const doc = yaml.load(fs.readFileSync(path.join(workflowsDir, file), 'utf-8'))
      for (const job of Object.values(doc?.jobs || {})) {
        for (const step of job?.steps || []) {
          if (!String(step?.uses || '').startsWith('peter-evans/create-pull-request')) continue
          if (step.with?.branch) found.push({ file, branch: step.with.branch })
        }
      }
    }
    return found
  }

  it('finds the data workflows at all (a guard that finds nothing guards nothing)', () => {
    expect(prBranches().length).toBeGreaterThanOrEqual(8)
  })

  it('sweeps every branch a data workflow opens a PR on', () => {
    for (const { file, branch } of prBranches()) {
      expect(isDataBranch(branch)).toBe(true) // ${file} opens a PR the reconciler must cover
      expect(file).toBeTruthy()
    }
  })

  it('reaches the branches whose workflow never arms auto-merge', () => {
    // These three open data PRs and have no `gh pr merge --auto` step, so the
    // reconciler is the only thing that can ever merge them.
    const unarmed = ['update-sites-data.yml', 'sync-applications.yml', 'whmcs-intake.yml']
    for (const file of unarmed) {
      const raw = fs.readFileSync(path.join(workflowsDir, file), 'utf-8')
      const branches = prBranches()
        .filter((b) => b.file === file)
        .map((b) => b.branch)
      expect(branches.length).toBeGreaterThan(0)
      for (const branch of branches) expect(isDataBranch(branch)).toBe(true)
      // If someone later adds auto-merge here, this assertion is the prompt to
      // re-read the comment in reconcile-data-prs.mjs rather than a bug.
      expect(raw).not.toContain('pr merge --auto')
    }
  })
})
