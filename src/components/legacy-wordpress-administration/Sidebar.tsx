'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LEGACY_WP_ADMIN_BASE,
  LEGACY_WP_ADMIN_CATEGORIES,
  getLegacyWpAdminHref,
  getLegacyWpAdminPagesByCategory,
} from '@/data/legacy-wordpress-administration'

/**
 * Category-grouped left-rail navigation shared by every page in
 * /legacy-wordpress-administration/. Highlights the current leaf based
 * on `usePathname()`.
 *
 * Styled as left rail on desktop (lg+); the layout collapses it into a
 * top-of-page list on smaller screens by stacking the grid columns.
 */
export default function Sidebar() {
  const pathname = usePathname() ?? ''
  const normalizedPath = pathname.replace(/\/$/, '')

  const isOnHub = normalizedPath === LEGACY_WP_ADMIN_BASE
  const isLeafActive = (href: string) => normalizedPath === href

  return (
    <nav aria-label="Legacy WordPress Administration" className="space-y-6 text-sm">
      <Link
        href={LEGACY_WP_ADMIN_BASE}
        aria-current={isOnHub ? 'page' : undefined}
        className={
          isOnHub
            ? 'block font-bold text-blue-700'
            : 'block font-semibold text-gray-700 hover:text-blue-700 transition-colors'
        }
      >
        ← Section hub
      </Link>

      {LEGACY_WP_ADMIN_CATEGORIES.map((category) => {
        const pages = getLegacyWpAdminPagesByCategory(category.id)
        return (
          <section key={category.id}>
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
              {category.label}
            </h2>
            <ul className="space-y-1">
              {pages.map((page) => {
                const href = getLegacyWpAdminHref(page.slug)
                const active = isLeafActive(href)
                return (
                  <li key={page.slug}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={
                        active
                          ? 'block px-3 py-2.5 rounded bg-blue-50 text-blue-700 font-semibold'
                          : 'block px-3 py-2.5 rounded text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors'
                      }
                    >
                      {page.shortLabel}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </nav>
  )
}
