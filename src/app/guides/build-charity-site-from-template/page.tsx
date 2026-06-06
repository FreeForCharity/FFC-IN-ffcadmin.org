import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import PromptBox from '@/components/PromptBox'

export const metadata: Metadata = {
  title: 'Build a Charity Site from the Template',
  description:
    'Stand up a new charity website from the FreeForCharity single-page template using your AI agent — create the repository, customize the content, run the checks, open a pull request, and deploy. Prompt-driven, no stale step-by-step.',
  keywords:
    'build charity website, FFC template, FFC_Single_Page_Template, Next.js charity site, GitHub Pages, AI agent, Free For Charity guide',
  alternates: {
    canonical: 'https://ffcadmin.org/guides/build-charity-site-from-template/',
  },
}

const tocItems = [
  { id: 'before', label: '1. Before you start' },
  { id: 'create', label: '2. Create the repo from the template' },
  { id: 'point', label: '3. Point your AI agent at it' },
  { id: 'customize', label: '4. Customize the content' },
  { id: 'checks', label: '5. Run the checks' },
  { id: 'ship', label: '6. Open a PR and deploy' },
  { id: 'next', label: '7. Hand off to the site owner' },
]

export default function BuildFromTemplateGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: 'Build from Template' },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🧩
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Build a Charity Site from the Template
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                From empty repo to deployed site — driven by your AI agent
              </p>
            </div>
          </div>
          <p className="text-blue-50 text-lg max-w-3xl">
            This guide takes a developer from the{' '}
            <strong>FreeForCharity/FFC_Single_Page_Template</strong> to a live, deployed charity
            site. It&apos;s prompt-driven: you hand each step to your AI agent and review the
            result, using <strong>FreeForCharity/FFC-IN-ffcadmin.org</strong> as a finished example
            to match.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* TOC */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">On this page</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {tocItems.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-blue-700 underline hover:text-blue-900">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 1 */}
        <section id="before" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Before you start</h2>
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>
              A working AI agent connected to GitHub — set this up first on the{' '}
              <Link
                href="/developer-environment-setup"
                className="text-blue-700 underline hover:text-blue-900"
              >
                Developer Environment Setup
              </Link>{' '}
              hub (newcomers: start with{' '}
              <Link
                href="/developer-environment-setup/claude-desktop"
                className="text-blue-700 underline hover:text-blue-900"
              >
                Claude Desktop
              </Link>
              ).
            </li>
            <li>Write access to the FreeForCharity organization (a maintainer can grant it).</li>
            <li>The charity&apos;s basic content on hand: name, mission, contact info, logo.</li>
          </ul>
        </section>

        {/* 2 */}
        <section id="create" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2. Create the repo from the template
          </h2>
          <p className="text-gray-700 mb-4">
            The template is a GitHub <strong>template repository</strong>, so a new site starts as a
            clean copy with its own history.
          </p>
          <PromptBox accent="blue" label="Paste this into your AI agent">
            &ldquo;Create a new repository in the FreeForCharity organization from the template{' '}
            <strong>FreeForCharity/FFC_Single_Page_Template</strong>, named{' '}
            <strong>&lt;charity-slug&gt;</strong>. Then confirm you can see it and summarize what
            the template contains.&rdquo;
          </PromptBox>
        </section>

        {/* 3 */}
        <section id="point" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Point your AI agent at it</h2>
          <p className="text-gray-700 mb-4">
            Have the agent read the repo&apos;s conventions before changing anything.
          </p>
          <PromptBox accent="blue" label="Paste this into your AI agent">
            &ldquo;Read the <code>AGENTS.md</code> in <strong>&lt;charity-slug&gt;</strong> and
            follow its conventions. Use <strong>FreeForCharity/FFC-IN-ffcadmin.org</strong> as a
            reference for how a finished FFC site is structured. Don&apos;t change anything yet —
            tell me your plan first.&rdquo;
          </PromptBox>
        </section>

        {/* 4 */}
        <section
          id="customize"
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Customize the content</h2>
          <p className="text-gray-700 mb-4">
            Work in small, reviewable changes on a branch — name, mission, sections, branding.
          </p>
          <PromptBox accent="blue" label="Paste this into your AI agent">
            &ldquo;On a new branch, customize <strong>&lt;charity-slug&gt;</strong> for{' '}
            <strong>&lt;Charity Name&gt;</strong>: set the site title and mission to
            &lsquo;&lt;mission&gt;&rsquo;, update contact details to &lt;details&gt;, and swap in
            the logo I&apos;ll provide. Use <code>assetPath()</code> for images, keep it accessible
            (alt text, contrast), and show me what changed before opening anything.&rdquo;
          </PromptBox>
        </section>

        {/* 5 */}
        <section id="checks" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Run the checks</h2>
          <p className="text-gray-700 mb-4">
            Run the project&apos;s checks in the order its <code>AGENTS.md</code> documents, rather
            than a hard-coded list that can go stale.
          </p>
          <PromptBox accent="blue" label="Paste this into your AI agent">
            &ldquo;Run the formatting, lint, build, and test checks in the order described in{' '}
            <code>AGENTS.md</code> for this repo, and fix anything that fails until they all
            pass.&rdquo;
          </PromptBox>
        </section>

        {/* 6 */}
        <section id="ship" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Open a PR and deploy</h2>
          <p className="text-gray-700 mb-4">
            Open a pull request and let CI validate it; once it merges, GitHub Pages publishes the
            site.
          </p>
          <PromptBox accent="blue" label="Paste this into your AI agent">
            &ldquo;Open a pull request with a Conventional Commit title, watch the CI checks, and
            fix any failures. Once everything is green and it merges, confirm the site deployed and
            give me the live URL.&rdquo;
          </PromptBox>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded text-sm text-blue-900">
            Custom domain &amp; DNS (Cloudflare → GitHub Pages) is a Global Admin task — see the{' '}
            <Link href="/training" className="underline font-medium">
              Domains &amp; DNS module
            </Link>
            .
          </div>
        </section>

        {/* 7 */}
        <section id="next" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Hand off to the site owner</h2>
          <p className="text-gray-700">
            Once the site is live, the charity&apos;s owner maintains it themselves. Point them to{' '}
            <Link href="/site-owner" className="text-blue-700 underline hover:text-blue-900">
              Edit Your Charity&apos;s Website
            </Link>{' '}
            and add them as a writer on the repository so they can make everyday changes with AI.
          </p>
        </section>

        {/* Footer nav */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/guides" className="text-blue-700 underline hover:text-blue-900">
                &larr; All Guides
              </Link>
            </li>
            <li>
              <Link
                href="/training/web-developer"
                className="text-blue-700 underline hover:text-blue-900"
              >
                Web Developer training track
              </Link>
            </li>
            <li>
              <Link
                href="/developer-environment-setup"
                className="text-blue-700 underline hover:text-blue-900"
              >
                Developer Environment Setup
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
