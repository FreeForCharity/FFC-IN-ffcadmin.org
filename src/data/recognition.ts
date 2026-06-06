/**
 * Volunteer recognition / badge system (#336).
 *
 * Design decisions (owner, recorded on the issue):
 *  - Taxonomy is a warm "Growth + Crew" blend with a clear progression.
 *  - Badge tiers map **1:1 to GitHub access roles**, so each tier grants the
 *    exact corresponding rights/permissions and mirrors the Contributor Ladder.
 *    Start (public-repo work) → Read → Triage → Write → Maintain → Admin.
 *  - Validation is **manual**: contribution evidence in **GitHub commit history**
 *    plus **direct charity-board certification**. There is no self-service claim.
 *  - This committed file is the **single source of truth**. Maintainers add
 *    recognized volunteers here; nothing is awarded automatically.
 *  - Display is **opt-in public** per volunteer (name + badges) PLUS an
 *    always-rolling **aggregate** (per-month / per-year / lifetime) for reports.
 */

/** GitHub access roles, lowest to highest. */
export type GitHubRole = 'none' | 'read' | 'triage' | 'write' | 'maintain' | 'admin'

export interface RecognitionTier {
  /** 1 = entry, ascending. Doubles as the ladder rung number. */
  id: number
  /** Warm badge name (Growth + Crew blend). */
  name: string
  /** Human label for the GitHub access role this tier maps to 1:1. */
  githubRole: string
  /** The raw GitHub role key. */
  role: GitHubRole
  /** One-line description of who holds this badge. */
  blurb: string
  /** Exactly what the mapped GitHub role grants. */
  grants: string[]
  /** How the badge is earned (commit history + board certification). */
  criteria: string[]
  /** The Contributor Ladder rung this aligns with. */
  ladderAlignment: string
  icon: string
  gradient: string
}

/**
 * Badge tiers. Each maps 1:1 to a GitHub access role; `grants` reflects the
 * permissions GitHub attaches to that role.
 */
export const RECOGNITION_TIERS: RecognitionTier[] = [
  {
    id: 1,
    name: 'Spark',
    githubRole: 'Public contributor (no special access)',
    role: 'none',
    blurb: 'Your first contributions, made from public forks — no special access needed.',
    grants: [
      'Fork public repositories and open pull requests',
      'Comment on issues and pull requests',
      'No write access to FFC repositories',
    ],
    criteria: [
      'At least one merged pull request in your commit history',
      'Followed the code of conduct and contribution guidelines',
    ],
    ladderAlignment: 'Contributor',
    icon: '✨',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    id: 2,
    name: 'Crew',
    githubRole: 'Read (organization member)',
    role: 'read',
    blurb: 'Welcomed into the org as a member with read access across FFC repositories.',
    grants: [
      'Read and clone organization repositories',
      'Be @-mentioned and added to teams',
      'Open issues and pull requests from branches',
    ],
    criteria: [
      'A few merged contributions evidenced in commit history',
      'Board/maintainer confirmation you are an active volunteer',
    ],
    ladderAlignment: 'Contributor → Unpaid Intern',
    icon: '🧭',
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    id: 3,
    name: 'Trusted Crew',
    githubRole: 'Triage',
    role: 'triage',
    blurb: 'Trusted to help manage the backlog and keep contributions moving.',
    grants: [
      'Everything Read grants, plus:',
      'Label, assign, and close issues and pull requests',
      'Request pull-request reviews and apply milestones',
    ],
    criteria: [
      'Sustained, reviewed contributions in commit history',
      'Demonstrated good judgement triaging others’ work',
      'Board/maintainer certification',
    ],
    ladderAlignment: 'Unpaid Intern',
    icon: '🛟',
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    id: 4,
    name: 'Builder',
    githubRole: 'Write',
    role: 'write',
    blurb: 'Ships directly: pushes branches and merges reviewed work.',
    grants: [
      'Everything Triage grants, plus:',
      'Push to branches and merge approved pull requests',
      'Manage releases and edit repository wikis',
    ],
    criteria: [
      'A solid body of merged work in commit history',
      'Relevant certification (MS-900, GitHub Foundations, Canva, GA4, or Workspace)',
      'Board/maintainer certification',
    ],
    ladderAlignment: 'Paid Intern',
    icon: '🔧',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 5,
    name: 'Steward',
    githubRole: 'Maintain',
    role: 'maintain',
    blurb: 'Maintains repositories and guides the next generation of contributors.',
    grants: [
      'Everything Write grants, plus:',
      'Manage repository settings (except destructive/admin actions)',
      'Manage branch protection and repository topics',
    ],
    criteria: [
      'A long, consistent contribution history',
      'Mentored other contributors through their growth',
      'Board/maintainer certification',
    ],
    ladderAlignment: 'Mentor',
    icon: '🌳',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    id: 6,
    name: 'Captain',
    githubRole: 'Admin',
    role: 'admin',
    blurb: 'Owns the platform: full administrative authority across the organization.',
    grants: [
      'Everything Maintain grants, plus:',
      'Full repository administration and team management',
      'Manage organization members, roles, and security policy',
    ],
    criteria: [
      'Demonstrated excellence as a Steward over time',
      'Trusted with organization-wide administration',
      'Board certification',
    ],
    ladderAlignment: 'Maintainer',
    icon: '⚓',
    gradient: 'from-rose-500 to-red-600',
  },
]

export interface RecognizedVolunteer {
  name: string
  /** GitHub handle, used to point at commit-history evidence. */
  githubHandle?: string
  /** Only rendered publicly when true (opt-in). */
  publicOptIn: boolean
  /** Highest RecognitionTier id reached. */
  tierId: number
  /** Volunteer role badges earned (matches the volunteer-roles taxonomy). */
  roles: string[]
  /** First recognized, as YYYY-MM (drives the rolling aggregate). */
  since: string
}

/**
 * Recognized volunteers (maintainer-curated; manual validation only).
 *
 * Seeded with the FFC founder. Maintainers append new, board-certified
 * volunteers here as they are recognized — set `publicOptIn: false` to count a
 * volunteer in the aggregate without listing their name publicly.
 */
export const RECOGNIZED_VOLUNTEERS: RecognizedVolunteer[] = [
  {
    name: 'Clarke Moyer',
    githubHandle: 'clarkemoyer',
    publicOptIn: true,
    tierId: 6,
    roles: ['Global Administrator'],
    since: '2013-01',
  },
]

export function getTier(id: number): RecognitionTier | undefined {
  return RECOGNITION_TIERS.find((t) => t.id === id)
}

/** Volunteers who opted in to public display, highest tier first. */
export function publicVolunteers(): RecognizedVolunteer[] {
  return RECOGNIZED_VOLUNTEERS.filter((v) => v.publicOptIn).sort((a, b) => b.tierId - a.tierId)
}

export interface RecognitionAggregate {
  lifetime: number
  thisYear: number
  thisMonth: number
  /** Recognized-volunteer count per calendar year, ascending by year. */
  byYear: { year: string; count: number }[]
}

/**
 * Always-rolling aggregate for annual reports. Counts every recognized
 * volunteer (opt-in or not); designed so month/year/lifetime slices can be
 * broken down further later.
 */
export function recognitionAggregate(now: Date = new Date()): RecognitionAggregate {
  // Derive the slice from the UTC date so results don't depend on the runtime
  // timezone (build server / test runner) around month/year boundaries.
  const iso = now.toISOString() // YYYY-MM-DDTHH:mm:ss.sssZ
  const year = iso.slice(0, 4)
  const month = iso.slice(0, 7)

  const byYearMap = new Map<string, number>()
  for (const v of RECOGNIZED_VOLUNTEERS) {
    const y = v.since.slice(0, 4)
    byYearMap.set(y, (byYearMap.get(y) ?? 0) + 1)
  }

  return {
    lifetime: RECOGNIZED_VOLUNTEERS.length,
    thisYear: RECOGNIZED_VOLUNTEERS.filter((v) => v.since.startsWith(year)).length,
    thisMonth: RECOGNIZED_VOLUNTEERS.filter((v) => v.since === month).length,
    byYear: [...byYearMap.entries()]
      .map(([y, count]) => ({ year: y, count }))
      .sort((a, b) => a.year.localeCompare(b.year)),
  }
}
