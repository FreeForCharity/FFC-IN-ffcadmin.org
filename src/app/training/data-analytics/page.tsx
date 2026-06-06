import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import TrainingTrack from '@/components/TrainingTrack'
import { getPath, TIER_LABELS, TIER_BLURB } from '@/data/training-modules'

export const metadata: Metadata = {
  title: 'Data & Analytics Training',
  description:
    'The data path for nonprofits: set up GA4 and Tag Manager (consent-gated), build impact dashboards in Looker Studio, and turn analytics into clear reporting for charity boards. Backed by the Google Analytics certification.',
  keywords:
    'data analytics training, Google Analytics GA4, Looker Studio dashboards, nonprofit impact reporting, GA4 certification, Free For Charity',
  alternates: {
    canonical: 'https://ffcadmin.org/training/data-analytics/',
  },
}

export default function DataAnalyticsTrainingPage() {
  const path = getPath('data-analytics')
  if (!path) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Training', href: '/training' },
          { label: 'Data & Analytics' },
        ]}
      />

      {/* Hero */}
      <div className={`bg-gradient-to-r ${path.gradient} text-white py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              {path.icon}
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Data &amp; Analytics Training</h1>
              <p className="text-violet-50 text-sm mt-1">
                Measure impact with analytics and dashboards
              </p>
            </div>
          </div>
          <p className="text-violet-50 text-lg max-w-3xl">{path.intro}</p>
          {path.certifications && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              <span aria-hidden="true">🎓</span>
              {TIER_LABELS.T3} level — backed by {path.certifications.join(', ')}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-violet-50 border-l-4 border-violet-500 p-5 rounded mb-8 text-sm text-violet-900">
          <strong>Administrator level.</strong> {TIER_BLURB.T3} Analytics is configured during every
          initial site build, so you&apos;ll partner closely with web developers — work through what
          you own below.
        </div>

        <TrainingTrack pathId="data-analytics" accent="blue" />

        {/* Footer nav */}
        <div className="mt-10 bg-gradient-to-br from-gray-50 to-violet-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Where to next</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/training" className="text-violet-700 underline hover:text-violet-900">
                All training tracks
              </Link>
              <span className="text-gray-500"> &mdash; see every role and what it owns</span>
            </li>
            <li>
              <Link
                href="/volunteer/data-analytics"
                className="text-violet-700 underline hover:text-violet-900"
              >
                Data &amp; Analytics role
              </Link>
              <span className="text-gray-500"> &mdash; what the role is and how to start</span>
            </li>
            <li>
              <Link
                href="/training/web-developer"
                className="text-violet-700 underline hover:text-violet-900"
              >
                Web Developer track
              </Link>
              <span className="text-gray-500">
                {' '}
                &mdash; your closest partner during site builds
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
