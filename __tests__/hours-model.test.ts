import {
  GITHUB_AUTO_ACTIVITIES,
  SAMPLE_HOURS_ENTRIES,
  makeDedupKey,
  requiresSelfLog,
  approvedEntries,
  creditability,
  hoursByChannel,
  type HoursEntry,
} from '../src/data/hours-model'
import { getCeBody } from '../src/data/ce-bodies'

describe('CE hours evidence model (#360)', () => {
  it('classifies GitHub-auto vs self-log activity types', () => {
    expect(requiresSelfLog('pull_request')).toBe(false)
    expect(requiresSelfLog('commit')).toBe(false)
    expect(requiresSelfLog('design')).toBe(true)
    expect(requiresSelfLog('mentoring')).toBe(true)
    expect(GITHUB_AUTO_ACTIVITIES).toContain('review')
  })

  it('builds a stable, case-insensitive de-dup key', () => {
    const a = makeDedupKey({
      volunteer: 'X',
      githubHandle: 'gh',
      date: '2026-05-01',
      activityType: 'pull_request',
      evidenceUrl: 'https://github.com/o/r/pull/1',
    })
    const b = makeDedupKey({
      volunteer: 'X',
      githubHandle: 'GH',
      date: '2026-05-01',
      activityType: 'pull_request',
      evidenceUrl: 'HTTPS://GITHUB.COM/o/r/pull/1',
    })
    expect(a).toBe(b)
  })

  it('only counts approved, de-duplicated entries', () => {
    const dupe: HoursEntry = { ...SAMPLE_HOURS_ENTRIES[0], id: 'dupe' }
    const result = approvedEntries([...SAMPLE_HOURS_ENTRIES, dupe])
    // sample-1 is approved; sample-2 is pending; the duplicate is dropped
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('approved')
  })

  it('totals approved hours by channel', () => {
    const totals = hoursByChannel(SAMPLE_HOURS_ENTRIES)
    expect(totals.work).toBe(4) // the approved PR entry
    expect(totals.education).toBe(0) // sample-2 is still pending
  })

  it('applies #356 channel + relevance rules via creditability', () => {
    const comptia = getCeBody('comptia')!
    const isc2 = getCeBody('isc2')!
    const workEntry = SAMPLE_HOURS_ENTRIES[0]

    // CompTIA credits no volunteer work
    expect(creditability(workEntry, comptia).creditable).toBe(false)
    // ISC2 credits domain-relevant security work
    expect(creditability(workEntry, isc2).creditable).toBe(true)

    // Non-domain-relevant work fails the relevance gate
    const generic = { ...workEntry, domainRelevant: false }
    expect(creditability(generic, isc2).creditable).toBe(false)
  })

  it('rejects credit for unsupported bodies', () => {
    const microsoft = getCeBody('microsoft')!
    expect(creditability(SAMPLE_HOURS_ENTRIES[0], microsoft).creditable).toBe(false)
  })

  it('teaching credit is first-delivery only', () => {
    const isc2 = getCeBody('isc2')!
    const repeat: HoursEntry = {
      ...SAMPLE_HOURS_ENTRIES[0],
      channel: 'teaching',
      firstDelivery: false,
    }
    expect(creditability(repeat, isc2).creditable).toBe(false)
  })
})
