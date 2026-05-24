import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  LEGACY_WP_ADMIN_BASE,
  LEGACY_WP_ADMIN_CATEGORIES,
  type LegacyWpAdminPage,
} from '@/data/legacy-wordpress-administration'

interface PageHeaderProps {
  page: LegacyWpAdminPage
}

/**
 * Shared header for every /legacy-wordpress-administration/* page.
 *
 * Renders breadcrumbs (Home → Legacy WP Admin → Category → Page), the
 * page title, the audience callout ("apply for a free site →
 * freeforcharity.org"), and the public-version cross-link to the
 * matching freeforcharity.org URL.
 */
export default function PageHeader({ page }: PageHeaderProps) {
  const category = LEGACY_WP_ADMIN_CATEGORIES.find((c) => c.id === page.category)

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Legacy WordPress Administration', href: LEGACY_WP_ADMIN_BASE },
          ...(category ? [{ label: category.label }] : []),
          { label: page.title },
        ]}
      />

      <header className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {category && (
            <p className="text-xs uppercase tracking-wider text-slate-300 mb-2">{category.label}</p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{page.title}</h1>
          <p className="text-slate-200 text-lg max-w-3xl">{page.summary}</p>
        </div>
      </header>

      <aside
        className="bg-blue-50 border-y border-blue-100"
        aria-label="Section context and cross-links"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid gap-3 sm:grid-cols-2 text-sm">
          <p className="text-blue-900">
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
          <p className="text-blue-900 sm:text-right">
            <a
              href={page.publicSourceUrl}
              className="underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Public version for charity visitors →
            </a>
          </p>
        </div>
        {page.relatedFfcAdminPaths && page.relatedFfcAdminPaths.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 text-sm text-blue-900">
            Related on ffcadmin.org:{' '}
            {page.relatedFfcAdminPaths.map((path, idx) => (
              <span key={path}>
                {idx > 0 && ', '}
                <Link href={path} className="underline hover:no-underline">
                  {path}
                </Link>
              </span>
            ))}
          </div>
        )}
      </aside>
    </>
  )
}
