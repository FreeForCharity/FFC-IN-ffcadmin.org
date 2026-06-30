'use client'

import { useState } from 'react'
import RoadmapCard from './RoadmapCard'
import type { RoadmapEntry, RoadmapSectionId } from './roadmapData'

interface RoadmapSectionProps {
  id: RoadmapSectionId
  heading: string
  description: string
  entries: RoadmapEntry[]
  emptyMessage: string
  /** Cards rendered before a "Show all" control appears. Defaults to all. */
  initialLimit?: number
}

/** One labelled section of the public roadmap with its grid of cards. */
export default function RoadmapSection({
  id,
  heading,
  description,
  entries,
  emptyMessage,
  initialLimit,
}: RoadmapSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const limit = initialLimit ?? entries.length
  const shown = expanded ? entries : entries.slice(0, limit)
  const hidden = entries.length - shown.length

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
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((entry) => (
              <RoadmapCard
                key={entry.issueNumber || entry.liveUrl || entry.charityName}
                entry={entry}
                section={id}
              />
            ))}
          </div>
          {hidden > 0 && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Show all {entries.length}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
