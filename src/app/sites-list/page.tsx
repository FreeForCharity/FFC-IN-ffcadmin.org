import fs from 'fs'
import path from 'path'
import { Metadata } from 'next'
import { parse } from 'csv-parse/sync'
import HealthDashboard from './HealthDashboard'
import DomainExpiry from './DomainExpiry'
import NonprofitCallout from '@/components/NonprofitCallout'
import { loadDomainExpiry, relativeAge } from '@/lib/dashboardData'

export const metadata: Metadata = {
  title: 'Sites Master List',
  description:
    'Volunteer-focused dashboard of FFC-managed domains, grouped by how much effort they need — active development, stalled, needs migration, done, triage, and inactive.',
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
  repoArchived: string
  lastPrClosed: string
  openPrs: string
  lastCommit: string
  devStatus: string
  workTier: string
}

function getSitesData(): SiteData[] {
  const filePath = path.join(process.cwd(), 'docs', 'sites_list.csv')
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const records: Record<string, string>[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })
  return records.map((r) => ({
    section: r['Section'] || '',
    domain: r['Domain'] || '',
    status: r['Status'] || '',
    inWhmcs: r['In WHMCS'] || '',
    inCloudflare: r['In Cloudflare'] || '',
    inWpmudev: r['In WPMUDEV'] || '',
    serverInUse: r['Server In Use'] || '',
    oldServerAbandoned: r['Old Server Abandoned?'] || '',
    notes: r['Notes'] || '',
    cloudflareIp: r['Cloudflare IP'] || '',
    repoUrl: r['Repo URL'] || '',
    siteHealth: r['Site Health'] || '',
    priority: r['Priority'] || 'Standard',
    repoArchived: r['Repo Archived'] || '',
    lastPrClosed: r['Last PR Closed'] || '',
    openPrs: r['Open PRs'] || '',
    lastCommit: r['Last Commit'] || '',
    devStatus: r['Dev Status'] || '',
    // Fall back to a derived tier if the data predates enrichment.
    workTier: r['Work Tier'] || deriveTier(r),
  }))
}

// Fallback tiering for data that hasn't been through the enrichment step yet.
function deriveTier(r: Record<string, string>): string {
  const status = (r['Status'] || '').toLowerCase()
  const server = (r['Server In Use'] || '').toLowerCase()
  if (['expired', 'cancelled', 'fraud', 'terminated', 'transferred away'].includes(status))
    return '6 - Inactive / Archive'
  if (server === 'github pages') return '4 - Done / Stable'
  if (
    ['hostpapa', 'interserver', 'hostinger', 'krystal', 'cloudflare proxy'].some((s) =>
      server.includes(s)
    )
  )
    return '3 - Needs Migration'
  return '5 - Needs Triage'
}

const TIERS = [
  {
    num: '1',
    icon: '🔨',
    title: 'Active Development',
    blurb:
      'A GitHub repo with a pull request closed in the last 45 days. Momentum is here — the fastest way to help is to keep these moving.',
    header: 'bg-green-100 text-green-900 border-green-200',
    open: true,
  },
  {
    num: '2',
    icon: '🌱',
    title: 'Has Repo, Stalled',
    blurb:
      'A repo exists but has gone quiet (no recent merged PRs). High-value to revive — the groundwork is already done.',
    header: 'bg-yellow-100 text-yellow-900 border-yellow-200',
    open: true,
  },
  {
    num: '3',
    icon: '🚚',
    title: 'Needs Migration',
    blurb:
      'Active domains still served from legacy hosting (HostPapa, InterServer, Hostinger, Krystal). The goal is to move them to a GitHub Pages repo.',
    header: 'bg-blue-100 text-blue-900 border-blue-200',
    open: true,
  },
  {
    num: '4',
    icon: '✅',
    title: 'Done / Stable',
    blurb:
      'Fully migrated (apex domain + Cloudflare + GitHub Pages) and responding. The desired end state — little effort needed.',
    header: 'bg-teal-100 text-teal-900 border-teal-200',
    open: false,
  },
  {
    num: '5',
    icon: '🔍',
    title: 'Needs Triage',
    blurb:
      'Active domains with no matched repo and unclear hosting. Investigate (is there a site? a repo elsewhere?) before assigning volunteer effort.',
    header: 'bg-gray-100 text-gray-900 border-gray-200',
    open: false,
  },
  {
    num: '6',
    icon: '💤',
    title: 'Inactive / Archive',
    blurb:
      'Expired, cancelled, fraud, terminated, or transferred away. Not worth volunteer effort.',
    header: 'bg-red-100 text-red-900 border-red-200',
    open: false,
  },
]

function healthBadge(health: string): string {
  const h = health.toLowerCase()
  if (h === 'live') return 'text-green-700 bg-green-100 border-green-200'
  if (h === 'redirect') return 'text-yellow-700 bg-yellow-100 border-yellow-200'
  if (h === 'error' || h === 'unreachable') return 'text-red-700 bg-red-100 border-red-200'
  return 'text-gray-600 bg-gray-100 border-gray-200'
}

function tierRank(s: SiteData): number {
  const h = s.siteHealth.toLowerCase()
  if (h === 'live') return 1
  if (h === 'redirect') return 2
  if (h === 'error') return 3
  if (h === 'unreachable') return 4
  return 5
}

// Within a tier, lead with the most recently active (tiers 1/2) or healthiest.
function sortTier(sites: SiteData[], num: string): SiteData[] {
  return [...sites].sort((a, b) => {
    if (num === '1' || num === '2') {
      if (a.lastPrClosed !== b.lastPrClosed) return b.lastPrClosed.localeCompare(a.lastPrClosed)
    }
    const r = tierRank(a) - tierRank(b)
    if (r !== 0) return r
    return a.domain.localeCompare(b.domain)
  })
}

function repoName(url: string): string {
  return url.replace('https://github.com/', '')
}

function TierTable({ sites, num }: { sites: SiteData[]; num: string }) {
  const showRepoCols = num === '1' || num === '2'
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Domain', 'Repo', 'Last PR', 'Open PRs', 'Health', 'Server', 'Status', 'Notes'].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sites.map((s, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap font-medium">
                <a
                  href={`https://${s.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {s.domain}
                </a>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-xs">
                {s.repoUrl ? (
                  <a
                    href={s.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                    title={repoName(s.repoUrl)}
                  >
                    {showRepoCols ? repoName(s.repoUrl).split('/').pop() : 'Repo'}
                  </a>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                {s.lastPrClosed || <span className="text-gray-300">—</span>}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                {s.openPrs && s.openPrs !== '0' ? (
                  s.openPrs
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${healthBadge(s.siteHealth)}`}
                >
                  {s.siteHealth || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">
                {s.serverInUse || <span className="text-gray-300">—</span>}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">{s.status}</td>
              <td className="px-4 py-2 text-xs text-gray-500 max-w-xs truncate" title={s.notes}>
                {s.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SitesListPage() {
  const sites = getSitesData()
  const domainExpiry = loadDomainExpiry()

  let csvUpdated = ''
  try {
    const stat = fs.statSync(path.join(process.cwd(), 'docs', 'sites_list.csv'))
    csvUpdated = relativeAge(stat.mtime.toISOString())
  } catch {
    csvUpdated = ''
  }

  const byTier = (num: string) => sites.filter((s) => s.workTier.startsWith(num))
  const counts = Object.fromEntries(TIERS.map((t) => [t.num, byTier(t.num).length]))

  const stat = (label: string, value: number, color: string, icon: string) => (
    <div className={`bg-white rounded-lg shadow-md border p-4 text-center ${color}`}>
      <p className="text-3xl font-bold">
        {icon} {value}
      </p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Sites Master List</h1>
          <p className="text-teal-100 text-lg max-w-3xl">
            Domains grouped by how much effort they need — so volunteers can see at a glance where
            their time is best spent.
          </p>
          {csvUpdated && (
            <p className="text-teal-200 text-xs mt-2">Site data refreshed {csvUpdated}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Volunteer guide */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-ffc-teal-dark mb-2">Where should I help?</h2>
          <p className="text-gray-600 text-sm">
            Sites are sorted into <strong>Work Tiers</strong>. Start at the top: 🔨 sites under
            active development (keep the momentum), then 🌱 stalled repos (revive them), then 🚚
            domains still stuck on legacy servers (migrate them). ✅ done, 🔍 triage, and 💤
            inactive are collapsed below.
          </p>
        </div>

        {/* Tier stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stat('Active Development', counts['1'], 'border-green-200', '🔨')}
          {stat('Stalled Repos', counts['2'], 'border-yellow-200', '🌱')}
          {stat('Needs Migration', counts['3'], 'border-blue-200', '🚚')}
          {stat('Done / Stable', counts['4'], 'border-teal-200', '✅')}
        </div>

        {/* Work Tier sections */}
        {TIERS.map((t) => {
          const tierSites = sortTier(byTier(t.num), t.num)
          return (
            <details
              key={t.num}
              open={t.open}
              className="mb-6 rounded-lg shadow-md border border-gray-200 bg-white overflow-hidden"
            >
              <summary className={`px-6 py-4 cursor-pointer border-b ${t.header}`}>
                <span className="text-lg font-bold">
                  {t.icon} Tier {t.num}: {t.title}
                </span>
                <span className="ml-2 text-sm font-semibold opacity-80">({tierSites.length})</span>
                <p className="text-sm mt-1 opacity-80 font-normal">{t.blurb}</p>
              </summary>
              {tierSites.length > 0 ? (
                <TierTable sites={tierSites} num={t.num} />
              ) : (
                <p className="px-6 py-4 text-sm text-gray-400 italic">No domains in this tier.</p>
              )}
            </details>
          )
        })}

        {/* Supporting context */}
        <div className="mt-10">
          <HealthDashboard sites={sites} />
          <DomainExpiry data={domainExpiry} />
        </div>
      </div>

      <NonprofitCallout />
    </div>
  )
}
