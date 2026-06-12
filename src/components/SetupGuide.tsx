import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getSetupGuide, type SetupGuide } from '@/data/setup-guides'

/** Render inline **bold** segments without dangerouslySetInnerHTML. */
function emphasize(text: string, keyPrefix: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-gray-900">
        {part}
      </strong>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  )
}

export default function SetupGuide({ guide }: { guide: SetupGuide }) {
  const faqJsonLd = guide.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  const related = guide.related
    .map((slug) => getSetupGuide(slug))
    .filter((g): g is SetupGuide => Boolean(g))

  return (
    <div className="min-h-screen bg-gray-50">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: guide.shortTitle },
        ]}
      />

      {/* Hero */}
      <div className={`bg-gradient-to-r ${guide.gradient} text-white py-14 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl" aria-hidden="true">
              {guide.icon}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold">{guide.title}</h1>
          </div>
          <p className="text-white/90 text-sm">
            {guide.category} · about {guide.estMinutes} min · {guide.audience}
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="space-y-3 mb-8">
          {guide.intro.map((p, i) => (
            <p key={i} className="text-gray-700">
              {emphasize(p, `intro-${i}`)}
            </p>
          ))}
        </div>

        {/* Principle callout */}
        {guide.principle && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-5 mb-10">
            <h2 className="text-base font-bold text-blue-900 mb-1">{guide.principle.title}</h2>
            <p className="text-sm text-blue-900/90">
              {emphasize(guide.principle.body, 'principle')}
            </p>
          </div>
        )}

        {/* Steps */}
        <ol className="space-y-6">
          {guide.steps.map((step, i) => (
            <li key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <div className="space-y-2">
                    {step.body.map((line, j) => (
                      <p key={j} className="text-sm text-gray-700 leading-relaxed">
                        {emphasize(line, `s${i}-${j}`)}
                      </p>
                    ))}
                  </div>
                  {step.tip && (
                    <p className="mt-3 text-sm bg-amber-50 border border-amber-200 text-amber-900 rounded p-3">
                      <span aria-hidden="true">💡 </span>
                      {emphasize(step.tip, `tip-${i}`)}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* New-phone precautions */}
        {guide.newPhone && guide.newPhone.length > 0 && (
          <section className="mt-10 bg-rose-50 border border-rose-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-rose-900 mb-3">
              <span aria-hidden="true">📱 </span>Before you get a new phone
            </h2>
            <ul className="space-y-2">
              {guide.newPhone.map((line, i) => (
                <li key={i} className="flex items-start text-sm text-rose-900/90">
                  <span className="mr-2 mt-0.5" aria-hidden="true">
                    •
                  </span>
                  <span>{emphasize(line, `np-${i}`)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        {guide.faqs && guide.faqs.length > 0 && (
          <section className="mt-10 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Common questions</h2>
            <div className="space-y-4">
              {guide.faqs.map((f, i) => (
                <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{f.q}</h3>
                  <p className="text-sm text-gray-700">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Next setup guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {g.icon}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{g.shortTitle}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Support */}
        <p className="mt-10 text-sm text-gray-600">
          Stuck on any step? Text Clarke Moyer at{' '}
          <a href="sms:520-222-8104" className="text-blue-600 underline hover:text-blue-800">
            (520)&nbsp;222-8104
          </a>{' '}
          — every step is meant to be simple, so if something doesn&apos;t match what you see, ask.
        </p>
      </main>
    </div>
  )
}
