import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Technical Guides',
  description:
    'Step-by-step technical walkthroughs for Free For Charity operations. Data migrations, platform configurations, and operational procedures.',
}

const guides = [
  {
    title: 'Zeffy Member Data Migration Guide',
    description:
      'How to migrate nonprofit membership records into Zeffy CRM using Claude AI & Cowork Mode. Covers Zeffy CSV import format, data cleanup, payment history migration, and verification.',
    href: '/guides/zeffy-member-data-migration',
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
]

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
                    <p className="text-gray-600 mb-4 text-sm">{guide.description}</p>
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
