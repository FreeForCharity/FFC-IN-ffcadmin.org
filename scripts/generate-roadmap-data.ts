#!/usr/bin/env tsx
/**
 * Generate public/data/roadmap.json from this repo's `kind:intake` issues.
 *
 * GitHub-as-data: reads open + recently-closed intake issues, parses each
 * issue-form body into computable IntakeData, computes the readiness score via
 * the shared engine (single source of truth), and writes the roadmap snapshot
 * the static `/roadmap` page reads at build time.
 *
 * Auth: the workflow's built-in GITHUB_TOKEN (no extra secret). Exits 0 on
 * no-token / network failure, leaving the committed JSON untouched — same
 * graceful-degradation contract as scripts/generate-volunteer-hours.mjs.
 *
 * Run: pnpm data:roadmap
 */
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { computeReadiness } from '../src/lib/readiness/scoring'
import { parseIntakeIssue } from '../src/lib/readiness/parseIntake'
import type {
  RoadmapData,
  RoadmapEntry,
  RoadmapStatus,
  RoadmapSponsor,
} from '../src/app/roadmap/roadmapData'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'data', 'roadmap.json')

const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

interface GhUser {
  login: string
  avatar_url: string
  html_url: string
}
interface GhIssue {
  number: number
  title: string
  body: string | null
  html_url: string
  state: string
  created_at: string
  updated_at: string
  labels: { name: string }[]
  assignee: GhUser | null
  reactions?: { '+1'?: number }
  pull_request?: unknown
}

async function ghJson<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`)
  return res.json() as Promise<T>
}

// Lifecycle order, least to most advanced. If an issue carries more than one
// `status:*` label, the most-advanced one wins (rather than whichever happens
// to be listed first) so a sponsored/live issue is never misclassified.
const STATUS_ORDER: RoadmapStatus[] = [
  'intake',
  'needs-info',
  'needs-admin',
  'on-hold',
  'sponsored',
  'active-build',
  'live',
  'graduated',
]

/** Map the `status:*` label(s) (and a couple of fallbacks) to a lifecycle status. */
function statusFor(issue: GhIssue): RoadmapStatus {
  const names = issue.labels.map((l) => l.name)
  const found = names
    .filter((n) => n.startsWith('status:'))
    .map((n) => n.slice('status:'.length))
    .filter((s): s is RoadmapStatus => (STATUS_ORDER as string[]).includes(s))
  if (found.length > 0) {
    return found.reduce((best, s) =>
      STATUS_ORDER.indexOf(s) > STATUS_ORDER.indexOf(best) ? s : best
    )
  }
  if (names.includes('needs-info')) return 'needs-info'
  // Closing an issue doesn't reliably mean the site launched (could be
  // rejected/duplicate/abandoned), so we rely on explicit status:* labels only.
  return 'intake'
}

/**
 * Extract the live site URL only when explicitly marked (e.g. "Live site: …"),
 * so unrelated links in the body (GuideStar, LinkedIn, etc.) are never mistaken
 * for the charity's site.
 */
function liveUrlFrom(body: string | null): string | undefined {
  if (!body) return undefined
  const match = body.match(/^[ \t>*-]*live\s*(?:site|url)\s*[:：]\s*(https?:\/\/\S+)/im)
  return match ? match[1] : undefined
}

function toEntry(issue: GhIssue): RoadmapEntry {
  const parsed = parseIntakeIssue(issue.body ?? '')
  const readiness = computeReadiness(parsed.intake)
  const sponsor: RoadmapSponsor | null = issue.assignee
    ? {
        handle: issue.assignee.login,
        avatarUrl: issue.assignee.avatar_url,
        profileUrl: issue.assignee.html_url,
      }
    : null
  const status = statusFor(issue)
  return {
    issueNumber: issue.number,
    charityName: parsed.charityName || issue.title,
    missionExcerpt: parsed.missionExcerpt,
    status,
    charityStage: parsed.intake.charityStage,
    missionCategory: parsed.intake.missionCategory,
    serviceTier: parsed.serviceTier,
    readinessScore: readiness.score,
    readinessTier: readiness.tier,
    submittedAt: issue.created_at,
    updatedAt: issue.updated_at,
    sponsor,
    plusOne: issue.reactions?.['+1'] ?? 0,
    issueUrl: issue.html_url,
    ...(status === 'live' ? { liveUrl: liveUrlFrom(issue.body) } : {}),
  }
}

async function main() {
  if (!token) {
    console.warn('No GITHUB_TOKEN; leaving roadmap.json unchanged.')
    return
  }
  const issues: GhIssue[] = []
  for (let page = 1; page <= 10; page++) {
    const batch = await ghJson<GhIssue[]>(
      `/repos/${repo}/issues?labels=kind:intake&state=all&per_page=100&page=${page}`
    )
    if (batch.length === 0) break
    issues.push(...batch.filter((i) => !i.pull_request))
    if (batch.length < 100) break
  }

  const entries = issues
    // A closed issue only belongs on the roadmap if it reached a terminal,
    // explicitly-labelled status. Closed-as-rejected/duplicate/abandoned drops off.
    .filter((i) => i.state !== 'closed' || ['live', 'graduated'].includes(statusFor(i)))
    .map(toEntry)
  const data: RoadmapData = {
    generatedAt: new Date().toISOString(),
    source: `github:${repo}`,
    entries,
  }
  writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`Wrote ${entries.length} roadmap entries to ${OUT}`)
}

main().catch((err) => {
  // Degrade gracefully: never fail the pipeline over a transient API error.
  console.warn(`Roadmap generation skipped: ${err instanceof Error ? err.message : String(err)}`)
})
