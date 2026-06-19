import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Accept Your GitHub Repository Invitation',
  description:
    'The exact, every-click walkthrough for accepting the GitHub invitation to your charity’s website repository: what the email looks like, who it’s from, where to find it if it’s not in your inbox, and the two other ways to accept it if the email never arrives.',
  keywords:
    'accept GitHub invitation, GitHub repository invite, collaborate invitation, github.com/notifications, accept invite GitHub charity, FreeForCharity onboarding',
  alternates: { canonical: 'https://ffcadmin.org/site-owner/accept-invitation/' },
}

const EXAMPLE_REPO = 'FreeForCharity/FFC-EX-yourcharity.org'

/** A faithful, illustration-only reproduction of the GitHub invitation email. */
function EmailMock() {
  return (
    <figure className="my-4">
      <div className="mx-auto max-w-xl rounded-xl border border-gray-300 shadow-sm overflow-hidden bg-white">
        {/* Email header rows */}
        <div className="border-b border-gray-200 p-4 text-sm">
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">GitHub</p>
              <p className="text-gray-500 text-xs">
                &lt;notifications@github.com&gt; <span className="text-gray-400">to you</span>
              </p>
            </div>
          </div>
          <p className="mt-3 font-bold text-gray-900">
            [FreeForCharity] @clarkemoyer invited you to collaborate
          </p>
        </div>
        {/* Email body */}
        <div className="p-5 text-sm text-gray-700">
          <p className="mb-4">
            <strong>@clarkemoyer</strong> has invited you to collaborate on the{' '}
            <strong>{EXAMPLE_REPO}</strong> repository.
          </p>
          <div className="text-center my-5">
            <span className="inline-block bg-[#2da44e] text-white font-semibold text-sm px-4 py-2 rounded-md">
              View invitation
            </span>
          </div>
          <p className="text-xs text-gray-400">
            You can also copy this URL: github.com/{EXAMPLE_REPO}/invitations
          </p>
        </div>
      </div>
      <figcaption className="text-center text-xs text-gray-400 mt-2">
        Illustration of the email you&apos;ll receive — your repository name will be your
        charity&apos;s.
      </figcaption>
    </figure>
  )
}

/** A faithful, illustration-only reproduction of the on-repo invitation banner. */
function BannerMock() {
  return (
    <figure className="my-4">
      <div className="mx-auto max-w-2xl rounded-xl border border-gray-300 shadow-sm overflow-hidden">
        {/* Fake browser address bar */}
        <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2">
          <span className="flex gap-1" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </span>
          <span className="ml-2 flex-1 truncate rounded bg-white border border-gray-200 px-2 py-0.5 text-xs text-gray-500">
            github.com/{EXAMPLE_REPO}
          </span>
        </div>
        {/* Invitation banner */}
        <div className="bg-white p-5">
          <div className="rounded-md border border-[#d0d7de] bg-[#ddf4ff] p-4 text-sm text-gray-800">
            <p className="mb-3">
              You&apos;ve been invited to collaborate on the <strong>{EXAMPLE_REPO}</strong>{' '}
              repository.
            </p>
            <div className="flex gap-2">
              <span className="inline-block bg-[#2da44e] text-white font-semibold text-xs px-3 py-1.5 rounded-md">
                Accept invitation
              </span>
              <span className="inline-block bg-white border border-gray-300 text-gray-700 font-semibold text-xs px-3 py-1.5 rounded-md">
                Decline
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="text-center text-xs text-gray-400 mt-2">
        Illustration of the green banner at the top of your repository page.
      </figcaption>
    </figure>
  )
}

function Route({
  letter,
  title,
  subtitle,
  children,
}: {
  letter: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
          {letter}
        </span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function AcceptInvitationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Edit My Charity Website', href: '/site-owner' },
          { label: 'Accept your repository invitation' },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl" aria-hidden="true">
              📨
            </span>
            <h1 className="text-3xl md:text-4xl font-bold">Accept your repository invitation</h1>
          </div>
          <p className="text-white/90">
            This is the step that trips everyone up, so we&apos;re going to be extremely precise.
            After you send FFC your GitHub username, we send you an invitation to your
            charity&apos;s repository. You have to accept it once before you can edit anything. Here
            is exactly what it looks like, who it&apos;s from, and three different ways to accept
            it.
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Where you are */}
        <p className="text-sm text-gray-500">
          You are on <strong className="text-gray-700">step 4</strong> of the{' '}
          <Link href="/site-owner" className="text-teal-700 underline hover:text-teal-900">
            complete site-owner path
          </Link>
          : ① GitHub account → ② turn on MFA → ③ send FFC your username →{' '}
          <strong className="text-gray-700">④ accept the invitation</strong> → ⑤ set up your
          assistant.
        </p>

        {/* The big idea */}
        <section className="bg-blue-50 border-l-4 border-blue-500 rounded p-5">
          <h2 className="text-base font-bold text-blue-900 mb-2">
            The one thing to understand first
          </h2>
          <p className="text-sm text-blue-900/90 mb-2">
            Your invitation shows up in <strong>two places at the same time</strong>, and you only
            need to use <em>one</em> of them:
          </p>
          <ol className="text-sm text-blue-900/90 list-decimal pl-5 space-y-1">
            <li>An email from GitHub, and</li>
            <li>A green banner on your repository&apos;s page when you&apos;re logged in.</li>
          </ol>
          <p className="text-sm text-blue-900/90 mt-2">
            <strong>Important:</strong> a repository invitation usually does <strong>not</strong>{' '}
            appear at{' '}
            <a
              href="https://github.com/notifications"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              github.com/notifications
            </a>
            . That bell is for other things. If you went there and it was empty, you weren&apos;t
            doing anything wrong — you were just looking in the one spot it doesn&apos;t show. Use
            Route&nbsp;A or Route&nbsp;B below instead.
          </p>
        </section>

        {/* Step 0: right account */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-amber-900 mb-2">
            <span aria-hidden="true">⚠️ </span>Before anything else: are you signed in as the right
            person?
          </h2>
          <p className="text-sm text-amber-900/90 mb-3">
            The #1 reason an invitation seems &ldquo;missing&rdquo; is being logged into a{' '}
            <strong>different GitHub account</strong> than the username you gave FFC (for example,
            an old personal account, or a second account on a shared computer). The invite was sent
            to one specific username — you must be signed in as that exact person to see it.
          </p>
          <p className="text-sm text-amber-900/90">
            Check it: open{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              github.com
            </a>
            , look at the <strong>circular profile picture in the very top-right corner</strong>,
            and click it. The username shown at the top of that menu must match the one you sent
            FFC. If it doesn&apos;t, sign out and sign back in as the correct account.
          </p>
        </section>

        {/* Routes */}
        <h2 className="text-2xl font-bold text-gray-900">Three ways to accept — pick any one</h2>

        <Route
          letter="A"
          title="Accept from the email"
          subtitle="The easiest way, if you can find the email"
        >
          <p className="text-sm text-gray-700 mb-1">Look for an email that looks like this:</p>
          <ul className="text-sm text-gray-700 list-disc pl-5 mb-2 space-y-1">
            <li>
              <strong>From:</strong> GitHub &lt;notifications@github.com&gt; (the sender name is
              just &ldquo;GitHub&rdquo;)
            </li>
            <li>
              <strong>Subject:</strong> &ldquo;[FreeForCharity] @clarkemoyer invited you to
              collaborate&rdquo;
            </li>
          </ul>
          <EmailMock />
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-900 mb-3">
            <strong>Can&apos;t find it?</strong> It is very often <strong>not</strong> in your main
            inbox. Check these, in order:
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              <li>
                Gmail: the <strong>Promotions</strong> and <strong>Updates</strong> tabs, then{' '}
                <strong>Spam</strong>.
              </li>
              <li>
                Outlook: the <strong>Other</strong> tab and the <strong>Junk</strong> folder.
              </li>
              <li>
                Search your email for the word <strong>invited</strong> or <strong>github</strong>.
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-700">
            When you find it, click the green <strong>View invitation</strong> button. It opens
            GitHub in your browser and shows the green <strong>Accept invitation</strong> button —
            click that. Done.
          </p>
        </Route>

        <Route
          letter="B"
          title="Accept from your repository page"
          subtitle="The most reliable way — works even if the email never arrives"
        >
          <p className="text-sm text-gray-700 mb-2">
            FFC will give you your repository&apos;s web address. It looks like this (yours will
            have your charity&apos;s name):
          </p>
          <p className="text-sm font-mono bg-gray-100 rounded p-2 mb-3 break-all">
            https://github.com/{EXAMPLE_REPO}
          </p>
          <p className="text-sm text-gray-700 mb-1">
            Make sure you&apos;re signed in (see the warning above), then open that address. At the
            top of the page you&apos;ll see a banner inviting you to collaborate. Click the green{' '}
            <strong>Accept invitation</strong> button.
          </p>
          <BannerMock />
          <p className="text-sm text-gray-700">
            If the banner doesn&apos;t appear, add <strong>/invitations</strong> to the end of the
            address and open{' '}
            <span className="font-mono break-all">
              https://github.com/{EXAMPLE_REPO}/invitations
            </span>{' '}
            — the accept button lives there too.
          </p>
        </Route>

        <Route
          letter="C"
          title="Let FFC walk you through it live"
          subtitle="When you just want a human on the line"
        >
          <p className="text-sm text-gray-700">
            No shame in this — it takes two minutes together. Text <strong>Clarke Moyer</strong> at{' '}
            <a href="sms:520-222-8104" className="text-teal-700 underline hover:text-teal-900">
              (520)&nbsp;222-8104
            </a>{' '}
            and say you&apos;re ready to accept your repository invitation. He can re-send it and
            stay on the phone while you click <strong>Accept</strong>.
          </p>
        </Route>

        {/* What success looks like */}
        <section className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-green-900 mb-2">How you know it worked</h2>
          <p className="text-sm text-green-900/90">
            After you click <strong>Accept invitation</strong>, the banner disappears and you land
            on your repository&apos;s normal page — a list of files and folders. That&apos;s it:
            you&apos;re now a <strong>collaborator</strong> and you (and your AI assistant) can make
            changes. You never have to accept again.
          </p>
        </section>

        {/* Troubleshooting */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            If something still isn&apos;t right
          </h2>
          <dl className="space-y-4 text-sm">
            <div className="border-l-4 border-gray-200 pl-4">
              <dt className="font-bold text-gray-900">
                &ldquo;This invitation has expired&rdquo; or the link does nothing
              </dt>
              <dd className="text-gray-700">
                Invitations expire after 7 days. Text Clarke at (520)&nbsp;222-8104 and ask him to
                re-send the invitation to your GitHub username — it arrives again within minutes.
              </dd>
            </div>
            <div className="border-l-4 border-gray-200 pl-4">
              <dt className="font-bold text-gray-900">I clicked Decline by accident</dt>
              <dd className="text-gray-700">
                No problem and nothing is broken — the invitation just needs to be sent again. Text
                Clarke and he&apos;ll re-send it.
              </dd>
            </div>
            <div className="border-l-4 border-gray-200 pl-4">
              <dt className="font-bold text-gray-900">
                The repository page says &ldquo;404&rdquo; / &ldquo;not found&rdquo;
              </dt>
              <dd className="text-gray-700">
                That almost always means you&apos;re signed out or signed in as the wrong account
                (the repo is private until you accept). Re-check the top-right profile picture, then
                reload the page.
              </dd>
            </div>
            <div className="border-l-4 border-gray-200 pl-4">
              <dt className="font-bold text-gray-900">I never gave FFC my username</dt>
              <dd className="text-gray-700">
                That&apos;s step 3 — no invitation can be sent until you do. Text Clarke your{' '}
                <strong>GitHub username</strong> (the name under your top-right profile picture) and
                your charity&apos;s name, and the invite will follow.
              </dd>
            </div>
          </dl>
        </section>

        {/* Next */}
        <section className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            You&apos;re in — what&apos;s next
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            Now set up the AI assistant that actually makes your edits, then make your first change.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/site-owner#before-you-start"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Next: set up your assistant →
            </Link>
            <Link
              href="/site-owner"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              Back to the full path
            </Link>
          </div>
        </section>

        {/* Support */}
        <p className="text-sm text-gray-600">
          Stuck on any step? Text Clarke Moyer at{' '}
          <a href="sms:520-222-8104" className="text-teal-700 underline hover:text-teal-900">
            (520)&nbsp;222-8104
          </a>
          . This step is genuinely the hardest part of the whole process — once you&apos;re past it,
          editing your site is easy.
        </p>
      </main>
    </div>
  )
}
