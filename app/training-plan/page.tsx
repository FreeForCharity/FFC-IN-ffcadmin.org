'use client'

import { TRAINING_CURRICULUM } from './data'
import { useTrainingProgress } from './hooks/useTrainingProgress'
import { ProgressBar } from './components/ProgressBar'
import { TrainingSection } from './components/TrainingSection'

export default function TrainingPlan() {
  // Calculate total directives for progress tracking
  const totalDirectives = TRAINING_CURRICULUM.reduce(
    (total, phase) =>
      total + phase.blocks.reduce((blockTotal, block) => blockTotal + block.directives.length, 0),
    0
  )

  const { completedItems, toggleItem, resetProgress, progressPercentage, isLoaded } =
    useTrainingProgress(totalDirectives)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold">Global Admin Training Plan</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Operation Digital Sovereignty - Forge a dual-hatted leader with Global Administrator and
            Code Owner authority
          </p>
        </div>
      </div>

      {isLoaded && <ProgressBar percentage={progressPercentage} onReset={resetProgress} />}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Executive Summary */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="border-l-4 border-blue-600 pl-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Executive Summary: Operation Digital Sovereignty
            </h2>
            <p className="text-gray-600 italic">Commander,</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              Per your directive, the following is the reconstituted and fully integrated
              operational training plan for the Global Administrator and Code Owner track. This plan
              has been restructured to align with the specific "Free for Charity" operational tempo.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
              <p className="text-blue-900 font-semibold mb-2">Mission Objective:</p>
              <p className="text-blue-900">
                To forge a dual-hatted leader capable of holding full Global Administrator authority
                over the Microsoft 365 tenant and Owner rights over the GitHub Organization.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Operational Overview:</h3>
            <ul className="space-y-3 mb-6">
              <li className="text-gray-700">
                <strong className="text-blue-600">Phase 1 (The Administrative Beachhead):</strong>{' '}
                Focuses on Microsoft 365 identity, security, and governance. Candidates must pass a
                simulated validation (MS-900 practice) before being granted live "Global Admin" keys
                to the charity tenant. The phase concludes with the actual MS-900 certification.
              </li>
              <li className="text-gray-700">
                <strong className="text-blue-600">Phase 2 (The Code Supremacy Campaign):</strong>{' '}
                Focuses on GitHub proficiency, specifically leveraging "Vibe Coding" (AI-driven
                development) to transform Global Admin-written Issues directly into Pull Requests.
                This phase concludes with the GitHub Foundations certification and the launch of the
                charity's digital presence.
              </li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <p className="text-green-900">
                <strong>Logistics Note:</strong> Test vouchers for both MS-900 and GitHub
                Foundations are fully funded at nonprofit/student rates.
              </p>
            </div>
          </div>
        </section>

        {/* Quartermaster's Report */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Detailed Analysis: Logistics and Licensing
          </h2>
          <p className="text-gray-700 mb-6">
            Before deployment, the following Quartermaster's report outlines the necessary tooling
            and financial requirements to support the "Vibe Stack" (AI-augmented administration).
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Quartermaster's Report: Licensing & Costs
          </h3>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
              <caption className="sr-only">
                Licensing costs and operational notes for Free For Charity products
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Product / License
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Tactical Purpose
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Standard Price (Annual)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Nonprofit / FFC Price (Annual)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Operational Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    Microsoft 365 Business Premium
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    Full Tenant Command, Intune, Defender, Conditional Access
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $264.00 /user/year
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    $66.00 /user/year (75% discount)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Primary command infrastructure. Note: 300 free Business Basic accounts available
                    but not suitable for Global Admins
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    GitHub Team (Organization)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    "Owner" status, branch protection, repo management
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $48.00 /user/year
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    $0.00 (Unlimited seats)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Requires "GitHub for Nonprofits" application
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    GitHub Copilot Pro
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    "Vibe Coding," CLI assistance, Automated PRs
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $100.00 /user/year
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-red-600 border-r border-gray-300">
                    $100.00 /user/year
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Hard Cost. Essential for the "Issue-to-PR" workflow
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    Microsoft 365 Copilot
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    "Vibe Working," AI in Office/Teams, Agent building
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $360.00 /user/year
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-yellow-600 border-r border-gray-300">
                    $306.00 /user/year
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Strategic augmentation. Requires base license
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    Cloudflare (Project Galileo)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    WAF, DDoS protection, Page Rules
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $240 - $2,400 /year
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    $0.00
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Project Galileo application required for full suite
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    LastPass Teams/Business
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    Secure "Break Glass" vault
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $48.00 - $84.00 /user/year
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-yellow-600 border-r border-gray-300">
                    ~30% Discount
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Contact Sales for "Impact Program"
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Certification Costs (One-Time Investment)
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
              <caption className="sr-only">
                Certification exam costs with standard, student, and nonprofit pricing
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Certification
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Standard Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Student Discount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Nonprofit Discount
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    Microsoft 365 Fundamentals (MS-900)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $99.00
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    Available
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    Available
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Voucher fully funded at discounted rate
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    GitHub Foundations
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $99.00
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    $0.00 with GitHub Student Pack
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    Available
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <strong>FREE</strong> with GitHub Student Developer Pack. Voucher fully funded
                    at discounted rate otherwise.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mt-6">
            <p className="text-blue-900 font-semibold mb-2">Cost Optimization Notes:</p>
            <ul className="space-y-2 text-blue-900">
              <li>
                • All pricing reflects <strong>annual billing</strong> to maximize available
                discounts
              </li>
              <li>
                • GitHub Foundations certification is <strong>free of charge</strong> when obtained
                through the GitHub Student Developer Pack
              </li>
              <li>
                • Test vouchers for both certifications are fully funded at nonprofit/student rates
              </li>
            </ul>
          </div>
        </section>

        {/* Interactive Curriculum */}
        {TRAINING_CURRICULUM.map((phase) => (
          <section key={phase.id} className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div
              className={`border-l-4 ${phase.id === 'phase-1' ? 'border-indigo-600' : 'border-purple-600'} pl-6 mb-6`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{phase.title}</h2>
              <p className="text-gray-600">
                <strong>Mission:</strong> {phase.mission}
              </p>
              <p className="text-gray-600">
                <strong>End State:</strong> {phase.endState}
              </p>
            </div>

            {phase.blocks.map((block) => (
              <TrainingSection
                key={block.id}
                block={block}
                completedItems={completedItems}
                onToggle={toggleItem}
              />
            ))}

            {phase.finalGate && (
              <div
                className={`bg-${phase.id === 'phase-1' ? 'indigo' : 'purple'}-50 border-2 border-${phase.id === 'phase-1' ? 'indigo' : 'purple'}-600 p-6 rounded-lg`}
              >
                <h3
                  className={`text-xl font-bold text-${phase.id === 'phase-1' ? 'indigo' : 'purple'}-900 mb-3`}
                >
                  {phase.finalGate.title}
                </h3>
                <ul className="space-y-2">
                  <li className={`text-${phase.id === 'phase-1' ? 'indigo' : 'purple'}-900`}>
                    <strong>Mission:</strong> {phase.finalGate.mission}
                    {phase.finalGate.link && (
                      <>
                        {' '}
                        <a
                          href={phase.finalGate.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {phase.finalGate.link.label}
                        </a>
                      </>
                    )}
                  </li>
                  <li className={`text-${phase.id === 'phase-1' ? 'indigo' : 'purple'}-900`}>
                    <strong>Support:</strong> {phase.finalGate.support}
                  </li>
                </ul>
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  )
}
