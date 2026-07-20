/**
 * Unit tests for the fleet smoke status generator and the stale-monitor
 * reporter (FFC-Cloudflare-Automation#753).
 *
 * The tile-state decision (computeSiteState), the age helper (hoursSince), and
 * the managed-issue body builder are pure — no network — so these lock in the
 * stale-monitor classification (48h age threshold and disabled-workflow case)
 * plus the auto-close issue body.
 */

let computeSiteState, hoursSince, STALE_HOURS, EMPTY_SUMMARY
let buildIssueBody, issueTitle, MANAGED_MARKER, LABELS

beforeAll(async () => {
  const gen = await import('../scripts/generate-fleet-smoke-status.mjs')
  computeSiteState = gen.computeSiteState
  hoursSince = gen.hoursSince
  STALE_HOURS = gen.STALE_HOURS
  EMPTY_SUMMARY = gen.EMPTY_SUMMARY

  const rep = await import('../scripts/report-stale-monitors.mjs')
  buildIssueBody = rep.buildIssueBody
  issueTitle = rep.issueTitle
  MANAGED_MARKER = rep.MANAGED_MARKER
  LABELS = rep.LABELS
})

const NOW = new Date('2026-07-20T12:00:00Z')
const hoursAgo = (h) => new Date(NOW.getTime() - h * 3_600_000).toISOString()
const run = (over = {}) => ({
  status: 'completed',
  conclusion: 'success',
  updated_at: hoursAgo(1),
  ...over,
})

describe('hoursSince', () => {
  it('measures whole hours back from now', () => {
    expect(hoursSince(hoursAgo(3), NOW)).toBeCloseTo(3, 5)
  })
  it('returns Infinity for null/invalid timestamps', () => {
    expect(hoursSince(null, NOW)).toBe(Infinity)
    expect(hoursSince('not-a-date', NOW)).toBe(Infinity)
  })
})

describe('EMPTY_SUMMARY', () => {
  it('has a zeroed count for stale-monitor', () => {
    expect(EMPTY_SUMMARY['stale-monitor']).toBe(0)
  })
})

describe('computeSiteState', () => {
  it('no domain -> not-cutover', () => {
    expect(computeSiteState({ domain: null, run: run(), now: NOW }).state).toBe('not-cutover')
  })

  it('in-progress run -> running', () => {
    expect(
      computeSiteState({ domain: 'x.org', run: run({ status: 'in_progress' }), now: NOW }).state
    ).toBe('running')
  })

  it('fresh success -> passing', () => {
    expect(
      computeSiteState({ domain: 'x.org', run: run({ updated_at: hoursAgo(1) }), now: NOW }).state
    ).toBe('passing')
  })

  it('fresh failure -> failing', () => {
    expect(
      computeSiteState({
        domain: 'x.org',
        run: run({ conclusion: 'failure', updated_at: hoursAgo(1) }),
        now: NOW,
      }).state
    ).toBe('failing')
  })

  it('cut over, active workflow, no run yet -> pending', () => {
    expect(
      computeSiteState({ domain: 'x.org', run: null, workflowState: 'active', now: NOW }).state
    ).toBe('pending')
  })

  it('cut over, no run, workflow state unknown (unreadable list) -> unknown, not pending', () => {
    expect(
      computeSiteState({ domain: 'x.org', run: null, workflowState: null, now: NOW }).state
    ).toBe('unknown')
  })

  it('latest run older than 48h -> stale-monitor with age reason', () => {
    const res = computeSiteState({
      domain: 'x.org',
      run: run({ updated_at: hoursAgo(72) }),
      now: NOW,
    })
    expect(res.state).toBe('stale-monitor')
    expect(res.staleReason).toMatch(/72h old/)
  })

  it('stale even when the last run failed (monitoring stopped overrides failing)', () => {
    expect(
      computeSiteState({
        domain: 'x.org',
        run: run({ conclusion: 'failure', updated_at: hoursAgo(96) }),
        now: NOW,
      }).state
    ).toBe('stale-monitor')
  })

  it('run exactly at the threshold is not yet stale', () => {
    expect(
      computeSiteState({
        domain: 'x.org',
        run: run({ updated_at: hoursAgo(STALE_HOURS) }),
        now: NOW,
      }).state
    ).toBe('passing')
  })

  it('disabled workflow -> stale-monitor even with a fresh passing run', () => {
    const res = computeSiteState({
      domain: 'x.org',
      run: run({ updated_at: hoursAgo(1) }),
      workflowState: 'disabled_inactivity',
      now: NOW,
    })
    expect(res.state).toBe('stale-monitor')
    expect(res.staleReason).toMatch(/disabled_inactivity/)
  })

  it('active workflow does not trigger stale on its own', () => {
    expect(
      computeSiteState({
        domain: 'x.org',
        run: run({ updated_at: hoursAgo(1) }),
        workflowState: 'active',
        now: NOW,
      }).state
    ).toBe('passing')
  })

  it("absent workflow ('missing' sentinel) -> stale-monitor immediately", () => {
    const res = computeSiteState({
      domain: 'x.org',
      run: run({ updated_at: hoursAgo(1) }),
      workflowState: 'missing',
      now: NOW,
    })
    expect(res.state).toBe('stale-monitor')
    expect(res.staleReason).toMatch(/no active smoke workflow/)
  })

  it('run without a usable updated_at is not "Infinityh old" — falls through to conclusion', () => {
    const res = computeSiteState({
      domain: 'x.org',
      run: { status: 'completed', conclusion: 'success', updated_at: null },
      workflowState: 'active',
      now: NOW,
    })
    expect(res.state).toBe('passing')
    expect(res.staleReason).toBeNull()
  })

  it('rounds the age up so a just-stale run never reads "48h old (> 48h)"', () => {
    const res = computeSiteState({
      domain: 'x.org',
      run: run({ updated_at: hoursAgo(48.1) }),
      now: NOW,
    })
    expect(res.state).toBe('stale-monitor')
    expect(res.staleReason).toContain('49h old')
  })
})

describe('report-stale-monitors body', () => {
  const stale = [
    {
      repo: 'FFC-EX-example.org',
      domain: 'example.org',
      state: 'stale-monitor',
      staleReason: 'latest smoke run is 72h old (> 48h)',
      smoke: { runUrl: 'https://github.com/run/1' },
    },
  ]

  it('title counts the stale sites (singular/plural)', () => {
    expect(issueTitle(stale)).toMatch(/1 site\b/)
    expect(issueTitle([...stale, { ...stale[0], repo: 'FFC-EX-b.org' }])).toMatch(/2 sites\b/)
  })

  it('body carries the managed marker, the repo, the reason, and the run link', () => {
    const body = buildIssueBody(stale, '2026-07-20T12:00:00Z')
    expect(body).toContain(MANAGED_MARKER)
    expect(body).toContain('FFC-EX-example.org')
    expect(body).toContain('72h old')
    expect(body).toContain('https://github.com/run/1')
  })

  it('applies the smoke-failure + priority: high labels', () => {
    expect(LABELS).toEqual(expect.arrayContaining(['smoke-failure', 'priority: high']))
  })
})
