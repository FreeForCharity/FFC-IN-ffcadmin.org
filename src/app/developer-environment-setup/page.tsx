import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Developer Environment Setup',
  description:
    'Set up your individual developer environment for Free For Charity website development and digital infrastructure. Choose Google Antigravity or Microsoft VS Code, connect to GitHub, and enable MCP servers so AI agents can open issues, make PRs, and merge changes.',
  keywords:
    'developer environment, Google Antigravity, VS Code, MCP servers, Playwright, GitHub, AI agents, Free For Charity, nonprofit web development',
}

interface EnvironmentCard {
  href: string
  name: string
  tagline: string
  bestFor: string
  gradient: string
  emoji: string
  bullets: string[]
}

const environments: EnvironmentCard[] = [
  {
    href: '/developer-environment-setup/google-antigravity',
    name: 'Google Antigravity',
    tagline: "Google's agent-first IDE",
    bestFor: 'Volunteers who want an AI agent to drive most of the work',
    gradient: 'from-emerald-500 to-teal-600',
    emoji: '🚀',
    bullets: [
      'Free public preview — sign in with a personal Google/Gmail account',
      'Built on the VS Code foundation, with a dedicated Agent Manager',
      'Built-in Gemini agents plan, write, test, and open PRs for you',
      'MCP Store for one-click server installs (Playwright, GitHub, and more)',
    ],
  },
  {
    href: '/developer-environment-setup/vscode',
    name: 'Microsoft VS Code',
    tagline: 'The industry-standard editor',
    bestFor: 'Volunteers who want a familiar, widely documented editor',
    gradient: 'from-blue-500 to-indigo-600',
    emoji: '🧩',
    bullets: [
      'Free and open source on Windows, macOS, and Linux',
      'GitHub Copilot free tier provides the built-in AI agent',
      'MCP servers configured through .vscode/mcp.json (shared in the repo)',
      'Huge extension ecosystem and the largest community knowledge base',
    ],
  },
]

interface Step {
  number: string
  title: string
  description: string
}

const loopSteps: Step[] = [
  {
    number: '1',
    title: 'Pick up an Issue',
    description:
      'Every change starts from a GitHub Issue. Your AI agent can read the issue, ask clarifying questions, and plan the work.',
  },
  {
    number: '2',
    title: 'Branch & build',
    description:
      'The agent creates a branch, edits files, and runs the local checks (format, lint, build, test) for you.',
  },
  {
    number: '3',
    title: 'Open a Pull Request',
    description:
      'With the GitHub MCP server connected, the agent opens a PR, links it to the issue, and watches CI.',
  },
  {
    number: '4',
    title: 'Review & merge',
    description:
      'You review the diff, the agent fixes any CI failures, and once checks pass the change merges into the charity or website repository.',
  },
]

export default function DeveloperEnvironmentSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Developer Environment Setup' }]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              💻
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Developer Environment Setup</h1>
              <p className="text-emerald-100 text-sm mt-1">
                For Free For Charity website development &amp; digital infrastructure
              </p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg max-w-3xl">
            This is the starting point for every Free For Charity volunteer developer. Set up your
            own computer once, connect it to GitHub, and enable the AI agents and MCP servers our
            template repositories rely on. From there you can open issues, make pull requests, and
            merge changes into FFC charity and website repositories — with an AI agent doing most of
            the heavy lifting.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              100% free tooling
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              AI-agent assisted
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              Last updated: May 2026
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What is this */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What you are setting up</h2>
          <p className="text-gray-700 mb-4">
            A Free For Charity development environment is a code editor on your own computer that is
            connected to GitHub and supercharged with an AI agent. The agent can read our code, run
            our tests, and talk to GitHub on your behalf through <strong>MCP servers</strong> (Model
            Context Protocol) — small connectors that give the agent superpowers such as driving a
            browser for Playwright tests or opening pull requests.
          </p>
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded">
            <p className="text-emerald-900 text-sm">
              <strong>The big idea:</strong> You do not need to be a senior engineer. Both editors
              below ship with a free AI agent. Your job is to install the environment once, point it
              at our repositories, and then <em>describe what you want in plain English</em>. The
              agent writes the code, runs the checks, and prepares the pull request.
            </p>
          </div>
        </section>

        {/* Choose your environment */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 px-1">Choose your environment</h2>
          <p className="text-gray-600 mb-6 px-1">
            Pick one to start. You can install both later — the GitHub workflow is identical.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environments.map((env) => (
              <Link
                key={env.href}
                href={env.href}
                className="block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div
                  className={`bg-gradient-to-br ${env.gradient} p-6 flex items-center gap-4 text-white`}
                >
                  <span className="text-4xl" aria-hidden="true">
                    {env.emoji}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">{env.name}</h3>
                    <p className="text-white/90 text-sm">{env.tagline}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">
                    Best for
                  </p>
                  <p className="text-sm text-gray-700 mb-4">{env.bestFor}</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {env.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start">
                        <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold text-blue-700">
                    Open the {env.name} guide
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
                  </span>
                </div>
              </Link>
            ))}
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
                The same accounts and tools are needed whichever editor you choose
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Accounts (free)</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">1.</span>
                  <span>
                    A <strong>GitHub account</strong>. Ask a maintainer to add you to the{' '}
                    <a
                      href="https://github.com/FreeForCharity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      FreeForCharity
                    </a>{' '}
                    organization.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">2.</span>
                  <span>
                    A <strong>Google/Gmail account</strong> (for Antigravity&apos;s free AI agent),
                    or your GitHub account (for VS Code&apos;s Copilot free tier).
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Core tools (free)</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">1.</span>
                  <span>
                    <strong>Git</strong> &mdash; version control
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">2.</span>
                  <span>
                    <strong>Node.js 20 LTS or newer</strong> &mdash; JavaScript runtime
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">3.</span>
                  <span>
                    <strong>pnpm</strong> &mdash; package manager. Our repos pin pnpm 9 via{' '}
                    <code className="bg-gray-200 px-1 rounded">package.json</code>, so install the
                    matching major with{' '}
                    <code className="bg-gray-200 px-1 rounded">npm install -g pnpm@9</code> (or run{' '}
                    <code className="bg-gray-200 px-1 rounded">corepack enable</code> to use the
                    pinned version automatically)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">4.</span>
                  <span>
                    Your chosen <strong>editor</strong> &mdash; Antigravity or VS Code
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>Let the agent install things.</strong> You do not have to memorize install
              commands. Once your editor and its AI agent are running, you can say: &ldquo;Check
              whether Git, Node 20+, and pnpm are installed, and if not, tell me exactly how to
              install them for my operating system.&rdquo; The agent will guide you step by step.
            </p>
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
                MCP servers used across our template repositories
              </h2>
              <p className="text-gray-600">
                These connectors give your AI agent the abilities our workflow depends on
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Each environment guide shows the exact configuration. At a minimum, enable{' '}
            <strong>GitHub</strong> and <strong>Playwright</strong>. The others are useful depending
            on what you are working on.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    MCP Server
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    What it lets the agent do
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Priority
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
                    Required
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Playwright</td>
                  <td className="p-3 border border-gray-200">
                    Drive a real browser to run and debug our end-to-end (E2E) tests
                  </td>
                  <td className="p-3 border border-gray-200 text-red-700 font-semibold">
                    Required
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Cloudflare</td>
                  <td className="p-3 border border-gray-200">
                    Inspect DNS records and Pages deployments for charity domains
                  </td>
                  <td className="p-3 border border-gray-200 text-amber-700 font-semibold">
                    Optional
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Microsoft Learn Docs</td>
                  <td className="p-3 border border-gray-200">
                    Pull official Microsoft 365 / Azure documentation while working on admin tasks
                  </td>
                  <td className="p-3 border border-gray-200 text-amber-700 font-semibold">
                    Optional
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Sentry</td>
                  <td className="p-3 border border-gray-200">
                    Look up production errors and performance issues for deployed sites
                  </td>
                  <td className="p-3 border border-gray-200 text-amber-700 font-semibold">
                    Optional
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              <strong>Security:</strong> MCP servers that talk to GitHub, Cloudflare, or Sentry need
              an access token.{' '}
              <strong>Never paste a token into a file, a commit, or a chat message.</strong> Store
              it where the editor tells you (a local credential prompt or an environment variable),
              use the narrowest scope possible, and rotate it regularly. See our{' '}
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

        {/* The contribution loop */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔁
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                What you will be able to do: the contribution loop
              </h2>
              <p className="text-gray-600">
                The same four steps power every change, on every FFC repository
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loopSteps.map((step) => (
              <div key={step.number} className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">
                  <span className="text-blue-600 mr-1">{step.number}.</span>
                  {step.title}
                </h3>
                <p className="text-sm text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-900 text-sm">
              <strong>Never push directly to main.</strong> Every change goes through a branch and a
              pull request, and CI checks (format, lint, build, tests, Playwright) must pass before
              merge. Your AI agent follows this rule automatically when it is set up correctly.
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ⚖️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Antigravity vs VS Code at a glance
              </h2>
              <p className="text-gray-600">Both reach the same finish line — pick what fits you</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Topic
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Google Antigravity
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Microsoft VS Code
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Built-in AI agent</td>
                  <td className="p-3 border border-gray-200">Gemini agents in the Agent Manager</td>
                  <td className="p-3 border border-gray-200">GitHub Copilot (agent mode)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Sign in with</td>
                  <td className="p-3 border border-gray-200">Personal Google/Gmail account</td>
                  <td className="p-3 border border-gray-200">GitHub account</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">MCP config</td>
                  <td className="p-3 border border-gray-200">
                    MCP Store + <code className="bg-gray-200 px-1 rounded">mcpServers</code> config
                  </td>
                  <td className="p-3 border border-gray-200">
                    <code className="bg-gray-200 px-1 rounded">.vscode/mcp.json</code> with{' '}
                    <code className="bg-gray-200 px-1 rounded">servers</code> key
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Maturity</td>
                  <td className="p-3 border border-gray-200">Newer, free public preview</td>
                  <td className="p-3 border border-gray-200">
                    Long established, largest community
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Foundation</td>
                  <td className="p-3 border border-gray-200">Fork of VS Code (familiar layout)</td>
                  <td className="p-3 border border-gray-200">The original VS Code</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Related links */}
        <section className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Where to go next</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link
                  href="/developer-environment-setup/google-antigravity"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Google Antigravity setup guide
                </Link>
              </li>
              <li>
                <Link
                  href="/developer-environment-setup/vscode"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Microsoft VS Code setup guide
                </Link>
              </li>
              <li>
                <Link href="/tech-stack" className="text-blue-600 underline hover:text-blue-800">
                  FFC Tech Stack
                </Link>
                <span className="text-gray-500"> &mdash; what powers every FFC site</span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <Link href="/guides" className="text-blue-600 underline hover:text-blue-800">
                  Technical Guides
                </Link>
                <span className="text-gray-500"> &mdash; including WordPress to Next.js</span>
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
