/**
 * Server-side loaders for the committed dashboard JSON (#337).
 *
 * Files are produced by scheduled GitHub Actions (see docs/data-contracts.md)
 * and read at build time. Loaders never throw: a missing/invalid file returns
 * null so dashboards degrade gracefully.
 */
import fs from 'fs'
import path from 'path'

export interface CiWorkflowStatus {
  name: string
  status: string
  conclusion: string | null
  headBranch?: string
  runUrl?: string
  updatedAt?: string
}

export interface CiStatusData {
  generatedAt: string
  seed?: boolean
  repo: string
  workflows: CiWorkflowStatus[]
}

export type ExpiryBucket = 'expired' | 'expiring30' | 'expiring60' | 'expiring90' | 'ok' | 'unknown'

export interface DomainExpiryEntry {
  domain: string
  expiresAt: string | null
  daysRemaining: number | null
  registrar?: string
  bucket: ExpiryBucket
}

export interface DomainExpiryData {
  generatedAt: string
  seed?: boolean
  source: string
  summary: Record<'total' | ExpiryBucket, number>
  domains: DomainExpiryEntry[]
}

function readJson<T>(file: string): T | null {
  try {
    const full = path.join(process.cwd(), 'public', 'data', file)
    return JSON.parse(fs.readFileSync(full, 'utf8')) as T
  } catch {
    return null
  }
}

export function loadCiStatus(): CiStatusData | null {
  return readJson<CiStatusData>('ci-status.json')
}

export function loadDomainExpiry(): DomainExpiryData | null {
  return readJson<DomainExpiryData>('domain-expiry.json')
}

/** True when `generatedAt` is older than `maxAgeDays` (or unparseable). */
export function isStale(generatedAt: string | undefined, maxAgeDays: number): boolean {
  if (!generatedAt) return true
  const t = Date.parse(generatedAt)
  if (Number.isNaN(t)) return true
  return Date.now() - t > maxAgeDays * 86_400_000
}

/** Human "x days ago" / "today" from an ISO timestamp. */
export function relativeAge(generatedAt: string | undefined): string {
  if (!generatedAt) return 'unknown'
  const t = Date.parse(generatedAt)
  if (Number.isNaN(t)) return 'unknown'
  const days = Math.floor((Date.now() - t) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}
