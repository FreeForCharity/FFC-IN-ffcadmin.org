import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import TrainingTrack from '@/components/TrainingTrack'
import { getPath, TIER_LABELS, TIER_BLURB } from '@/data/training-modules'

export const metadata: Metadata = {
  title: 'Web Developer Training',
  description:
    'The practitioner path for building and maintaining FFC charity websites with an AI agent: accounts, building with AI, site build & code, content, publishing, security, and the domain/governance fundamentals — hands-on, no certification required.',
  keywords:
    'web developer training, nonprofit website development, Next.js, AI agent development, GitHub workflow, Free For Charity',
  alternates: {
    canonical: 'https://ffcadmin.org/training/web-developer/',
  },
}

export default function WebDeveloperTrainingPage() {
  const path = getPath('web-developer')
  if (!path) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Training', href: '/training' },
          { label: 'Web Developer' },
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
              <h1 className="text-3xl md:text-4xl font-bold">Web Developer Training</h1>
              <p className="text-blue-50 text-sm mt-1">
                Build &amp; maintain charity websites with your AI agent
              </p>
            </div>
          </div>
          <p className="text-blue-50 text-lg max-w-3xl">{path.intro}</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            <span aria-hidden="true">🔵</span>
            {TIER_LABELS.T2} level — hands-on, no certification required
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded mb-8 text-sm text-blue-900">
          <strong>Practitioner level.</strong> {TIER_BLURB.T2} Set up your environment first, then
          work through what you own below. Newcomers should start with{' '}
          <Link
            href="/developer-environment-setup/claude-desktop"
            className="underline font-medium"
          >
            Claude Desktop
          </Link>
          ; you can ignore VS Code, Antigravity, and local builds until a task needs them.
        </div>

        <TrainingTrack pathId="web-developer" accent="blue" />

        {/* Footer nav */}
        <div className="mt-10 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Where to next</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link
                href="/developer-environment-setup"
                className="text-blue-700 underline hover:text-blue-900"
              >
                Developer Environment Setup
              </Link>
              <span className="text-gray-500"> &mdash; pick your AI agent and connect GitHub</span>
            </li>
            <li>
              <Link href="/training" className="text-blue-700 underline hover:text-blue-900">
                All training tracks
              </Link>
              <span className="text-gray-500"> &mdash; see every role and what it owns</span>
            </li>
            <li>
              <Link
                href="/contributor-ladder"
                className="text-blue-700 underline hover:text-blue-900"
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
