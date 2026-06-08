import Link from 'next/link'
import { SiteData, healthBadge } from './sitesData'

const VIEWS = [
  { href: '/sites-list', label: 'Overview', icon: '📋' },
  { href: '/sites-list/migration', label: 'Migration', icon: '🚚' },
  { href: '/sites-list/maintenance', label: 'Maintenance', icon: '🔧' },
  { href: '/sites-list/development', label: 'Development', icon: '🛠️' },
]

export function ViewNav({ current }: { current: string }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-8">
      {VIEWS.map((v) => (
        <Link
          key={v.href}
          href={v.href}
          className={`px-4 py-2 rounded-full text-sm font-semibold border ${
            current === v.href
              ? 'bg-ffc-teal-dark text-white border-ffc-teal-dark'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {v.icon} {v.label}
        </Link>
      ))}
    </nav>
  )
}

type Col = 'host' | 'wp' | 'age' | 'repo' | 'lastPr' | 'staging'

export function PersonaView({
  href,
  icon,
  title,
  intro,
  accent,
  sites,
  score,
  columns,
  refreshed,
}: {
  href: string
  icon: string
  title: string
  intro: string
  accent: string
  sites: SiteData[]
  score: (s: SiteData) => number
  columns: Col[]
  refreshed: string
}) {
  const ranked = [...sites].filter((s) => score(s) > 0).sort((a, b) => score(b) - score(a))
  const max = ranked.length ? score(ranked[0]) : 1
  const colLabel: Record<Col, string> = {
    host: 'Host',
    wp: 'WordPress',
    age: 'Age (yrs)',
    repo: 'Repo',
    lastPr: 'Last PR',
    staging: 'Staging',
  }
  const dash = <span className="text-gray-300">—</span>
  const cell = (s: SiteData, c: Col) => {
    switch (c) {
      case 'host':
        return s.hostCategory || dash
      case 'wp':
        return s.inWpmudev === 'Yes' ? '✅' : dash
      case 'age':
        return s.domainAge || dash
      case 'repo':
        return s.repoUrl ? (
          <a
            href={s.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            {s.repoUrl.replace('https://github.com/', '').split('/').pop()}
          </a>
        ) : (
          dash
        )
      case 'lastPr':
        return s.lastPrClosed || dash
      case 'staging':
        return s.isStaging === 'Yes' ? '🧪' : dash
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${accent} text-white py-10 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {icon} {title}
          </h1>
          <p className="text-white/90 text-lg max-w-3xl">{intro}</p>
          {refreshed && <p className="text-white/70 text-xs mt-2">Data refreshed {refreshed}</p>}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ViewNav current={href} />

        <p className="text-sm text-gray-500 mb-4">
          {ranked.length} domains, ranked by priority score (higher = work first).
        </p>

        <div className="rounded-lg shadow-md border border-gray-200 bg-white overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'Domain', ...columns.map((c) => colLabel[c]), 'Health', 'Priority'].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {ranked.map((s, i) => (
                <tr key={s.domain} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs text-gray-400 tabular-nums">{i + 1}</td>
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
                  {columns.map((c) => (
                    <td key={c} className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">
                      {cell(s, c)}
                    </td>
                  ))}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${healthBadge(s.siteHealth)}`}
                    >
                      {s.siteHealth || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-ffc-teal-dark h-2 rounded-full"
                          style={{ width: `${Math.round((score(s) / max) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700 tabular-nums">
                        {score(s)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {ranked.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 4} className="px-4 py-6 text-center text-gray-400">
                    No domains match this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
