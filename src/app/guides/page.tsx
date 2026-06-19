import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { guides as baseGuides } from '@/data/guides'
import { PERSONAL_GUIDES, ORGANIZATIONAL_GUIDES, type SetupGuide } from '@/data/setup-guides'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/guides/' },
  title: 'Technical Guides',
  description:
    'Step-by-step technical walkthroughs for Free For Charity operations. Data migrations, platform configurations, and operational procedures.',
}

/**
 * Landing-page display properties keyed by guide href.
 * Core data (title, description, href) comes from src/data/guides.ts.
 * Descriptions here are longer for the landing page cards.
 */
const guideDisplayProps: Record<
  string,
  {
    longDescription: string
    version: string
    date: string
    tags: string[]
    gradient: string
    icon: ReactNode
  }
> = {
  '/guides/build-charity-site-from-template': {
    longDescription:
      'Stand up a new charity website from the FFC single-page template with your AI agent — create the repo, customize the content, run the checks, open a pull request, deploy, and hand it off to the site owner.',
    version: 'v1',
    date: 'June 2026',
    tags: ['Template', 'Next.js', 'AI Agent', 'GitHub Pages'],
    gradient: 'from-blue-500 to-indigo-600',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
      />
    ),
  },
  '/guides/wordpress-to-nextjs-guide': {
    longDescription:
      'Step-by-step guide for FFC volunteers to convert WordPress/Divi charity sites to Next.js static sites on GitHub Pages. Covers content audit, export, CI/CD, testing, and DNS cutover.',
    version: 'v1',
    date: 'February 2026',
    tags: ['WordPress', 'Next.js', 'GitHub Pages', 'Migration'],
    gradient: 'from-blue-500 to-indigo-500',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  '/guides/zeffy-member-data-migration': {
    longDescription:
      'How to migrate nonprofit membership records into Zeffy CRM using Claude AI & Cowork Mode. Covers Zeffy CSV import format, data cleanup, payment history migration, and verification.',
    version: 'v2',
    date: 'February 2026',
    tags: ['Zeffy', 'CRM', 'Data Migration', 'Claude AI'],
    gradient: 'from-violet-500 to-purple-500',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
      />
    ),
  },
}

// Merge base guide data with landing-page display properties.
// Order follows the shared guides array for consistency across the site.
const guides = baseGuides.map((guide) => ({
  ...guide,
  ...guideDisplayProps[guide.href],
}))

/** A grid of setup-guide cards (shared by the Personal and Organizational sections). */
function SetupGuideGrid({ guides }: { guides: SetupGuide[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {guides.map((g) => (
        <Link
          key={g.slug}
          href={`/guides/${g.slug}`}
          className="group block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all"
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl" aria-hidden="true">
              {g.icon}
            </span>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700">
              {g.shortTitle}
            </h3>
          </div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{g.category}</p>
          <p className="text-sm text-gray-600">{g.description}</p>
        </Link>
      ))}
    </div>
  )
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Technical Guides</h1>
          <p className="text-xl text-violet-100 max-w-3xl mx-auto">
            Step-by-step walkthroughs for real-world operations. Each guide documents an actual
            project so you can replicate the process.
          </p>
        </div>
      </div>

      {/* Guides List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="block bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div
                    className={`bg-gradient-to-br ${guide.gradient} p-8 flex items-center justify-center md:w-48`}
                  >
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {guide.icon}
                    </svg>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{guide.title}</h2>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                        {guide.version}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{guide.longDescription}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {guide.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 ml-auto">{guide.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Account & Tool Setup */}
      <section className="pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account &amp; Tool Setup</h2>
          <p className="text-gray-600 mb-8 max-w-3xl text-sm">
            Brand-new? Start here. Plain-language, every-step-spelled-out guides for the accounts
            you need as a volunteer or charity owner — built around one idea: your accounts are{' '}
            <strong>you, the person</strong>, secured with multi-factor authentication, with your
            work email added on top. Each tool has a <strong>personal</strong> setup and, where it
            applies, a matching <strong>organizational</strong> setup for the charity.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-1">Personal setup</h3>
          <p className="text-gray-600 mb-4 max-w-3xl text-sm">
            Set these up as yourself — the individual accounts every volunteer and applicant needs.
          </p>
          <SetupGuideGrid guides={PERSONAL_GUIDES} />

          <h3 className="text-lg font-bold text-gray-900 mt-10 mb-1">Organizational setup</h3>
          <p className="text-gray-600 mb-4 max-w-3xl text-sm">
            The charity-level setup of the same tools — done once the organization exists (some
            steps require 501(c)(3) recognition).
          </p>
          <SetupGuideGrid guides={ORGANIZATIONAL_GUIDES} />

          {/* Where these lead — cross-links to tracks and the dev environment */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/training"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:border-gray-300 transition-all"
            >
              <span className="text-2xl" aria-hidden="true">
                🎓
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-gray-900 group-hover:text-blue-700">
                  Ready to volunteer? Pick a training track
                </span>
                <span className="block text-sm text-gray-600">
                  These accounts are the prerequisites for every role — Site Owner, Web Developer,
                  admins, and designer.
                </span>
              </span>
              <span className="text-gray-300 group-hover:text-blue-600" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/developer-environment-setup"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:border-gray-300 transition-all"
            >
              <span className="text-2xl" aria-hidden="true">
                💻
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-gray-900 group-hover:text-blue-700">
                  Building websites? Set up your dev environment
                </span>
                <span className="block text-sm text-gray-600">
                  Develop with the AI agent of your choice — Claude, Codex, Gemini, or Copilot.
                </span>
              </span>
              <span className="text-gray-300 group-hover:text-blue-600" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Have a Guide to Contribute? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-violet-50 rounded-xl border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Have a guide to contribute?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you&apos;ve completed a technical project for FFC and documented the process, we
              want to include it here. Open an issue or PR on GitHub.
            </p>
            <a
              href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
            >
              Open an Issue on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
