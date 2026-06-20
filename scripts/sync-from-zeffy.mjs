#!/usr/bin/env node
/**
 * Pre-stub intake from Zeffy (program plan §5 step 3, §12).
 *
 * Polls Zeffy's read-only Contacts API and, for each new contact with no
 * matching GitHub issue, opens a stub `kind:intake` issue with the structured
 * template for the charity to complete. This is why a charity appears on the
 * public roadmap as soon as it submits to Zeffy.
 *
 * PII: dedup uses a one-way fingerprint (Zeffy contact id when present, else a
 * SHA-256 of the email) — never the raw email. The stub issue body contains no
 * email, only the org name and a non-PII fingerprint marker for idempotency.
 * Sync state lives OUTSIDE the web-served `public/` folder so it is never
 * published by the static site.
 *
 * GUARDED: requires ZEFFY_API_KEY. With no key (the default today, since Zeffy
 * access is a Clarke prerequisite) it logs and exits 0 — the workflow stays
 * green and activates automatically once the secret is added.
 *
 * The Zeffy API is read-only Beta; endpoint/shape may need adjustment when the
 * key is provisioned. Anything unexpected degrades to a no-op.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createHash } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Back-office state — deliberately NOT under public/ (would be web-served).
const STATE_FILE = join(__dirname, '..', 'automation', 'zeffy-sync-state.json')
const FINGERPRINT_PREFIX = 'ffc-intake-fingerprint'

const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const zeffyKey = process.env.ZEFFY_API_KEY
const zeffyBase = process.env.ZEFFY_API_BASE || 'https://api.zeffy.com'

function loadState() {
  if (!existsSync(STATE_FILE)) return { lastSyncedAt: null, seenFingerprints: [] }
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'))
  } catch {
    return { lastSyncedAt: null, seenFingerprints: [] }
  }
}

/** Non-PII, stable id for a contact: Zeffy id if available, else hashed email. */
function fingerprintFor(contact) {
  if (contact.id) return `id:${contact.id}`
  const email = (contact.email || '').trim().toLowerCase()
  if (!email) return ''
  return `sha256:${createHash('sha256').update(email).digest('hex')}`
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

/** Idempotency across state resets: look for the fingerprint marker in a body. */
async function issueExistsForFingerprint(fingerprint) {
  const q = encodeURIComponent(
    `repo:${repo} is:issue label:kind:intake in:body "${FINGERPRINT_PREFIX}: ${fingerprint}"`
  )
  const result = await gh(`/search/issues?q=${q}`)
  return (result.total_count ?? 0) > 0
}

function stubBody(contact, fingerprint) {
  const name = contact.organizationName || contact.fullName || 'your charity'
  return [
    `_Auto-created from a Zeffy submission for **${name}**._`,
    '',
    'Welcome to Free For Charity! Please complete your structured intake by editing this issue',
    'with the [charity intake form](https://github.com/' +
      repo +
      '/issues/new?template=charity-intake.yml),',
    'or reply here and an FFC admin will help. Your charity already appears on the',
    '[public roadmap](https://ffcadmin.org/roadmap) — completing intake raises your readiness score.',
    '',
    'Not comfortable with GitHub? Text **520-222-8104**.',
    '',
    `<!-- ${FINGERPRINT_PREFIX}: ${fingerprint} -->`,
  ].join('\n')
}

function writeState(seen) {
  mkdirSync(dirname(STATE_FILE), { recursive: true })
  writeFileSync(
    STATE_FILE,
    `${JSON.stringify({ lastSyncedAt: new Date().toISOString(), seenFingerprints: [...seen].sort() }, null, 2)}\n`
  )
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
  const seen = new Set(state.seenFingerprints || [])
  let contacts = []
  try {
    contacts = await zeffyContacts()
  } catch (err) {
    console.warn(`Zeffy fetch failed: ${err.message}. Leaving state unchanged.`)
    return
  }

  let created = 0
  let changed = false
  for (const contact of contacts) {
    const fingerprint = fingerprintFor(contact)
    if (!fingerprint || seen.has(fingerprint)) continue
    try {
      if (await issueExistsForFingerprint(fingerprint)) {
        seen.add(fingerprint)
        changed = true
        continue
      }
      await gh(`/repos/${repo}/issues`, {
        method: 'POST',
        body: JSON.stringify({
          title: `[Intake] ${contact.organizationName || contact.fullName || 'New charity'}`,
          body: stubBody(contact, fingerprint),
          labels: ['kind:intake', 'status:intake'],
        }),
      })
      seen.add(fingerprint)
      changed = true
      created++
    } catch (err) {
      console.warn(`Skipping a contact: ${err.message}`)
    }
  }

  // Only persist (and therefore open a PR) when something materially changed,
  // so scheduled runs with no new contacts produce no PR churn.
  if (changed) {
    writeState(seen)
    console.log(`Zeffy sync: ${created} stub issue(s) created; state updated.`)
  } else {
    console.log('Zeffy sync: no new contacts; state unchanged.')
  }
}

main().catch((err) => {
  console.warn(`Zeffy sync skipped: ${err instanceof Error ? err.message : String(err)}`)
})
