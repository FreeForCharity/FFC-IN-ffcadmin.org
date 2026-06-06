/**
 * CE hours evidence model (#360) — the data *model* for logging, approving, and
 * totalling volunteer + training hours so FFC can certify them toward CE credit
 * (#356), the documentation artifact (#358), MOVSM (#335), and recognition
 * badges (#359/#336).
 *
 * This file defines *what* is tracked and the rules for it. *Where/how* it is
 * stored and automated is the separate backend epic (#361/#362) — whichever
 * backend is chosen must emit records matching `HoursEntry` (e.g. committed
 * JSON, per the #337 scheduled-Actions pattern) so everything downstream can
 * consume one shape.
 *
 * Evidence is hybrid and never self-claimed for credit:
 *   - GitHub activity (PRs/commits/issues/reviews) auto-counts as evidence.
 *   - Non-code work (design/admin/meetings/mentoring/training) is self-logged.
 *   - Every entry is certified by a mentor / program lead before it counts.
 */
import type { CeBody, CreditChannel } from './ce-bodies'

export type HoursSource = 'github' | 'self-log'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

/** Activity types GitHub can evidence automatically (no self-log needed). */
export const GITHUB_AUTO_ACTIVITIES = ['pull_request', 'commit', 'issue', 'review'] as const
export type GitHubActivity = (typeof GITHUB_AUTO_ACTIVITIES)[number]

/** Activity types GitHub can't see — these require a self-logged entry. */
export const SELF_LOG_ACTIVITIES = [
  'design',
  'admin',
  'meeting',
  'mentoring',
  'training-received',
  'training-delivered',
  'other',
] as const
export type SelfLogActivity = (typeof SELF_LOG_ACTIVITIES)[number]

export type ActivityType = GitHubActivity | SelfLogActivity

export interface HoursEntry {
  /** Stable unique id. */
  id: string
  volunteer: string
  githubHandle?: string
  /** ISO date (range start) of the activity. */
  date: string
  /** Optional range end for multi-day activities. */
  endDate?: string
  activityType: ActivityType
  /** Human description of what was done. */
  activity: string
  /** Which CE credit channel this maps to. */
  channel: CreditChannel
  /** Raw hours logged, before any per-body caps are applied. */
  rawHours: number
  source: HoursSource
  /** Evidence: a PR/commit/issue URL (github) or a doc/notes reference (self-log). */
  evidenceUrl?: string
  /** For `training-received`: the #320 module completed (its published CE hours). */
  moduleId?: string
  /** Whether the activity is relevant to the volunteer's certification domain. */
  domainRelevant: boolean
  /** Teaching de-dup: true only for the first delivery of this content. */
  firstDelivery?: boolean
  /** Stable key so the same activity is never counted twice. */
  dedupKey: string
  /** The mentor / program lead who certifies the entry. */
  approver?: string
  status: ApprovalStatus
}

/** Build a stable de-dup key from the identifying parts of an entry. */
export function makeDedupKey(parts: {
  githubHandle?: string
  volunteer: string
  date: string
  activityType: ActivityType
  evidenceUrl?: string
}): string {
  return [
    parts.githubHandle || parts.volunteer,
    parts.date,
    parts.activityType,
    parts.evidenceUrl || '',
  ]
    .join('|')
    .toLowerCase()
}

/** Does this activity type auto-count from GitHub, or need a self-log? */
export function requiresSelfLog(activityType: ActivityType): boolean {
  return !GITHUB_AUTO_ACTIVITIES.includes(activityType as GitHubActivity)
}

/** Approved, de-duplicated entries (the only ones that count toward credit). */
export function approvedEntries(entries: HoursEntry[]): HoursEntry[] {
  const seen = new Set<string>()
  const out: HoursEntry[] = []
  for (const e of entries) {
    if (e.status !== 'approved') continue
    if (seen.has(e.dedupKey)) continue
    seen.add(e.dedupKey)
    out.push(e)
  }
  return out
}

/**
 * Whether an approved entry is creditable toward a given body, applying the
 * channel support + relevance rules from the compliance matrix (#356). This is
 * the MVP "is it eligible" gate; precise numeric caps stay as prose in
 * `ce-bodies.ts` and are applied by a human/documentation step (caps there are
 * intentionally not machine-parsed because they vary by cert and change).
 */
export function creditability(
  entry: HoursEntry,
  body: CeBody
): { creditable: boolean; reason: string } {
  if (!body.supported) {
    return { creditable: false, reason: `${body.name} has no CE-hours model.` }
  }
  const channel = body.channels[entry.channel]
  if (channel.support === 'no') {
    return { creditable: false, reason: `${body.name} does not credit this channel.` }
  }
  if (
    entry.channel === 'work' &&
    body.relevance === 'domain-relevant-only' &&
    !entry.domainRelevant
  ) {
    return {
      creditable: false,
      reason: `${body.name} only credits domain-relevant work; this entry is not flagged relevant.`,
    }
  }
  if (entry.channel === 'teaching' && entry.firstDelivery === false) {
    return {
      creditable: false,
      reason: 'Teaching credit applies to first delivery only (de-dup).',
    }
  }
  return { creditable: true, reason: channel.note }
}

/** Total approved raw hours per channel (before per-body caps). */
export function hoursByChannel(entries: HoursEntry[]): Record<CreditChannel, number> {
  const totals: Record<CreditChannel, number> = { education: 0, teaching: 0, work: 0 }
  for (const e of approvedEntries(entries)) {
    totals[e.channel] += e.rawHours
  }
  return totals
}

/**
 * Sample entries — illustrative only (not real logged hours). They show the
 * shape each backend (#361/#362) must emit. Replace with the live export.
 */
export const SAMPLE_HOURS_ENTRIES: HoursEntry[] = [
  {
    id: 'sample-1',
    volunteer: 'Sample Volunteer',
    githubHandle: 'sample',
    date: '2026-05-01',
    activityType: 'pull_request',
    activity: 'Built a charity site section and opened a reviewed PR.',
    channel: 'work',
    rawHours: 4,
    source: 'github',
    evidenceUrl: 'https://github.com/FreeForCharity/example/pull/1',
    domainRelevant: true,
    dedupKey: 'sample|2026-05-01|pull_request|https://github.com/freeforcharity/example/pull/1',
    approver: 'Program Lead',
    status: 'approved',
  },
  {
    id: 'sample-2',
    volunteer: 'Sample Volunteer',
    githubHandle: 'sample',
    date: '2026-05-03',
    activityType: 'training-received',
    activity: 'Completed the Security & Trust module.',
    channel: 'education',
    rawHours: 3,
    source: 'self-log',
    moduleId: 'security-trust',
    domainRelevant: true,
    dedupKey: 'sample|2026-05-03|training-received|',
    approver: 'Program Lead',
    status: 'pending',
  },
]
