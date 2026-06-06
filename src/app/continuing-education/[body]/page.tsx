import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  CE_LANDING_BODIES,
  getCeBodyByLandingSlug,
  CHANNEL_LABELS,
  CE_DISCLAIMER,
  type CreditChannel,
  type ChannelSupport,
} from '@/data/ce-bodies'

export function generateStaticParams() {
  return CE_LANDING_BODIES.map((b) => ({ body: b.landing!.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ body: string }>
}): Promise<Metadata> {
  const { body: slug } = await params
  const body = getCeBodyByLandingSlug(slug)
  if (!body?.landing) return {}
  return {
    title: body.landing.title,
    description: body.landing.description,
    keywords: body.landing.keywords,
    alternates: { canonical: `https://ffcadmin.org/continuing-education/${body.landing.slug}/` },
  }
}

const SUPPORT_STYLE: Record<ChannelSupport, { label: string; chip: string }> = {
  yes: { label: 'Counts', chip: 'bg-green-100 text-green-800' },
  limited: { label: 'Limited', chip: 'bg-yellow-100 text-yellow-800' },
  no: { label: 'Does not count', chip: 'bg-gray-100 text-gray-500' },
}

export default async function CeBodyLandingPage({ params }: { params: Promise<{ body: string }> }) {
  const { body: slug } = await params
  const body = getCeBodyByLandingSlug(slug)
  if (!body?.landing) return null

  const channelOrder: CreditChannel[] = ['education', 'teaching', 'work']

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Can I earn free ${body.unitPlural} for ${body.name} by volunteering?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${body.landing.description}`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the ${body.name} recertification cycle?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${body.total}.${body.annualMin ? ' ' + body.annualMin + '.' : ''}`,
        },
      },
      {
        '@type': 'Question',
        name: `Does FFC guarantee ${body.name} will accept these hours?`,
        acceptedAnswer: { '@type': 'Answer', text: CE_DISCLAIMER },
      },
    ],
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
          { label: 'Continuing Education', href: '/continuing-education' },
          { label: body.name },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{body.landing.title}</h1>
          <p className="text-teal-50 text-lg max-w-3xl">{body.landing.description}</p>
          <div className="mt-5 inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-lg text-sm">
            <span aria-hidden="true">💸</span>
            {body.landing.costContrast}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cycle facts */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {body.name} recertification at a glance
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="font-semibold text-gray-900">Credit unit</dt>
              <dd className="text-gray-700">{body.unitPlural}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Cycle</dt>
              <dd className="text-gray-700">{body.cycleYears} years</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold text-gray-900">Requirement</dt>
              <dd className="text-gray-700">{body.total}</dd>
            </div>
            {body.annualMin && (
              <div className="sm:col-span-2">
                <dt className="font-semibold text-gray-900">Annual minimum</dt>
                <dd className="text-gray-700">{body.annualMin}</dd>
              </div>
            )}
          </dl>
          <p className="mt-4 text-xs text-gray-500">
            Certs: {body.certs.join(', ')} ·{' '}
            <a
              href={body.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              official source
            </a>{' '}
            (verify current figures)
          </p>
        </section>

        {/* How your hours count */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How your FFC hours count toward {body.name}
          </h2>
          <ul className="space-y-3">
            {channelOrder.map((ch) => {
              const s = SUPPORT_STYLE[body.channels[ch].support]
              return (
                <li key={ch} className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${s.chip}`}
                  >
                    {s.label}
                  </span>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">{CHANNEL_LABELS[ch]}:</span>{' '}
                    {body.channels[ch].note}
                  </span>
                </li>
              )
            })}
          </ul>
          {body.relevance === 'domain-relevant-only' && (
            <p className="mt-4 text-xs text-amber-700">
              Note: {body.name} only credits volunteer work that is relevant to the
              credential&apos;s profession — generic charity volunteering does not qualify.
            </p>
          )}
        </section>

        {/* How to claim */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to claim</h2>
          <ol className="space-y-2 text-sm text-gray-700 list-decimal pl-5">
            <li>
              Pick an{' '}
              <Link href="/volunteer" className="text-blue-600 underline hover:text-blue-800">
                FFC volunteer track
              </Link>{' '}
              and start contributing and training.
            </li>
            <li>FFC validates and certifies your hours (commit history + mentor certification).</li>
            <li>Request your FFC documentation and self-report it to {body.name}.</li>
          </ol>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
            >
              Find your volunteer track
            </Link>
            <Link
              href="/continuing-education"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              All supported certifications
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">{CE_DISCLAIMER}</p>
        </section>

        {/* MOVSM cross-link */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Military? You may also qualify for the MOVSM
          </h2>
          <p className="text-sm text-gray-700">
            Many {body.name} holders serve in the military. The same volunteer hours can count
            toward the{' '}
            <Link href="/movsm" className="text-blue-600 underline hover:text-blue-800">
              Military Outstanding Volunteer Service Medal
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  )
}
