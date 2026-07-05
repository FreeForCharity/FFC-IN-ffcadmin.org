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

export function loadAgentSessionInventory(): AgentSessionInventory | null {
  const data = readJson<AgentSessionInventory>('agent-session-inventory.json')
  // Shape guard: a syntactically valid but malformed file degrades to null.
  if (
    !data ||
    !Array.isArray(data.repos) ||
    !Array.isArray(data.categories) ||
    typeof data.generatedAt !== 'string' ||
    !data.window ||
    typeof data.window.from !== 'string' ||
    typeof data.window.to !== 'string' ||
    !data.orgTotals ||
    typeof data.orgTotals.repos !== 'number' ||
    typeof data.orgTotals.reposWithSessions !== 'number' ||
    typeof data.orgTotals.claudePrs !== 'number' ||
    typeof data.orgTotals.copilotPrs !== 'number' ||
    typeof data.orgTotals.totalSessions !== 'number'
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
