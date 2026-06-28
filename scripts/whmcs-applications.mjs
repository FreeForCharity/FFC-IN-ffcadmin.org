#!/usr/bin/env node
/**
 * LOCAL charity intake: query WHMCS directly for charity applicants and open a
 * `kind:intake` issue per new one. This runs inside FFCadmin (no cross-repo
 * feed) using WHMCS credentials pulled at runtime from Azure Key Vault by the
 * workflow (`.github/workflows/whmcs-intake.yml` -> `azure-kv-secrets` action).
 *
 * A charity "application" is a WHMCS client holding an FFC onboarding product:
 * pre-501c3 = pid 16, 501c3 = pid 33 (override via WHMCS_ONBOARDING_PIDS).
 * Donors hold no such product, so gating on these pids excludes them by
 * construction. Only non-PII fields are derived (an allowlist): an opaque id,
 * the public org name, the service tier, an optional truncated mission, and a
 * date. Emails/phones/addresses/board/EIN are never read into the record.
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

// Only surface applications NOT yet accepted — WHMCS service status "Pending".
// Active = already onboarded; Cancelled/Fraud/Completed must never be published.
// Override via WHMCS_INTAKE_STATUSES (comma-separated, case-insensitive).
const INTAKE_STATUSES = new Set(
  (process.env.WHMCS_INTAKE_STATUSES || 'Pending')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
)

export const MISSION_MAX_LENGTH = 180
export const TIER_BY_PID = {
  16: 'Tier 1 — Application & verification (pre-501(c)(3))',
  33: 'Tier 1 — Application & verification (501(c)(3))',
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
      return String.fromCodePoint(parseInt(n, radix))
    } catch {
      return m
    }
  }
  return String(s)
    .replace(/&#(\d+);/g, (m, n) => codePoint(m, n, 10))
    .replace(/&#x([0-9a-fA-F]+);/g, (m, n) => codePoint(m, n, 16))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
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
    if (/mission/i.test(String(f?.name || ''))) {
      const v = String(f?.value || '').trim()
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
      serviceTier: TIER_BY_PID[rec.pid] || 'Tier 1 — Application & verification',
      ...(mission ? { missionExcerpt: mission } : {}),
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
      const existing = byClient.get(clientId)
      if (existing) {
        if (pid === '33') existing.pid = pid
        if (!existing.mission && mission) existing.mission = mission
        if (!existing.regIso && regIso) existing.regIso = regIso
      } else {
        byClient.set(clientId, { clientId, pid, mission, regIso, company: undefined })
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
  await syncIntakeIssues({ applications, repo, token, stateFile: STATE_FILE, source: 'WHMCS' })
}

// Only run when invoked directly (not when imported by tests). pathToFileURL
// normalizes the (possibly relative) argv path to a file:// URL, so this is
// robust to `node scripts/whmcs-applications.mjs` as well as an absolute path.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.warn(`WHMCS intake skipped: ${errMsg(err)}`)
  })
}
