import Link from 'next/link'
import { getModule, getPath, TIER_LABELS, type Tier } from '@/data/training-modules'

const ACCENTS = {
  teal: { check: 'text-teal-600', hover: 'hover:bg-teal-50', heading: 'group-hover:text-teal-700' },
  blue: { check: 'text-blue-600', hover: 'hover:bg-blue-50', heading: 'group-hover:text-blue-700' },
} as const

function DirectiveLink({
  url,
  label,
  accent,
}: {
  url: string
  label: string
  accent: keyof typeof ACCENTS
}) {
  const color =
    accent === 'blue' ? 'text-blue-700 hover:text-blue-900' : 'text-teal-700 hover:text-teal-900'
  if (url.startsWith('/')) {
    return (
      <Link href={url} className={`underline ${color}`}>
        {label}
      </Link>
    )
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`underline ${color}`}>
      {label}
    </a>
  )
}

/**
 * Renders a learning path as a "what you're responsible for" index plus
 * per-module detail sections, sourced from the modular training catalog (#320).
 */
export default function TrainingTrack({
  pathId,
  accent = 'teal',
}: {
  pathId: string
  accent?: keyof typeof ACCENTS
}) {
  const path = getPath(pathId)
  if (!path) return null
  const a = ACCENTS[accent]

  const modules = path.entries
    .map((entry) => ({ entry, mod: getModule(entry.moduleId) }))
    .filter((m): m is { entry: (typeof path.entries)[number]; mod: NonNullable<typeof m.mod> } =>
      Boolean(m.mod)
    )

  return (
    <>
      {/* What you're responsible for */}
      <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What you&apos;re responsible for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {modules.map(({ entry, mod }) => (
            <a
              key={mod.id}
              href={`#${mod.id}`}
              className={`flex items-start p-2 rounded-lg ${a.hover} transition-colors group`}
            >
              <span className="text-xl mr-3" aria-hidden="true">
                {mod.icon}
              </span>
              <span className="text-sm">
                <span className={`font-semibold text-gray-900 ${a.heading}`}>{mod.title}</span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                  {TIER_LABELS[entry.tier]}
                </span>
                {entry.optional && (
                  <span className="ml-1 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                    Optional
                  </span>
                )}
                <span className="block text-gray-600">{mod.responsibility}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Module detail sections */}
      <div className="space-y-8">
        {modules.map(({ entry, mod }) => {
          const tier = entry.tier as Tier
          const content = mod.tiers[tier]
          if (!content) return null
          return (
            <section
              key={mod.id}
              id={mod.id}
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 scroll-mt-20"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-4" aria-hidden="true">
                  {mod.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{mod.title}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      {TIER_LABELS[entry.tier]}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{mod.responsibility}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Your goal:</span> {content.objective}
              </p>
              <ul className="space-y-3">
                {content.directives.map((d) => (
                  <li key={d.id} className="flex items-start">
                    <span className={`mr-2 mt-0.5 ${a.check}`} aria-hidden="true">
                      &#10003;
                    </span>
                    <span className="text-sm text-gray-700">
                      {d.text}
                      {d.link && (
                        <>
                          {' '}
                          (<DirectiveLink url={d.link.url} label={d.link.label} accent={accent} />)
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
