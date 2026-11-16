import { SiteData, healthCategory } from './sitesShared'

/** Columns a visitor can sort a tier table by, keyed by header text. */
export const SORTABLE_COLUMNS = [
  'Domain',
  'Last PR',
  'Open PRs',
  'Health',
  'SSL',
  'LH',
  'Owner',
  'Server',
  'Status',
] as const

export type SortColumn = (typeof SORTABLE_COLUMNS)[number]
export type SortDirection = 'ascending' | 'descending'
export interface SortState {
  column: SortColumn
  direction: SortDirection
}

export function isSortable(header: string): header is SortColumn {
  return (SORTABLE_COLUMNS as readonly string[]).includes(header)
}

const HEALTH_ORDER = { live: 1, redirect: 2, error: 3, unreachable: 4, unknown: 5 } as const

/** A comparable value for one cell, or null when the cell is empty. */
function cellValue(s: SiteData, column: SortColumn): string | number | null {
  const text = (v: string) => (v && v.trim() ? v.trim().toLowerCase() : null)
  const num = (v: string) => (v && v.trim() && !Number.isNaN(Number(v)) ? Number(v) : null)
  switch (column) {
    case 'Domain':
      return text(s.domain)
    case 'Last PR':
      return text(s.lastPrClosed)
    case 'Open PRs':
      return num(s.openPrs)
    case 'Health':
      return HEALTH_ORDER[healthCategory(s.siteHealth)]
    case 'SSL':
      return text(s.sslExpiry)
    case 'LH':
      return num(s.lighthouse)
    case 'Owner':
      return text(s.owner)
    case 'Server':
      return text(s.serverInUse)
    case 'Status':
      return text(s.status)
  }
}

/**
 * Sort a copy of `sites` by one column. Empty cells always go last, in both
 * directions, and ties keep their current order (Array.prototype.sort is
 * stable), so the tier's own ordering breaks ties.
 */
export function sortSites(sites: SiteData[], sort: SortState): SiteData[] {
  const sign = sort.direction === 'ascending' ? 1 : -1
  return [...sites].sort((a, b) => {
    const x = cellValue(a, sort.column)
    const y = cellValue(b, sort.column)
    if (x === null || y === null) return x === y ? 0 : x === null ? 1 : -1
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign
    return String(x).localeCompare(String(y), undefined, { numeric: true }) * sign
  })
}

/** Ascending, then descending, then back to the tier's own order. */
export function nextSort(current: SortState | null, column: SortColumn): SortState | null {
  if (!current || current.column !== column) return { column, direction: 'ascending' }
  if (current.direction === 'ascending') return { column, direction: 'descending' }
  return null
}
