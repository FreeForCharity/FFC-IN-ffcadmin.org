import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import PromptBox from '@/components/PromptBox'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/developer-environment-setup/vscode/' },
  title: 'VS Code Setup',
  description:
    'Set up Microsoft VS Code for Free For Charity website development. Install it, sign in with GitHub Copilot agent mode, connect GitHub, and enable the GitHub and Playwright MCP servers so the AI agent can open issues, make PRs, and merge changes.',
  keywords:
    'VS Code, GitHub Copilot, agent mode, MCP servers, Playwright MCP, GitHub MCP, AI coding agent, Free For Charity, developer environment',
}

interface GuideSection {
  id: string
  number: string
  title: string
  icon: string
}

const sections: GuideSection[] = [
  { id: 'overview', number: '1', title: 'What You Are Building', icon: '🧩' },
  { id: 'install', number: '2', title: 'Install VS Code', icon: '⬇️' },
  { id: 'core-tools', number: '3', title: 'Install Git, Node, and pnpm', icon: '🔧' },
  { id: 'copilot', number: '4', title: 'Enable GitHub Copilot (Agent Mode)', icon: '🤖' },
  { id: 'github', number: '5', title: 'Connect to GitHub', icon: '🐙' },
  { id: 'extensions', number: '6', title: 'Recommended Extensions', icon: '🧱' },
  { id: 'mcp', number: '7', title: 'Configure MCP Servers', icon: '🔌' },
  { id: 'clone', number: '8', title: 'Clone a Template Repo', icon: '📦' },
  { id: 'first-change', number: '9', title: 'Your First Issue to Merge', icon: '🔁' },
  { id: 'security', number: '10', title: 'Security and Good Habits', icon: '🛡️' },
  { id: 'troubleshooting', number: '11', title: 'Troubleshooting', icon: '🩺' },
]

export default function VSCodeSetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Developer Environment Setup', href: '/developer-environment-setup' },
          { label: 'VS Code' },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🧩
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Microsoft VS Code Setup</h1>
              <p className="text-blue-200 text-sm mt-1">
                The industry-standard editor, configured for FFC development
              </p>
            </div>
          </div>
          <p className="text-blue-100 text-lg max-w-3xl">
            VS Code is free, open source, and the most widely documented editor in the world. With
            the GitHub Copilot free tier in <strong>agent mode</strong> plus a couple of MCP
            servers, it can open issues, write code, run our Playwright tests, and prepare pull
            requests for you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-blue-600/50 px-3 py-1 rounded-full text-sm font-medium">
              Free &amp; open source
            </span>
            <span className="bg-blue-600/50 px-3 py-1 rounded-full text-sm font-medium">
              Copilot free tier
            </span>
            <span className="bg-blue-600/50 px-3 py-1 rounded-full text-sm font-medium">
              ~30 minutes
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Advanced positioning */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-8">
          <p className="text-sm text-indigo-900">
            <strong>This is an advanced environment.</strong> If you are new to development, start
            with{' '}
            <Link
              href="/developer-environment-setup/claude-desktop"
              className="text-indigo-800 underline font-medium"
            >
              Claude Desktop
            </Link>{' '}
            — most charity website work never needs more. Come here when you want local builds,
            browser debugging, or larger refactors. VS Code&apos;s agent mode is Copilot-native, but
            you can also run{' '}
            <Link
              href="/developer-environment-setup/claude-desktop"
              className="text-indigo-800 underline"
            >
              Claude
            </Link>{' '}
            or{' '}
            <Link href="/developer-environment-setup/codex" className="text-indigo-800 underline">
              Codex
            </Link>{' '}
            as the agent. See the{' '}
            <Link href="/developer-environment-setup" className="text-indigo-800 underline">
              setup hub
            </Link>{' '}
            to compare options.
          </p>
        </div>

        {/* TOC */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">On this page</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <span className="text-xl mr-3" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  <span className="text-blue-600 font-bold mr-1">{section.number}.</span>
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
              🧩
            </span>
            <h2 className="text-2xl font-bold text-gray-900">1. What You Are Building</h2>
          </div>
          <p className="text-gray-700 mb-4">
            You are turning a plain VS Code install into an AI-assisted FFC development environment.
            The pieces: VS Code itself, the toolchain (Git, Node, pnpm), GitHub Copilot in agent
            mode as your AI agent, a GitHub connection, and MCP servers for Playwright and GitHub.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>Agent mode is the key.</strong> Copilot&apos;s Ask and Edit modes cannot use
              MCP tools. You must select <em>Agent</em> in the Copilot Chat mode dropdown for the
              Playwright and GitHub servers to be usable.
            </p>
          </div>
        </section>

        {/* 2. Install */}
        <section id="install" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ⬇️
            </span>
            <h2 className="text-2xl font-bold text-gray-900">2. Install VS Code</h2>
          </div>
          <ol className="space-y-3 text-sm text-gray-700 list-decimal ml-5">
            <li>
              Download VS Code from{' '}
              <a
                href="https://code.visualstudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline hover:text-blue-900"
              >
                code.visualstudio.com
              </a>{' '}
              for your operating system.
            </li>
            <li>Run the installer and accept the defaults.</li>
            <li>
              On Windows, allow the &ldquo;Add to PATH&rdquo; and &ldquo;Open with Code&rdquo;
              options so you can launch from the terminal with{' '}
              <code className="bg-gray-200 px-1 rounded">code .</code>.
            </li>
            <li>Launch VS Code.</li>
          </ol>
        </section>

        {/* 3. Core tools */}
        <section id="core-tools" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔧
            </span>
            <h2 className="text-2xl font-bold text-gray-900">3. Install Git, Node, and pnpm</h2>
          </div>
          <p className="text-gray-700 mb-4">
            FFC sites are Next.js projects, so you need Git, Node.js 20+ and pnpm 9 (our repos pin
            pnpm 9). <strong>Do not look up install commands — let Copilot do it for you.</strong>{' '}
            Open Copilot Chat in <em>Agent</em> mode and ask:
          </p>
          <PromptBox accent="blue">
            &ldquo;Set up my machine for Free For Charity Next.js development. Check whether Git,
            Node.js 20 LTS or newer, and pnpm 9 are installed, install anything missing using the
            right method for my operating system, and confirm the versions when you are done. Our
            repositories pin pnpm 9, so match that.&rdquo;
          </PromptBox>
        </section>

        {/* 4. Copilot */}
        <section id="copilot" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🤖
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              4. Enable GitHub Copilot (Agent Mode)
            </h2>
          </div>
          <ol className="space-y-3 text-sm text-gray-700 list-decimal ml-5">
            <li>
              In the Extensions view (
              <code className="bg-gray-200 px-1 rounded">Ctrl/Cmd+Shift+X</code>
              ), install <strong>GitHub Copilot</strong> and <strong>GitHub Copilot Chat</strong>.
            </li>
            <li>
              Click the Copilot icon and sign in with your GitHub account. The{' '}
              <strong>Copilot free tier</strong> is enough to get started.
            </li>
            <li>
              Open Copilot Chat, click the <strong>mode dropdown</strong>, and choose{' '}
              <strong>Agent</strong>. This is required for MCP tools to be visible.
            </li>
          </ol>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              The <strong>Configure Tools</strong> button in the chat input lets you see and toggle
              which tools (including MCP servers) the agent may use.
            </p>
          </div>
        </section>

        {/* 5. GitHub */}
        <section id="github" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🐙
            </span>
            <h2 className="text-2xl font-bold text-gray-900">5. Connect to GitHub</h2>
          </div>
          <div className="space-y-5">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">5.1 — Confirm org membership</h3>
              <p className="text-sm text-gray-700">
                Make sure a maintainer has added you to the{' '}
                <a
                  href="https://github.com/FreeForCharity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  FreeForCharity
                </a>{' '}
                organization, and accept the invitation.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">5.2 — Sign in to GitHub in VS Code</h3>
              <p className="text-sm text-gray-700">
                Use the <strong>Accounts</strong> menu (bottom-left) to sign in to GitHub, and
                install the <strong>GitHub Pull Requests</strong> extension so you can manage issues
                and PRs from the sidebar. Copilot can set up your Git identity and confirm the
                connection for you.
              </p>
            </div>
          </div>
          <PromptBox accent="blue">
            &ldquo;Help me connect VS Code to GitHub. Set my Git name and email, confirm I am signed
            in, install the GitHub Pull Requests extension, and verify I have access to the
            FreeForCharity organization.&rdquo;
          </PromptBox>
        </section>

        {/* 6. Extensions */}
        <section id="extensions" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🧱
            </span>
            <h2 className="text-2xl font-bold text-gray-900">6. Recommended Extensions</h2>
          </div>
          <p className="text-gray-700 mb-4">
            These match the FFC tech stack and keep you consistent with CI.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                <strong>ESLint</strong> &mdash; matches our lint step
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                <strong>Prettier</strong> &mdash; matches our formatting step
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                <strong>Tailwind CSS IntelliSense</strong> &mdash; class autocompletion
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                <strong>Playwright Test for VS Code</strong> &mdash; run/debug E2E tests
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                <strong>GitHub Pull Requests</strong> &mdash; issues and PRs in the sidebar
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                <strong>GitHub Copilot</strong> + <strong>Copilot Chat</strong> &mdash; the AI agent
              </span>
            </li>
          </ul>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              Many FFC repos ship a{' '}
              <code className="bg-gray-200 px-1 rounded">.vscode/extensions.json</code> with these
              recommendations. When you open the repo, VS Code offers to install them in one click.
            </p>
          </div>
        </section>

        {/* 7. MCP */}
        <section id="mcp" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔌
            </span>
            <h2 className="text-2xl font-bold text-gray-900">7. Configure MCP Servers</h2>
          </div>
          <p className="text-gray-700 mb-4">
            VS Code reads MCP server configuration for a workspace, and the servers you need —{' '}
            <strong>GitHub</strong> (issues and PRs) and <strong>Playwright</strong> (browser
            testing) — are available without hand-writing any config. Rather than copy a snippet
            that could be stale, let Copilot set them up in agent mode:
          </p>
          <PromptBox accent="blue">
            &ldquo;Configure the MCP servers I need for this workspace so you can work on Free For
            Charity repositories: a GitHub server (issues and pull requests) and a Playwright server
            (for our end-to-end tests). Add them however the current version of VS Code expects,
            start them, and confirm both appear in <strong>Configure Tools</strong>. I&apos;ll
            approve any sign-in.&rdquo;
          </PromptBox>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>Verify:</strong> make sure Copilot Chat is in <em>Agent</em> mode (Ask/Edit
              cannot use MCP tools), open <strong>Configure Tools</strong>, and check the GitHub and
              Playwright tools are listed and enabled. The first Playwright run downloads a browser
              — that is expected.
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
            Practice on the{' '}
            <a
              href="https://github.com/FreeForCharity/FFC_Single_Page_Template"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline hover:text-blue-900"
            >
              FFC_Single_Page_Template
            </a>
            , the starting point for new charity sites.
          </p>
          <p className="text-gray-700 mb-1 text-sm">
            Let Copilot clone it, install dependencies, and run the checks — it knows the commands
            for the current toolchain:
          </p>
          <PromptBox accent="blue">
            &ldquo;Clone <strong>FreeForCharity/FFC_Single_Page_Template</strong>, open it in this
            window, install dependencies, then run our full set of checks in the order this
            repo&apos;s <code>AGENTS.md</code> describes (formatting, linting, build, tests, and
            end-to-end tests). For an example of a finished Free For Charity site, also pull up{' '}
            <strong>FreeForCharity/FFC-IN-ffcadmin.org</strong>. Do not cancel long-running
            commands; tell me if anything fails.&rdquo;
          </PromptBox>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              The build and end-to-end run can take a minute — let them finish.
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
            With Copilot agent mode plus the GitHub and Playwright MCP servers, run the full FFC
            contribution loop on a small change.
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 1 — Pick or open an issue</h3>
              <p className="text-sm text-gray-700">
                Ask the agent to list open issues, or open a new one describing your change.
              </p>
              <PromptBox accent="blue">
                &ldquo;Using the GitHub MCP server, list the open issues on this repository. If
                there is no issue for the small change I want to make, open a new issue titled
                &lsquo;&lt;short title&gt;&rsquo; describing it.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 2 — Branch and edit</h3>
              <p className="text-sm text-gray-700">
                Have the agent create a branch (never{' '}
                <code className="bg-gray-200 px-1 rounded">main</code>) and make the change. Review
                the diff in Source Control.
              </p>
              <PromptBox accent="blue">
                &ldquo;Create a new branch for issue #&lt;number&gt; (do not commit to{' '}
                <code>main</code>) and make the change it describes. Follow the repo&apos;s{' '}
                <code>AGENTS.md</code> conventions, and use{' '}
                <strong>FreeForCharity/FFC-IN-ffcadmin.org</strong> as an example of how a finished
                site is built. When you are done, show me the full diff so I can review it before we
                go further.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 3 — Run the checks</h3>
              <p className="text-sm text-gray-700">
                Have the agent run our full set of checks — formatting, linting, build, unit tests,
                and end-to-end tests — in the order our{' '}
                <code className="bg-gray-200 px-1 rounded">AGENTS.md</code> specifies (build before
                tests, to match CI). The agent reads the exact commands from the repo, so you do not
                have to.
              </p>
              <PromptBox accent="blue">
                &ldquo;Run our full pre-commit checklist in the order documented in this repo&apos;s{' '}
                <code>AGENTS.md</code> (formatting, linting, build, unit tests, then end-to-end
                tests). Do not cancel anything. Fix any failures and re-run until everything
                passes.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 4 — Open a PR and merge</h3>
              <p className="text-sm text-gray-700">
                Via the GitHub MCP server, the agent commits with a{' '}
                <a
                  href="https://www.conventionalcommits.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  Conventional Commit
                </a>{' '}
                message, pushes, and opens a PR linked with{' '}
                <code className="bg-gray-200 px-1 rounded">Fixes #NNN</code>. After CI passes and a
                maintainer approves, it merges.
              </p>
              <PromptBox accent="blue">
                &ldquo;Commit the changes with a Conventional Commit message, push the branch, and
                open a pull request that links the issue with &lsquo;Fixes #&lt;number&gt;&rsquo;.
                Then watch the CI checks and fix anything that fails until they are green.&rdquo;
              </PromptBox>
            </div>
          </div>
          <div className="mt-4 bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-900 text-sm">
              Every future change on any FFC charity or website repo follows these same four steps.
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
                Never paste tokens or keys into chat, code, commits, or any workspace MCP config
                file (those can be committed to the repo).
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 mt-0.5">&#10003;</span>
              <span>
                Use VS Code&apos;s secure input prompts or a git-ignored{' '}
                <code className="bg-gray-200 px-1 rounded">.env</code> for any secrets.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 mt-0.5">&#10003;</span>
              <span>Review every diff and command before approving the agent.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 mt-0.5">&#10003;</span>
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
                  <td className="p-3 border border-gray-200">MCP tools are invisible in chat</td>
                  <td className="p-3 border border-gray-200">
                    Switch Copilot Chat to <strong>Agent</strong> mode — Ask/Edit cannot use MCP
                    tools.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Server fails to start</td>
                  <td className="p-3 border border-gray-200">
                    Ask Copilot to re-add the server the way the current version of VS Code expects,
                    then reload the window.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Playwright cannot launch a browser</td>
                  <td className="p-3 border border-gray-200">
                    Ask the agent to install the Playwright browsers once.
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
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link
                href="/developer-environment-setup"
                className="text-blue-700 underline hover:text-blue-900"
              >
                &larr; Back to Developer Environment Setup
              </Link>
            </li>
            <li>
              <Link
                href="/developer-environment-setup/google-antigravity"
                className="text-blue-700 underline hover:text-blue-900"
              >
                Prefer an agent-first IDE? Read the Google Antigravity setup guide
              </Link>
            </li>
            <li>
              <Link href="/testing" className="text-blue-700 underline hover:text-blue-900">
                How Playwright fits into our testing strategy
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
