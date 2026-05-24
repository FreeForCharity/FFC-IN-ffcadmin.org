import type { ReactNode } from 'react'
import Link from 'next/link'
import PageHeader from './PageHeader'
import Sidebar from './Sidebar'
import {
  LEGACY_WP_ADMIN_BASE,
  type LegacyWpAdminPage,
} from '@/data/legacy-wordpress-administration'

interface LeafPageShellProps {
  page: LegacyWpAdminPage
  children: ReactNode
}

/**
 * Shared shell for every /legacy-wordpress-administration/<slug>/page.tsx:
 *
 *   <PageHeader />         full-width hero + audience callout
 *   <Sidebar /> <article>  category-grouped left rail + page body
 *   <BottomCtas />         hub / migration guide links
 *
 * Pages pass their migrated body content as children.
 */
export default function LeafPageShell({ page, children }: LeafPageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader page={page} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] gap-10">
        {/* Mobile: article reads first; desktop: sidebar in column 1, article in column 2. */}
        {/* Cap prose at 65ch on mobile/tablet for readability; let it fill the column on desktop. */}
        <article className="prose prose-slate max-w-prose lg:max-w-none lg:col-start-2 lg:row-start-1">
          {children}
        </article>
        <aside
          aria-label="Section navigation"
          className="lg:col-start-1 lg:row-start-1 lg:sticky lg:top-20 lg:self-start"
        >
          <Sidebar />
        </aside>
      </div>

      <section className="bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-4 sm:grid-cols-2 text-sm">
          <Link
            href={LEGACY_WP_ADMIN_BASE}
            className="block rounded-lg border border-gray-200 p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <p className="font-semibold text-gray-900">← Back to section hub</p>
            <p className="text-gray-600">
              Browse all WordPress Operations, Charity Onboarding, and Volunteer Programs guides.
            </p>
          </Link>
          <Link
            href="/guides/wordpress-to-nextjs-guide"
            className="block rounded-lg border border-gray-200 p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <p className="font-semibold text-gray-900">Ready to move off WordPress? →</p>
            <p className="text-gray-600">Read the WordPress-to-Next.js conversion guide.</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
