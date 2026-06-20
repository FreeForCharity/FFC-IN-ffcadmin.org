#!/usr/bin/env node
/**
 * Pre-stub intake from Zeffy (program plan §5 step 3, §12).
 *
 * Polls Zeffy's read-only Contacts API for new contacts and, for each one with
 * no matching GitHub issue, opens a stub `kind:intake` issue pre-seeded with the
 * Zeffy data and the structured template for the charity to complete. This is
 * why a charity appears on the public roadmap as soon as it submits to Zeffy.
 *
 * GUARDED: requires ZEFFY_API_KEY. With no key (the default today, since Zeffy
 * access is a Clarke prerequisite) it logs and exits 0 — the workflow stays
 * green and activates automatically once the secret is added.
 *
 * The Zeffy API is read-only Beta; endpoint/shape may need adjustment when the
 * key is provisioned. Anything unexpected degrades to a no-op rather than
 * failing the run.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(__dirname, '..', 'public', 'data', 'zeffy-sync-state.json')

const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const zeffyKey = process.env.ZEFFY_API_KEY
const zeffyBase = process.env.ZEFFY_API_BASE || 'https://api.zeffy.com'

function loadState() {
  if (!existsSync(STATE_FILE)) return { lastSyncedAt: null, seenEmails: [] }
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'))
  } catch {
    return { lastSyncedAt: null, seenEmails: [] }
  }
}

async function zeffyContacts() {
  const res = await fetch(`${zeffyBase}/v1/contacts`, {
    headers: { Authorization: `Bearer ${zeffyKey}`, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Zeffy API contacts -> ${res.status}`)
  const data = await res.json()
  // Be tolerant of shape: accept {data:[...]} or a bare array.
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
}

async function gh(path, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      Authorization: `Bearer ${ghToken}`,
      ...(init.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`GitHub API ${path} -> ${res.status}`)
  return res.json()
}

async function issueExistsForEmail(email) {
  const q = encodeURIComponent(`repo:${repo} is:issue label:kind:intake in:body "${email}"`)
  const result = await gh(`/search/issues?q=${q}`)
  return (result.total_count ?? 0) > 0
}

function stubBody(contact) {
  const name = contact.organizationName || contact.fullName || 'your charity'
  return [
    `_Auto-created from a Zeffy submission for **${name}** (${contact.email})._`,
    '',
    'Welcome to Free For Charity! Please complete your structured intake by editing this issue',
    'with the [charity intake form](https://github.com/' +
      repo +
      '/issues/new?template=charity-intake.yml),',
    'or reply here and an FFC admin will help. Your charity already appears on the',
    '[public roadmap](https://ffcadmin.org/roadmap) — completing intake raises your readiness score.',
    '',
    'Not comfortable with GitHub? Text **520-222-8104**.',
  ].join('\n')
}

async function main() {
  if (!zeffyKey) {
    console.warn('No ZEFFY_API_KEY; Zeffy sync skipped (prerequisite not yet provisioned).')
    return
  }
  if (!ghToken) {
    console.warn('No GITHUB_TOKEN; cannot create issues. Skipping.')
    return
  }

  const state = loadState()
  const seen = new Set(state.seenEmails || [])
  let contacts = []
  try {
    contacts = await zeffyContacts()
  } catch (err) {
    console.warn(`Zeffy fetch failed: ${err.message}. Leaving state unchanged.`)
    return
  }

  let created = 0
  for (const contact of contacts) {
    const email = (contact.email || '').toLowerCase()
    if (!email || seen.has(email)) continue
    try {
      if (await issueExistsForEmail(email)) {
        seen.add(email)
        continue
      }
      await gh(`/repos/${repo}/issues`, {
        method: 'POST',
        body: JSON.stringify({
          title: `[Intake] ${contact.organizationName || contact.fullName || email}`,
          body: stubBody(contact),
          labels: ['kind:intake', 'status:intake', 'needs-info'],
        }),
      })
      seen.add(email)
      created++
    } catch (err) {
      console.warn(`Skipping ${email}: ${err.message}`)
    }
  }

  writeFileSync(
    STATE_FILE,
    `${JSON.stringify({ lastSyncedAt: new Date().toISOString(), seenEmails: [...seen] }, null, 2)}\n`
  )
  console.log(`Zeffy sync complete: ${created} stub issue(s) created.`)
}

main().catch((err) => {
  console.warn(`Zeffy sync skipped: ${err instanceof Error ? err.message : String(err)}`)
})
