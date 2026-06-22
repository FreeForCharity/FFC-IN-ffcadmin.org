#!/usr/bin/env node
/**
 * Pre-stub intake from Zeffy (program plan §5 step 3, §12).
 *
 * PRODUCT-GATED: Zeffy contacts include everyone in the CRM (donors, members,
 * newsletter signups) — most are NOT charity applicants. We therefore only
 * create intake stubs for contacts who submitted a configured application
 * product/campaign (the "FFC Charity Application & Verification" form). The
 * gate is ZEFFY_INTAKE_CAMPAIGN_IDS (comma-separated Zeffy campaign ids). With
 * no campaign ids configured the script does nothing — it never stubs every
 * contact.
 *
 * For each new applicant with no matching GitHub issue, it opens a stub
 * `kind:intake` issue with the structured template to complete, so the charity
 * appears on the public roadmap as soon as it applies.
 *
 * PII: dedup uses a one-way fingerprint (Zeffy contact id when present, else a
 * keyed HMAC-SHA256 of the email using a secret salt) — never the raw email,
 * and not a bare hash that could be brute-forced. The stub issue body contains
 * no email, only the org name and a non-PII fingerprint marker for idempotency.
 * Sync state lives OUTSIDE the web-served `public/` folder.
 *
 * GUARDED: requires ZEFFY_API_KEY and ZEFFY_INTAKE_CAMPAIGN_IDS. Missing either
 * → logs and exits 0, so the once-a-day scheduled run stays green and activates
 * automatically once both are set.
 *
 * The Zeffy API is read-only Beta; endpoint/shape may need adjustment when the
 * key is provisioned. Anything unexpected degrades to a no-op.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createHmac } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Back-office state — deliberately NOT under public/ (would be web-served).
const STATE_FILE = join(__dirname, '..', 'automation', 'zeffy-sync-state.json')
const FINGERPRINT_PREFIX = 'ffc-intake-fingerprint'

const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const zeffyKey = process.env.ZEFFY_API_KEY
const zeffyBase = process.env.ZEFFY_API_BASE || 'https://api.zeffy.com'
// Product gate: only these campaign/product ids count as charity applications.
const intakeCampaignIds = new Set(
  (process.env.ZEFFY_INTAKE_CAMPAIGN_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
)

function loadState() {
  if (!existsSync(STATE_FILE)) return { lastSyncedAt: null, seenFingerprints: [] }
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'))
  } catch {
    return { lastSyncedAt: null, seenFingerprints: [] }
  }
}

// Secret salt for email fingerprints. A bare SHA-256 of an email is
// brute-forceable (email keyspace is small), so we use a keyed HMAC instead.
// The salt never leaves CI; without it the committed fingerprints can't be
// reversed or matched against a guessed email. Falls back to the Zeffy API key
// (also a secret, always present when this script runs) if no dedicated salt.
const fingerprintSalt = process.env.ZEFFY_FINGERPRINT_SALT || zeffyKey || ''

function fingerprintFor(contact) {
  if (contact.id) return `id:${contact.id}`
  const email = (contact.email || '').trim().toLowerCase()
  if (!email) return ''
  return `hmac:${createHmac('sha256', fingerprintSalt).update(email).digest('hex')}`
}

async function zeffyJson(path) {
  const res = await fetch(`${zeffyBase}${path}`, {
    headers: { Authorization: `Bearer ${zeffyKey}`, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Zeffy API ${path} -> ${res.status}`)
  const data = await res.json()
  // Tolerate {data:[...]} or a bare array.
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
}

/**
 * Fetch payments/submissions tied to the configured application campaigns.
 * Payments are the reliable link between a contact and the product/campaign
 * they came through, so this is where the product gate is applied.
 */
async function applicantPayments() {
  const payments = await zeffyJson('/v1/payments')
  return payments.filter((p) => {
    const campaignId = String(p.campaignId ?? p.campaign?.id ?? p.campaign?.campaignId ?? '')
    return campaignId && intakeCampaignIds.has(campaignId)
  })
}

/** Extract a contact from a payment, tolerant of shape. */
function contactOf(payment) {
  const c = payment.contact || payment.donor || {}
  return {
    id: c.id ?? payment.contactId,
    email: c.email ?? payment.email ?? '',
    organizationName: c.organizationName ?? c.companyName ?? payment.organizationName ?? '',
    fullName:
      c.fullName ??
      [c.firstName ?? payment.firstName, c.lastName ?? payment.lastName].filter(Boolean).join(' '),
  }
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
    `_Auto-created from an FFC application submitted via Zeffy for **${name}**._`,
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
  if (intakeCampaignIds.size === 0) {
    console.warn(
      'No ZEFFY_INTAKE_CAMPAIGN_IDS configured; skipping. (Product gate: we only stub charity-application submissions, never every contact.)'
    )
    return
  }
  if (!ghToken) {
    console.warn('No GITHUB_TOKEN; cannot create issues. Skipping.')
    return
  }

  const state = loadState()
  const seen = new Set(state.seenFingerprints || [])
  let payments = []
  try {
    payments = await applicantPayments()
  } catch (err) {
    console.warn(`Zeffy fetch failed: ${err.message}. Leaving state unchanged.`)
    return
  }

  let created = 0
  let changed = false
  for (const payment of payments) {
    const contact = contactOf(payment)
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
      console.warn(`Skipping an applicant: ${err.message}`)
    }
  }

  // Only persist (and therefore open a PR) when something materially changed,
  // so the daily run with no new applicants produces no PR churn.
  if (changed) {
    writeState(seen)
    console.log(`Zeffy sync: ${created} stub issue(s) created; state updated.`)
  } else {
    console.log('Zeffy sync: no new applicants; state unchanged.')
  }
}

main().catch((err) => {
  console.warn(`Zeffy sync skipped: ${err instanceof Error ? err.message : String(err)}`)
})
