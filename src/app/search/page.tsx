import type { Metadata } from 'next'
import { Suspense } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
import SearchResults from './SearchResults'

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search every page on the Free For Charity admin portal — training, guides, the public roadmap, intake help, operations, and policies.',
  alternates: { canonical: 'https://ffcadmin.org/search/' },
  // A results page for an arbitrary query shouldn't compete with the real
  // pages in search engines; the SearchAction in layout.tsx still lets Google
  // offer a sitelinks search box.
  robots: { index: false, follow: true },
}

/**
 * Shareable search results (#543). The static shell prerenders empty; the
 * client component reads `?q=` and ranks against the shared search index.
 */
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />

      <div className="bg-ffc-gradient text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold md:text-4xl">Search the site</h1>
          <p className="mt-2 text-lg text-teal-50">
            Every page — training, guides, the roadmap, intake help, operations, and policies.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* useSearchParams requires a Suspense boundary in the static shell. */}
        <Suspense fallback={null}>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  )
}
