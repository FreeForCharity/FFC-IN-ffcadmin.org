import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  SUPPORTED_CE_BODIES,
  UNSUPPORTED_CE_BODIES,
  CE_LANDING_BODIES,
  CHANNEL_LABELS,
  CE_DISCLAIMER,
  type CreditChannel,
  type ChannelSupport,
} from '@/data/ce-bodies'

export const metadata: Metadata = {
  title: 'Continuing Education (CE) by Volunteering',
  description:
    'Free For Charity certifies the hours you spend volunteering and training so you can self-report continuing-education credit toward CompTIA, PMI, ISC2, ISACA, CFRE, GIAC, and EC-Council — for free.',
  keywords:
    'continuing education volunteering, free CE credits, CPE PDU CEU volunteering, renew certification without paying, nonprofit continuing education, FFC continuing education',
  alternates: {
    canonical: 'https://ffcadmin.org/continuing-education/',
  },
}

const channels: { id: CreditChannel; icon: string; blurb: string }[] = [
  {
    id: 'education',
    icon: '📚',
    blurb:
      'Complete FFC training modules. Education is uncapped (or nearly so) at almost every body — the cleanest, highest-yield channel.',
  },
  {
    id: 'teaching',
    icon: '🧑‍🏫',
    blurb:
      'Teach or mentor others, or author a training module. Widely credited and often bonus-weighted (ISACA 5×, CFRE 3 pts/hr for new material).',
  },
  {
    id: 'work',
    icon: '🛠️',
    blurb:
      'Domain-relevant volunteer work — building, securing, or administering charity systems — counted against each body’s relevance test and caps.',
  },
]

const SUPPORT_STYLE: Record<ChannelSupport, { label: string; chip: string }> = {
  yes: { label: 'Yes', chip: 'bg-green-100 text-green-800' },
  limited: { label: 'Limited', chip: 'bg-yellow-100 text-yellow-800' },
  no: { label: 'No', chip: 'bg-gray-100 text-gray-500' },
}

export default function ContinuingEducationPage() {
  const channelOrder: CreditChannel[] = ['education', 'teaching', 'work']

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I earn continuing-education credit by volunteering with FFC?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. FFC certifies the hours you spend training and doing domain-relevant volunteer work so you can self-report them to your certifying body. Acceptance is governed by that body’s rules.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which certifications are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'CompTIA (CEUs), PMI (PDUs), ISC2 (CPEs), ISACA (CPEs), CFRE (points), GIAC (CPEs), and EC-Council (ECE). Microsoft, Google Cloud, and AWS do not use a CE-hours model and are not supported.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does generic charity volunteering count?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Usually not. Most IT/security bodies only credit volunteering that is relevant to the credential’s profession. CompTIA credits no volunteering. Only CFRE credits general volunteer service, and caps it.',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Continuing Education' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🎓
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Continuing Education by Volunteering
              </h1>
              <p className="text-teal-50 text-sm mt-1">
                Turn the hours you give into credit toward your certification — for free
              </p>
            </div>
          </div>
          <p className="text-teal-50 text-lg max-w-3xl">
            Free For Charity certifies the hours you spend training and doing domain-relevant
            volunteer work, so you can self-report continuing-education credit toward your
            professional certification. It&apos;s a designation layered on the volunteer tracks —
            like the{' '}
            <Link href="/movsm" className="underline">
              MOVSM
            </Link>{' '}
            for military volunteers.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Three channels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Three ways your hours count</h2>
          <p className="text-gray-600 text-sm mb-6">
            CE value flows through three channels, in priority order. The right mix depends on your
            certifying body&apos;s rules below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="text-3xl mb-2" aria-hidden="true">
                  {c.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{CHANNEL_LABELS[c.id]}</h3>
                <p className="text-sm text-gray-600">{c.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Per-body support matrix */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Which certifications are supported
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Per-body support and caps, from each body&apos;s published rules. Figures change —
            always confirm against the official source linked in each row.
          </p>
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-900">Body</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Unit</th>
                  {channelOrder.map((ch) => (
                    <th key={ch} className="text-center p-3 font-semibold text-gray-900">
                      {CHANNEL_LABELS[ch]}
                    </th>
                  ))}
                  <th className="text-left p-3 font-semibold text-gray-900">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SUPPORTED_CE_BODIES.map((b) => (
                  <tr key={b.slug}>
                    <td className="p-3">
                      {b.landing ? (
                        <Link
                          href={`/continuing-education/${b.landing.slug}`}
                          className="font-semibold text-blue-700 hover:text-blue-900"
                        >
                          {b.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-gray-900">{b.name}</span>
                      )}
                      <span className="block text-xs text-gray-500">{b.certs.join(', ')}</span>
                    </td>
                    <td className="p-3 text-gray-700">{b.unit}</td>
                    {channelOrder.map((ch) => {
                      const s = SUPPORT_STYLE[b.channels[ch].support]
                      return (
                        <td key={ch} className="p-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.chip}`}
                            title={b.channels[ch].note}
                          >
                            {s.label}
                          </span>
                        </td>
                      )
                    })}
                    <td className="p-3">
                      <a
                        href={b.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800 text-xs"
                      >
                        Official
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Not supported */}
        <section className="mb-12 bg-amber-50 border-l-4 border-amber-500 rounded p-5">
          <h2 className="text-lg font-bold text-amber-900 mb-2">
            Not supported (no CE-hours model)
          </h2>
          <ul className="space-y-1 text-sm text-amber-900/90">
            {UNSUPPORTED_CE_BODIES.map((b) => (
              <li key={b.slug}>
                <strong>{b.name}:</strong> {b.unsupportedReason}{' '}
                <a
                  href={b.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  (source)
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* How to claim */}
        <section className="mb-12 bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to claim your credit</h2>
          <ol className="space-y-3 text-sm text-gray-700 list-decimal pl-5">
            <li>
              Volunteer and train through the{' '}
              <Link href="/volunteer" className="text-blue-600 underline hover:text-blue-800">
                FFC volunteer tracks
              </Link>{' '}
              — your work and completed modules build hours.
            </li>
            <li>
              Your hours are validated (GitHub commit history + mentor/board certification — the
              same model as{' '}
              <Link href="/recognition" className="text-blue-600 underline hover:text-blue-800">
                recognition badges
              </Link>
              ).
            </li>
            <li>Request your FFC documentation — a certified record of hours and activities.</li>
            <li>Self-report those hours to your certifying body under its current rules.</li>
          </ol>
          <p className="mt-4 text-xs text-gray-500">{CE_DISCLAIMER}</p>
        </section>

        {/* Per-cert landing links */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Per-certification guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CE_LANDING_BODIES.map((b) => (
              <Link
                key={b.slug}
                href={`/continuing-education/${b.landing!.slug}`}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-semibold text-gray-900">{b.name}</span>
                <span className="text-xs text-gray-500">{b.certs.join(', ')}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* MOVSM cross-link */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Military volunteer? You may also qualify for the MOVSM
          </h2>
          <p className="text-sm text-gray-700">
            The same hours that earn CE credit can count toward the{' '}
            <Link href="/movsm" className="text-blue-600 underline hover:text-blue-800">
              Military Outstanding Volunteer Service Medal
            </Link>{' '}
            — another designation you earn by giving your time to a nonprofit.
          </p>
        </section>
      </main>
    </div>
  )
}
