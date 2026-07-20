#!/usr/bin/env node
/**
 * Create charity-intake stub issues from the PII-safe applications feed
 * published by the repo that owns the WHMCS/Zeffy flows
 * (FreeForCharity/FFC-Cloudflare-Automation).
 *
 * This is the *published-feed* intake path. The repo also supports a *local*
 * intake path (`whmcs-applications.mjs`) that queries WHMCS directly with
 * credentials from Azure Key Vault; both share the issue/dedup plumbing in
 * `lib/intake-issues.mjs`, so whichever source runs, intake issues are
 * identical and dedup against the same state.
 *
 * Approval-gated like the WHMCS path: only feed records explicitly marked with
 * a post-approval status create NEW issues (see APPROVED_STATUSES below), and
 * the same flood-guard cutover date applies. Everything else is refresh-only.
 *
 * Auth: built-in GITHUB_TOKEN (to create issues) — no Zeffy/WHMCS secret here.
 * Graceful: a missing/unpublished feed (404) or empty list is a no-op.
 *
 * Run: node scripts/sync-applications.mjs
 */
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { syncIntakeIssues, errMsg, DEFAULT_CREATE_NEW_SINCE } from './lib/intake-issues.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, '..', 'automation', 'applications-sync-state.json')

const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const feedUrl =
  process.env.APPLICATIONS_SRC_URL ||
  'https://raw.githubusercontent.com/FreeForCharity/FFC-Cloudflare-Automation/main/applications/applications.json'

async function fetchApplications() {
  const res = await fetch(feedUrl, { headers: { Accept: 'application/json' } })
  if (res.status === 404) {
    console.warn(`Applications feed not published yet (${feedUrl}); nothing to do.`)
    return []
  }
  if (!res.ok) throw new Error(`applications feed -> ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : Array.isArray(data?.applications) ? data.applications : []
}

// APPROVAL GATE (same model as the local WHMCS path): a GitHub issue is a
// website-provisioning work order created only for APPROVED charities. Feed
// records carrying one of these post-approval lifecycle statuses may create a
// new issue; records with a pre-approval status (intake / needs-info) — or no
// status at all, which this feed cannot prove approved — are refresh-only:
// their existing issues keep being updated, but no new issue is ever created
// from this path for them.
const APPROVED_STATUSES = new Set([
  'needs-admin',
  'on-hold',
  'sponsored',
  'active-build',
  'live',
  'graduated',
])

async function main() {
  let applications = []
  try {
    applications = await fetchApplications()
  } catch (err) {
    console.warn(`Applications fetch failed: ${errMsg(err)}. Leaving state unchanged.`)
    return
  }
  await syncIntakeIssues({
    applications,
    repo,
    token,
    stateFile: STATE_FILE,
    source: 'feed',
    // Same flood-guard cutover as the WHMCS path: never first-time-create
    // issues for feed records whose application predates the work-order model.
    createNewSince: process.env.WHMCS_INTAKE_SINCE || DEFAULT_CREATE_NEW_SINCE,
    // Approval gate: only records the feed explicitly marks with a
    // post-approval status may create NEW issues (see APPROVED_STATUSES).
    allowCreate: (app) => APPROVED_STATUSES.has(String(app?.status ?? '')),
  })
}

main().catch((err) => {
  console.warn(`Applications sync skipped: ${errMsg(err)}`)
})
