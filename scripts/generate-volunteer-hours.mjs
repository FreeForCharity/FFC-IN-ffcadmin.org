#!/usr/bin/env node
/**
 * Generate public/data/volunteer-hours.json (#361/#362).
 *
 * GitHub-as-data hours backend: reads issues labelled `volunteer-hours` +
 * `approved` (program-lead certification), parses the Volunteer-hours Issue Form
 * into HoursEntry records (see src/data/hours-model.ts and
 * docs/hours-evidence-model.md), and writes a committed JSON log of record +
 * per-channel totals for the static site (#337 pattern).
 *
 * Auth: the workflow's built-in GITHUB_TOKEN (no extra secret). Exits 0 on
 * no-token/network failure so the pipeline degrades gracefully.
 */
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'data', 'volunteer-hours.json')

const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

const CHANNELS = ['education', 'teaching', 'work']
const ACTIVITY_TYPES = [
  'pull_request',
  'commit',
  'issue',
  'review',
  'design',
  'admin',
  'meeting',
  'mentoring',
  'training-received',
  'training-delivered',
  'other',
]

/** Mirror of makeDedupKey() in src/data/hours-model.ts. */
function makeDedupKey({ githubHandle, volunteer, date, activityType, evidenceUrl }) {
  return [githubHandle || volunteer, date, activityType, evidenceUrl || ''].join('|').toLowerCase()
}

async function ghJson(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`)
  return res.json()
}

/**
 * Parse a GitHub Issue Form body. Fields render as `### Label\n\nvalue`.
 * Returns a map of lowercased label -> value.
 */
function parseIssueForm(body) {
  const fields = {}
  if (!body) return fields
  const blocks = body.split(/\r?\n###\s+/)
  for (const block of blocks) {
    const nl = block.indexOf('\n')
    if (nl === -1) continue
    const label = block.slice(0, nl).trim().toLowerCase()
    const value = block
      .slice(nl + 1)
      .trim()
      .replace(/^###\s+/, '')
    if (label) fields[label] = value === '_No response_' ? '' : value
  }
  return fields
}

function toEntry(issue) {
  const f = parseIssueForm(issue.body)
  const volunteer = f['volunteer name'] || 'Unknown'
  const githubHandle = (f['github handle'] || '').replace(/^@/, '') || undefined
  const date = f['date (yyyy-mm-dd)'] || ''
  let activityType = (f['activity type'] || 'other').toLowerCase()
  if (!ACTIVITY_TYPES.includes(activityType)) activityType = 'other'
  let channel = (f['credit channel'] || 'work').toLowerCase()
  if (!CHANNELS.includes(channel)) channel = 'work'
  const rawHours = Number.parseFloat(f['hours']) || 0
  const evidenceUrl = f['evidence link (optional)'] || undefined
  const domainRelevant =
    (f["relevant to your certification's profession/domain?"] || 'no') === 'yes'
  const approver = issue.assignee?.login || 'FFC Program Lead'

  return {
    id: `issue-${issue.number}`,
    volunteer,
    githubHandle,
    date,
    activityType,
    activity: f['what you did'] || issue.title,
    channel,
    rawHours,
    source: 'self-log',
    evidenceUrl,
    domainRelevant,
    dedupKey: makeDedupKey({ githubHandle, volunteer, date, activityType, evidenceUrl }),
    approver,
    status: 'approved',
  }
}

function summarize(entries) {
  const totals = { education: 0, teaching: 0, work: 0 }
  const seen = new Set()
  let approvedCount = 0
  for (const e of entries) {
    const key = e.dedupKey.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    approvedCount++
    totals[e.channel] += e.rawHours
  }
  return { approvedCount, byChannel: totals }
}

async function main() {
  if (!token) {
    console.warn('No GITHUB_TOKEN; leaving volunteer-hours.json unchanged.')
    return
  }

  let entries = []
  try {
    // Approved, certified hours issues only.
    const issues = await ghJson(
      `/repos/${repo}/issues?state=all&labels=volunteer-hours,approved&per_page=100`
    )
    entries = (issues || [])
      .filter((i) => !i.pull_request)
      .map(toEntry)
      .filter((e) => e.date && e.rawHours > 0)
  } catch (err) {
    console.warn(`Hours ingest failed: ${err.message}`)
  }

  const out = {
    generatedAt: new Date().toISOString(),
    seed: false,
    source: 'github-issues',
    summary: summarize(entries),
    entries,
  }
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
  console.log(`Wrote ${OUT} (${entries.length} approved entries)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(0)
})
