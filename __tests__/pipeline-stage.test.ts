import {
  deriveStage,
  groupByStage,
  parseValidationChecklist,
  validationProgress,
  PIPELINE_STAGES,
} from '@/app/pipeline/pipelineData'
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

  it('a live site still on its GitHub Pages default URL is "validated" (no checklist data)', () => {
    const e = entry({
      status: 'live',
      liveUrl: 'https://freeforcharity.github.io/FFC-EX-example/',
    })
    expect(deriveStage(e)).toBe('validated')
  })

  it('a fully ticked Gate-3 checklist means "validated"', () => {
    // With the checklist all ticked, the entry is validated even without any
    // live URL recorded yet — the checklist is the objective Gate-3 signal.
    expect(deriveStage(entry({ status: 'live', validationTicked: 8, validationTotal: 8 }))).toBe(
      'validated'
    )
    expect(
      deriveStage(
        entry({
          status: 'live',
          liveUrl: 'https://freeforcharity.github.io/FFC-EX-example/',
          validationTicked: 8,
          validationTotal: 8,
        })
      )
    ).toBe('validated')
  })

  it('a partially ticked checklist keeps a live-labelled entry at "building"', () => {
    // The label says live, but Gate 3 is objectively unfinished: the checklist
    // wins over both the label and the github.io-URL heuristic.
    const e = entry({
      status: 'live',
      liveUrl: 'https://freeforcharity.github.io/FFC-EX-example/',
      validationTicked: 6,
      validationTotal: 8,
    })
    expect(deriveStage(e)).toBe('building')
  })

  it('a fully ticked checklist promotes an in-build entry to "validated"', () => {
    expect(
      deriveStage(entry({ status: 'active-build', validationTicked: 8, validationTotal: 8 }))
    ).toBe('validated')
    expect(
      deriveStage(entry({ status: 'sponsored', validationTicked: 8, validationTotal: 8 }))
    ).toBe('validated')
    // Mid-checklist builds stay at "building".
    expect(
      deriveStage(entry({ status: 'active-build', validationTicked: 3, validationTotal: 8 }))
    ).toBe('building')
  })

  it('a live custom domain is "domain" regardless of checklist state', () => {
    // The domain gate is past validation; a live custom domain is the
    // observable signal that it was cleared.
    expect(
      deriveStage(
        entry({
          status: 'live',
          liveUrl: 'https://example.org',
          validationTicked: 8,
          validationTotal: 8,
        })
      )
    ).toBe('domain')
  })

  it('ignores degenerate checklist data (total 0) and falls back to the URL heuristic', () => {
    const e = entry({
      status: 'live',
      liveUrl: 'https://freeforcharity.github.io/FFC-EX-example/',
      validationTicked: 0,
      validationTotal: 0,
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

  it('buckets an unknown status conservatively instead of crashing the build', () => {
    // The entries come from a generated JSON snapshot; a status this build
    // doesn't know (e.g. a newly introduced status:* label) must not make
    // groupByStage index `undefined` and crash the static export.
    const e = entry({ status: 'awaiting-approval' as RoadmapStatus })
    expect(deriveStage(e)).toBe('applied')
    expect(() => groupByStage([e])).not.toThrow()
    expect(groupByStage([e]).applied).toHaveLength(1)
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

describe('parseValidationChecklist (generator parsing)', () => {
  const body = (items: string) =>
    [
      '_Auto-created from an FFC application for **Example Org**._',
      '',
      '### Charity name',
      '',
      'Example Org',
      '',
      '### Validation checklist (Gate 3)',
      '',
      '_All boxes ticked = **validated**._',
      '',
      items,
      '',
      'Live site: (paste the https GitHub Pages URL here once the site loads)',
    ].join('\n')

  it('counts ticked vs total items in the validation section', () => {
    expect(
      parseValidationChecklist(body('- [x] CI green\n- [X] Site loads\n- [ ] Footer'))
    ).toEqual({
      ticked: 2,
      total: 3,
    })
    expect(parseValidationChecklist(body('- [ ] CI green\n- [ ] Site loads'))).toEqual({
      ticked: 0,
      total: 2,
    })
    expect(parseValidationChecklist(body('- [x] CI green\n- [x] Site loads'))).toEqual({
      ticked: 2,
      total: 2,
    })
  })

  it('returns null for bodies without a checklist (backward compatibility)', () => {
    expect(parseValidationChecklist(null)).toBeNull()
    expect(parseValidationChecklist(undefined)).toBeNull()
    expect(parseValidationChecklist('')).toBeNull()
    // Pre-checklist stub: fields but no validation section.
    expect(parseValidationChecklist('### Charity name\n\nExample Org\n')).toBeNull()
    // A heading with no checkbox items under it is not a checklist.
    expect(
      parseValidationChecklist('### Validation checklist (Gate 3)\n\nnothing here\n')
    ).toBeNull()
  })

  it('does not count checkboxes outside the validation section', () => {
    const b = [
      '### To-dos',
      '',
      '- [x] unrelated ticked box',
      '',
      '### Validation checklist (Gate 3)',
      '',
      '- [ ] CI green',
      '- [x] Site loads',
    ].join('\n')
    expect(parseValidationChecklist(b)).toEqual({ ticked: 1, total: 2 })
  })

  it('stops at the next same-level heading and survives CRLF bodies', () => {
    const b =
      '### Validation checklist (Gate 3)\r\n\r\n- [x] CI green\r\n- [ ] Footer\r\n\r\n### Notes\r\n\r\n- [x] not part of the checklist\r\n'
    expect(parseValidationChecklist(b)).toEqual({ ticked: 1, total: 2 })
  })

  it('parses the real work-order stub from intake-issues.mjs (contract test)', async () => {
    // Read-only import of the stub generator: locks the generator-side parser
    // to the exact body shape `stubBody` embeds (checklist last, unticked).
    const { stubBody, VALIDATION_CHECKLIST } = await import('../scripts/lib/intake-issues.mjs')
    const stub = stubBody(
      { id: 'ffc-90', charityName: 'Example Org', serviceTier: 'Tier 3' },
      'FreeForCharity/FFC-IN-ffcadmin.org'
    )
    expect(parseValidationChecklist(stub)).toEqual({
      ticked: 0,
      total: VALIDATION_CHECKLIST.length,
    })
    // Ticking boxes the way GitHub's checkbox UI does is reflected in the count.
    const twoTicked = stub.replace('- [ ]', '- [x]').replace('- [ ]', '- [x]')
    expect(parseValidationChecklist(twoTicked)).toEqual({
      ticked: 2,
      total: VALIDATION_CHECKLIST.length,
    })
  })
})

describe('validationProgress', () => {
  it('returns the snapshot checklist counts when present', () => {
    expect(validationProgress(entry({ validationTicked: 6, validationTotal: 8 }))).toEqual({
      ticked: 6,
      total: 8,
    })
  })

  it('returns null for entries without checklist data or with a degenerate total', () => {
    expect(validationProgress(entry({}))).toBeNull()
    expect(validationProgress(entry({ validationTicked: 0, validationTotal: 0 }))).toBeNull()
  })

  it('treats a missing ticked count as zero', () => {
    expect(validationProgress(entry({ validationTotal: 8 }))).toEqual({ ticked: 0, total: 8 })
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
