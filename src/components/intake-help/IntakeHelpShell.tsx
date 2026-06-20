import type { ReactNode } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import Sidebar from './Sidebar'
import { type IntakeHelpPage } from '@/data/intake-help'

interface IntakeHelpShellProps {
  page: IntakeHelpPage
  children: ReactNode
}

/**
 * Shared shell for every /intake-help/<slug>/page.tsx: breadcrumbs + hero, a
 * sticky category sidebar, the page body, and a "back to intake" footer.
 * Modeled on the legacy-wordpress-administration LeafPageShell.
 */
export default function IntakeHelpShell({ page, children }: IntakeHelpShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Intake Help', href: '/intake-help' },
          { label: page.shortLabel },
        ]}
      />

      <div className="bg-ffc-gradient-teal text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold md:text-4xl">{page.title}</h1>
          <p className="mt-2 max-w-3xl text-teal-50">{page.summary}</p>
          {!page.full && (
            <p className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm">
              Fuller guidance forthcoming — this page is a starting point.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-8">
        <article className="prose prose-slate max-w-prose lg:col-start-2 lg:row-start-1 lg:max-w-none">
          {children}
          <hr className="my-8 border-gray-200" />
          <p className="text-sm">
            <Link href="/roadmap/submit">← Back to intake</Link> ·{' '}
            <Link href="/roadmap/methodology">How readiness is scored</Link>
          </p>
        </article>
        <aside
          aria-label="Section navigation"
          className="lg:col-start-1 lg:row-start-1 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:self-start lg:overflow-y-auto lg:border-r lg:border-gray-200 lg:pr-4"
        >
          <Sidebar currentSlug={page.slug} />
        </aside>
      </div>
    </div>
  )
}
