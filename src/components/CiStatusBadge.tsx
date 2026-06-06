import type { CiStatusData } from '@/lib/dashboardData'
import { isStale, relativeAge } from '@/lib/dashboardData'

const CONCLUSION_STYLES: Record<string, { label: string; dot: string; chip: string }> = {
  success: {
    label: 'Passing',
    dot: 'bg-green-500',
    chip: 'bg-green-50 text-green-800 border-green-200',
  },
  failure: { label: 'Failing', dot: 'bg-red-500', chip: 'bg-red-50 text-red-800 border-red-200' },
  cancelled: {
    label: 'Cancelled',
    dot: 'bg-gray-400',
    chip: 'bg-gray-50 text-gray-700 border-gray-200',
  },
}

const UNKNOWN = {
  label: 'Unknown',
  dot: 'bg-gray-300',
  chip: 'bg-gray-50 text-gray-600 border-gray-200',
}

/**
 * Live CI status, read from committed JSON (#337). Renders nothing intrusive
 * when data is missing; flags seed/stale data instead of hiding it.
 */
export default function CiStatusBadge({ data }: { data: CiStatusData | null }) {
  if (!data || data.workflows.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        Live CI status is not available yet — the scheduled workflow has not run.
      </div>
    )
  }

  const stale = isStale(data.generatedAt, 3)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900">Live CI status</h3>
        <span className="text-xs text-gray-500">Updated {relativeAge(data.generatedAt)}</span>
      </div>
      <ul className="space-y-2">
        {data.workflows.map((wf) => {
          const style =
            wf.status === 'completed' && wf.conclusion
              ? (CONCLUSION_STYLES[wf.conclusion] ?? UNKNOWN)
              : wf.status === 'in_progress' || wf.status === 'queued'
                ? {
                    label: 'Running',
                    dot: 'bg-blue-500',
                    chip: 'bg-blue-50 text-blue-800 border-blue-200',
                  }
                : UNKNOWN
          const chip = (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${style.chip}`}
            >
              <span className={`w-2 h-2 rounded-full ${style.dot}`} aria-hidden="true" />
              {style.label}
            </span>
          )
          return (
            <li key={wf.name} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{wf.name}</span>
              {wf.runUrl ? (
                <a
                  href={wf.runUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80"
                >
                  {chip}
                </a>
              ) : (
                chip
              )}
            </li>
          )
        })}
      </ul>
      {(data.seed || stale) && (
        <p className="mt-3 text-xs text-amber-700">
          {data.seed
            ? 'Showing placeholder data — awaiting the first scheduled run.'
            : 'This data may be out of date.'}
        </p>
      )}
    </div>
  )
}
