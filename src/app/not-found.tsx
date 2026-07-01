import type { Metadata } from 'next'
import Link from 'next/link'
import OpenSearchButton from '@/components/OpenSearchButton'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you were looking for doesn’t exist or has moved. Search the site or jump to a popular destination.',
}

const POPULAR_DESTINATIONS = [
  {
    label: 'Public Roadmap',
    href: '/roadmap',
    description: 'Every charity FFC is helping, at every stage.',
  },
  {
    label: 'Manage My Site',
    href: '/site-owner',
    description: 'Edit and maintain your FFC-built charity website.',
  },
  {
    label: 'Get Involved',
    href: '/get-involved',
    description: 'Ways to volunteer with FFC and how to start.',
  },
  {
    label: 'Guides',
    href: '/guides',
    description: 'Step-by-step how-tos and account setup walkthroughs.',
  },
  {
    label: 'Intake Help',
    href: '/intake-help',
    description: 'Help for charities completing FFC intake.',
  },
  {
    label: 'Documentation',
    href: '/documentation',
    description: 'Browse all project documentation and references.',
  },
]

/**
 * Custom 404 — a recovery point instead of a dead end. Ships as `out/404.html`
 * in the static export, which GitHub Pages (and serve-handler in e2e) serves
 * for any unknown URL. Offers global search plus the most common destinations.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-ffc-gradient text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <p className="text-6xl font-bold" aria-hidden="true">
            404
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Page not found</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-teal-50">
            The page you were looking for doesn’t exist or has moved — some WordPress-era links were
            retired when sites migrated to the new platform.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <OpenSearchButton>Search the site</OpenSearchButton>
            <Link
              href="/"
              className="rounded-lg border border-white/70 px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              Go to the home page
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900">Popular destinations</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_DESTINATIONS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50/40"
            >
              <p className="font-semibold text-gray-900">{d.label}</p>
              <p className="mt-1 text-sm text-gray-600">{d.description}</p>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Looking for an FFC-managed charity site? Check the{' '}
          <Link href="/sites-list" className="text-blue-600 hover:underline">
            sites list
          </Link>
          , or see the{' '}
          <Link href="/legacy-wordpress-administration" className="text-blue-600 hover:underline">
            legacy WordPress administration
          </Link>{' '}
          section for WordPress-era procedures.
        </p>
      </main>
    </div>
  )
}
