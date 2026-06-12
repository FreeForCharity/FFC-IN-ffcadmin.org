import { Metadata } from 'next'
import { assetPath } from '@/lib/assetPath'
import { loadDomainExpiry, relativeAge } from '@/lib/dashboardData'
import { ViewNav } from '../PersonaView'
import { loadSites, healthBadge, healthCategory, dataGeneratedAt } from '../sitesData'

export const metadata: Metadata = {
  title: 'Ops Summary — Sites',
  description:
    'One-page operational summary of FFC-managed sites: tier counts, problem sites, and upcoming domain expirations. Print-friendly.',
}

/**
 * Condensed, print-friendly ops summary (#427): tier counts, errored sites,
 * and expiring domains on one page — for a standup or a PDF. The same alerts
 * are machine-readable at /data/sites-alerts.json (regenerated every build).
 */
// Static asset (not a route), so it's an <a> with assetPath, not <Link>.
const ALERTS_FEED_HREF = assetPath('/data/sites-alerts.json')

export default function OpsSummaryPage() {
  const sites = loadSites()
  const expiry = loadDomainExpiry()
  const generated = dataGeneratedAt(sites)

  const managed = sites.filter((s) => !s.workTier.startsWith('6') && s.leftFfc !== 'Yes')
  const problems = managed
    .filter((s) => ['error', 'unreachable'].includes(healthCategory(s.siteHealth)))
    .sort((a, b) => a.domain.localeCompare(b.domain))
  const changed = sites.filter((s) => s.changed).sort((a, b) => a.domain.localeCompare(b.domain))
  const expiring = (expiry?.domains || []).filter((d) =>
    ['expired', 'expiring30', 'expiring60'].includes(d.bucket)
  )

  const tierCount = (num: string) => sites.filter((s) => s.workTier.startsWith(num)).length
  const tiers: [string, string][] = [
    ['1', '🔨 Active Dev'],
    ['2', '🌱 Stalled'],
    ['3', '🚚 Needs Migration'],
    ['4', '✅ Done / Stable'],
    ['5', '🔍 Needs Triage'],
    ['6', '💤 Inactive'],
  ]

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">🖨 Ops Summary</h1>
          <p className="text-white/90 text-lg max-w-3xl">
            The whole estate on one page — tier counts, problem sites, and upcoming domain
            expirations. Print it (Ctrl/Cmd+P) for a standup, or consume the same alerts as JSON.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl print:py-2">
        <div className="print:hidden">
          <ViewNav current="/sites-list/summary" />
        </div>

        <h2 className="hidden print:block text-2xl font-bold mb-1">FFC Sites — Ops Summary</h2>
        <p className="text-sm text-gray-500 mb-6">
          {sites.length} domains tracked · snapshot activity through {generated || 'n/a'}
          {generated && ` (${relativeAge(generated)})`} ·{' '}
          <a href={ALERTS_FEED_HREF} className="text-blue-600 underline print:hidden">
            alerts feed (JSON)
          </a>
        </p>

        {/* Tier counts */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8 print:gap-1">
          {tiers.map(([num, label]) => (
            <div
              key={num}
              className="bg-white rounded-lg border border-gray-200 p-3 text-center print:p-1"
            >
              <p className="text-2xl font-bold tabular-nums">{tierCount(num)}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Problem sites */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            🔥 Problem sites <span className="font-normal text-gray-500">({problems.length})</span>
          </h2>
          {problems.length === 0 ? (
            <p className="text-sm text-gray-500">No managed site is errored or unreachable. 🎉</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Domain', 'Health', 'Tier', 'Server'].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-3 py-2 text-left text-xs font-bold uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {problems.map((s) => (
                  <tr key={s.domain}>
                    <td className="px-3 py-1.5 font-medium">{s.domain}</td>
                    <td className="px-3 py-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${healthBadge(s.siteHealth)}`}
                      >
                        {s.siteHealth || 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-xs text-gray-600">{s.workTier}</td>
                    <td className="px-3 py-1.5 text-xs text-gray-600">{s.serverInUse || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Expiring domains */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            ⏳ Domains expiring soon{' '}
            <span className="font-normal text-gray-500">({expiring.length})</span>
          </h2>
          {expiring.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nothing expired or expiring within 60 days
              {expiry ? '' : ' (no expiry feed available)'}.
            </p>
          ) : (
            <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm">
              {expiring.map((d) => (
                <li key={d.domain} className="px-3 py-1.5 flex justify-between gap-3">
                  <span className="font-medium">{d.domain}</span>
                  <span
                    className={
                      d.bucket === 'expiring60' ? 'text-yellow-700' : 'font-semibold text-red-700'
                    }
                  >
                    {d.bucket === 'expired' ? 'EXPIRED' : `expires ${d.expiresAt || 'soon'}`}
                    {d.daysRemaining != null && ` (${d.daysRemaining}d)`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Changed since last refresh */}
        {changed.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Δ Changed since last refresh{' '}
              <span className="font-normal text-gray-500">({changed.length})</span>
            </h2>
            <ul className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm">
              {changed.map((s) => (
                <li key={s.domain} className="px-3 py-1.5">
                  <span className="font-medium">{s.domain}</span>{' '}
                  <span className="text-gray-600">— {s.changed}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-xs text-gray-400 print:mt-4">
          Automations can poll{' '}
          <code className="bg-gray-100 px-1 rounded">/data/sites-alerts.json</code> — regenerated on
          every deploy; shape documented in docs/data-contracts.md.
        </p>
      </div>
    </div>
  )
}
