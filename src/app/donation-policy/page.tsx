import type { Metadata } from 'next'
import PolicyCrossLinks from '@/components/PolicyCrossLinks'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/donation-policy/' },
  title: 'Donation Policy',
  description:
    'Free For Charity Donation Policy — the types of donations we accept, how donations are evaluated and acknowledged, and donor responsibilities.',
}

const LAST_UPDATED = 'June 20, 2026'

export default function DonationPolicy() {
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold">Donation Policy</h1>
          </div>
          <p className="text-blue-100 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Free For Charity, a US 501(c)(3) non-profit organization, is dedicated to improving
                our support to other charitable entities through our various programs and
                initiatives.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Scope and Purpose</h2>
              <p>
                The purpose of this policy is to provide clarity and guidance on the types of
                donations Free For Charity will accept, the process for evaluating and accepting
                donations, and the responsibilities of both the donor and the organization.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Types of Acceptable Donations
              </h2>
              <ul className="space-y-3">
                <li>
                  <strong>Cash Donations:</strong> Cash donations, including checks and electronic
                  transfers, are accepted and encouraged.
                </li>
                <li>
                  <strong>Securities:</strong> Free For Charity accepts publicly traded securities
                  and other forms of marketable securities. Donations of securities will be
                  liquidated promptly upon receipt unless otherwise directed by the Board of
                  Directors.
                </li>
                <li>
                  <strong>Real Estate:</strong> Donations of real estate will be considered on a
                  case-by-case basis. The organization will conduct a thorough evaluation, including
                  environmental assessments, title searches, and market analyses.
                </li>
                <li>
                  <strong>Personal Property:</strong> Tangible personal property, such as art,
                  antiques, and vehicles, may be accepted if deemed useful to the
                  organization&apos;s mission or if the property can be sold for financial gain.
                </li>
                <li>
                  <strong>In-Kind Contributions:</strong> In-kind contributions, including goods and
                  services, are accepted if they fulfill the needs of the organization and align
                  with our mission.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Donor Responsibilities</h2>
              <p>
                Donors are responsible for ensuring that their contributions comply with all
                applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Evaluation and Acceptance Process
              </h2>
              <p className="mb-4">Donations are evaluated through a three-step process:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Initial Review</strong> — an initial assessment of the proposed donation.
                </li>
                <li>
                  <strong>Due Diligence</strong> — further evaluation where needed (e.g. for real
                  estate or significant in-kind gifts).
                </li>
                <li>
                  <strong>Board Approval</strong> — approval by the Board of Directors when
                  necessary.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Donor Acknowledgment and Recognition
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acknowledgment letters confirming receipt.</li>
                <li>
                  Optional public recognition on the website, annual reports, newsletters, and
                  events.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Confidentiality and Privacy
              </h2>
              <p>Free For Charity respects the privacy and confidentiality of our donors.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conflict of Interest</h2>
              <p>
                All individuals involved in the donation process are required to disclose any
                potential conflicts of interest.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Policy Review and Updates
              </h2>
              <p>This donation policy will be reviewed as needed by the Board of Directors.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <strong>Free For Charity</strong> — EIN 46-2471893
                </p>
                <p className="mb-2">
                  Email:{' '}
                  <a
                    href="mailto:clarkemoyer@freeforcharity.org"
                    className="text-blue-600 hover:underline"
                  >
                    clarkemoyer@freeforcharity.org
                  </a>
                </p>
                <p>
                  Phone:{' '}
                  <a href="tel:520-222-8104" className="text-blue-600 hover:underline">
                    520-222-8104
                  </a>
                </p>
              </div>
            </section>

            <PolicyCrossLinks current="/donation-policy" />
          </div>
        </div>
      </div>
    </div>
  )
}
