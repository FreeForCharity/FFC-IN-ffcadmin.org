import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Become a Sponsoring Admin',
  description:
    'Sponsoring admins are verified FFC volunteers who steward a charity site through build and ongoing maintenance. Learn the prerequisites, the commitment, capacity guidance, and how to claim a site.',
  keywords:
    'FFC sponsoring admin, volunteer verification, charity site sponsorship, sponsoring-admins team, FFC volunteer commitment',
  alternates: { canonical: 'https://ffcadmin.org/roadmap/sponsor/' },
}

const COMMITMENTS = [
  'Actively coordinating with the charity through the build phase — responding within 3 business days during active build and within 7 business days during ongoing maintenance.',
  'Maintaining the site post-launch, including security updates, link-rot fixes, and content updates the charity requests.',
  'Escalating to FFC central via the public escalation channel or the private coordination repo when issues exceed my scope or judgment.',
  'Operating within FFC’s prioritization policy and code of conduct.',
  'Not soliciting the charity’s contacts for unrelated commercial purposes.',
  'Treating information shared in the coordination repo as confidential to the FFC community.',
  'Requesting reassignment promptly if circumstances change rather than going silent.',
  'Maintaining no more than 3 concurrent active sponsorships unless explicitly approved by FFC leadership.',
]

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Roadmap', href: '/roadmap' },
          { label: 'Become a sponsoring admin' },
        ]}
      />

      <div className="bg-ffc-gradient text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold md:text-4xl">Become a sponsoring admin</h1>
          <p className="mt-3 max-w-2xl text-lg text-teal-50">
            Sponsorship is a real, public commitment — not a casual claim. Verified admins are
            publicly on the hook for the charity they steward, which creates both accountability and
            recognition.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900">What sponsorship is</h2>
          <p className="mt-2 text-gray-700">
            A sponsoring admin accepts public responsibility for stewarding one FFC charity site
            through its build and ongoing maintenance. Sponsorship is the gating mechanism for
            provisioning: a site cannot move from <em>needs a sponsoring admin</em> to{' '}
            <em>active build</em> without an assigned, verified sponsor.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Prerequisites</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-gray-700">
            <li>
              Complete the FFC Microsoft 365 Global Admin training (see the{' '}
              <Link href="/training-plan" className="text-blue-600 hover:underline">
                training plan
              </Link>
              ).
            </li>
            <li>Have a verification conversation with FFC (text 520-222-8104).</li>
            <li>
              Be added to the <code>sponsoring-admins</code> GitHub team in the FreeForCharity org —
              team membership is the verification artifact.
            </li>
            <li>Be granted access to the private coordination repo for admin coordination.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">How to claim a site</h2>
          <p className="mt-2 text-gray-700">
            Browse the{' '}
            <Link href="/roadmap#needs-admin" className="text-blue-600 hover:underline">
              “Needs a sponsoring admin”
            </Link>{' '}
            queue, comment on the issue for the charity you want to sponsor, and FFC assigns you. An
            automated check confirms your <code>sponsoring-admins</code> membership before any
            provisioning is triggered — accidental assignments are reverted automatically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">Capacity & stepping back</h2>
          <p className="mt-2 text-gray-700">
            We recommend a maximum of <strong>3 concurrent active sponsorships</strong> (one in
            active build, others in maintenance). You can step back any time by commenting on your
            assigned issue and requesting reassignment — the site returns to the pool. This is
            normal; admins should never feel locked in.
          </p>
        </section>

        <section>
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <strong>Draft — pending FFC leadership approval.</strong> The commitment wording below
            is proposed and not yet ratified. It will be finalized before sponsoring-admin
            onboarding opens publicly.
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">The commitment</h2>
          <p className="mt-2 text-gray-700">
            By accepting assignment as a sponsoring admin for an FFC charity site, I commit to:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-700">
            {COMMITMENTS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900">What gets escalated</h2>
          <p className="mt-2 text-gray-700">
            DNS, infrastructure, scope, and policy questions are handled publicly in this repo.
            Security, abuse, charity disputes, and anything sensitive go to the private coordination
            repo or directly to FFC central — never in a public issue. See{' '}
            <Link href="/roadmap/submit" className="text-blue-600 hover:underline">
              Submit a request
            </Link>{' '}
            for the escalation paths.
          </p>
        </section>
      </main>
    </div>
  )
}
