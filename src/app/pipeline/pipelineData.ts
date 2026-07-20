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
 *                progress). A live-labelled entry whose Gate-3 checklist is
 *                only partially ticked also sits here — the checklist, not the
 *                label, is the objective Gate-3 signal.
 * - validated  — the Gate-3 validation checklist on the work order (embedded by
 *                `scripts/lib/intake-issues.mjs` `stubBody`, parsed by
 *                `scripts/generate-roadmap-data.ts` into
 *                `validationTicked`/`validationTotal`) is FULLY ticked and the
 *                site has no custom domain yet. Entries without checklist data
 *                (pre-checklist stubs, portfolio rows) fall back to the older
 *                heuristic: `status:live` with a `github.io` live URL.
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
      'Gate-3 validation checklist fully ticked on the work order — no custom domain yet. Cleared to order a domain (Gate 4).',
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

/** Ticked vs total items of a Gate-3 validation checklist. */
export interface ValidationProgress {
  ticked: number
  total: number
}

/**
 * Parse the Gate-3 validation checklist out of a work-order issue body.
 *
 * The checklist lives under the `### Validation checklist (Gate 3)` heading
 * that `scripts/lib/intake-issues.mjs` (`stubBody`) embeds last in every
 * work-order stub. The section runs from that heading to the next heading of
 * the same-or-higher level (in practice: end of body). Returns the ticked/total
 * counts, or `null` when the body has no checklist section or the section has
 * no checkbox items — pre-checklist stubs and portfolio entries stay `null` so
 * consumers can fall back to older heuristics.
 *
 * Used by `scripts/generate-roadmap-data.ts` at snapshot-generation time; kept
 * here (fs-free) so the parsing contract is unit-testable alongside the stage
 * derivation that consumes its output.
 */
export function parseValidationChecklist(
  body: string | null | undefined
): ValidationProgress | null {
  if (!body) return null
  const normalized = body.replace(/\r\n/g, '\n')
  const headingMatch = /^(#{2,4})\s+Validation checklist.*$/im.exec(normalized)
  if (!headingMatch) return null
  const level = headingMatch[1].length
  const rest = normalized.slice(headingMatch.index + headingMatch[0].length)
  // Section ends at the next heading of the same or higher level, else at EOF.
  const nextHeading = new RegExp(`^#{1,${level}}\\s`, 'm').exec(rest)
  const section = nextHeading ? rest.slice(0, nextHeading.index) : rest
  const boxes = section.match(/^\s*[-*+]\s+\[( |x|X)\]/gm) ?? []
  if (boxes.length === 0) return null
  const ticked = boxes.filter((b) => /\[[xX]\]$/.test(b)).length
  return { ticked, total: boxes.length }
}

/**
 * The entry's Gate-3 checklist progress, when the snapshot carries it.
 * `null` for entries generated before the checklist fields existed (backward
 * compatibility) and for portfolio/self entries that never had a work order.
 */
export function validationProgress(entry: RoadmapEntry): ValidationProgress | null {
  if (typeof entry.validationTotal !== 'number' || entry.validationTotal <= 0) return null
  return { ticked: entry.validationTicked ?? 0, total: entry.validationTotal }
}

/** True when the work order carries a checklist and every box is ticked. */
function checklistComplete(entry: RoadmapEntry): boolean | null {
  const progress = validationProgress(entry)
  return progress ? progress.ticked >= progress.total : null
}

/**
 * Derive the journey gate a charity is at from its roadmap entry.
 * See the module comment for exactly which signals back each stage.
 */
export function deriveStage(entry: RoadmapEntry): PipelineStage {
  switch (entry.status) {
    case 'sponsored':
    case 'active-build':
      // A fully ticked Gate-3 checklist means the site is validated even if
      // the status label hasn't been flipped yet — the checklist is the
      // objective signal (docs Section 4b), the label follows it.
      return checklistComplete(entry) === true ? 'validated' : 'building'
    case 'intake':
    case 'needs-info':
      return 'applied'
    case 'needs-admin':
    case 'on-hold':
      return 'approved'
    case 'live':
    case 'graduated':
      // Graduated is beyond every stage this data models, and a live custom
      // domain always means the domain gate was passed.
      if (entry.status === 'graduated' || (entry.liveUrl && !isGitHubPagesUrl(entry.liveUrl))) {
        return 'domain'
      }
      // No custom domain yet: the Gate-3 checklist decides validated vs still
      // building. Entries without checklist data keep the older heuristic — a
      // live entry on its github.io default URL counts as validated, and a
      // live entry without any URL falls through to "domain" as before.
      switch (checklistComplete(entry)) {
        case true:
          return 'validated'
        case false:
          return 'building'
        default:
          return entry.liveUrl ? 'validated' : 'domain'
      }
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
