import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'MOVSM for Military Volunteers',
  description:
    'The Military Outstanding Volunteer Service Medal (MOVSM) recognizes service members for sustained volunteer work. Learn how volunteering with Free For Charity can build qualifying, board-attested service — and how to get started.',
  keywords:
    'MOVSM, Military Outstanding Volunteer Service Medal, military volunteer, service member volunteer, veteran volunteer nonprofit, qualifying volunteer hours military, volunteer service medal eligibility',
  alternates: {
    canonical: 'https://ffcadmin.org/movsm/',
  },
}

const eligibility = [
  'Service to the civilian community (outside the member’s normal military duties).',
  'Significant in nature, producing tangible results that benefit the community.',
  'Reflects favorably on the member, the military, and the Department of Defense.',
  'Sustained and direct — a meaningful commitment over time, not a one-off event.',
]

const steps = [
  {
    n: '1',
    title: 'Volunteer in any FFC role',
    body: 'Contribute as a web developer, Microsoft 365 or Google Workspace admin, data/analytics volunteer, or designer. Remote and flexible — fit it around your duty schedule.',
  },
  {
    n: '2',
    title: 'Build a record of your service',
    body: 'Your merged work shows up in GitHub commit history, and FFC logs the charities you support. Together these document sustained, tangible community service.',
  },
  {
    n: '3',
    title: 'Get your hours attested',
    body: 'Qualifying hours use self-report plus charity-board attestation — the same evidence model as our volunteer recognition badges. FFC certifies the volunteer relationship.',
  },
  {
    n: '4',
    title: 'Apply through your command',
    body: 'MOVSM is awarded by your chain of command. Take your attested service record to your awarding authority; FFC can provide a letter confirming your contributions.',
  },
]

export default function MovsmPage() {
  const faqs = [
    {
      question: 'What is the MOVSM?',
      answer:
        'The Military Outstanding Volunteer Service Medal is a U.S. military decoration that recognizes members of the Armed Forces for sustained, significant volunteer service to the civilian community above and beyond their normal duties.',
    },
    {
      question: 'How does volunteering with FFC help me qualify?',
      answer:
        'FFC volunteer work is community service that produces tangible results for 501(c)(3) nonprofits. It is remote, flexible, and sustained over time — and FFC can attest to the volunteer relationship and the impact of your contributions.',
    },
    {
      question: 'How are my volunteer hours validated?',
      answer:
        'Through self-report plus charity-board attestation — the same evidence model as the FFC volunteer recognition system. Your GitHub commit history provides an independent, tamper-evident record of the work you did.',
    },
    {
      question: 'Who actually awards the MOVSM?',
      answer:
        'The medal is awarded through your military chain of command / awarding authority, not by FFC. FFC documents and certifies your volunteer service so you can present it as part of your application.',
    },
  ]

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Volunteer', href: '/volunteer' },
          { label: 'MOVSM' },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🎖️
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Military Outstanding Volunteer Service Medal
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                Serve your community through FFC — and earn recognition for it
              </p>
            </div>
          </div>
          <p className="text-slate-200 text-lg max-w-3xl">
            The MOVSM recognizes service members for sustained, significant volunteer work in the
            civilian community. Volunteering with Free For Charity is a flexible, remote way to
            build a documented record of qualifying service.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* DRAFT banner */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded mb-8 text-sm text-amber-900">
          <strong>DRAFT — pending legal/command review.</strong> The eligibility summary below is
          drafted from publicly available MOVSM criteria plus FFC&apos;s volunteer process. It is
          informational only and is <strong>not</strong> an official determination. Eligibility and
          award decisions rest entirely with your military chain of command / awarding authority.
        </div>

        {/* Eligibility */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility at a glance</h2>
          <p className="text-sm text-gray-700 mb-4">
            Public criteria describe qualifying volunteer service as meeting all of the following:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            {eligibility.map((e) => (
              <li key={e} className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            There is no single federally fixed hour threshold; the level of service required is
            determined by the awarding authority. Confirm current criteria with your command.
          </p>
        </section>

        {/* How FFC volunteering qualifies */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How volunteering with FFC builds qualifying service
          </h2>
          <div className="space-y-5">
            {steps.map((s) => (
              <div key={s.n} className="flex items-start">
                <div className="flex-shrink-0 w-9 h-9 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-700">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recognition tie-in */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Recognition tie-in</h2>
          <p className="text-sm text-gray-700">
            Your qualifying contributions also count toward FFC&apos;s{' '}
            <Link href="/recognition" className="text-blue-600 underline hover:text-blue-800">
              volunteer recognition badges
            </Link>
            , which use the same self-report + board-attestation evidence model. As you grow through
            the tiers, you build both community standing and a documented service record for your
            MOVSM application.
          </p>
          <p className="text-sm text-gray-700 mt-3">
            You can also earn{' '}
            <Link
              href="/continuing-education"
              className="text-blue-600 underline hover:text-blue-800"
            >
              continuing-education (CE) credit
            </Link>{' '}
            for these same hours toward certifications like CompTIA, PMI, and ISC2.
          </p>
        </section>

        {/* Get started */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get started</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <a
              href="sms:520-222-8104"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm"
            >
              Text FFC to get started
            </a>
            <Link
              href="/volunteer/military-volunteers"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-white transition-colors text-sm"
            >
              See military volunteer roles
            </Link>
          </div>
          <p className="text-sm text-gray-700">
            New here? Text <strong>Clarke Moyer at (520) 222-8104</strong> to become a volunteer.
            Already active? Collaborate with the team in <strong>Microsoft Teams</strong>. Many
            volunteers also find us through{' '}
            <a
              href="https://taprootfoundation.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Taproot
            </a>
            ,{' '}
            <a
              href="https://www.volunteermatch.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              VolunteerMatch
            </a>
            , and{' '}
            <a
              href="https://www.idealist.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Idealist
            </a>
            .
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
          <div className="space-y-5">
            {faqs.map((f) => (
              <div
                key={f.question}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <h3 className="text-base font-bold text-gray-900 mb-1">{f.question}</h3>
                <p className="text-sm text-gray-700">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
