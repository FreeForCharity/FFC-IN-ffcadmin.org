'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SEARCH_DOCS, searchDocs } from '@/data/search-index'

/**
 * Client half of the /search page: reads `?q=` (deep-linkable, and the target
 * of the Google SearchAction in layout.tsx), lets the visitor refine it, and
 * renders the full uncapped result list from the shared search index.
 */
export default function SearchResults() {
  const params = useSearchParams()
  const initial = params.get('q') ?? ''
  const [query, setQuery] = useState(initial)

  // A back/forward navigation changes ?q= without remounting — follow it.
  useEffect(() => {
    setQuery(initial)
  }, [initial])

  const results = useMemo(() => searchDocs(query, SEARCH_DOCS.length), [query])

  return (
    <div>
      <label htmlFor="site-search" className="sr-only">
        Search the site
      </label>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages, guides, roles, docs…"
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {query && (
        <p className="mt-3 text-sm text-gray-500" role="status">
          {results.length} result{results.length === 1 ? '' : 's'} for “{query}”
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {query && results.length === 0 && (
          <li className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600">
            No pages match “{query}”. Try a different term.
          </li>
        )}
        {results.map((doc) => (
          <li key={doc.href}>
            <Link
              href={doc.href}
              className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50/40"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-semibold text-gray-900">{doc.title}</span>
                <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {doc.category}
                </span>
              </span>
              <span className="mt-1 block text-sm text-gray-600">{doc.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      {!query && (
        <p className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          Type above to search all {SEARCH_DOCS.length} pages — or press{' '}
          <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs">⌘K</kbd>{' '}
          anywhere on the site.
        </p>
      )}
    </div>
  )
}
