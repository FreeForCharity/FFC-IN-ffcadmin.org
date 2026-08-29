import Link from 'next/link'
import type { Metadata } from 'next'
import PolicyCrossLinks from '@/components/PolicyCrossLinks'
import PolicyTOC from '@/components/PolicyTOC'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/privacy-policy/' },
  title: 'Privacy Policy',
  description:
    'Privacy Policy for ffcadmin.org. How we collect, use, and protect your data. GDPR and CCPA/CPRA compliant.',
}

// Update this date when the policy changes
const LAST_UPDATED = 'August 29, 2026'

// Table of contents — keep in sync with the section ids below.
const TOC = [
  { n: 1, label: 'Introduction' },
  { n: 2, label: 'Information We Collect' },
  { n: 3, label: 'How We Use Your Information' },
  { n: 4, label: 'Cookies and Tracking Technologies' },
  { n: 5, label: 'Third-Party Services' },
  { n: 6, label: 'Data Retention' },
  { n: 7, label: 'Your Privacy Rights' },
  { n: 8, label: 'Data Security' },
  { n: 9, label: "Children's Privacy" },
  { n: 10, label: 'International Data Transfers' },
  { n: 11, label: 'Changes to This Privacy Policy' },
  { n: 12, label: 'Contact Us' },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-blue-100 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-8 text-gray-700">
            <PolicyTOC items={TOC} />

            <section id="section-1" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="mb-4">
                Free For Charity ("we", "our", or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website ffcadmin.org (the "Site"). Please read this
                privacy policy carefully. If you do not agree with the terms of this privacy policy,
                please do not access the site.
              </p>
              <p>
                We comply with applicable privacy laws including the General Data Protection
                Regulation (GDPR) for users in the European Union, the California Consumer Privacy
                Act (CCPA), and the California Privacy Rights Act (CPRA) for California residents.
              </p>
            </section>

            <section id="section-2" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.1 Information You Provide
              </h3>
              <p className="mb-4">
                Currently, our website does not require users to create accounts or provide personal
                information directly. However, you may voluntarily provide information when
                contacting us for support.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="mb-4">
                When you visit our Site, we may automatically collect certain information about your
                device, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address (anonymized)</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Date and time of visit</li>
              </ul>
              <p>
                This information is collected only if you have provided consent through our cookie
                consent banner.
              </p>
            </section>

            <section id="section-3" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Operate, maintain, and improve our website</li>
                <li>Understand how visitors use our site</li>
                <li>Analyze site traffic and user behavior (with consent)</li>
                <li>Respond to support requests and communications</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section id="section-4" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Cookies and Tracking Technologies
              </h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track activity on our Site. You
                can control cookie preferences through our cookie consent banner that appears when
                you first visit the site.
              </p>
              <p className="mb-4">Types of cookies we use:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Necessary Cookies:</strong> Essential for the website to function
                  properly. These cannot be disabled.
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how visitors interact with
                  our website (Google Analytics, Microsoft Clarity). Requires consent.
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Would be used to track visitors across
                  websites for advertising. We do not currently use any; reserved for future use and
                  would require consent.
                </li>
              </ul>
              <p>
                For more detailed information about cookies, please see our{' '}
                <Link href="/cookie-policy" className="text-blue-600 hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </section>

            <section id="section-5" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="mb-4">
                We may use third-party services that collect, monitor, and analyze data:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Google Analytics:</strong> Web analytics service (only with consent)
                </li>
                <li>
                  <strong>Microsoft Clarity:</strong> User behavior analytics (only with consent)
                </li>
              </ul>
              <p>
                These third parties have their own privacy policies. We encourage you to review
                their policies.
              </p>
            </section>

            <section id="section-6" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p>
                We retain collected information for as long as necessary to fulfill the purposes
                outlined in this Privacy Policy, unless a longer retention period is required or
                permitted by law. Cookie consent preferences are stored for 12 months.
              </p>
            </section>

            <section id="section-7" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                7.1 Your Rights in the European Union, United Kingdom, and EEA (GDPR)
              </h3>
              <p className="mb-4">
                If you visit from the European Union, the United Kingdom, or the wider European
                Economic Area, the EU General Data Protection Regulation (GDPR) or the UK GDPR
                applies to our handling of your personal data, and this section supplements the rest
                of this policy.
              </p>
              <p className="mb-4">
                <strong>Legal bases.</strong> We process personal data only on these bases:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Consent</strong> — analytics and marketing cookies are off until you opt
                  in through the cookie consent banner. You can withdraw consent at any time via the
                  Cookie Preferences link in the footer; this site then stops those scripts and
                  removes the tracking cookies it set.
                </li>
                <li>
                  <strong>Legitimate interests</strong> — operating, securing, and improving this
                  website (for example, essential cookies and server logs), balanced against your
                  rights.
                </li>
                <li>
                  <strong>Legal obligation</strong> — where processing is required to comply with
                  applicable law.
                </li>
              </ul>
              <p className="mb-4">
                <strong>Your rights.</strong> You have the right to: access the personal data we
                hold about you; have inaccurate data rectified; have your data erased; restrict or
                object to processing; receive your data in a portable format; and withdraw any
                consent you have given, at any time, without affecting the lawfulness of processing
                before withdrawal.
              </p>
              <p className="mb-4">
                <strong>Exercising your rights and complaints.</strong> Contact us at{' '}
                <a
                  href="mailto:privacy@freeforcharity.org"
                  className="text-blue-600 hover:underline"
                >
                  privacy@freeforcharity.org
                </a>{' '}
                to exercise any of these rights; we will respond within the time limits the GDPR
                sets. You also have the right to lodge a complaint with your national data
                protection supervisory authority (in the UK, the Information Commissioner's Office).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                7.2 Your California Privacy Rights (CCPA/CPRA)
              </h3>
              <p className="mb-4">
                If you are a California resident, the California Consumer Privacy Act, as amended by
                the California Privacy Rights Act (CCPA/CPRA), gives you specific rights, and this
                section supplements the rest of this policy.
              </p>
              <p className="mb-4">
                <strong>We do not sell or share your personal information.</strong> Free For Charity
                does not sell personal information, and does not share it for cross-context
                behavioral advertising, as those terms are defined by California law — and has not
                done so in the preceding 12 months. We do not knowingly collect or sell the personal
                information of anyone under 16. We do not collect sensitive personal information
                beyond what is necessary to provide this website and our services, and we do not use
                it to infer characteristics about you.
              </p>
              <p className="mb-4">
                <strong>Your rights.</strong> You have the right to: know what personal information
                we collect, use, and disclose, and to access it; delete personal information we
                collected from you; correct inaccurate personal information; opt out of any sale or
                sharing of personal information (not applicable, since we do neither); limit the use
                of sensitive personal information; and not be discriminated against for exercising
                any of these rights.
              </p>
              <p className="mb-4">
                <strong>Opt-out preference signals (Global Privacy Control / Do Not Track).</strong>{' '}
                Tracking on this site is opt-in for every visitor, everywhere: analytics and
                marketing cookies stay off until you accept them, and declining or withdrawing
                consent keeps you — or returns you — to that untracked state. Because we also do not
                sell or share personal information, every visitor already receives at least the
                protection a Global Privacy Control or Do Not Track signal would request.
              </p>
              <p className="mb-4">
                <strong>Exercising your rights.</strong> Submit a request to{' '}
                <a
                  href="mailto:privacy@freeforcharity.org"
                  className="text-blue-600 hover:underline"
                >
                  privacy@freeforcharity.org
                </a>
                . We will verify your request using information associated with your interactions
                with us, and you may use an authorized agent to submit a request on your behalf. We
                will respond within the timeframes California law requires.
              </p>
            </section>

            <section id="section-8" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect
                your personal information. However, no method of transmission over the internet or
                electronic storage is 100% secure. While we strive to protect your information, we
                cannot guarantee its absolute security.
              </p>
            </section>

            <section id="section-9" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p>
                Our Services are intended for adults: you must be at least 18 years old to use them
                (see{' '}
                <Link href="/terms-of-service#section-3" className="text-blue-600 hover:underline">
                  Terms of Service, Section 3
                </Link>
                ). Our Site is not directed to children, and we do not knowingly collect personal
                information from anyone under 18. If you believe we have collected information from
                a minor, please contact us immediately and we will delete it.
              </p>
            </section>

            <section id="section-10" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and processed in countries other than your
                country of residence. These countries may have data protection laws that are
                different from the laws of your country. We take appropriate safeguards to ensure
                your information remains protected.
              </p>
            </section>

            <section id="section-11" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new Privacy Policy on this page and updating the "Last
                Updated" date. You are advised to review this Privacy Policy periodically for any
                changes.
              </p>
            </section>

            <section id="section-12" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy or wish to exercise your privacy
                rights, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <strong>Free For Charity</strong>
                </p>
                <p className="mb-2">
                  Email:{' '}
                  <a
                    href="mailto:privacy@freeforcharity.org"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@freeforcharity.org
                  </a>
                </p>
                <p className="mb-2">Emergency Contact: Clarke Moyer</p>
                <p>
                  Phone:{' '}
                  <a href="tel:520-222-8104" className="text-blue-600 hover:underline">
                    520-222-8104
                  </a>
                </p>
              </div>
            </section>

            <PolicyCrossLinks current="/privacy-policy" />
          </div>
        </div>
      </div>
    </div>
  )
}
