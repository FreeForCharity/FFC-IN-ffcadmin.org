#!/usr/bin/env node
/**
 * Fleet audit: one polite probe pass over every live charity site FFC serves
 * (FreeForCharity/FFC-Cloudflare-Automation#697, overnight blocks 10+11).
 *
 * Source of truth for the fleet is docs/sites_list.csv — the same committed
 * snapshot the /sites-list dashboard renders. A probed charity site means:
 * Site Health is "Live" or "Redirect" (redirects are followed and the
 * destination audited), the org has not left FFC, the row is not a staging
 * host, the section is not For-Profit, and the domain status is not
 * Expired / Cancelled / Fraud / Transferred Away. Rows the CSV already marks
 * "Unreachable"/"Error" are listed in the report's Down-or-broken table
 * without being probed.
 *
 * For each site the script issues read-only GETs (250ms pacing, 10s timeout,
 * one retry) following redirects manually so the chain is recorded, then
 * checks the final HTML body against the FFC footer standard:
 *   - "Free For Charity" marker text
 *   - a link to freeforcharity.org
 *   - a link to the hub (freeforcharity.org/hub)
 *   - an EIN in the standard footer format
 *   - the FFC attribution in either accepted wording: "Supported by" (the
 *     target standard) or the legacy "A project of" accompanied by the
 *     freeforcharity.org link; progress toward the target wording is
 *     reported in its own column
 *
 * Outputs (paths overridable with --json / --md):
 *   docs/fleet-audit.json       machine-readable results (not committed;
 *                               uploaded as a workflow artifact)
 *   docs/fleet-audit-report.md  human-readable two-section report
 *
 * Pure helpers (CSV parsing, fleet selection, footer analysis, report
 * rendering) are exported for unit tests; only the probe loop touches the
 * network, and only when the script is invoked directly.
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const CSV_PATH = join(SCRIPT_DIR, '..', 'docs', 'sites_list.csv')

export const REQUEST_TIMEOUT_MS = 10_000
export const PACING_MS = 250
export const MAX_REDIRECTS = 8
const USER_AGENT = 'FFC-Fleet-Audit/1.0 (+https://ffcadmin.org/sites-list/)'

// ---------------------------------------------------------------------------
// CSV parsing (RFC 4180 subset: quoted fields, escaped quotes, CRLF).
// Dependency-free so the workflow can run this script with plain node.
// ---------------------------------------------------------------------------

/** Parse CSV text into an array of records keyed by the header row. */
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.length > 1 || row[0] !== '') rows.push(row)
      row = []
    } else {
      field += c
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    if (row.length > 1 || row[0] !== '') rows.push(row)
  }
  if (rows.length === 0) return []
  const header = rows[0].map((h) => h.trim())
  return rows.slice(1).map((cols) => {
    const rec = {}
    header.forEach((h, idx) => {
      rec[h] = (cols[idx] || '').trim()
    })
    return rec
  })
}

// ---------------------------------------------------------------------------
// Fleet selection
// ---------------------------------------------------------------------------

const EXCLUDED_STATUSES = new Set(['expired', 'cancelled', 'fraud', 'transferred away'])
// Probed health states: Live sites plus Redirect rows — a redirecting domain
// is still a charity site FFC serves; the probe follows the redirect and
// audits the destination.
const PROBED_HEALTH = new Set(['live', 'redirect'])
// CSV rows already known broken; not probed, but surfaced in the report's
// "Down or broken" table so they are never silently out of scope.
const KNOWN_DOWN_HEALTH = new Set(['unreachable', 'error'])

/** The non-health fleet criteria: a charity site FFC still serves. */
function isFleetRow(r) {
  return (
    (r['Left FFC'] || '') !== 'Yes' &&
    (r['Is Staging'] || '') !== 'Yes' &&
    (r['Section'] || '') !== 'For-Profit' &&
    !EXCLUDED_STATUSES.has((r['Status'] || '').toLowerCase())
  )
}

function toFleetEntry(r) {
  return {
    domain: (r['Domain'] || '').toLowerCase(),
    section: r['Section'] || '',
    status: r['Status'] || '',
    siteHealth: r['Site Health'] || '',
    hostCategory: r['Host Category'] || '',
    workTier: r['Work Tier'] || '',
  }
}

/**
 * Select the charity fleet to probe from sites_list.csv records: sites FFC
 * currently serves to the public on behalf of a charity (Site Health Live or
 * Redirect — redirects are followed and the destination audited).
 */
export function selectFleet(records) {
  return records
    .filter((r) => PROBED_HEALTH.has((r['Site Health'] || '').toLowerCase()) && isFleetRow(r))
    .map(toFleetEntry)
    .filter((r) => r.domain)
    .sort((a, b) => a.domain.localeCompare(b.domain))
}

/**
 * Fleet rows the CSV already marks Unreachable/Error: listed in the report's
 * "Down or broken" table (action needed) without being probed.
 */
export function selectKnownDown(records) {
  return records
    .filter((r) => KNOWN_DOWN_HEALTH.has((r['Site Health'] || '').toLowerCase()) && isFleetRow(r))
    .map(toFleetEntry)
    .filter((r) => r.domain)
    .sort((a, b) => a.domain.localeCompare(b.domain))
}

// ---------------------------------------------------------------------------
// Footer-standard analysis (pure)
// ---------------------------------------------------------------------------

/** Check an HTML body against the FFC footer standard. */
export function analyzeFooter(html) {
  const body = html || ''
  return {
    footerMarker: /Free ?For ?Charity/i.test(body),
    ffcLink: /href\s*=\s*["'][^"']*freeforcharity\.org/i.test(body),
    hubLink: /freeforcharity\.org\/hub/i.test(body),
    ein: /EIN[:\s]*\d{2}-?\d{7}/i.test(body),
    // Target attribution wording (tonight's template standard).
    supportedBy: /Supported by/i.test(body),
    // Legacy attribution wording still rendered by pre-standard templates
    // ("A project of Free For Charity" / "A project of freeforcharity.org").
    projectOf: /A project of/i.test(body),
  }
}

/**
 * FFC attribution present in EITHER accepted wording: the target
 * "Supported by", or the legacy "A project of" as long as it is accompanied
 * by the freeforcharity.org link (deployed pre-attribution-standard
 * templates). Progress toward the target wording is tracked separately via
 * the `supportedBy` flag ("Supported by (target)" report column).
 */
export function hasAttribution(footer) {
  return Boolean(footer && (footer.supportedBy || (footer.projectOf && footer.ffcLink)))
}

/** A site is footer-compliant when every footer-standard check passes. */
export function isCompliant(footer) {
  return Boolean(
    footer &&
    footer.footerMarker &&
    footer.ffcLink &&
    footer.hubLink &&
    footer.ein &&
    hasAttribution(footer)
  )
}

/** Classify a fetch/TLS error into a short machine-friendly reason. */
export function classifyError(err) {
  const cause = err && err.cause ? err.cause : err
  const code = (cause && cause.code) || ''
  const name = (err && err.name) || ''
  const causeName = (cause && cause.name) || ''
  if (name === 'TimeoutError' || causeName === 'TimeoutError' || code === 'UND_ERR_CONNECT_TIMEOUT')
    return { reason: 'timeout', tls: false }
  if (/CERT|TLS|SSL/i.test(code) || /certificate/i.test((cause && cause.message) || ''))
    return { reason: `tls-error (${code || 'certificate'})`, tls: true }
  if (code) return { reason: code.toLowerCase().replace(/^err_/, ''), tls: false }
  return { reason: (cause && cause.message) || String(err), tls: false }
}

/** Human-readable notes column for one audited site. */
export function buildNotes(site) {
  const notes = []
  if (site.error) notes.push(`unreachable: ${site.error}`)
  if (site.httpStatus && (site.httpStatus < 200 || site.httpStatus >= 400))
    notes.push(`HTTP ${site.httpStatus}`)
  if (site.redirectChain && site.redirectChain.length > 1)
    notes.push(`redirects to ${site.finalUrl}`)
  if (site.finalUrl && site.finalUrl.startsWith('http://')) notes.push('final URL is not HTTPS')
  if (site.retried) notes.push('needed retry')
  if (!site.error && site.ok && site.footer && !isCompliant(site.footer)) {
    const missing = []
    if (!site.footer.footerMarker) missing.push('FFC marker')
    if (!site.footer.ffcLink) missing.push('FFC link')
    if (!site.footer.hubLink) missing.push('hub link')
    if (!site.footer.ein) missing.push('EIN')
    if (!hasAttribution(site.footer)) missing.push('attribution ("Supported by" / "A project of")')
    notes.push(`missing: ${missing.join(', ')}`)
  }
  // Attribution present but in legacy wording — compliant, yet flagged so the
  // rollout of the target "Supported by" standard is visible per site.
  if (site.ok && site.footer && hasAttribution(site.footer) && !site.footer.supportedBy) {
    notes.push('legacy attribution wording (target: "Supported by")')
  }
  return notes.join('; ')
}

// ---------------------------------------------------------------------------
// Report rendering (pure)
// ---------------------------------------------------------------------------

const mark = (v) => (v ? 'yes' : 'no')
const httpsCell = (s) => (s.httpsOk === null || s.httpsOk === undefined ? '—' : mark(s.httpsOk))

/** Summary counts across all audited sites. */
export function buildSummary(sites) {
  const reachable = sites.filter((s) => s.ok)
  const down = sites.filter((s) => !s.ok)
  const compliant = reachable.filter((s) => isCompliant(s.footer))
  const checkCount = (key) => reachable.filter((s) => s.footer && s.footer[key]).length
  return {
    total: sites.length,
    reachable: reachable.length,
    down: down.length,
    compliant: compliant.length,
    checks: {
      footerMarker: checkCount('footerMarker'),
      ffcLink: checkCount('ffcLink'),
      hubLink: checkCount('hubLink'),
      ein: checkCount('ein'),
      // Either accepted attribution wording…
      attribution: reachable.filter((s) => hasAttribution(s.footer)).length,
      // …and, separately, the target wording, so rollout progress is visible.
      supportedBy: checkCount('supportedBy'),
    },
  }
}

/** Render the two-section markdown report. */
export function buildMarkdownReport(sites, generatedAt, knownDown = []) {
  const summary = buildSummary(sites)
  const down = sites.filter((s) => !s.ok)
  const lines = []
  lines.push('# FFC Fleet Audit Report')
  lines.push('')
  lines.push(`> **Point-in-time snapshot** generated on ${generatedAt}.`)
  lines.push('> Re-run with `node scripts/fleet-audit.mjs` or the **Fleet Audit** workflow')
  lines.push('> (`.github/workflows/fleet-audit.yml`, workflow_dispatch). The fleet is every')
  lines.push('> charity site in `docs/sites_list.csv` FFC still serves (Site Health = Live or')
  lines.push('> Redirect — redirects are followed and the destination audited — still with')
  lines.push('> FFC, not staging, not for-profit). Rows the CSV already marks')
  lines.push('> Unreachable/Error are listed under "Down or broken" without being probed.')
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  lines.push(`- **Sites audited:** ${summary.total}`)
  lines.push(`- **Reachable:** ${summary.reachable} / ${summary.total}`)
  lines.push(`- **Down / broken (probed):** ${summary.down}`)
  if (knownDown.length > 0) {
    lines.push(
      `- **Already marked Unreachable/Error in the CSV (not probed):** ${knownDown.length}`
    )
  }
  lines.push(
    `- **Footer-standard compliant:** ${summary.compliant} / ${summary.reachable} reachable sites`
  )
  lines.push(
    `- Individual checks (of ${summary.reachable} reachable): FFC marker ${summary.checks.footerMarker}, ` +
      `FFC link ${summary.checks.ffcLink}, hub link ${summary.checks.hubLink}, ` +
      `EIN ${summary.checks.ein}, attribution (either wording) ${summary.checks.attribution}, ` +
      `"Supported by" target wording ${summary.checks.supportedBy}`
  )
  lines.push('')
  if (down.length > 0 || knownDown.length > 0) {
    lines.push('## Down or broken sites (action needed)')
    lines.push('')
    lines.push('| Charity | Problem |')
    lines.push('| ------- | ------- |')
    for (const s of down) lines.push(`| ${s.domain} | ${buildNotes(s) || 'unreachable'} |`)
    for (const s of knownDown) {
      lines.push(`| ${s.domain} | marked "${s.siteHealth}" in sites_list.csv (not probed) |`)
    }
    lines.push('')
  }
  lines.push('## Section A — FFC footer-standard compliance')
  lines.push('')
  lines.push(
    '| Charity | Status | HTTPS | Footer marker | Attribution | Supported by (target wording) | EIN | Hub link | Notes |'
  )
  lines.push(
    '| ------- | ------ | ----- | ------------- | ----------- | ----------------------------- | --- | -------- | ----- |'
  )
  for (const s of sites) {
    const f = s.footer || {}
    lines.push(
      `| ${s.domain} | ${s.error ? 'DOWN' : s.httpStatus} | ${httpsCell(s)} | ` +
        `${s.ok ? mark(f.footerMarker) : '—'} | ${s.ok ? mark(hasAttribution(f)) : '—'} | ` +
        `${s.ok ? mark(f.supportedBy) : '—'} | ` +
        `${s.ok ? mark(f.ein) : '—'} | ${s.ok ? mark(f.hubLink) : '—'} | ${buildNotes(s)} |`
    )
  }
  lines.push('')
  lines.push('## Section B — Site health')
  lines.push('')
  lines.push('| Charity | HTTP status | HTTPS | Final URL | Redirect hops | Notes |')
  lines.push('| ------- | ----------- | ----- | --------- | ------------- | ----- |')
  for (const s of sites) {
    const hops = s.redirectChain ? s.redirectChain.length - 1 : 0
    lines.push(
      `| ${s.domain} | ${s.error ? 'DOWN' : s.httpStatus} | ${httpsCell(s)} | ` +
        `${s.finalUrl || '—'} | ${hops} | ${buildNotes(s)} |`
    )
  }
  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Network probe (only used when run directly)
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchOnce(url) {
  return fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,*/*' },
  })
}

/** Follow redirects manually so the chain is recorded. Throws on network/TLS errors. */
async function follow(startUrl) {
  const chain = []
  let url = startUrl
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetchOnce(url)
    chain.push({ url, status: res.status })
    const location = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && location) {
      url = new URL(location, url).href
      await sleep(PACING_MS)
      continue
    }
    const body = await res.text()
    return { chain, finalUrl: url, status: res.status, body }
  }
  return { chain, finalUrl: url, status: 0, body: '', tooManyRedirects: true }
}

/** Probe one site: HTTPS GET with redirect recording, one retry on failure. */
async function probeSite(entry) {
  const startUrl = `https://${entry.domain}/`
  let retried = false
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await follow(startUrl)
      const ok = res.status >= 200 && res.status < 400 && !res.tooManyRedirects
      return {
        ...entry,
        ok,
        httpStatus: res.status,
        httpsOk: res.finalUrl.startsWith('https://'),
        finalUrl: res.finalUrl,
        redirectChain: res.chain,
        footer: ok ? analyzeFooter(res.body) : null,
        error: res.tooManyRedirects ? 'too many redirects' : null,
        retried,
      }
    } catch (err) {
      const { reason, tls } = classifyError(err)
      if (attempt === 0) {
        retried = true
        await sleep(PACING_MS * 2)
        continue
      }
      return {
        ...entry,
        ok: false,
        httpStatus: null,
        httpsOk: tls ? false : null,
        finalUrl: null,
        redirectChain: null,
        footer: null,
        error: reason,
        retried,
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const argValue = (flag, fallback) => {
    const idx = args.indexOf(flag)
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback
  }
  const jsonOut = argValue('--json', join(SCRIPT_DIR, '..', 'docs', 'fleet-audit.json'))
  const mdOut = argValue('--md', join(SCRIPT_DIR, '..', 'docs', 'fleet-audit-report.md'))

  const records = parseCsv(readFileSync(CSV_PATH, 'utf8'))
  const fleet = selectFleet(records)
  const knownDown = selectKnownDown(records)
  console.log(
    `Auditing ${fleet.length} charity sites (Live + Redirect); ` +
      `${knownDown.length} more already marked Unreachable/Error in the CSV (listed, not probed)...`
  )

  const results = []
  for (const entry of fleet) {
    const site = await probeSite(entry)
    results.push(site)
    const verdict = site.error
      ? `DOWN (${site.error})`
      : `${site.httpStatus}${isCompliant(site.footer) ? ' compliant' : ''}`
    console.log(`  ${site.domain}: ${verdict}`)
    await sleep(PACING_MS)
  }

  const generatedAt = new Date().toISOString()
  const summary = buildSummary(results)
  writeFileSync(
    jsonOut,
    JSON.stringify(
      { generatedAt, source: 'docs/sites_list.csv', summary, sites: results, knownDown },
      null,
      2
    )
  )
  writeFileSync(mdOut, buildMarkdownReport(results, generatedAt.slice(0, 10), knownDown) + '\n')
  console.log(
    `\nDone: ${summary.compliant}/${summary.reachable} reachable sites footer-compliant, ` +
      `${summary.down} down of ${summary.total} audited ` +
      `(+${knownDown.length} known-down CSV rows listed).`
  )
  console.log(`JSON: ${jsonOut}\nReport: ${mdOut}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
