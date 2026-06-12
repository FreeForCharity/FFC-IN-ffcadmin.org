/**
 * Pure, client-safe Sites List domain logic: types, derivations, badges, and
 * quick-link builders. No fs/node imports — the interactive explorer (a client
 * component) imports from here, while server-side loaders live in sitesData.ts.
 */

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
  // Optional pipeline columns (#418–#421): empty until the upstream
  // FFC-Cloudflare-Automation generator emits them; UI renders them
  // only when present (see docs/data-contracts.md).
  sslExpiry: string
  nsMatch: string
  redirectTarget: string
  lighthouse: string
  // Repo-maintained enrichment (#422) and refresh diff (#425).
  owner: string
  changed: string
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

const DIFF_FIELDS: [string, string][] = [
  ['Site Health', 'Health'],
  ['Status', 'Status'],
  ['Work Tier', 'Tier'],
  ['Server In Use', 'Server'],
]

/** Human summary of what changed for a domain since the previous snapshot, or ''. */
export function diffSummary(
  prev: Record<string, string> | undefined,
  curr: Record<string, string>
): string {
  if (!prev) return 'New since last refresh'
  const changes = DIFF_FIELDS.filter(([col]) => (prev[col] || '') !== (curr[col] || '')).map(
    ([col, label]) => `${label}: ${prev[col] || '—'} → ${curr[col] || '—'}`
  )
  return changes.join('; ')
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

// ---------------------------------------------------------------------------
// Per-row quick-action links (#410, #411, #423)
// ---------------------------------------------------------------------------

/** Cloudflare DNS-records tab for the domain's zone, or '' when not in FFC Cloudflare. */
export function cloudflareDnsRecordsUrl(s: Pick<SiteData, 'domain' | 'inCloudflare'>): string {
  const zone = cloudflareZoneUrl(s)
  return zone ? `${zone}/dns/records` : ''
}

/** Public DNS propagation checker for the domain's A record. */
export function dnsCheckerUrl(domain: string): string {
  const d = (domain || '').trim()
  return d ? `https://dnschecker.org/#A/${encodeURIComponent(d)}` : ''
}

/** GitHub Pages settings for migrated sites — repo + served from GitHub Pages. */
export function pagesSettingsUrl(s: Pick<SiteData, 'repoUrl' | 'serverInUse'>): string {
  if (!s.repoUrl || !(s.serverInUse || '').toLowerCase().includes('github pages')) return ''
  return `${s.repoUrl}/settings/pages`
}

const THIS_REPO = 'https://github.com/FreeForCharity/FFC-IN-ffcadmin.org'

/** Prefilled new-issue link: the site's own repo when it has one, else this repo. */
export function newIssueUrl(
  s: Pick<SiteData, 'domain' | 'repoUrl' | 'workTier' | 'siteHealth' | 'serverInUse'>
): string {
  const repo = s.repoUrl || THIS_REPO
  const title = encodeURIComponent(`[${s.domain}] `)
  const body = encodeURIComponent(
    `Domain: ${s.domain}\nWork tier: ${s.workTier}\nHealth: ${s.siteHealth || 'unknown'}\nServer: ${s.serverInUse || 'unknown'}\n\n(Filed from the FFC Sites List.)\n`
  )
  return `${repo}/issues/new?title=${title}&body=${body}`
}

/** Single-line Markdown summary of a row, for the copy quick-action (#409). */
export function rowMarkdown(
  s: Pick<SiteData, 'domain' | 'workTier' | 'siteHealth' | 'serverInUse' | 'repoUrl'>
): string {
  const parts = [
    `**${s.domain}**`,
    `tier: ${s.workTier}`,
    `health: ${s.siteHealth || 'unknown'}`,
    `server: ${s.serverInUse || 'unknown'}`,
  ]
  if (s.repoUrl) parts.push(`repo: ${s.repoUrl}`)
  return parts.join(' — ')
}

// ---------------------------------------------------------------------------
// Migration progress (#424) — derived entirely from existing CSV fields.
// ---------------------------------------------------------------------------

export interface MigrationStep {
  label: string
  done: boolean
}

export function migrationSteps(
  s: Pick<SiteData, 'inCloudflare' | 'repoUrl' | 'serverInUse' | 'siteHealth'>
): MigrationStep[] {
  return [
    { label: 'DNS in Cloudflare', done: (s.inCloudflare || '').toLowerCase() === 'yes' },
    { label: 'GitHub repo created', done: Boolean(s.repoUrl) },
    {
      label: 'Served from GitHub Pages',
      done: (s.serverInUse || '').toLowerCase().includes('github pages'),
    },
    { label: 'Site live', done: healthCategory(s.siteHealth) === 'live' },
  ]
}

// ---------------------------------------------------------------------------
// Optional data-signal badges (#418, #421)
// ---------------------------------------------------------------------------

/** Whole days until an ISO-ish date, or null when unparseable/empty. */
export function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null
  const t = Date.parse(dateStr)
  if (Number.isNaN(t)) return null
  return Math.floor((t - Date.now()) / 86_400_000)
}

/** Badge classes for an SSL-expiry date: red ≤ 14 days, amber ≤ 30, green beyond. */
export function sslBadge(dateStr: string): string {
  const days = daysUntil(dateStr)
  if (days === null) return 'text-gray-600 bg-gray-100 border-gray-200'
  if (days <= 14) return 'text-red-700 bg-red-100 border-red-200'
  if (days <= 30) return 'text-yellow-700 bg-yellow-100 border-yellow-200'
  return 'text-green-700 bg-green-100 border-green-200'
}

/** Badge classes for a 0–100 Lighthouse score (standard LH thresholds). */
export function lighthouseBadge(score: number): string {
  if (score >= 90) return 'text-green-700 bg-green-100 border-green-200'
  if (score >= 50) return 'text-yellow-700 bg-yellow-100 border-yellow-200'
  return 'text-red-700 bg-red-100 border-red-200'
}

// ---------------------------------------------------------------------------
// Snapshot freshness (#416). File mtime is useless in CI (fresh clone), so we
// date the snapshot by the newest GitHub-activity timestamp the generator
// captured — the data can't know about anything after it was generated.
// ---------------------------------------------------------------------------

export function dataGeneratedAt(sites: Pick<SiteData, 'lastCommit' | 'lastPrClosed'>[]): string {
  let max = ''
  for (const s of sites) {
    for (const d of [s.lastCommit, s.lastPrClosed]) {
      if (d && !Number.isNaN(Date.parse(d)) && d > max) max = d
    }
  }
  return max
}

export const SNAPSHOT_STALE_DAYS = 8 // weekly sync cadence + 1 day of grace

export function dataIsStale(
  sites: Pick<SiteData, 'lastCommit' | 'lastPrClosed'>[],
  maxDays: number = SNAPSHOT_STALE_DAYS
): boolean {
  const newest = dataGeneratedAt(sites)
  if (!newest) return false // no signal — don't cry wolf
  return Date.now() - Date.parse(newest) > maxDays * 86_400_000
}
