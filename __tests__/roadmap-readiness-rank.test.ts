/**
 * Unit tests for `withReadinessRank()` — the point where the private numeric
 * readiness score is exchanged for a public dense rank (#1053).
 *
 * The two properties that matter are easy to get wrong and silent when wrong:
 * ordinal instead of dense ranking (breaks the §9 tie-breakers), and appending
 * the key instead of substituting it (defeats the generator's no-churn check
 * and makes every future diff unreadable).
 */

import { withReadinessRank } from '../src/lib/readiness/rank'

/**
 * A concrete fixture shape, deliberately not derived from the function's own
 * generic: `Parameters<typeof withReadinessRank>[0][number]` collapses T to its
 * constraint, so every field but `readinessScore` disappears and the assertions
 * below stop type-checking. Naming the shape also keeps the key-order test
 * honest, since it asserts against these keys.
 */
interface ScoredFixture {
  issueNumber: number
  charityName: string
  missionExcerpt: string
  status: string
  charityStage: string
  missionCategory: string
  serviceTier: string
  readinessScore: number | null
  readinessTier: string | null
  submittedAt: string
  updatedAt: string
  sponsor: null
  plusOne: number
  issueUrl: string
}

const scored = (charityName: string, readinessScore: number | null): ScoredFixture => ({
  issueNumber: 1,
  charityName,
  missionExcerpt: '',
  status: 'needs-admin',
  charityStage: '501c3',
  missionCategory: 'general',
  serviceTier: 'Tier 2',
  readinessScore,
  readinessTier: readinessScore === null ? null : 'Developing',
  submittedAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  sponsor: null,
  plusOne: 0,
  issueUrl: 'https://example.com',
})

describe('withReadinessRank', () => {
  it('ranks the highest score 1 and descends from there', () => {
    const out = withReadinessRank([scored('low', 10), scored('high', 300), scored('mid', 100)])
    const byName = Object.fromEntries(out.map((e) => [e.charityName, e.readinessRank]))
    expect(byName).toEqual({ high: 1, mid: 2, low: 3 })
  })

  it('gives tied scores the SAME rank, and does not skip the next one', () => {
    // Dense, not ordinal. If ties were broken arbitrarily here, sortNeedsAdmin's
    // "+1 votes, then oldest first" tie-breakers would never be reached and the
    // published order would stop matching §9 — silently, since both orders look
    // plausible.
    const out = withReadinessRank([
      scored('a', 100),
      scored('b', 100),
      scored('c', 50),
      scored('d', 300),
    ])
    const byName = Object.fromEntries(out.map((e) => [e.charityName, e.readinessRank]))
    expect(byName).toEqual({ d: 1, a: 2, b: 2, c: 3 })
  })

  it('keeps an unscored entry unranked rather than ranking it last', () => {
    // Null means "not scored yet", which is not the same claim as "worst".
    const out = withReadinessRank([scored('pending', null), scored('scored', 10)])
    expect(out.find((e) => e.charityName === 'pending')!.readinessRank).toBeNull()
    expect(out.find((e) => e.charityName === 'scored')!.readinessRank).toBe(1)
  })

  it('ranks negative scores like any other, without special-casing', () => {
    // The live data's lowest score is negative; it should rank, not vanish.
    const out = withReadinessRank([scored('neg', -107), scored('pos', 5)])
    const byName = Object.fromEntries(out.map((e) => [e.charityName, e.readinessRank]))
    expect(byName).toEqual({ pos: 1, neg: 2 })
  })

  it('removes the numeric score entirely', () => {
    const out = withReadinessRank([scored('x', 42)])
    expect('readinessScore' in out[0]).toBe(false)
    expect(JSON.stringify(out)).not.toContain('readinessScore')
  })

  it('writes the rank where the score was, preserving key order', () => {
    // Appending instead of substituting would reorder every key after the
    // score, defeating the generator's `JSON.stringify(previous) === ...`
    // no-churn check and turning each refresh into a whole-file diff.
    const input = scored('x', 42)
    const before = Object.keys(input)
    const after = Object.keys(withReadinessRank([input])[0])
    expect(after).toEqual(before.map((k) => (k === 'readinessScore' ? 'readinessRank' : k)))
  })

  it('is order-preserving: better score never gets a worse rank', () => {
    const scores = [305, 100, 100, 0, -132, -107]
    const out = withReadinessRank(scores.map((s, i) => scored(`c${i}`, s)))
    for (let i = 0; i < scores.length; i += 1) {
      for (let j = 0; j < scores.length; j += 1) {
        const [si, sj] = [scores[i], scores[j]]
        const [ri, rj] = [out[i].readinessRank!, out[j].readinessRank!]
        if (si > sj) expect(ri).toBeLessThan(rj)
        if (si === sj) expect(ri).toBe(rj)
      }
    }
  })
})
