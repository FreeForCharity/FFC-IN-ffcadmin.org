/**
 * Server-side loader and helpers for the org-wide agent session inventory
 * (public/data/agent-session-inventory.json).
 *
 * The inventory is a hand-refreshed committed snapshot produced by the
 * /session-inventory-refresh skill (see docs/agentic-os/02-session-inventory.md).
 * It is deliberately NOT produced by a scheduled workflow: ffcadmin is a
 * snapshot/documentation plane and must not become a live scanner of other
 * repos (docs/standards/README.md). Loaders never throw: a missing or
 * malformed file returns null so the dashboard degrades gracefully.
 */
import fs from 'fs'
import path from 'path'

export type RepoKind = 'internal' | 'charity-site' | 'template' | 'tooling'
export type SurveyStatus = 'ok' | 'partial' | 'unreachable'

export interface AgentPrStats {
  total: number
  open: number
  closed: number
  firstSeen: string | null
  lastSeen: string | null
}

export interface RepoSessionEntry {
  name: string
  url: string
  kind: RepoKind
  agents: {
    claude: AgentPrStats
    copilot: AgentPrStats
  }
  exampleTitles: string[]
  categoryCounts: Record<string, number>
  surveyStatus: SurveyStatus
  notes: string
}

export interface SessionCategory {
  id: string
  label: string
}

export interface AgentSessionInventory {
  schemaVersion: number
  generatedAt: string
  method: string
  window: { from: string; to: string }
  orgTotals: {
    repos: number
    reposWithSessions: number
    claudePrs: number
    copilotPrs: number
    totalSessions: number
  }
  categories: SessionCategory[]
  repos: RepoSessionEntry[]
}

function readJson<T>(file: string): T | null {
  try {
    const full = path.join(process.cwd(), 'public', 'data', file)
    return JSON.parse(fs.readFileSync(full, 'utf8')) as T
  } catch {
    return null
  }
}

const REPO_KINDS: readonly string[] = ['internal', 'charity-site', 'template', 'tooling']
const SURVEY_STATUSES: readonly string[] = ['ok', 'partial', 'unreachable']

function isValidAgentStats(stats: unknown): stats is AgentPrStats {
  if (!stats || typeof stats !== 'object') return false
  const s = stats as Record<string, unknown>
  return (
    typeof s.total === 'number' &&
    typeof s.open === 'number' &&
    typeof s.closed === 'number' &&
    (s.firstSeen === null || typeof s.firstSeen === 'string') &&
    (s.lastSeen === null || typeof s.lastSeen === 'string')
  )
}

/** Validate the minimal per-repo shape the dashboard and helpers rely on. */
export function isValidRepoEntry(entry: unknown): entry is RepoSessionEntry {
  if (!entry || typeof entry !== 'object') return false
  const e = entry as Record<string, unknown>
  const agents = e.agents as Record<string, unknown> | undefined
  return (
    typeof e.name === 'string' &&
    typeof e.url === 'string' &&
    REPO_KINDS.includes(e.kind as string) &&
    SURVEY_STATUSES.includes(e.surveyStatus as string) &&
    Array.isArray(e.exampleTitles) &&
    e.exampleTitles.every((t) => typeof t === 'string') &&
    !!e.categoryCounts &&
    typeof e.categoryCounts === 'object' &&
    !Array.isArray(e.categoryCounts) &&
    Object.values(e.categoryCounts).every((v) => typeof v === 'number') &&
    !!agents &&
    isValidAgentStats(agents.claude) &&
    isValidAgentStats(agents.copilot)
  )
}

export function loadAgentSessionInventory(): AgentSessionInventory | null {
  const data = readJson<AgentSessionInventory>('agent-session-inventory.json')
  // Shape guard: a syntactically valid but malformed file degrades to null —
  // including any malformed repos[]/categories[] entry, so downstream helpers
  // and pages never throw on partial data.
  if (
    !data ||
    !Array.isArray(data.repos) ||
    !Array.isArray(data.categories) ||
    typeof data.generatedAt !== 'string' ||
    Number.isNaN(Date.parse(data.generatedAt)) ||
    !data.window ||
    typeof data.window.from !== 'string' ||
    Number.isNaN(Date.parse(data.window.from)) ||
    typeof data.window.to !== 'string' ||
    Number.isNaN(Date.parse(data.window.to)) ||
    !data.orgTotals ||
    typeof data.orgTotals.repos !== 'number' ||
    typeof data.orgTotals.reposWithSessions !== 'number' ||
    typeof data.orgTotals.claudePrs !== 'number' ||
    typeof data.orgTotals.copilotPrs !== 'number' ||
    typeof data.orgTotals.totalSessions !== 'number' ||
    !data.categories.every((c) => !!c && typeof c.id === 'string' && typeof c.label === 'string') ||
    !data.repos.every(isValidRepoEntry)
  ) {
    return null
  }
  return data
}

/** Per-kind repo and session totals, in a stable display order. */
export function totalsByKind(
  repos: RepoSessionEntry[]
): { kind: RepoKind; repoCount: number; sessions: number }[] {
  const order: RepoKind[] = ['internal', 'tooling', 'template', 'charity-site']
  return order
    .map((kind) => {
      const list = repos.filter((r) => r.kind === kind)
      return {
        kind,
        repoCount: list.length,
        sessions: list.reduce((sum, r) => sum + r.agents.claude.total + r.agents.copilot.total, 0),
      }
    })
    .filter((row) => row.repoCount > 0)
}

/** The `n` repos with the most combined agent sessions, highest first. */
export function topRepos(repos: RepoSessionEntry[], n: number): RepoSessionEntry[] {
  return [...repos]
    .sort(
      (a, b) =>
        b.agents.claude.total +
        b.agents.copilot.total -
        (a.agents.claude.total + a.agents.copilot.total)
    )
    .slice(0, n)
}

/** Aggregate sampled category tag counts across all repos, highest first. */
export function categoryTotals(repos: RepoSessionEntry[]): { id: string; count: number }[] {
  const totals = new Map<string, number>()
  for (const repo of repos) {
    for (const [id, count] of Object.entries(repo.categoryCounts)) {
      totals.set(id, (totals.get(id) ?? 0) + count)
    }
  }
  return [...totals.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
}
