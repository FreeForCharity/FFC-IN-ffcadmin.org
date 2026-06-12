/**
 * Generates public/data/sites-alerts.json (#427): a machine-readable feed of
 * actionable site problems — errored/unreachable managed sites and domains
 * approaching expiry — for email/Teams automations to poll.
 *
 * Runs on every build (see the "build" script in package.json), reading the
 * committed sites CSV and the domain-expiry dashboard JSON. No network, no
 * secrets. The output is gitignored: it is derived, not source.
 */
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const root = process.cwd()
const outFile = path.join(root, 'public', 'data', 'sites-alerts.json')

// Mirrors healthCategory in src/app/sites-list/sitesShared.ts (kept tiny here
// so the build-time script stays dependency-free of the TS source tree).
function healthCategory(health) {
  const h = (health || '').toLowerCase()
  if (h === 'live' || h.includes('200')) return 'live'
  if (h === 'redirect' || h.includes('301') || h.includes('302')) return 'redirect'
  if (h === 'unreachable' || h.includes('no response')) return 'unreachable'
  if (h === 'error' || /\b(4\d\d|5\d\d)\b/.test(h)) return 'error'
  return 'unknown'
}

const alerts = []

// --- Health alerts: managed (non-archive) sites that are down. ---
const csv = fs.readFileSync(path.join(root, 'docs', 'sites_list.csv'), 'utf8')
const sites = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
for (const s of sites) {
  const tier = s['Work Tier'] || ''
  if (tier.startsWith('6') || (s['Left FFC'] || '').toLowerCase() === 'yes') continue
  const cat = healthCategory(s['Site Health'])
  if (cat === 'error' || cat === 'unreachable') {
    alerts.push({
      type: 'health',
      severity: 'high',
      domain: s['Domain'],
      detail: `${s['Site Health'] || 'unknown'} (${tier || 'untiered'}, server: ${s['Server In Use'] || 'unknown'})`,
    })
  }
}

// --- Expiry alerts: from the domain-expiry dashboard feed, when present. ---
const severityByBucket = { expired: 'high', expiring30: 'high', expiring60: 'medium' }
try {
  const expiry = JSON.parse(
    fs.readFileSync(path.join(root, 'public', 'data', 'domain-expiry.json'), 'utf8')
  )
  for (const d of expiry.domains || []) {
    const severity = severityByBucket[d.bucket]
    if (!severity) continue
    alerts.push({
      type: 'expiry',
      severity,
      domain: d.domain,
      detail: `Domain ${d.bucket === 'expired' ? 'EXPIRED' : 'expires'} ${d.expiresAt || 'soon'}${
        d.daysRemaining != null ? ` (${d.daysRemaining} days)` : ''
      }`,
    })
  }
} catch {
  // No expiry feed available — health alerts alone are still useful.
}

const summary = {}
for (const a of alerts) summary[a.type] = (summary[a.type] || 0) + 1

const severityRank = { high: 0, medium: 1, low: 2 }
const feed = {
  generatedAt: new Date().toISOString(),
  source: 'docs/sites_list.csv + public/data/domain-expiry.json',
  docs: 'https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/docs/data-contracts.md',
  summary: { total: alerts.length, ...summary },
  alerts: alerts.sort(
    (a, b) =>
      severityRank[a.severity] - severityRank[b.severity] || a.domain.localeCompare(b.domain)
  ),
}

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify(feed, null, 2) + '\n')
console.log(`sites-alerts.json: ${alerts.length} alerts written.`)
