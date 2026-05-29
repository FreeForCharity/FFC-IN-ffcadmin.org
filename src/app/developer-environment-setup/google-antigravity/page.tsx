import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Google Antigravity Setup',
  description:
    "Set up Google Antigravity, Google's agent-first IDE, for Free For Charity website development. Install it, sign in with a Google account, connect GitHub, and enable the Playwright and GitHub MCP servers so the AI agent can open issues, make PRs, and merge changes.",
  keywords:
    'Google Antigravity, agent IDE, Gemini, MCP servers, Playwright MCP, GitHub MCP, AI coding agent, Free For Charity, developer environment',
}

interface GuideSection {
  id: string
  number: string
  title: string
  icon: string
}

const sections: GuideSection[] = [
  { id: 'overview', number: '1', title: 'What Antigravity Is', icon: '🚀' },
  { id: 'install', number: '2', title: 'Download and Install', icon: '⬇️' },
  { id: 'sign-in', number: '3', title: 'Sign In with Google', icon: '🔑' },
  { id: 'tour', number: '4', title: 'Tour: Editor and Agent Manager', icon: '🧭' },
  { id: 'core-tools', number: '5', title: 'Install Git, Node, and pnpm', icon: '🔧' },
  { id: 'github', number: '6', title: 'Connect to GitHub', icon: '🐙' },
  { id: 'mcp', number: '7', title: 'Enable MCP Servers', icon: '🔌' },
  { id: 'clone', number: '8', title: 'Clone a Template Repo', icon: '📦' },
  { id: 'first-change', number: '9', title: 'Your First Issue to Merge', icon: '🔁' },
  { id: 'security', number: '10', title: 'Security and Good Habits', icon: '🛡️' },
  { id: 'troubleshooting', number: '11', title: 'Troubleshooting', icon: '🩺' },
]

export default function GoogleAntigravitySetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Developer Environment Setup', href: '/developer-environment-setup' },
          { label: 'Google Antigravity' },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🚀
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Google Antigravity Setup</h1>
              <p className="text-emerald-100 text-sm mt-1">
                Google&apos;s agent-first IDE for FFC website development
              </p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg max-w-3xl">
            Antigravity is a free, agent-first code editor built on the VS Code foundation. Its
            built-in Gemini agents can plan work, write code, run our tests, and open pull requests
            for you. This guide gets you from zero to opening your first FFC pull request.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              Free public preview
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              Sign in with Google
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              ~30 minutes
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* TOC */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">On this page</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-2 rounded-lg hover:bg-emerald-50 transition-colors group"
              >
                <span className="text-xl mr-3" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">
                  <span className="text-emerald-600 font-bold mr-1">{section.number}.</span>
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 1. Overview */}
        <section id="overview" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🚀
            </span>
            <h2 className="text-2xl font-bold text-gray-900">1. What Antigravity Is</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Google Antigravity reuses the open-source VS Code foundation, so the layout will feel
            familiar, but it puts an <strong>AI agent</strong> at the center instead of the text
            cursor. You describe a task in plain English and a Gemini-powered agent plans it, edits
            files, runs commands, and reports back. FFC already maintains an{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-IN-Antigravity-Static-site-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline hover:text-emerald-900"
            >
              Antigravity static-site agent
            </a>{' '}
            repository, so this editor is a first-class part of our toolchain.
          </p>
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded">
            <p className="text-emerald-900 text-sm">
              <strong>Why we like it for volunteers:</strong> the free public preview signs in with
              an ordinary Google account, and the agent can do almost everything in this guide for
              you once it is connected. When in doubt, ask the agent.
            </p>
          </div>
        </section>

        {/* 2. Install */}
        <section id="install" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ⬇️
            </span>
            <h2 className="text-2xl font-bold text-gray-900">2. Download and Install</h2>
          </div>
          <ol className="space-y-3 text-sm text-gray-700 list-decimal ml-5">
            <li>
              Go to{' '}
              <a
                href="https://antigravity.google"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                antigravity.google
              </a>{' '}
              and download the installer for your operating system (Windows, macOS, or a supported
              Linux distribution).
            </li>
            <li>Run the installer and accept the defaults.</li>
            <li>
              Make sure you also have <strong>Google Chrome</strong> installed — Antigravity uses it
              for the browser-driving agent features.
            </li>
            <li>Launch Antigravity.</li>
          </ol>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>Tip:</strong> Because Antigravity is a VS Code fork, when it offers to import
              settings or asks about a color theme and keybindings, the VS Code defaults are a safe
              choice.
            </p>
          </div>
        </section>

        {/* 3. Sign in */}
        <section id="sign-in" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔑
            </span>
            <h2 className="text-2xl font-bold text-gray-900">3. Sign In with Google</h2>
          </div>
          <ol className="space-y-3 text-sm text-gray-700 list-decimal ml-5">
            <li>
              On first launch, Antigravity prompts you to sign in. Choose to sign in with Google.
            </li>
            <li>
              Your browser opens. Sign in with your <strong>personal Gmail/Google account</strong> —
              the free preview does not require a credit card or a paid plan.
            </li>
            <li>
              After authentication, the browser shows a success message and hands you back to the
              Antigravity app.
            </li>
          </ol>
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              <strong>If sign-in stalls</strong> (&ldquo;unexpected issue setting up your
              account&rdquo;), close Antigravity completely, make sure Chrome is your default
              browser or is at least installed, and try again. This is a common preview hiccup and
              usually resolves on a second attempt.
            </p>
          </div>
        </section>

        {/* 4. Tour */}
        <section id="tour" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🧭
            </span>
            <h2 className="text-2xl font-bold text-gray-900">4. Tour: Editor and Agent Manager</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Antigravity has two primary surfaces. Knowing which is which saves a lot of confusion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 mb-2">📝 The Editor</h3>
              <p className="text-sm text-gray-700">
                The familiar VS Code-style window: file tree, open files, terminal, and source
                control. Use it to read code, review the agent&apos;s changes, and run commands
                yourself when you want to.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-bold text-gray-900 mb-2">🤖 The Agent Manager</h3>
              <p className="text-sm text-gray-700">
                Where you give the agent tasks and watch it work across plans, edits, and test runs.
                This is where most of your FFC work happens: describe the issue, approve the plan,
                and review the result.
              </p>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              Newer builds may be branded <strong>Antigravity 2.0</strong> and ship a companion{' '}
              <strong>Antigravity CLI</strong>. They share the same agent harness and settings, so
              this guide applies to both.
            </p>
          </div>
        </section>

        {/* 5. Core tools */}
        <section id="core-tools" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔧
            </span>
            <h2 className="text-2xl font-bold text-gray-900">5. Install Git, Node, and pnpm</h2>
          </div>
          <p className="text-gray-700 mb-4">
            FFC sites are Next.js projects, so you need Git, Node.js 20+ and pnpm. The easiest path
            is to let the agent check and guide you.
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4">
            <p className="text-emerald-400"># Open the Editor terminal and verify versions</p>
            <p>git --version</p>
            <p>node --version &nbsp;&nbsp;# should be v20 or newer</p>
            <p>pnpm --version</p>
          </div>
          <p className="text-gray-700 mb-2 text-sm">
            If any command is &ldquo;not found,&rdquo; ask the Agent Manager:
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-900 italic">
            &ldquo;Git / Node / pnpm is not installed on my [Windows/macOS/Linux] machine. Give me
            the exact commands to install Node.js 20 LTS and pnpm, then verify the versions.&rdquo;
          </div>
          <p className="text-gray-600 text-xs mt-3">
            If you already have Node, install pnpm with{' '}
            <code className="bg-gray-200 px-1 rounded">npm install -g pnpm</code>.
          </p>
        </section>

        {/* 6. GitHub */}
        <section id="github" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🐙
            </span>
            <h2 className="text-2xl font-bold text-gray-900">6. Connect to GitHub</h2>
          </div>
          <p className="text-gray-700 mb-4">
            You connect to GitHub in two complementary ways: once for Git (so you can push branches)
            and once for the GitHub MCP server (so the agent can manage issues and PRs — covered in
            the next section).
          </p>
          <div className="space-y-5">
            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">6.1 — Confirm org membership</h3>
              <p className="text-sm text-gray-700">
                Make sure a maintainer has added you to the{' '}
                <a
                  href="https://github.com/FreeForCharity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline hover:text-emerald-900"
                >
                  FreeForCharity
                </a>{' '}
                GitHub organization. Accept the email invitation before continuing.
              </p>
            </div>
            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                6.2 — Sign in to GitHub in the editor
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Use the built-in GitHub sign-in (Accounts / Source Control panel) and authorize in
                the browser. This stores credentials securely so Git can push without pasting
                passwords. You can confirm in the terminal:
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono">
                git config --global user.name &quot;Your Name&quot;
                <br />
                git config --global user.email &quot;you@example.com&quot;
              </div>
            </div>
          </div>
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              Prefer the editor&apos;s built-in GitHub sign-in over a raw Personal Access Token
              where possible. If a token is ever required, scope it narrowly and never commit it.
            </p>
          </div>
        </section>

        {/* 7. MCP */}
        <section id="mcp" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔌
            </span>
            <h2 className="text-2xl font-bold text-gray-900">7. Enable MCP Servers</h2>
          </div>
          <p className="text-gray-700 mb-4">
            MCP (Model Context Protocol) servers give the agent extra abilities. For FFC work you
            need at least <strong>Playwright</strong> (browser testing) and <strong>GitHub</strong>{' '}
            (issues and PRs). Antigravity offers two ways to add them.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Option A — MCP Store (easiest)</h3>
              <p className="text-sm text-gray-700">
                Open the <strong>MCP Store</strong> from the Agent Manager / settings, search for
                the server you want (for example <em>Playwright</em> or <em>GitHub</em>), and click{' '}
                <strong>Install</strong>. Antigravity walks you through any sign-in the server
                needs.
              </p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Option B — Edit the MCP config</h3>
              <p className="text-sm text-gray-700 mb-2">
                Open Antigravity&apos;s MCP configuration (Settings &rarr; search &ldquo;MCP&rdquo;
                &rarr; <em>Edit configuration</em>). Antigravity uses the{' '}
                <code className="bg-gray-200 px-1 rounded">mcpServers</code> key (the same style as
                other VS Code-derived agent editors):
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                <pre>{`{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}`}</pre>
              </div>
              <p className="text-sm text-gray-700 mt-2">
                After saving, reload the agent. The new tools appear in the agent&apos;s tool list.
              </p>
            </div>
          </div>

          <div className="mt-5 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>Let the agent do it:</strong> you can paste the JSON above into the Agent
              Manager and say &ldquo;Add these MCP servers to my Antigravity configuration and
              reload.&rdquo; First Playwright run will download a browser — that is expected.
            </p>
          </div>
          <div className="mt-3 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              The GitHub MCP server authenticates with a token. Provide it through the editor&apos;s
              secure prompt or an environment variable —{' '}
              <strong>never hard-code a token in the JSON file</strong>, which lives in your repo or
              home folder.
            </p>
          </div>
        </section>

        {/* 8. Clone */}
        <section id="clone" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              📦
            </span>
            <h2 className="text-2xl font-bold text-gray-900">8. Clone a Template Repo</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Practice on a real FFC repository. The{' '}
            <a
              href="https://github.com/FreeForCharity/FFC_Single_Page_Template"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline hover:text-emerald-900"
            >
              FFC_Single_Page_Template
            </a>{' '}
            is the starting point for new charity sites and ships the full toolchain.
          </p>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <p className="text-emerald-400"># Clone, install, and verify the toolchain</p>
            <p>git clone https://github.com/FreeForCharity/FFC_Single_Page_Template.git</p>
            <p>cd FFC_Single_Page_Template</p>
            <p>pnpm install</p>
            <p>pnpm run build</p>
            <p>pnpm run test:e2e &nbsp;&nbsp;# exercises the Playwright setup</p>
          </div>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              In the Editor choose <strong>Open Folder</strong> and select the cloned directory, or
              ask the agent: &ldquo;Clone FFC_Single_Page_Template, install dependencies, and run
              the build and tests.&rdquo; Do not cancel the build or E2E tests — they can take a
              minute.
            </p>
          </div>
        </section>

        {/* 9. First change */}
        <section id="first-change" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔁
            </span>
            <h2 className="text-2xl font-bold text-gray-900">9. Your First Issue to Merge</h2>
          </div>
          <p className="text-gray-700 mb-4">
            With the agent, GitHub MCP, and Playwright MCP connected, you can run the full FFC
            contribution loop. Try a small, safe change such as fixing a typo.
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 1 — Pick or open an issue</h3>
              <p className="text-sm text-gray-700">
                Ask the agent to list open issues on the repo, or to open a new one describing your
                change.
              </p>
            </div>
            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 2 — Branch and edit</h3>
              <p className="text-sm text-gray-700">
                Tell the agent to create a branch (never commit to{' '}
                <code className="bg-gray-200 px-1 rounded">main</code>) and make the change. Review
                the diff in the Editor.
              </p>
            </div>
            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 3 — Run the checks</h3>
              <p className="text-sm text-gray-700">
                Have the agent run <code className="bg-gray-200 px-1 rounded">pnpm run format</code>
                , <code className="bg-gray-200 px-1 rounded">pnpm run lint</code>,{' '}
                <code className="bg-gray-200 px-1 rounded">pnpm test</code>,{' '}
                <code className="bg-gray-200 px-1 rounded">pnpm run build</code>, and{' '}
                <code className="bg-gray-200 px-1 rounded">pnpm run test:e2e</code>.
              </p>
            </div>
            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 4 — Open a PR and merge</h3>
              <p className="text-sm text-gray-700">
                Using the GitHub MCP server, the agent commits with a{' '}
                <a
                  href="https://www.conventionalcommits.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline hover:text-emerald-900"
                >
                  Conventional Commit
                </a>{' '}
                message, pushes the branch, and opens a PR linked to the issue with{' '}
                <code className="bg-gray-200 px-1 rounded">Fixes #NNN</code>. Once CI passes and a
                maintainer approves, the PR merges into the repository.
              </p>
            </div>
          </div>
          <div className="mt-4 bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-900 text-sm">
              That is the whole loop. Every future change — on any FFC charity or website repo —
              follows these same four steps.
            </p>
          </div>
        </section>

        {/* 10. Security */}
        <section id="security" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🛡️
            </span>
            <h2 className="text-2xl font-bold text-gray-900">10. Security and Good Habits</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">&#10005;</span>
              <span>
                Never paste tokens, passwords, or API keys into chat, code, commits, or the MCP
                config file.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
              <span>
                Use the editor&apos;s secure credential prompts or a local{' '}
                <code className="bg-gray-200 px-1 rounded">.env</code> file (already git-ignored).
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
              <span>
                Always review the agent&apos;s diff and the commands it wants to run before
                approving.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
              <span>Work on a branch and open a PR — never push directly to main.</span>
            </li>
          </ul>
          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              See the FFC{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/.claude/rules/01-security.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-900 underline"
              >
                security rules
              </a>{' '}
              for the full policy.
            </p>
          </div>
        </section>

        {/* 11. Troubleshooting */}
        <section id="troubleshooting" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🩺
            </span>
            <h2 className="text-2xl font-bold text-gray-900">11. Troubleshooting</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Symptom
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Fix
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200">Sign-in fails or loops</td>
                  <td className="p-3 border border-gray-200">
                    Fully quit and reopen; ensure Chrome is installed; retry. It usually works on
                    the second attempt.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">MCP tools not showing</td>
                  <td className="p-3 border border-gray-200">
                    Reload the agent after editing the config; confirm{' '}
                    <code className="bg-gray-200 px-1 rounded">mcpServers</code> (not{' '}
                    <code className="bg-gray-200 px-1 rounded">servers</code>) is the root key.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Playwright cannot launch a browser</td>
                  <td className="p-3 border border-gray-200">
                    Run{' '}
                    <code className="bg-gray-200 px-1 rounded">pnpm exec playwright install</code>{' '}
                    once to download browsers.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Push rejected</td>
                  <td className="p-3 border border-gray-200">
                    Confirm FreeForCharity org membership and that you are on a branch, not{' '}
                    <code className="bg-gray-200 px-1 rounded">main</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer nav */}
        <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link
                href="/developer-environment-setup"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                &larr; Back to Developer Environment Setup
              </Link>
            </li>
            <li>
              <Link
                href="/developer-environment-setup/vscode"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                Prefer VS Code? Read the VS Code setup guide
              </Link>
            </li>
            <li>
              <Link href="/testing" className="text-emerald-700 underline hover:text-emerald-900">
                How Playwright fits into our testing strategy
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
