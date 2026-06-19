import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/blog/volunteer-spotlight-web-development/' },
  title: 'Volunteer Spotlight: Building Websites for Nonprofits',
  description:
    'Meet the volunteers who donate their web development skills to help charities go online with professional, secure websites.',
  keywords: [
    'volunteer web developer',
    'nonprofit website volunteer',
    'open source charity projects',
    'volunteer spotlight',
    'IT volunteer nonprofit',
  ],
}

export default function VolunteerSpotlightWebDev() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Volunteer Spotlight: Building Websites for Nonprofits',
    description:
      'Meet the volunteers who donate their web development skills to help charities go online.',
    datePublished: '2026-02-24',
    author: { '@type': 'Organization', name: 'Free For Charity' },
    publisher: {
      '@type': 'Organization',
      name: 'Free For Charity',
      url: 'https://ffcadmin.org',
    },
    url: 'https://ffcadmin.org/blog/volunteer-spotlight-web-development/',
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
          { label: 'Volunteer Spotlight: Web Development' },
        ]}
      />

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                volunteer
              </span>
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                spotlight
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Volunteer Spotlight: Building Websites for Nonprofits
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>FFC Team</span>
              <time dateTime="2026-02-24">February 24, 2026</time>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed">
              Every charity website in the FFC network was built by a volunteer. Not an agency, not
              an AI tool, not a template factory — a real person who chose to spend their time
              helping a nonprofit get online. Here is what that looks like.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Why Developers Volunteer with FFC
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For many volunteers, FFC is where theory meets practice. Computer science students get
              to ship production code. Career changers build a portfolio of real-world projects.
              Experienced developers give back while mentoring the next generation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The common thread is impact. When you build a website for a food bank or a youth
              mentoring program, that site helps real people find real services. It is not a toy
              project or a tutorial exercise — it is a working product that a charity depends on.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              What a Typical Project Looks Like
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Most FFC website projects follow a consistent workflow:
            </p>
            <ol className="space-y-4 mt-4 list-none pl-0">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-gray-900">Discovery:</strong>{' '}
                  <span className="text-gray-700">
                    The charity submits a request through{' '}
                    <a
                      href="https://freeforcharity.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      freeforcharity.org
                    </a>
                    . A Global Admin reviews the 501(c)(3) status and sets up the domain, DNS, and
                    email infrastructure.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-gray-900">Design:</strong>{' '}
                  <span className="text-gray-700">
                    A Canva Designer creates the brand kit — logo, color palette, social media
                    templates. This gives the charity a consistent visual identity from day one.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-gray-900">Development:</strong>{' '}
                  <span className="text-gray-700">
                    A web developer builds the site using Next.js, React, and Tailwind CSS. The site
                    is deployed to GitHub Pages with Cloudflare CDN in front.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-gray-900">Launch & Maintenance:</strong>{' '}
                  <span className="text-gray-700">
                    The site goes live. FFC handles ongoing DNS management, SSL renewals, security
                    monitoring, and content updates.
                  </span>
                </div>
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Skills You Will Build</h2>
            <p className="text-gray-700 leading-relaxed">
              FFC volunteers do not just write code. They learn the full stack of modern web
              development and cloud operations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Frontend</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Next.js App Router & static export</li>
                  <li>React components & hooks</li>
                  <li>Tailwind CSS responsive design</li>
                  <li>Accessibility (WCAG 2.1)</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">DevOps & Infrastructure</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>GitHub Actions CI/CD</li>
                  <li>Cloudflare DNS & CDN</li>
                  <li>GitHub Pages deployment</li>
                  <li>Automated testing (Jest, Playwright)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">The Impact</h2>
            <p className="text-gray-700 leading-relaxed">
              As of February 2026, FFC manages websites and domains for dozens of 501(c)(3)
              organizations. Each site saves that charity thousands of dollars per year in hosting,
              domain registration, email, and development costs. More importantly, it gives them a
              credible, professional presence that helps them raise funds, attract volunteers, and
              serve their communities.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can see every site we manage on the{' '}
              <Link href="/sites-list" className="text-blue-600 hover:underline">
                Sites List
              </Link>
              .
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Get Started</h2>
            <p className="text-gray-700 leading-relaxed">
              Ready to build something that matters? Start with the{' '}
              <Link href="/get-involved" className="text-blue-600 hover:underline">
                Get Involved
              </Link>{' '}
              page to choose your track, then work through the{' '}
              <Link href="/contributor-ladder" className="text-blue-600 hover:underline">
                Contributor Ladder
              </Link>{' '}
              to grow from Contributor to Maintainer. If you have development experience, the{' '}
              <Link
                href="/guides/wordpress-to-nextjs-guide"
                className="text-blue-600 hover:underline"
              >
                WordPress to Next.js Conversion Guide
              </Link>{' '}
              is the fastest way to start shipping charity websites.
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
