'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section with 5 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Endorsements */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Endorsements</h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                <p className="mb-2">GuideStar Platinum Transparency 2024</p>
                <p className="text-xs">Free For Charity EIN: 46-2471893</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tech-stack"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Technology Stack
                </Link>
              </li>
            </ul>
          </div>

          {/* Free For Charity Policy */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Free For Charity Policy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <button
                  onClick={() => (window as any).openCookiePreferences?.()}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                  aria-label="Open cookie preferences dialog"
                >
                  Manage Cookie Preferences
                </button>
              </li>
              <li>
                <a
                  href="https://freeforcharity.org/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="https://freeforcharity.org/vulnerability-disclosure-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Vulnerability Disclosure Policy
                </a>
              </li>
              <li>
                <a
                  href="https://freeforcharity.org/security-acknowledgement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Security Acknowledgement
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Documentation */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Admin Documentation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/documentation"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex items-start space-x-2 mb-2">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-white">E-mail</p>
                    <a
                      href="mailto:clarkemoyer@freeforcharity.org"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      clarkemoyer@freeforcharity.org
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start space-x-2 mb-2">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-white">Call Us Today</p>
                    <a
                      href="tel:520-222-8104"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      (520) 222-8104
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start space-x-2 mb-2">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-white">Main Address</p>
                    <p className="text-gray-400">4030 Wake Forest Road Suite 349</p>
                    <p className="text-gray-400">Raleigh NC 27609</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-white">PA Office Address</p>
                    <p className="text-gray-400">301 Science Park Rd Suite 119</p>
                    <p className="text-gray-400">State College PA 16803</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              All Rights Are Reserved by Free For Charity, a US 501(c)(3) Non Profit
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com/FreeForCharity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Visit Free For Charity on Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@FreeForCharity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Visit Free For Charity on YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/FreeForCharity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Follow Free For Charity on Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/freeforcharity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Connect with Free For Charity on LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
