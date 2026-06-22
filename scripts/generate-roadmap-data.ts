#!/usr/bin/env tsx
/**
 * Generate public/data/roadmap.json — the snapshot the static /roadmap page
 * reads at build time. Two real sources are merged:
 *
 *   1. The live FFC portfolio from docs/sites_list.csv → "Launched charities"
 *      entries (real domains/links). These show "readiness pending" because the
 *      CSV doesn't carry the intake fields needed to score them honestly; they
 *      gain a real score once the charity completes structured intake.
 *   2. This repo's `kind:intake` issues → scored pipeline entries via the shared
 *      readiness engine (single source of truth).
 *
 * FFC's own listing is added with its documented self-score.
 *
 * Auth: the built-in GITHUB_TOKEN (no extra secret) — only needed for source 2.
 * With no token it still writes the real portfolio. Network errors degrade to a
 * no-op rather than failing the run.
 *
 * Run: pnpm data:roadmap
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { parse as parseCsv } from 'csv-parse/sync'
import { computeReadiness } from '../src/lib/readiness/scoring'
import { emptyIntake } from '../src/lib/readiness/defaults'
import { parseIntakeIssue } from '../src/lib/readiness/parseIntake'
import type {
  RoadmapData,
  RoadmapEntry,
  RoadmapStatus,
  RoadmapSponsor,
} from '../src/app/roadmap/roadmapData'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'data', 'roadmap.json')
const SITES_CSV = join(__dirname, '..', 'docs', 'sites_list.csv')

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

interface SiteRow {
  Domain?: string
  Section?: string
  Status?: string
  'Site Health'?: string
  'Left FFC'?: string
  'Is Staging'?: string
  'Repo URL'?: string
}

// Statuses that mean a domain is no longer an active FFC charity site.
const EXCLUDED_STATUS = new Set(['transferred away', 'expired', 'fraud', 'cancelled', 'pending'])

/**
 * A live charity site to list: healthy, not staging, not departed, not a
 * for-profit, and not in a terminal/abandoned status. Uses the CSV's own
 * Section/Status signals rather than guessing, so for-profit and dead domains
 * never appear on the public charity roadmap.
 */
function isLivePortfolioSite(r: SiteRow): boolean {
  const domain = (r.Domain || '').trim()
  if (!domain) return false
  if (!/live/i.test(r['Site Health'] || '')) return false
  if ((r['Left FFC'] || '').trim()) return false
  if (/^(yes|true)$/i.test((r['Is Staging'] || '').trim())) return false
  if (/for-?profit/i.test(r.Section || '')) return false
  if (EXCLUDED_STATUS.has((r.Status || '').trim().toLowerCase())) return false
  return true
}

/** FFC's own documented self-listing (program plan §16: ~Mature). */
function ffcSelfEntry(): RoadmapEntry {
  const readiness = computeReadiness(
    emptyIntake({
      missionCategory: 'general',
      charityStage: '501c3',
      revenueForm: '990-n',
      trajectory: 'remain-small',
      fundingModel: 'donations-only',
      contacts: {
        orgMain: { present: true, phoneType: 'org-specific', emailType: 'org-domain' },
        president: { present: true, phoneType: 'personal-cell', emailType: 'org-domain' },
        secretary: { present: true, phoneType: 'personal-cell', emailType: 'org-domain' },
        treasurer: { present: true, phoneType: 'org-specific', emailType: 'org-domain' },
        vicePresident: { present: true, phoneType: 'personal-cell', emailType: 'org-domain' },
        memberAtLarge: { present: true, phoneType: 'personal-cell', emailType: 'org-domain' },
      },
      board: {
        president: { present: true, named: true, linkedin: true },
        secretary: { present: true, named: true, linkedin: true },
        treasurer: { present: true, named: true, linkedin: true },
        vicePresident: { present: true, named: true, linkedin: true },
        memberAtLarge: { present: true, named: true, linkedin: true },
      },
      address: { type: 'registered-agent', additionalRaStates: 2, hasOfficeAndRa: true },
      candid: { profileUrl: true, directLink: true, seal: 'platinum' },
      documents: {
        articlesOfIncorporation: true,
        bylaws: true,
        solicitationRegistrations: 1,
        brandAssets: true,
      },
      integrations: ['Zeffy', 'Idealist', 'Taproot', 'VolunteerMatch', 'Charity Navigator'],
      policyPages: [
        'Donation Policy',
        'Privacy Policy',
        'Terms of Service',
        'Vulnerability Disclosure Policy',
        'Security Acknowledgement',
      ],
      existingWebsite: 'functional',
    })
  )
  return {
    issueNumber: 0,
    charityName: 'Free For Charity',
    missionExcerpt: 'Free websites and domain management for small US 501(c)(3) charities.',
    status: 'live',
    charityStage: '501c3',
    missionCategory: 'general',
    serviceTier: 'Tier 3 — Site build',
    readinessScore: readiness.score,
    readinessTier: readiness.tier,
    submittedAt: '',
    updatedAt: '',
    sponsor: null,
    plusOne: 0,
    issueUrl: 'https://github.com/FreeForCharity',
    liveUrl: 'https://freeforcharity.org',
  }
}

/**
 * Build the live portfolio from sites_list.csv. Readiness is null ("pending
 * intake") — the CSV lacks the fields to score a charity honestly; an entry
 * gains a real score once its intake is completed. charityStage/missionCategory
 * are placeholders the card hides for unscored entries.
 */
function buildPortfolio(): RoadmapEntry[] {
  let rows: SiteRow[] = []
  try {
    rows = parseCsv(readFileSync(SITES_CSV, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as SiteRow[]
  } catch (err) {
    console.warn(`Could not read ${SITES_CSV}: ${err instanceof Error ? err.message : err}`)
    return []
  }
  return rows
    .filter(isLivePortfolioSite)
    .map((r) =>
      (r.Domain || '')
        .trim()
        .toLowerCase()
        .replace(/^www\./, '')
    )
    .filter((domain) => domain !== 'freeforcharity.org') // FFC added explicitly, scored
    .map((domain) => ({
      issueNumber: 0,
      charityName: domain,
      missionExcerpt: '',
      status: 'live' as RoadmapStatus,
      charityStage: '501c3' as const,
      missionCategory: 'general' as const,
      serviceTier: 'Live site',
      readinessScore: null,
      readinessTier: null,
      submittedAt: '',
      updatedAt: '',
      sponsor: null,
      plusOne: 0,
      issueUrl: `https://${domain}`,
      liveUrl: `https://${domain}`,
    }))
}

async function fetchIntakeEntries(): Promise<RoadmapEntry[]> {
  if (!token) {
    console.warn('No GITHUB_TOKEN; building roadmap from the live portfolio only.')
    return []
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
  return (
    issues
      // A closed issue only belongs on the roadmap if it reached a terminal,
      // explicitly-labelled status. Closed-as-rejected/duplicate/abandoned drops off.
      .filter((i) => i.state !== 'closed' || ['live', 'graduated'].includes(statusFor(i)))
      .map(toEntry)
  )
}

async function main() {
  const intake = await fetchIntakeEntries()
  // Domains already represented by a (scored) intake issue shouldn't be
  // duplicated by the portfolio.
  const intakeDomains = new Set(
    intake.map((e) => (e.liveUrl || '').replace(/^https?:\/\//, '').replace(/\/$/, ''))
  )
  const portfolio = buildPortfolio().filter((e) => !intakeDomains.has(e.charityName))

  const entries = [ffcSelfEntry(), ...intake, ...portfolio]

  // Only rewrite when the entries actually changed, so a volatile generatedAt
  // timestamp doesn't open a PR on every scheduled run (no-churn contract).
  let previous: RoadmapData | null = null
  try {
    previous = JSON.parse(readFileSync(OUT, 'utf8')) as RoadmapData
  } catch {
    previous = null
  }
  if (previous && JSON.stringify(previous.entries) === JSON.stringify(entries)) {
    console.log('Roadmap entries unchanged; leaving roadmap.json as-is.')
    return
  }

  const data: RoadmapData = {
    generatedAt: new Date().toISOString(),
    source: token ? `github:${repo}+sites_list` : 'sites_list',
    entries,
  }
  writeFileSync(OUT, `${JSON.stringify(data, null, 2)}\n`)
  console.log(
    `Wrote ${entries.length} roadmap entries (${intake.length} intake, ${portfolio.length} portfolio) to ${OUT}`
  )
}

main().catch((err) => {
  // Degrade gracefully: never fail the pipeline over a transient API error.
  console.warn(`Roadmap generation skipped: ${err instanceof Error ? err.message : String(err)}`)
})
