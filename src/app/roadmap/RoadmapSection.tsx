import RoadmapCard from './RoadmapCard'
import type { RoadmapEntry, RoadmapSectionId } from './roadmapData'

interface RoadmapSectionProps {
  id: RoadmapSectionId
  heading: string
  description: string
  entries: RoadmapEntry[]
  emptyMessage: string
}

/** One labelled section of the public roadmap with its grid of cards. */
export default function RoadmapSection({
  id,
  heading,
  description,
  entries,
  emptyMessage,
}: RoadmapSectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold text-gray-900">{heading}</h2>
          <span className="text-sm font-medium text-gray-400">{entries.length}</span>
        </div>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
      {entries.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, i) => (
            <RoadmapCard key={`${entry.issueNumber}-${i}`} entry={entry} section={id} />
          ))}
        </div>
      )}
    </section>
  )
}
