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

interface ProviderConfig {
  name: string
  colorClass: string
  description: string
}

interface FilterableHostingSectionProps {
  sites: SiteData[]
  providers: ProviderConfig[]
}

function getHealthSeverity(health: string): number {
  const h = health.toLowerCase()
  if (h === 'live' || h.includes('200')) return 1
  if (h === 'redirect' || h.includes('301') || h.includes('302')) return 2
  if (
    h === 'error' ||
    h.includes('404') ||
    h.includes('403') ||
    h.includes('400') ||
    h.includes('500') ||
    h.includes('503') ||
    h.includes('502')
  )
    return 3
  if (h === 'unreachable' || h.includes('no response')) return 4
  return 5
}

function sortByPriority(sitesList: SiteData[]): SiteData[] {
  const priorityOrder: { [key: string]: number } = {
    'For-Profit': 1,
    'Org-WPAdmin': 2,
    'Org-NoWP': 3,
    'InterServer-Org': 4,
    Subdomain: 5,
    'Cloudflare-Only': 6,
    'Krystal-New': 7,
    Unknown: 8,
  }
  return [...sitesList].sort((a, b) => {
    const healthA = getHealthSeverity(a.siteHealth)
    const healthB = getHealthSeverity(b.siteHealth)
    if (healthA !== healthB) return healthA - healthB
    const priorityA = priorityOrder[a.section] || 999
    const priorityB = priorityOrder[b.section] || 999
    if (priorityA !== priorityB) return priorityA - priorityB
    return a.domain.localeCompare(b.domain)
  })
}

function getStatusColor(status: string) {
  const s = status.toLowerCase()
  if (s === 'yes') return 'bg-green-100 text-green-800'
  if (s === 'no') return 'bg-gray-100 text-gray-800'
  return 'bg-gray-100 text-gray-800'
}

function getHealthColor(health: string) {
  if (health.includes('200')) return 'text-green-600 bg-green-100'
  if (health.includes('301') || health.includes('302')) return 'text-yellow-600 bg-yellow-100'
  if (['404', '500', '503', 'Unreachable', 'No Response'].some((err) => health.includes(err)))
    return 'text-red-600 bg-red-100'
  return 'text-gray-600 bg-gray-100'
}

export default function FilterableHostingSection({
  sites,
  providers,
}: FilterableHostingSectionProps) {
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

  const isFiltering = query || healthFilter !== 'all' || serverFilter !== 'all'

  return (
    <>
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
        {isFiltering && (
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {filtered.length} of {sites.length} sites
            </span>
            <button
              type="button"
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

      {/* Active Sites by Hosting Provider */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Sites by Hosting Provider</h2>
        <p className="text-sm text-gray-600 mb-6">
          Active, Pending, and Unknown status domains organized by hosting provider. Sites are
          sorted first by health status (Live &rarr; Redirect &rarr; Error &rarr; Unreachable), then
          by priority, and finally by domain name.
        </p>
      </div>

      {providers
        .map((provider) => {
          const providerSites = sortByPriority(
            filtered.filter((s) => s.serverInUse === provider.name)
          )
          if (providerSites.length === 0) return null
          return (
            <div
              key={provider.name}
              className="rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-10"
            >
              <div className={`px-6 py-4 border-b border-gray-200 ${provider.colorClass}`}>
                <h2 className="text-xl font-bold flex items-center">{provider.name}</h2>
                <p className="text-sm mt-1 opacity-80">
                  {provider.description} Sites are sorted by health status (healthiest first), then
                  by priority, and finally by domain name.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={provider.colorClass.replace('text-white', 'bg-opacity-20')}>
                    <tr>
                      {[
                        'Category',
                        'Domain',
                        'Health',
                        'Status',
                        'WHMCS',
                        'Cloudflare',
                        'WPMUDEV',
                        'Server',
                        'Notes',
                      ].map((col) => (
                        <th
                          key={col}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {providerSites.map((site, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-700">
                          {site.section}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium hover:underline text-blue-600">
                          <a
                            href={`https://${site.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {site.domain}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold border ${getHealthColor(site.siteHealth)}`}
                          >
                            {site.siteHealth || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700 font-semibold">
                          {site.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(site.inWhmcs)}`}
                          >
                            {site.inWhmcs}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(site.inCloudflare)}`}
                          >
                            {site.inCloudflare}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(site.inWpmudev)}`}
                          >
                            {site.inWpmudev}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {site.serverInUse}
                        </td>
                        <td
                          className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate"
                          title={site.notes}
                        >
                          {site.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Total: <span className="font-medium">{providerSites.length}</span>
                </p>
              </div>
            </div>
          )
        })
        .filter(Boolean)}

      {isFiltering && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No sites match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setHealthFilter('all')
              setServerFilter('all')
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Also include sites with unknown/empty server that match filters */}
      {(() => {
        const unknownSites = sortByPriority(
          filtered.filter((s) => !s.serverInUse || !providers.some((p) => p.name === s.serverInUse))
        )
        if (unknownSites.length === 0) return null
        return (
          <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-10">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-200 text-gray-800">
              <h2 className="text-xl font-bold flex items-center">Unknown Server</h2>
              <p className="text-sm mt-1 opacity-80">Domains with unidentified hosting.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200 bg-opacity-20">
                  <tr>
                    {[
                      'Category',
                      'Domain',
                      'Health',
                      'Status',
                      'WHMCS',
                      'Cloudflare',
                      'WPMUDEV',
                      'Server',
                      'Notes',
                    ].map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unknownSites.map((site, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-700">
                        {site.section}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium hover:underline text-blue-600">
                        <a
                          href={`https://${site.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {site.domain}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold border ${getHealthColor(site.siteHealth)}`}
                        >
                          {site.siteHealth || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700 font-semibold">
                        {site.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(site.inWhmcs)}`}
                        >
                          {site.inWhmcs}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(site.inCloudflare)}`}
                        >
                          {site.inCloudflare}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(site.inWpmudev)}`}
                        >
                          {site.inWpmudev}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {site.serverInUse}
                      </td>
                      <td
                        className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate"
                        title={site.notes}
                      >
                        {site.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Total: <span className="font-medium">{unknownSites.length}</span>
              </p>
            </div>
          </div>
        )
      })()}
    </>
  )
}
