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
 * Auth: built-in GITHUB_TOKEN (to create issues) — no Zeffy/WHMCS secret here.
 * Graceful: a missing/unpublished feed (404) or empty list is a no-op.
 *
 * Run: node scripts/sync-applications.mjs
 */
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { syncIntakeIssues, errMsg } from './lib/intake-issues.mjs'

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
  })
}

main().catch((err) => {
  console.warn(`Applications sync skipped: ${errMsg(err)}`)
})
