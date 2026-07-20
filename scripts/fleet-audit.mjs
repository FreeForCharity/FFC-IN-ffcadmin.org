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
 * checks the final HTML body against the TWO-LEVEL FFC footer standard
 * (operator-defined 2026-07-12):
 *
 *   Level 1 (pre-501c3): the six positive checks — "Free For Charity"
 *   marker, freeforcharity.org link, hub link (freeforcharity.org/hub),
 *   EIN, FFC attribution ("Supported by" target wording, or the legacy
 *   "A project of" + FFC link), current-year copyright line — AND no
 *   501(c)(3) status claim. A pre-501c3 footer asserting 501(c)(3) status
 *   ("a US 501c3 Non Profit") is a Level-1 VIOLATION.
 *
 *   Level 2 (full 501c3): all six positive checks PLUS a Candid/GuideStar
 *   profile link (guidestar.org / candid.org) AND the 501(c)(3) status line.
 *
 * Each reachable site is also gap-classified: compliant-L2 / compliant-L1 /
 * attribution-only (substantively FFC-footered, closable with a one-line
 * footer edit) / partial (some elements; exact missing checks listed) /
 * structural (no FFC footer at all — full adoption-checklist retrofit).
 * Charity STAGE is joined from public/data/roadmap.json by domain/name
 * match; where the stage is unknown both level verdicts are reported, and a
 * pre-501c3 site bearing a 501(c)(3) claim is flagged as a false status
 * claim (legal exposure).
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
const ROADMAP_PATH = join(SCRIPT_DIR, '..', 'public', 'data', 'roadmap.json')

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

// A 501(c)(3) token in any of the renderings seen in the wild:
// "501(c)(3)", "501(c)3", "501c3", "501 (c)(3)". The deployed templates
// render "a US 501c3 Non Profit" (see src/components/Footer.tsx and the
// wordpress-to-nextjs guide's footer snippet).
const CLAIM_TOKEN_RE = /501\s*\(?\s*c\s*\)?\s*\(?\s*3\s*\)?/gi

/**
 * Detect a 501(c)(3) STATUS CLAIM: a 501(c)(3) token near "Non Profit" /
 * "nonprofit" wording asserting the charity's own status. A token whose
 * nearby preceding text names Free For Charity is FFC's own status line
 * (the "Supported by Free For Charity, a US 501(c)(3) Non Profit"
 * attribution) — that describes FFC, not the audited charity, so it is NOT
 * counted as the site's status claim.
 */
export function detectStatusClaim(body) {
  for (const m of body.matchAll(CLAIM_TOKEN_RE)) {
    const start = m.index
    const before = body.slice(Math.max(0, start - 90), start)
    const near = before.slice(-60) + ' ' + body.slice(start + m[0].length, start + m[0].length + 60)
    if (!/non[\s-]?profit/i.test(near)) continue
    if (/free\s*for\s*charity/i.test(before)) continue
    return true
  }
  return false
}

/**
 * Check an HTML body against the FFC footer standard. `year` is the
 * current year for the copyright check (injectable for tests).
 */
export function analyzeFooter(html, year = new Date().getFullYear()) {
  const body = html || ''
  const copyrightRe = new RegExp(
    // Copyright marker and the current year within a short window, either
    // order, so "© 2026 …" and "2026 © …" both pass but a stale year fails.
    String.raw`(?:©|&copy;|\(c\)|copyright)[\s\S]{0,120}?\b${year}\b|\b${year}\b[\s\S]{0,120}?(?:©|&copy;|copyright)`,
    'i'
  )
  return {
    footerMarker: /Free ?For ?Charity/i.test(body),
    ffcLink: /href\s*=\s*["'][^"']*freeforcharity\.org/i.test(body),
    hubLink: /freeforcharity\.org\/hub/i.test(body),
    ein: /EIN[:\s]*\d{2}-?\d{7}/i.test(body),
    // Target attribution wording (the template standard).
    supportedBy: /Supported by/i.test(body),
    // Legacy attribution wording still rendered by pre-standard templates
    // ("A project of Free For Charity" / "A project of freeforcharity.org").
    projectOf: /A project of/i.test(body),
    // Copyright line carrying the CURRENT year (never a hard-coded stale one).
    copyrightCurrentYear: copyrightRe.test(body),
    // Candid/GuideStar public-profile link (Level 2 requirement).
    guidestarLink: /href\s*=\s*["'][^"']*(?:guidestar\.org|candid\.org)/i.test(body),
    // 501(c)(3) status claim about the charity itself (Level-2 requirement;
    // Level-1 VIOLATION on a pre-501c3 site).
    statusClaim501c3: detectStatusClaim(body),
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

/**
 * The six POSITIVE checks shared by both levels, with the report labels
 * used when listing exactly which checks a partial site is missing.
 */
export const LEVEL_CHECKS = [
  ['footerMarker', 'FFC marker'],
  ['ffcLink', 'FFC link'],
  ['hubLink', 'hub link'],
  ['ein', 'EIN'],
  ['attribution', 'attribution ("Supported by" / "A project of")'],
  ['copyrightCurrentYear', 'current-year copyright'],
]

/** Keys of the six positive checks a footer is missing (attribution = either wording). */
export function missingLevelChecks(footer) {
  if (!footer) return LEVEL_CHECKS.map(([key]) => key)
  return LEVEL_CHECKS.filter(([key]) =>
    key === 'attribution' ? !hasAttribution(footer) : !footer[key]
  ).map(([key]) => key)
}

/** Report label for a check key. */
export function checkLabel(key) {
  const found = LEVEL_CHECKS.find(([k]) => k === key)
  return found ? found[1] : key
}

/**
 * Level 1 (pre-501c3): all six positive checks pass AND the footer makes
 * NO 501(c)(3) status claim — a pre-501c3 charity asserting the status is
 * a violation, not a pass.
 */
export function passesLevel1(footer) {
  return Boolean(footer && missingLevelChecks(footer).length === 0 && !footer.statusClaim501c3)
}

/**
 * Level 2 (full 501c3): all six positive checks pass PLUS the
 * Candid/GuideStar profile link AND the 501(c)(3) status line.
 */
export function passesLevel2(footer) {
  return Boolean(
    footer &&
    missingLevelChecks(footer).length === 0 &&
    footer.guidestarLink &&
    footer.statusClaim501c3
  )
}

/**
 * Gap-classify one reachable site's footer:
 *   compliant-L2 / compliant-L1  passes the respective level
 *   attribution-only             substantively FFC-footered (FFC marker +
 *                                EIN + guidestar-or-hub-or-FFC link) but
 *                                missing ONLY the attribution wording
 *                                and/or hub link → one-line footer edit
 *   partial                      some FFC footer elements; the missing
 *                                checks are listed exactly
 *   structural                   no FFC footer element at all → full
 *                                adoption-checklist retrofit
 */
export function classifyGap(footer) {
  if (!footer) return 'structural'
  if (passesLevel2(footer)) return 'compliant-L2'
  if (passesLevel1(footer)) return 'compliant-L1'
  const ffcSignals =
    footer.footerMarker ||
    footer.ffcLink ||
    footer.hubLink ||
    footer.ein ||
    hasAttribution(footer) ||
    footer.guidestarLink
  if (!ffcSignals) return 'structural'
  const missing = missingLevelChecks(footer)
  if (
    missing.length > 0 &&
    missing.every((k) => k === 'attribution' || k === 'hubLink') &&
    footer.footerMarker &&
    footer.ein &&
    (footer.guidestarLink || footer.hubLink || footer.ffcLink)
  ) {
    return 'attribution-only'
  }
  // Includes the six-positives-pass-but-neither-level case: a 501(c)(3)
  // status line without the Candid/GuideStar link (fails L2) that also
  // blocks L1 (the claim). buildNotes spells that out.
  return 'partial'
}

export const GAP_CLASSES = [
  'compliant-L2',
  'compliant-L1',
  'attribution-only',
  'partial',
  'structural',
]

// ---------------------------------------------------------------------------
// Charity stage join (roadmap.json)
// ---------------------------------------------------------------------------

const normalizeToken = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

/** The registrable label(s) of a domain, normalized (strip www., path, TLD). */
function domainLabel(domain) {
  const host = String(domain || '')
    .toLowerCase()
    .replace(/^www\./, '')
    .split('/')[0]
  return normalizeToken(host.split('.').slice(0, -1).join(''))
}

/**
 * Precompute a stage index from roadmap.json entries (charityName +
 * charityStage from intake issues; liveUrl when known).
 */
export function buildStageIndex(entries) {
  return (entries || [])
    .filter((e) => e && (e.charityName || e.liveUrl))
    .map((e) => {
      let host = ''
      try {
        if (e.liveUrl) host = new URL(e.liveUrl).host.toLowerCase().replace(/^www\./, '')
      } catch {
        /* unparseable liveUrl — name matching still applies */
      }
      const name = e.charityName || ''
      return {
        charityName: name,
        stage: e.charityStage || 'unknown',
        normName: normalizeToken(name),
        // Many roadmap names ARE the charity's domain; strip the TLD for
        // label-level fuzzy matching (subdomain rows, .com/.org twins).
        normLabel: name.includes('.') ? domainLabel(name) : normalizeToken(name),
        host,
      }
    })
}

/**
 * Fuzzy-match a fleet domain to a roadmap charity: exact liveUrl host or
 * exact normalized-name match first, then a unique substring match on the
 * domain label (>= 6 chars, to avoid junk matches). Returns
 * { stage, charityName } or null (stage unknown).
 */
export function matchCharity(domain, index) {
  const host = String(domain || '')
    .toLowerCase()
    .replace(/^www\./, '')
    .split('/')[0]
  const normHost = normalizeToken(host)
  const label = domainLabel(domain)
  const exact = index.find(
    (e) => (e.host && e.host === host) || (e.normName && e.normName === normHost)
  )
  if (exact) return { stage: exact.stage, charityName: exact.charityName }
  const fuzzy = index.filter(
    (e) =>
      e.normLabel &&
      label &&
      ((label.length >= 6 && e.normLabel.includes(label)) ||
        (e.normLabel.length >= 6 && label.includes(e.normLabel)))
  )
  const stages = new Set(fuzzy.map((e) => e.stage))
  if (fuzzy.length > 0 && stages.size === 1) {
    return { stage: fuzzy[0].stage, charityName: fuzzy[0].charityName }
  }
  return null
}

/**
 * Per-site tiered verdict: both level booleans, the gap class, exactly
 * which of the six checks are missing, and the false-claim flag (a site the
 * roadmap says is pre-501c3 whose footer asserts 501(c)(3) status — legal
 * exposure, flagged prominently).
 */
export function evaluateSite(site) {
  const footer = site.ok ? site.footer : null
  return {
    ...site,
    level1: passesLevel1(footer),
    level2: passesLevel2(footer),
    gapClass: site.ok ? classifyGap(footer) : 'down',
    missingChecks: missingLevelChecks(footer),
    falseClaim: Boolean(site.stage === 'pre-501c3' && footer && footer.statusClaim501c3),
  }
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
  const f = site.footer
  if (!site.error && site.ok && f) {
    // False status claim first: a pre-501c3 charity's footer asserting
    // 501(c)(3) status is legal exposure, not a formatting gap.
    if (site.stage === 'pre-501c3' && f.statusClaim501c3) {
      notes.push('⚠️ false status claim: pre-501c3 site asserts 501(c)(3) status')
    }
    const missing = missingLevelChecks(f)
    if (missing.length > 0) notes.push(`missing: ${missing.map(checkLabel).join(', ')}`)
    // All six positives pass but neither level does: the status line and
    // the Candid/GuideStar link disagree.
    if (missing.length === 0 && !passesLevel1(f) && !passesLevel2(f)) {
      if (f.statusClaim501c3 && !f.guidestarLink) {
        notes.push(
          'has the 501(c)(3) status line but no Candid/GuideStar link ' +
            '(add the link for L2, or strip the status line for L1)'
        )
      }
    }
    // A confirmed-501c3 charity resting at Level 1 still owes the Level-2
    // additions.
    if (site.stage === '501c3' && passesLevel1(f) && !passesLevel2(f)) {
      notes.push('passes L1 only; stage 501c3 expects L2 (add Candid/GuideStar link + status line)')
    }
    // Attribution present but in legacy wording — accepted, yet flagged so
    // the rollout of the target "Supported by" standard is visible per site.
    if (hasAttribution(f) && !f.supportedBy) {
      notes.push('legacy attribution wording (target: "Supported by")')
    }
  }
  return notes.join('; ')
}

// ---------------------------------------------------------------------------
// Report rendering (pure)
// ---------------------------------------------------------------------------

const mark = (v) => (v ? 'yes' : 'no')
const httpsCell = (s) => (s.httpsOk === null || s.httpsOk === undefined ? '—' : mark(s.httpsOk))

/** Summary counts across all audited sites (levels, gap classes, checks). */
export function buildSummary(sites) {
  const reachable = sites.filter((s) => s.ok)
  const down = sites.filter((s) => !s.ok)
  const checkCount = (key) => reachable.filter((s) => s.footer && s.footer[key]).length
  const gapClasses = {}
  for (const cls of GAP_CLASSES) {
    gapClasses[cls] = reachable.filter((s) => classifyGap(s.footer) === cls).length
  }
  const stages = { '501c3': 0, 'pre-501c3': 0, unknown: 0 }
  for (const s of sites) {
    const stage = s.stage === '501c3' || s.stage === 'pre-501c3' ? s.stage : 'unknown'
    stages[stage]++
  }
  return {
    total: sites.length,
    reachable: reachable.length,
    down: down.length,
    levels: {
      level1: reachable.filter((s) => passesLevel1(s.footer)).length,
      level2: reachable.filter((s) => passesLevel2(s.footer)).length,
    },
    gapClasses,
    stages,
    falseClaims: reachable.filter(
      (s) => s.stage === 'pre-501c3' && s.footer && s.footer.statusClaim501c3
    ).length,
    checks: {
      footerMarker: checkCount('footerMarker'),
      ffcLink: checkCount('ffcLink'),
      hubLink: checkCount('hubLink'),
      ein: checkCount('ein'),
      // Either accepted attribution wording…
      attribution: reachable.filter((s) => hasAttribution(s.footer)).length,
      // …and, separately, the target wording, so rollout progress is visible.
      supportedBy: checkCount('supportedBy'),
      copyrightCurrentYear: checkCount('copyrightCurrentYear'),
      guidestarLink: checkCount('guidestarLink'),
      statusClaim501c3: checkCount('statusClaim501c3'),
    },
  }
}

/** Stage cell: known roadmap stage, or "unknown". */
const stageCell = (s) => (s.stage === '501c3' || s.stage === 'pre-501c3' ? s.stage : 'unknown')

/**
 * Level verdict cell. Where the stage is known the site is judged against
 * its own level; where it is unknown BOTH level verdicts are reported.
 */
export function levelCell(s) {
  if (!s.ok) return '—'
  const l1 = passesLevel1(s.footer)
  const l2 = passesLevel2(s.footer)
  if (s.stage === '501c3') return l2 ? 'L2 pass' : 'L2 FAIL'
  if (s.stage === 'pre-501c3') return l1 ? 'L1 pass' : 'L1 FAIL'
  return `L1 ${l1 ? 'pass' : 'fail'} / L2 ${l2 ? 'pass' : 'fail'}`
}

/** Render the gap-classified markdown report. */
export function buildMarkdownReport(sites, generatedAt, knownDown = []) {
  const evaluated = sites.map(evaluateSite)
  const summary = buildSummary(sites)
  const down = evaluated.filter((s) => !s.ok)
  const reachable = evaluated.filter((s) => s.ok)
  const falseClaims = reachable.filter((s) => s.falseClaim)
  const quickWins = reachable.filter((s) => s.gapClass === 'attribution-only')
  const structural = reachable.filter((s) => s.gapClass === 'structural')
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
  lines.push('>')
  lines.push('> Footers are judged against the **two-level standard**: **Level 1**')
  lines.push('> (pre-501c3) = FFC attribution + FFC link, hub link, EIN, current-year')
  lines.push('> copyright, FFC marker — and **no** 501(c)(3) status claim. **Level 2**')
  lines.push('> (full 501c3) = everything in Level 1 plus the Candid/GuideStar profile')
  lines.push('> link and the 501(c)(3) status line. Charity stage joins from')
  lines.push('> `public/data/roadmap.json`; unknown-stage sites report both verdicts.')
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
    `- **Level 2 (full 501c3) passes:** ${summary.levels.level2} / ${summary.reachable} reachable`
  )
  lines.push(
    `- **Level 1 (pre-501c3) passes:** ${summary.levels.level1} / ${summary.reachable} reachable`
  )
  lines.push(
    `- **Gap classes (reachable):** compliant-L2 ${summary.gapClasses['compliant-L2']}, ` +
      `compliant-L1 ${summary.gapClasses['compliant-L1']}, ` +
      `attribution-only ${summary.gapClasses['attribution-only']} (one-line quick wins), ` +
      `partial ${summary.gapClasses.partial}, structural ${summary.gapClasses.structural}`
  )
  lines.push(
    `- **Stage join (roadmap.json):** 501c3 ${summary.stages['501c3']}, ` +
      `pre-501c3 ${summary.stages['pre-501c3']}, unknown ${summary.stages.unknown}`
  )
  lines.push(`- **⚠️ False 501(c)(3) status claims (pre-501c3 sites):** ${summary.falseClaims}`)
  lines.push(
    `- Individual checks (of ${summary.reachable} reachable): FFC marker ${summary.checks.footerMarker}, ` +
      `FFC link ${summary.checks.ffcLink}, hub link ${summary.checks.hubLink}, ` +
      `EIN ${summary.checks.ein}, attribution (either wording) ${summary.checks.attribution}, ` +
      `"Supported by" target wording ${summary.checks.supportedBy}, ` +
      `current-year copyright ${summary.checks.copyrightCurrentYear}, ` +
      `Candid/GuideStar link ${summary.checks.guidestarLink}, ` +
      `501(c)(3) status line ${summary.checks.statusClaim501c3}`
  )
  lines.push('')
  if (falseClaims.length > 0) {
    lines.push('## ⚠️ False 501(c)(3) status claims (legal exposure — fix first)')
    lines.push('')
    lines.push('These sites are **pre-501c3** per the roadmap, but their footers assert')
    lines.push('501(c)(3) status. Strip the status line from each footer immediately.')
    lines.push('')
    lines.push('| Charity | Stage | Problem |')
    lines.push('| ------- | ----- | ------- |')
    for (const s of falseClaims) {
      lines.push(`| ${s.domain} | pre-501c3 | footer asserts 501(c)(3) status |`)
    }
    lines.push('')
  }
  if (quickWins.length > 0) {
    lines.push('## Attribution-only quick wins (close now)')
    lines.push('')
    lines.push('Substantively FFC-footered sites missing ONLY the attribution wording')
    lines.push('and/or hub link — each closable with a one-line footer edit.')
    lines.push('')
    lines.push('| Charity | Stage | Missing |')
    lines.push('| ------- | ----- | ------- |')
    for (const s of quickWins) {
      lines.push(
        `| ${s.domain} | ${stageCell(s)} | ${s.missingChecks.map(checkLabel).join(', ')} |`
      )
    }
    lines.push('')
  }
  if (structural.length > 0) {
    lines.push('## Structural gaps (full adoption-checklist retrofit)')
    lines.push('')
    lines.push('No FFC footer elements at all — each needs the full retrofit per')
    lines.push('[footer-standard-adoption-checklist.md](./footer-standard-adoption-checklist.md).')
    lines.push('')
    lines.push('| Charity | Stage |')
    lines.push('| ------- | ----- |')
    for (const s of structural) lines.push(`| ${s.domain} | ${stageCell(s)} |`)
    lines.push('')
  }
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
  lines.push('## Section A — FFC footer standard by level')
  lines.push('')
  lines.push('| Charity | Status | HTTPS | Stage | Level verdict | Gap class | Notes |')
  lines.push('| ------- | ------ | ----- | ----- | ------------- | --------- | ----- |')
  for (const s of evaluated) {
    lines.push(
      `| ${s.domain} | ${s.error ? 'DOWN' : s.httpStatus} | ${httpsCell(s)} | ` +
        `${s.ok ? stageCell(s) : '—'} | ${levelCell(s)} | ` +
        `${s.ok ? s.gapClass : '—'} | ${buildNotes(s)} |`
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
  let stageIndex = []
  try {
    stageIndex = buildStageIndex(JSON.parse(readFileSync(ROADMAP_PATH, 'utf8')).entries)
  } catch (err) {
    console.warn(`Stage join unavailable (${err.message}); all stages will be "unknown".`)
  }
  console.log(
    `Auditing ${fleet.length} charity sites (Live + Redirect); ` +
      `${knownDown.length} more already marked Unreachable/Error in the CSV (listed, not probed)...`
  )

  const results = []
  for (const entry of fleet) {
    const matched = matchCharity(entry.domain, stageIndex)
    const probed = await probeSite({
      ...entry,
      stage: matched ? matched.stage : 'unknown',
      matchedCharity: matched ? matched.charityName : null,
    })
    const site = evaluateSite(probed)
    results.push(site)
    const verdict = site.error ? `DOWN (${site.error})` : `${site.httpStatus} ${site.gapClass}`
    console.log(`  ${site.domain}: ${verdict}${site.falseClaim ? ' ⚠️ FALSE STATUS CLAIM' : ''}`)
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
    `\nDone: L2 ${summary.levels.level2} / L1 ${summary.levels.level1} of ${summary.reachable} reachable; ` +
      `gap classes: compliant-L2 ${summary.gapClasses['compliant-L2']}, ` +
      `compliant-L1 ${summary.gapClasses['compliant-L1']}, ` +
      `attribution-only ${summary.gapClasses['attribution-only']}, ` +
      `partial ${summary.gapClasses.partial}, structural ${summary.gapClasses.structural}; ` +
      `false claims ${summary.falseClaims}; ${summary.down} down of ${summary.total} audited ` +
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
