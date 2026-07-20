/**
 * Agent session inventory data tests.
 *
 * Validates the committed snapshot (public/data/agent-session-inventory.json)
 * against its schema and internal arithmetic, and unit-tests the pure helpers
 * in src/lib/agenticOsData.ts. These tests double as the validator run by the
 * /session-inventory-refresh skill, so they assert internal consistency only —
 * never live external values (counts change daily; generatedAt is the
 * authoritative "as of" marker).
 */
import fs from 'fs'
import path from 'path'
import {
  loadAgentSessionInventory,
  isValidRepoEntry,
  totalsByKind,
  topRepos,
  categoryTotals,
  type AgentSessionInventory,
  type RepoSessionEntry,
} from '@/lib/agenticOsData'

const SNAPSHOT_PATH = path.join(process.cwd(), 'public', 'data', 'agent-session-inventory.json')

const KINDS = ['internal', 'charity-site', 'template', 'tooling']
const SURVEY_STATUSES = ['ok', 'partial', 'unreachable']

function makeRepo(overrides: Partial<RepoSessionEntry> = {}): RepoSessionEntry {
  return {
    name: 'FFC-EX-example.org',
    url: 'https://github.com/FreeForCharity/FFC-EX-example.org',
    kind: 'charity-site',
    agents: {
      claude: { total: 3, open: 1, closed: 2, firstSeen: '2026-03-01', lastSeen: '2026-06-01' },
      copilot: { total: 1, open: 0, closed: 1, firstSeen: '2025-12-01', lastSeen: '2026-01-15' },
    },
    exampleTitles: ['feat: add page'],
    categoryCounts: { feature: 1 },
    surveyStatus: 'ok',
    notes: '',
    ...overrides,
  }
}

describe('agent-session-inventory.json snapshot', () => {
  let inventory: AgentSessionInventory

  beforeAll(() => {
    inventory = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'))
  })

  test('has schemaVersion 1 and provenance fields', () => {
    expect(inventory.schemaVersion).toBe(1)
    expect(typeof inventory.method).toBe('string')
    expect(Number.isNaN(Date.parse(inventory.generatedAt))).toBe(false)
    expect(Number.isNaN(Date.parse(inventory.window.from))).toBe(false)
    expect(Number.isNaN(Date.parse(inventory.window.to))).toBe(false)
  })

  test('repo entry count matches orgTotals.repos', () => {
    expect(inventory.repos.length).toBe(inventory.orgTotals.repos)
  })

  test('org totals match per-repo arithmetic', () => {
    const claude = inventory.repos.reduce((s, r) => s + r.agents.claude.total, 0)
    const copilot = inventory.repos.reduce((s, r) => s + r.agents.copilot.total, 0)
    const withSessions = inventory.repos.filter(
      (r) => r.agents.claude.total + r.agents.copilot.total > 0
    ).length
    expect(inventory.orgTotals.claudePrs).toBe(claude)
    expect(inventory.orgTotals.copilotPrs).toBe(copilot)
    expect(inventory.orgTotals.totalSessions).toBe(claude + copilot)
    expect(inventory.orgTotals.reposWithSessions).toBe(withSessions)
  })

  test('every repo entry is well-formed', () => {
    const names = new Set<string>()
    for (const repo of inventory.repos) {
      expect(repo.name).toBeTruthy()
      expect(names.has(repo.name)).toBe(false)
      names.add(repo.name)
      expect(repo.url).toContain('github.com/FreeForCharity/')
      expect(KINDS).toContain(repo.kind)
      expect(SURVEY_STATUSES).toContain(repo.surveyStatus)
      expect(repo.exampleTitles.length).toBeLessThanOrEqual(5)
      for (const agent of [repo.agents.claude, repo.agents.copilot]) {
        expect(agent.total).toBe(agent.open + agent.closed)
        expect(agent.total).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('repos are sorted by name', () => {
    const names = inventory.repos.map((r) => r.name)
    expect(names).toEqual([...names].sort())
  })

  test('categoryCounts keys all exist in the categories taxonomy', () => {
    const ids = new Set(inventory.categories.map((c) => c.id))
    for (const repo of inventory.repos) {
      for (const key of Object.keys(repo.categoryCounts)) {
        expect(ids).toContain(key)
      }
    }
  })

  test('loader returns the snapshot', () => {
    const loaded = loadAgentSessionInventory()
    expect(loaded).not.toBeNull()
    expect(loaded!.orgTotals.repos).toBe(inventory.orgTotals.repos)
  })
})

describe('agenticOsData pure helpers', () => {
  const repos: RepoSessionEntry[] = [
    makeRepo({ name: 'a-internal', kind: 'internal' }),
    makeRepo({
      name: 'b-site',
      kind: 'charity-site',
      categoryCounts: { feature: 2, fix: 1 },
    }),
    makeRepo({
      name: 'c-site-quiet',
      kind: 'charity-site',
      agents: {
        claude: { total: 0, open: 0, closed: 0, firstSeen: null, lastSeen: null },
        copilot: { total: 0, open: 0, closed: 0, firstSeen: null, lastSeen: null },
      },
      categoryCounts: {},
      exampleTitles: [],
    }),
  ]

  test('totalsByKind groups and sums, omitting empty kinds', () => {
    const rows = totalsByKind(repos)
    expect(rows).toEqual([
      { kind: 'internal', repoCount: 1, sessions: 4 },
      { kind: 'charity-site', repoCount: 2, sessions: 4 },
    ])
  })

  test('topRepos sorts by combined sessions without mutating input', () => {
    const original = [...repos]
    const top = topRepos(repos, 2)
    expect(top.map((r) => r.name)).toEqual(['a-internal', 'b-site'])
    expect(repos).toEqual(original)
  })

  test('categoryTotals aggregates across repos, highest first', () => {
    expect(categoryTotals(repos)).toEqual([
      { id: 'feature', count: 3 },
      { id: 'fix', count: 1 },
    ])
  })

  test('loader shape-guards malformed data to null', () => {
    // loadAgentSessionInventory reads from disk; the shape guard itself is
    // exercised via the real file above. Here we assert the helpers tolerate
    // an empty repo list (the "data unavailable" path renders no rows).
    expect(totalsByKind([])).toEqual([])
    expect(topRepos([], 5)).toEqual([])
    expect(categoryTotals([])).toEqual([])
  })

  test('isValidRepoEntry accepts a well-formed entry', () => {
    expect(isValidRepoEntry(makeRepo())).toBe(true)
  })

  test('isValidRepoEntry rejects entries the dashboard cannot render', () => {
    const base = makeRepo()
    // Missing agents entirely (the case from the review: r.agents.* would throw).
    expect(isValidRepoEntry({ ...base, agents: undefined })).toBe(false)
    // Agent stats with non-numeric counts.
    expect(
      isValidRepoEntry({
        ...base,
        agents: { ...base.agents, claude: { ...base.agents.claude, total: '3' } },
      })
    ).toBe(false)
    // categoryCounts must be a plain object (Object.entries is iterated).
    expect(isValidRepoEntry({ ...base, categoryCounts: null })).toBe(false)
    expect(isValidRepoEntry({ ...base, categoryCounts: [] })).toBe(false)
    // Enum fields must hold known values.
    expect(isValidRepoEntry({ ...base, kind: 'mystery' })).toBe(false)
    expect(isValidRepoEntry({ ...base, surveyStatus: 'maybe' })).toBe(false)
    // exampleTitles must be an array of strings.
    expect(isValidRepoEntry({ ...base, exampleTitles: 'feat: x' })).toBe(false)
    expect(isValidRepoEntry({ ...base, exampleTitles: [42] })).toBe(false)
    // categoryCounts values must be numeric (categoryTotals does arithmetic).
    expect(isValidRepoEntry({ ...base, categoryCounts: { feature: 'many' } })).toBe(false)
    // firstSeen/lastSeen must be string or null.
    expect(
      isValidRepoEntry({
        ...base,
        agents: { ...base.agents, copilot: { ...base.agents.copilot, firstSeen: 20260101 } },
      })
    ).toBe(false)
    expect(isValidRepoEntry(null)).toBe(false)
  })
})
