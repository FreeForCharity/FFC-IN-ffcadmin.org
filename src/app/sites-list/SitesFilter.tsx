'use client'

import { useState, useMemo } from 'react'

interface SiteData {
  section: string
  domain: string
  status: string
  inWhmcs: string
  inCloudflare: string
  inWpmudev: string
  serverInUse: string
  oldServerAbandoned: string
  notes: string
  cloudflareIp: string
  repoUrl: string
  siteHealth: string
  priority: string
}

interface SitesFilterProps {
  sites: SiteData[]
  children?: (filtered: SiteData[], query: string) => React.ReactNode
}

export default function SitesFilter({ sites, children }: SitesFilterProps) {
  const [query, setQuery] = useState('')
  const [healthFilter, setHealthFilter] = useState<string>('all')
  const [serverFilter, setServerFilter] = useState<string>('all')

  const servers = useMemo(() => {
    const s = new Set(sites.map((site) => site.serverInUse).filter(Boolean))
    return Array.from(s).sort()
  }, [sites])

  const filtered = useMemo(() => {
    return sites.filter((site) => {
      const matchesQuery =
        !query ||
        site.domain.toLowerCase().includes(query.toLowerCase()) ||
        site.notes.toLowerCase().includes(query.toLowerCase()) ||
        site.section.toLowerCase().includes(query.toLowerCase())

      const matchesHealth =
        healthFilter === 'all' ||
        (healthFilter === 'live' && site.siteHealth.includes('200')) ||
        (healthFilter === 'redirect' &&
          (site.siteHealth.includes('301') || site.siteHealth.includes('302'))) ||
        (healthFilter === 'error' &&
          ['404', '403', '400', '500', '503', '502'].some((code) =>
            site.siteHealth.includes(code)
          )) ||
        (healthFilter === 'unreachable' &&
          (site.siteHealth.toLowerCase().includes('unreachable') ||
            site.siteHealth.toLowerCase().includes('no response')))

      const matchesServer = serverFilter === 'all' || site.serverInUse === serverFilter

      return matchesQuery && matchesHealth && matchesServer
    })
  }, [sites, query, healthFilter, serverFilter])

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="site-search" className="sr-only">
              Search domains
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
                type="text"
                placeholder="Search by domain, category, or notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div>
              <label htmlFor="health-filter" className="sr-only">
                Filter by health
              </label>
              <select
                id="health-filter"
                value={healthFilter}
                onChange={(e) => setHealthFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Health</option>
                <option value="live">Live (200)</option>
                <option value="redirect">Redirect (3xx)</option>
                <option value="error">Error (4xx/5xx)</option>
                <option value="unreachable">Unreachable</option>
              </select>
            </div>
            <div>
              <label htmlFor="server-filter" className="sr-only">
                Filter by server
              </label>
              <select
                id="server-filter"
                value={serverFilter}
                onChange={(e) => setServerFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Servers</option>
                {servers.map((server) => (
                  <option key={server} value={server}>
                    {server}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {(query || healthFilter !== 'all' || serverFilter !== 'all') && (
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {filtered.length} of {sites.length} sites
            </span>
            <button
              onClick={() => {
                setQuery('')
                setHealthFilter('all')
                setServerFilter('all')
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {children?.(filtered, query)}
    </div>
  )
}
