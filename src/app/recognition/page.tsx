import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  RECOGNITION_TIERS,
  CE_BADGES,
  getTier,
  getCeBadge,
  publicVolunteers,
  recognitionAggregate,
} from '@/data/recognition'

export const metadata: Metadata = {
  title: 'Volunteer Recognition',
  description:
    'Free For Charity recognizes sustained volunteer work with warm, progression-based badges that map 1:1 to GitHub access roles. Validated manually against commit history and charity-board certification.',
  keywords:
    'volunteer recognition, contributor badges, nonprofit volunteer awards, GitHub roles, Free For Charity recognition',
  alternates: {
    canonical: 'https://ffcadmin.org/recognition/',
  },
}

export default function RecognitionPage() {
  const tiers = RECOGNITION_TIERS
  const volunteers = publicVolunteers()
  const agg = recognitionAggregate()

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Recognition' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🏅
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Volunteer Recognition</h1>
              <p className="text-amber-50 text-sm mt-1">
                Earned by real contributions — never self-claimed
              </p>
            </div>
          </div>
          <p className="text-amber-50 text-lg max-w-3xl">
            We recognize sustained volunteer work with warm, progression-based badges. Each badge
            maps <strong>one-to-one to a GitHub access role</strong>, so your recognition and the
            rights you hold grow together — mirroring the{' '}
            <Link href="/contributor-ladder" className="underline">
              Contributor Ladder
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Aggregate */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-center">
              <div className="text-4xl font-bold text-gray-900">{agg.lifetime}</div>
              <div className="text-sm text-gray-600 mt-1">Recognized volunteers (lifetime)</div>
            </div>
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-center">
              <div className="text-4xl font-bold text-gray-900">{agg.thisYear}</div>
              <div className="text-sm text-gray-600 mt-1">Recognized this year</div>
            </div>
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6 text-center">
              <div className="text-4xl font-bold text-gray-900">{agg.thisMonth}</div>
              <div className="text-sm text-gray-600 mt-1">Recognized this month</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            An always-rolling count for annual reporting, sliced by month, year, and lifetime. The
            aggregate includes every recognized volunteer; names below are shown only with consent.
          </p>
        </section>

        {/* Badge tiers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Badge tiers</h2>
          <p className="text-gray-600 text-sm mb-6">
            Six tiers, each mapped to the GitHub access role it grants. You move up as your
            contribution history grows and the board certifies your work.
          </p>
          <div className="space-y-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden"
              >
                <div
                  className={`bg-gradient-to-r ${tier.gradient} p-4 flex items-center gap-3 text-white`}
                >
                  <span className="text-3xl" aria-hidden="true">
                    {tier.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">
                        {tier.id}. {tier.name}
                      </h3>
                      <span className="text-[11px] font-bold uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded">
                        {tier.githubRole}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm">{tier.blurb}</p>
                  </div>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">What this role grants</h4>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      {tier.grants.map((g) => (
                        <li key={g} className="flex items-start">
                          <span className="text-blue-600 mr-2 mt-0.5">&#8226;</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">How it&apos;s earned</h4>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      {tier.criteria.map((c) => (
                        <li key={c} className="flex items-start">
                          <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      Ladder alignment:{' '}
                      <span className="font-semibold text-gray-700">{tier.ladderAlignment}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Validation model */}
        <section className="mb-12 bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How recognition is validated</h2>
          <p className="text-gray-700 text-sm mb-4">
            Badges are awarded by maintainers — never self-claimed. Every award is validated against
            two independent sources of truth:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-blue-900 mb-1">1. GitHub commit history</h3>
              <p className="text-sm text-blue-900/80">
                Your merged contributions are the public, tamper-evident record of the work you did.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-emerald-900 mb-1">
                2. Charity-board certification
              </h3>
              <p className="text-sm text-emerald-900/80">
                The charity board (or FFC) directly certifies the contribution and its impact.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Recognized volunteers are recorded in a committed data file (
            <code className="bg-gray-100 px-1 py-0.5 rounded">src/data/recognition.ts</code>),
            updated by maintainers. This also feeds the military volunteer pathway —{' '}
            <Link href="/movsm" className="text-blue-600 underline">
              MOVSM
            </Link>{' '}
            — where certified hours matter.
          </p>
        </section>

        {/* CE designation badges (#359) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Continuing-education badges</h2>
          <p className="text-gray-600 text-sm mb-2">
            A designation layered on the volunteer tracks: as you earn{' '}
            <Link
              href="/continuing-education"
              className="text-blue-600 underline hover:text-blue-800"
            >
              continuing-education credit
            </Link>{' '}
            by volunteering, FFC recognizes each CE channel — validated the same way (commit history
            + mentor/board certification). Mentoring on the{' '}
            <Link
              href="/contributor-ladder"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Contributor Ladder
            </Link>{' '}
            feeds the “training delivered” badge.
          </p>
          <p className="text-xs text-amber-700 mb-4">
            Draft tiers — names and thresholds pending final confirmation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CE_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
              >
                <div
                  className={`bg-gradient-to-r ${badge.gradient} p-4 flex items-center gap-2 text-white`}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {badge.icon}
                  </span>
                  <h3 className="text-sm font-bold">{badge.name}</h3>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700">{badge.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="font-semibold">How:</span> {badge.criteria}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Honor roll */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recognized volunteers</h2>
          <p className="text-gray-600 text-sm mb-6">
            Shown with each volunteer&apos;s consent. Recognition is opt-in — volunteers can be
            counted in the aggregate above without appearing here.
          </p>
          {volunteers.length === 0 ? (
            <p className="text-sm text-gray-600">
              Our public honor roll is being assembled. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {volunteers.map((v) => {
                const tier = getTier(v.tierId)
                return (
                  <div
                    key={v.githubHandle ?? `${v.name}-${v.since}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-4"
                  >
                    <span
                      className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${tier?.gradient ?? 'from-gray-400 to-gray-500'} flex items-center justify-center text-2xl`}
                      aria-hidden="true"
                    >
                      {tier?.icon ?? '🏅'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {v.githubHandle ? (
                          <a
                            href={`https://github.com/${v.githubHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-700"
                          >
                            {v.name}
                          </a>
                        ) : (
                          v.name
                        )}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">{tier?.name}</span>
                        {tier ? ` · ${tier.githubRole}` : ''}
                      </p>
                      {v.roles.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">{v.roles.join(', ')}</p>
                      )}
                      {v.ceBadges && v.ceBadges.length > 0 && (
                        <p
                          className="mt-1 flex flex-wrap gap-1"
                          aria-label="Continuing-education badges"
                        >
                          {v.ceBadges.map((id) => {
                            const badge = getCeBadge(id)
                            if (!badge) return null
                            return (
                              <span
                                key={id}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded-full px-1.5 py-0.5"
                                title={badge.description}
                              >
                                <span aria-hidden="true">{badge.icon}</span>
                                {badge.name}
                              </span>
                            )
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div className="mt-6 text-sm text-gray-600">
            Want to be recognized?{' '}
            <Link href="/get-involved" className="text-blue-600 underline hover:text-blue-800">
              Start contributing
            </Link>{' '}
            — your merged work builds the commit history we recognize.
          </div>
        </section>
      </main>
    </div>
  )
}
