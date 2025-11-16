import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Free For Charity Admin',
  description: 'Cookie Policy for Free For Charity administrative portal',
}

// Update this date when the policy changes
const LAST_UPDATED = 'November 16, 2025'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your device when you visit a website. They are 
              widely used to make websites work more efficiently and provide information to website owners. 
              Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after 
              you close your browser, while session cookies are deleted when you close your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">
              When you visit our website, we use cookies to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Remember your cookie consent preferences</li>
              <li>Understand how you use our website (with your consent)</li>
              <li>Analyze website traffic and user behavior (with your consent)</li>
              <li>Improve our website and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Necessary Cookies (Always Active)</h3>
                <p className="mb-4">
                  These cookies are essential for the website to function properly. They enable basic features 
                  like storing your cookie consent preferences. These cookies do not store any personally 
                  identifiable information and cannot be disabled.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Cookie Name</th>
                        <th className="text-left py-2 pr-4">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-mono">cookie-consent</td>
                        <td className="py-2 pr-4">Stores your cookie preferences</td>
                        <td className="py-2">12 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Analytics Cookies (Requires Consent)</h3>
                <p className="mb-4">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously. We use this information to improve our website and user 
                  experience.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm mb-2">
                    Google Analytics is a web analytics service offered by Google that tracks and reports website 
                    traffic. We use Google Analytics to understand how users interact with our website.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Cookie Name</th>
                        <th className="text-left py-2 pr-4">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-mono">_ga</td>
                        <td className="py-2 pr-4">Distinguishes unique users</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-mono">_ga_*</td>
                        <td className="py-2 pr-4">Maintains session state</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">_gid</td>
                        <td className="py-2 pr-4">Distinguishes users</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs mt-2 text-gray-600">
                    Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://policies.google.com/privacy</a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Microsoft Clarity</h4>
                  <p className="text-sm mb-2">
                    Microsoft Clarity is a user behavior analytics tool that helps us understand how users interact 
                    with our website through session recordings and heatmaps.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Cookie Name</th>
                        <th className="text-left py-2 pr-4">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-mono">_clck</td>
                        <td className="py-2 pr-4">Persists Clarity User ID</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">_clsk</td>
                        <td className="py-2 pr-4">Session cookie</td>
                        <td className="py-2">1 day</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs mt-2 text-gray-600">
                    Privacy Policy: <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://privacy.microsoft.com/privacystatement</a>
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Marketing Cookies (Requires Consent)</h3>
                <p className="mb-4">
                  These cookies are used to track visitors across websites. The intention is to display ads that 
                  are relevant and engaging for users and thereby more valuable for publishers and advertisers.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Meta Pixel (Facebook Pixel)</h4>
                  <p className="text-sm mb-2">
                    The Meta Pixel is an analytics tool that helps us measure the effectiveness of advertising by 
                    understanding the actions people take on our website.
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Cookie Name</th>
                        <th className="text-left py-2 pr-4">Purpose</th>
                        <th className="text-left py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 pr-4 font-mono">_fbp</td>
                        <td className="py-2 pr-4">Tracks user behavior for advertising</td>
                        <td className="py-2">3 months</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 font-mono">fr</td>
                        <td className="py-2 pr-4">Enables ad delivery and targeting</td>
                        <td className="py-2">3 months</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs mt-2 text-gray-600">
                    Privacy Policy: <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.facebook.com/privacy/policy/</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How to Manage Cookies</h2>
            <p className="mb-4">
              You have several options for managing cookies:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Cookie Consent Banner</h3>
            <p className="mb-4">
              When you first visit our website, you'll see a cookie consent banner. You can:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Accept All:</strong> Allow all cookies including analytics and marketing</li>
              <li><strong>Decline All:</strong> Only essential cookies will be used</li>
              <li><strong>Customize:</strong> Choose which types of cookies you want to allow</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Browser Settings</h3>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific websites</li>
              <li>Block all cookies from being set</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p className="mb-4">
              Please note that if you block all cookies, you may not be able to use all features of our website.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Opt-Out Links</h3>
            <p className="mb-4">You can opt out of specific third-party cookies:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>
                <strong>Google Analytics:</strong>{' '}
                <a 
                  href="https://tools.google.com/dlpage/gaoptout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
              <li>
                <strong>Meta (Facebook):</strong>{' '}
                <a 
                  href="https://www.facebook.com/settings/?tab=ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Facebook Ad Settings
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Do Not Track Signals</h2>
            <p>
              Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to have 
              your online activities tracked. At this time, we do not respond to browser "Do Not Track" signals. 
              However, you can control cookies through our cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Updates to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. Please review this policy periodically for changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><strong>Free For Charity</strong></p>
              <p className="mb-2">Email: <a href="mailto:privacy@freeforcharity.org" className="text-blue-600 hover:underline">privacy@freeforcharity.org</a></p>
              <p className="mb-2">Emergency Contact: Clarke Moyer</p>
              <p>Phone: <a href="tel:520-222-8104" className="text-blue-600 hover:underline">520-222-8104</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. More Information</h2>
            <p className="mb-4">
              For more information about how we handle your personal data, please see our{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
