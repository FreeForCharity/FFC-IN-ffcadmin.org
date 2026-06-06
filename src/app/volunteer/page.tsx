import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { VOLUNTEER_ROLES } from '@/data/volunteer-roles'

export const metadata: Metadata = {
  title: 'Volunteer with Free For Charity',
  description:
    'Volunteer your web development, IT, or design skills to build free websites for 501(c)(3) nonprofits. No experience required — we provide free training and certifications.',
  keywords: [
    'volunteer web developer nonprofit',
    'IT volunteer program',
    'learn Microsoft 365 admin nonprofit',
    'free IT training volunteer',
    'open source nonprofit projects',
    'nonprofit technology volunteer',
    'volunteer web development',
    'charity website volunteer',
  ],
}

const benefits = [
  {
    title: 'Real-World Experience',
    description:
      'Ship production code for live nonprofit websites. Build a portfolio that demonstrates actual impact, not just tutorials.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    title: 'Free Certifications',
    description:
      'FFC covers the cost of industry certifications like MS-900 (Microsoft 365 Fundamentals) and GitHub Foundations for active volunteers.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    ),
  },
  {
    title: 'Mentorship',
    description:
      'Work alongside experienced admins and developers who review your code, answer questions, and help you grow through the Contributor Ladder.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    ),
  },
  {
    title: 'Meaningful Impact',
    description:
      'Every website you build helps a real nonprofit serve its community. Food banks, youth programs, environmental groups — they all need your help.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
  },
]

const faqs = [
  {
    question: 'Do I need prior experience?',
    answer:
      'No. The Web Developer, Global Administrator, and Canva Designer tracks all include guidance from scratch — the developer path starts with an AI agent (Claude Desktop) and no heavy local setup. We provide self-paced curricula with interactive checklists.',
  },
  {
    question: 'How much time does it take?',
    answer:
      'It is flexible and remote. Web Developers can contribute as little or as much as they like, an issue at a time. Global Administrators typically contribute 8-12 hours per week and Canva Designers 5-10 hours per week.',
  },
  {
    question: 'What technologies will I learn?',
    answer:
      'Web Developers learn Next.js/React static sites and the AI-agent (Claude/Codex) GitHub workflow. Global Admins learn Microsoft 365, GitHub, Cloudflare, DNS, and CI/CD pipelines. Canva Designers learn Canva Pro, brand design, and digital marketing materials.',
  },
  {
    question: 'Is this an internship or paid position?',
    answer:
      'FFC is a 100% volunteer organization. There is no compensation, but you gain real skills, certifications, and portfolio projects that are valuable for your career.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Visit the Get Involved page, choose your track (Web Developer, Global Admin, or Canva Designer), and start working through the self-paced path. If you just want to edit your own charity’s FFC site, head to the Site Owner walkthrough instead.',
  },
]

export default function VolunteerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Volunteer with Free For Charity',
    description:
      'Volunteer your skills to build free websites for nonprofits. Free training and certifications provided.',
    url: 'https://ffcadmin.org/volunteer/',
    mainEntity: {
      '@type': 'VolunteerAction',
      name: 'Volunteer with Free For Charity',
      description:
        'Build free websites for 501(c)(3) nonprofits while gaining real-world IT and development experience.',
      agent: {
        '@type': 'Organization',
        name: 'Free For Charity',
        url: 'https://freeforcharity.org',
      },
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Volunteer' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Volunteer Your Skills.
            <br />
            Change a Nonprofit&apos;s Future.
          </h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-8">
            Free For Charity trains volunteers to build professional websites for 501(c)(3)
            organizations. No experience required — we provide free training and certifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-teal-700 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg text-lg"
            >
              Start Volunteering
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/training-plan"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-teal-700 transition-all text-lg"
            >
              View Training Plan
            </Link>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What FFC Volunteers Do</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              FFC volunteers build and maintain the entire web infrastructure for nonprofit
              organizations — from domain registration to deployment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Web Developer Track</h3>
              <p className="text-gray-600 mb-4">
                Build and maintain charity websites with your AI agent. Describe changes in plain
                English, open pull requests, and let CI run the checks — no heavy local setup
                required.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-blue-500 mr-2"
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
                  Next.js &amp; React static sites
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-blue-500 mr-2"
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
                  GitHub issue → PR → merge workflow
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-blue-500 mr-2"
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
                  AI-agent development (Claude / Codex)
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-blue-500 mr-2"
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
                  Automated testing &amp; accessibility
                </li>
              </ul>
              <Link
                href="/developer-environment-setup"
                className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800 text-sm"
              >
                Set up your environment &rarr;
              </Link>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Administrator Track</h3>
              <p className="text-gray-600 mb-4">
                Manage Microsoft 365, GitHub, Cloudflare, and DNS infrastructure for all FFC charity
                sites. Learn enterprise IT administration with real production systems.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-teal-500 mr-2"
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
                  Microsoft 365 Global Administration
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-teal-500 mr-2"
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
                  GitHub repository and Actions management
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-teal-500 mr-2"
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
                  Cloudflare DNS, CDN, and security
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-teal-500 mr-2"
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
                  MS-900 and GitHub Foundations certifications
                </li>
              </ul>
              <Link
                href="/training-plan"
                className="mt-4 inline-block text-teal-600 font-semibold hover:text-teal-800 text-sm"
              >
                View training plan &rarr;
              </Link>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Canva Designer Track</h3>
              <p className="text-gray-600 mb-4">
                Create professional brand identities, social media templates, and marketing
                materials for nonprofit organizations using Canva Pro.
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-orange-500 mr-2"
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
                  Canva Pro and Brand Kit design
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-orange-500 mr-2"
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
                  Social media and email templates
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-orange-500 mr-2"
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
                  Print stationery and marketing collateral
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-orange-500 mr-2"
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
                  Canva Design School certification
                </li>
              </ul>
              <Link
                href="/canva-designer-path"
                className="mt-4 inline-block text-orange-600 font-semibold hover:text-orange-800 text-sm"
              >
                View designer path &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore all roles */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Volunteer Roles</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each role has its own landing page with what you&apos;ll do and how to start. Not sure
              which fits? Text us and we&apos;ll help you choose.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VOLUNTEER_ROLES.map((role) => (
              <Link
                key={role.slug}
                href={`/volunteer/${role.slug}`}
                className="group block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all"
              >
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3" aria-hidden="true">
                    {role.icon}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700">
                    {role.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{role.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Site owner callout */}
      <section className="px-4 sm:px-6 lg:px-8 mt-4 pb-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-emerald-900">
              <span className="text-lg mr-1" aria-hidden="true">
                🌱
              </span>
              <strong>Just here to edit your own charity&apos;s FFC site?</strong> You don&apos;t
              need a volunteer track — there&apos;s a short, no-code walkthrough made for you.
            </p>
            <Link
              href="/site-owner"
              className="inline-flex items-center whitespace-nowrap text-sm font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Edit my charity&apos;s website &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Volunteer with FFC
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {benefit.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways in & getting help */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Getting started &amp; getting help
          </h2>
          <p className="text-lg text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Brand new? The fastest way in is to reach out — we&apos;ll help you find the right
            track.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-emerald-900 mb-2">
                New here? Start the easy way
              </h3>
              <p className="text-sm text-emerald-900/90 mb-3">
                Text <strong>Clarke Moyer at (520) 222-8104</strong> to become a volunteer and
                we&apos;ll point you to the right next step.
              </p>
              <a
                href="sms:520-222-8104"
                className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Text (520)&nbsp;222-8104 →
              </a>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Already a volunteer?</h3>
              <p className="text-sm text-blue-900/90">
                Collaborate with the team in <strong>Microsoft Teams</strong> (our day-to-day
                channel, on the Microsoft 365 stack FFC runs). Ask your FFC contact for an invite if
                you don&apos;t have access yet.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Common ways volunteers find us</h3>
            <p className="text-sm text-gray-600 mb-3">
              Many volunteers come through these platforms — they&apos;re also tools we recommend to
              the charities we serve:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-2 mt-0.5">&bull;</span>
                <span>
                  <a
                    href="https://www.taproot.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Taproot Foundation
                  </a>{' '}
                  — skills-based pro bono projects.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2 mt-0.5">&bull;</span>
                <span>
                  <a
                    href="https://www.volunteermatch.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    VolunteerMatch
                  </a>{' '}
                  (and{' '}
                  <a
                    href="https://www.idealist.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Idealist
                  </a>
                  ) — nonprofit volunteer and role listings.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Join a growing community of volunteers building free technology for nonprofits. Your
            skills can help charities focus on their missions instead of technology overhead.
          </p>
          <Link
            href="/get-involved"
            className="inline-flex items-center px-10 py-4 bg-white text-teal-700 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all shadow-lg"
          >
            Get Started Today
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
