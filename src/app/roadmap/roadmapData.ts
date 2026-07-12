/**
 * Roadmap data model + build-time loader.
 *
 * The page reads `public/data/roadmap.json` at build time (same static-export
 * pattern as the Sites List reading its CSV). The JSON is produced by
 * `scripts/generate-roadmap-data.ts` from this repo's `kind:intake` issues.
 *
 * Pure helpers (sectioning + sort) are kept free of `fs` so they can be unit
 * tested and reused; only `loadRoadmap()` touches the filesystem.
 */
import fs from 'fs'
import path from 'path'
import { MISSION_POINTS } from '@/lib/readiness/config'
import type { MissionCategory, CharityStage, TierLabel } from '@/lib/readiness/types'

/** Lifecycle status, mirroring the `status:*` issue labels. */
export type RoadmapStatus =
  | 'intake'
  | 'needs-info'
  | 'needs-admin'
  | 'active-build'
  | 'sponsored'
  | 'live'
  | 'on-hold'
  | 'graduated'

export interface RoadmapSponsor {
  handle: string
  avatarUrl: string
  profileUrl: string
}

export interface RoadmapEntry {
  issueNumber: number
  charityName: string
  missionExcerpt: string
  status: RoadmapStatus
  charityStage: CharityStage
  missionCategory: MissionCategory
  /** Zeffy product / service tier the charity is seeking (display string). */
  serviceTier: string
  /** Null for live-portfolio entries whose full intake hasn't been scored yet. */
  readinessScore: number | null
  readinessTier: TierLabel | null
  submittedAt: string
  updatedAt: string
  sponsor: RoadmapSponsor | null
  plusOne: number
  issueUrl: string
  liveUrl?: string
  /**
   * Gate-3 validation checklist progress parsed from the work-order issue body
   * (ticked / total items). Absent for entries whose issue predates the
   * embedded checklist and for portfolio entries without a work order — the
   * pipeline stage derivation falls back to its URL heuristic then.
   */
  validationTicked?: number
  validationTotal?: number
  /** Public Candid/GuideStar profile URL (donor transparency), when supplied. */
  candidUrl?: string
  /** EIN (public for registered charities), when supplied. */
  ein?: string
}

export interface RoadmapData {
  generatedAt: string
  source: string
  entries: RoadmapEntry[]
}

/** The visible sections of the public roadmap, in display order (§9). */
export const ROADMAP_SECTIONS = [
  {
    id: 'review',
    heading: 'In application & verification review',
    statuses: ['intake', 'needs-info'],
  },
  { id: 'needs-admin', heading: 'Needs a sponsoring admin', statuses: ['needs-admin'] },
  { id: 'active', heading: 'Active builds', statuses: ['active-build', 'sponsored'] },
  { id: 'launched', heading: 'Launched charities', statuses: ['live'] },
] as const

export type RoadmapSectionId = (typeof ROADMAP_SECTIONS)[number]['id']

function byStatus(entries: RoadmapEntry[], statuses: readonly RoadmapStatus[]): RoadmapEntry[] {
  const set = new Set(statuses)
  return entries.filter((e) => set.has(e.status))
}

function olderFirst(a: RoadmapEntry, b: RoadmapEntry): number {
  return a.submittedAt.localeCompare(b.submittedAt)
}

function newestUpdatedFirst(a: RoadmapEntry, b: RoadmapEntry): number {
  return b.updatedAt.localeCompare(a.updatedAt)
}

/**
 * §9 four-step sort for the "Needs a sponsoring admin" queue:
 *   1. mission bonus (essential first)  2. readiness score  3. +1 votes  4. oldest first
 */
export function sortNeedsAdmin(entries: RoadmapEntry[]): RoadmapEntry[] {
  const score = (e: RoadmapEntry) => e.readinessScore ?? -Infinity
  return [...entries].sort((a, b) => {
    const missionDelta = MISSION_POINTS[b.missionCategory] - MISSION_POINTS[a.missionCategory]
    if (missionDelta !== 0) return missionDelta
    if (score(b) !== score(a)) return score(b) - score(a)
    if (b.plusOne !== a.plusOne) return b.plusOne - a.plusOne
    return olderFirst(a, b)
  })
}

/** Launched portfolio order: scored charities first (by score), then the rest by name. */
function launchedOrder(a: RoadmapEntry, b: RoadmapEntry): number {
  const sa = a.readinessScore
  const sb = b.readinessScore
  if (sa !== null && sb !== null && sa !== sb) return sb - sa
  if (sa !== null && sb === null) return -1
  if (sa === null && sb !== null) return 1
  return a.charityName.localeCompare(b.charityName)
}

/** Return the entries for a section, already sorted per §9. */
export function sectionEntries(data: RoadmapData, id: RoadmapSectionId): RoadmapEntry[] {
  const section = ROADMAP_SECTIONS.find((s) => s.id === id)
  if (!section) return []
  const entries = byStatus(data.entries, section.statuses)

  if (id === 'needs-admin') return sortNeedsAdmin(entries)
  if (id === 'review') return [...entries].sort(olderFirst)
  // Launched = the full live portfolio (real FFC sites), ranked by readiness then name.
  if (id === 'launched') return [...entries].sort(launchedOrder)
  return [...entries].sort(newestUpdatedFirst)
}

/** Count of charities that have graduated to self-sustainability (§9 tile). */
export function graduatedCount(data: RoadmapData): number {
  return data.entries.filter((e) => e.status === 'graduated').length
}

const EMPTY: RoadmapData = { generatedAt: '', source: '', entries: [] }

/** Read the committed roadmap snapshot at build time. Degrades to empty. */
export function loadRoadmap(): RoadmapData {
  try {
    const file = path.join(process.cwd(), 'public', 'data', 'roadmap.json')
    return JSON.parse(fs.readFileSync(file, 'utf8')) as RoadmapData
  } catch {
    return EMPTY
  }
}
