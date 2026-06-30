import { entryMatches, filtersAreEmpty } from '@/app/roadmap/roadmapFilter'
import type { RoadmapEntry } from '@/app/roadmap/roadmapData'

function entry(overrides: Partial<RoadmapEntry>): RoadmapEntry {
  return {
    issueNumber: 1,
    charityName: 'Example Org',
    missionExcerpt: '',
    status: 'intake',
    charityStage: 'pre-501c3',
    missionCategory: 'general',
    serviceTier: 'Tier 1',
    readinessScore: 0,
    readinessTier: 'Foundational',
    submittedAt: '',
    updatedAt: '',
    sponsor: null,
    plusOne: 0,
    issueUrl: 'https://example.org',
    ...overrides,
  }
}

describe('entryMatches', () => {
  it('matches free text against name and mission, case-insensitively', () => {
    const e = entry({ charityName: 'Hope Pantry', missionExcerpt: 'We feed families.' })
    expect(entryMatches(e, { query: 'pantry', tiers: [] })).toBe(true)
    expect(entryMatches(e, { query: 'FEED', tiers: [] })).toBe(true)
    expect(entryMatches(e, { query: 'veterans', tiers: [] })).toBe(false)
  })

  it('an empty query matches everything', () => {
    expect(entryMatches(entry({}), { query: '   ', tiers: [] })).toBe(true)
  })

  it('tier filter matches a scored entry of that tier', () => {
    const e = entry({ missionCategory: 'basic-needs', readinessTier: 'Developing' })
    expect(entryMatches(e, { query: '', tiers: ['basic-needs'] })).toBe(true)
    expect(entryMatches(e, { query: '', tiers: ['veterans'] })).toBe(false)
    expect(entryMatches(e, { query: '', tiers: ['veterans', 'basic-needs'] })).toBe(true)
  })

  it('tier filter excludes placeholder (unscored) portfolio entries', () => {
    // Launched portfolio rows carry a stub missionCategory but null readinessTier.
    const placeholder = entry({ missionCategory: 'general', readinessTier: null })
    expect(entryMatches(placeholder, { query: '', tiers: ['general'] })).toBe(false)
    // …but they are still findable by name search.
    expect(entryMatches(placeholder, { query: 'example', tiers: [] })).toBe(true)
  })

  it('combines text and tier (both must pass)', () => {
    const e = entry({
      charityName: 'Veterans Bridge',
      missionCategory: 'veterans',
      readinessTier: 'Established',
    })
    expect(entryMatches(e, { query: 'bridge', tiers: ['veterans'] })).toBe(true)
    expect(entryMatches(e, { query: 'bridge', tiers: ['basic-needs'] })).toBe(false)
  })
})

describe('filtersAreEmpty', () => {
  it('is true only when nothing narrows the results', () => {
    expect(filtersAreEmpty({ query: '', tiers: [] })).toBe(true)
    expect(filtersAreEmpty({ query: '  ', tiers: [] })).toBe(true)
    expect(filtersAreEmpty({ query: 'x', tiers: [] })).toBe(false)
    expect(filtersAreEmpty({ query: '', tiers: ['veterans'] })).toBe(false)
  })
})
