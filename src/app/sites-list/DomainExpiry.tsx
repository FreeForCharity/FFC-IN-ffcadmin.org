import type { DomainExpiryData, ExpiryBucket } from '@/lib/dashboardData'
import { isStale, relativeAge } from '@/lib/dashboardData'

const BUCKET_CONFIG: Record<ExpiryBucket, { label: string; chip: string }> = {
  expired: { label: 'Expired', chip: 'bg-red-100 text-red-800' },
  expiring30: { label: '≤ 30 days', chip: 'bg-orange-100 text-orange-800' },
  expiring60: { label: '31–60 days', chip: 'bg-amber-100 text-amber-800' },
  expiring90: { label: '61–90 days', chip: 'bg-yellow-100 text-yellow-800' },
  ok: { label: '> 90 days', chip: 'bg-green-100 text-green-800' },
  unknown: { label: 'Unknown', chip: 'bg-gray-100 text-gray-600' },
}

/** Domains needing attention soon, surfaced as a focused alert table. */
const ALERT_BUCKETS: ExpiryBucket[] = ['expired', 'expiring30', 'expiring60', 'expiring90']

export default function DomainExpiry({ data }: { data: DomainExpiryData | null }) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Domain Expiration</h2>
        <p className="text-sm text-gray-600">
          Expiration data is not available yet — the scheduled RDAP workflow has not run.
        </p>
      </div>
    )
  }

  const stale = isStale(data.generatedAt, 14)
  const order: ExpiryBucket[] = [
    'expired',
    'expiring30',
    'expiring60',
    'expiring90',
    'ok',
    'unknown',
  ]
  const alerts = data.domains.filter((d) => ALERT_BUCKETS.includes(d.bucket))

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Domain Expiration</h2>
        <span className="text-xs text-gray-500">
          {data.source} · updated {relativeAge(data.generatedAt)}
        </span>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
        {order.map((b) => (
          <div key={b} className="text-center rounded-lg border border-gray-100 p-3">
            <div className="text-2xl font-bold text-gray-900">{data.summary[b] ?? 0}</div>
            <div className="text-[11px] text-gray-600">{BUCKET_CONFIG[b].label}</div>
          </div>
        ))}
      </div>

      {(data.seed || data.summary.total === 0) && (
        <p className="text-sm text-gray-600">
          {data.seed
            ? 'Showing placeholder data — awaiting the first scheduled RDAP run.'
            : 'No apex domains found to check.'}
        </p>
      )}

      {alerts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Domain
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Expires
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Days left
                </th>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
                  Registrar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alerts.map((d) => (
                <tr key={d.domain}>
                  <td className="px-4 py-2 font-medium text-gray-900">{d.domain}</td>
                  <td className="px-4 py-2 text-gray-700">{d.expiresAt ?? '—'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BUCKET_CONFIG[d.bucket].chip}`}
                    >
                      {d.daysRemaining ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{d.registrar || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stale && !data.seed && (
        <p className="mt-3 text-xs text-amber-700">This data may be out of date.</p>
      )}
    </div>
  )
}
