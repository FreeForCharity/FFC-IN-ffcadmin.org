/**
 * Server-side loaders for the Sites List: read the committed CSV snapshots at
 * build time. All pure helpers live in (and are re-exported from) sitesShared.ts.
 */
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { relativeAge } from '@/lib/dashboardData'
import { SITE_OWNERS } from '@/data/site-owners'
import { SiteData, isLeftFfc, deriveTier, coerceDeadTier, diffSummary } from './sitesShared'

export * from './sitesShared'

function parseCsvFile(file: string): Record<string, string>[] {
  const fileContent = fs.readFileSync(path.join(process.cwd(), 'docs', file), 'utf8')
  return parse(fileContent, { columns: true, skip_empty_lines: true, trim: true })
}

// Previous snapshot, kept by update-sites-data.yml before each refresh (#425).
// Returns null when no snapshot exists yet — diffing degrades to "no changes".
function loadPrevSnapshot(): Map<string, Record<string, string>> | null {
  try {
    const records = parseCsvFile('sites_list.prev.csv')
    return new Map(records.map((r) => [r['Domain'] || '', r]))
  } catch {
    return null
  }
}

export function loadSites(): SiteData[] {
  const records = parseCsvFile('sites_list.csv')
  const prev = loadPrevSnapshot()
  return records.map((r) => ({
    section: r['Section'] || '',
    domain: r['Domain'] || '',
    status: r['Status'] || '',
    inWhmcs: r['In WHMCS'] || '',
    inCloudflare: r['In Cloudflare'] || '',
    inWpmudev: r['In WPMUDEV'] || '',
    serverInUse: r['Server In Use'] || '',
    oldServerAbandoned: r['Old Server Abandoned?'] || '',
    notes: r['Notes'] || '',
    cloudflareIp: r['Cloudflare IP'] || '',
    repoUrl: r['Repo URL'] || '',
    siteHealth: r['Site Health'] || '',
    priority: r['Priority'] || 'Standard',
    repoArchived: r['Repo Archived'] || '',
    lastPrClosed: r['Last PR Closed'] || '',
    openPrs: r['Open PRs'] || '',
    lastCommit: r['Last Commit'] || '',
    devStatus: r['Dev Status'] || '',
    leftFfc: isLeftFfc(r) ? 'Yes' : '',
    workTier: coerceDeadTier(r['Work Tier'] || deriveTier(r), r),
    hostCategory: r['Host Category'] || '',
    isStaging: r['Is Staging'] || '',
    domainAge: r['Domain Age'] || '',
    expiry: r['Expiry'] || '',
    recurring: r['Recurring'] || '',
    migrationScore: Number(r['Migration Score'] || 0),
    maintenanceScore: Number(r['Maintenance Score'] || 0),
    devScore: Number(r['Dev Score'] || 0),
    sslExpiry: r['SSL Expiry'] || '',
    nsMatch: r['NS Match'] || '',
    redirectTarget: r['Redirect Target'] || '',
    lighthouse: r['Lighthouse'] || '',
    owner: SITE_OWNERS[(r['Domain'] || '').toLowerCase()] || '',
    changed: prev ? diffSummary(prev.get(r['Domain'] || ''), r) : '',
  }))
}

export function dataRefreshedAge(): string {
  try {
    const stat = fs.statSync(path.join(process.cwd(), 'docs', 'sites_list.csv'))
    return relativeAge(stat.mtime.toISOString())
  } catch {
    return ''
  }
}
