import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  TRAINING_MODULES,
  LEARNING_PATHS,
  TIER_LABELS,
  TIER_BLURB,
  type Tier,
} from '@/data/training-modules'
import { getSetupGuide } from '@/data/setup-guides'

export const metadata: Metadata = {
  title: 'Training Tracks',
  description:
    'Free For Charity training is organized as responsibility modules at three depths — Operator, Practitioner, and Administrator. Pick your role (Site Owner, Web Developer, Microsoft 365 Administrator, or Canva Designer) and see exactly what you’re responsible for.',
  keywords:
    'FFC training tracks, site owner training, web developer training, Microsoft 365 administrator, Google Workspace administrator, Canva designer, nonprofit technology training, Free For Charity',
  alternates: {
    canonical: 'https://ffcadmin.org/training/',
  },
}

function tierFor(pathId: string, moduleId: string): { tier: Tier; optional?: boolean } | undefined {
  const path = LEARNING_PATHS.find((p) => p.id === pathId)
  const entry = path?.entries.find((e) => e.moduleId === moduleId)
  return entry ? { tier: entry.tier, optional: entry.optional } : undefined
}

const TIER_PILL: Record<Tier, string> = {
  T1: 'bg-emerald-100 text-emerald-800',
  T2: 'bg-blue-100 text-blue-800',
  T3: 'bg-purple-100 text-purple-800',
}

export default function TrainingHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Training' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🎓
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Training Tracks</h1>
              <p className="text-blue-100 text-sm mt-1">
                Pick your role — and see exactly what you&apos;re responsible for
              </p>
            </div>
          </div>
          <p className="text-blue-50 text-lg max-w-3xl">
            Training is built from <strong>responsibility modules</strong> taught at three depths.
            Your role is simply the set of modules you own, at the depth you need — so nobody misses
            the fundamentals, and nobody is forced through more than their role requires.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tier explainer */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {(['T1', 'T2', 'T3'] as Tier[]).map((t) => (
            <div key={t} className="bg-white rounded-xl shadow border border-gray-200 p-5">
              <span
                className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${TIER_PILL[t]}`}
              >
                {t} · {TIER_LABELS[t]}
              </span>
              <p className="text-sm text-gray-600 mt-2">{TIER_BLURB[t]}</p>
            </div>
          ))}
        </section>

        {/* Before any track — set up your accounts */}
        <section className="mb-10 bg-white rounded-xl shadow border border-gray-200 border-l-4 border-l-blue-500 p-5 md:p-6">
          <h2 className="text-lg font-bold text-gray-900">New here? Set up your accounts first</h2>
          <p className="text-sm text-gray-600 mt-1">
            Every track starts from the same personal accounts — your GitHub, multi-factor
            authentication, password manager, and AI assistant. Set them up once with the
            step-by-step{' '}
            <Link href="/guides" className="text-blue-700 underline hover:text-blue-900">
              Account &amp; Tool Setup guides
            </Link>
            , then pick your role below. Each track also lists its exact prerequisites.
          </p>
        </section>

        {/* Role cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose your role</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {LEARNING_PATHS.map((path) => {
              const prereqs = (path.prerequisiteGuides ?? [])
                .map((slug) => getSetupGuide(slug))
                .filter((g): g is NonNullable<typeof g> => Boolean(g))
              return (
                <Link
                  key={path.id}
                  href={path.href}
                  className="group block rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`bg-gradient-to-r ${path.gradient} p-5 flex items-center gap-3 text-white`}
                  >
                    <span className="text-3xl" aria-hidden="true">
                      {path.icon}
                    </span>
                    <h3 className="text-lg font-bold">{path.title}</h3>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-700">{path.persona}</p>
                    {path.certifications && (
                      <p className="text-xs text-gray-500 mt-2">
                        <span className="font-semibold">Certifications:</span>{' '}
                        {path.certifications.join(', ')}
                      </p>
                    )}
                    {prereqs.length > 0 && (
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="font-semibold text-gray-600">Set up first:</span>
                        {prereqs.map((g) => (
                          <span
                            key={g.slug}
                            role="img"
                            aria-label={g.shortTitle}
                            title={g.shortTitle}
                          >
                            {g.icon}
                          </span>
                        ))}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center text-sm font-semibold text-blue-700 group-hover:text-blue-900">
                      View track
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Matrix */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Who owns what</h2>
          <p className="text-gray-600 text-sm mb-6">
            Each cell shows the depth that role learns the module at. A blank means it isn&apos;t
            part of that role.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Module
                  </th>
                  {LEARNING_PATHS.map((p) => (
                    <th
                      key={p.id}
                      className="p-3 font-semibold text-gray-900 border border-gray-200 text-center"
                    >
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAINING_MODULES.map((mod, i) => (
                  <tr key={mod.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="p-3 border border-gray-200">
                      <span className="mr-2" aria-hidden="true">
                        {mod.icon}
                      </span>
                      <span className="font-medium text-gray-900">{mod.title}</span>
                    </td>
                    {LEARNING_PATHS.map((p) => {
                      const cell = tierFor(p.id, mod.id)
                      return (
                        <td
                          key={p.id}
                          className="p-3 border border-gray-200 text-center whitespace-nowrap"
                        >
                          {cell ? (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${TIER_PILL[cell.tier]}`}
                              title={`${cell.tier} · ${TIER_LABELS[cell.tier]}`}
                            >
                              {cell.tier}
                              {cell.optional ? '*' : ''}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">* optional for that role.</p>
        </section>
      </main>
    </div>
  )
}
