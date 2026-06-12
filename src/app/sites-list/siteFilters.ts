/**
 * Pure filter/search engine for the Sites List explorer (#412–#415, #426).
 * Client-safe (no node imports); unit-tested in __tests__/site-filters.test.ts.
 */
import { SiteData, healthCategory } from './sitesShared'

export interface FilterState {
  q: string // free-text domain/repo search
  health: string // '', live, redirect, error, unreachable, unknown, problem
  tier: string // '', 1–6
  host: string // '', exact Host Category value
  cf: string // '', yes, no
  repo: string // '', yes, no
}

export const EMPTY_FILTERS: FilterState = {
  q: '',
  health: '',
  tier: '',
  host: '',
  cf: '',
  repo: '',
}

export function hasActiveFilters(f: FilterState): boolean {
  return Object.values(f).some(Boolean)
}

export function matchesFilters(s: SiteData, f: FilterState): boolean {
  if (f.q) {
    const q = f.q.toLowerCase()
    if (!s.domain.toLowerCase().includes(q) && !s.repoUrl.toLowerCase().includes(q)) return false
  }
  if (f.health) {
    const cat = healthCategory(s.siteHealth)
    if (f.health === 'problem' ? !(cat === 'error' || cat === 'unreachable') : cat !== f.health)
      return false
  }
  if (f.tier && !s.workTier.startsWith(f.tier)) return false
  if (f.host && s.hostCategory !== f.host) return false
  if (f.cf && (s.inCloudflare.toLowerCase() === 'yes' ? 'yes' : 'no') !== f.cf) return false
  if (f.repo && (s.repoUrl ? 'yes' : 'no') !== f.repo) return false
  return true
}

export function filterSites(sites: SiteData[], f: FilterState): SiteData[] {
  if (!hasActiveFilters(f)) return sites
  return sites.filter((s) => matchesFilters(s, f))
}

/** One-click preset chips for the team's recurring slices (#413). */
export const FILTER_PRESETS: { label: string; filters: Partial<FilterState> }[] = [
  { label: '🔥 Errored or unreachable', filters: { health: 'problem' } },
  { label: '🚚 Needs migration', filters: { tier: '3' } },
  { label: '🌱 No repo yet', filters: { repo: 'no' } },
  { label: '☁️ Not in Cloudflare', filters: { cf: 'no' } },
]

// --- URL sync (#412): only non-empty facets appear in the query string. ---

export function filtersToQuery(f: FilterState): string {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(f)) if (v) params.set(k, v)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function filtersFromQuery(search: string): FilterState {
  const params = new URLSearchParams(search)
  const f = { ...EMPTY_FILTERS }
  for (const k of Object.keys(f) as (keyof FilterState)[]) f[k] = params.get(k) || ''
  return f
}

// --- Export (#426): the currently filtered rows as CSV / JSON. ---

const EXPORT_COLUMNS: [string, (s: SiteData) => string][] = [
  ['Domain', (s) => s.domain],
  ['Work Tier', (s) => s.workTier],
  ['Health', (s) => s.siteHealth],
  ['Server', (s) => s.serverInUse],
  ['Status', (s) => s.status],
  ['In Cloudflare', (s) => s.inCloudflare],
  ['Repo URL', (s) => s.repoUrl],
  ['Open PRs', (s) => s.openPrs],
  ['Last PR Closed', (s) => s.lastPrClosed],
  ['Notes', (s) => s.notes],
]

function csvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function sitesToCsv(sites: SiteData[]): string {
  const header = EXPORT_COLUMNS.map(([h]) => h).join(',')
  const rows = sites.map((s) => EXPORT_COLUMNS.map(([, get]) => csvField(get(s))).join(','))
  return [header, ...rows].join('\n') + '\n'
}

export function sitesToJson(sites: SiteData[]): string {
  return JSON.stringify(
    sites.map((s) => Object.fromEntries(EXPORT_COLUMNS.map(([h, get]) => [h, get(s)]))),
    null,
    2
  )
}
