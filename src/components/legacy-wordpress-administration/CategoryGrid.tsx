import Link from 'next/link'
import {
  LEGACY_WP_ADMIN_CATEGORIES,
  getLegacyWpAdminHref,
  getLegacyWpAdminPagesByCategory,
} from '@/data/legacy-wordpress-administration'

/**
 * Hub-landing card grid grouped by category. Used only on the
 * /legacy-wordpress-administration/ root page.
 */
export default function CategoryGrid() {
  return (
    <div className="space-y-12">
      {LEGACY_WP_ADMIN_CATEGORIES.map((category) => {
        const pages = getLegacyWpAdminPagesByCategory(category.id)
        return (
          <section key={category.id} id={category.id}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{category.label}</h2>
              <p className="text-gray-600 text-sm mt-1">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  href={getLegacyWpAdminHref(page.slug)}
                  className="block bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-400 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{page.title}</h3>
                  <p className="text-sm text-gray-600">{page.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
