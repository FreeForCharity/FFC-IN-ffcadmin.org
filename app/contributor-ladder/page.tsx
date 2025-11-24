import type { Metadata } from 'next'
import type { ReactElement } from 'react'

export const metadata: Metadata = {
  title: 'Contributor Ladder | Free For Charity',
  description:
    'Join Free For Charity - A clear path from contributor to maintainer. Learn how to grow your skills and impact through our structured contributor ladder program.',
  keywords:
    'contributor ladder, open source contribution, volunteer opportunities, nonprofit development, Free For Charity',
}

interface ContributorLevel {
  id: number
  title: string
  nextLevel?: string
  description: string
  requirements: string[]
  timeframe?: string
  icon: ReactElement
  gradient: string
}

export default function ContributorLadder() {
  const levels: ContributorLevel[] = [
    {
      id: 1,
      title: 'Contributor',
      nextLevel: 'Unpaid Intern',
      description:
        'Anyone can contribute to Free For Charity. Your first contributions help you understand our processes and demonstrate your interest in supporting nonprofits through technology.',
      requirements: [
        'Make your first pull request to any repository',
        'Follow our code of conduct and contribution guidelines',
        'Engage respectfully with the community',
        'Complete at least 2 merged contributions',
      ],
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      title: 'Unpaid Intern',
      nextLevel: 'Paid Intern',
      description:
        'Deepen your involvement with a structured learning path. Work on larger features, documentation, and testing while building expertise in our technology stack.',
      requirements: [
        'Complete 5+ merged contributions as a Contributor',
        'Participate in code reviews and provide constructive feedback',
        'Demonstrate understanding of our architecture and standards',
        'Complete training in either Global Admin or Canva Designer track',
        'Attend team meetings and community calls regularly',
      ],
      timeframe: '3-6 months commitment',
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      id: 3,
      title: 'Paid Intern',
      nextLevel: 'Mentor',
      description:
        'Take on significant responsibilities with compensation for your time. Lead feature development, coordinate with charity partners, and help shape our roadmap.',
      requirements: [
        'Successfully complete Unpaid Intern requirements',
        'Lead development of at least 2 major features or initiatives',
        'Obtain relevant certification (MS-900, GitHub Foundations, or Canva Design School)',
        'Demonstrate ability to work independently on complex projects',
        'Support onboarding and mentoring of new contributors',
      ],
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      gradient: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      title: 'Mentor',
      nextLevel: 'Maintainer',
      description:
        'Guide the next generation of contributors. Share your expertise through code reviews, documentation, training, and active community leadership.',
      requirements: [
        'Complete at least 6 months as Paid Intern',
        'Mentor 2+ contributors through their growth journey',
        'Lead training sessions or create educational content',
        'Participate in governance and strategic planning',
      ],
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      id: 5,
      title: 'Maintainer',
      description:
        'Own core components of the platform with full authority. Make architectural decisions, manage releases, and ensure the long-term success of Free For Charity.',
      requirements: [
        'Demonstrated excellence as Mentor for 1+ year',
        'Deep expertise in multiple areas of our technology stack',
        'Trusted with repository write access and release management',
        'Active leadership in community governance and strategic direction',
      ],
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      gradient: 'from-red-500 to-red-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Contributor <span className="text-blue-200">Ladder</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            A clear path from contributor to maintainer. Join us in delivering free technology
            solutions to nonprofits worldwide.
          </p>

          {/* GitHub CTA */}
          <div className="mt-8 flex justify-center">
            <a
              href="https://github.com/FreeForCharity"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-left">
                <div className="text-sm text-gray-600">Start Contributing Today</div>
                <div className="text-lg font-bold text-blue-600">View Our Repositories →</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Ladder Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile & Tablet Layout */}
          <div className="lg:hidden space-y-6">
            {levels.map((level, index) => (
              <div key={level.id} className="relative">
                {/* Level Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-blue-400 transition-colors">
                  {/* Level Number */}
                  <div className="absolute -top-4 left-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${level.gradient} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold text-lg">{level.id}</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${level.gradient} rounded-full mb-4`}
                      >
                        <div className="text-white">{level.icon}</div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.title}</h3>
                      {level.timeframe && (
                        <div className="inline-block bg-blue-100 rounded-full px-4 py-1 text-sm text-blue-700 font-medium mb-3">
                          {level.timeframe}
                        </div>
                      )}
                      <p className="text-gray-700 leading-relaxed">{level.description}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900">Requirements</h4>
                      <ul className="space-y-2">
                        {level.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-gray-700 flex items-start">
                            <span className="text-green-500 mr-3 mt-1 text-lg flex-shrink-0">
                              ✓
                            </span>
                            <span className="text-sm leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {index < levels.length - 1 && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">Next Level</div>
                        <div className="text-lg font-semibold text-blue-600">{level.nextLevel}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector */}
                {index < levels.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block relative">
            {/* Central Ladder Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500 transform -translate-x-1/2"></div>

            <div className="space-y-16">
              {levels.map((level, index) => (
                <div key={level.id} className="relative">
                  <div
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Content Side */}
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-xl">
                        <div className="flex items-start mb-6">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${level.gradient} rounded-full flex items-center justify-center flex-shrink-0 mr-4`}
                          >
                            <div className="text-white">{level.icon}</div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.title}</h3>
                            {level.timeframe && (
                              <div className="inline-block bg-blue-100 rounded-full px-4 py-1 text-sm text-blue-700 font-medium">
                                {level.timeframe}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">{level.description}</p>

                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-gray-900">Requirements</h4>
                          <ul className="space-y-2">
                            {level.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="text-gray-700 flex items-start">
                                <span className="text-green-500 mr-3 mt-1 text-lg flex-shrink-0">
                                  ✓
                                </span>
                                <span className="text-sm leading-relaxed">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {index < levels.length - 1 && (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">Next Level</div>
                            <div className="text-lg font-semibold text-blue-600">
                              {level.nextLevel}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Center Circle */}
                    <div className="w-2/12 flex justify-center z-10">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${level.gradient} rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110`}
                      >
                        <span className="text-white font-bold text-2xl">{level.id}</span>
                      </div>
                    </div>

                    {/* Empty Side */}
                    <div className="w-5/12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Whether you're interested in technology or design, we have a path for you. Explore our
            training programs and start making an impact today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/training-plan"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Global Admin Track
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
            </a>
            <a
              href="/canva-designer-path"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Canva Designer Track
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
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
