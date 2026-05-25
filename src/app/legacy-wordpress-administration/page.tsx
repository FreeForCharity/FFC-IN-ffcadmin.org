import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategoryGrid from '@/components/legacy-wordpress-administration/CategoryGrid'
import { LEGACY_WP_ADMIN_CATEGORIES } from '@/data/legacy-wordpress-administration'

const SITE_URL = 'https://ffcadmin.org'

export const metadata: Metadata = {
  // Absolute title keeps the hub consistent with the leaves' "FFC Admin"
  // suffix instead of inheriting the root layout's longer brand string.
  title: { absolute: 'Legacy WordPress Administration | FFC Admin' },
  description:
    'Operations and SOP reference for FFC volunteers, admins, and partner charities still running their own WordPress — hosting, domains, charity onboarding, and volunteer programs.',
  alternates: {
    canonical: `${SITE_URL}/legacy-wordpress-administration/`,
  },
}

export default function LegacyWordPressAdministrationHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'Legacy WordPress Administration' }]}
      />

      {/* Hero */}
      <header className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-slate-300 mb-3">
            For volunteers, admins, and partner charities
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Legacy WordPress Administration</h1>
          <p className="text-slate-200 text-lg max-w-3xl">
            Operations and SOP reference for FFC volunteers, admins, and partner charities still
            running their own WordPress. The public, charity-facing versions of these pages live on{' '}
            <a
              href="https://freeforcharity.org/"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              freeforcharity.org
            </a>
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {LEGACY_WP_ADMIN_CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* What this section is */}
      <section className="border-y border-blue-100 bg-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid gap-3 sm:grid-cols-2 text-sm text-blue-900">
          <p>
            <strong>Looking to apply for a free FFC site?</strong>{' '}
            <a
              href="https://freeforcharity.org/submit-information/"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply at freeforcharity.org →
            </a>
          </p>
          <p className="sm:text-right">
            <a
              href="https://freeforcharity.org/"
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              See the charity-facing pages on freeforcharity.org →
            </a>
          </p>
        </div>
      </section>

      {/* Category card grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CategoryGrid />
        </div>
      </section>

      {/* Why "Legacy"? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why &ldquo;Legacy&rdquo;?</h2>
          <p className="text-gray-700 mb-3">
            Many partner charities still run on WordPress while they evaluate or wait for a
            migration to the FFC static-site stack. We keep these procedures published so their
            staff can use them without joining the FFC GitHub org.
          </p>
          <p className="text-gray-700">
            The same content also serves as the operations-team reference for FFC volunteers and
            admins working on charity sites that have not yet migrated. As migrations complete,
            individual pages will be updated to reflect the modern stack or retired in place of the
            corresponding ffcadmin.org guide.
          </p>
        </div>
      </section>

      {/* Bottom CTAs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2">
          <Link
            href="/guides/wordpress-to-nextjs-guide"
            className="block rounded-lg bg-white border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <p className="font-semibold text-gray-900 mb-1">Ready to move off WordPress? →</p>
            <p className="text-sm text-gray-600">Read the WordPress-to-Next.js conversion guide.</p>
          </Link>
          <a
            href="https://freeforcharity.org/submit-information/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg bg-white border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <p className="font-semibold text-gray-900 mb-1">Apply for FFC migration help →</p>
            <p className="text-sm text-gray-600">
              Submit your charity for the FFC backlog at freeforcharity.org.
            </p>
          </a>
        </div>
      </section>
    </div>
  )
}
