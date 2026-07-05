import Link from 'next/link'
import type { Metadata } from 'next'
import {
  loadAgentSessionInventory,
  totalsByKind,
  categoryTotals,
  type RepoKind,
  type RepoSessionEntry,
  type SurveyStatus,
} from '@/lib/agenticOsData'
import { isStale } from '@/lib/dashboardData'
import { assetPath } from '@/lib/assetPath'

export const metadata: Metadata = {
  title: 'Agent Session Inventory',
  description:
    'The org-wide inventory of AI agent pull-request sessions across all FreeForCharity public repositories: per-repo Claude and Copilot session counts, date ranges, and task categories.',
  keywords:
    'agent sessions, AI agent inventory, Claude Code sessions, Copilot sessions, nonprofit AI transparency, Free For Charity',
}

// Hoisted so the lint rule's Literal-in-JSX-href selector doesn't match (same
// pattern as automation's CATALOG_JSON_HREF).
const INVENTORY_JSON_HREF = assetPath('/data/agent-session-inventory.json')

const KIND_LABELS: Record<RepoKind, string> = {
  internal: 'Internal platform',
  tooling: 'Automation & agent tooling',
  template: 'Site templates',
  'charity-site': 'Charity sites',
}

const KIND_ORDER: RepoKind[] = ['internal', 'tooling', 'template', 'charity-site']

function statusBadge(status: SurveyStatus) {
  if (status === 'ok') return 'bg-green-100 text-green-800'
  if (status === 'partial') return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function dateRange(entry: RepoSessionEntry): string {
  const dates = [
    entry.agents.claude.firstSeen,
    entry.agents.claude.lastSeen,
    entry.agents.copilot.firstSeen,
    entry.agents.copilot.lastSeen,
  ].filter((d): d is string => Boolean(d))
  if (dates.length === 0) return '—'
  const first = dates.reduce((a, b) => (a < b ? a : b))
  const last = dates.reduce((a, b) => (a > b ? a : b))
  return first === last ? first : `${first} → ${last}`
}

export default function SessionInventory() {
  const inventory = loadAgentSessionInventory()

  if (!inventory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Agent Session Inventory</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-gray-700">
            The session inventory data is currently unavailable. The committed snapshot
            (agent-session-inventory.json) is missing or malformed — run the{' '}
            <code className="bg-white px-1 rounded border border-yellow-200">
              /session-inventory-refresh
            </code>{' '}
            skill to regenerate it.
          </div>
        </main>
      </div>
    )
  }

  const { orgTotals, repos, categories, generatedAt, window: surveyWindow } = inventory
  const stale = isStale(generatedAt, 90)
  const categoryLabels = new Map(categories.map((c) => [c.id, c.label]))
  const catTotals = categoryTotals(repos)
  const catMax = catTotals.reduce((m, c) => Math.max(m, c.count), 0)
  const kindRows = totalsByKind(repos)

  const stats = [
    { label: 'Public repos', value: orgTotals.repos },
    { label: 'Repos with agent sessions', value: orgTotals.reposWithSessions },
    { label: 'Claude PR sessions', value: orgTotals.claudePrs },
    { label: 'Copilot PR sessions', value: orgTotals.copilotPrs },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agent Session Inventory</h1>
          <p className="text-blue-100 max-w-3xl">
            Every AI coding-agent session at FFC lands as a pull request from a{' '}
            <code className="bg-blue-700/50 px-1 rounded">claude/*</code> or{' '}
            <code className="bg-blue-700/50 px-1 rounded">copilot/*</code> branch, so the PR record
            is the session record. This dashboard renders the committed snapshot of that record
            across all {orgTotals.repos} public FreeForCharity repositories —{' '}
            {orgTotals.totalSessions} agent PR sessions in total.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {stale && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-gray-700">
            ⚠️ This snapshot was generated more than 90 days ago and should be treated as stale.
            Refresh it with the{' '}
            <code className="bg-white px-1 rounded">/session-inventory-refresh</code> skill.
          </div>
        )}

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow p-5 text-center">
              <div className="text-3xl font-bold text-indigo-700">{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Methodology */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How this data is collected</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Method:</strong> public GitHub pull-request searches per repository (
              <code className="bg-gray-100 px-1 rounded">head:claude/</code> and{' '}
              <code className="bg-gray-100 px-1 rounded">head:copilot/</code> branch filters), so
              counts are lifetime totals per agent as of the snapshot date. First/last-seen dates
              disambiguate activity inside the analysis window ({surveyWindow.from} →{' '}
              {surveyWindow.to}); Copilot totals include the pre-2026 era before FFC migrated to
              Claude. Task categories are keyword tags over each repo&apos;s most recent PR titles —
              a sample, not an exhaustive classification.
            </p>
            <p>
              <strong>Snapshot generated:</strong> {generatedAt.split('T')[0]}. This is a committed
              snapshot refreshed manually via the{' '}
              <code className="bg-gray-100 px-1 rounded">/session-inventory-refresh</code> skill —
              per FFC&apos;s standards convention, this site documents other repos but never
              live-scans them, and no scheduled workflow regenerates this file. Full methodology:{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/docs/agentic-os/02-session-inventory.md"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                docs/agentic-os/02-session-inventory.md
              </a>
            </p>
          </div>
        </section>

        {/* Category distribution */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What the agents worked on (sampled)
          </h2>
          <div className="space-y-3">
            {catTotals.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-48 text-sm text-gray-700 shrink-0">
                  {categoryLabels.get(c.id) ?? c.id}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-indigo-500 h-3 rounded-full"
                    style={{ width: `${catMax ? (c.count / catMax) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{c.count}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Tag counts cover each repository&apos;s most recent PR titles only (up to 5 per repo).
          </p>
        </section>

        {/* Per-kind tables */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All {orgTotals.repos} repositories
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Grouped by role in the FFC portfolio. Sessions = Claude + Copilot PR totals. Repos with
            zero sessions are listed too — full coverage is the point.
          </p>
          <div className="space-y-8">
            {KIND_ORDER.filter((kind) => repos.some((r) => r.kind === kind)).map((kind) => {
              const list = repos.filter((r) => r.kind === kind)
              const kindSessions = kindRows.find((row) => row.kind === kind)?.sessions ?? 0
              return (
                <div key={kind} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{KIND_LABELS[kind]}</h3>
                    <span className="text-sm text-gray-500 ml-auto">
                      {list.length} repos · {kindSessions} sessions
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                          <th className="px-4 py-2 font-medium">Repository</th>
                          <th className="px-4 py-2 font-medium">Claude</th>
                          <th className="px-4 py-2 font-medium">Copilot</th>
                          <th className="px-4 py-2 font-medium">Activity range</th>
                          <th className="px-4 py-2 font-medium">Recent work</th>
                          <th className="px-4 py-2 font-medium">Survey</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {list.map((r) => (
                          <tr key={r.name} className="align-top">
                            <td className="px-4 py-2">
                              <a
                                href={r.url}
                                className="text-blue-600 hover:underline font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {r.name}
                              </a>
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                              {r.agents.claude.total}
                              {r.agents.claude.open > 0 && (
                                <span className="text-xs text-gray-400">
                                  {' '}
                                  ({r.agents.claude.open} open)
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-gray-700">{r.agents.copilot.total}</td>
                            <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">
                              {dateRange(r)}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-500 max-w-md">
                              {r.exampleTitles[0] ?? '—'}
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-xs ${statusBadge(r.surveyStatus)}`}
                              >
                                {r.surveyStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* For agents */}
        <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">For AI agents & new admins</h2>
          <p className="text-gray-700 text-sm">
            The machine-readable snapshot is published at{' '}
            <a
              href={INVENTORY_JSON_HREF}
              className="text-blue-600 hover:underline font-mono text-xs"
            >
              https://ffcadmin.org/data/agent-session-inventory.json
            </a>
            . Schema:{' '}
            <code className="bg-white px-1 rounded border border-indigo-100">repos[]</code> with{' '}
            <em>
              name, url, kind, agents.claude/copilot (total, open, closed, firstSeen, lastSeen),
              exampleTitles, categoryCounts, surveyStatus
            </em>
            . Related:{' '}
            <Link href="/agentic-os" className="text-blue-600 hover:underline">
              Agentic OS overview
            </Link>{' '}
            ·{' '}
            <Link href="/agentic-os/architecture" className="text-blue-600 hover:underline">
              Architecture & roadmap
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
