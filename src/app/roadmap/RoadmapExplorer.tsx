'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import RoadmapSection from './RoadmapSection'
import type { RoadmapEntry, RoadmapSectionId } from './roadmapData'
import type { MissionCategory } from '@/lib/readiness/types'
import { entryMatches, TIER_FILTERS } from './roadmapFilter'

export interface ExplorerSection {
  id: RoadmapSectionId
  heading: string
  description: string
  emptyMessage: string
  entries: RoadmapEntry[]
}

const STATUS_FILTERS: { id: RoadmapSectionId; label: string }[] = [
  { id: 'review', label: 'In review' },
  { id: 'needs-admin', label: 'Needs admin' },
  { id: 'active', label: 'Active build' },
  { id: 'launched', label: 'Launched' },
]

/** How many launched cards to show before the "Show all" control (unfiltered). */
const LAUNCHED_INITIAL = 24

function chip(active: boolean): string {
  return `rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
    active
      ? 'border-teal-600 bg-teal-50 text-teal-800'
      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
  }`
}

/**
 * Client-side search + filter over the whole roadmap so a human can actually
 * navigate ~100 charities: free-text by name/mission, mission-tier chips, and
 * lifecycle-status chips (e.g. a donor narrowing to "Launched"). Sections keep
 * their server-computed order; this only narrows what renders.
 */
export default function RoadmapExplorer({ sections }: { sections: ExplorerSection[] }) {
  const [query, setQuery] = useState('')
  const [tiers, setTiers] = useState<MissionCategory[]>([])
  const [statuses, setStatuses] = useState<RoadmapSectionId[]>([])

  const active = query.trim() !== '' || tiers.length > 0 || statuses.length > 0

  const visible = useMemo(() => {
    const filters = { query, tiers }
    return sections
      .filter((s) => statuses.length === 0 || statuses.includes(s.id))
      .map((s) => ({ ...s, filtered: s.entries.filter((e) => entryMatches(e, filters)) }))
  }, [sections, statuses, query, tiers])

  const total = visible.reduce((n, s) => n + s.filtered.length, 0)

  const toggleTier = (t: MissionCategory) =>
    setTiers((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const toggleStatus = (id: RoadmapSectionId) =>
    setStatuses((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  const clearAll = () => {
    setQuery('')
    setTiers([])
    setStatuses([])
  }

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label htmlFor="roadmap-search" className="sr-only">
          Search charities
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="roadmap-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by charity name or mission…"
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Mission
          </span>
          {TIER_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={tiers.includes(value)}
              onClick={() => toggleTier(value)}
              className={chip(tiers.includes(value))}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Status
          </span>
          {STATUS_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={statuses.includes(id)}
              onClick={() => toggleStatus(id)}
              className={chip(statuses.includes(id))}
            >
              {label}
            </button>
          ))}
        </div>

        {active && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <p role="status" className="text-gray-500">
              {total} {total === 1 ? 'charity' : 'charities'} match
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="font-medium text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <p className="mt-3 text-xs text-gray-400">
          Mission filters apply to charities with a scored readiness; launched portfolio sites are
          searchable by name. Readiness tiers are explained in the{' '}
          <Link href="/roadmap/methodology" className="underline">
            methodology
          </Link>
          .
        </p>
      </div>

      {active && total === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          No charities match your filters.{' '}
          <button
            type="button"
            onClick={clearAll}
            className="font-medium text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </p>
      ) : (
        visible.map((s) => (
          <RoadmapSection
            key={s.id}
            id={s.id}
            heading={s.heading}
            description={s.description}
            entries={s.filtered}
            emptyMessage={active ? 'No charities here match your filters.' : s.emptyMessage}
            initialLimit={s.id === 'launched' && !active ? LAUNCHED_INITIAL : undefined}
          />
        ))
      )}
    </>
  )
}
