import fs from 'fs'
import path from 'path'
import { Metadata } from 'next'
import { parse } from 'csv-parse/sync'
export const metadata: Metadata = {
  title: 'Sites Master List',
  description:
    'Operational dashboard of all FFC-managed domains with health status, server assignments, Cloudflare, and migration progress.',
}

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

async function getSitesData(): Promise<SiteData[]> {
  const filePath = path.join(process.cwd(), 'docs', 'sites_list.csv')
  const fileContent = fs.readFileSync(filePath, 'utf8')

  /* 
    Headers expected from update-sites-data.mjs:
    Section, Domain, Status, In WHMCS, In Cloudflare, In WPMUDEV, 
    Server In Use, Old Server Abandoned?, Notes, 
    Cloudflare IP, Is In Cloudflare, Repo URL, Site Health, Priority
  */

  const records = parse(fileContent, {
    columns: false,
    skip_empty_lines: true,
    from_line: 2, // Skip header
  })

  return records.map((columns: string[]) => {
    return {
      section: columns[0]?.trim() || '',
      domain: columns[1]?.trim() || '',
      status: columns[2]?.trim() || '',
      inWhmcs: columns[3]?.trim() || '',
      inCloudflare: columns[4]?.trim() || '',
      inWpmudev: columns[5]?.trim() || '',
      serverInUse: columns[6]?.trim() || '',
      oldServerAbandoned: columns[7]?.trim() || '',
      notes: columns[8]?.trim() || '',
      cloudflareIp: columns[9]?.trim() || '',
      // col 10 is 'Is In Cloudflare' (redundant)
      repoUrl: columns[11]?.trim() || '',
      siteHealth: columns[12]?.trim() || '',
      priority: columns[13]?.trim() || 'Standard',
    }
  })
}

// Helper function to get health status severity (lower is healthier)
// Moved outside component to avoid recreation on every render
function getHealthSeverity(health: string): number {
  const h = health.toLowerCase()
  // Live (200 OK) -> Healthiest (1)
  if (h === 'live' || h.includes('200')) return 1
  // Redirect (301/302) -> Good (2)
  if (h === 'redirect' || h.includes('301') || h.includes('302')) return 2
  // Error (4xx/5xx) -> Bad (3)
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
  // Unreachable -> Worst (4)
  if (h === 'unreachable' || h.includes('no response')) return 4
  // Unknown/Other -> Default (5)
  return 5
}

// Helper function to sort sites by health, then priority, then domain name
// Moved outside component to avoid recreation on every render
// Returns a new sorted array without mutating the input
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

  // Create a copy to avoid mutating the input array
  return [...sitesList].sort((a, b) => {
    // First sort by health status (healthiest first)
    const healthA = getHealthSeverity(a.siteHealth)
    const healthB = getHealthSeverity(b.siteHealth)
    if (healthA !== healthB) return healthA - healthB

    // Then sort by priority
    const priorityA = priorityOrder[a.section] || 999
    const priorityB = priorityOrder[b.section] || 999
    if (priorityA !== priorityB) return priorityA - priorityB

    // Finally sort by domain name
    return a.domain.localeCompare(b.domain)
  })
}

function PriorityLegend() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h2 className="text-xl font-bold text-ffc-teal-dark mb-4">Priority Sections Legend</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
          <span className="font-bold block text-purple-900">For-Profit</span>
          <p className="text-sm text-purple-700">
            Highest Priority. Commercial/Business domains (.com, .net, etc.).
          </p>
        </div>
        <div className="p-3 border-l-4 border-green-500 bg-green-50">
          <span className="font-bold block text-green-900">Org-WPAdmin</span>
          <p className="text-sm text-green-700">
            High Priority. Verified WordPress Admin access (Hostinger).
          </p>
        </div>
        <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
          <span className="font-bold block text-yellow-900">Org-NoWP</span>
          <p className="text-sm text-yellow-700">
            Medium Priority. No verified WP Admin access (Hostinger).
          </p>
        </div>
        <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
          <span className="font-bold block text-blue-900">InterServer-Org</span>
          <p className="text-sm text-blue-700">Nonprofit organizations hosted on InterServer.</p>
        </div>
        <div className="p-3 border-l-4 border-gray-500 bg-gray-50">
          <span className="font-bold block text-gray-900">Subdomain</span>
          <p className="text-sm text-gray-700">Lowest Priority. Subdomains and staging sites.</p>
        </div>
        <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
          <span className="font-bold block text-orange-900">Cloudflare-Only</span>
          <p className="text-sm text-orange-700">
            Domains in Cloudflare but not on any known hosting server list.
          </p>
        </div>
        <div className="p-3 border-l-4 border-indigo-500 bg-indigo-50">
          <span className="font-bold block text-indigo-900">Krystal-New</span>
          <p className="text-sm text-indigo-700">
            Sites identified on the new Krystal.io hosting account.
          </p>
        </div>
      </div>
    </div>
  )
}

export default async function SitesListPage() {
  const sites = await getSitesData()

  // Filter for "Good" sites: Apex domain + In Cloudflare + On GitHub Pages
  const migratedSites = sites.filter((site) => {
    const isApex = site.domain.split('.').length === 2
    const inCloudflare = site.inCloudflare.toLowerCase() === 'yes'
    const onGithub = site.serverInUse.toLowerCase() === 'github pages'
    return isApex && inCloudflare && onGithub
  })

  // Helper to color code statuses
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'yes') return 'bg-green-100 text-green-800'
    if (s === 'no') return 'bg-gray-100 text-gray-800'
    return 'bg-gray-100 text-gray-800'
  }

  // Helper for Health Status Color
  const getHealthColor = (health: string) => {
    // 200 OK -> Green
    if (health.includes('200')) return 'text-green-600 bg-green-100'
    // 301/302 -> Yellow
    if (health.includes('301') || health.includes('302')) return 'text-yellow-600 bg-yellow-100'
    // 4xx/5xx/Unreachable -> Red
    if (['404', '500', '503', 'Unreachable', 'No Response'].some((err) => health.includes(err)))
      return 'text-red-600 bg-red-100'
    // Unknown
    return 'text-gray-600 bg-gray-100'
  }

  // Categorize sites
  const fraudSites = sites.filter((s) => s.status.toLowerCase() === 'fraud')
  const expiredSites = sites.filter((s) => s.status.toLowerCase() === 'expired')
  const cancelledSites = sites.filter((s) => s.status.toLowerCase() === 'cancelled')
  const terminatedSites = sites.filter((s) => s.status.toLowerCase() === 'terminated')
  const transferredSites = sites.filter((s) => s.status.toLowerCase() === 'transferred away')

  // Active/Master list is everything else (Active, Pending, Unknown, etc.)
  const activeSites = sites.filter(
    (s) =>
      s.status.toLowerCase() !== 'fraud' &&
      !['expired', 'cancelled', 'terminated'].includes(s.status.toLowerCase()) &&
      s.status.toLowerCase() !== 'transferred away'
  )

  // Group active sites by hosting provider
  const hostingerSites = activeSites.filter((s) => s.serverInUse === 'Hostinger')
  const kinstaSites = activeSites.filter((s) => s.serverInUse === 'Kinsta')
  const krystalSites = activeSites.filter((s) => s.serverInUse === 'Krystal.io')
  const hostPapaSites = activeSites.filter((s) => s.serverInUse === 'HostPapa')
  const interServerDASites = activeSites.filter((s) => s.serverInUse === 'InterServer DA')
  const interServerRS1Sites = activeSites.filter((s) => s.serverInUse === 'InterServer RS1')
  const interServerCPanelSites = activeSites.filter((s) => s.serverInUse === 'InterServer cPanel')
  const githubPagesSites = activeSites.filter((s) => s.serverInUse === 'GitHub Pages')
  const cloudflareProxySites = activeSites.filter((s) => s.serverInUse === 'Cloudflare Proxy')
  const externalSites = activeSites.filter((s) => s.serverInUse === 'External')
  const ffcWhmSites = activeSites.filter((s) => s.serverInUse === 'FFC-WHM-01')
  const noARecordSites = activeSites.filter((s) => s.serverInUse === 'No A Record')
  const unknownServerSites = activeSites.filter(
    (s) => !s.serverInUse || s.serverInUse.trim() === ''
  )

  // Define hosting providers configuration for data-driven rendering
  const hostingProviders = [
    {
      sites: hostingerSites,
      name: 'Hostinger',
      colorClass: 'bg-purple-100 text-purple-900',
      description: 'Domains hosted on Hostinger.',
    },
    {
      sites: krystalSites,
      name: 'Krystal.io',
      colorClass: 'bg-indigo-100 text-indigo-900',
      description: 'Domains hosted on Krystal.io.',
    },
    {
      sites: hostPapaSites,
      name: 'HostPapa',
      colorClass: 'bg-pink-100 text-pink-900',
      description: 'Domains hosted on HostPapa.',
    },
    {
      sites: interServerDASites,
      name: 'InterServer DA',
      colorClass: 'bg-blue-100 text-blue-900',
      description: 'Domains hosted on InterServer DirectAdmin.',
    },
    {
      sites: interServerRS1Sites,
      name: 'InterServer RS1',
      colorClass: 'bg-cyan-100 text-cyan-900',
      description: 'Domains hosted on InterServer RS1.',
    },
    {
      sites: interServerCPanelSites,
      name: 'InterServer cPanel',
      colorClass: 'bg-teal-100 text-teal-900',
      description: 'Domains hosted on InterServer cPanel.',
    },
    {
      sites: githubPagesSites,
      name: 'GitHub Pages',
      colorClass: 'bg-green-100 text-green-900',
      description: 'Domains hosted on GitHub Pages.',
    },
    {
      sites: cloudflareProxySites,
      name: 'Cloudflare Proxy',
      colorClass: 'bg-orange-100 text-orange-900',
      description: 'Domains proxied through Cloudflare with unknown origin.',
    },
    {
      sites: externalSites,
      name: 'External Hosting',
      colorClass: 'bg-yellow-100 text-yellow-900',
      description: 'Domains hosted on external providers.',
    },
    {
      sites: ffcWhmSites,
      name: 'FFC-WHM-01',
      colorClass: 'bg-gray-100 text-gray-900',
      description: 'Domains on FFC-WHM-01 server.',
    },
    {
      sites: noARecordSites,
      name: 'No A Record',
      colorClass: 'bg-red-100 text-red-900',
      description: 'Domains without DNS A records.',
    },
    {
      sites: unknownServerSites,
      name: 'Unknown Server',
      colorClass: 'bg-gray-200 text-gray-800',
      description: 'Domains with unidentified hosting.',
    },
    {
      sites: kinstaSites,
      name: 'Kinsta',
      colorClass: 'bg-fuchsia-100 text-fuchsia-900',
      description: 'Domains hosted on Kinsta.',
    },
  ]

  const renderTable = (
    data: SiteData[],
    title: string,
    headerColorClass: string,
    description?: string,
    key?: string
  ) => (
    <div key={key} className={`rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-10`}>
      <div className={`px-6 py-4 border-b border-gray-200 ${headerColorClass}`}>
        <h2 className="text-xl font-bold flex items-center">{title}</h2>
        {description && <p className="text-sm mt-1 opacity-80">{description}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={headerColorClass.replace('text-white', 'bg-opacity-20')}>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                Domain
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                Health
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                WHMCS
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                Cloudflare
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                WPMUDEV
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                Server
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider opacity-80"
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((site, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-700">
                    {site.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium hover:underline text-blue-600">
                    <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer">
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
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500 italic">
                  No sites found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Total: <span className="font-medium">{data.length}</span>
        </p>
      </div>
    </div>
  )

  const liveSites = sites.filter((s) => s.siteHealth.includes('200'))
  const errorSites = sites.filter(
    (s) =>
      ['404', '403', '400', '500', '503', '502'].some((code) => s.siteHealth.includes(code)) ||
      s.siteHealth.toLowerCase().includes('unreachable') ||
      s.siteHealth.toLowerCase().includes('no response')
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ffc-teal-dark mb-4">Sites Master List</h1>
        <p className="text-gray-600">
          Authoritative list of all domains, server assignments, and migration status.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{sites.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Domains</p>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-green-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{liveSites.length}</p>
          <p className="text-sm text-gray-500 mt-1">Live Sites</p>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-blue-200 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{migratedSites.length}</p>
          <p className="text-sm text-gray-500 mt-1">Fully Migrated</p>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-red-200 p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{errorSites.length}</p>
          <p className="text-sm text-gray-500 mt-1">Errors / Unreachable</p>
        </div>
      </div>

      {/* Migrated / Good Sites Table */}
      <div className="bg-green-50 rounded-lg shadow-md mb-10 overflow-hidden border border-green-200">
        <div className="px-6 py-4 border-b border-green-200 bg-green-100">
          <h2 className="text-xl font-bold text-green-800 flex items-center">
            <span className="mr-2">✅</span> Migrated Sites (Live)
          </h2>
          <p className="text-green-700 text-sm mt-1">
            These sites are fully migrated: Apex domain + Cloudflare + GitHub Pages.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Health
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Repo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  WHMCS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Cloudflare
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  WPMUDEV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Server
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-100">
              {migratedSites.length > 0 ? (
                migratedSites.map((site, index) => (
                  <tr key={index} className="hover:bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-700">
                      {site.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 font-bold hover:underline">
                      <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer">
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
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(site.status === 'Active' ? 'Yes' : 'No')}`}
                      >
                        {site.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {site.repoUrl ? (
                        <a
                          href={site.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center"
                        >
                          Repo
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500 italic">
                    No fully migrated sites found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PriorityLegend />

      {/* Active Sites by Hosting Provider */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Sites by Hosting Provider</h2>
        <p className="text-sm text-gray-600 mb-6">
          Active, Pending, and Unknown status domains organized by hosting provider. Sites are
          sorted first by health status (Live → Redirect → Error → Unreachable), then by priority,
          and finally by domain name.
        </p>
      </div>

      {/* Render all hosting provider tables */}
      {hostingProviders
        .filter((provider) => provider.sites.length > 0)
        .map((provider) =>
          renderTable(
            sortByPriority(provider.sites),
            provider.name,
            provider.colorClass,
            `${provider.description} Sites are sorted by health status (healthiest first), then by priority, and finally by domain name.`,
            provider.name
          )
        )}

      {/* 2. Transferred Away */}
      {renderTable(
        transferredSites,
        'TR: Transferred Away',
        'bg-blue-100 text-blue-900',
        'Domains that have been transferred to another registrar. In WHMCS, this status indicates the domain registration has been moved to a different domain registrar.'
      )}

      {/* 3. Expired */}
      {renderTable(
        expiredSites,
        'EX: Expired',
        'bg-orange-100 text-orange-900',
        'Domains that have reached their expiration date and are no longer active. In WHMCS, the Expired status means the domain registration period has ended and the domain is in a grace period before becoming available for re-registration.'
      )}

      {/* 4. Cancelled */}
      {renderTable(
        cancelledSites,
        'CA: Cancelled',
        'bg-yellow-100 text-yellow-900',
        'Domains with user-initiated cancellations. In WHMCS, the Cancelled status indicates that the client or account holder has requested to cancel the domain service, and the domain will not be renewed upon expiration.'
      )}

      {/* 5. Terminated */}
      {renderTable(
        terminatedSites,
        'TM: Terminated',
        'bg-red-200 text-red-900',
        'Domains that have been administratively terminated. In WHMCS, the Terminated status indicates that an administrator has forcefully ended the service, typically due to policy violations, non-payment, or other administrative reasons.'
      )}

      {/* 6. Fraud */}
      {renderTable(
        fraudSites,
        'FR: Fraudulent / High Risk',
        'bg-red-100 text-red-900',
        'Domains marked as Fraud in WHMCS. This status indicates the domain or account has been flagged for fraudulent activity, suspicious behavior, or high-risk indicators requiring investigation.'
      )}
    </div>
  )
}
