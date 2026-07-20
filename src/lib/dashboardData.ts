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

export type FleetSmokeState =
  | 'passing'
  | 'failing'
  | 'running'
  | 'stale-monitor'
  | 'not-cutover'
  | 'not-deployed'
  | 'pending'
  | 'unknown'

export interface FleetSmokeSite {
  repo: string
  // Serving identity resolved from the Pages API `cname` (#742) — the domain the
  // site is actually served on; null when served on the default *.github.io URL.
  domain: string | null
  // The committed public/CNAME file value (the build's claim of a domain), kept
  // as a secondary field so drift from `domain` stays visible; null when absent.
  cnameFile?: string | null
  state: FleetSmokeState
  smoke: {
    status: string
    conclusion: string | null
    event: string
    runUrl: string
    updatedAt: string
  } | null
  // State of the site's "Post-Deploy Smoke Test" workflow: 'active', a GitHub
  // disabled reason (e.g. 'disabled_inactivity'), or the sentinel 'missing'
  // when the workflow is absent from the repo. null means the state is unknown
  // (the workflows list could not be read) — NOT treated as stopped. Any string
  // value other than 'active' means the daily pass has stopped.
  smokeWorkflowState?: string | null
  // Human-readable reason a site is in the 'stale-monitor' state (null otherwise).
  staleReason?: string | null
  failureIssue: { number: number; url: string } | null
}

export interface FleetSmokeData {
  generatedAt: string
  org: string
  repoCount: number
  summary: Record<FleetSmokeState, number>
  sites: FleetSmokeSite[]
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

// Agentic OS status feed (#723). Produced by the hub's
// scripts/generate-agentic-os-status.py and synced daily by workflow 502.
export interface AgenticIssue {
  number: number
  title: string
  state: string
  assignee: string | null
  updated_at: string
  url: string
  labels: string[]
}

export interface AgenticPr extends AgenticIssue {
  draft: boolean
}

export interface AgenticLogEntry {
  author: string | null
  created_at: string
  body: string
  truncated: boolean
  url: string
}

export interface AgenticGate {
  run_id: number
  workflow_name: string | null
  environment: string | null
  created_at: string
  url: string
}

export interface AgenticOsStatusData {
  generated_at: string
  repo: string
  backlog_issues: AgenticIssue[]
  in_flight_prs: AgenticPr[]
  conductor_log: AgenticLogEntry[]
  pending_gates: AgenticGate[]
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
  const data = readJson<CiStatusData>('ci-status.json')
  // Shape guard: a syntactically valid but malformed file degrades to null.
  if (!data || !Array.isArray(data.workflows)) return null
  return data
}

export function loadFleetSmoke(): FleetSmokeData | null {
  const data = readJson<FleetSmokeData>('fleet-smoke-status.json')
  if (!data || !Array.isArray(data.sites)) return null
  return data
}

export function loadDomainExpiry(): DomainExpiryData | null {
  const data = readJson<DomainExpiryData>('domain-expiry.json')
  if (!data || typeof data.summary !== 'object' || !Array.isArray(data.domains)) return null
  return data
}

export function loadAgenticOsStatus(): AgenticOsStatusData | null {
  const data = readJson<AgenticOsStatusData>('agentic-os-status.json')
  // Shape guard: a syntactically valid but malformed file degrades to null.
  // `generated_at`/`repo` are rendered directly in JSX, so they must be
  // strings — a non-primitive would throw at render, breaking the static
  // export the loader promises never to break.
  if (
    !data ||
    typeof data.generated_at !== 'string' ||
    typeof data.repo !== 'string' ||
    !Array.isArray(data.backlog_issues) ||
    !Array.isArray(data.in_flight_prs) ||
    !Array.isArray(data.conductor_log) ||
    !Array.isArray(data.pending_gates)
  )
    return null
  return data
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
