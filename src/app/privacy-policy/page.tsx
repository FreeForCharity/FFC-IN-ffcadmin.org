import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Free For Charity Admin',
  description: 'Privacy Policy for Free For Charity administrative portal',
}

// Update this date when the policy changes
const LAST_UPDATED = 'November 16, 2025'

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
            <section>
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

            <section>
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

            <section>
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

            <section>
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
                  <strong>Marketing Cookies:</strong> Used to track visitors across websites for
                  advertising purposes (Meta Pixel). Requires consent.
                </li>
              </ul>
              <p>
                For more detailed information about cookies, please see our{' '}
                <a href="/cookie-policy" className="text-blue-600 hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
            </section>

            <section>
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
                <li>
                  <strong>Meta Pixel:</strong> Marketing and advertising analytics (only with
                  consent)
                </li>
              </ul>
              <p>
                These third parties have their own privacy policies. We encourage you to review
                their policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p>
                We retain collected information for as long as necessary to fulfill the purposes
                outlined in this Privacy Policy, unless a longer retention period is required or
                permitted by law. Cookie consent preferences are stored for 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                7.1 GDPR Rights (EU Residents)
              </h3>
              <p className="mb-4">
                If you are in the European Union, you have the following rights:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent at any time</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                7.2 CCPA/CPRA Rights (California Residents)
              </h3>
              <p className="mb-4">
                If you are a California resident, you have the following rights:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or shared and to whom</li>
                <li>Right to opt-out of the sale or sharing of personal information</li>
                <li>Right to delete personal information</li>
                <li>Right to correct inaccurate personal information</li>
                <li>Right to limit use of sensitive personal information</li>
                <li>Right to non-discrimination for exercising your rights</li>
              </ul>

              <p className="mb-4">
                <strong>Do Not Sell or Share My Personal Information:</strong> We do not sell
                personal information. When you decline analytics and marketing cookies, we do not
                share your information with third-party analytics or advertising services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect
                your personal information. However, no method of transmission over the internet or
                electronic storage is 100% secure. While we strive to protect your information, we
                cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p>
                Our Site is not intended for children under 16 years of age. We do not knowingly
                collect personal information from children under 16. If you believe we have
                collected information from a child under 16, please contact us immediately.
              </p>
            </section>

            <section>
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

            <section>
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

            <section>
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
          </div>
        </div>
      </div>
    </div>
  )
}
