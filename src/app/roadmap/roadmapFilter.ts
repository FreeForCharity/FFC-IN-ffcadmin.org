/**
 * Pure, client-safe filtering for the roadmap explorer.
 *
 * Kept free of `fs` (unlike `roadmapData.ts`) so the `'use client'` explorer and
 * the unit tests can both import it. `RoadmapEntry` is a type-only import, so it
 * erases at compile time and never drags the filesystem loader into the bundle.
 */
import type { MissionCategory } from '@/lib/readiness/types'
import type { RoadmapEntry } from './roadmapData'

export interface RoadmapFilters {
  /** Free-text needle matched against charity name + mission excerpt. */
  query: string
  /** Mission tiers to include; empty means "no tier filter". */
  tiers: MissionCategory[]
}

/** Human labels for the mission-tier chips (favoring order). */
export const TIER_FILTERS: { value: MissionCategory; label: string }[] = [
  { value: 'basic-needs', label: 'Basic needs' },
  { value: 'veterans', label: 'Veterans / military' },
  { value: 'general', label: 'General' },
]

/**
 * Does an entry match the active filters?
 *
 * Text search always applies. The tier filter only matches entries that carry a
 * real, scored classification (`readinessTier != null`) — placeholder portfolio
 * rows have a stub `missionCategory` that the card doesn't even display, so they
 * must not be swept in by a tier filter.
 */
export function entryMatches(entry: RoadmapEntry, filters: RoadmapFilters): boolean {
  const q = filters.query.trim().toLowerCase()
  if (q) {
    const haystack = `${entry.charityName} ${entry.missionExcerpt ?? ''}`.toLowerCase()
    if (!haystack.includes(q)) return false
  }
  if (filters.tiers.length > 0) {
    if (entry.readinessTier == null) return false
    if (!filters.tiers.includes(entry.missionCategory)) return false
  }
  return true
}

/** True when no filter is narrowing the results. */
export function filtersAreEmpty(filters: RoadmapFilters): boolean {
  return filters.query.trim() === '' && filters.tiers.length === 0
}
