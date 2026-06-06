import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import TrainingTrack from '@/components/TrainingTrack'
import { getPath, TIER_LABELS, TIER_BLURB } from '@/data/training-modules'

export const metadata: Metadata = {
  title: 'Google Workspace Admin Training',
  description:
    'The administrator path for charities that run on Google Workspace: accounts, groups, shared drives, sharing, and security in the Admin console — backed by the Google Workspace Administrator certification.',
  keywords:
    'Google Workspace admin training, Workspace administrator certification, nonprofit Google Workspace, GSuite admin, Free For Charity',
  alternates: {
    canonical: 'https://ffcadmin.org/training/google-workspace-admin/',
  },
}

export default function GoogleWorkspaceAdminTrainingPage() {
  const path = getPath('google-workspace-admin')
  if (!path) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Training', href: '/training' },
          { label: 'Google Workspace Admin' },
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
              <h1 className="text-3xl md:text-4xl font-bold">Google Workspace Admin Training</h1>
              <p className="text-amber-50 text-sm mt-1">
                Run accounts, groups, and security for charities on Google
              </p>
            </div>
          </div>
          <p className="text-amber-50 text-lg max-w-3xl">{path.intro}</p>
          {path.certifications && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              <span aria-hidden="true">🎓</span>
              {TIER_LABELS.T3} level — backed by {path.certifications.join(', ')}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded mb-8 text-sm text-amber-900">
          <strong>Administrator level.</strong> {TIER_BLURB.T3} You hold the Google Admin console
          for the charities FFC supports — work through what you own below, and lean on your AI
          assistant to explain anything new before you change it.
        </div>

        <TrainingTrack pathId="google-workspace-admin" accent="teal" />

        {/* Footer nav */}
        <div className="mt-10 bg-gradient-to-br from-gray-50 to-amber-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Where to next</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/training" className="text-amber-700 underline hover:text-amber-900">
                All training tracks
              </Link>
              <span className="text-gray-500"> &mdash; see every role and what it owns</span>
            </li>
            <li>
              <Link
                href="/volunteer/google-workspace-admin"
                className="text-amber-700 underline hover:text-amber-900"
              >
                Google Workspace Admin role
              </Link>
              <span className="text-gray-500"> &mdash; what the role is and how to start</span>
            </li>
            <li>
              <Link
                href="/contributor-ladder"
                className="text-amber-700 underline hover:text-amber-900"
              >
                Contributor Ladder
              </Link>
              <span className="text-gray-500"> &mdash; grow from Contributor to Maintainer</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
