/**
 * Roadmap data helper tests — sectioning + the §9 four-step sort.
 */
import {
  sortNeedsAdmin,
  sectionEntries,
  graduatedCount,
  type RoadmapData,
  type RoadmapEntry,
} from '@/app/roadmap/roadmapData'

function entry(overrides: Partial<RoadmapEntry>): RoadmapEntry {
  return {
    issueNumber: 1,
    charityName: 'Test',
    missionExcerpt: '',
    status: 'needs-admin',
    charityStage: '501c3',
    missionCategory: 'general',
    serviceTier: 'Tier 2',
    readinessRank: 1,
    readinessTier: 'Developing',
    submittedAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sponsor: null,
    plusOne: 0,
    issueUrl: 'https://example.com',
    ...overrides,
  }
}

describe('sortNeedsAdmin (§9)', () => {
  it('ranks basic-needs ahead of a better-ranked general charity', () => {
    const basicNeeds = entry({
      charityName: 'BasicNeeds',
      missionCategory: 'basic-needs',
      readinessRank: 2,
    })
    const general = entry({
      charityName: 'General',
      missionCategory: 'general',
      readinessRank: 1,
    })
    const sorted = sortNeedsAdmin([general, basicNeeds])
    expect(sorted[0].charityName).toBe('BasicNeeds')
  })

  it('ranks basic-needs ahead of veterans ahead of general', () => {
    const sorted = sortNeedsAdmin([
      entry({ charityName: 'Gen', missionCategory: 'general', readinessRank: 1 }),
      entry({ charityName: 'Vet', missionCategory: 'veterans', readinessRank: 2 }),
      entry({ charityName: 'Basic', missionCategory: 'basic-needs', readinessRank: 3 }),
    ])
    expect(sorted.map((e) => e.charityName)).toEqual(['Basic', 'Vet', 'Gen'])
  })

  it('breaks mission ties by readiness rank, then +1 votes, then oldest first', () => {
    // A and C tie on rank (they tied on score) — the DENSE ranking is what keeps
    // the +1 tie-breaker reachable at all.
    const a = entry({
      charityName: 'A',
      readinessRank: 2,
      plusOne: 1,
      submittedAt: '2026-03-01',
    })
    const b = entry({
      charityName: 'B',
      readinessRank: 1,
      plusOne: 0,
      submittedAt: '2026-02-01',
    })
    const c = entry({
      charityName: 'C',
      readinessRank: 2,
      plusOne: 5,
      submittedAt: '2026-01-01',
    })
    const sorted = sortNeedsAdmin([a, b, c])
    expect(sorted.map((e) => e.charityName)).toEqual(['B', 'C', 'A'])
  })
})

describe('sectionEntries', () => {
  const data: RoadmapData = {
    generatedAt: '',
    source: 'test',
    entries: [
      entry({ charityName: 'Review old', status: 'needs-info', submittedAt: '2026-01-01' }),
      entry({ charityName: 'Review new', status: 'intake', submittedAt: '2026-02-01' }),
      entry({ charityName: 'Needs admin', status: 'needs-admin' }),
      entry({ charityName: 'Building', status: 'active-build', updatedAt: '2026-05-01' }),
      entry({ charityName: 'Graduated', status: 'graduated' }),
    ],
  }

  it('groups review by submission date, oldest first', () => {
    const review = sectionEntries(data, 'review')
    expect(review.map((e) => e.charityName)).toEqual(['Review old', 'Review new'])
  })

  it('places active builds in the active section', () => {
    const active = sectionEntries(data, 'active')
    expect(active.map((e) => e.charityName)).toEqual(['Building'])
  })

  it('counts graduated charities for the alumni tile', () => {
    expect(graduatedCount(data)).toBe(1)
  })

  it('shows the full live portfolio regardless of date, ranked entries first then by name', () => {
    const portfolio: RoadmapData = {
      generatedAt: '',
      source: 'test',
      entries: [
        entry({
          charityName: 'zebra.org',
          status: 'live',
          readinessRank: null,
          readinessTier: null,
        }),
        entry({
          charityName: 'alpha.org',
          status: 'live',
          readinessRank: null,
          readinessTier: null,
        }),
        entry({
          charityName: 'Scored Charity',
          status: 'live',
          readinessRank: 1,
          readinessTier: 'Established',
        }),
        entry({
          charityName: 'Old launch',
          status: 'live',
          updatedAt: '2020-01-01T00:00:00.000Z',
          readinessRank: 2,
          readinessTier: 'Foundational',
        }),
      ],
    }
    const launched = sectionEntries(portfolio, 'launched')
    // Ranked entries first (best rank first), then unranked alphabetically.
    expect(launched.map((e) => e.charityName)).toEqual([
      'Scored Charity',
      'Old launch',
      'alpha.org',
      'zebra.org',
    ])
  })
})
