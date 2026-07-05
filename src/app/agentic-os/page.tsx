import Link from 'next/link'
import type { Metadata } from 'next'
import catalog from '@/data/workflow-catalog.json'
import { loadAgentSessionInventory } from '@/lib/agenticOsData'
import { assetPath } from '@/lib/assetPath'

export const metadata: Metadata = {
  title: 'Agentic OS',
  description:
    'How Free For Charity runs on AI agents: the five operational planes, the six-layer agentic operating system architecture, and the org-wide agent session inventory.',
  keywords:
    'agentic OS, AI agents, Claude Code, agent orchestration, nonprofit automation, agent governance, Free For Charity',
}

// Hoisted so the lint rule's Literal-in-JSX-href selector doesn't match (same
// pattern as automation's CATALOG_JSON_HREF).
const INVENTORY_JSON_HREF = assetPath('/data/agent-session-inventory.json')

const PLANES = [
  {
    name: 'Control plane',
    repo: 'FFC-IN-AI-Management',
    url: 'https://github.com/FreeForCharity/FFC-IN-AI-Management',
    role: 'Source of truth for AI agent configuration (CLAUDE.md, AGENTS.md, .claude/, Copilot and Gemini configs) deployed to every FFC repo via base + overlay templates.',
  },
  {
    name: 'Observability & docs plane',
    repo: 'FFC-IN-ffcadmin.org',
    url: 'https://github.com/FreeForCharity/FFC-IN-ffcadmin.org',
    role: 'This site. Publishes the session inventory, blueprint docs, and dashboards as committed snapshots — it documents the OS but never live-scans other repos.',
  },
  {
    name: 'Ops plane',
    repo: 'FFC-Cloudflare-Automation',
    url: 'https://github.com/FreeForCharity/FFC-Cloudflare-Automation',
    role: 'The numbered GitHub Actions workflow catalog that drives Cloudflare DNS, WHMCS, Microsoft 365, and repo plumbing behind approval gates and dry-run defaults.',
  },
  {
    name: 'Distribution plane',
    repo: 'FFC-IN-FFC_Single_Page_Template',
    url: 'https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template',
    role: 'The charity-site template the FFC-EX-* sites are created from. Improvements land here once and propagate to every new charity site.',
  },
  {
    name: 'Autonomous loop',
    repo: 'FFC-IN-google_antigravity_agents',
    url: 'https://github.com/FreeForCharity/FFC-IN-google_antigravity_agents',
    role: 'A closed-loop Gemini-based reviewer/coder pair that reviews PRs and drafts fixes across the org, complementing the human-supervised Claude sessions.',
  },
]

const LAYERS = [
  {
    name: 'Connections',
    detail:
      'MCP servers (GitHub, Cloudflare, Playwright, Sentry, Microsoft Learn) give agents tool access.',
  },
  {
    name: 'Memory & shared context',
    detail:
      'CLAUDE.md / AGENTS.md conventions, docs-as-snapshots, and the PR audit trail as institutional memory.',
  },
  {
    name: 'Agents',
    detail:
      'Custom subagents in .claude/agents/ — DNS audit, site health, PR review, session archivist, and more.',
  },
  {
    name: 'Orchestration',
    detail:
      'The issue → branch → PR workflow, fan-out skills, and the numbered ops workflow catalog.',
  },
  {
    name: 'Governance & guardrails',
    detail:
      'Permission allow/deny policies, no-self-merge PR review, approval-gated writes, secret rules.',
  },
  {
    name: 'Observability',
    detail:
      'The session inventory, CI status feeds, and freshness-stamped snapshot docs on this site.',
  },
]

export default function AgenticOs() {
  const inventory = loadAgentSessionInventory()
  const workflows = (catalog.workflows as unknown[]).length

  const stats = [
    { label: 'Public repos surveyed', value: inventory ? inventory.orgTotals.repos : '—' },
    { label: 'Agent PR sessions', value: inventory ? inventory.orgTotals.totalSessions : '—' },
    { label: 'Claude sessions', value: inventory ? inventory.orgTotals.claudePrs : '—' },
    { label: 'Ops workflows', value: workflows },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold">The FFC Agentic OS</h1>
          </div>
          <p className="text-blue-100 max-w-3xl">
            Free For Charity builds and maintains dozens of charity websites with AI coding agents —
            hundreds of agent pull-request sessions across the organization. This section documents
            the operating system around those agents: the architecture, the governance model, and
            the org-wide session inventory that makes the work visible and auditable.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow p-5 text-center">
              <div className="text-3xl font-bold text-indigo-700">{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* What an agentic OS is */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What an agentic OS is — and why FFC has one
          </h2>
          <p className="text-gray-700 mb-4">
            An <strong>agentic operating system</strong> is the coordination layer that lets many AI
            agents work safely at once: shared context and memory, tool connections, orchestration,
            guardrails, and observability. One agent on one repo needs none of that. Dozens of
            agents across dozens of charity repos — FFC&apos;s reality — need all of it, or the work
            becomes untraceable and unrepeatable.
          </p>
          <p className="text-gray-700">
            FFC&apos;s agentic OS is not one product; it is five existing repos playing distinct
            roles, documented and coordinated. The full blueprint lives in{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/tree/main/docs/agentic-os"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs/agentic-os
            </a>
            .
          </p>
        </section>

        {/* The five planes */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The five planes</h2>
          <div className="space-y-4">
            {PLANES.map((p) => (
              <div key={p.repo} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <a
                    href={p.url}
                    className="text-blue-600 hover:underline font-mono text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.repo}
                  </a>
                </div>
                <p className="text-sm text-gray-700">{p.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The six layers */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The six layers</h2>
          <p className="text-gray-700 mb-4 text-sm">
            Across those planes, the OS provides six capabilities — the standard anatomy of an
            agentic operating system. See the{' '}
            <Link href="/agentic-os/architecture" className="text-blue-600 hover:underline">
              architecture page
            </Link>{' '}
            for what FFC has today and what is planned in each layer.
          </p>
          <ol className="grid sm:grid-cols-2 gap-3 list-none">
            {LAYERS.map((l, i) => (
              <li key={l.name} className="border border-gray-200 rounded-lg p-4">
                <div className="font-semibold text-gray-900 text-sm">
                  <span className="inline-block w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-center text-xs leading-6 mr-2">
                    {i + 1}
                  </span>
                  {l.name}
                </div>
                <p className="text-sm text-gray-600 mt-2">{l.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* For agents */}
        <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">For AI agents & new admins</h2>
          <p className="text-gray-700 text-sm mb-3">
            The org-wide session inventory is published as machine-readable JSON at{' '}
            <a
              href={INVENTORY_JSON_HREF}
              className="text-blue-600 hover:underline font-mono text-xs"
            >
              https://ffcadmin.org/data/agent-session-inventory.json
            </a>{' '}
            and rendered on the{' '}
            <Link href="/agentic-os/session-inventory" className="text-blue-600 hover:underline">
              session inventory dashboard
            </Link>
            . It is a committed snapshot refreshed manually via the{' '}
            <code className="bg-white px-1 rounded border border-indigo-100">
              /session-inventory-refresh
            </code>{' '}
            skill — this site never live-scans other repos.
          </p>
          <p className="text-gray-700 text-sm">
            Related:{' '}
            <Link href="/automation" className="text-blue-600 hover:underline">
              Automation
            </Link>{' '}
            ·{' '}
            <Link href="/documentation" className="text-blue-600 hover:underline">
              Documentation
            </Link>{' '}
            ·{' '}
            <Link href="/developer-environment-setup" className="text-blue-600 hover:underline">
              Dev Environment Setup
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
