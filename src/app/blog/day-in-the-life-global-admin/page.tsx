import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'A Day in the Life of an FFC Global Admin',
  description:
    'What does an FFC Global Administrator actually do? Walk through a typical day of managing Microsoft 365, GitHub, and Cloudflare for nonprofits.',
  keywords: [
    'Microsoft 365 admin volunteer',
    'nonprofit IT volunteer',
    'global admin training',
    'Cloudflare DNS management',
    'GitHub administration nonprofit',
  ],
}

export default function DayInTheLifeGlobalAdmin() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'A Day in the Life of an FFC Global Admin',
    description: 'What does an FFC Global Administrator actually do? Walk through a typical day.',
    datePublished: '2026-02-24',
    author: { '@type': 'Organization', name: 'Free For Charity' },
    publisher: {
      '@type': 'Organization',
      name: 'Free For Charity',
      url: 'https://ffcadmin.org',
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'A Day in the Life of a Global Admin' },
        ]}
      />

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                global admin
              </span>
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                day-in-the-life
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              A Day in the Life of an FFC Global Admin
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>FFC Team</span>
              <time dateTime="2026-02-24">February 24, 2026</time>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed">
              The Global Administrator role at Free For Charity is not a typical IT job. You are the
              person who keeps the lights on for dozens of nonprofit websites — managing everything
              from DNS records to email security to GitHub deployments. Here is what a typical day
              looks like.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Morning: Check the Dashboard
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The day starts with the{' '}
              <Link href="/sites-list" className="text-blue-600 hover:underline">
                Sites List
              </Link>{' '}
              — FFC&apos;s live dashboard of every managed domain. Each site shows its hosting
              status (active, pending, suspended), DNS health, and SSL certificate status. A quick
              scan tells you if anything needs attention.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Most mornings, everything is green. Cloudflare handles SSL renewals automatically,
              GitHub Pages deployments are triggered by CI/CD, and Microsoft 365 runs reliably. But
              when something is yellow or red, that is where the work begins.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Mid-Morning: Onboard a New Charity
            </h2>
            <p className="text-gray-700 leading-relaxed">
              A new 501(c)(3) has been approved through{' '}
              <a
                href="https://freeforcharity.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                freeforcharity.org
              </a>
              . Time to set up their infrastructure. The onboarding checklist looks like this:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">New Charity Onboarding</h3>
              <ol className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <span className="font-mono text-blue-600 mr-2 flex-shrink-0">1.</span>
                  <span>
                    Register the domain (or transfer it) in WHMCS and point nameservers to
                    Cloudflare.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-mono text-blue-600 mr-2 flex-shrink-0">2.</span>
                  <span>
                    Create the Cloudflare zone — configure DNS records, enable Always Use HTTPS, set
                    up page rules.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-mono text-blue-600 mr-2 flex-shrink-0">3.</span>
                  <span>
                    Create the GitHub repository from the FFC template. Configure GitHub Pages and
                    the CI/CD workflow.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-mono text-blue-600 mr-2 flex-shrink-0">4.</span>
                  <span>
                    Set up Microsoft 365 — add the domain to the tenant, configure Exchange Online,
                    create admin and shared mailboxes.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-mono text-blue-600 mr-2 flex-shrink-0">5.</span>
                  <span>
                    Add DNS records for email (MX, SPF, DKIM, DMARC) to the Cloudflare zone.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-mono text-blue-600 mr-2 flex-shrink-0">6.</span>
                  <span>
                    Verify the CNAME record for GitHub Pages and confirm the site is live with SSL.
                  </span>
                </li>
              </ol>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The entire process takes 30-60 minutes for an experienced admin. Everything is
              documented in the{' '}
              <Link href="/training-plan" className="text-blue-600 hover:underline">
                Global Admin Training Plan
              </Link>
              , so new volunteers can follow along step by step.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Afternoon: Security and Maintenance
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The afternoon might involve reviewing security alerts from Microsoft 365 Defender,
              checking Cloudflare analytics for unusual traffic patterns, or reviewing pull requests
              on GitHub. A typical session includes:
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start text-gray-700">
                <svg
                  className="w-5 h-5 text-teal-500 mt-1 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Reviewing Dependabot security alerts and merging dependency updates
              </li>
              <li className="flex items-start text-gray-700">
                <svg
                  className="w-5 h-5 text-teal-500 mt-1 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Checking Microsoft Secure Score and applying recommended security policies
              </li>
              <li className="flex items-start text-gray-700">
                <svg
                  className="w-5 h-5 text-teal-500 mt-1 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Auditing DNS records to ensure SPF, DKIM, and DMARC are correctly configured
              </li>
              <li className="flex items-start text-gray-700">
                <svg
                  className="w-5 h-5 text-teal-500 mt-1 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Reviewing Cloudflare WAF logs for blocked threats and adjusting rules
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Evening: Mentoring and Learning
            </h2>
            <p className="text-gray-700 leading-relaxed">
              One of the best parts of the Global Admin role is mentoring new volunteers. FFC uses a{' '}
              <Link href="/contributor-ladder" className="text-blue-600 hover:underline">
                Contributor Ladder
              </Link>{' '}
              system where new volunteers start as Contributors and progress to Maintainers and
              Mentors. Senior admins review pull requests, answer questions, and help new volunteers
              work through the training plan.
            </p>
            <p className="text-gray-700 leading-relaxed">
              There is also always something new to learn. Microsoft 365 releases new features
              monthly. GitHub Actions evolves rapidly. Cloudflare adds new security capabilities.
              Staying current is part of the role — and FFC supports it by covering the cost of
              certification exams like MS-900 and GitHub Foundations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Tools of the Trade</h2>
            <p className="text-gray-700 leading-relaxed">
              Global Admins work across several platforms daily. Here is the stack:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="font-bold text-gray-900">Microsoft 365</p>
                <p className="text-xs text-gray-600 mt-1">Email, identity, security, compliance</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="font-bold text-gray-900">Cloudflare</p>
                <p className="text-xs text-gray-600 mt-1">DNS, CDN, SSL, WAF, Workers</p>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                <p className="font-bold text-gray-900">GitHub</p>
                <p className="text-xs text-gray-600 mt-1">Repos, Actions, Pages, security</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              You can learn more about the full technology stack on the{' '}
              <Link href="/tech-stack" className="text-blue-600 hover:underline">
                Tech Stack
              </Link>{' '}
              page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Ready to Become a Global Admin?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The{' '}
              <Link href="/training-plan" className="text-blue-600 hover:underline">
                Global Admin Training Plan
              </Link>{' '}
              is a self-paced curriculum that covers everything you need to know — from creating
              your first DNS record to passing the MS-900 certification exam. It is structured as
              interactive checklists so you can track your progress as you go.
            </p>
            <p className="text-gray-700 leading-relaxed">
              No prior IT experience is required. If you can follow instructions and are willing to
              learn, the training plan will get you there. Start with the{' '}
              <Link href="/get-involved" className="text-blue-600 hover:underline">
                Get Involved
              </Link>{' '}
              page to choose your track.
            </p>
          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Continue Reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/blog/welcome-to-ffc"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-gray-900">Welcome to Free For Charity</p>
                <p className="text-sm text-gray-600 mt-1">
                  Learn about our mission and how to get involved.
                </p>
              </Link>
              <Link
                href="/blog/volunteer-spotlight-web-development"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-gray-900">Volunteer Spotlight: Web Development</p>
                <p className="text-sm text-gray-600 mt-1">
                  Meet the volunteers who build nonprofit websites.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
