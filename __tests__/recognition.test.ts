import {
  RECOGNITION_TIERS,
  RECOGNIZED_VOLUNTEERS,
  CE_BADGES,
  getTier,
  getCeBadge,
  publicVolunteers,
  recognitionAggregate,
} from '../src/data/recognition'

describe('Volunteer recognition data model (#336)', () => {
  it('has six tiers with unique, sequential ids', () => {
    const ids = RECOGNITION_TIERS.map((t) => t.id)
    expect(ids).toEqual([1, 2, 3, 4, 5, 6])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('maps tiers 1:1 to GitHub access roles in ascending order', () => {
    const roles = RECOGNITION_TIERS.map((t) => t.role)
    expect(roles).toEqual(['none', 'read', 'triage', 'write', 'maintain', 'admin'])
  })

  it('every tier defines grants and criteria and a ladder alignment', () => {
    for (const t of RECOGNITION_TIERS) {
      expect(t.grants.length).toBeGreaterThan(0)
      expect(t.criteria.length).toBeGreaterThan(0)
      expect(t.ladderAlignment.length).toBeGreaterThan(0)
    }
  })

  it('getTier resolves by id', () => {
    expect(getTier(1)?.name).toBe('Spark')
    expect(getTier(6)?.name).toBe('Captain')
    expect(getTier(99)).toBeUndefined()
  })

  it('every recognized volunteer references a real tier', () => {
    for (const v of RECOGNIZED_VOLUNTEERS) {
      expect(getTier(v.tierId)).toBeDefined()
      expect(v.since).toMatch(/^\d{4}-\d{2}$/)
    }
  })

  it('publicVolunteers only returns opt-in entries, highest tier first', () => {
    const pub = publicVolunteers()
    expect(pub.every((v) => v.publicOptIn)).toBe(true)
    for (let i = 1; i < pub.length; i++) {
      expect(pub[i - 1].tierId).toBeGreaterThanOrEqual(pub[i].tierId)
    }
  })

  it('defines CE badges for each channel plus a capstone (#359)', () => {
    const ids = CE_BADGES.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
    const channels = CE_BADGES.map((b) => b.channel)
    for (const c of ['education', 'teaching', 'work', 'all']) {
      expect(channels).toContain(c)
    }
    expect(getCeBadge('ce-champion')?.channel).toBe('all')
    expect(getCeBadge('nope')).toBeUndefined()
  })

  it('any volunteer CE badges reference real badges', () => {
    for (const v of RECOGNIZED_VOLUNTEERS) {
      for (const id of v.ceBadges ?? []) {
        expect(getCeBadge(id)).toBeDefined()
      }
    }
  })

  it('the CE Champion capstone is only held alongside all three channel badges', () => {
    const channelBadges = ['ce-learner', 'ce-educator', 'ce-practitioner']
    for (const v of RECOGNIZED_VOLUNTEERS) {
      const badges = v.ceBadges ?? []
      if (badges.includes('ce-champion')) {
        for (const required of channelBadges) {
          expect(badges).toContain(required)
        }
      }
    }
  })

  it('aggregate counts lifetime and slices by year', () => {
    const agg = recognitionAggregate(new Date('2026-06-06T00:00:00Z'))
    expect(agg.lifetime).toBe(RECOGNIZED_VOLUNTEERS.length)
    const total = agg.byYear.reduce((sum, y) => sum + y.count, 0)
    expect(total).toBe(RECOGNIZED_VOLUNTEERS.length)
    expect(agg.thisYear).toBeLessThanOrEqual(agg.lifetime)
    expect(agg.thisMonth).toBeLessThanOrEqual(agg.thisYear)
  })
})
