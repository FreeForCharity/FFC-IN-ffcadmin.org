'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { documentationSections, type DocSection } from './docs-data'

const GitHubIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
)

function matches(section: DocSection, q: string): DocSection | null {
  if (!q) return section
  const needle = q.toLowerCase()
  if (section.title.toLowerCase().includes(needle)) return section
  const docs = section.docs.filter((d) =>
    [d.name, d.description, d.audience, d.file].some((f) => f.toLowerCase().includes(needle))
  )
  return docs.length > 0 ? { ...section, docs } : null
}

export default function DocSearch() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => documentationSections.map((s) => matches(s, query)).filter((s): s is DocSection => !!s),
    [query]
  )
  const resultCount = filtered.reduce((n, s) => n + s.docs.length, 0)

  return (
    <>
      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-5 mb-8">
        <label htmlFor="doc-search" className="sr-only">
          Search documentation
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            id="doc-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs by name, topic, or audience…"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        {query && (
          <p className="text-sm text-gray-500 mt-2" role="status">
            {resultCount} result{resultCount === 1 ? '' : 's'} for “{query}”
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-600">
          No documents match “{query}”. Try a different term.
        </div>
      ) : (
        filtered.map((section) => (
          <div key={section.title} className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4" aria-hidden="true">
                {section.icon}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {section.docs.map((doc) => (
                <div key={doc.name} className="border-l-4 border-blue-600 pl-4 py-2">
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <h3 className="text-xl font-semibold text-gray-900">{doc.name}</h3>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {doc.liveUrl && (
                        <Link
                          href={doc.liveUrl}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          aria-label={`Open the ${doc.name} page`}
                        >
                          Open page
                        </Link>
                      )}
                      <a
                        href={doc.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                        aria-label={`View ${doc.name} on GitHub`}
                      >
                        <GitHubIcon />
                        GitHub
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-mono break-all">{doc.file}</p>
                  <p className="text-gray-700 mb-3">{doc.description}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Audience:</strong> {doc.audience}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </>
  )
}
