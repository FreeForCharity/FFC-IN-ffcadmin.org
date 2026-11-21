/**
 * Exchange the private numeric readiness score for a public dense rank (#1053).
 *
 * `public/data/roadmap.json` is world-readable, and the methodology page states
 * "We show the tier badge publicly, but not the numeric score". It carried the
 * raw value against named charities anyway — negatives included — for 120
 * entries. A rank is what the roadmap's ordering actually needs, and it
 * discloses strictly less: the sequence a reader can already see on the page,
 * without the value or the distance between entries.
 *
 * Lives here rather than inside `scripts/generate-roadmap-data.ts` for the same
 * reason `scripts/lib/roadmap-fields.mjs` does — that script is an ESM `tsx`
 * entrypoint declaring its own `__dirname`, so importing it from a Jest test
 * dies with `Identifier '__dirname' has already been declared` and the logic
 * would ship untested.
 */

/**
 * Replace `readinessScore` with `readinessRank`: 1 is the highest score, and
 * entries that tie on score share a rank.
 *
 * Two properties are load-bearing and both are tested:
 *
 *  - **Dense, not ordinal.** Tied scores must stay tied. `sortNeedsAdmin` (§9)
 *    breaks a score tie with +1 votes and then age; ordinal ranking would settle
 *    every tie here first, and those tie-breakers would become unreachable
 *    without anything failing.
 *  - **Key order preserved.** The rank is written in the score's position
 *    rather than appended, so the generator's no-churn check (a
 *    `JSON.stringify` comparison against the previous file) is not defeated by
 *    key movement, and a genuine change stays legible in the diff.
 *
 * A null score stays a null rank: "not scored yet" is not a claim that the
 * entry is last.
 */
export function withReadinessRank<T extends { readinessScore: number | null }>(
  scored: T[]
): (Omit<T, 'readinessScore'> & { readinessRank: number | null })[] {
  const distinct = [
    ...new Set(scored.map((e) => e.readinessScore).filter((s): s is number => s !== null)),
  ].sort((a, b) => b - a)
  const rankOf = new Map(distinct.map((s, i) => [s, i + 1]))

  return scored.map((entry) => {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(entry)) {
      if (key === 'readinessScore') {
        out.readinessRank = value === null ? null : (rankOf.get(value as number) as number)
      } else {
        out[key] = value
      }
    }
    return out as Omit<T, 'readinessScore'> & { readinessRank: number | null }
  })
}
