#!/usr/bin/env node
/**
 * LOCAL charity intake: query WHMCS directly for APPROVED charity applications
 * and open a `kind:intake` issue — the website-provisioning work order — per
 * new one. WHMCS is the intake/application system of record; a GitHub issue is
 * created only after the application is approved. This runs inside FFCadmin
 * (no cross-repo feed) using WHMCS credentials pulled at runtime from Azure Key
 * Vault by the workflow (`.github/workflows/whmcs-intake.yml` ->
 * `azure-kv-secrets` action).
 *
 * A charity "application" is a WHMCS client holding an FFC onboarding product:
 * pre-501c3 = pid 16, 501c3 = pid 33 (override via WHMCS_ONBOARDING_PIDS).
 * Donors hold no such product, so gating on these pids excludes them by
 * construction. Only non-PII fields are derived (an allowlist): an opaque id,
 * the public org name, charity status, service tier, the self-attested mission
 * tier, an optional truncated mission, a Candid/GuideStar profile link, EIN
 * (public for registered charities), and a date. Personal contact info — emails,
 * phones, addresses, board members — is never matched or read into the record.
 *
 * Read-only against WHMCS (GetClientsProducts + GetClientsDetails). Graceful:
 * missing creds or a WHMCS error is a no-op, leaving state unchanged.
 *
 * Run: node scripts/whmcs-applications.mjs
 */
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'
import { syncIntakeIssues, errMsg } from './lib/intake-issues.mjs'

const moduleDir = dirname(fileURLToPath(import.meta.url))
const STATE_FILE = join(moduleDir, '..', 'automation', 'applications-sync-state.json')

// Default to the FFC APIM gateway (static egress IP that WHMCS allow-lists);
// GitHub runner IPs are dynamic and get rejected with "Invalid IP". See
// docs/whmcs-apim-routing.md in FFC-Cloudflare-Automation.
const apiUrl =
  process.env.WHMCS_API_URL || 'https://apim-ffc-gateway-prod.azure-api.net/whmcs/api.php'
const PLACEHOLDER = 'PLACEHOLDER-SET-VIA-AZURE-PORTAL'
const identifier = process.env.WHMCS_API_IDENTIFIER
const secret = process.env.WHMCS_API_SECRET
const accessKey = process.env.WHMCS_API_ACCESS_KEY
// APIM subscription key — the gateway requires it (sent as Ocp-Apim-Subscription-Key).
const apimSubscriptionKey = process.env.WHMCS_APIM_SUBSCRIPTION_KEY || ''
const repo = process.env.GITHUB_REPOSITORY || 'FreeForCharity/FFC-IN-ffcadmin.org'
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const PRODUCT_IDS = (process.env.WHMCS_ONBOARDING_PIDS || '16,33')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// Only surface APPROVED applications — WHMCS service status "Active" (an
// accepted onboarding service is Active). GitHub issues are website-provisioning
// work orders created only after approval, so Pending (application still under
// review) must not generate one, and Cancelled/Fraud/Completed must never be
// published. Override via WHMCS_INTAKE_STATUSES (comma-separated,
// case-insensitive). Exported for unit testing.
export const INTAKE_STATUSES = new Set(
  (process.env.WHMCS_INTAKE_STATUSES || 'Active')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
)

// FLOOD GUARD: WHMCS holds hundreds of historical applications and long-Active
// services that predate the work-order model and never had issues; switching the
// default status to Active must not mass-create issues for them. Only services
// whose registration date (product `regdate`, falling back to the client's
// `datecreated`) is on/after this cutover date generate NEW issues. Issues that
// already exist are still refreshed regardless of date. Override via
// WHMCS_INTAKE_SINCE (YYYY-MM-DD). Exported for unit testing.
export const INTAKE_SINCE = process.env.WHMCS_INTAKE_SINCE || '2026-07-11'

export const MISSION_MAX_LENGTH = 180
export const TIER_BY_PID = {
  16: 'Tier 1 — Application & verification (pre-501(c)(3))',
  33: 'Tier 1 — Application & verification (501(c)(3))',
}
// pid -> the "Charity status" intake-form option string (so the stub issue parses
// to the right charityStage and scores accurately). pid is authoritative.
export const STATUS_OPTION_BY_PID = {
  16: 'Pre-501(c)(3) (actively pursuing)',
  33: 'Approved 501(c)(3)',
}

// The three self-attested mission tiers. The applicant picks ONE in the WHMCS
// onboarding dropdown; these are the only options offered. The strings here are
// the canonical intake-form option labels (must match `MISSION_LABELS` in
// src/lib/readiness/config.ts and the charity-intake.yml dropdown) so the stub
// issue parses straight to the right tier instead of being guessed from text.
export const MISSION_OPTION = {
  basicNeeds: 'Basic needs (food, water, shelter)',
  veterans: 'Veterans / military',
  general: 'General',
}

// Custom-field NAME that holds the self-attested mission tier. The live FFC
// onboarding form labels this as an organization-type selector, so we match
// those names too — not just literal "mission category".
const MISSION_CATEGORY_RE =
  /mission\s*(category|tier|type|group|focus)|cause\s*area|organi[sz]ation\s*type|type\s*of\s*organi[sz]ation|charity\s*type/i

// VALUE shape of the live onboarding dropdown options, e.g.
//   "501(c)(3) Food, Water, or Shelter Organization"
//   "501(c)(19) Veterans Organization"
//   "Other Veterans Organization"
//   "Other 501(c)(3) Organization"
// Anchored (starts with a 501(c)(N)/Other classifier, ends with "Organization")
// so it identifies the dropdown by value even when we don't know the field's
// exact label, without ever matching free-text mission prose.
const ORG_TYPE_VALUE_RE = /^(?:501\(c\)\(\d+\)|other\b).*\borganization\s*$/i

/**
 * Map a self-attested WHMCS mission-tier value to its canonical intake-form
 * option string. There are exactly three tiers; we match by keyword so the live
 * option labels (which fold tax status + cause into one string, e.g. "501(c)(3)
 * Food, Water, or Shelter Organization") resolve, and so does any minor future
 * rewording. Returns '' when no value is supplied. Exported for unit testing.
 */
export function missionCategoryOption(raw) {
  const v = String(raw || '')
    .trim()
    .toLowerCase()
  if (!v) return ''
  if (/food|water|shelter|basic\s*need|hunger|homeless|housing/.test(v))
    return MISSION_OPTION.basicNeeds
  if (/veteran|military|armed\s*forces|servicemember/.test(v)) return MISSION_OPTION.veterans
  return MISSION_OPTION.general
}

/**
 * Resolve the self-attested mission tier from a product's custom fields. Finds
 * the onboarding org-type dropdown either by field name (MISSION_CATEGORY_RE) or
 * by the distinctive option value shape (ORG_TYPE_VALUE_RE), then maps it. The
 * value-shape match means we don't depend on the exact field label. Returns ''
 * when no such field is present (caller falls back to text classification).
 * Exported for unit testing.
 */
export function missionTierFromProduct(product) {
  const nodes = product?.customfields?.customfield
  if (!nodes) return ''
  for (const f of [].concat(nodes)) {
    const name = String(f?.name || '')
    const value = decodeEntities(String(f?.value || '')).trim()
    if (!value) continue
    if (MISSION_CATEGORY_RE.test(name) || ORG_TYPE_VALUE_RE.test(value)) {
      const opt = missionCategoryOption(value)
      if (opt) return opt
    }
  }
  return ''
}

/** First populated custom-field value whose NAME matches `re` (decoded, trimmed). */
function fieldValue(product, re) {
  const nodes = product?.customfields?.customfield
  if (!nodes) return ''
  for (const f of [].concat(nodes)) {
    if (re.test(String(f?.name || ''))) {
      const v = decodeEntities(String(f?.value || '')).trim()
      if (v) return v
    }
  }
  return ''
}

/**
 * Pull a clean Candid/GuideStar profile URL: WHMCS stores it HTML-wrapped
 * (`<a href="URL">…</a>`) and many are placeholders ("none.org"). Return a real
 * candid.org / guidestar.org URL only, else ''.
 */
export function sanitizeCandidUrl(raw) {
  if (!raw) return ''
  const href = /href=["']([^"']+)["']/i.exec(raw)
  const candidate = decodeEntities(href ? href[1] : raw).trim()
  let u
  try {
    u = new URL(candidate)
  } catch {
    return ''
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return ''
  if (!/(^|\.)(candid\.org|guidestar\.org)$/i.test(u.hostname)) return ''
  return u.toString()
}

/** Validate a US EIN (NN-NNNNNNN). EINs are public for registered charities. */
export function sanitizeEin(raw) {
  const m = /\b(\d{2})-?(\d{7})\b/.exec(String(raw || ''))
  return m ? `${m[1]}-${m[2]}` : ''
}

// The WHMCS host's Imunify360 bot-protection intermittently challenges GitHub
// runner IPs; retry just those transient signatures (mirrors the repo's
// PowerShell whmcs-api-common helper). Genuine auth errors fail fast.
const TRANSIENT =
  /Imunify360|bot-protection|too many requests|temporarily unavailable|timed out|\b(429|502|503|504)\b/i
const sleep = (attempt) => new Promise((r) => setTimeout(r, Math.min(2 ** attempt, 16) * 1000))

async function whmcs(action, params = {}, attempt = 1) {
  const body = new URLSearchParams({ identifier, secret, responsetype: 'json', action, ...params })
  if (accessKey) body.set('accesskey', accessKey)
  let text
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'FFC-intake (+https://ffcadmin.org)',
        ...(apimSubscriptionKey ? { 'Ocp-Apim-Subscription-Key': apimSubscriptionKey } : {}),
      },
      body,
    })
    text = await res.text()
  } catch (err) {
    if (attempt < 5 && TRANSIENT.test(errMsg(err))) {
      await sleep(attempt)
      return whmcs(action, params, attempt + 1)
    }
    throw err
  }
  let data
  try {
    data = JSON.parse(text)
  } catch {
    if (attempt < 5 && TRANSIENT.test(text)) {
      await sleep(attempt)
      return whmcs(action, params, attempt + 1)
    }
    throw new Error(`WHMCS ${action}: non-JSON response`)
  }
  if (data.result !== 'success') {
    const msg = data.message || data.errormessage || data.error || 'unknown error'
    if (attempt < 5 && TRANSIENT.test(String(msg))) {
      await sleep(attempt)
      return whmcs(action, params, attempt + 1)
    }
    throw new Error(`WHMCS ${action}: ${msg}`)
  }
  return data
}

/** Decode the HTML entities WHMCS stores in free-text fields (names, missions). */
function decodeEntities(s) {
  // External data: a malformed/out-of-range numeric entity must not throw and
  // abort the run — leave it untouched if fromCodePoint can't handle it.
  const codePoint = (m, n, radix) => {
    try {
      const cp = parseInt(n, radix)
      // Never decode to raw angle brackets — this text is interpolated into
      // GitHub issue titles/bodies, so keep < / > entity-encoded to avoid
      // HTML/markdown injection from applicant-controlled input.
      if (cp === 0x3c || cp === 0x3e) return m
      return String.fromCodePoint(cp)
    } catch {
      return m
    }
  }
  return (
    String(s)
      .replace(/&#(\d+);/g, (m, n) => codePoint(m, n, 10))
      .replace(/&#x([0-9a-fA-F]+);/g, (m, n) => codePoint(m, n, 16))
      // Intentionally do NOT decode &lt; / &gt; — keep angle brackets encoded
      // (see codePoint note above) so untrusted text can't inject markup.
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
  )
}

function isoDate(raw) {
  if (!raw || /^0000/.test(String(raw))) return undefined
  const t = Date.parse(String(raw).replace(' ', 'T'))
  return Number.isNaN(t) ? undefined : new Date(t).toISOString()
}

function missionFromProduct(product) {
  const nodes = product?.customfields?.customfield
  if (!nodes) return undefined
  for (const f of [].concat(nodes)) {
    const name = String(f?.name || '')
    const v = String(f?.value || '').trim()
    // The free-text mission statement — not the org-type/mission-tier dropdown
    // (excluded by field name and by the dropdown's distinctive value shape).
    if (/mission/i.test(name) && !MISSION_CATEGORY_RE.test(name) && !ORG_TYPE_VALUE_RE.test(v)) {
      if (v) return v
    }
  }
  return undefined
}

/**
 * Pure transform: per-client working records -> PII-safe application records.
 * Exported for unit testing without hitting WHMCS.
 */
export function buildApplicationRecords(byClient) {
  const apps = []
  for (const rec of byClient.values()) {
    const company = decodeEntities(String(rec.company || '').trim()).trim()
    if (!company) continue // a published record needs a public org name
    let mission
    if (rec.mission) {
      let m = decodeEntities(String(rec.mission)).replace(/\s+/g, ' ').trim()
      if (m.length > MISSION_MAX_LENGTH) m = `${m.slice(0, MISSION_MAX_LENGTH - 1).trimEnd()}…`
      mission = m
    }
    apps.push({
      id: `ffc-${rec.clientId}`,
      charityName: company,
      // pid -> stage/status so the stub parses to an accurate charityStage.
      charityStage: rec.pid === '33' ? '501c3' : 'pre-501c3',
      charityStatusOption: STATUS_OPTION_BY_PID[rec.pid] || STATUS_OPTION_BY_PID[16],
      serviceTier: TIER_BY_PID[rec.pid] || 'Tier 1 — Application & verification',
      // Self-attested mission tier (the WHMCS dropdown). Omitted when the
      // applicant predates the field; the roadmap then classifies from the text.
      ...(rec.missionOption ? { missionCategoryOption: rec.missionOption } : {}),
      ...(mission ? { missionExcerpt: mission } : {}),
      ...(rec.candidUrl ? { candidUrl: rec.candidUrl } : {}),
      ...(rec.ein ? { ein: rec.ein } : {}),
      ...(rec.regIso ? { submittedAt: rec.regIso } : {}),
    })
  }
  return apps.sort(
    (a, b) =>
      String(a.submittedAt || '').localeCompare(String(b.submittedAt || '')) ||
      a.charityName.localeCompare(b.charityName)
  )
}

async function collect() {
  // clientId -> working record. A client holding both products is listed once;
  // the 501c3 product (pid 33) wins for the tier label.
  const byClient = new Map()
  for (const pid of PRODUCT_IDS) {
    let resp
    try {
      resp = await whmcs('GetClientsProducts', { pid, limitnum: '5000' })
    } catch (err) {
      console.warn(`WHMCS GetClientsProducts pid=${pid} failed: ${errMsg(err)}`)
      continue
    }
    const products = [].concat(resp?.products?.product || [])
    const eligible = products.filter((p) =>
      INTAKE_STATUSES.has(String(p?.status || '').toLowerCase())
    )
    console.log(
      `pid ${pid} -> ${products.length} client product(s); ${eligible.length} in intake status [${[...INTAKE_STATUSES].join(', ')}]`
    )
    for (const p of eligible) {
      const clientId = String(p?.clientid || '').trim()
      if (!clientId) continue
      const regIso = isoDate(p?.regdate)
      const mission = missionFromProduct(p)
      const missionOption = missionTierFromProduct(p)
      // Non-PII transparency fields (allowlisted by field name; board/contact
      // fields are never matched). Candid link + EIN help donors evaluate.
      const candidUrl = sanitizeCandidUrl(fieldValue(p, /guidestar|candid/i))
      const ein = sanitizeEin(fieldValue(p, /\bEIN\b|tax id/i))
      const existing = byClient.get(clientId)
      if (existing) {
        if (pid === '33') existing.pid = pid
        if (!existing.mission && mission) existing.mission = mission
        if (!existing.missionOption && missionOption) existing.missionOption = missionOption
        if (!existing.regIso && regIso) existing.regIso = regIso
        if (!existing.candidUrl && candidUrl) existing.candidUrl = candidUrl
        if (!existing.ein && ein) existing.ein = ein
      } else {
        byClient.set(clientId, {
          clientId,
          pid,
          mission,
          missionOption,
          regIso,
          candidUrl,
          ein,
          company: undefined,
        })
      }
    }
  }
  // Resolve the public organization name per client (read-only, no stats).
  for (const [clientId, rec] of byClient) {
    try {
      const d = await whmcs('GetClientsDetails', { clientid: clientId, stats: 'false' })
      rec.company = String(d?.client?.companyname ?? d?.companyname ?? '').trim()
      if (!rec.regIso) rec.regIso = isoDate(d?.client?.datecreated)
    } catch (err) {
      console.warn(`GetClientsDetails ${clientId} failed: ${errMsg(err)}`)
    }
  }
  return buildApplicationRecords(byClient)
}

async function main() {
  if (!identifier || !secret) {
    console.warn('WHMCS credentials not set (expected from Azure Key Vault). Skipping.')
    return
  }
  if (identifier === PLACEHOLDER || secret === PLACEHOLDER) {
    console.warn(
      'WHMCS Key Vault secrets still hold the scaffolding placeholder; set the real ' +
        'identifier/secret in the vault before running. Skipping.'
    )
    return
  }
  // The APIM gateway requires a subscription key; calling it without one fails
  // every request with a generic auth error. Fail fast with a clear message.
  if (/azure-api\.net/i.test(apiUrl) && !apimSubscriptionKey) {
    console.warn(
      'WHMCS_API_URL targets the APIM gateway but WHMCS_APIM_SUBSCRIPTION_KEY is not set ' +
        '(the gateway requires Ocp-Apim-Subscription-Key). Skipping.'
    )
    return
  }
  const applications = await collect()
  console.log(`WHMCS intake: ${applications.length} applicant(s) found.`)
  // Dry run: print the PII-safe records and stop — no GitHub issues created.
  // Used for validating the WHMCS path before relying on it (and exposed as a
  // workflow_dispatch input).
  if (process.env.WHMCS_DRY_RUN) {
    console.log(JSON.stringify(applications, null, 2))
    return
  }
  if (!token) {
    console.warn('No GITHUB_TOKEN; cannot create issues. Skipping.')
    return
  }
  await syncIntakeIssues({
    applications,
    repo,
    token,
    stateFile: STATE_FILE,
    source: 'WHMCS',
    // Flood guard (see INTAKE_SINCE above): never first-time-create issues for
    // services that predate the approval-gated work-order cutover.
    createNewSince: INTAKE_SINCE,
  })
}

// Only run when invoked directly (not when imported by tests). pathToFileURL
// normalizes the (possibly relative) argv path to a file:// URL, so this is
// robust to `node scripts/whmcs-applications.mjs` as well as an absolute path.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.warn(`WHMCS intake skipped: ${errMsg(err)}`)
  })
}
