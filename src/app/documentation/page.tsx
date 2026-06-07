import type { Metadata } from 'next'
import NonprofitCallout from '@/components/NonprofitCallout'
import DocSearch from './DocSearch'

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Searchable index of FFC documentation and runbooks: onboarding, escalation, deployment, security, code quality, and more. Everything you need to contribute and operate.',
  keywords:
    'documentation, runbooks, playbooks, volunteer guides, deployment, security, nonprofit web development',
}

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold">Documentation Center</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Searchable guides, references, and operational runbooks for the Free For Charity Admin
            Portal
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Documentation</h2>
          <p className="text-gray-700 mb-4">
            A comprehensive, searchable index of every documentation file and runbook in this
            repository. Search by name, topic, or audience, then open the live page or the source on
            GitHub.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>💡 Tip:</strong> Need a procedure? Search “onboard”, “escalation”, “security”,
              or “deploy” to jump straight to the relevant runbook.
            </p>
          </div>
        </div>

        {/* Searchable documentation index + runbooks */}
        <DocSearch />

        {/* Need Help Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Additional Help?</h2>
          <p className="text-gray-700 mb-6">
            If you can&apos;t find what you&apos;re looking for in the documentation, here&apos;s
            how to get support:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">General Support</h3>
              <p className="text-gray-600 text-sm">
                Open a support ticket with Free For Charity for general questions, feature requests,
                or non-urgent issues.
              </p>
            </div>

            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Emergency Escalation</h3>
              <p className="text-gray-600 text-sm mb-2">
                For urgent issues that require immediate attention:
              </p>
              <p className="text-gray-900 text-sm font-semibold">
                Clarke Moyer:{' '}
                <a href="tel:520-222-8104" className="text-blue-600 hover:underline">
                  (520) 222-8104
                </a>
              </p>
              <p className="text-gray-500 text-xs mt-1">(if not answered within 48 hours)</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <strong>Contributing to Documentation:</strong> Found an error or want to improve the
              docs? Visit our{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub repository
              </a>{' '}
              to open an issue or submit a pull request.
            </p>
          </div>
        </div>
      </main>

      <NonprofitCallout />
    </div>
  )
}
