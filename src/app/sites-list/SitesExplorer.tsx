'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { isGithubHandle } from '@/data/site-owners'
import CopyRowButton from './CopyRowButton'
import {
  SiteData,
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
} from './sitesShared'
import {
  FilterState,
  EMPTY_FILTERS,
  FILTER_PRESETS,
  filterSites,
  hasActiveFilters,
  filtersToQuery,
  filtersFromQuery,
  sitesToCsv,
  sitesToJson,
} from './siteFilters'

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

function download(filename: string, mime: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  // Attach before clicking (Safari) and revoke on a delay so the browser
  // has started the download before the blob URL disappears.
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Interactive Sites List explorer (#412–#415, #426): multi-facet filter bar
 * with URL-synced state, preset chips, "/" search shortcut, live result count,
 * filtered CSV/JSON export, and the tier tables themselves.
 */
export default function SitesExplorer({ sites }: { sites: SiteData[] }) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const searchRef = useRef<HTMLInputElement>(null)

  // Restore filters from the query string on mount (#412). The static export
  // prerenders with empty filters, so the post-mount re-render IS the feature
  // — a one-time URL → state hydration, not a cascading-render hazard.
  useEffect(() => {
    const fromUrl = filtersFromQuery(window.location.search)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hasActiveFilters(fromUrl)) setFilters(fromUrl)
  }, [])
  // …and reflect every change back into a shareable URL.
  const syncUrl = (f: FilterState) => {
    setFilters(f)
    window.history.replaceState(null, '', `${window.location.pathname}${filtersToQuery(f)}`)
  }

  // "/" focuses search; Escape clears it (#414).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const active = hasActiveFilters(filters)
  const filtered = useMemo(() => filterSites(sites, filters), [sites, filters])
  const hostOptions = useMemo(
    () => [...new Set(sites.map((s) => s.hostCategory).filter(Boolean))].sort(),
    [sites]
  )
  const byTier = (num: string) => filtered.filter((s) => s.workTier.startsWith(num))
  const leftFfcSites = filtered
    .filter((s) => s.leftFfc === 'Yes')
    .sort((a, b) => a.domain.localeCompare(b.domain))

  const set = (patch: Partial<FilterState>) => syncUrl({ ...filters, ...patch })
  const presetActive = (p: Partial<FilterState>) =>
    Object.entries(p).every(([k, v]) => filters[k as keyof FilterState] === v)

  const selectCls =
    'rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:border-ffc-teal-dark focus:outline-none'

  return (
    <>
      {/* Filter bar (#415) */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={searchRef}
            type="search"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                set({ q: '' })
                searchRef.current?.blur()
              }
            }}
            placeholder="Search domains… ( / )"
            aria-label="Search domains or repos"
            className="w-56 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-ffc-teal-dark focus:outline-none"
          />
          <select
            value={filters.health}
            onChange={(e) => set({ health: e.target.value })}
            aria-label="Filter by health"
            className={selectCls}
          >
            <option value="">Health: all</option>
            <option value="live">Live</option>
            <option value="redirect">Redirect</option>
            <option value="error">Error</option>
            <option value="unreachable">Unreachable</option>
            <option value="problem">Error or unreachable</option>
            <option value="unknown">Unknown</option>
          </select>
          <select
            value={filters.tier}
            onChange={(e) => set({ tier: e.target.value })}
            aria-label="Filter by work tier"
            className={selectCls}
          >
            <option value="">Tier: all</option>
            {TIERS.map((t) => (
              <option key={t.num} value={t.num}>
                {t.num} — {t.title}
              </option>
            ))}
          </select>
          <select
            value={filters.host}
            onChange={(e) => set({ host: e.target.value })}
            aria-label="Filter by host"
            className={selectCls}
          >
            <option value="">Host: all</option>
            {hostOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <select
            value={filters.cf}
            onChange={(e) => set({ cf: e.target.value })}
            aria-label="Filter by Cloudflare"
            className={selectCls}
          >
            <option value="">Cloudflare: all</option>
            <option value="yes">In Cloudflare</option>
            <option value="no">Not in Cloudflare</option>
          </select>
          <select
            value={filters.repo}
            onChange={(e) => set({ repo: e.target.value })}
            aria-label="Filter by repo"
            className={selectCls}
          >
            <option value="">Repo: all</option>
            <option value="yes">Has repo</option>
            <option value="no">No repo</option>
          </select>
          {active && (
            <button
              type="button"
              onClick={() => syncUrl(EMPTY_FILTERS)}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Preset chips (#413) */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {FILTER_PRESETS.map((p) => {
            const isOn = presetActive(p.filters)
            // Compose with whatever else is set: toggling a preset only
            // touches its own facets (off = clear those facets, keep the rest).
            const cleared = Object.fromEntries(Object.keys(p.filters).map((k) => [k, '']))
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={isOn}
                onClick={() => syncUrl({ ...filters, ...(isOn ? cleared : p.filters) })}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  isOn
                    ? 'bg-ffc-teal-dark text-white border-ffc-teal-dark'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            )
          })}
          <span className="ml-auto text-sm text-gray-500" role="status">
            Showing <strong className="text-gray-900">{filtered.length}</strong> of {sites.length}{' '}
            domains
          </span>
          <button
            type="button"
            onClick={() => download('ffc-sites.csv', 'text/csv', sitesToCsv(filtered))}
            className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            title="Download the currently filtered rows as CSV"
          >
            ⬇ CSV
          </button>
          <button
            type="button"
            onClick={() => download('ffc-sites.json', 'application/json', sitesToJson(filtered))}
            className="rounded border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            title="Download the currently filtered rows as JSON"
          >
            ⬇ JSON
          </button>
        </div>
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
            open={active ? tierSites.length > 0 : t.open}
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
              <p className="px-6 py-4 text-sm text-gray-400 italic">
                {active ? 'No domains match the current filters.' : 'No domains in this tier.'}
              </p>
            )}
          </details>
        )
      })}
    </>
  )
}
