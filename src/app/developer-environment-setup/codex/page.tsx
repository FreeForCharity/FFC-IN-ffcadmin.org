import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import PromptBox from '@/components/PromptBox'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/developer-environment-setup/codex/' },
  title: 'OpenAI Codex Setup',
  description:
    'Set up OpenAI Codex for Free For Charity development. Sign in with your ChatGPT Plus or Pro account, connect GitHub, add the GitHub and Playwright MCP servers, and run the issue → PR → merge loop. Best if you already pay for ChatGPT.',
  keywords:
    'OpenAI Codex, Codex app, Codex CLI, ChatGPT Plus, ChatGPT Pro, MCP servers, GitHub MCP, AGENTS.md, Free For Charity, AI agent',
}

interface GuideSection {
  id: string
  number: string
  title: string
  icon: string
}

const sections: GuideSection[] = [
  { id: 'overview', number: '1', title: 'Why Codex', icon: '⚫' },
  { id: 'install', number: '2', title: 'Install the Codex App', icon: '⬇️' },
  { id: 'sign-in', number: '3', title: 'Sign In with ChatGPT', icon: '🔑' },
  { id: 'github', number: '4', title: 'Connect GitHub', icon: '🐙' },
  { id: 'mcp', number: '5', title: 'Add MCP Servers', icon: '🔌' },
  { id: 'agents-md', number: '6', title: 'Codex Reads AGENTS.md', icon: '📄' },
  { id: 'first-change', number: '7', title: 'Your First Issue to Merge', icon: '🔁' },
  { id: 'graduate', number: '8', title: 'When to Move to an IDE', icon: '🎓' },
  { id: 'security', number: '9', title: 'Security and Good Habits', icon: '🛡️' },
  { id: 'troubleshooting', number: '10', title: 'Troubleshooting', icon: '🩺' },
]

export default function CodexSetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Developer Environment Setup', href: '/developer-environment-setup' },
          { label: 'OpenAI Codex' },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              ⚫
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">OpenAI Codex Setup</h1>
              <p className="text-slate-300 text-sm mt-1">
                Best if you already pay for ChatGPT Plus or Pro
              </p>
            </div>
          </div>
          <p className="text-slate-200 text-lg max-w-3xl">
            Codex is OpenAI&apos;s coding agent. If ChatGPT is already your AI, use it for Free For
            Charity too: sign in with your ChatGPT account, connect GitHub, and run the same issue
            &rarr; pull request &rarr; merge loop as every FFC repository.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              Beginner-friendly
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              Sign in with ChatGPT
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
              ~20 minutes
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
                className="flex items-center p-2 rounded-lg hover:bg-slate-100 transition-colors group"
              >
                <span className="text-xl mr-3" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-slate-900">
                  <span className="text-slate-600 font-bold mr-1">{section.number}.</span>
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
              ⚫
            </span>
            <h2 className="text-2xl font-bold text-gray-900">1. Why Codex</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Codex comes as a <strong>desktop app</strong>, a <strong>command-line (CLI)</strong>{' '}
            tool, an IDE extension, and a cloud agent at{' '}
            <a
              href="https://chatgpt.com/codex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 underline hover:text-slate-900"
            >
              chatgpt.com/codex
            </a>
            . They share one account and one configuration. If you already pay for ChatGPT, this is
            the most natural way to help Free For Charity.
          </p>
          <div className="bg-slate-100 border-l-4 border-slate-500 p-4 rounded">
            <p className="text-slate-800 text-sm">
              <strong>Prefer Claude, Gemini, or Copilot?</strong> Use the AI you already pay for —
              the{' '}
              <Link
                href="/developer-environment-setup"
                className="text-slate-900 underline font-medium"
              >
                hub
              </Link>{' '}
              points you to the right guide. This one assumes Codex is your AI of choice.
            </p>
          </div>
        </section>

        {/* 2. Install */}
        <section id="install" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ⬇️
            </span>
            <h2 className="text-2xl font-bold text-gray-900">2. Install the Codex App</h2>
          </div>
          <p className="text-gray-700 mb-4">
            The <strong>Codex app</strong> is available on macOS and Windows and is the easiest
            place to start.
          </p>
          <ol className="space-y-3 text-sm text-gray-700 list-decimal ml-5">
            <li>
              Download the Codex app from the{' '}
              <a
                href="https://developers.openai.com/codex/app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 underline hover:text-slate-900"
              >
                Codex app page
              </a>{' '}
              and install it.
            </li>
            <li>Launch the app and sign in (next step).</li>
            <li>
              <span className="text-gray-600">
                (Optional, advanced) There is also a Codex command-line tool if you prefer the
                terminal. It shares the same account and configuration as the app — ask Codex to set
                it up for you when you get there.
              </span>
            </li>
          </ol>
        </section>

        {/* 3. Sign in */}
        <section id="sign-in" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔑
            </span>
            <h2 className="text-2xl font-bold text-gray-900">3. Sign In with ChatGPT</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Open the app and choose <strong>Sign in with ChatGPT</strong>. Codex is included with{' '}
            <strong>ChatGPT Plus, Pro, Business, Edu, and Enterprise</strong> plans — Plus or Pro is
            plenty for FFC work. (An OpenAI API key also works but needs extra setup; signing in
            with ChatGPT is simpler.)
          </p>
        </section>

        {/* 4. GitHub */}
        <section id="github" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🐙
            </span>
            <h2 className="text-2xl font-bold text-gray-900">4. Connect GitHub</h2>
          </div>
          <div className="space-y-5">
            <div className="border-l-4 border-slate-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">4.1 — Confirm org membership</h3>
              <p className="text-sm text-gray-700">
                Make sure a maintainer has added you to the{' '}
                <a
                  href="https://github.com/FreeForCharity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  FreeForCharity
                </a>{' '}
                organization and accept the invitation.
              </p>
            </div>
            <div className="border-l-4 border-slate-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">4.2 — Connect your repository</h3>
              <p className="text-sm text-gray-700">
                For the cloud agent, open the environment settings at{' '}
                <a
                  href="https://chatgpt.com/codex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  chatgpt.com/codex
                </a>{' '}
                and follow the steps to connect a GitHub repository (for example{' '}
                <code className="bg-gray-200 px-1 rounded">
                  FreeForCharity/FFC_Single_Page_Template
                </code>
                ). The desktop app and CLI can also work on a local clone you open directly.
              </p>
            </div>
          </div>
        </section>

        {/* 5. MCP */}
        <section id="mcp" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔌
            </span>
            <h2 className="text-2xl font-bold text-gray-900">5. Add MCP Servers</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Codex understands MCP servers in the app, the CLI, and the IDE extension. You need{' '}
            <strong>GitHub</strong> (and, once you are running browser tests,{' '}
            <strong>Playwright</strong>). Rather than memorize commands or config files — which
            change between versions — just ask Codex to set them up:
          </p>

          <PromptBox accent="slate">
            &ldquo;I want to work on Free For Charity&apos;s website repositories on GitHub
            (organization: FreeForCharity). Set yourself up: enable the GitHub MCP server so you can
            read issues and open pull requests, and the Playwright MCP server if we will run the
            site&apos;s end-to-end tests. Install or enable whatever you need, walk me through any
            sign-in, then confirm you can see{' '}
            <strong>FreeForCharity/FFC_Single_Page_Template</strong> and list its open
            issues.&rdquo;
          </PromptBox>

          <div className="mt-4 bg-slate-100 border-l-4 border-slate-500 p-4 rounded">
            <p className="text-slate-800 text-sm">
              <strong>Let Codex handle the particulars.</strong> Server names and setup steps drift
              over time, so we keep this prompt-driven instead of pasting config that could be
              stale. The GitHub server needs a token — provide it only through Codex&apos;s secure
              prompt or an environment variable, and never paste it into a file, an issue, or chat.
            </p>
          </div>
        </section>

        {/* 6. AGENTS.md */}
        <section id="agents-md" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              📄
            </span>
            <h2 className="text-2xl font-bold text-gray-900">6. Codex Reads AGENTS.md</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Codex automatically reads an <code className="bg-gray-200 px-1 rounded">AGENTS.md</code>{' '}
            file for project-specific instructions — and{' '}
            <strong>every Free For Charity repository ships one.</strong> It documents our tech
            stack, the pre-commit/CI order (format &rarr; lint &rarr; build &rarr; test), naming
            conventions, and security rules. You get the house style for free; no extra prompting
            needed.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-900">
            Once GitHub is connected and the repo is open, Codex already knows how we work. Just
            describe the change.
          </div>
        </section>

        {/* 7. First change */}
        <section id="first-change" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔁
            </span>
            <h2 className="text-2xl font-bold text-gray-900">7. Your First Issue to Merge</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Run the full Free For Charity contribution loop on a small, safe change.
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-slate-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 1 — Pick or open an issue</h3>
              <PromptBox accent="slate">
                &ldquo;List the open issues on FreeForCharity/FFC_Single_Page_Template. If none
                cover the small change I want, open one titled &lsquo;&lt;short
                title&gt;&rsquo;.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-slate-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 2 — Make the change on a branch</h3>
              <PromptBox accent="slate">
                &ldquo;Create a branch for issue #&lt;number&gt; (never <code>main</code>) and make
                the change. Follow the repo&apos;s <code>AGENTS.md</code>; our template is{' '}
                <strong>FreeForCharity/FFC_Single_Page_Template</strong>, and{' '}
                <strong>FreeForCharity/FFC-IN-ffcadmin.org</strong> is a live example of a finished
                site to match. Show me the diff to review before opening anything.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-slate-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 3 — Open a PR and watch CI</h3>
              <PromptBox accent="slate">
                &ldquo;Open a pull request with a Conventional Commit title, link the issue with
                &lsquo;Fixes #&lt;number&gt;&rsquo;, then watch the CI checks (format, lint, build,
                tests, Playwright) and fix anything that fails.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-slate-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 4 — Review and merge</h3>
              <p className="text-sm text-gray-700">
                Review the diff on GitHub. Once a maintainer approves and all checks are green, the
                pull request merges.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Graduate */}
        <section id="graduate" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🎓
            </span>
            <h2 className="text-2xl font-bold text-gray-900">8. When to Move to an IDE</h2>
          </div>
          <p className="text-gray-700 mb-4">
            The Codex app and CLI already cover the vast majority of charity website work. Move into
            a full IDE only when you want a tighter local edit-run-debug loop or a large refactor.
            Codex has a first-class extension for both editors:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                <Link
                  href="/developer-environment-setup/vscode"
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  VS Code
                </Link>{' '}
                — run Codex as an in-editor agent alongside builds, tests, and Playwright.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                <Link
                  href="/developer-environment-setup/google-antigravity"
                  className="text-slate-700 underline hover:text-slate-900"
                >
                  Google Antigravity
                </Link>{' '}
                — an agent-first IDE you can also drive with Codex.
              </span>
            </li>
          </ul>
        </section>

        {/* 9. Security */}
        <section id="security" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🛡️
            </span>
            <h2 className="text-2xl font-bold text-gray-900">9. Security and Good Habits</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">&#10005;</span>
              <span>
                Never paste tokens or keys into chat, code, commits, or config you might commit.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-slate-600 mr-2 mt-0.5">&#10003;</span>
              <span>
                Keep Codex&apos;s tool-approval prompts on while you are learning, so you see each
                action before it runs.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-slate-600 mr-2 mt-0.5">&#10003;</span>
              <span>Review the diff before a pull request merges.</span>
            </li>
            <li className="flex items-start">
              <span className="text-slate-600 mr-2 mt-0.5">&#10003;</span>
              <span>Always work on a branch and open a PR — never commit straight to main.</span>
            </li>
          </ul>
          <div className="mt-4 bg-slate-100 border-l-4 border-slate-500 p-4 rounded">
            <p className="text-slate-800 text-sm">
              See the FFC{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/.claude/rules/01-security.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-900 underline"
              >
                security rules
              </a>{' '}
              for the full policy.
            </p>
          </div>
        </section>

        {/* 10. Troubleshooting */}
        <section id="troubleshooting" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🩺
            </span>
            <h2 className="text-2xl font-bold text-gray-900">10. Troubleshooting</h2>
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
                  <td className="p-3 border border-gray-200">Sign-in not recognized</td>
                  <td className="p-3 border border-gray-200">
                    Confirm your ChatGPT plan includes Codex (Plus/Pro/Business/Edu/Enterprise) and
                    sign in again.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">MCP server not connecting</td>
                  <td className="p-3 border border-gray-200">
                    Ask Codex to re-enable the server and confirm it started; if it is slow to
                    launch, ask it to increase the server&apos;s startup timeout.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Can&apos;t open a PR on our repo</td>
                  <td className="p-3 border border-gray-200">
                    Confirm FreeForCharity org membership and that the repo is connected at
                    chatgpt.com/codex.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Codex ignores house style</td>
                  <td className="p-3 border border-gray-200">
                    Make sure you are working in the repo so Codex can read its{' '}
                    <code className="bg-gray-200 px-1 rounded">AGENTS.md</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer nav */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link
                href="/developer-environment-setup"
                className="text-slate-700 underline hover:text-slate-900"
              >
                &larr; Back to Developer Environment Setup
              </Link>
            </li>
            <li>
              <Link
                href="/developer-environment-setup/claude-desktop"
                className="text-slate-700 underline hover:text-slate-900"
              >
                Prefer Claude? Set up Claude Desktop instead
              </Link>
            </li>
            <li>
              <Link
                href="/developer-environment-setup/vscode"
                className="text-slate-700 underline hover:text-slate-900"
              >
                Ready for more? Move up to VS Code (advanced)
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
