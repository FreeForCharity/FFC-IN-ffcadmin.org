import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agentic OS Architecture',
  description:
    'The target architecture of the FFC Agentic OS: six capability layers mapped across five repository planes, the current gaps, and the phased roadmap to close them.',
  keywords:
    'agentic OS architecture, agent orchestration layers, MCP, Claude Code skills, agent governance, nonprofit AI roadmap',
}

const LAYERS: {
  name: string
  today: string
  planned: string
}[] = [
  {
    name: '1 · Connections (tools & MCP)',
    today:
      'MCP servers wired per repo: GitHub, Cloudflare, Playwright, Sentry, Microsoft Learn. Copilot MCP config in .copilot/mcp-config.json.',
    planned:
      'A single org-maintained MCP baseline distributed from FFC-IN-AI-Management so every repo exposes the same tools.',
  },
  {
    name: '2 · Memory & shared context',
    today:
      'CLAUDE.md / AGENTS.md / GEMINI.md instruction files, freshness-stamped snapshot docs, and the PR audit trail as the durable session record.',
    planned:
      'A lessons-learned loop: periodic reflection sessions that mine merged agent PRs and propose CLAUDE.md/agent-prompt updates.',
  },
  {
    name: '3 · Agents',
    today:
      'Custom subagents in .claude/agents/ (dns-audit, site-health, pr-reviewer, copilot-review-cycle, cross-repo-sync, onboarding, session-archivist, org-inventory-auditor) plus the Antigravity reviewer/coder loop.',
    planned:
      'The agent set versioned and distributed org-wide from AI-Management; charity-site repos get the site-focused subset.',
  },
  {
    name: '4 · Orchestration',
    today:
      'The issue → branch → PR runbook (docs/agent-issue-pr-workflow.md), fan-out skills in .claude/skills/, and the numbered ops workflow catalog.',
    planned:
      'Event-driven runs on the Max subscription: Routine GitHub triggers for PR events, plus @claude mentions via the subscription-authenticated claude-code-action — all under a dedicated automation account, never API billing.',
  },
  {
    name: '5 · Governance & guardrails',
    today:
      'Permission allow/deny policy in .claude/settings.json, secret rules, approval-gated write workflows with dry-run defaults, no-self-merge PR review.',
    planned:
      'A written org governance doc (docs/agentic-os/06-governance.md) adopted across repos; a dedicated bot identity for unattended runs.',
  },
  {
    name: '6 · Observability',
    today:
      'The session inventory snapshot + dashboard, CI status and data feeds on this site, freshness conventions on every snapshot doc.',
    planned:
      'Quarterly inventory refreshes, per-plane health checks via the /agentic-os-status skill, and session/run budgets on automated runs (subscription capacity, not token spend).',
  },
]

const PHASES = [
  {
    phase: 'Phase 0 — Capture (this site)',
    detail:
      'Inventory every agent session across the org, document the architecture and governance model, and ship the reference skills/agents in this repo.',
    status: 'Delivered',
  },
  {
    phase: 'Phase 1 — Distribute',
    detail:
      'FFC-IN-AI-Management templates the session-archivist/auditor agents and the agentic-os skills into its base + overlay model and syncs them to all ~30 managed repos.',
    status: 'Next',
  },
  {
    phase: 'Phase 2 — Automate',
    detail:
      'Org plugin marketplace + Max-subscription event automation (Routine GitHub triggers, subscription-authenticated claude-code-action) so every new charity site is born with the full agent toolkit; a dedicated automation account for unattended runs. Already operating from the hub: the Conductor loop and the daily agentic-os status feed rendered on the Agentic OS status page.',
    status: 'In progress',
  },
  {
    phase: 'Phase 3 — Operate',
    detail:
      'Quarterly inventory refresh cadence, reflection sessions feeding instruction-file improvements, and observability budgets — the OS as routine operations.',
    status: 'Planned',
  },
]

function statusBadge(status: string) {
  if (status === 'Delivered') return 'bg-green-100 text-green-800'
  if (status === 'Next') return 'bg-blue-100 text-blue-800'
  if (status === 'In progress') return 'bg-emerald-100 text-emerald-800'
  return 'bg-gray-100 text-gray-600'
}

export default function AgenticOsArchitecture() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agentic OS Architecture</h1>
          <p className="text-blue-100 max-w-3xl">
            Six capability layers, five repository planes, one operating system. This page shows
            what FFC has today in each layer, what is planned, and the phased roadmap that gets
            there — the full detail lives in the blueprint docs.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Layers */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The six layers</h2>
          <p className="text-gray-700 text-sm mb-6">
            The layers are the standard anatomy of an agentic operating system; the planes (
            <Link href="/agentic-os" className="text-blue-600 hover:underline">
              see overview
            </Link>
            ) are the FFC repos that implement them.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-2 font-medium w-56">Layer</th>
                  <th className="px-4 py-2 font-medium">What FFC has today</th>
                  <th className="px-4 py-2 font-medium">What is planned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {LAYERS.map((l) => (
                  <tr key={l.name} className="align-top">
                    <td className="px-4 py-3 font-semibold text-gray-900">{l.name}</td>
                    <td className="px-4 py-3 text-gray-700">{l.today}</td>
                    <td className="px-4 py-3 text-gray-600">{l.planned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Roadmap */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The roadmap</h2>
          <div className="space-y-4">
            {PHASES.map((p) => (
              <div key={p.phase} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{p.phase}</h3>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusBadge(p.status)}`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{p.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Per-repo actions and the issues to file are enumerated in{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/docs/agentic-os/05-roadmap.md"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs/agentic-os/05-roadmap.md
            </a>
            .
          </p>
        </section>

        {/* Governance highlights */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Governance highlights</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>
              <strong>Every agent change is a pull request.</strong> Agents never push to{' '}
              <code className="bg-gray-100 px-1 rounded">main</code>; a human maintainer reviews and
              merges. The PR trail is the audit log.
            </li>
            <li>
              <strong>No self-merge.</strong> The agent that authored a change cannot approve it —
              the same separation of duties the ops workflows enforce with approval environments.
            </li>
            <li>
              <strong>Snapshot, don&apos;t scan.</strong> This site publishes committed snapshots of
              other repos&apos; state with freshness stamps; live scanning and write automation
              belong to the ops and control planes.
            </li>
            <li>
              <strong>Bounded autonomy.</strong> Write workflows default to dry-run behind approval
              gates; unattended agent runs need explicit identity, scope, and turn budgets.
            </li>
            <li>
              <strong>Volunteer-sized cadence.</strong> Refresh rhythms (90-day inventory, 30-day
              standards) are sized so a small volunteer team can actually sustain them.
            </li>
          </ol>
          <p className="text-sm text-gray-600 mt-4">
            Full model:{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/docs/agentic-os/06-governance.md"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs/agentic-os/06-governance.md
            </a>{' '}
            · Related:{' '}
            <Link href="/agentic-os/session-inventory" className="text-blue-600 hover:underline">
              Session Inventory
            </Link>{' '}
            ·{' '}
            <Link href="/automation" className="text-blue-600 hover:underline">
              Automation
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
