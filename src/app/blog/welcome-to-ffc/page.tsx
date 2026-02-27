import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Welcome to Free For Charity',
  description:
    'Learn how Free For Charity trains volunteers to build free websites for 501(c)(3) nonprofits — and how you can get involved.',
  keywords: [
    'free nonprofit website',
    'volunteer web development',
    'charity website builder',
    '501c3 free website',
    'nonprofit technology volunteer',
  ],
}

export default function WelcomeToFFC() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Welcome to Free For Charity',
    description:
      'Learn how Free For Charity trains volunteers to build free websites for 501(c)(3) nonprofits.',
    datePublished: '2026-02-24',
    author: { '@type': 'Organization', name: 'Free For Charity' },
    publisher: {
      '@type': 'Organization',
      name: 'Free For Charity',
      url: 'https://ffcadmin.org',
    },
    url: 'https://ffcadmin.org/blog/welcome-to-ffc/',
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
          { label: 'Welcome to Free For Charity' },
        ]}
      />

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                announcement
              </span>
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                mission
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Free For Charity
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>FFC Team</span>
              <time dateTime="2026-02-24">February 24, 2026</time>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed">
              Free For Charity exists because every nonprofit deserves a professional web presence —
              regardless of budget. Since 2013, we have provided free websites, domain management,
              and email hosting for verified 501(c)(3) organizations across the United States.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Nonprofits do incredible work feeding communities, sheltering families, educating
              children, and protecting the environment. But many small charities cannot afford
              professional websites, domain registration, or managed email. They end up with
              outdated WordPress sites, free-tier hosting that disappears, or no web presence at
              all.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Free For Charity bridges that gap. We provide enterprise-grade infrastructure — custom
              domains, Cloudflare CDN, managed DNS, Microsoft 365 email — completely free of charge.
              Our volunteers build modern, accessible websites using Next.js and deploy them to
              GitHub Pages with automated CI/CD pipelines.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Makes Us Different</h2>
            <p className="text-gray-700 leading-relaxed">
              Many organizations offer website builders or templates. We go further:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0"
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
                <span className="text-gray-700">
                  <strong>Full-stack hosting:</strong> Domain registration, DNS management, SSL
                  certificates, CDN, and email — all managed for free.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0"
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
                <span className="text-gray-700">
                  <strong>Modern technology:</strong> Sites built with Next.js, React, and Tailwind
                  CSS — not decade-old WordPress themes.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0"
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
                <span className="text-gray-700">
                  <strong>Volunteer-powered:</strong> Every site is built and maintained by trained
                  volunteers who learn real-world skills in the process.
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0"
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
                <span className="text-gray-700">
                  <strong>Long-term commitment:</strong> We do not just build and leave. FFC
                  maintains, updates, and secures every site for as long as the charity needs it.
                </span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How You Can Help</h2>
            <p className="text-gray-700 leading-relaxed">
              We are always looking for volunteers. Whether you are a seasoned developer, a design
              student, or someone who wants to learn IT administration, there is a place for you at
              FFC.
            </p>
            <p className="text-gray-700 leading-relaxed">We offer two volunteer tracks:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-6">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-1">Global Administrator</h3>
                <p className="text-sm text-gray-600">
                  Manage Microsoft 365, GitHub, Cloudflare, and DNS for all FFC charity sites. Earn
                  industry certifications along the way.
                </p>
                <Link
                  href="/training-plan"
                  className="text-sm text-teal-600 hover:text-teal-800 font-medium mt-2 inline-block"
                >
                  View training plan &rarr;
                </Link>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-1">Canva Designer</h3>
                <p className="text-sm text-gray-600">
                  Create brand kits, social media templates, and marketing materials for nonprofits
                  using Canva Pro.
                </p>
                <Link
                  href="/canva-designer-path"
                  className="text-sm text-orange-600 hover:text-orange-800 font-medium mt-2 inline-block"
                >
                  View designer path &rarr;
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What Happens Next</h2>
            <p className="text-gray-700 leading-relaxed">
              This blog is our space to share stories, celebrate volunteer achievements, and
              document the journey of building technology for good. Expect posts about volunteer
              spotlights, training milestones, new tools and techniques, and the charities we serve.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you are ready to contribute, head to{' '}
              <Link href="/get-involved" className="text-blue-600 hover:underline">
                Get Involved
              </Link>{' '}
              to choose your track. If you want to see what we have built, check out the{' '}
              <Link href="/sites-list" className="text-blue-600 hover:underline">
                Sites List
              </Link>{' '}
              for a live view of every charity website FFC manages.
            </p>
          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Continue Reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/blog/volunteer-spotlight-web-development"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-gray-900">Volunteer Spotlight: Web Development</p>
                <p className="text-sm text-gray-600 mt-1">
                  Meet the volunteers who build nonprofit websites.
                </p>
              </Link>
              <Link
                href="/blog/day-in-the-life-global-admin"
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-gray-900">A Day in the Life of a Global Admin</p>
                <p className="text-sm text-gray-600 mt-1">
                  What an FFC administrator actually does day-to-day.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
