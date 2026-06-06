import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import PromptBox from '@/components/PromptBox'

export const metadata: Metadata = {
  title: 'Edit My Charity Website',
  description:
    'FFC built a website for the charity you run, and you just want to edit it. This is the simplest path: no coding, no IDE, no jargon. Describe your change in plain English to an AI assistant, approve it, and your site updates automatically. Get to your first edit in about 20 minutes.',
  keywords:
    'edit charity website, nonprofit website owner, no-code website edit, Claude Desktop, AI website editing, Free For Charity, site owner, update my website',
  alternates: {
    canonical: 'https://ffcadmin.org/site-owner/',
  },
}

interface PageSection {
  id: string
  number: string
  title: string
  icon: string
}

const sections: PageSection[] = [
  { id: 'how-it-works', number: '1', title: 'How this works', icon: '💡' },
  { id: 'before-you-start', number: '2', title: 'Before you start', icon: '✅' },
  { id: 'first-edit', number: '3', title: 'Make your first edit', icon: '✏️' },
  { id: 'publish', number: '4', title: 'See your change and publish it', icon: '🚀' },
  { id: 'cookbook', number: '5', title: 'Common edits cookbook', icon: '📒' },
  { id: 'glossary', number: '6', title: 'Plain-language glossary', icon: '📖' },
  { id: 'help', number: '7', title: 'Good habits and getting help', icon: '🤝' },
]

const tldr = [
  {
    step: '1',
    title: 'Get access',
    body: 'Text FFC to be added to your repo as a writer, then accept the GitHub invite.',
  },
  {
    step: '2',
    title: 'Install your AI assistant',
    body: 'Download Claude Desktop, sign in, and connect it to GitHub once.',
  },
  {
    step: '3',
    title: 'Describe your change',
    body: 'Type what you want in plain English, e.g. “update our phone number.”',
  },
  {
    step: '4',
    title: 'Approve — it’s live',
    body: 'Read what the assistant changed, click approve, and your site updates in minutes.',
  },
]

const glossary = [
  {
    term: 'Repository (“repo”)',
    plain:
      'The folder that holds your website’s files. FFC created one just for your charity — think of it as your site’s home.',
  },
  {
    term: 'Branch',
    plain:
      'A safe scratch copy of your site where a change is drafted before it goes live. Your assistant makes one for you; you don’t have to think about it.',
  },
  {
    term: 'Pull request (“PR”)',
    plain:
      'The “here’s what I changed — okay to publish?” page. It shows the change side-by-side so you can read it and approve.',
  },
  {
    term: 'Merge',
    plain: 'Clicking “yes, publish this.” Once merged, your change goes out to your live site.',
  },
  {
    term: 'Checks',
    plain:
      'Quick automatic tests that confirm your site still builds correctly. A green check means it’s safe.',
  },
]

export default function SiteOwnerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Edit My Charity Website' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🌱
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Edit Your Charity&apos;s Website</h1>
              <p className="text-teal-50 text-sm mt-1">
                FFC built your site — here&apos;s how to make changes yourself, no coding required
              </p>
            </div>
          </div>
          <p className="text-teal-50 text-lg max-w-3xl">
            You founded a charity, FFC built you a website, and now you just want to keep it up to
            date. You don&apos;t need to be technical and you don&apos;t need to learn to code. You
            describe the change you want in plain English, an AI assistant makes it, you read it and
            approve, and your site updates on its own.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              No coding
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              ~20 minutes to your first edit
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              Works from your phone
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Reassurance banner */}
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded mb-8">
          <p className="text-emerald-900 text-sm">
            <strong>You can ignore the technical stuff.</strong> If you only want to edit your one
            charity site, you never need VS&nbsp;Code, Google Antigravity, Playwright, or anything
            you install and run on your computer. Those are for full-time developers. Everything on
            this page happens in a friendly chat window. The longer{' '}
            <Link
              href="/developer-environment-setup"
              className="text-emerald-900 underline font-medium"
            >
              developer setup pages
            </Link>{' '}
            are optional — come back to them only if you ever want to go deeper.
          </p>
        </div>

        {/* TL;DR */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ⚡
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">The whole thing in four steps</h2>
              <p className="text-gray-600">
                This is the entire process — the rest of the page just walks you through it
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tldr.map((t) => (
              <div key={t.step} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="w-9 h-9 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                  {t.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{t.title}</h3>
                <p className="text-sm text-gray-600">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TOC */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">On this page</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-2 rounded-lg hover:bg-teal-50 transition-colors group"
              >
                <span className="text-xl mr-3" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-teal-700">
                  <span className="text-teal-600 font-bold mr-1">{section.number}.</span>
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 1. How it works */}
        <section id="how-it-works" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              💡
            </span>
            <h2 className="text-2xl font-bold text-gray-900">1. How this works</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Your website lives in a <strong>repository</strong> — a folder of files that FFC set up
            for your charity from our standard template. You don&apos;t edit those files by hand.
            You tell an <strong>AI assistant</strong> what you want changed, in ordinary words, and
            it makes the edit for you. Then it shows you exactly what it did and waits for your
            approval before anything goes live.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-bold text-teal-800 mb-1 text-sm">You describe</h3>
              <p className="text-sm text-teal-900">
                “Change our phone number to 555-1234.” That&apos;s the whole skill you need.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-bold text-teal-800 mb-1 text-sm">The assistant does it</h3>
              <p className="text-sm text-teal-900">
                It finds the right spot, makes the change, and runs the safety checks for you.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="font-bold text-teal-800 mb-1 text-sm">You approve</h3>
              <p className="text-sm text-teal-900">
                Read what changed, click approve, and your site updates a few minutes later.
              </p>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>You are always in control.</strong> Nothing reaches your live website until
              you&apos;ve seen the change and said yes.
            </p>
          </div>
        </section>

        {/* 2. Before you start */}
        <section id="before-you-start" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ✅
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">2. Before you start</h2>
              <p className="text-gray-600">A one-time setup — about 15 minutes, done once</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 text-sm text-emerald-900">
            <strong>What FFC already did for you:</strong> we created a repository (the folder that
            holds your website) from our standard template and put your charity&apos;s site in it.
            You&apos;ll edit your own copy — you never touch the template, and you only ever deal
            with this one repository.
          </div>

          <ol className="space-y-5">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </span>
              <div>
                <h3 className="font-bold text-gray-900">Make a free GitHub account</h3>
                <p className="text-sm text-gray-700">
                  GitHub is the service that stores your website&apos;s files. If you don&apos;t
                  have an account yet, create a free one at{' '}
                  <a
                    href="https://github.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 underline hover:text-teal-900"
                  >
                    github.com/signup
                  </a>
                  . Use an email you check — your repository invitation comes here. Make a note of
                  your <strong>GitHub username</strong>; you&apos;ll share it in the next step.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </span>
              <div>
                <h3 className="font-bold text-gray-900">Request access to your repository</h3>
                <p className="text-sm text-gray-700">
                  FFC has to grant you access before you can edit anything. Text{' '}
                  <strong>Clarke Moyer at (520)&nbsp;222-8104</strong> (or message{' '}
                  <a
                    href="https://github.com/clarkemoyer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 underline hover:text-teal-900"
                  >
                    github.com/clarkemoyer
                  </a>
                  ) and ask to be added to your charity&apos;s repository as a{' '}
                  <strong>writer</strong> (write access). Include your charity&apos;s name, your{' '}
                  <strong>GitHub username</strong> from step&nbsp;1, and that you&apos;re the site
                  owner who&apos;ll be editing the site.
                </p>
                <div className="mt-2 bg-teal-50 border-l-4 border-teal-400 p-3 rounded text-xs text-teal-900">
                  <strong>Copy &amp; send:</strong> “Hi Clarke — this is &lt;your name&gt; from
                  &lt;charity name&gt;. Please add my GitHub username &lt;username&gt; as a writer
                  on our website repository so I can edit our site. Thank you!”
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </span>
              <div>
                <h3 className="font-bold text-gray-900">
                  Accept the invitation to your repository
                </h3>
                <p className="text-sm text-gray-700">
                  Once FFC adds you, you become a <strong>collaborator</strong> on your
                  charity&apos;s repository — just your one repo, nothing else. You&apos;ll get an
                  email titled something like “[your charity] invited you to collaborate” and a
                  notification on GitHub. Open it and click <strong>Accept invitation</strong>.
                  That&apos;s what gives you (and your assistant) permission to make changes.
                </p>
                <div className="mt-2 bg-amber-50 border-l-4 border-amber-400 p-3 rounded text-xs text-amber-900">
                  Didn&apos;t get an invite within a day, or the link expired? Text Clarke again at
                  (520)&nbsp;222-8104 and ask to re-send the writer invitation to your GitHub
                  username.
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </span>
              <div>
                <h3 className="font-bold text-gray-900">Install your AI assistant</h3>
                <p className="text-sm text-gray-700">
                  We recommend <strong>Claude Desktop</strong> on your computer and{' '}
                  <strong>Claude Mobile</strong> on your phone — it&apos;s the gentlest starting
                  point. Download it from{' '}
                  <a
                    href="https://claude.ai/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 underline hover:text-teal-900"
                  >
                    claude.ai/download
                  </a>{' '}
                  and sign in. Already pay for ChatGPT or another AI? You can use that instead — see
                  the{' '}
                  <Link
                    href="/developer-environment-setup"
                    className="text-teal-700 underline hover:text-teal-900"
                  >
                    full list of options
                  </Link>
                  .
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                5
              </span>
              <div>
                <h3 className="font-bold text-gray-900">Connect your assistant to GitHub (once)</h3>
                <p className="text-sm text-gray-700">
                  Your assistant needs a one-time connection to GitHub so it can see your
                  repository. The{' '}
                  <Link
                    href="/developer-environment-setup/claude-desktop"
                    className="text-teal-700 underline hover:text-teal-900"
                  >
                    Claude Desktop guide
                  </Link>{' '}
                  walks you through it — or just paste this and let the assistant set itself up:
                </p>
                <PromptBox accent="emerald" label="Paste this into your AI assistant">
                  &ldquo;I want to edit my charity&apos;s website, which lives in a GitHub
                  repository I was just added to. Set yourself up to work with GitHub: connect to it
                  and walk me through any sign-in. When you&apos;re ready, confirm you can see my
                  repository{' '}
                  <strong>
                    &lt;paste your repository address here, e.g. github.com/FreeForCharity/
                    your-charity&gt;
                  </strong>{' '}
                  and tell me what website is inside it.&rdquo;
                </PromptBox>
              </div>
            </li>
          </ol>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-900">
            <strong>You&apos;re set up when</strong> your assistant can tell you what&apos;s in your
            repository. From here on, you just describe changes — the rest of this page shows how.
          </div>
        </section>

        {/* 3. First edit */}
        <section id="first-edit" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ✏️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">3. Make your first edit</h2>
              <p className="text-gray-600">Let&apos;s change one small thing, start to finish</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            The best first edit is something small and safe — like fixing a typo or updating your
            phone number. Paste the prompt below into your assistant, filling in the blanks. It will
            make the change on a safe scratch copy and show you the result; behind the scenes it
            handles all the technical steps so you don&apos;t have to.
          </p>

          <PromptBox accent="emerald" label="Paste this — fill in the blanks">
            &ldquo;In my charity&apos;s website repository{' '}
            <strong>&lt;your repository address&gt;</strong>, please{' '}
            <strong>
              &lt;describe the change, e.g. update the phone number on the home page to
              (555)&nbsp;123-4567&gt;
            </strong>
            . Follow the conventions in the repository&apos;s <code>AGENTS.md</code> file, and use{' '}
            <strong>FreeForCharity/FFC-IN-ffcadmin.org</strong> as an example of a finished FFC site
            if you need one. Make the change on a new branch (don&apos;t publish to the live site
            yet), then show me exactly what you changed in plain language before we go
            further.&rdquo;
          </PromptBox>

          <div className="mt-6 space-y-4">
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Then: read what it changed</h3>
              <p className="text-sm text-gray-700">
                Your assistant will summarize the edit and can show you a before-and-after. If
                something looks off, just say so in plain English (“actually, make it bold too”) and
                it will adjust.
              </p>
            </div>
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="font-bold text-gray-900 mb-1">Then: approve it</h3>
              <p className="text-sm text-gray-700">
                When you&apos;re happy, tell the assistant to open it for review and approve it. On
                GitHub this appears as a <strong>pull request</strong> — but you can think of it
                simply as a <em>“here&apos;s the change, okay to publish?”</em> page. You read it
                and click approve.
              </p>
              <PromptBox accent="emerald" label="Paste this to publish">
                &ldquo;That looks good. Open this change for review (a pull request) with a clear
                title, then once the automatic checks pass, go ahead and publish it. Tell me when
                it&apos;s live.&rdquo;
              </PromptBox>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>That&apos;s the whole loop.</strong> Describe → read → approve. You did not
              open a code editor, type a command, or learn what a “branch” is — the assistant took
              care of all of it.
            </p>
          </div>
        </section>

        {/* 4. Publish */}
        <section id="publish" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🚀
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                4. See your change and publish it
              </h2>
              <p className="text-gray-600">“Did it work, and when will people see it?”</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Automatic checks run first</h3>
              <p className="text-sm text-gray-700">
                When your change is ready to publish, a few automatic checks run for a minute or two
                to make sure the site still builds correctly. You&apos;ll see them turn into a{' '}
                <strong className="text-green-700">green check</strong> when all is well — that
                means your change is safe to go live.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Want to preview before it&apos;s live?
              </h3>
              <p className="text-sm text-gray-700">
                Just ask your assistant to show you what the change will look like before you
                approve — it can describe the result or walk you through it. (Your site publishes
                straight from approval, so the surest “preview” is to have the assistant show you
                the before-and-after first.)
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">After you approve</h3>
              <p className="text-sm text-gray-700">
                Once you approve and the checks are green, your change publishes automatically and
                your live site updates in <strong>a few minutes</strong>. Refresh your website in
                your browser to see it. (If it doesn&apos;t show right away, wait a couple of
                minutes and refresh again — browsers sometimes hold an old copy.)
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">If a check fails</h3>
              <p className="text-sm text-gray-700">
                Don&apos;t worry — nothing went live. Your assistant can read the failure and fix
                it. Just say:
              </p>
              <PromptBox accent="emerald" label="Paste this if a check is red">
                &ldquo;One of the checks failed. Please read the error, fix the problem, and let me
                know what it was in plain language.&rdquo;
              </PromptBox>
            </div>
          </div>
        </section>

        {/* 5. Cookbook link */}
        <section id="cookbook" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              📒
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">5. Common edits cookbook</h2>
              <p className="text-gray-600">
                Ready-to-paste prompts for the changes you&apos;ll make most
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">
            Once you&apos;ve done your first edit, the cookbook is your quick reference for everyday
            updates — contact info, hours, photos, the donate button, and recurring posts like a
            blog, a newsletter, or board-meeting minutes. Each one is a friendly prompt you copy,
            fill in, and hand to your assistant.
          </p>
          <Link
            href="/site-owner/common-edits"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Open the Common Edits Cookbook
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        {/* 6. Glossary */}
        <section id="glossary" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              📖
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">6. Plain-language glossary</h2>
              <p className="text-gray-600">
                The few GitHub words you might see — in one friendly sentence each
              </p>
            </div>
          </div>
          <dl className="space-y-4">
            {glossary.map((g) => (
              <div key={g.term} className="border-l-4 border-teal-200 pl-4">
                <dt className="font-bold text-gray-900">{g.term}</dt>
                <dd className="text-sm text-gray-700">{g.plain}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-900">
            Good news: your assistant handles every one of these for you. You really only need the
            first one — <strong>repository</strong> — to get started.
          </div>
        </section>

        {/* 7. Help */}
        <section id="help" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🤝
            </span>
            <h2 className="text-2xl font-bold text-gray-900">7. Good habits and getting help</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-teal-600 mr-2 mt-0.5">&#10003;</span>
              <span>
                <strong>Always read the change before approving.</strong> You&apos;re the human in
                the loop — a quick read is all it takes.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2 mt-0.5">&#10003;</span>
              <span>
                <strong>Make one change at a time</strong> when you&apos;re learning. It keeps each
                approval simple.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 mt-0.5">&#10005;</span>
              <span>
                <strong>Never paste passwords or secret keys</strong> into the chat, your site, or
                GitHub. Your assistant never needs them in a message.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2 mt-0.5">&#10003;</span>
              <span>
                <strong>Stuck?</strong> Ask your assistant to explain in simpler terms, or email
                your FFC contact — we&apos;re happy to help.
              </span>
            </li>
          </ul>
        </section>

        {/* Footer nav */}
        <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Where to next</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link
                href="/site-owner/training"
                className="text-teal-700 underline hover:text-teal-900"
              >
                Site Owner Training
              </Link>
              <span className="text-gray-500">
                {' '}
                &mdash; everything you&apos;re responsible for (domain, email, security &amp; more)
              </span>
            </li>
            <li>
              <Link
                href="/site-owner/common-edits"
                className="text-teal-700 underline hover:text-teal-900"
              >
                Common Edits Cookbook
              </Link>
              <span className="text-gray-500"> &mdash; prompts for everyday updates</span>
            </li>
            <li>
              <Link
                href="/developer-environment-setup/claude-desktop"
                className="text-teal-700 underline hover:text-teal-900"
              >
                Claude Desktop setup guide
              </Link>
              <span className="text-gray-500"> &mdash; the connection details, step by step</span>
            </li>
            <li>
              <Link href="/get-involved" className="text-teal-700 underline hover:text-teal-900">
                Want to help FFC more broadly?
              </Link>
              <span className="text-gray-500"> &mdash; the volunteer tracks</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
