import Link from 'next/link'
import type { Metadata } from 'next'
import catalog from '@/data/workflow-catalog.json'

export const metadata: Metadata = {
  title: 'Automation & Workflows',
  description:
    'How Free For Charity automates Cloudflare, WHMCS, Microsoft 365, Zeffy, Google, and GitHub: the complete workflow catalog, the 3-digit numbering convention, and the safety model that protects every run.',
  keywords:
    'nonprofit automation, GitHub Actions, workflow catalog, Cloudflare automation, WHMCS automation, charity technology',
}

type Workflow = {
  number: number
  title: string
  apis: string[]
  file: string
  triggers: string[]
  environments: string[]
  description: string
  safetyLevel: string
  approvalEnv: string
  guard: string
  category: string
  categoryCode: string
}

const CATEGORY_STYLES: Record<string, { badge: string; bar: string }> = {
  '1': { badge: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500' },
  '2': { badge: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500' },
  '3': { badge: 'bg-sky-100 text-sky-800', bar: 'bg-sky-500' },
  '4': { badge: 'bg-pink-100 text-pink-800', bar: 'bg-pink-500' },
  '5': { badge: 'bg-blue-100 text-blue-800', bar: 'bg-blue-500' },
  '6': { badge: 'bg-violet-100 text-violet-800', bar: 'bg-violet-500' },
  '7': { badge: 'bg-gray-200 text-gray-800', bar: 'bg-gray-600' },
}

function safetyBadge(level: string) {
  if (level.startsWith('Reads')) return 'bg-green-100 text-green-800'
  if (level.includes('dry-run')) return 'bg-yellow-100 text-yellow-800'
  if (level.startsWith('Writes')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-600'
}

export default function Automation() {
  const workflows = catalog.workflows as Workflow[]
  const byCategory = new Map<string, Workflow[]>()
  for (const w of workflows) {
    const key = String(w.number)[0]
    if (!byCategory.has(key)) byCategory.set(key, [])
    byCategory.get(key)!.push(w)
  }
  const reads = workflows.filter((w) => w.safetyLevel.startsWith('Reads')).length
  const writes = workflows.filter((w) => w.safetyLevel.startsWith('Writes')).length
  const plumbing = workflows.length - reads - writes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold">How FFC Automation Works</h1>
          </div>
          <p className="text-blue-100 max-w-3xl">
            Free For Charity runs its infrastructure — Cloudflare DNS, WHMCS billing, Microsoft 365,
            Zeffy donations, Google Analytics, and the GitHub sites themselves — through{' '}
            {workflows.length} auditable GitHub Actions workflows. This page is the living catalog:
            what each workflow does, how they are numbered and named, and the safety model that
            protects every run. It is generated from the workflows themselves, so it cannot drift.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Workflows', value: workflows.length },
            { label: 'Read-only', value: reads },
            { label: 'Write (gated / dry-run)', value: writes },
            { label: 'Repo plumbing', value: plumbing },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow p-5 text-center">
              <div className="text-3xl font-bold text-indigo-700">{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Numbering convention */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The numbering convention — and why
          </h2>
          <p className="text-gray-700 mb-4">
            Every workflow has a{' '}
            <strong>3-digit number whose first digit is the system the workflow targets</strong>. A
            new admin (or an AI agent) can tell from the number alone which external API a workflow
            drives, and new workflows can never collide — each category has its own numbering space.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {Array.from(byCategory.entries()).map(([digit, list]) => {
              const style = CATEGORY_STYLES[digit] ?? CATEGORY_STYLES['7']
              return (
                <a
                  key={digit}
                  href={`#cat-${digit}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${style.badge}`}
                  >
                    {digit}xx
                  </span>
                  <div className="font-semibold text-gray-900 mt-2 text-sm">{list[0].category}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`${style.bar} h-2 rounded-full`}
                        style={{ width: `${(list.length / workflows.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{list.length}</span>
                  </div>
                </a>
              )
            })}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
            <p>
              <strong>Naming:</strong> workflows are named{' '}
              <code className="bg-gray-100 px-1 rounded">NNN. Target - Description [TAG]</code> and
              their files are <code className="bg-gray-100 px-1 rounded">NNN-slug.yml</code>. The{' '}
              <code className="bg-gray-100 px-1 rounded">[TAG]</code> lists <em>every</em> API the
              workflow calls, joined with <code className="bg-gray-100 px-1 rounded">+</code> (for
              example <code className="bg-gray-100 px-1 rounded">[CF+M365]</code>).
            </p>
            <p>
              <strong>What counts as “an API”:</strong> the API the workflow actually <em>calls</em>{' '}
              — not the service the records are <em>for</em> (creating Microsoft 365 DNS records via
              the Cloudflare API is <code className="bg-gray-100 px-1 rounded">[CF]</code>
              ), and not plumbing (fetching credentials from Azure Key Vault, or posting a result
              comment to GitHub, never counts).
            </p>
            <p>
              <strong>Multi-system workflows</strong> keep one number from the system that owns the
              deliverable (writes beat reads). They exist as single workflows only when they are
              aggregators (a report that joins several sources) or transactions (two writes that
              must succeed together to avoid a half-configured state).
            </p>
          </div>
        </section>

        {/* Safety model */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The safety model</h2>
          <p className="text-gray-700 mb-4">
            A live change generally has to get past several independent layers, not just one:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>
              <strong>Read vs. write credentials.</strong> Read-only workflows load reader-scope
              credentials and cannot mutate anything; write workflows load writer-scope credentials.
            </li>
            <li>
              <strong>Environment approval gates.</strong> Write environments (and some sensitive
              read environments) require a human reviewer to approve the run before it proceeds.
            </li>
            <li>
              <strong>
                <code className="bg-gray-100 px-1 rounded">dry_run</code> defaults to preview.
              </strong>{' '}
              Write workflows preview what they would change; going live requires explicitly passing{' '}
              <code className="bg-gray-100 px-1 rounded">dry_run=false</code>.
            </li>
            <li>
              <strong>Typed confirmation</strong> for the highest-stakes actions (for example,
              domain registration requires retyping the exact domain).
            </li>
            <li>
              <strong>No stored secrets.</strong> Credentials are fetched from Azure Key Vault at
              run time via OIDC and masked line-by-line; nothing sensitive lives in the repository.
            </li>
          </ol>
        </section>

        {/* Catalog */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">The complete catalog</h2>
          <p className="text-gray-600 text-sm mb-6">
            Generated from the workflow files in{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-Cloudflare-Automation"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FreeForCharity/FFC-Cloudflare-Automation
            </a>
            . Safety levels: <span className="font-medium">Reads</span> = no external mutation;{' '}
            <span className="font-medium">Writes (dry-run default)</span> = mutates only with{' '}
            <code className="bg-gray-100 px-1 rounded">dry_run=false</code>;{' '}
            <span className="font-medium">Writes (gated)</span> = mutates when run, protected by an
            approval gate.
          </p>
          <div className="space-y-8">
            {Array.from(byCategory.entries()).map(([digit, list]) => {
              const style = CATEGORY_STYLES[digit] ?? CATEGORY_STYLES['7']
              return (
                <div
                  key={digit}
                  id={`cat-${digit}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${style.badge}`}
                    >
                      {digit}xx
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{list[0].category}</h3>
                    <span className="text-sm text-gray-500 ml-auto">{list.length} workflows</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-left text-gray-600">
                        <tr>
                          <th className="px-4 py-2 font-medium">#</th>
                          <th className="px-4 py-2 font-medium">Workflow</th>
                          <th className="px-4 py-2 font-medium">APIs</th>
                          <th className="px-4 py-2 font-medium">Safety</th>
                          <th className="px-4 py-2 font-medium">Runs on</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {list.map((w) => (
                          <tr key={w.number} className="align-top">
                            <td className="px-4 py-2 font-mono text-gray-500">{w.number}</td>
                            <td className="px-4 py-2">
                              <div className="font-medium text-gray-900">{w.title}</div>
                              <div className="text-xs text-gray-400 font-mono">{w.file}</div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex flex-wrap gap-1">
                                {w.apis.map((a) => (
                                  <span
                                    key={a}
                                    className="inline-block px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-xs"
                                  >
                                    {a}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-xs ${safetyBadge(w.safetyLevel)}`}
                              >
                                {w.safetyLevel || 'plumbing'}
                              </span>
                              {w.guard && (
                                <div className="text-xs text-gray-400 mt-1">{w.guard}</div>
                              )}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-500">
                              {w.triggers.join(', ') || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* For agents */}
        <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">For AI agents & new admins</h2>
          <p className="text-gray-700 text-sm mb-3">
            A machine-readable version of this catalog lives at{' '}
            <code className="bg-white px-1 rounded border border-indigo-100">
              docs/workflow-catalog.json
            </code>{' '}
            in the automation repository and is regenerated on every workflow change (CI fails if it
            drifts). To pick a workflow: match the first digit to the system you need to act on,
            prefer <em>Reads</em> before <em>Writes</em>, and always run write workflows with the
            default <code className="bg-white px-1 rounded border border-indigo-100">dry_run</code>{' '}
            preview first.
          </p>
          <p className="text-gray-700 text-sm">
            Related:{' '}
            <Link href="/tech-stack" className="text-blue-600 hover:underline">
              Technology Stack
            </Link>{' '}
            ·{' '}
            <Link href="/sites-list" className="text-blue-600 hover:underline">
              Sites List
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}
