/**
 * Per-charity gate pipeline — pure stage derivation (v1).
 *
 * Maps each roadmap entry (see `src/app/roadmap/roadmapData.ts`, generated
 * from this repo's `kind:intake` issues + the live-portfolio CSV) onto the
 * gated charity journey of `docs/application-prerequisites-inventory.md`
 * Section 4a: applied → approved → building → validated → domain → email.
 *
 * Kept free of `fs` (same split as `roadmapFilter.ts`) so unit tests and any
 * future client component can import it; only the page touches `loadRoadmap()`.
 *
 * What the data actually supports today (and what it doesn't):
 *
 * - applied    — `status:intake` / `status:needs-info` labels on the work order.
 * - approved   — `status:needs-admin`: the application is approved and the
 *                charity is waiting for a sponsoring admin. `status:on-hold`
 *                also lands here: delivery is paused and the labels don't
 *                record which gate it stalled at, so we keep the most
 *                conservative in-flight reading.
 * - building   — `status:sponsored` / `status:active-build`: the
 *                website-provisioning work order is being executed (Gate 3 in
 *                progress).
 * - validated  — `status:live` with a `github.io` live URL: the site passed
 *                validation on its free GitHub Pages default URL but has no
 *                custom domain yet. FUTURE WORK: derive this from the Gate 3
 *                validation checklist in the work order (or a dedicated
 *                `status:validated` label) instead of the URL heuristic.
 * - domain     — `status:live` with a custom-domain live URL (the WHMCS domain
 *                product isn't in the roadmap snapshot, so the live custom
 *                domain is the observable signal). `status:graduated` also
 *                maps here — it is beyond every stage this data can model.
 * - email      — NOT DERIVABLE YET: the roadmap snapshot carries no
 *                Microsoft 365 / email-product signal from WHMCS. FUTURE WORK:
 *                extend the WHMCS sync (`scripts/whmcs-applications.mjs`) to
 *                surface an email-product-Active flag per charity.
 */
import type { RoadmapEntry } from '../roadmap/roadmapData'

export type PipelineStage = 'applied' | 'approved' | 'building' | 'validated' | 'domain' | 'email'

export interface PipelineStageInfo {
  id: PipelineStage
  label: string
  description: string
}

/** The gates of Section 4a, in journey order (display order of the page). */
export const PIPELINE_STAGES: readonly PipelineStageInfo[] = [
  {
    id: 'applied',
    label: 'Applied',
    description: 'Application received and under review, or waiting on more information.',
  },
  {
    id: 'approved',
    label: 'Approved',
    description:
      'Application approved (Gate 1); waiting for a sponsoring admin or delivery is on hold.',
  },
  {
    id: 'building',
    label: 'Website building',
    description:
      'A sponsoring admin is executing the website-provisioning work order (Gate 3 in progress).',
  },
  {
    id: 'validated',
    label: 'Validated',
    description:
      'Site validated on its free GitHub Pages URL — no custom domain yet. Cleared to order a domain (Gate 4).',
  },
  {
    id: 'domain',
    label: 'Domain live',
    description: 'Site live on its own custom domain, registered or transferred in Cloudflare.',
  },
  {
    id: 'email',
    label: 'Email',
    description:
      'Organizational email provisioned after the domain. Not yet derivable from the sync data — shown for the full journey.',
  },
] as const

/** True when a live URL is still the free GitHub Pages default URL. */
function isGitHubPagesUrl(liveUrl: string): boolean {
  try {
    const host = new URL(liveUrl).hostname.toLowerCase()
    return host === 'github.io' || host.endsWith('.github.io')
  } catch {
    return false
  }
}

/**
 * Derive the journey gate a charity is at from its roadmap entry.
 * See the module comment for exactly which signals back each stage.
 */
export function deriveStage(entry: RoadmapEntry): PipelineStage {
  switch (entry.status) {
    case 'intake':
    case 'needs-info':
      return 'applied'
    case 'needs-admin':
    case 'on-hold':
      return 'approved'
    case 'sponsored':
    case 'active-build':
      return 'building'
    case 'live':
    case 'graduated':
      // Graduated is beyond every stage this data models; a live entry sits at
      // "validated" until its live URL leaves the free github.io default.
      if (entry.status === 'live' && entry.liveUrl && isGitHubPagesUrl(entry.liveUrl)) {
        return 'validated'
      }
      return 'domain'
    default:
      // The status union is exhaustive at compile time, but the entries come
      // from a generated JSON snapshot: a status label this build doesn't know
      // (e.g. a newly introduced status:*) must not crash groupByStage — and
      // with it the whole static build. Bucket unknowns conservatively as
      // "applied".
      return 'applied'
  }
}

/** Group entries by derived stage; every stage key is present (possibly empty). */
export function groupByStage(entries: RoadmapEntry[]): Record<PipelineStage, RoadmapEntry[]> {
  const groups: Record<PipelineStage, RoadmapEntry[]> = {
    applied: [],
    approved: [],
    building: [],
    validated: [],
    domain: [],
    email: [],
  }
  for (const entry of entries) groups[deriveStage(entry)].push(entry)
  for (const stage of Object.keys(groups) as PipelineStage[]) {
    groups[stage].sort((a, b) => a.charityName.localeCompare(b.charityName))
  }
  return groups
}
