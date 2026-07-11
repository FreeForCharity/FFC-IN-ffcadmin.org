import { deriveStage, groupByStage, PIPELINE_STAGES } from '@/app/pipeline/pipelineData'
import type { RoadmapEntry, RoadmapStatus } from '@/app/roadmap/roadmapData'

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

describe('deriveStage', () => {
  it('maps application review statuses to "applied"', () => {
    expect(deriveStage(entry({ status: 'intake' }))).toBe('applied')
    expect(deriveStage(entry({ status: 'needs-info' }))).toBe('applied')
  })

  it('maps approved-but-not-building statuses to "approved"', () => {
    expect(deriveStage(entry({ status: 'needs-admin' }))).toBe('approved')
    // On-hold labels don't record which gate the stall happened at, so the
    // derivation keeps the most conservative in-flight reading.
    expect(deriveStage(entry({ status: 'on-hold' }))).toBe('approved')
  })

  it('maps in-flight build statuses to "building"', () => {
    expect(deriveStage(entry({ status: 'sponsored' }))).toBe('building')
    expect(deriveStage(entry({ status: 'active-build' }))).toBe('building')
  })

  it('a live site still on its GitHub Pages default URL is "validated"', () => {
    const e = entry({
      status: 'live',
      liveUrl: 'https://freeforcharity.github.io/FFC-EX-example/',
    })
    expect(deriveStage(e)).toBe('validated')
  })

  it('a live site on a custom domain is "domain"', () => {
    expect(deriveStage(entry({ status: 'live', liveUrl: 'https://example.org' }))).toBe('domain')
    expect(deriveStage(entry({ status: 'live', liveUrl: 'https://www.example.org/' }))).toBe(
      'domain'
    )
  })

  it('does not mistake a github.io lookalike domain for GitHub Pages', () => {
    expect(deriveStage(entry({ status: 'live', liveUrl: 'https://evilgithub.io' }))).toBe('domain')
    expect(deriveStage(entry({ status: 'live', liveUrl: 'https://github.io.example.org' }))).toBe(
      'domain'
    )
  })

  it('a live entry with a malformed or missing URL falls back to "domain"', () => {
    expect(deriveStage(entry({ status: 'live', liveUrl: 'not a url' }))).toBe('domain')
    expect(deriveStage(entry({ status: 'live' }))).toBe('domain')
  })

  it('graduated charities map to the most advanced supported stage', () => {
    expect(deriveStage(entry({ status: 'graduated' }))).toBe('domain')
  })

  it('covers every roadmap status', () => {
    const statuses: RoadmapStatus[] = [
      'intake',
      'needs-info',
      'needs-admin',
      'active-build',
      'sponsored',
      'live',
      'on-hold',
      'graduated',
    ]
    for (const status of statuses) {
      const stage = deriveStage(entry({ status }))
      expect(PIPELINE_STAGES.some((s) => s.id === stage)).toBe(true)
    }
  })
})

describe('groupByStage', () => {
  it('returns every stage key even when empty, entries sorted by name', () => {
    const groups = groupByStage([
      entry({ charityName: 'Zeta', status: 'intake' }),
      entry({ charityName: 'Alpha', status: 'intake' }),
      entry({ charityName: 'Mid', status: 'needs-admin' }),
    ])
    expect(Object.keys(groups).sort()).toEqual([...PIPELINE_STAGES.map((s) => s.id)].sort())
    expect(groups.applied.map((e) => e.charityName)).toEqual(['Alpha', 'Zeta'])
    expect(groups.approved.map((e) => e.charityName)).toEqual(['Mid'])
    expect(groups.email).toEqual([]) // email stage not derivable yet (future work)
  })
})
