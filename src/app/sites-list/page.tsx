import { Metadata } from 'next'
import HealthDashboard from './HealthDashboard'
import DomainExpiry from './DomainExpiry'
import NonprofitCallout from '@/components/NonprofitCallout'
import { loadDomainExpiry, relativeAge } from '@/lib/dashboardData'
import { ViewNav } from './PersonaView'
import SitesExplorer from './SitesExplorer'
import { loadSites, dataRefreshedAge, dataGeneratedAt, dataIsStale } from './sitesData'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/sites-list/' },
  title: 'Sites Master List',
  description:
    'Volunteer-focused dashboard of FFC-managed domains, grouped by how much effort they need — active development, stalled, needs migration, done, triage, and inactive.',
}

export default function SitesListPage() {
  const sites = loadSites()
  const domainExpiry = loadDomainExpiry()
  const csvUpdated = dataRefreshedAge()

  const byTier = (num: string) => sites.filter((s) => s.workTier.startsWith(num)).length

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
          {stat('Active Development', byTier('1'), 'border-green-200', '🔨')}
          {stat('Stalled Repos', byTier('2'), 'border-yellow-200', '🌱')}
          {stat('Needs Migration', byTier('3'), 'border-blue-200', '🚚')}
          {stat('Done / Stable', byTier('4'), 'border-teal-200', '✅')}
        </div>

        {/* Filterable tier tables (#412–#415, #426) */}
        <SitesExplorer sites={sites} />

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
