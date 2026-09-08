/**
 * Guards on what the PUBLIC roadmap snapshot is allowed to contain — #1053.
 *
 * `public/data/roadmap.json` is served to anyone, and the methodology page
 * states: "We show the tier badge publicly, but not the numeric score."
 * For 120 entries it carried `readinessScore` anyway, as a raw number attached
 * to a named charity, negatives included (`"Oak Grove Community Closet",
 * "readinessScore": -107`). The rendered page honoured the promise; the payload
 * behind it did not, and nothing in the repo compared the two.
 *
 * That is the gap these tests close. They assert the published FILE rather than
 * the generator's internals, because the promise is about what is served — a
 * generator test would pass against a stale committed snapshot, which is
 * exactly the state that went unnoticed.
 */

const fs = require('fs')
const path = require('path')

const PAYLOAD = path.join(process.cwd(), 'public', 'data', 'roadmap.json')

let data
beforeAll(() => {
  data = JSON.parse(fs.readFileSync(PAYLOAD, 'utf-8'))
})

describe('published roadmap payload', () => {
  it('has entries at all (so the assertions below are not vacuous)', () => {
    expect(Array.isArray(data.entries)).toBe(true)
    expect(data.entries.length).toBeGreaterThan(0)
  })

  it('publishes no numeric readiness score, on any entry', () => {
    const offenders = data.entries
      .filter((e) => 'readinessScore' in e)
      .map((e) => `${e.charityName} (#${e.issueNumber})`)
    expect(offenders).toEqual([])
  })

  it('publishes no numeric readiness score anywhere in the file', () => {
    // Belt and braces: the per-entry check above would miss a score tucked into
    // a summary block, a nested object, or a future top-level field.
    expect(fs.readFileSync(PAYLOAD, 'utf-8')).not.toContain('readinessScore')
  })

  it('still publishes the tier badge the page renders', () => {
    // The promise is "tier yes, number no" — dropping the tier would satisfy the
    // test above while breaking the roadmap cards.
    expect(data.entries.some((e) => e.readinessTier !== null)).toBe(true)
  })

  it('publishes a rank for exactly the entries that have a tier', () => {
    // Rank and tier are both derived from the score, so an entry with one and
    // not the other means the derivation diverged.
    const mismatched = data.entries
      .filter((e) => (e.readinessRank === null) !== (e.readinessTier === null))
      .map((e) => `${e.charityName}: rank=${e.readinessRank} tier=${e.readinessTier}`)
    expect(mismatched).toEqual([])
  })

  it('publishes ranks that are dense and start at 1', () => {
    // Gaps would mean ordinal ranking crept in, which silently breaks the
    // tie-breakers behind the score in sortNeedsAdmin (§9).
    const ranks = [...new Set(data.entries.map((e) => e.readinessRank).filter((r) => r !== null))]
    if (!ranks.length) return
    expect(ranks.sort((a, b) => a - b)).toEqual(
      Array.from({ length: ranks.length }, (_, i) => i + 1)
    )
  })
})
