import fs from 'fs'
import path from 'path'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sites List | Free For Charity Admin',
  description: 'Master list of all sites with server, Cloudflare, and pairing status.',
}

interface SiteData {
  section: string
  domain: string
  cloudflareIp: string
  isInCloudflare: string
  serverInUse: string
  oldServerAbandoned: string
  orgComPairStatus: string
  notes: string
  repoUrl: string
}

async function getSitesData(): Promise<SiteData[]> {
  const filePath = path.join(process.cwd(), 'docs', 'sites_list.csv')
  const fileContent = fs.readFileSync(filePath, 'utf8')

  const lines = fileContent.trim().split('\n')
  // Skip header
  const dataLines = lines.slice(1)

  return dataLines.map((line) => {
    // csv matching the new structure:
    // Section,Domain,Cloudflare IP,Is In Cloudflare,Server In Use,Old Server Abandoned?,ORG/COM Pair Status,Notes,Repo URL
    const columns = line.split(',')

    return {
      section: columns[0]?.trim() || '',
      domain: columns[1]?.trim() || '',
      cloudflareIp: columns[2]?.trim() || '',
      isInCloudflare: columns[3]?.trim() || '',
      serverInUse: columns[4]?.trim() || '',
      oldServerAbandoned: columns[5]?.trim() || '',
      orgComPairStatus: columns[6]?.trim() || '',
      notes: columns[7]?.trim() || '',
      repoUrl: columns[8]?.trim() || '',
    }
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
    const inCloudflare = site.isInCloudflare.toLowerCase() === 'yes'
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

  const getAbandonColor = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'yes') return 'text-red-600 font-bold'
    return 'text-gray-500'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ffc-teal-dark mb-4">Sites Master List</h1>
        <p className="text-gray-600">
          Authoritative list of all domains, server assignments, and migration status.
        </p>
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
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  GitHub Repo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Cloudflare IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                  Status
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 font-bold hover:underline">
                      <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer">
                        {site.domain}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {site.repoUrl ? (
                        <a
                          href={site.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Repo
                        </a>
                      ) : (
                        <span className="text-gray-400 text-center block">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-mono">
                      {site.cloudflareIp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Live
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{site.notes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 italic">
                    No fully migrated sites found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PriorityLegend />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-ffc-teal-lightest">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-ffc-teal-dark uppercase tracking-wider"
                >
                  Section
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-ffc-teal-dark uppercase tracking-wider"
                >
                  Domain
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-ffc-teal-dark uppercase tracking-wider"
                >
                  Cloudflare IP
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-ffc-teal-dark uppercase tracking-wider"
                >
                  In CF?
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-ffc-teal-dark uppercase tracking-wider"
                >
                  Server In Use
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-ffc-teal-dark uppercase tracking-wider"
                >
                  Old Server Abandoned?
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-ffc-teal-dark uppercase tracking-wider"
                >
                  ORG/COM Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-ffc-teal-dark uppercase tracking-wider"
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sites.map((site, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? 'bg-white hover:bg-ffc-teal-lightest/50'
                      : 'bg-gray-50 hover:bg-ffc-teal-lightest/50'
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-700">
                    {site.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ffc-teal font-medium hover:underline">
                    <a href={`https://${site.domain}`} target="_blank" rel="noopener noreferrer">
                      {site.domain}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600">
                    {site.cloudflareIp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(site.isInCloudflare)}`}
                    >
                      {site.isInCloudflare}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {site.serverInUse}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-center ${getAbandonColor(site.oldServerAbandoned)}`}
                  >
                    {site.oldServerAbandoned}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    {site.orgComPairStatus}
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
            Total Sites: <span className="font-medium">{sites.length}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
