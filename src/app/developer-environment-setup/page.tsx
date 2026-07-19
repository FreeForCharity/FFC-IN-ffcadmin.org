import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/developer-environment-setup/' },
  title: 'Developer Environment Setup',
  description:
    'Start developing for Free For Charity with the AI agent of your choice — Claude, OpenAI Codex, Google Gemini, or GitHub Copilot. The easiest path is your AI’s native desktop app; advanced developers move into VS Code or Google Antigravity. New here? We recommend Claude Pro with Claude Desktop and Claude Mobile.',
  keywords:
    'developer environment, AI agents, Claude, OpenAI Codex, Google Gemini, GitHub Copilot, Claude Desktop, Antigravity, VS Code, MCP servers, Free For Charity',
}

interface Agent {
  name: string
  vendor: string
  easiest: string
  easiestHref?: string
  advanced: { label: string; href: string }[]
  advancedNote?: string
  ifYouPay: string
}

const VSCODE = { label: 'VS Code', href: '/developer-environment-setup/vscode' }
const ANTIGRAVITY = {
  label: 'Antigravity',
  href: '/developer-environment-setup/google-antigravity',
}

const agents: Agent[] = [
  {
    name: 'Claude',
    vendor: 'Anthropic',
    easiest: 'Claude Desktop + Claude Mobile',
    easiestHref: '/developer-environment-setup/claude-desktop',
    advanced: [VSCODE, ANTIGRAVITY],
    advancedNote: 'run Claude as a CLI or plug-in',
    ifYouPay: 'Have Claude Pro or Max? Use Claude.',
  },
  {
    name: 'OpenAI Codex',
    vendor: 'OpenAI',
    easiest: 'Codex app (desktop)',
    easiestHref: '/developer-environment-setup/codex',
    advanced: [VSCODE, ANTIGRAVITY],
    advancedNote: 'run Codex as a CLI or extension',
    ifYouPay: 'Have ChatGPT Plus or Pro? Use Codex.',
  },
  {
    name: 'Google Gemini',
    vendor: 'Google',
    easiest: 'Google Antigravity (agent-first IDE)',
    easiestHref: '/developer-environment-setup/google-antigravity',
    advanced: [ANTIGRAVITY],
    ifYouPay: 'Have a Google AI / Gemini plan? Use Gemini.',
  },
  {
    name: 'GitHub Copilot',
    vendor: 'GitHub / Microsoft',
    easiest: 'VS Code (agent mode)',
    easiestHref: '/developer-environment-setup/vscode',
    advanced: [VSCODE],
    ifYouPay: 'Have GitHub Copilot? Use Copilot in VS Code.',
  },
]

interface GuideCard {
  href: string
  name: string
  tagline: string
  level: 'Beginner' | 'Advanced'
  recommended?: boolean
  gradient: string
  emoji: string
  bullets: string[]
}

const guideCards: GuideCard[] = [
  {
    href: '/developer-environment-setup/claude-desktop',
    name: 'Claude Desktop',
    tagline: 'Claude on desktop + mobile',
    level: 'Beginner',
    recommended: true,
    gradient: 'from-amber-500 to-orange-600',
    emoji: '🟠',
    bullets: [
      'Our recommendation for new developers — Claude Pro level',
      'Native desktop app plus Claude Mobile for work on the go',
      'Connect GitHub via MCP; CI runs the tests for you',
      'No local build tools required to get started',
    ],
  },
  {
    href: '/developer-environment-setup/codex',
    name: 'OpenAI Codex',
    tagline: 'Codex app, signed in with ChatGPT',
    level: 'Beginner',
    gradient: 'from-slate-600 to-slate-800',
    emoji: '⚫',
    bullets: [
      'Best if you already pay for ChatGPT Plus or Pro',
      'Codex desktop app (and CLI) with MCP + GitHub',
      'Reads our AGENTS.md instructions automatically',
      'Same issue → PR → merge loop as every FFC repo',
    ],
  },
  {
    href: '/developer-environment-setup/vscode',
    name: 'Microsoft VS Code',
    tagline: 'Agent mode + your AI of choice',
    level: 'Advanced',
    gradient: 'from-blue-500 to-indigo-600',
    emoji: '🧩',
    bullets: [
      'The industry-standard editor, now with an agent-first mode',
      'Run Copilot, Claude, or Codex as the agent',
      'Local builds, tests, Playwright, and bigger refactors',
      'Largest community and extension ecosystem',
    ],
  },
  {
    href: '/developer-environment-setup/google-antigravity',
    name: 'Google Antigravity',
    tagline: 'Google’s agent-first IDE',
    level: 'Advanced',
    gradient: 'from-emerald-500 to-teal-600',
    emoji: '🚀',
    bullets: [
      'Gemini agents built in; add Claude or Codex too',
      'Dedicated Agent Manager alongside a VS Code-style editor',
      'Local builds, tests, Playwright, and bigger refactors',
      'Free public preview, sign in with a Google account',
    ],
  },
]

export default function DeveloperEnvironmentSetupPage() {
  const beginnerGuides = guideCards.filter((g) => g.level === 'Beginner')
  const advancedGuides = guideCards.filter((g) => g.level === 'Advanced')

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Developer Environment Setup' }]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              💻
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Developer Environment Setup</h1>
              <p className="text-emerald-100 text-sm mt-1">
                Start with your AI of choice — then grow into a full IDE only if you need to
              </p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg max-w-3xl">
            Every Free For Charity volunteer developer works with an AI agent. The easiest way to
            start is the <strong>native desktop app</strong> for your AI. As you take on more
            advanced work, you can move into a full IDE like VS Code or Google Antigravity — but
            most charity website work never needs that.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              Bring your own AI
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              Beginner-friendly first
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              Last updated: June 2026
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Site-owner fork — sits above the full agent matrix */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 md:p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl" aria-hidden="true">
              🌱
            </span>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">
                Just want to edit one charity&apos;s website FFC built for you?
              </h2>
              <p className="text-sm text-emerald-900/90 mt-1">
                You don&apos;t need this whole page. If you run a single nonprofit and only want to
                update your own site, there&apos;s a short, jargon-free walkthrough made for you —
                no IDE, no local builds, no code. This page is for volunteers who want to develop
                across many charities.
              </p>
              <Link
                href="/site-owner"
                className="mt-3 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Go to “Edit My Charity Website”
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Standalone + track framing, and prerequisite accounts */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border-l-4 border-blue-500">
          <h2 className="text-lg font-bold text-gray-900">
            A standalone guide that’s also part of a track
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            You can follow this on its own to set up a development environment — for your own work
            or for a charity. It’s also the environment behind the{' '}
            <Link
              href="/training/web-developer"
              className="text-blue-700 underline hover:text-blue-900"
            >
              Web Developer track
            </Link>
            , so if you’re training for that role, this is your toolchain step.
          </p>
          <p className="text-sm font-semibold text-gray-900 mt-4 mb-2">
            Set up these personal accounts first:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { slug: 'github-account', label: '🐙 GitHub account' },
              { slug: 'multi-factor-authentication', label: '🔐 Multi-factor authentication' },
              { slug: 'ai-assistant', label: '🤖 AI assistant' },
            ].map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-blue-50 transition-colors"
              >
                {g.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Use your <strong>personal</strong> AI assistant here and max it out before the charity
            pays for organizational AI — see the{' '}
            <Link
              href="/guides/ai-assistant-organization"
              className="text-blue-700 underline hover:text-blue-900"
            >
              organizational AI guide
            </Link>{' '}
            for when to upgrade.
          </p>
        </div>

        {/* Step 1: Start with your AI */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4" aria-hidden="true">
              🤖
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Step 1 — Start with your AI</h2>
              <p className="text-gray-600">
                Keep the AI you already use, or pick our recommendation
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            You do not need to learn a new AI to help Free For Charity. If you already pay for one
            of the major AI agents, <strong>keep using it</strong> — this page shows how to point
            your existing AI at our website template repositories. If you do not have one yet, we
            have a simple recommendation below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <h3 className="font-bold text-amber-900 mb-1">Already pay for an AI? Use it.</h3>
              <p className="text-sm text-amber-900">
                Your paid AI should stay your primary AI. ChatGPT Plus/Pro &rarr; Codex. Claude
                Pro/Max &rarr; Claude. A Google&nbsp;AI / Gemini plan &rarr; Gemini. GitHub Copilot
                &rarr; VS Code. Set that one up for FFC and skip the rest.
              </p>
            </div>
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded">
              <h3 className="font-bold text-emerald-900 mb-1">No AI yet? Start with Claude.</h3>
              <p className="text-sm text-emerald-900">
                Our recommendation for new developers is{' '}
                <strong>Claude at the personal Pro level</strong>, using{' '}
                <strong>Claude Desktop</strong> on your computer and <strong>Claude Mobile</strong>{' '}
                on your phone. It is the gentlest on-ramp to the FFC workflow.
              </p>
            </div>
          </div>
        </section>

        {/* The four primary AI agents */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ⚖️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">The four primary AI agents</h2>
              <p className="text-gray-600">
                All four can do the job — pick by what you already have or prefer
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Free For Charity supports four primary AI coding agents. In practice they{' '}
            <strong>work almost the same</strong> for our purposes: you describe a change in plain
            English, the agent edits the code, runs the checks, and opens a pull request. The main
            difference is which app you sign in to and where it runs.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    AI agent
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Easiest start (native app)
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Advanced environment
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Already paying?
                  </th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a, i) => (
                  <tr key={a.name} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="p-3 border border-gray-200">
                      <span className="font-semibold text-gray-900">{a.name}</span>
                      <span className="block text-xs text-gray-500">{a.vendor}</span>
                    </td>
                    <td className="p-3 border border-gray-200">
                      {a.easiestHref ? (
                        <Link
                          href={a.easiestHref}
                          className="text-blue-700 underline hover:text-blue-900"
                        >
                          {a.easiest}
                        </Link>
                      ) : (
                        a.easiest
                      )}
                    </td>
                    <td className="p-3 border border-gray-200">
                      {a.advanced.map((env, j) => (
                        <span key={env.href}>
                          {j > 0 && ' or '}
                          <Link
                            href={env.href}
                            className="text-blue-700 underline hover:text-blue-900"
                          >
                            {env.label}
                          </Link>
                        </span>
                      ))}
                      {a.advancedNote && <span className="text-gray-500"> ({a.advancedNote})</span>}
                    </td>
                    <td className="p-3 border border-gray-200 text-gray-700">{a.ifYouPay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>No favoritism:</strong> we do not push one tool over another. Antigravity and
              VS Code are equally capable advanced environments, and you can run Claude or Codex in
              either one. Choose the path that fits the AI you already have.
            </p>
          </div>
        </section>

        {/* Easiest to advanced */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🧭
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Step 2 — Pick an environment by difficulty
              </h2>
              <p className="text-gray-600">Start easy. Move up only when a task needs it.</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Beginner */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Start here · Beginner
                </span>
                <span className="text-sm text-gray-600">Your AI’s native desktop app</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {beginnerGuides.map((g) => (
                  <GuideCardLink key={g.href} guide={g} />
                ))}
              </div>
            </div>

            {/* Advanced */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wide bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Later · Advanced
                </span>
                <span className="text-sm text-gray-600">A full IDE, when you need more power</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advancedGuides.map((g) => (
                  <GuideCardLink key={g.href} guide={g} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What advanced means */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🎚️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                What “advanced” means — and why most people never need it
              </h2>
              <p className="text-gray-600">An honest look at when to graduate to an IDE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
              <h3 className="font-bold text-emerald-800 mb-3">Beginner (native desktop app)</h3>
              <ul className="space-y-2 text-sm text-emerald-900">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
                  <span>
                    Read issues, edit content, and open pull requests through the GitHub MCP server
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
                  <span>CI runs the build and tests for you — nothing to install locally</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
                  <span>Handles the large majority of charity website updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
                  <span>Works from your phone with Claude Mobile</span>
                </li>
              </ul>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
              <h3 className="font-bold text-indigo-800 mb-3">Advanced (full IDE)</h3>
              <ul className="space-y-2 text-sm text-indigo-900">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-0.5">+</span>
                  <span>
                    Run builds, unit tests, and Playwright on your own machine before pushing
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-0.5">+</span>
                  <span>Drive a real browser, debug failures, and iterate quickly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-0.5">+</span>
                  <span>Larger refactors, new pages from scratch, and work across many repos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 mt-0.5">+</span>
                  <span>Run your AI as a CLI agent and as an in-editor plug-in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              <strong>Important caveat:</strong> most charities will never require an advanced
              developer. The beginner path — your AI’s desktop app plus the GitHub MCP server, with
              CI validating every change — handles the vast majority of website work. Only move to
              an IDE when a specific task genuinely needs local builds, browser debugging, or a
              large refactor. Becoming “advanced” is a nice-to-have for ambitious volunteers, not a
              requirement for helping a charity.
            </p>
          </div>
        </section>

        {/* Shared prerequisites */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ✅
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shared prerequisites</h2>
              <p className="text-gray-600">
                What every path needs (advanced paths need a little more)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Everyone needs</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">1.</span>
                  <span>
                    A <strong>GitHub account</strong>, added to the{' '}
                    <a
                      href="https://github.com/FreeForCharity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      FreeForCharity
                    </a>{' '}
                    organization by a maintainer.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">2.</span>
                  <span>
                    An <strong>AI account</strong> — Claude, ChatGPT/Codex, Google/Gemini, or GitHub
                    Copilot. Every one has a free tier that is enough to start; upgrade to a paid
                    tier only if and when you hit usage limits.
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Advanced (IDE) paths also need</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 font-bold">+</span>
                  <span>
                    <strong>Git</strong>, <strong>Node.js 20+</strong>, and <strong>pnpm 9</strong>{' '}
                    (our repos pin pnpm 9 via{' '}
                    <code className="bg-gray-200 px-1 rounded">package.json</code>). Your AI can
                    install these for you.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2 font-bold">+</span>
                  <span>The editor itself — VS Code or Antigravity.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* MCP servers */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔌
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                MCP servers our template repositories use
              </h2>
              <p className="text-gray-600">
                The same connectors give every AI agent the abilities our workflow needs
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            MCP (Model Context Protocol) servers are small connectors that all four AI agents
            understand. At a minimum, enable <strong>GitHub</strong>. Add{' '}
            <strong>Playwright</strong> once you are working in an IDE and running browser tests. In
            most apps these come as ready-made plugins or connectors — you rarely install anything
            by hand; just ask your agent to enable what it needs.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    MCP server
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    What it lets the agent do
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">GitHub</td>
                  <td className="p-3 border border-gray-200">
                    Read and create issues, open pull requests, review CI status, and merge
                  </td>
                  <td className="p-3 border border-gray-200 text-red-700 font-semibold">
                    Required (all paths)
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Playwright</td>
                  <td className="p-3 border border-gray-200">
                    Drive a real browser to run and debug our end-to-end tests
                  </td>
                  <td className="p-3 border border-gray-200 text-amber-700 font-semibold">
                    Advanced / IDE
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Filesystem</td>
                  <td className="p-3 border border-gray-200">
                    Let a desktop-app agent read and edit a local clone of the repo
                  </td>
                  <td className="p-3 border border-gray-200 text-amber-700 font-semibold">
                    Optional
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">
                    Cloudflare / Microsoft Learn
                  </td>
                  <td className="p-3 border border-gray-200">
                    DNS &amp; Pages, and Microsoft 365 docs
                  </td>
                  <td className="p-3 border border-gray-200 text-amber-700 font-semibold">
                    Optional
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              <strong>Security:</strong> MCP servers that reach GitHub or Cloudflare need an access
              token. <strong>Never paste a token into a file, a commit, or a chat message.</strong>{' '}
              Use the app’s secure credential prompt or an environment variable, scope it narrowly,
              and rotate it. See our{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/.claude/rules/01-security.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-900 underline"
              >
                security rules
              </a>
              .
            </p>
          </div>
        </section>

        {/* Contribution loop */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔁
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                The contribution loop is the same
              </h2>
              <p className="text-gray-600">
                Whichever AI and environment you choose, every change follows four steps
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">
                <span className="text-blue-600 mr-1">1.</span>Pick up an issue
              </h3>
              <p className="text-sm text-gray-700">
                Every change starts from a GitHub issue. Your agent reads it and plans the work.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">
                <span className="text-blue-600 mr-1">2.</span>Branch &amp; change
              </h3>
              <p className="text-sm text-gray-700">
                The agent creates a branch and makes the change — on a beginner path, directly
                through the GitHub MCP server.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">
                <span className="text-blue-600 mr-1">3.</span>Open a pull request
              </h3>
              <p className="text-sm text-gray-700">
                The agent opens a PR linked to the issue. CI runs format, lint, build, tests, and
                Playwright.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">
                <span className="text-blue-600 mr-1">4.</span>Review &amp; merge
              </h3>
              <p className="text-sm text-gray-700">
                You review the diff, the agent fixes any CI failures, and the change merges once
                checks pass.
              </p>
            </div>
          </div>
          <div className="mt-6 bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-900 text-sm">
              <strong>Never push directly to main.</strong> Every change goes through a branch and a
              pull request, and CI must pass before merge. A correctly set-up agent follows this
              automatically.
            </p>
          </div>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm mb-2">
              <strong>Find your first task.</strong> New here? Pick something small and well-scoped
              to start. Browse open issues labeled{' '}
              <a
                href="https://github.com/search?q=org%3AFreeForCharity+is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22&type=issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 underline font-medium"
              >
                good first issue
              </a>{' '}
              across FFC, or ask your agent:
            </p>
            <p className="font-mono text-xs text-blue-900 bg-white/60 rounded p-3">
              &ldquo;List the open issues labeled &lsquo;good first issue&rsquo; in the
              FreeForCharity organization and help me pick one I can finish, then start it.&rdquo;
            </p>
          </div>
        </section>

        {/* Related */}
        <section className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pick your guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link
                  href="/developer-environment-setup/claude-desktop"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Claude Desktop
                </Link>
                <span className="text-gray-500"> &mdash; beginner, recommended</span>
              </li>
              <li>
                <Link
                  href="/developer-environment-setup/codex"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  OpenAI Codex
                </Link>
                <span className="text-gray-500"> &mdash; beginner</span>
              </li>
              <li>
                <Link
                  href="/developer-environment-setup/vscode"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Microsoft VS Code
                </Link>
                <span className="text-gray-500"> &mdash; advanced</span>
              </li>
              <li>
                <Link
                  href="/developer-environment-setup/google-antigravity"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Google Antigravity
                </Link>
                <span className="text-gray-500"> &mdash; advanced</span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="/tech-stack" className="text-blue-600 underline hover:text-blue-800">
                  FFC Tech Stack
                </Link>
                <span className="text-gray-500"> &mdash; what powers every FFC site</span>
              </li>
              <li>
                <Link href="/testing" className="text-blue-600 underline hover:text-blue-800">
                  Testing strategy
                </Link>
                <span className="text-gray-500"> &mdash; how Playwright fits in</span>
              </li>
              <li>
                <Link
                  href="/contributor-ladder"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Contributor Ladder
                </Link>
                <span className="text-gray-500"> &mdash; grow from Contributor to Mentor</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

function GuideCardLink({ guide }: { guide: GuideCard }) {
  return (
    <Link
      href={guide.href}
      className="block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className={`bg-gradient-to-br ${guide.gradient} p-5 flex items-center gap-3 text-white`}>
        <span className="text-3xl" aria-hidden="true">
          {guide.emoji}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{guide.name}</h3>
            {guide.recommended && (
              <span className="text-[10px] font-bold uppercase tracking-wide bg-white/25 px-1.5 py-0.5 rounded">
                Recommended
              </span>
            )}
          </div>
          <p className="text-white/90 text-sm">{guide.tagline}</p>
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-1.5 text-sm text-gray-700">
          {guide.bullets.map((b) => (
            <li key={b} className="flex items-start">
              <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700">
          Open the {guide.name} guide
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
