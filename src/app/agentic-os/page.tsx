import type { Metadata } from 'next'
import {
  loadAgenticOsStatus,
  isStale,
  relativeAge,
  type AgenticIssue,
  type AgenticPr,
  type AgenticLogEntry,
  type AgenticGate,
} from '@/lib/dashboardData'
import { assetPath } from '@/lib/assetPath'

export const metadata: Metadata = {
  title: 'Agentic OS Status',
  description:
    'Live status of the Free For Charity Agentic OS: the automation backlog worked by sandboxed AI agents, in-flight pull requests, pending deployment gates, and the latest Conductor log entries.',
  keywords:
    'Free For Charity automation, agentic OS, AI agents, automation backlog, conductor log, deployment gates',
}

// Hoisted so the lint rule's Literal-in-JSX-href selector doesn't match (same
// pattern as /automation's CATALOG_JSON_HREF and /fleet-status's STATUS_JSON_HREF).
const STATUS_JSON_HREF = assetPath('/data/agentic-os-status.json')
const CONDUCTOR_LOG_HREF = 'https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/719'
const STATUS_ISSUE_HREF = 'https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/723'

function labelBadges(labels: string[]) {
  // The `agentic-os` label is on everything here; surface only the extra labels.
  return labels.filter((l) => l !== 'agentic-os')
}

function IssueRow({ issue }: { issue: AgenticIssue }) {
  return (
    <tr className="border-t border-gray-200 align-top">
      <td className="py-2 pr-3 whitespace-nowrap">
        <a
          href={issue.url}
          className="text-blue-700 font-semibold hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          #{issue.number}
        </a>
      </td>
      <td className="py-2 pr-3 text-gray-900">
        {issue.title}
        <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
          {labelBadges(issue.labels).map((l) => (
            <span
              key={l}
              className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
            >
              {l}
            </span>
          ))}
        </span>
      </td>
      <td className="py-2 pr-3 whitespace-nowrap text-sm text-gray-500">
        {issue.assignee ?? 'unassigned'}
      </td>
      <td className="py-2 whitespace-nowrap text-sm text-gray-500">
        {relativeAge(issue.updated_at)}
      </td>
    </tr>
  )
}

function PrCard({ pr }: { pr: AgenticPr }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-2">
        <a
          href={pr.url}
          className="text-blue-700 font-semibold hover:underline break-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          #{pr.number}
        </a>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            pr.draft ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
          }`}
        >
          {pr.draft ? 'Draft' : 'Ready'}
        </span>
      </div>
      <div className="text-sm text-gray-900">{pr.title}</div>
      <div className="mt-2 text-xs text-gray-500">
        {pr.assignee ?? 'unassigned'} · updated {relativeAge(pr.updated_at)}
      </div>
    </div>
  )
}

function GateCard({ gate }: { gate: AgenticGate }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-semibold text-amber-900 break-all">
          {gate.workflow_name ?? 'Workflow run'}
        </span>
        <span className="inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900 whitespace-nowrap">
          {gate.environment ?? 'environment'}
        </span>
      </div>
      <div className="text-xs text-amber-800">
        Waiting since {relativeAge(gate.created_at)} ·{' '}
        <a
          href={gate.url}
          className="font-semibold hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Review deployment
        </a>
      </div>
    </div>
  )
}

function LogEntry({ entry }: { entry: AgenticLogEntry }) {
  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
        <span className="font-semibold text-gray-700">{entry.author ?? 'unknown'}</span>
        <span>· {relativeAge(entry.created_at)}</span>
        <a
          href={entry.url}
          className="text-blue-700 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          view
        </a>
      </div>
      <p className="whitespace-pre-wrap break-words text-sm text-gray-700">
        {entry.body}
        {entry.truncated && <span className="text-gray-400"> (truncated)</span>}
      </p>
    </li>
  )
}

export default function AgenticOsStatus() {
  const data = loadAgenticOsStatus()

  if (!data) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Agentic OS Status</h1>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-600">
          Agentic OS status data is not available yet — the scheduled sync workflow has not produced
          <code className="mx-1">agentic-os-status.json</code>. It refreshes daily alongside the
          automation catalog.
        </div>
      </main>
    )
  }

  const stale = isStale(data.generated_at, 2)
  // Newest Conductor entries first for the log surface.
  const log = [...data.conductor_log].reverse()

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Agentic OS Status</h1>
      <p className="mb-1 text-gray-600">
        A live view of the Free For Charity{' '}
        <a
          href={STATUS_ISSUE_HREF}
          className="text-blue-700 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Agentic OS
        </a>
        : the automation backlog that sandboxed AI agents pick up, the pull requests in flight,
        deployment gates awaiting a human, and the latest entries from the{' '}
        <a
          href={CONDUCTOR_LOG_HREF}
          className="text-blue-700 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Conductor log
        </a>
        .
      </p>
      <p className="mb-6 text-sm text-gray-500">
        Updated {relativeAge(data.generated_at)} · {data.repo} ·{' '}
        <a href={STATUS_JSON_HREF} className="text-blue-700 hover:underline">
          raw JSON
        </a>
      </p>

      {stale && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This snapshot is more than 2 days old — the daily sync workflow may be stalled. GitHub is
          authoritative for current state.
        </div>
      )}

      <div className="mb-8 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-800">
          {data.backlog_issues.length} backlog issues
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-800">
          {data.in_flight_prs.length} PRs in flight
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-800">
          {data.pending_gates.length} gates waiting
        </span>
      </div>

      {data.pending_gates.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-gray-900">Gates awaiting approval</h2>
          <p className="mb-4 text-sm text-gray-600">
            These workflow runs are paused at an environment approval gate. Only a human reviewer
            can approve them — agents never can.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.pending_gates.map((gate) => (
              <GateCard key={gate.run_id} gate={gate} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-gray-900">Pull requests in flight</h2>
        {data.in_flight_prs.length === 0 ? (
          <p className="text-sm text-gray-500">No open Agentic OS pull requests right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.in_flight_prs.map((pr) => (
              <PrCard key={pr.number} pr={pr} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-gray-900">Automation backlog</h2>
        {data.backlog_issues.length === 0 ? (
          <p className="text-sm text-gray-500">The backlog is empty.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2 pr-3 font-semibold">Issue</th>
                  <th className="py-2 pr-3 font-semibold">Title</th>
                  <th className="py-2 pr-3 font-semibold">Assignee</th>
                  <th className="py-2 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.backlog_issues.map((issue) => (
                  <IssueRow key={issue.number} issue={issue} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-gray-900">Latest Conductor log</h2>
        {log.length === 0 ? (
          <p className="text-sm text-gray-500">No recent Conductor log entries.</p>
        ) : (
          <ul className="space-y-3">
            {log.map((entry) => (
              <LogEntry key={entry.url} entry={entry} />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
