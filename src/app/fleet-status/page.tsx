import type { Metadata } from 'next'
import {
  loadFleetSmoke,
  isStale,
  relativeAge,
  type FleetSmokeSite,
  type FleetSmokeState,
} from '@/lib/dashboardData'
import { assetPath } from '@/lib/assetPath'

export const metadata: Metadata = {
  title: 'Fleet Status',
  description:
    'Live verification status for every Free For Charity website: the latest post-deploy and daily-uptime smoke test result per charity site, updated automatically.',
  keywords:
    'nonprofit website status, charity site uptime, smoke tests, Free For Charity fleet, site monitoring',
}

// Hoisted so the lint rule's Literal-in-JSX-href selector doesn't match (same
// pattern as /automation's CATALOG_JSON_HREF).
const STATUS_JSON_HREF = assetPath('/data/fleet-smoke-status.json')
const ENGINE_EPIC_HREF = 'https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/738'

const STATE_STYLES: Record<
  FleetSmokeState,
  { label: string; dot: string; card: string; order: number }
> = {
  failing: {
    label: 'Failing',
    dot: 'bg-red-500',
    card: 'bg-red-50 border-red-200',
    order: 0,
  },
  'stale-monitor': {
    label: 'Monitoring stopped',
    dot: 'bg-purple-500',
    card: 'bg-purple-50 border-purple-200',
    order: 1,
  },
  running: {
    label: 'Running',
    dot: 'bg-blue-500',
    card: 'bg-blue-50 border-blue-200',
    order: 2,
  },
  passing: {
    label: 'Passing',
    dot: 'bg-green-500',
    card: 'bg-white border-gray-200',
    order: 3,
  },
  pending: {
    label: 'Awaiting first run',
    dot: 'bg-amber-400',
    card: 'bg-amber-50 border-amber-200',
    order: 4,
  },
  'not-cutover': {
    label: 'Not cut over yet',
    dot: 'bg-gray-300',
    card: 'bg-gray-50 border-gray-200',
    order: 5,
  },
  unknown: {
    label: 'Unknown',
    dot: 'bg-gray-300',
    card: 'bg-gray-50 border-gray-200',
    order: 6,
  },
}

function SiteTile({ site }: { site: FleetSmokeSite }) {
  const style = STATE_STYLES[site.state] ?? STATE_STYLES.unknown
  const title = site.domain ?? site.repo.replace(/^FFC-EX-/, '')
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${style.card}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-semibold text-gray-900 text-sm break-all">{title}</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap">
          <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} aria-hidden="true" />
          {style.label}
        </span>
      </div>
      <div className="text-xs text-gray-500 mb-2">{site.repo}</div>
      {site.state === 'stale-monitor' && site.staleReason && (
        <div className="text-xs text-purple-800 font-medium mb-2">
          Monitoring stopped — {site.staleReason}.
        </div>
      )}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {site.domain && (
          <a
            href={`https://${site.domain}/`}
            className="text-blue-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit site
          </a>
        )}
        {site.smoke?.runUrl && (
          <a
            href={site.smoke.runUrl}
            className="text-blue-700 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Latest run ({relativeAge(site.smoke.updatedAt)})
          </a>
        )}
        {site.failureIssue && (
          <a
            href={site.failureIssue.url}
            className="text-red-700 font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Issue #{site.failureIssue.number}
          </a>
        )}
      </div>
    </div>
  )
}

export default function FleetStatus() {
  const data = loadFleetSmoke()

  if (!data) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Fleet Status</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-gray-600">
          Fleet smoke data is not available yet — the scheduled refresh workflow has not produced
          <code className="mx-1">fleet-smoke-status.json</code>. It runs daily after the fleet-wide
          smoke pass.
        </div>
      </main>
    )
  }

  const stale = isStale(data.generatedAt, 2)
  const sites = [...data.sites].sort(
    (a, b) =>
      (STATE_STYLES[a.state]?.order ?? 9) - (STATE_STYLES[b.state]?.order ?? 9) ||
      (a.domain ?? a.repo).localeCompare(b.domain ?? b.repo)
  )
  const chips: { state: FleetSmokeState; count: number }[] = (
    Object.keys(STATE_STYLES) as FleetSmokeState[]
  )
    .map((state) => ({ state, count: data.summary[state] ?? 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => STATE_STYLES[a.state].order - STATE_STYLES[b.state].order)

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Fleet Status</h1>
      <p className="text-gray-600 mb-1">
        The latest smoke-test verdict for every Free For Charity website. Each cut-over site is
        verified after every deploy and once a day by the{' '}
        <a
          href={ENGINE_EPIC_HREF}
          className="text-blue-700 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          fleet smoke engine
        </a>
        ; failures automatically open a high-priority issue in the site&apos;s repo and close
        themselves on recovery.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Updated {relativeAge(data.generatedAt)} · {data.repoCount} repos ·{' '}
        <a href={STATUS_JSON_HREF} className="text-blue-700 hover:underline">
          raw JSON
        </a>
      </p>

      {stale && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900 mb-6">
          This snapshot is more than 2 days old — the refresh workflow may be stalled. Recent
          results on GitHub are authoritative.
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {chips.map(({ state, count }) => (
          <span
            key={state}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${STATE_STYLES[state].dot}`}
              aria-hidden="true"
            />
            {count} {STATE_STYLES[state].label.toLowerCase()}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <SiteTile key={site.repo} site={site} />
        ))}
      </div>
    </main>
  )
}
