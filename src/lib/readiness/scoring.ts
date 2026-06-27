/**
 * Readiness scoring — pure compute function.
 *
 * `computeReadiness(intake)` returns the numeric score, the public tier label,
 * a per-category breakdown (for the auto-comment and methodology page), and up
 * to three warmly-framed improvement suggestions (§15 #18).
 *
 * Time-in-status decay (§7, §15 #17) is a separate function,
 * `applyTimeInStatusDecay`, because it depends on issue timeline data the
 * generator supplies — not on the intake form itself.
 */

import {
  MISSION_POINTS,
  CHARITY_STAGE_POINTS,
  AFFILIATION_POINTS,
  REVENUE_FORM_POINTS,
  TRAJECTORY_POINTS,
  FUNDING_MODEL_POINTS,
  PHONE_POINTS,
  EMAIL_POINTS,
  ADDRESS_POINTS,
  ADDRESS_ADDITIONAL_STATE_POINTS,
  ADDRESS_ADDITIONAL_STATE_MAX,
  ADDRESS_OFFICE_PLUS_RA_BONUS,
  BOARD_REQUIRED,
  BOARD_OPTIONAL,
  CANDID_PROFILE_URL,
  CANDID_DIRECT_LINK,
  CANDID_SEAL_POINTS,
  APPLICATION_POINTS,
  FORM_1023_POINTS,
  OPERATIONS_POINTS,
  PARTNERSHIP_POINTS,
  DOCUMENT_POINTS,
  INTEGRATIONS_BY_STAGE,
  INTEGRATION_POINTS_EACH,
  POLICY_PAGES,
  POLICY_POINTS_EACH,
  EXISTING_WEBSITE_POINTS,
  TIER_BOUNDARIES,
} from './config'
import type {
  BoardSeat,
  ContactPerson,
  IntakeData,
  ReadinessResult,
  RequiredRole,
  ScoreCategory,
  ScoreLine,
  TierLabel,
} from './types'

const REQUIRED_ROLES: RequiredRole[] = ['orgMain', 'president', 'secretary', 'treasurer']
const OPTIONAL_CONTACT_ROLES = ['vicePresident', 'memberAtLarge'] as const

const ROLE_LABELS: Record<string, string> = {
  orgMain: 'Org main contact',
  president: 'President',
  secretary: 'Secretary',
  treasurer: 'Treasurer',
  vicePresident: 'Vice President',
  memberAtLarge: 'Member at Large',
}

/** Map a numeric score to its public tier label. */
export function tierLabelFor(score: number): TierLabel {
  for (const { min, label } of TIER_BOUNDARIES) {
    if (score >= min) return label
  }
  // Unreachable: the final boundary is -Infinity.
  return 'Just getting started'
}

function sum(lines: ScoreLine[]): number {
  return lines.reduce((total, line) => total + line.points, 0)
}

function scorePhonesAndEmails(intake: IntakeData): ScoreCategory[] {
  const phoneLines: ScoreLine[] = []
  const emailLines: ScoreLine[] = []

  for (const role of REQUIRED_ROLES) {
    const person: ContactPerson = intake.contacts[role]
    phoneLines.push({ label: `${ROLE_LABELS[role]} phone`, points: PHONE_POINTS[person.phoneType] })
    emailLines.push({ label: `${ROLE_LABELS[role]} email`, points: EMAIL_POINTS[person.emailType] })
  }

  for (const role of OPTIONAL_CONTACT_ROLES) {
    const person: ContactPerson = intake.contacts[role]
    // §15 #14 — optional roles never penalize; an unfilled seat is 0, not negative.
    if (!person.present) continue
    phoneLines.push({
      label: `${ROLE_LABELS[role]} phone`,
      points: Math.max(0, PHONE_POINTS[person.phoneType]),
    })
    emailLines.push({
      label: `${ROLE_LABELS[role]} email`,
      points: Math.max(0, EMAIL_POINTS[person.emailType]),
    })
  }

  return [
    { key: 'phones', label: 'Phone numbers', points: sum(phoneLines), lines: phoneLines },
    { key: 'emails', label: 'Email addresses', points: sum(emailLines), lines: emailLines },
  ]
}

function scoreBoardSeat(seat: BoardSeat, required: boolean): number {
  const table = required ? BOARD_REQUIRED : BOARD_OPTIONAL
  // A seat only counts as filled once a name is supplied; "present" without a
  // name is treated as missing so inconsistent data can't inflate the score.
  if (!seat.present || !seat.named) return table.missing
  if (seat.linkedin) return table.linkedin
  return table.named
}

function scoreBoard(intake: IntakeData): ScoreCategory {
  const lines: ScoreLine[] = [
    { label: 'President', points: scoreBoardSeat(intake.board.president, true) },
    { label: 'Secretary', points: scoreBoardSeat(intake.board.secretary, true) },
    { label: 'Treasurer', points: scoreBoardSeat(intake.board.treasurer, true) },
    { label: 'Vice President', points: scoreBoardSeat(intake.board.vicePresident, false) },
    { label: 'Member at Large', points: scoreBoardSeat(intake.board.memberAtLarge, false) },
  ]
  return { key: 'board', label: 'Board composition', points: sum(lines), lines }
}

function scoreAddress(intake: IntakeData): ScoreCategory {
  const { address } = intake
  const lines: ScoreLine[] = [
    { label: 'Primary mailing address', points: ADDRESS_POINTS[address.type] },
  ]
  if (address.additionalRaStates > 0) {
    const states = Math.min(
      address.additionalRaStates * ADDRESS_ADDITIONAL_STATE_POINTS,
      ADDRESS_ADDITIONAL_STATE_MAX
    )
    lines.push({ label: 'Additional registered-agent states', points: states })
  }
  if (address.hasOfficeAndRa) {
    lines.push({ label: 'Office + registered-agent bonus', points: ADDRESS_OFFICE_PLUS_RA_BONUS })
  }
  return { key: 'address', label: 'Mailing address', points: sum(lines), lines }
}

function scoreCandid(intake: IntakeData): ScoreCategory | null {
  if (intake.charityStage !== '501c3') return null
  const lines: ScoreLine[] = []
  if (intake.candid.profileUrl)
    lines.push({ label: 'Candid profile URL', points: CANDID_PROFILE_URL })
  if (intake.candid.directLink)
    lines.push({ label: 'Direct profile link', points: CANDID_DIRECT_LINK })
  if (intake.candid.seal !== 'none') {
    lines.push({
      label: `${titleCase(intake.candid.seal)} Seal`,
      points: CANDID_SEAL_POINTS[intake.candid.seal],
    })
  }
  return { key: 'candid', label: 'Candid / GuideStar', points: sum(lines), lines }
}

function scoreApplicationProgress(intake: IntakeData): ScoreCategory | null {
  if (intake.charityStage !== 'pre-501c3') return null
  const p = intake.applicationProgress
  const lines: ScoreLine[] = []
  if (p.incorporationFiled)
    lines.push({
      label: 'State incorporation filed',
      points: APPLICATION_POINTS.incorporationFiled,
    })
  if (p.incorporationApproved)
    lines.push({
      label: 'State incorporation approved',
      points: APPLICATION_POINTS.incorporationApproved,
    })
  if (p.einObtained) lines.push({ label: 'EIN obtained', points: APPLICATION_POINTS.einObtained })
  if (p.bylawsDrafted)
    lines.push({ label: 'Bylaws drafted', points: APPLICATION_POINTS.bylawsDrafted })
  if (p.bylawsAdopted)
    lines.push({ label: 'Bylaws adopted', points: APPLICATION_POINTS.bylawsAdopted })
  if (p.form !== 'none') {
    lines.push({ label: formLabel(p.form), points: FORM_1023_POINTS[p.form] })
  }
  return { key: 'application', label: 'Application progress', points: sum(lines), lines }
}

function scoreOperations(intake: IntakeData): ScoreCategory | null {
  if (intake.charityStage !== 'non-pursuing') return null
  const e = intake.operationsEvidence
  const lines: ScoreLine[] = []
  if (e.documentedActivities6mo)
    lines.push({
      label: 'Documented activity (6 mo)',
      points: OPERATIONS_POINTS.documentedActivities6mo,
    })
  if (e.recurringActivities)
    lines.push({ label: 'Recurring activities', points: OPERATIONS_POINTS.recurringActivities })
  if (e.sponsoringInstitution)
    lines.push({ label: 'Sponsoring institution', points: OPERATIONS_POINTS.sponsoringInstitution })
  if (e.attestationLetter)
    lines.push({ label: 'Attestation letter', points: OPERATIONS_POINTS.attestationLetter })
  if (e.activeCommunity)
    lines.push({ label: 'Active community (>10)', points: OPERATIONS_POINTS.activeCommunity })
  return { key: 'operations', label: 'Operations evidence', points: sum(lines), lines }
}

function scorePartnership(intake: IntakeData): ScoreCategory | null {
  if (intake.charityStage === '501c3') return null
  const points = PARTNERSHIP_POINTS[intake.partnershipDueDiligence]
  return {
    key: 'partnership',
    label: 'Partnership due diligence',
    points,
    lines: [{ label: 'Outreach to existing organizations', points }],
  }
}

function scoreDocuments(intake: IntakeData): ScoreCategory {
  const d = intake.documents
  const lines: ScoreLine[] = []
  if (d.articlesOfIncorporation)
    lines.push({
      label: 'Articles of incorporation',
      points: DOCUMENT_POINTS.articlesOfIncorporation,
    })
  if (d.bylaws) lines.push({ label: 'Bylaws', points: DOCUMENT_POINTS.bylaws })
  if (d.solicitationRegistrations > 0) {
    const points = Math.min(
      d.solicitationRegistrations * DOCUMENT_POINTS.solicitationRegistrationEach,
      DOCUMENT_POINTS.solicitationRegistrationMax
    )
    lines.push({ label: 'State solicitation registrations', points })
  }
  if (d.brandAssets) lines.push({ label: 'Brand assets', points: DOCUMENT_POINTS.brandAssets })
  return { key: 'documents', label: 'Documents', points: sum(lines), lines }
}

function scoreIntegrations(intake: IntakeData): ScoreCategory {
  const creditable = new Set(INTEGRATIONS_BY_STAGE[intake.charityStage])
  // Dedupe so a repeated entry can't inflate the score.
  const counted = [...new Set(intake.integrations)].filter((i) => creditable.has(i))
  const lines = counted.map((i) => ({ label: i, points: INTEGRATION_POINTS_EACH }))
  return { key: 'integrations', label: 'External integrations', points: sum(lines), lines }
}

function scorePolicyPages(intake: IntakeData): ScoreCategory {
  const valid = new Set<string>(POLICY_PAGES)
  // Dedupe so a repeated entry can't inflate the score.
  const counted = [...new Set(intake.policyPages)].filter((p) => valid.has(p))
  const lines = counted.map((p) => ({ label: p, points: POLICY_POINTS_EACH }))
  return { key: 'policies', label: 'Policy pages', points: sum(lines), lines }
}

function single(key: string, label: string, lineLabel: string, points: number): ScoreCategory {
  return { key, label, points, lines: [{ label: lineLabel, points }] }
}

/**
 * Compute the full readiness result from structured intake data.
 * Pure: same input always yields the same output.
 */
export function computeReadiness(intake: IntakeData): ReadinessResult {
  const categories: ScoreCategory[] = [
    single(
      'mission',
      'Mission category',
      titleCase(intake.missionCategory),
      MISSION_POINTS[intake.missionCategory]
    ),
    single(
      'stage',
      'Charity stage',
      stageLabel(intake.charityStage),
      CHARITY_STAGE_POINTS[intake.charityStage]
    ),
    single(
      'affiliation',
      'Affiliation status',
      affiliationLabel(intake.affiliation),
      AFFILIATION_POINTS[intake.affiliation]
    ),
    single(
      'revenue',
      'Revenue and form filed',
      revenueLabel(intake.revenueForm),
      REVENUE_FORM_POINTS[intake.revenueForm]
    ),
    single(
      'trajectory',
      'Trajectory (5-year)',
      trajectoryLabel(intake.trajectory),
      TRAJECTORY_POINTS[intake.trajectory]
    ),
    single(
      'funding',
      'Funding model',
      fundingLabel(intake.fundingModel),
      FUNDING_MODEL_POINTS[intake.fundingModel]
    ),
    ...scorePhonesAndEmails(intake),
    scoreAddress(intake),
    scoreBoard(intake),
    scoreCandid(intake),
    scoreApplicationProgress(intake),
    scoreOperations(intake),
    scorePartnership(intake),
    scoreDocuments(intake),
    scoreIntegrations(intake),
    scorePolicyPages(intake),
    single(
      'website',
      'Existing website',
      websiteLabel(intake.existingWebsite),
      EXISTING_WEBSITE_POINTS[intake.existingWebsite]
    ),
  ].filter((c): c is ScoreCategory => c !== null)

  const score = categories.reduce((total, c) => total + c.points, 0)

  return {
    score,
    tier: tierLabelFor(score),
    categories,
    suggestions: buildSuggestions(intake, categories),
  }
}

/**
 * Apply time-in-status decay (§7, §15 #17): -2/month past the expected window,
 * capped so decay never removes more than the original category points the
 * charity earned. The generator computes `monthsStalled` from issue timeline
 * data; this keeps the date logic out of the pure intake scorer.
 */
export function applyTimeInStatusDecay(
  result: ReadinessResult,
  monthsStalled: number,
  recoverablePoints: number
): ReadinessResult {
  if (monthsStalled <= 0 || recoverablePoints <= 0) return result
  const decay = Math.min(monthsStalled * 2, recoverablePoints)
  const score = result.score - decay
  return { ...result, score, tier: tierLabelFor(score) }
}

// --- suggestions ------------------------------------------------------------

interface Candidate {
  upside: number
  message: string
}

function buildSuggestions(intake: IntakeData, categories: ScoreCategory[]): string[] {
  const candidates: Candidate[] = []
  const byKey = Object.fromEntries(categories.map((c) => [c.key, c]))

  // Board: every missing required seat is a -15 swing toward +5.
  for (const role of ['president', 'secretary', 'treasurer'] as const) {
    if (!intake.board[role].present) {
      candidates.push({
        upside: 20,
        message: `Add a ${ROLE_LABELS[role]} to your board — naming the three required officers with LinkedIn URLs is the biggest single improvement you can make.`,
      })
    } else if (!intake.board[role].linkedin) {
      candidates.push({
        upside: 2,
        message: `Add a LinkedIn URL for your ${ROLE_LABELS[role]} to strengthen board credibility.`,
      })
    }
  }

  // Org-domain email is a large, fast win once FFC provisions the domain.
  const weakEmails = REQUIRED_ROLES.filter((r) => intake.contacts[r].emailType !== 'org-domain')
  if (weakEmails.length > 0) {
    candidates.push({
      upside: 8 * weakEmails.length,
      message:
        'Move your key contacts onto org-domain email — FFC sets these up automatically at launch, so this score lifts as soon as you onboard.',
    })
  }

  if (intake.charityStage === '501c3' && intake.candid.seal === 'none') {
    candidates.push({
      upside: 35,
      message:
        'Reach the Candid/GuideStar Gold Seal of Transparency — it is FFC’s minimum and unlocks the largest readiness gain for approved 501(c)(3) charities.',
    })
  }

  if (intake.address.type === 'none') {
    candidates.push({
      upside: 32,
      message:
        'Add a public mailing address — a registered-agent service (any provider) scores highest; see /intake-help/mailing-address.',
    })
  }

  const policyGap = POLICY_PAGES.length - byKey['policies'].lines.length
  if (policyGap > 0) {
    candidates.push({
      upside: 3 * policyGap,
      message: `Publish your remaining policy pages (${policyGap} to go) — donation, privacy, terms, vulnerability disclosure, and security acknowledgement.`,
    })
  }

  if (intake.existingWebsite !== 'functional') {
    candidates.push({
      upside: 8,
      message:
        'A functional website with real content scores higher than a placeholder — this is exactly what FFC helps you build.',
    })
  }

  return candidates
    .sort((a, b) => b.upside - a.upside)
    .slice(0, 3)
    .map((c) => c.message)
}

// --- label helpers ----------------------------------------------------------

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function stageLabel(stage: IntakeData['charityStage']): string {
  return stage === '501c3'
    ? 'Approved 501(c)(3)'
    : stage === 'pre-501c3'
      ? 'Pre-501(c)(3), pursuing'
      : 'Ongoing project, not pursuing'
}

function affiliationLabel(a: IntakeData['affiliation']): string {
  const map: Record<IntakeData['affiliation'], string> = {
    independent: 'Independent',
    'ffc-sponsored': 'Sponsored by an FFC charity recipient',
    'ffc-sponsored-pursuing': 'FFC-sponsored, pursuing own 501(c)(3)',
    franchise: 'Franchise / local affiliate of national parent',
    'non-ffc-sponsored': 'Sponsored by a non-FFC operating 501(c)(3)',
    'corporate-fiscal-sponsor': 'Corporate fiscal sponsor',
  }
  return map[a]
}

function formLabel(form: IntakeData['applicationProgress']['form']): string {
  const map: Record<IntakeData['applicationProgress']['form'], string> = {
    none: 'No 1023 activity',
    '1023ez-drafted': 'Form 1023-EZ drafted',
    '1023ez-submitted': 'Form 1023-EZ submitted',
    '1023-drafted': 'Form 1023 (long) drafted',
    '1023-submitted-voluntary': 'Form 1023 (long) submitted — voluntary',
    '1023-submitted-required': 'Form 1023 (long) submitted — required',
  }
  return map[form]
}

function revenueLabel(r: IntakeData['revenueForm']): string {
  const map: Record<IntakeData['revenueForm'], string> = {
    'pre-revenue': 'Pre-revenue / in formation',
    '990-n': '990-N filer (≤ $50K)',
    '990-ez': '990-EZ filer ($50K–$200K)',
    '990-200k-500k': '990 filer ($200K–$500K)',
    '990-500k-1m': '990 filer ($500K–$1M)',
    '990-1m-5m': '990 filer ($1M–$5M)',
    '990-over-5m': '990 filer (over $5M)',
  }
  return map[r]
}

function trajectoryLabel(t: IntakeData['trajectory']): string {
  const map: Record<IntakeData['trajectory'], string> = {
    'remain-small': 'Plans to remain small',
    'modest-growth': 'Modest growth within current form size',
    'substantial-growth': 'Substantial growth (toward full 990)',
    'major-grant': 'Major-grant pursuit (over $100K)',
    unclear: 'No clear trajectory',
  }
  return map[t]
}

function fundingLabel(f: IntakeData['fundingModel']): string {
  const map: Record<IntakeData['fundingModel'], string> = {
    'self-funded': 'Self-funded (dues, fees, founder contributions)',
    'donations-only': 'Donations only',
    'donations-small-grants': 'Donations + small grants (under $25K)',
    'significant-grants': 'Significant grants ($25K–$100K)',
    'major-grant-dependent': 'Major grant-dependent ($100K+)',
    'government-contract': 'Government contract primary',
  }
  return map[f]
}

function websiteLabel(w: IntakeData['existingWebsite']): string {
  const map: Record<IntakeData['existingWebsite'], string> = {
    none: 'No existing website',
    placeholder: 'Placeholder / landing page only',
    functional: 'Functional site with content',
  }
  return map[w]
}
