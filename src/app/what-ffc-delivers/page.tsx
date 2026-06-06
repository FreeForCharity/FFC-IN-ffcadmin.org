import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'What FFC Delivers',
  description:
    'What Free For Charity provides to partner 501(c)(3) nonprofits — a free website, domain, Microsoft 365 / Google Workspace, and analytics setup — what is included, what is out of scope, and the simple expectation in return. (Draft for review.)',
  keywords:
    'Free For Charity delivery, what FFC provides, free nonprofit website, free charity domain, Microsoft 365 nonprofit, sponsorship, FFC inclusions',
  alternates: {
    canonical: 'https://ffcadmin.org/what-ffc-delivers/',
  },
}

const included = [
  {
    title: 'A professional website',
    body: 'A fast, secure, accessible static site built from the FFC template and hosted free, with AI-assisted editing so you can keep it current yourself.',
  },
  {
    title: 'A domain',
    body: 'A free .org registration (or transfer-in) and DNS managed through Cloudflare, kept renewed while you partner with FFC.',
  },
  {
    title: 'Email & Microsoft 365 / Google Workspace',
    body: 'Charity email and a productivity suite for eligible 501(c)(3) organizations, with MFA and security baked in.',
  },
  {
    title: 'Analytics & basic SEO',
    body: 'Analytics and search-presence basics configured during the initial build so you can see your impact.',
  },
  {
    title: 'Volunteer support',
    body: 'Access to FFC volunteers and the Site Owner walkthrough, cookbook, and training so you are never stuck.',
  },
]

const excluded = [
  'Paid advertising spend or ad campaign management.',
  'Bespoke web applications, e-commerce platforms, or custom back-end systems.',
  'Day-to-day content writing — FFC gives you the tools and training to maintain your own content (with AI help).',
  'Third-party software licenses beyond what FFC sponsors.',
  'Legal, financial, or accounting services.',
]

export default function WhatFfcDeliversPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'What FFC Delivers' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">What Free For Charity Delivers</h1>
          <p className="text-teal-50 text-lg max-w-3xl mt-3">
            FFC provides the technology a 501(c)(3) needs to have a credible online presence — free
            — so you can focus on your mission instead of IT overhead.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded mb-8 text-sm text-amber-900">
          <strong>Draft for review.</strong> This page describes FFC&apos;s delivery model as it
          operates today. The FFC founder should confirm the exact inclusions and any sponsorship
          tiers before this is treated as a formal commitment.
        </div>

        {/* Included */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {included.map((i) => (
              <div key={i.title} className="border-l-4 border-teal-300 pl-4">
                <h3 className="font-bold text-gray-900">{i.title}</h3>
                <p className="text-sm text-gray-700">{i.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Excluded */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s out of scope</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {excluded.map((e) => (
              <li key={e} className="flex items-start">
                <span className="text-gray-400 mr-2 mt-0.5">&#10005;</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* In return */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What we ask in return</h2>
          <p className="text-gray-700 text-sm">
            FFC is donor- and volunteer-funded. In return for free technology, partner charities are
            asked to <strong>credit Free For Charity</strong> (a small footer acknowledgment and,
            where appropriate, a link back) and to help spread the word so other nonprofits can
            benefit. There is no fee.
          </p>
        </section>

        {/* CTAs */}
        <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next steps</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <a
                href="https://freeforcharity.org/submit-information/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 underline hover:text-teal-900"
              >
                Apply for a free site
              </a>
              <span className="text-gray-500"> &mdash; start your charity&apos;s application</span>
            </li>
            <li>
              <Link href="/site-owner" className="text-teal-700 underline hover:text-teal-900">
                Already have an FFC site? Edit it
              </Link>
            </li>
            <li>
              <Link href="/get-involved" className="text-teal-700 underline hover:text-teal-900">
                Volunteer with FFC
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
