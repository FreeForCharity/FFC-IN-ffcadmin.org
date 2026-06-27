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
    readinessScore: 100,
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
  it('ranks essential mission ahead of a higher-scoring general charity', () => {
    const essential = entry({
      charityName: 'Essential',
      missionCategory: 'essential',
      readinessScore: 50,
    })
    const general = entry({
      charityName: 'General',
      missionCategory: 'general',
      readinessScore: 250,
    })
    const sorted = sortNeedsAdmin([general, essential])
    expect(sorted[0].charityName).toBe('Essential')
  })

  it('breaks mission ties by readiness score, then +1 votes, then oldest first', () => {
    const a = entry({
      charityName: 'A',
      readinessScore: 100,
      plusOne: 1,
      submittedAt: '2026-03-01',
    })
    const b = entry({
      charityName: 'B',
      readinessScore: 120,
      plusOne: 0,
      submittedAt: '2026-02-01',
    })
    const c = entry({
      charityName: 'C',
      readinessScore: 100,
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

  it('shows the full live portfolio regardless of date, scored entries first then by name', () => {
    const portfolio: RoadmapData = {
      generatedAt: '',
      source: 'test',
      entries: [
        entry({
          charityName: 'zebra.org',
          status: 'live',
          readinessScore: null,
          readinessTier: null,
        }),
        entry({
          charityName: 'alpha.org',
          status: 'live',
          readinessScore: null,
          readinessTier: null,
        }),
        entry({
          charityName: 'Scored Charity',
          status: 'live',
          readinessScore: 200,
          readinessTier: 'Established',
        }),
        entry({
          charityName: 'Old launch',
          status: 'live',
          updatedAt: '2020-01-01T00:00:00.000Z',
          readinessScore: 50,
          readinessTier: 'Foundational',
        }),
      ],
    }
    const launched = sectionEntries(portfolio, 'launched')
    // Scored entries first (by score desc), then unscored alphabetically.
    expect(launched.map((e) => e.charityName)).toEqual([
      'Scored Charity',
      'Old launch',
      'alpha.org',
      'zebra.org',
    ])
  })
})
