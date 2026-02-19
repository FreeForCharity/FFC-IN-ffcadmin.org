'use client'

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

interface HealthDashboardProps {
  sites: SiteData[]
}

function categorizeHealth(
  health: string
): 'live' | 'redirect' | 'error' | 'unreachable' | 'unknown' {
  const h = health.toLowerCase()
  if (h.includes('200') || h === 'live') return 'live'
  if (h.includes('301') || h.includes('302') || h === 'redirect') return 'redirect'
  if (
    h.includes('404') ||
    h.includes('403') ||
    h.includes('400') ||
    h.includes('500') ||
    h.includes('503') ||
    h.includes('502') ||
    h === 'error'
  )
    return 'error'
  if (h.includes('unreachable') || h.includes('no response')) return 'unreachable'
  return 'unknown'
}

const HEALTH_CONFIG = {
  live: {
    label: 'Live (200)',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
  },
  redirect: {
    label: 'Redirect (3xx)',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
  },
  error: {
    label: 'Error (4xx/5xx)',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
  },
  unreachable: {
    label: 'Unreachable',
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    bgLight: 'bg-gray-100',
  },
  unknown: {
    label: 'Unknown',
    color: 'bg-gray-300',
    textColor: 'text-gray-500',
    bgLight: 'bg-gray-50',
  },
}

export default function HealthDashboard({ sites }: HealthDashboardProps) {
  const counts = { live: 0, redirect: 0, error: 0, unreachable: 0, unknown: 0 }

  for (const site of sites) {
    counts[categorizeHealth(site.siteHealth)]++
  }

  const total = sites.length

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Health Overview</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {(Object.keys(HEALTH_CONFIG) as Array<keyof typeof HEALTH_CONFIG>).map((key) => (
          <div key={key} className={`${HEALTH_CONFIG[key].bgLight} rounded-lg p-3 text-center`}>
            <div className={`text-2xl font-bold ${HEALTH_CONFIG[key].textColor}`}>
              {counts[key]}
            </div>
            <div className="text-xs text-gray-600">{HEALTH_CONFIG[key].label}</div>
          </div>
        ))}
      </div>

      {/* Distribution bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Health Distribution</span>
          <span>{total} total domains</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
          {(Object.keys(HEALTH_CONFIG) as Array<keyof typeof HEALTH_CONFIG>).map((key) => {
            const pct = total > 0 ? (counts[key] / total) * 100 : 0
            if (pct === 0) return null
            return (
              <div
                key={key}
                className={`${HEALTH_CONFIG[key].color} h-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
                title={`${HEALTH_CONFIG[key].label}: ${counts[key]} (${Math.round(pct)}%)`}
              />
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {(Object.keys(HEALTH_CONFIG) as Array<keyof typeof HEALTH_CONFIG>).map((key) => {
          if (counts[key] === 0) return null
          const pct = total > 0 ? Math.round((counts[key] / total) * 100) : 0
          return (
            <div key={key} className="flex items-center text-xs text-gray-600">
              <div className={`w-3 h-3 rounded-full ${HEALTH_CONFIG[key].color} mr-1.5`} />
              {HEALTH_CONFIG[key].label}: {pct}%
            </div>
          )
        })}
      </div>
    </div>
  )
}
