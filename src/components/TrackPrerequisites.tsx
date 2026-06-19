import Link from 'next/link'
import { getPath } from '@/data/training-modules'
import { getSetupGuide } from '@/data/setup-guides'

const ACCENTS = {
  teal: {
    hover: 'hover:bg-teal-50',
    heading: 'group-hover:text-teal-700',
    border: 'border-teal-500',
  },
  blue: {
    hover: 'hover:bg-blue-50',
    heading: 'group-hover:text-blue-700',
    border: 'border-blue-500',
  },
  amber: {
    hover: 'hover:bg-amber-50',
    heading: 'group-hover:text-amber-700',
    border: 'border-amber-500',
  },
} as const

/**
 * "Before you start" — the personal setup guides a volunteer should complete
 * before a training track. Sourced from LearningPath.prerequisiteGuides and
 * linked to the standalone /guides/<slug> pages, so the guides stay reusable
 * across roles while every track surfaces the same account setup consistently.
 */
export default function TrackPrerequisites({
  pathId,
  accent = 'teal',
}: {
  pathId: string
  accent?: keyof typeof ACCENTS
}) {
  const path = getPath(pathId)
  const a = ACCENTS[accent]
  const prerequisites = (path?.prerequisiteGuides ?? [])
    .map((slug) => getSetupGuide(slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  if (prerequisites.length === 0) return null

  return (
    <section className={`bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 border-l-4 ${a.border}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Before you start</h2>
      <p className="text-sm text-gray-600 mb-4">
        Set up these personal accounts first. Each is a standalone, every-step guide — they’re the
        same accounts you use across every FFC role, so you only set them up once.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prerequisites.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className={`group flex items-center gap-3 rounded-lg border border-gray-200 p-3 ${a.hover} transition-colors`}
          >
            <span className="text-2xl" aria-hidden="true">
              {g.icon}
            </span>
            <span className="min-w-0">
              <span className={`block text-sm font-semibold text-gray-900 ${a.heading}`}>
                {g.shortTitle}
              </span>
              <span className="block text-xs text-gray-500">about {g.estMinutes} min</span>
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Use your <strong>personal</strong> AI assistant throughout — and max it out before the
        charity ever pays for organizational AI.
      </p>
    </section>
  )
}
