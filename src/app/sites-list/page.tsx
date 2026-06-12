import { Metadata } from 'next'
import HealthDashboard from './HealthDashboard'
import DomainExpiry from './DomainExpiry'
import NonprofitCallout from '@/components/NonprofitCallout'
import { loadDomainExpiry, relativeAge } from '@/lib/dashboardData'
import { isGithubHandle } from '@/data/site-owners'
import { ViewNav } from './PersonaView'
import CopyRowButton from './CopyRowButton'
import {
  SiteData,
  loadSites,
  dataRefreshedAge,
  healthBadge,
  healthCategory,
  cloudflareZoneUrl,
  cloudflareDnsRecordsUrl,
  dnsCheckerUrl,
  pagesSettingsUrl,
  newIssueUrl,
  rowMarkdown,
  migrationSteps,
  sslBadge,
  lighthouseBadge,
  dataGeneratedAt,
  dataIsStale,
} from './sitesData'

export const metadata: Metadata = {
  title: 'Sites Master List',
  description:
    'Volunteer-focused dashboard of FFC-managed domains, grouped by how much effort they need — active development, stalled, needs migration, done, triage, and inactive.',
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

function tierRank(s: SiteData): number {
  return { live: 1, redirect: 2, error: 3, unreachable: 4, unknown: 5 }[
    healthCategory(s.siteHealth)
  ]
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

// Data source per column, surfaced as header tooltips and in the legend (#417).
const COLUMN_SOURCE: Record<string, string> = {
  Domain: 'WHMCS export (domain inventory)',
  Repo: 'GitHub API',
  'Last PR': 'GitHub API',
  'Open PRs': 'GitHub API',
  Health: 'HTTP health probe',
  SSL: 'TLS probe (upstream pipeline)',
  LH: 'Lighthouse CI (upstream pipeline)',
  Owner: 'src/data/site-owners.ts in this repo',
  Progress: 'Derived from Cloudflare, repo, server, and health fields',
  Server: 'HTTP health probe / host detection',
  Status: 'WHMCS export',
  Notes: 'WHMCS export',
}

// Compact per-row quick-action links under the domain (#408, #410, #411, #423).
function RowActions({ s }: { s: SiteData }) {
  const action = (href: string, label: string, title: string) => (
    <a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className="text-gray-500 hover:text-gray-800 hover:underline"
    >
      {label}
    </a>
  )
  const cf = cloudflareZoneUrl(s)
  const dnsRecords = cloudflareDnsRecordsUrl(s)
  const actions = [
    cf && action(cf, '☁ CF', `Open ${s.domain} in the Cloudflare dashboard`),
    dnsRecords && action(dnsRecords, 'DNS', `Cloudflare DNS records for ${s.domain}`),
    action(dnsCheckerUrl(s.domain), 'check', `DNS propagation check for ${s.domain}`),
    s.repoUrl &&
      action(
        s.repoUrl,
        s.openPrs && s.openPrs !== '0' ? `repo (${s.openPrs} PRs)` : 'repo',
        `GitHub repository: ${repoName(s.repoUrl)}`
      ),
    pagesSettingsUrl(s) &&
      action(pagesSettingsUrl(s), 'pages', `GitHub Pages settings for ${s.domain}`),
    action(newIssueUrl(s), '+issue', `Open a prefilled GitHub issue about ${s.domain}`),
  ].filter(Boolean)
  return (
    <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] leading-4">
      {actions}
      <CopyRowButton text={rowMarkdown(s)} domain={s.domain} />
    </div>
  )
}

// 4-step migration progress dots, derived from existing fields (#424).
function MigrationProgress({ s }: { s: SiteData }) {
  const steps = migrationSteps(s)
  const done = steps.filter((x) => x.done).length
  return (
    <span title={steps.map((x) => `${x.done ? '✓' : '○'} ${x.label}`).join('\n')}>
      <span aria-hidden="true" className="tracking-widest text-ffc-teal-dark">
        {steps.map((x) => (x.done ? '●' : '○')).join('')}
      </span>
      <span className="sr-only">{`${done} of ${steps.length} migration steps complete`}</span>
      <span className="ml-1 text-[11px] text-gray-500 tabular-nums">{done}/4</span>
    </span>
  )
}

function TierTable({ sites, num }: { sites: SiteData[]; num: string }) {
  // Dev tiers (1, 2) lead with repo activity; other tiers hide those columns.
  const showRepoCols = num === '1' || num === '2'
  // Optional data-signal columns render only when the snapshot carries data.
  const hasSsl = sites.some((s) => s.sslExpiry)
  const hasLh = sites.some((s) => s.lighthouse)
  const hasOwner = sites.some((s) => s.owner)
  const showProgress = num === '3'
  const headers = [
    'Domain',
    ...(showRepoCols ? ['Repo', 'Last PR', 'Open PRs'] : []),
    'Health',
    ...(hasSsl ? ['SSL'] : []),
    ...(hasLh ? ['LH'] : []),
    ...(hasOwner ? ['Owner'] : []),
    ...(showProgress ? ['Progress'] : []),
    'Server',
    'Status',
    'Notes',
  ]
  const dash = <span className="text-gray-300">—</span>
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                scope="col"
                title={COLUMN_SOURCE[h] ? `Source: ${COLUMN_SOURCE[h]}` : undefined}
                className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                {h}
                {COLUMN_SOURCE[h] && (
                  <span className="sr-only">{` (source: ${COLUMN_SOURCE[h]})`}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sites.map((s) => {
            return (
              <tr key={`${num}-${s.domain}`} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap font-medium">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://${s.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {s.domain}
                    </a>
                    {s.nsMatch.toLowerCase() === 'no' && (
                      <span
                        title="Live nameservers do not match Cloudflare"
                        className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-700 border border-red-200"
                      >
                        <span aria-hidden="true">⚠ </span>NS
                      </span>
                    )}
                    {s.changed && (
                      <span
                        title={s.changed}
                        className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-700 border border-purple-200"
                      >
                        Δ
                        <span className="sr-only">{` Changed since last refresh: ${s.changed}`}</span>
                      </span>
                    )}
                  </div>
                  <RowActions s={s} />
                </td>
                {showRepoCols && (
                  <>
                    <td className="px-4 py-2 whitespace-nowrap text-xs">
                      {s.repoUrl ? (
                        <a
                          href={s.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                          title={repoName(s.repoUrl)}
                        >
                          {repoName(s.repoUrl).split('/').pop()}
                        </a>
                      ) : (
                        dash
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {s.lastPrClosed || dash}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                      {s.openPrs && s.openPrs !== '0' ? s.openPrs : dash}
                    </td>
                  </>
                )}
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${healthBadge(s.siteHealth)}`}
                  >
                    {s.siteHealth || 'N/A'}
                  </span>
                  {s.redirectTarget && (
                    <p
                      className="mt-0.5 text-[11px] text-gray-500 max-w-[12rem] truncate"
                      title={`Redirects to ${s.redirectTarget}`}
                    >
                      → {s.redirectTarget}
                    </p>
                  )}
                </td>
                {hasSsl && (
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    {s.sslExpiry ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${sslBadge(s.sslExpiry)}`}
                        title={`TLS certificate expires ${s.sslExpiry}`}
                      >
                        {s.sslExpiry}
                      </span>
                    ) : (
                      dash
                    )}
                  </td>
                )}
                {hasLh && (
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    {s.lighthouse ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${lighthouseBadge(Number(s.lighthouse))}`}
                        title={`Lighthouse score ${s.lighthouse}/100`}
                      >
                        {s.lighthouse}
                      </span>
                    ) : (
                      dash
                    )}
                  </td>
                )}
                {hasOwner && (
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    {s.owner ? (
                      isGithubHandle(s.owner) ? (
                        <a
                          href={`https://github.com/${s.owner}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          @{s.owner}
                        </a>
                      ) : (
                        s.owner
                      )
                    ) : (
                      dash
                    )}
                  </td>
                )}
                {showProgress && (
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    <MigrationProgress s={s} />
                  </td>
                )}
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">
                  {s.serverInUse || dash}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">{s.status}</td>
                <td className="px-4 py-2 text-xs text-gray-500 max-w-xs truncate" title={s.notes}>
                  {s.notes}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function SitesListPage() {
  const sites = loadSites()
  const domainExpiry = loadDomainExpiry()
  const csvUpdated = dataRefreshedAge()

  const byTier = (num: string) => sites.filter((s) => s.workTier.startsWith(num))
  const counts = Object.fromEntries(TIERS.map((t) => [t.num, byTier(t.num).length]))

  // Domains transferred away from eNom AND no longer in FFC Cloudflare — i.e.
  // they actually left FFC. Surfaced prominently for cleanup/outreach.
  const leftFfcSites = sites
    .filter((s) => s.leftFfc === 'Yes')
    .sort((a, b) => a.domain.localeCompare(b.domain))

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
        <ViewNav current="/sites-list" />

        {/* Stale-data warning (#416): the snapshot can't be newer than the
            newest GitHub activity it recorded, so an old max date means the
            weekly sync likely failed. */}
        {dataIsStale(sites) && (
          <div
            role="status"
            className="mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
          >
            <span aria-hidden="true">⚠️ </span>
            <strong>Site data may be stale.</strong> The newest activity in this snapshot is from{' '}
            {dataGeneratedAt(sites)} ({relativeAge(dataGeneratedAt(sites))}). The weekly{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/actions/workflows/update-sites-data.yml"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-700"
            >
              Sync Sites List Data
            </a>{' '}
            workflow may have failed.
          </div>
        )}

        {/* Volunteer guide */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-ffc-teal-dark mb-2">Where should I help?</h2>
          <p className="text-gray-600 text-sm mb-2">
            New: pick a <strong>volunteer view</strong> above — 🚚 Migration, 🔧 Maintenance, or 🛠️
            Development — for a ranked, scored worklist tailored to that kind of work.
          </p>
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

        {/* Domains that left FFC (transferred away + not in FFC Cloudflare) */}
        {leftFfcSites.length > 0 && (
          <details className="mb-8 rounded-lg shadow-md border border-red-300 bg-red-50 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer bg-red-100 text-red-900 border-b border-red-200">
              <span className="text-lg font-bold">🚨 Left FFC — needs attention</span>
              <span className="ml-2 text-sm font-semibold opacity-80">({leftFfcSites.length})</span>
              <p className="text-sm mt-1 opacity-80 font-normal">
                Transferred away from eNom <strong>and</strong> no longer in FFC Cloudflare — FFC no
                longer manages DNS for these. Still in WHMCS, so worth a cleanup/outreach pass (some
                are still live under their new owner).
              </p>
            </summary>
            <TierTable sites={leftFfcSites} num="6" />
          </details>
        )}

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

        {/* Data provenance legend (#417) */}
        <details className="mb-6 rounded-lg border border-gray-200 bg-white px-6 py-4 text-sm text-gray-700 shadow-md">
          <summary className="cursor-pointer font-bold text-gray-900">
            Where this data comes from
          </summary>
          <ul className="mt-3 space-y-1 list-disc pl-5">
            <li>
              <strong>WHMCS export</strong> — domain inventory, status, notes, expiry, recurring.
            </li>
            <li>
              <strong>Cloudflare API</strong> — In Cloudflare, zone IPs (powers the ☁ CF and DNS
              quick-links).
            </li>
            <li>
              <strong>GitHub API</strong> — repo, last PR, open PRs, last commit, archived.
            </li>
            <li>
              <strong>HTTP health probe</strong> — health badge, redirect detail, server detection.
            </li>
            <li>
              <strong>Derived by the generator</strong> — work tiers, persona scores, migration
              progress.
            </li>
            <li>
              <strong>This repo</strong> — owners (<code>src/data/site-owners.ts</code>; PR a line
              to claim a site).
            </li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            Hover any column header for its source. Assembled weekly by the{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-Cloudflare-Automation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              FFC-Cloudflare-Automation
            </a>{' '}
            generator; a Δ badge marks rows that changed since the previous refresh.
          </p>
        </details>

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
