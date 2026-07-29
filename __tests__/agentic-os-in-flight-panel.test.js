/**
 * "Pull requests in flight" panel — the #909 regression surface.
 *
 * The panel read 0 while eight agent pull requests were open, because the hub
 * generator filtered on an `agentic-os` label that nothing ever puts on a pull
 * request. What made that survive was not the wrong number, it was that the
 * page gave a reader no way to tell "nothing is in flight" from "the filter is
 * dead": a bare `0`, no stated rule, no denominator.
 *
 * So these tests pin the *legibility* of the panel, not just its contents —
 * the fraction, the stated inclusion rule, and the per-card reason a pull
 * request appears. They mock the loader because the committed snapshot is a
 * fixed artifact and these are claims about rendering, not about live counts.
 */
import { render, screen } from '@testing-library/react'

// Mocked by relative path: next/jest's `@/` mapper is not applied to the
// hoisted jest.mock() specifier, though it is to the imports below. Both
// resolve to the same module, so the page's `@/lib/dashboardData` import
// receives this mock.
jest.mock('../src/lib/dashboardData', () => {
  const actual = jest.requireActual('../src/lib/dashboardData')
  return { ...actual, loadAgenticOsStatus: jest.fn() }
})

import { loadAgenticOsStatus } from '@/lib/dashboardData'
import AgenticOs from '@/app/agentic-os/page'

const BASE = {
  generated_at: new Date().toISOString(),
  repo: 'FreeForCharity/FFC-Cloudflare-Automation',
  backlog_issues: [],
  in_flight_prs: [],
  conductor_log: [],
  pending_gates: [],
}

const RULE =
  'Open pull requests on this repo that are agent work on this backlog: a PR is listed ' +
  'when it carries the agentic-os label, or when its body references an agentic-os issue.'

function pr(overrides) {
  return {
    number: 902,
    title: 'An unlabelled agent PR',
    state: 'open',
    draft: true,
    assignee: null,
    updated_at: new Date().toISOString(),
    url: 'https://github.com/FreeForCharity/FFC-Cloudflare-Automation/pull/902',
    labels: [],
    ...overrides,
  }
}

describe('in-flight panel legibility (#909)', () => {
  afterEach(() => jest.resetAllMocks())

  it('states the inclusion rule in words when the feed provides it', () => {
    loadAgenticOsStatus.mockReturnValue({
      ...BASE,
      in_flight_prs: [pr({ linked_agentic_issues: [730] })],
      in_flight_prs_rule: RULE,
      open_prs_total: 8,
    })
    render(<AgenticOs />)
    expect(screen.getByText(/What counts:/)).toBeInTheDocument()
    expect(screen.getByText(new RegExp('carries the agentic-os label'))).toBeInTheDocument()
  })

  it('shows the count as a fraction of all open PRs, so 0 reads as a filter problem', () => {
    loadAgenticOsStatus.mockReturnValue({
      ...BASE,
      in_flight_prs: [pr({ linked_agentic_issues: [730] })],
      in_flight_prs_rule: RULE,
      open_prs_total: 8,
    })
    render(<AgenticOs />)
    expect(screen.getByText('1 of 8 PRs in flight')).toBeInTheDocument()
  })

  it('separates "none are open" from "none are linked" (open_prs_total: 0)', () => {
    // 0 is a real reading, not a missing field. A truthiness check would send
    // it to the pre-#909 wording and lose the distinction this panel is for.
    loadAgenticOsStatus.mockReturnValue({
      ...BASE,
      in_flight_prs: [],
      in_flight_prs_rule: RULE,
      open_prs_total: 0,
    })
    render(<AgenticOs />)
    expect(screen.getByText('0 of 0 PRs in flight')).toBeInTheDocument()
    expect(screen.getByText('No pull requests are open on the hub.')).toBeInTheDocument()
    expect(screen.queryByText(/No open Agentic OS pull requests right now/)).not.toBeInTheDocument()
  })

  it('names the referenced issue on a PR that carries no label at all', () => {
    // This is the #909 case: the PR is unlabelled, and the backlog issue it
    // references is the only reason it belongs on the page. If the panel
    // cannot say so, a reader cannot check the rule against the rows.
    loadAgenticOsStatus.mockReturnValue({
      ...BASE,
      in_flight_prs: [pr({ labels: [], linked_agentic_issues: [730, 841] })],
      in_flight_prs_rule: RULE,
      open_prs_total: 8,
    })
    render(<AgenticOs />)
    expect(screen.getByText(/refs #730, #841/)).toBeInTheDocument()
  })

  it('distinguishes an empty panel from a dead one when nothing matches', () => {
    loadAgenticOsStatus.mockReturnValue({
      ...BASE,
      in_flight_prs: [],
      in_flight_prs_rule: RULE,
      open_prs_total: 8,
    })
    render(<AgenticOs />)
    expect(screen.getByText('0 of 8 PRs in flight')).toBeInTheDocument()
    expect(
      screen.getByText(/None of the 8 open pull requests are linked to this backlog/)
    ).toBeInTheDocument()
  })

  it('degrades to the old wording on a feed generated before the fix', () => {
    // Delivery is decoupled: the page ships before the next feed does, and a
    // pre-#909 snapshot must still render rather than throw or show "of
    // undefined".
    loadAgenticOsStatus.mockReturnValue({ ...BASE, in_flight_prs: [pr({})] })
    render(<AgenticOs />)
    expect(screen.getByText('1 PR in flight')).toBeInTheDocument()
    expect(screen.queryByText(/What counts:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument()
  })
})
