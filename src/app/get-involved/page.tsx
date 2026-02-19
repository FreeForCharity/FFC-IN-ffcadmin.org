import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Get Involved',
  description:
    'Join Free For Charity as a volunteer. Choose your track: web development, IT administration, or graphic design. Start training and make an impact.',
}

const roles = [
  {
    title: 'Global Administrator',
    subtitle: 'Manage Infrastructure & Security',
    description:
      'Become a dual-hatted admin for Microsoft 365 and GitHub. Manage DNS, email, security policies, and deployments for all FFC charity sites.',
    skills: [
      'Microsoft 365 Administration',
      'GitHub & Cloudflare Management',
      'DNS & Domain Security',
      'MS-900 & GitHub Foundations Certs',
    ],
    link: '/training-plan',
    linkLabel: 'Start the Training Plan',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
    gradient: 'from-teal-500 to-emerald-500',
    estimate: '8-12 hrs/week',
  },
  {
    title: 'Canva Designer',
    subtitle: 'Create Brand Identities & Marketing Materials',
    description:
      'Design professional brand kits, social media templates, email campaigns, and print materials for nonprofit organizations using Canva Pro.',
    skills: [
      'Canva Pro & Brand Kit Design',
      'Social Media Templates',
      'Email & Print Stationery',
      'Canva Design School Certification',
    ],
    link: '/canva-designer-path',
    linkLabel: 'Start the Designer Path',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    ),
    gradient: 'from-orange-500 to-amber-500',
    estimate: '5-10 hrs/week',
  },
]

const steps = [
  {
    number: '1',
    title: 'Choose Your Track',
    description: 'Pick a role that matches your skills and interests from the two tracks below.',
  },
  {
    number: '2',
    title: 'Complete Training',
    description:
      'Work through the self-paced training path with interactive checklists and progress tracking.',
  },
  {
    number: '3',
    title: 'Join the Contributor Ladder',
    description:
      'Start as a Contributor, level up through the ladder, and grow into a Maintainer or Mentor.',
  },
  {
    number: '4',
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

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Choose Your Track</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We need volunteers across two disciplines. Pick the one that fits your skills — and use
            our Conversion Guide when you're ready to build.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {roles.map((role) => (
              <div
                key={role.title}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`bg-gradient-to-r ${role.gradient} p-6 text-white`}>
                  <div className="flex items-center mb-3">
                    <svg
                      className="w-8 h-8 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {role.icon}
                    </svg>
                    <div>
                      <h3 className="text-xl font-bold">{role.title}</h3>
                      <p className="text-sm opacity-90">{role.subtitle}</p>
                    </div>
                  </div>
                  <span className="inline-block text-xs bg-white/20 rounded-full px-3 py-1">
                    ~{role.estimate}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 text-sm">{role.description}</p>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Skills You'll Gain:</h4>
                  <ul className="space-y-1.5 mb-6">
                    {role.skills.map((skill) => (
                      <li key={skill} className="flex items-start text-sm text-gray-700">
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
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={role.link}
                    className={`block text-center w-full px-4 py-2.5 bg-gradient-to-r ${role.gradient} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm`}
                  >
                    {role.linkLabel}
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
                href="/wordpress-to-nextjs-guide"
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
    </div>
  )
}
