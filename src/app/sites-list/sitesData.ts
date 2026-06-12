import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { relativeAge } from '@/lib/dashboardData'

export interface SiteData {
  section: string
  domain: string
  status: string
  inWhmcs: string
  inCloudflare: string
  inWpmudev: string
  serverInUse: string
  oldServerAbandoned: string
  notes: string
  cloudflareIp: string
  repoUrl: string
  siteHealth: string
  priority: string
  repoArchived: string
  lastPrClosed: string
  openPrs: string
  lastCommit: string
  devStatus: string
  workTier: string
  leftFfc: string
  // Persona-view enrichment
  hostCategory: string
  isStaging: string
  domainAge: string
  expiry: string
  recurring: string
  migrationScore: number
  maintenanceScore: number
  devScore: number
}

export const HARD_DEAD = ['expired', 'cancelled', 'fraud', 'terminated']

// FFC's Cloudflare account ID — a non-secret identifier used to build dashboard
// deep-links. The per-zone overview lives at dash.cloudflare.com/<account>/<domain>.
export const FFC_CLOUDFLARE_ACCOUNT_ID = '0fa33828a8a294ba7c3e945cec827f12'

// Quick-link to a domain's Cloudflare zone overview, when FFC manages its DNS.
// Returns '' when the site isn't in FFC Cloudflare (no useful destination).
export function cloudflareZoneUrl(s: Pick<SiteData, 'domain' | 'inCloudflare'>): string {
  const domain = (s.domain || '').trim()
  if ((s.inCloudflare || '').toLowerCase() !== 'yes' || !domain) return ''
  return `https://dash.cloudflare.com/${FFC_CLOUDFLARE_ACCOUNT_ID}/${encodeURIComponent(domain)}`
}

export function derivedLeftFfc(r: Record<string, string>): boolean {
  return (
    (r['Status'] || '').toLowerCase() === 'transferred away' &&
    (r['In Cloudflare'] || '').toLowerCase() !== 'yes'
  )
}

// Trust the generator's explicit Left FFC column when enriched; else derive it.
export function isLeftFfc(r: Record<string, string>): boolean {
  if (r['Work Tier']) return (r['Left FFC'] || '').toLowerCase() === 'yes'
  return derivedLeftFfc(r)
}

export function deriveTier(r: Record<string, string>): string {
  const status = (r['Status'] || '').toLowerCase()
  const server = (r['Server In Use'] || '').toLowerCase()
  if (HARD_DEAD.includes(status) || isLeftFfc(r)) return '6 - Inactive / Archive'
  if (server === 'github pages') return '4 - Done / Stable'
  if (
    ['hostpapa', 'interserver', 'hostinger', 'krystal', 'cloudflare proxy'].some((s) =>
      server.includes(s)
    )
  )
    return '3 - Needs Migration'
  return '5 - Needs Triage'
}

export function coerceDeadTier(tier: string, r: Record<string, string>): string {
  const status = (r['Status'] || '').toLowerCase()
  if (HARD_DEAD.includes(status) || isLeftFfc(r)) return '6 - Inactive / Archive'
  return tier
}

export function loadSites(): SiteData[] {
  const filePath = path.join(process.cwd(), 'docs', 'sites_list.csv')
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const records: Record<string, string>[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })
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

export function healthCategory(
  health: string
): 'live' | 'redirect' | 'error' | 'unreachable' | 'unknown' {
  const h = health.toLowerCase()
  if (h === 'live' || h.includes('200')) return 'live'
  if (h === 'redirect' || h.includes('301') || h.includes('302')) return 'redirect'
  if (h === 'unreachable' || h.includes('no response')) return 'unreachable'
  if (h === 'error' || /\b(4\d\d|5\d\d)\b/.test(h)) return 'error'
  return 'unknown'
}

export function healthBadge(health: string): string {
  switch (healthCategory(health)) {
    case 'live':
      return 'text-green-700 bg-green-100 border-green-200'
    case 'redirect':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200'
    case 'error':
    case 'unreachable':
      return 'text-red-700 bg-red-100 border-red-200'
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200'
  }
}
