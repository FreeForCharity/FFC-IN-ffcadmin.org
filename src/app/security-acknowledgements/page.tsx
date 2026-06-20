import Link from 'next/link'
import type { Metadata } from 'next'
import PolicyCrossLinks from '@/components/PolicyCrossLinks'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/security-acknowledgements/' },
  title: 'Security Acknowledgements',
  description:
    'Free For Charity thanks the security researchers who responsibly disclose vulnerabilities. See our Vulnerability Disclosure Policy to report a security issue.',
}

const LAST_UPDATED = 'June 20, 2026'

export default function SecurityAcknowledgements() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold">Security Acknowledgements</h1>
          </div>
          <p className="text-blue-100 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-8 text-gray-700">
            <section>
              <p>
                Free For Charity would like to extend our sincere gratitude to the following
                security researchers for their invaluable contributions in helping us keep our
                platform safe. By responsibly disclosing vulnerabilities, they have played a crucial
                role in protecting our users and our data.
              </p>
            </section>

            <section className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p>
                As of now, we have not received any vulnerability reports that qualify for public
                acknowledgment. This page will be updated to credit researchers as reports are
                submitted and validated according to our policy.
              </p>
            </section>

            <section>
              <p>
                To report a suspected security vulnerability, please follow our{' '}
                <Link
                  href="/vulnerability-disclosure-policy"
                  className="text-blue-600 hover:underline"
                >
                  Vulnerability Disclosure Policy
                </Link>
                .
              </p>
            </section>

            <PolicyCrossLinks current="/security-acknowledgements" />
          </div>
        </div>
      </div>
    </div>
  )
}
