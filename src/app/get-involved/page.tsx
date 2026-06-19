import type { Metadata } from 'next'
import Link from 'next/link'
import NonprofitCallout from '@/components/NonprofitCallout'
import { VOLUNTEER_ROLES } from '@/data/volunteer-roles'

export const metadata: Metadata = {
  title: 'Get Involved',
  description:
    'Join Free For Charity as a volunteer. Choose your track: Web Developer, Microsoft 365 Administrator, Google Workspace Admin, Data & Analytics, or Canva Designer — or just edit your own charity’s FFC website. Start building and make an impact.',
}

const steps = [
  {
    number: '1',
    title: 'Set Up Your Accounts',
    description:
      'Create the personal accounts every role needs — GitHub, MFA, a password manager, and your AI assistant — with the Account & Tool Setup guides.',
  },
  {
    number: '2',
    title: 'Choose Your Track',
    description: 'Pick a role that matches your skills and interests from the tracks below.',
  },
  {
    number: '3',
    title: 'Complete Training',
    description:
      'Work through the self-paced training path with interactive checklists and progress tracking.',
  },
  {
    number: '4',
    title: 'Join the Contributor Ladder',
    description:
      'Start as a Contributor, level up through the ladder, and grow into a Maintainer or Mentor.',
  },
  {
    number: '5',
    title: 'Make an Impact',
    description:
      'Build real websites for real nonprofits. Your work directly helps charities focus on their mission.',
  },
]

export default function GetInvolved() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get Involved</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Donate your skills, not just your dollars. Join a community of volunteers building free
            technology for nonprofits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contributor-ladder"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg"
            >
              View Contributor Ladder
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <a
              href="https://github.com/FreeForCharity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Browse on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Which describes you? — pathway fork */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            Which describes you?
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Pick the one that fits — you can always explore the others later.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Charity applicant */}
            <Link
              href="/charity-prerequisites"
              className="group block rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6 hover:border-indigo-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3" aria-hidden="true">
                  🏛️
                </span>
                <h3 className="text-lg font-bold text-indigo-900">
                  &ldquo;I run a charity and want FFC&apos;s help&rdquo;
                </h3>
              </div>
              <p className="text-sm text-indigo-900/80 mb-3">
                You want a free domain, professional email, and a website for your nonprofit. See
                what to prepare and how to apply.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-indigo-700 group-hover:text-indigo-900">
                See charity prerequisites
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            {/* Site owner */}
            <Link
              href="/site-owner"
              className="group block rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 hover:border-emerald-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3" aria-hidden="true">
                  🌱
                </span>
                <h3 className="text-lg font-bold text-emerald-900">
                  &ldquo;FFC built my charity&apos;s website and I want to edit it&rdquo;
                </h3>
              </div>
              <p className="text-sm text-emerald-900/80 mb-3">
                You run one nonprofit, you&apos;re not technical, and you just want to keep your own
                site up to date. No coding, no jargon — describe changes in plain English and
                approve them.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-emerald-700 group-hover:text-emerald-900">
                Start the Site Owner walkthrough
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>

            {/* Holistic volunteer */}
            <a
              href="#choose-your-track"
              className="group block rounded-xl border-2 border-blue-200 bg-blue-50 p-6 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3" aria-hidden="true">
                  🚀
                </span>
                <h3 className="text-lg font-bold text-blue-900">
                  &ldquo;I want to help charities and FFC more broadly&rdquo;
                </h3>
              </div>
              <p className="text-sm text-blue-900/80 mb-3">
                You want to volunteer across many nonprofits — infrastructure, design, or web
                development. Pick a track below and grow through the contributor ladder.
              </p>
              <span className="inline-flex items-center text-sm font-semibold text-blue-700 group-hover:text-blue-900">
                See the volunteer tracks
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section id="choose-your-track" className="py-16 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Choose Your Track</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We need volunteers across several disciplines. Pick the one that fits your skills — and
            use our Conversion Guide when you're ready to build.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {VOLUNTEER_ROLES.map((role) => (
              <div
                key={role.slug}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className={`bg-gradient-to-r ${role.gradient} p-6 text-white`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden="true">
                      {role.icon}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold">{role.title}</h3>
                      <p className="text-sm opacity-90">{role.tagline}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-600 mb-4 text-sm">{role.intro}</p>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">What you&apos;ll do:</h4>
                  <ul className="space-y-1.5 mb-6">
                    {role.responsibilities.map((item) => (
                      <li key={item} className="flex items-start text-sm text-gray-700">
                        <svg
                          className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
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
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/volunteer/${role.slug}`}
                    className={`mt-auto block text-center w-full px-4 py-2.5 bg-gradient-to-r ${role.gradient} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm`}
                  >
                    Explore the {role.title.replace(' Volunteer', '').replace(' (MOVSM)', '')} role
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not Sure / Other Ways */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Not sure where to start?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Check out the Contributor Ladder to understand the progression from Contributor to
              Maintainer. Already have development skills? Jump into the Conversion Guide to start
              building charity websites. You can also browse our GitHub repos to find issues labeled{' '}
              <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm">help-wanted</code> and
              jump right in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contributor-ladder"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
              >
                Contributor Ladder
              </Link>
              <Link
                href="/guides/wordpress-to-nextjs-guide"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Conversion Guide
              </Link>
              <Link
                href="/tech-stack"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                View Tech Stack
              </Link>
              <Link
                href="/documentation"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Read the Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NonprofitCallout />
    </div>
  )
}
