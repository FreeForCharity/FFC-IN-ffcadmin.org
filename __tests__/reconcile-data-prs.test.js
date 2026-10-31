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
  threadBlockMarker,
  buildThreadBlockComment,
  DATA_BRANCH_PREFIX,
  DEFAULT_STUCK_AFTER_MS,
  THREAD_BLOCK_ISSUE

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
  threadBlockMarker = mod.threadBlockMarker
  buildThreadBlockComment = mod.buildThreadBlockComment
  DATA_BRANCH_PREFIX = mod.DATA_BRANCH_PREFIX
  DEFAULT_STUCK_AFTER_MS = mod.DEFAULT_STUCK_AFTER_MS
  THREAD_BLOCK_ISSUE = mod.THREAD_BLOCK_ISSUE
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

  it('asks to clear a check stuck in action_required', () => {
    // The live case: #1036 (data/roadmap) was current AND armed from creation,
    // and still sat three days, because `CI - Build and Test` was authored by
    // github-actions[bot] and landed in `action_required` — a required check
    // that never reports, so auto-merge had nothing to fire on.
    const plan = planFor(pr({ headRef: 'data/roadmap', unapprovedRuns: 1 }), { nowMs: NOW })
    expect(plan.needsApproval).toBe(true)
    expect(plan.needsUpdate).toBe(false)
    expect(plan.needsAutoMerge).toBe(false)
  })

  it('does not ask to clear checks on a draft', () => {
    const plan = planFor(pr({ draft: true, unapprovedRuns: 2 }), { nowMs: NOW })
    expect(plan.needsApproval).toBe(false)
  })

  it('treats an absent unapprovedRuns as none, not as a reason to act', () => {
    // Callers that predate this field must not start firing re-runs.
    const plan = planFor(pr(), { nowMs: NOW })
    expect(plan.unapprovedRuns).toBe(0)
    expect(plan.needsApproval).toBe(false)
  })

  it('carries the unresolved-thread count and flags the block (#1388)', () => {
    const plan = planFor(pr({ unresolvedThreads: 2 }), { nowMs: NOW })
    expect(plan.unresolvedThreads).toBe(2)
    expect(plan.threadBlocked).toBe(true)
  })

  it('does NOT update-branch a thread-blocked PR, however far behind it is', () => {
    // The org ruleset sets `review_on_push: true`, so the push that fixes cause 1
    // re-triggers the reviewer and can file fresh threads. The cause-1 remedy
    // extends the block rather than clearing it.
    const plan = planFor(pr({ behindBy: 9, unresolvedThreads: 1 }), { nowMs: NOW })
    expect(plan.behindBy).toBe(9)
    expect(plan.needsUpdate).toBe(false)
  })

  it('invents no remedy for a thread — it is a diagnosis, not an action', () => {
    // Resolving a thread is human judgement, and on an armed PR resolving the
    // last one merges it. Nothing here may grow a `needs*` flag for that.
    const plan = planFor(pr({ unresolvedThreads: 4 }), { nowMs: NOW })
    expect(plan.needsAutoMerge).toBe(false)
    expect(plan.needsApproval).toBe(false)
    expect(
      Object.keys(plan)
        .filter((k) => /^needs/.test(k))
        .sort()
    ).toEqual(['needsApproval', 'needsAutoMerge', 'needsUpdate'])
  })

  it('treats an absent unresolvedThreads as none, not as a block', () => {
    const plan = planFor(pr(), { nowMs: NOW })
    expect(plan.unresolvedThreads).toBe(0)
    expect(plan.threadBlocked).toBe(false)
  })

  it('does not call a draft thread-blocked — a human is already holding it', () => {
    const plan = planFor(pr({ draft: true, unresolvedThreads: 3 }), { nowMs: NOW })
    expect(plan.threadBlocked).toBe(false)
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

  it('passes once a thread-blocked PR has been escalated, however old (#1388)', () => {
    // 26 days of red that meant "working as intended" is what made the one line
    // it printed unreadable. The escalation on the PR is the delivery now.
    const verdict = decideRunOutcome([
      result({
        outcome: 'escalated',
        old: true,
        ageMs: 630 * HOUR,
        unresolvedThreads: 6,
        reason: 'escalation comment posted',
      }),
    ])
    expect(verdict.failed).toBe(false)
    // But it must not go quiet either: the condition is still reported.
    expect(verdict.escalations).toHaveLength(1)
    expect(verdict.escalations[0]).toMatch(/6 unresolved review thread/)
  })

  it('still fails when the escalation itself could not be delivered', () => {
    // The one state an operator reading this job can act on. A green run with no
    // comment posted would be the silence this script exists to remove.
    const verdict = decideRunOutcome([
      result({ outcome: 'blocked', reason: 'escalation comment 403: Resource not accessible' }),
    ])
    expect(verdict.failed).toBe(true)
    expect(verdict.reasons.join(' ')).toContain('escalation comment 403')
  })

  it('names unresolvedThreads instead of the catch-all when a stuck PR has them', () => {
    // The 26-day regression pin. `check the required checks and review gate on
    // it` was accurate and actionless: every check WAS green, and the gate it
    // means reports nowhere a reader looks.
    const verdict = decideRunOutcome([
      result({ outcome: 'reconciled', old: true, ageMs: 630 * HOUR, unresolvedThreads: 6 }),
    ])
    expect(verdict.failed).toBe(true)
    expect(verdict.reasons[0]).toContain('unresolvedThreads=6')
    expect(verdict.reasons[0]).not.toContain('check the required checks and review gate')
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

  it('shows the unresolved-thread count per row, where a reader looks first', () => {
    // The gate lives in `/rulesets/<id>` and reports nowhere in the checks list,
    // so the count has to be in the table or it is invisible again (#1388).
    const out = buildSummary([{ ...rec, unresolvedThreads: 6 }])
    expect(out).toContain('Threads')
    expect(out).toMatch(/\| 6 \|/)
  })

  it('renders an escalation even though the run passes', () => {
    const verdict = { failed: false, reasons: [], escalations: ['#1379 (data/x): 6 unresolved'] }
    const out = buildSummary([rec], { verdict })
    expect(out).toContain('Escalated to a human')
    expect(out).toContain('#1379 (data/x): 6 unresolved')
  })
})

describe('buildThreadBlockComment', () => {
  const threads = [
    {
      path: 'docs/sites_list.csv',
      line: 3,
      author: 'copilot-pull-request-reviewer',
      body: '`0000-00-00` is not a valid ISO-8601 date\nand will break downstream parsing.',
      url: 'https://github.com/o/r/pull/1379#discussion_r1',
    },
    { path: 'docs/sites_list.json', line: null, author: '', body: '', url: '' },
  ]

  it('carries the once-per-head marker', () => {
    const out = buildThreadBlockComment({ headSha: 'abcdef1234', hours: 630, threads })
    expect(out).toContain(threadBlockMarker('abcdef1234'))
  })

  it('names every unresolved thread and what it asks for', () => {
    const out = buildThreadBlockComment({ headSha: 'abcdef1234', hours: 630, threads })
    expect(out).toContain('docs/sites_list.csv:3')
    expect(out).toContain('@copilot-pull-request-reviewer')
    expect(out).toContain('not a valid ISO-8601 date')
    // Newlines flattened, or the bullet list breaks apart mid-quote.
    expect(out).not.toMatch(/date\nand will break/)
    // A thread with no line still has to be locatable.
    expect(out).toContain('docs/sites_list.json')
  })

  it('discloses the two things the reconciler deliberately will not do', () => {
    const out = buildThreadBlockComment({
      headSha: 'abcdef1234',
      hours: 630,
      threads,
      autoMergeEnabled: true,
    })
    // A reader has to know that resolving the last thread merges the PR, and
    // that no push is coming to unstick it.
    expect(out).toMatch(/will not update-branch/)
    expect(out).toMatch(/resolving the last thread merges this PR/)
    expect(out).toContain(`#${THREAD_BLOCK_ISSUE}`)
  })

  it('states the REAL behind count, never a hard-coded one', () => {
    // Copilot on this PR: the trigger is `unresolvedThreads > 0` alone, so
    // nothing here may assert the PR is current. A thread-blocked PR that is 12
    // behind would otherwise be told it was 0 behind, in the one artefact whose
    // whole job is to be trusted.
    const out = buildThreadBlockComment({ headSha: 'a1', hours: 9, threads, behindBy: 12 })
    expect(out).toContain('12 behind `main`')
    expect(out).not.toContain('0 behind')
    // And the suppressed-push bullet has to admit it is leaving the PR behind.
    expect(out).toMatch(/will not update-branch this PR\*\*, though it is 12 behind/)
  })

  it('does not claim an instant merge when auto-merge is not armed', () => {
    // Wrong in the other direction, and worse: it would deter a human from
    // resolving the threads over a merge that cannot happen.
    const out = buildThreadBlockComment({ headSha: 'a1', hours: 9, threads })
    expect(out).toContain('auto-merge **not** armed')
    expect(out).not.toMatch(/merges this PR immediately/)
    expect(out).toMatch(/will not merge it on its own/)
  })

  it('asserts nothing about check conclusions, which it never reads', () => {
    const armed = buildThreadBlockComment({
      headSha: 'a1',
      hours: 9,
      threads,
      autoMergeEnabled: true,
    })
    expect(armed).not.toMatch(/check(s)? green/)
    expect(armed).toContain('whatever the checks say')
  })

  it('agrees with itself on the count', () => {
    const one = buildThreadBlockComment({ headSha: 'a1', hours: 1, threads: [threads[0]] })
    expect(one).toContain('1 unresolved review thread:')
    expect(one).not.toContain('threads:')
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

  it('grants every permission its three remedies need', () => {
    // Raised by Copilot on the PR that added the third remedy: `actions: write`
    // is what lets the job POST /actions/runs/{id}/rerun. Without it the
    // reconciler still reports the stall but can no longer clear it, and the
    // regression would be a silent narrowing of what it can fix.
    const perms = workflow.jobs.reconcile.permissions
    expect(perms.contents).toBe('write') // update-branch
    expect(perms['pull-requests']).toBe('write') // arm auto-merge
    expect(perms.actions).toBe('write') // re-run an unapproved check
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
    head: { ref: 'data/ci-status', sha: 'headsha1' },
    base: { ref: 'main' },
    ...over,
  })

  /** Routes every call the script makes (PRs, compare, runs, rerun, update-branch,
   *  GraphQL) and records them in order. */
  const fakeApi = ({
    pulls,
    behind = {},
    updateBranch = {},
    graphqlError = null,
    runs = [],
    runsBySha = {},
    newHeadSha = 'newsha',
    rerun = {},
    // #1388: review threads are GraphQL-only, so the fake has to tell the
    // reviewThreads QUERY from the enableAutoMerge MUTATION. The query is
    // recorded with a suffix so the existing `toContain('POST /graphql')`
    // assertions keep meaning "the auto-merge mutation fired" and nothing else.
    threads = [],
    threadsHasNextPage = false,
    threadsError = null,
    issueComments = [],
    postComment = {},
    commentsGet = {},
  }) => {
    const calls = []
    global.fetch = jest.fn(async (url, init = {}) => {
      const u = String(url).replace('https://api.github.com', '')
      const isThreadQuery = u === '/graphql' && String(init.body || '').includes('reviewThreads')
      calls.push(`${init.method || 'GET'} ${u}${isThreadQuery ? ' (reviewThreads)' : ''}`)
      if (isThreadQuery) {
        if (threadsError) return reply(200, { errors: [{ message: threadsError }] })
        return reply(200, {
          data: {
            repository: {
              pullRequest: {
                reviewThreads: {
                  totalCount: threads.length,
                  pageInfo: { hasNextPage: threadsHasNextPage },
                  nodes: threads,
                },
              },
            },
          },
        })
      }
      if (/\/issues\/\d+\/comments(\?|$)/.test(u)) {
        if (init.method === 'POST') {
          const status = postComment.status ?? 201
          return reply(status, { message: postComment.message ?? 'created' })
        }
        if (commentsGet.status) return reply(commentsGet.status, { message: commentsGet.message })
        return reply(200, issueComments)
      }
      if (u.includes('/pulls?state=open')) return reply(200, pulls)
      // Single-PR read: how the script learns the head sha AFTER update-branch.
      if (/\/pulls\/\d+$/.test(u)) return reply(200, { head: { sha: newHeadSha } })
      if (u.includes('/actions/runs?head_sha=')) {
        const sha = decodeURIComponent(u.split('head_sha=')[1].split('&')[0])
        return reply(200, { workflow_runs: runsBySha[sha] ?? runs })
      }
      if (/\/actions\/runs\/\d+\/rerun$/.test(u)) {
        const status = rerun.status ?? 201
        return reply(status, { message: rerun.message ?? 'queued' })
      }
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
    // Already armed by its creating workflow — do not touch auto-merge. Asserted
    // on the MUTATION specifically: since #1388 every non-draft PR also costs a
    // `reviewThreads` query, so "no /graphql call at all" is no longer the
    // property this test is about.
    expect(calls).not.toContain('POST /graphql')
  })

  it('re-runs a check stuck in action_required', async () => {
    const calls = fakeApi({
      pulls: [apiPr({ number: 1036, head: { ref: 'data/roadmap', sha: 'sha1036' } })],
      runs: [{ id: 991, conclusion: 'action_required' }],
    })
    await main()
    expect(calls).toContain('POST /repos/FreeForCharity/FFC-IN-ffcadmin.org/actions/runs/991/rerun')
  })

  it('leaves runs alone that are not waiting for approval', async () => {
    const calls = fakeApi({
      pulls: [apiPr({ number: 1040 })],
      runs: [
        { id: 1, conclusion: 'success' },
        { id: 2, conclusion: 'failure' },
        { id: 3, conclusion: null },
      ],
    })
    await main()
    expect(calls.some((c) => c.includes('/rerun'))).toBe(false)
  })

  it('reports a refused re-run as blocked rather than swallowing it', async () => {
    // Whether the ambient GITHUB_TOKEN may re-request a run is unproven. If it
    // may not, that must surface as a finding — a silent pass here would be the
    // exact failure mode this reconciler exists to remove.
    fakeApi({
      pulls: [apiPr({ number: 1036, created_at: new Date(Date.now() - 9 * HOUR).toISOString() })],
      runs: [{ id: 991, conclusion: 'action_required' }],
      rerun: { status: 403, message: 'Resource not accessible by integration' },
    })
    const log = jest.spyOn(console, 'log').mockImplementation(() => {})
    await expect(main()).rejects.toThrow(/re-run refused/)
    const summary = log.mock.calls.map((c) => c[0]).join('\n')
    expect(summary).toMatch(/Resource not accessible by integration/)
  })

  it('does not spend the runs lookup on a draft', async () => {
    const calls = fakeApi({ pulls: [apiPr({ number: 1041, draft: true })] })
    await main()
    expect(calls.some((c) => c.includes('/actions/runs?head_sha='))).toBe(false)
  })

  it('re-reads the runs after an update-branch, because that moved the head', async () => {
    // Approving runs on a head that update-branch is about to replace spends the
    // call on a dead commit and leaves the new head's runs unapproved.
    const calls = fakeApi({
      pulls: [apiPr({ number: 1042, head: { ref: 'data/roadmap', sha: 'oldsha' } })],
      behind: { 'data/roadmap': 3 },
      runsBySha: {
        oldsha: [{ id: 77, conclusion: 'action_required' }],
        newsha: [{ id: 88, conclusion: 'action_required' }],
      },
    })
    await main()
    const runLookups = calls.filter((c) => c.includes('/actions/runs?head_sha='))
    // Counting the lookups is NOT enough: the first version of this fix re-read
    // with the stale `pr.head.sha` from the listing, so two lookups happened and
    // both hit the dead head. Caught by Copilot in review. Assert the second one
    // asks about the NEW head, which is the property that actually matters.
    expect(runLookups.length).toBe(2)
    expect(runLookups[0]).toContain('head_sha=oldsha')
    expect(runLookups[1]).toContain('head_sha=newsha')
    // And the re-run must be spent on a run belonging to that new head.
    expect(calls).toContain('POST /repos/FreeForCharity/FFC-IN-ffcadmin.org/actions/runs/88/rerun')
    expect(calls.some((c) => c.includes('/actions/runs/77/rerun'))).toBe(false)
  })

  it('re-reads after update-branch even when the OLD head had nothing to approve', async () => {
    // Copilot's second review: gating the re-read on the pre-update plan alone
    // skips it whenever the old head was clean and the NEW head is not — which
    // is the common case, since update-branch pushes a fresh commit whose checks
    // need approving all over again. The PR would be reported reconciled while
    // still stalled: exactly the failure this remedy exists to remove.
    const calls = fakeApi({
      pulls: [apiPr({ number: 1043, head: { ref: 'data/roadmap', sha: 'oldsha' } })],
      behind: { 'data/roadmap': 2 },
      runsBySha: {
        oldsha: [], // nothing waiting on the head we started from
        newsha: [{ id: 99, conclusion: 'action_required' }], // but the new head stalls
      },
    })
    await main()
    expect(calls).toContain('POST /repos/FreeForCharity/FFC-IN-ffcadmin.org/actions/runs/99/rerun')
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

  describe('thread-blocked data PR (#1388)', () => {
    const blockedThreads = [
      {
        isResolved: false,
        path: 'docs/sites_list.csv',
        line: 3,
        comments: {
          nodes: [
            {
              author: { login: 'copilot-pull-request-reviewer' },
              body: '`0000-00-00` is not a valid ISO-8601 date.',
              url: 'https://github.com/o/r/pull/1379#discussion_r1',
            },
          ],
        },
      },
      { isResolved: true, path: 'docs/sites_list.csv', line: 9, comments: { nodes: [] } },
    ]
    const live1379 = () =>
      apiPr({
        number: 1379,
        created_at: hoursAgo(630),
        head: { ref: 'data/sites-list-sync', sha: 'headsha1379' },
      })

    it('escalates on the PR and passes, instead of going red every sweep', async () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {})
      const calls = fakeApi({ pulls: [live1379()], threads: blockedThreads })
      // 630h open and NOT red: the escalation is the delivery now.
      await main()
      expect(calls).toContain('POST /repos/FreeForCharity/FFC-IN-ffcadmin.org/issues/1379/comments')
      // Match on the comments URL, not on `method === 'POST'`: the reviewThreads
      // GraphQL query is also a POST and comes first, so the loose predicate
      // reads the query body and asserts nothing about the escalation.
      const post = global.fetch.mock.calls.find(
        (c) => c[1]?.method === 'POST' && String(c[0]).includes('/issues/1379/comments')
      )
      expect(JSON.parse(post[1].body).body).toContain('docs/sites_list.csv:3')
      expect(log.mock.calls.map((c) => c[0]).join('\n')).toContain('Escalated to a human')
    })

    it('does NOT update-branch it, even 12 behind — a push re-triggers the reviewer', async () => {
      // AC1. `review_on_push: true` means the cause-1 remedy files fresh threads.
      jest.spyOn(console, 'log').mockImplementation(() => {})
      const calls = fakeApi({
        pulls: [live1379()],
        behind: { 'data/sites-list-sync': 12 },
        threads: blockedThreads,
      })
      await main()
      expect(calls.some((c) => c.includes('/update-branch'))).toBe(false)
      expect(calls).not.toContain('POST /graphql') // and no auto-merge mutation
      // The escalation must carry the REAL behind count through from the plan,
      // not the hard-coded "0 behind" the first draft shipped.
      const post = global.fetch.mock.calls.find(
        (c) => c[1]?.method === 'POST' && String(c[0]).includes('/issues/1379/comments')
      )
      expect(JSON.parse(post[1].body).body).toContain('12 behind `main`')
    })

    it('escalates once per head: an unchanged second sweep posts nothing', async () => {
      // AC2. Without the marker this comments every 30 minutes, which is the
      // loop in a louder costume.
      jest.spyOn(console, 'log').mockImplementation(() => {})
      const calls = fakeApi({
        pulls: [live1379()],
        threads: blockedThreads,
        issueComments: [{ body: `${threadBlockMarker('headsha1379')}\nalready said` }],
      })
      await main()
      expect(calls.some((c) => c.startsWith('POST') && c.includes('/comments'))).toBe(false)
    })

    it('re-escalates on a NEW head, whose thread set a human has not seen', async () => {
      jest.spyOn(console, 'log').mockImplementation(() => {})
      const calls = fakeApi({
        pulls: [live1379()],
        threads: blockedThreads,
        issueComments: [{ body: `${threadBlockMarker('an-older-head')}\nsaid about the old head` }],
      })
      await main()
      expect(calls).toContain('POST /repos/FreeForCharity/FFC-IN-ffcadmin.org/issues/1379/comments')
    })

    it('goes red when the escalation comment is refused', async () => {
      // AC4's other half: "I escalated" and "I failed" must not look the same.
      jest.spyOn(console, 'log').mockImplementation(() => {})
      fakeApi({
        pulls: [live1379()],
        threads: blockedThreads,
        postComment: { status: 403, message: 'Resource not accessible by integration' },
      })
      await expect(main()).rejects.toThrow(/escalation comment 403/)
    })

    it('blocks when it cannot read whether it already escalated', async () => {
      // Copilot's second review on this PR: this was the one escalation outcome
      // with no test. It is the branch that decides between "say it again" and
      // "stay quiet", so an unreadable answer must not be read as either —
      // posting again would restart the 30-minute loop, and staying quiet would
      // drop the escalation entirely. Neither is safe, so it blocks.
      jest.spyOn(console, 'log').mockImplementation(() => {})
      const calls = fakeApi({
        pulls: [live1379()],
        threads: blockedThreads,
        commentsGet: { status: 502, message: 'Bad gateway' },
      })
      await expect(main()).rejects.toThrow(/could not read PR comments/)
      // And it must not have guessed by posting anyway.
      expect(calls.some((c) => c.startsWith('POST') && c.includes('/comments'))).toBe(false)
    })

    it('refuses to report a thread count it could not read', async () => {
      jest.spyOn(console, 'log').mockImplementation(() => {})
      fakeApi({ pulls: [live1379()], threadsError: 'Bad credentials' })
      await expect(main()).rejects.toThrow(/could not read review threads on #1379/)
    })

    it('refuses a truncated thread page, which can only under-report', async () => {
      // An under-count reads as "not thread-blocked" and routes the PR straight
      // back into the catch-all this check replaces.
      jest.spyOn(console, 'log').mockImplementation(() => {})
      fakeApi({ pulls: [live1379()], threads: blockedThreads, threadsHasNextPage: true })
      await expect(main()).rejects.toThrow(/more than 100 review threads/)
    })

    it('posts nothing in dry-run but still reports the block', async () => {
      process.env.DRY_RUN = 'true'
      const log = jest.spyOn(console, 'log').mockImplementation(() => {})
      const calls = fakeApi({ pulls: [live1379()], threads: blockedThreads })
      await main()
      expect(calls.some((c) => c.startsWith('POST') && c.includes('/comments'))).toBe(false)
      expect(log.mock.calls.map((c) => c[0]).join('\n')).toMatch(/would escalate 1 unresolved/)
    })
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

  it('treats a 422 as benign when the branch turns out to be current', async () => {
    // Another actor can update the branch between our compare and our PUT. The
    // response is a 422 either way, so the message is not the discriminator —
    // re-reading the comparison is. A false `blocked` here would fail the run
    // with nothing wrong, and an alert that cries wolf gets ignored.
    let compares = 0
    global.fetch = jest.fn(async (url) => {
      const u = String(url).replace('https://api.github.com', '')
      if (u.includes('/pulls?state=open')) {
        return reply(200, [apiPr({ number: 750 })])
      }
      if (u.includes('/compare/')) {
        compares += 1
        return reply(200, { behind_by: compares === 1 ? 3 : 0 })
      }
      if (u.endsWith('/update-branch')) return reply(422, { message: 'Unprocessable Entity' })
      // No run is waiting for approval here; this test is about the compare.
      if (u.includes('/actions/runs?head_sha=')) return reply(200, { workflow_runs: [] })
      // No unresolved review threads either (#1388), for the same reason.
      if (u === '/graphql') {
        return reply(200, {
          data: {
            repository: {
              pullRequest: {
                reviewThreads: { totalCount: 0, pageInfo: { hasNextPage: false }, nodes: [] },
              },
            },
          },
        })
      }
      throw new Error(`unexpected request: ${u}`)
    })
    await expect(main()).resolves.toBeUndefined()
    expect(compares).toBe(2)
  })

  it('still blocks on a 422 when the branch is genuinely behind', async () => {
    fakeApi({
      pulls: [apiPr({ number: 751 })],
      behind: { 'data/ci-status': 3 },
      updateBranch: { status: 422, message: 'merge conflict between base and head' },
    })
    await expect(main()).rejects.toThrow(/merge conflict/)
  })

  it('spends no compare call on a draft', async () => {
    // Drafts are skipped whatever the comparison says, and the REST budget is
    // shared org-wide.
    const calls = fakeApi({
      pulls: [apiPr({ number: 744, draft: true, auto_merge: null, created_at: hoursAgo(30) })],
      behind: { 'data/ci-status': 7 },
    })
    await main()
    expect(calls.some((c) => c.includes('/compare/'))).toBe(false)
    expect(calls.some((c) => c.startsWith('PUT') || c === 'POST /graphql')).toBe(false)
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

describe('entrypoint guard (spawned, not mocked)', () => {
  const { execFileSync } = require('child_process')
  const os = require('os')

  /** Runs the script as the workflow does and returns { code, output }. */
  const run = (cwd, script) => {
    const env = { ...process.env }
    delete env.GITHUB_TOKEN // so a running main() identifies itself by failing
    delete env.GH_TOKEN
    try {
      const stdout = execFileSync('node', [script], { cwd, env, encoding: 'utf8' })
      return { code: 0, output: stdout }
    } catch (e) {
      return { code: e.status, output: `${e.stdout || ''}${e.stderr || ''}` }
    }
  }

  // The failure mode: if the guard does not match, main() never runs and the
  // workflow exits 0 having done nothing — a green run that reconciled nothing,
  // which is precisely the invisibility this whole script exists to remove. So
  // assert main() RAN, via the one message only main() can produce.
  const ITS_ALIVE = /GITHUB_TOKEN is required/

  it('runs main() when invoked the way the workflow invokes it', () => {
    const { code, output } = run(process.cwd(), 'scripts/reconcile-data-prs.mjs')
    expect(output).toMatch(ITS_ALIVE)
    expect(code).toBe(1)
  })

  it('runs main() from a path containing a space', () => {
    // `file://${process.argv[1]}` fails here while pathToFileURL() does not:
    // import.meta.url percent-encodes the space, the concatenation does not.
    // Verified: the naive form yields false and the script exits 0 silently.
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'has space-'))
    try {
      const scripts = path.join(dir, 'scripts')
      fs.mkdirSync(scripts)
      fs.copyFileSync(
        path.join(process.cwd(), 'scripts', 'reconcile-data-prs.mjs'),
        path.join(scripts, 'reconcile-data-prs.mjs')
      )
      const { code, output } = run(dir, 'scripts/reconcile-data-prs.mjs')
      expect(output).toMatch(ITS_ALIVE)
      expect(code).toBe(1)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  it('does not run main() on import', async () => {
    // The other half of the contract: importing for tests must not fire the run.
    // If it did, this suite would already have hit the network.
    const mod = await import('../scripts/reconcile-data-prs.mjs')
    expect(typeof mod.main).toBe('function')
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
