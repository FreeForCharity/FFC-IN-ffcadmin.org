import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import PromptBox from '@/components/PromptBox'

export const metadata: Metadata = {
  title: 'Claude Desktop Setup',
  description:
    'The easiest way to start developing for Free For Charity: Claude Desktop (and Claude Mobile) at the Pro level. Connect GitHub via MCP and run the full issue → PR → merge loop with no local build tools required. Our recommended starting point for new developers.',
  keywords:
    'Claude Desktop, Claude Mobile, Claude Pro, MCP servers, GitHub MCP, connectors, beginner developer, Free For Charity, AI agent',
}

interface GuideSection {
  id: string
  number: string
  title: string
  icon: string
}

const sections: GuideSection[] = [
  { id: 'overview', number: '1', title: 'Why Claude Desktop', icon: '🟠' },
  { id: 'install', number: '2', title: 'Install Desktop + Mobile', icon: '⬇️' },
  { id: 'sign-in', number: '3', title: 'Sign In (Pro Recommended)', icon: '🔑' },
  { id: 'how-it-works', number: '4', title: 'How the Beginner Flow Works', icon: '💡' },
  { id: 'github', number: '5', title: 'Confirm GitHub Access', icon: '🐙' },
  { id: 'mcp', number: '6', title: 'Connect GitHub via MCP', icon: '🔌' },
  { id: 'mobile', number: '7', title: 'Use Claude Mobile', icon: '📱' },
  { id: 'first-change', number: '8', title: 'Your First Issue to Merge', icon: '🔁' },
  { id: 'graduate', number: '9', title: 'When to Move to an IDE', icon: '🎓' },
  { id: 'security', number: '10', title: 'Security and Good Habits', icon: '🛡️' },
  { id: 'troubleshooting', number: '11', title: 'Troubleshooting', icon: '🩺' },
]

export default function ClaudeDesktopSetupGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Developer Environment Setup', href: '/developer-environment-setup' },
          { label: 'Claude Desktop' },
        ]}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🟠
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Claude Desktop Setup</h1>
              <p className="text-amber-100 text-sm mt-1">
                The easiest way to start — our recommendation for new developers
              </p>
            </div>
          </div>
          <p className="text-amber-50 text-lg max-w-3xl">
            Claude Desktop plus Claude Mobile is the gentlest on-ramp to Free For Charity
            development. You sign in, connect GitHub, and let Claude open pull requests for you —
            with no build tools to install. CI runs the tests automatically.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              Beginner-friendly
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              Claude Pro recommended
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
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
                className="flex items-center p-2 rounded-lg hover:bg-amber-50 transition-colors group"
              >
                <span className="text-xl mr-3" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-amber-700">
                  <span className="text-amber-600 font-bold mr-1">{section.number}.</span>
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
              🟠
            </span>
            <h2 className="text-2xl font-bold text-gray-900">1. Why Claude Desktop</h2>
          </div>
          <p className="text-gray-700 mb-4">
            For someone new to development, the simplest setup is a desktop app that already knows
            how to talk to GitHub. Claude Desktop does exactly that. You describe a change in plain
            English; Claude reads the repository, makes the edit, and opens a pull request through
            the GitHub <strong>MCP</strong> connector. Free For Charity&apos;s CI then runs the
            build and tests automatically — so you do not need Node, Git, or a code editor on day
            one.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              <strong>Already pay for ChatGPT, Gemini, or Copilot instead?</strong> Keep your AI —
              see the{' '}
              <Link
                href="/developer-environment-setup"
                className="text-amber-900 underline font-medium"
              >
                hub
              </Link>{' '}
              to set that one up. This guide assumes Claude is your AI of choice.
            </p>
          </div>
        </section>

        {/* 2. Install */}
        <section id="install" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ⬇️
            </span>
            <h2 className="text-2xl font-bold text-gray-900">2. Install Desktop + Mobile</h2>
          </div>
          <ol className="space-y-3 text-sm text-gray-700 list-decimal ml-5">
            <li>
              Download <strong>Claude Desktop</strong> for macOS or Windows from{' '}
              <a
                href="https://claude.ai/download"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 underline hover:text-amber-900"
              >
                claude.ai/download
              </a>{' '}
              and run the installer.
            </li>
            <li>
              Install <strong>Claude Mobile</strong> on your phone from the Apple App Store or
              Google Play so you can review and drive work on the go.
            </li>
            <li>Launch Claude Desktop.</li>
          </ol>
        </section>

        {/* 3. Sign in */}
        <section id="sign-in" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔑
            </span>
            <h2 className="text-2xl font-bold text-gray-900">3. Sign In (Pro Recommended)</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Sign in with your Anthropic account. For real FFC work we recommend the personal{' '}
            <strong>Claude Pro</strong> plan: it gives you enough usage to complete tasks without
            constantly hitting limits, and it unlocks custom MCP <strong>connectors</strong> (the
            free tier is limited to a single custom connector).
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              You can start on the free tier to look around, but plan to upgrade to Pro before doing
              ongoing work — the GitHub connector is central to this guide.
            </p>
          </div>
        </section>

        {/* 4. How it works */}
        <section id="how-it-works" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              💡
            </span>
            <h2 className="text-2xl font-bold text-gray-900">4. How the Beginner Flow Works</h2>
          </div>
          <p className="text-gray-700 mb-4">
            The key idea: <strong>everything happens through GitHub.</strong> With the GitHub MCP
            connector, Claude can read issues, create a branch, commit changes, and open a pull
            request — all on GitHub&apos;s servers. Free For Charity&apos;s CI pipeline then builds
            the site and runs the tests for you. You never have to install a toolchain or run
            commands locally.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-900">
            <strong>No local tooling required.</strong> Node.js, pnpm, and Playwright only matter
            when you graduate to an IDE (see step 9). For now, Claude + GitHub + CI is the whole
            toolchain.
          </div>
        </section>

        {/* 5. GitHub access */}
        <section id="github" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🐙
            </span>
            <h2 className="text-2xl font-bold text-gray-900">5. Confirm GitHub Access</h2>
          </div>
          <p className="text-gray-700">
            Make sure a maintainer has added you to the{' '}
            <a
              href="https://github.com/FreeForCharity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 underline hover:text-amber-900"
            >
              FreeForCharity
            </a>{' '}
            GitHub organization, and accept the email invitation. Without org membership the GitHub
            connector cannot open pull requests on our repositories.
          </p>
        </section>

        {/* 6. MCP */}
        <section id="mcp" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔌
            </span>
            <h2 className="text-2xl font-bold text-gray-900">6. Connect GitHub via MCP</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Claude Desktop calls MCP servers <strong>connectors</strong>, and the GitHub connector
            is already available — you do not install anything by hand. The simplest path is to let
            Claude set it up: paste the prompt below and follow whatever sign-in it walks you
            through. (If you prefer to click through it yourself, the <strong>+</strong> button at
            the bottom of the chat box has a <strong>Connectors</strong> option, and{' '}
            <strong>Settings &rarr; Connectors</strong> lists what is enabled.)
          </p>

          <PromptBox accent="amber">
            &ldquo;I want to work on Free For Charity&apos;s website repositories on GitHub (the
            organization is FreeForCharity). Set yourself up end to end: enable the GitHub connector
            so you can read issues and open pull requests for me, and walk me through any sign-in.
            When you are ready, confirm you can see the{' '}
            <strong>FreeForCharity/FFC_Single_Page_Template</strong> repository and list its open
            issues.&rdquo;
          </PromptBox>

          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-900">
            When a connector is active, a small <strong>hammer / tools icon</strong> appears under
            the chat box showing how many tools are available. If it is missing, fully quit Claude
            Desktop (Cmd+Q or Quit from the tray) and reopen.
          </div>

          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              <strong>Let Claude handle the details.</strong> Connector names, sign-in screens, and
              setup steps change over time, so we deliberately do not print exact configuration here
              — Claude will use whatever the current version needs. Your job is to approve the
              sign-in and never paste a token into chat, an issue, or a repository.
            </p>
          </div>
        </section>

        {/* 7. Mobile */}
        <section id="mobile" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              📱
            </span>
            <h2 className="text-2xl font-bold text-gray-900">7. Use Claude Mobile</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Claude Mobile can use the same <strong>remote connectors</strong> you set up on the web.
            One catch: you add connectors on <strong>claude.ai in a browser</strong> (or Claude
            Desktop), and they sync automatically to your phone — you cannot add a new server from
            the mobile app itself.
          </p>
          <ol className="space-y-2 text-sm text-gray-700 list-decimal ml-5">
            <li>
              On <strong>claude.ai</strong>, open settings and add the GitHub connector (remote
              MCP).
            </li>
            <li>Open Claude Mobile — the connector is already available.</li>
            <li>
              Now you can triage issues, ask for small fixes, and check on a pull request from your
              phone.
            </li>
          </ol>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              Remote connectors run from Anthropic&apos;s cloud, not your device — which is exactly
              why they work the same on desktop, web, and mobile.
            </p>
          </div>
        </section>

        {/* 8. First change */}
        <section id="first-change" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔁
            </span>
            <h2 className="text-2xl font-bold text-gray-900">8. Your First Issue to Merge</h2>
          </div>
          <p className="text-gray-700 mb-4">
            With the GitHub connector active, you can run the entire Free For Charity contribution
            loop from chat. Try a small, safe change like fixing a typo.
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 1 — Pick or open an issue</h3>
              <PromptBox accent="amber">
                &ldquo;Using the GitHub tools, list the open issues on
                FreeForCharity/FFC_Single_Page_Template. If there is no issue for the small change I
                want, open one titled &lsquo;&lt;short title&gt;&rsquo; describing it.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 2 — Make the change on a branch</h3>
              <PromptBox accent="amber">
                &ldquo;Create a new branch for issue #&lt;number&gt; (never commit to{' '}
                <code>main</code>) and make the change it describes. Our template is{' '}
                <strong>FreeForCharity/FFC_Single_Page_Template</strong>; for an example of how a
                finished Free For Charity site is structured, look at{' '}
                <strong>FreeForCharity/FFC-IN-ffcadmin.org</strong> and match its conventions. Show
                me exactly what you changed before opening anything.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 3 — Open a PR and let CI run</h3>
              <PromptBox accent="amber">
                &ldquo;Open a pull request from that branch with a Conventional Commit title, link
                the issue with &lsquo;Fixes #&lt;number&gt;&rsquo;, then watch the CI checks
                (format, lint, build, tests, Playwright) and tell me if any fail.&rdquo;
              </PromptBox>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Step 4 — Review and merge</h3>
              <p className="text-sm text-gray-700">
                Review the diff on GitHub. A maintainer approves, and once every check is green the
                pull request merges. That is the whole loop — no local tools required.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Graduate */}
        <section id="graduate" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🎓
            </span>
            <h2 className="text-2xl font-bold text-gray-900">9. When to Move to an IDE</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Most charity website work never needs more than this. Consider graduating to a full IDE
            only when a task genuinely calls for running builds and tests on your own machine,
            debugging a browser test, or doing a large refactor across many files.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>
                Want to keep using Claude?{' '}
                <Link
                  href="/developer-environment-setup/vscode"
                  className="text-amber-700 underline hover:text-amber-900"
                >
                  VS Code
                </Link>{' '}
                or{' '}
                <Link
                  href="/developer-environment-setup/google-antigravity"
                  className="text-amber-700 underline hover:text-amber-900"
                >
                  Antigravity
                </Link>{' '}
                both let you run Claude as a CLI agent and an in-editor plug-in.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">&bull;</span>
              <span>There is no rush — the beginner path stays valid for the long term.</span>
            </li>
          </ul>
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
              <span>Never paste tokens or keys into chat, issues, commits, or pull requests.</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2 mt-0.5">&#10003;</span>
              <span>Prefer the managed Connectors sign-in over a hand-entered token.</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2 mt-0.5">&#10003;</span>
              <span>
                Review the diff before a pull request merges — you are the human in the loop.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2 mt-0.5">&#10003;</span>
              <span>Always work on a branch and open a PR — never commit straight to main.</span>
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
                  <td className="p-3 border border-gray-200">No tools / hammer icon missing</td>
                  <td className="p-3 border border-gray-200">
                    Fully quit Claude Desktop (Cmd+Q or Quit from the tray) and reopen — a restart
                    is required after adding a connector.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Connector won&apos;t add on mobile</td>
                  <td className="p-3 border border-gray-200">
                    Add it on claude.ai in a browser instead; it syncs to mobile automatically.
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Can&apos;t open a PR on our repo</td>
                  <td className="p-3 border border-gray-200">
                    Confirm you accepted the FreeForCharity org invitation and that the GitHub
                    connector is signed in.
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Only one custom connector allowed</td>
                  <td className="p-3 border border-gray-200">
                    That is the free-tier limit — upgrade to Claude Pro for additional connectors.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer nav */}
        <div className="bg-gradient-to-br from-gray-50 to-amber-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link
                href="/developer-environment-setup"
                className="text-amber-700 underline hover:text-amber-900"
              >
                &larr; Back to Developer Environment Setup
              </Link>
            </li>
            <li>
              <Link
                href="/developer-environment-setup/codex"
                className="text-amber-700 underline hover:text-amber-900"
              >
                Prefer ChatGPT? Set up OpenAI Codex instead
              </Link>
            </li>
            <li>
              <Link
                href="/developer-environment-setup/vscode"
                className="text-amber-700 underline hover:text-amber-900"
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
