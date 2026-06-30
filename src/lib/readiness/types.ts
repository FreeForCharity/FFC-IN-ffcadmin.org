/**
 * Readiness scoring — shared types.
 *
 * `IntakeData` is the computable shape parsed from a charity intake issue
 * (see `.github/ISSUE_TEMPLATE/charity-intake.yml` and
 * `scripts/generate-roadmap-data.ts`). Every field maps to an explicit form
 * input (program plan §15 decision #8: structured fields, not free-text
 * parsing) so scoring is deterministic.
 *
 * The scoring tables themselves live in `config.ts`; the pure compute function
 * lives in `scoring.ts`. This module is the single source of truth consumed by
 * the methodology page, the roadmap data generator, and the score-comment
 * logic — there are no duplicated point tables anywhere else.
 */

/**
 * Mission favoring tiers (program decision): FFC's capacity is finite, so the
 * roadmap favors the causes the board prioritizes. Basic-needs (food/water/
 * shelter) sort first, veterans next, everything else at the neutral baseline.
 */
export type MissionCategory = 'basic-needs' | 'veterans' | 'general'

export type CharityStage = '501c3' | 'pre-501c3' | 'non-pursuing'

export type Affiliation =
  | 'independent'
  | 'ffc-sponsored'
  | 'ffc-sponsored-pursuing'
  | 'franchise'
  | 'non-ffc-sponsored'
  | 'corporate-fiscal-sponsor'

export type RevenueForm =
  'pre-revenue' | '990-n' | '990-ez' | '990-200k-500k' | '990-500k-1m' | '990-1m-5m' | '990-over-5m'

export type Trajectory =
  'remain-small' | 'modest-growth' | 'substantial-growth' | 'major-grant' | 'unclear'

export type FundingModel =
  | 'self-funded'
  | 'donations-only'
  | 'donations-small-grants'
  | 'significant-grants'
  | 'major-grant-dependent'
  | 'government-contract'

export type PhoneType = 'none' | 'landline' | 'personal-cell' | 'org-specific'

export type EmailType = 'none' | 'personal-free' | 'org-gmail' | 'org-domain'

export type AddressType =
  'none' | 'personal' | 'po-box' | 'commercial' | 'office' | 'registered-agent'

export type CandidSeal = 'none' | 'gold' | 'platinum'

export type Form1023Status =
  | 'none'
  | '1023ez-drafted'
  | '1023ez-submitted'
  | '1023-drafted'
  | '1023-submitted-voluntary'
  | '1023-submitted-required'

export type PartnershipDueDiligence =
  'none' | 'vague' | 'named-one' | 'outreach-2plus' | 'outreach-3plus' | 'declined-referred'

export type ExistingWebsite = 'none' | 'placeholder' | 'functional'

/** Roles that carry negative scoring when their phone/email is missing. */
export type RequiredRole = 'orgMain' | 'president' | 'secretary' | 'treasurer'
/** Roles that score positively but never penalize when absent. */
export type OptionalRole = 'vicePresident' | 'memberAtLarge'
export type ContactRole = RequiredRole | OptionalRole

export interface ContactPerson {
  /** False when an optional board seat is simply unfilled. */
  present: boolean
  phoneType: PhoneType
  emailType: EmailType
}

export interface BoardSeat {
  present: boolean
  /** Name supplied (vs. role listed but vacant). */
  named: boolean
  /** LinkedIn URL supplied for the seat holder. */
  linkedin: boolean
}

export interface MailingAddress {
  type: AddressType
  /** Additional states with a registered agent, beyond the primary. */
  additionalRaStates: number
  /** Charity has BOTH a real office AND a registered agent somewhere. */
  hasOfficeAndRa: boolean
}

export interface ApplicationProgress {
  incorporationFiled: boolean
  incorporationApproved: boolean
  einObtained: boolean
  bylawsDrafted: boolean
  bylawsAdopted: boolean
  form: Form1023Status
}

export interface OperationsEvidence {
  documentedActivities6mo: boolean
  recurringActivities: boolean
  sponsoringInstitution: boolean
  attestationLetter: boolean
  activeCommunity: boolean
}

export interface CandidProfile {
  profileUrl: boolean
  directLink: boolean
  seal: CandidSeal
}

export interface SupportingDocuments {
  articlesOfIncorporation: boolean
  bylaws: boolean
  /** Count of state solicitation registrations supplied. */
  solicitationRegistrations: number
  brandAssets: boolean
}

export interface IntakeData {
  missionCategory: MissionCategory
  charityStage: CharityStage
  affiliation: Affiliation
  revenueForm: RevenueForm
  trajectory: Trajectory
  fundingModel: FundingModel
  contacts: Record<ContactRole, ContactPerson>
  board: {
    president: BoardSeat
    secretary: BoardSeat
    treasurer: BoardSeat
    vicePresident: BoardSeat
    memberAtLarge: BoardSeat
  }
  address: MailingAddress
  candid: CandidProfile
  applicationProgress: ApplicationProgress
  operationsEvidence: OperationsEvidence
  partnershipDueDiligence: PartnershipDueDiligence
  documents: SupportingDocuments
  /** Integration platform keys (subset of INTEGRATION_PLATFORMS). */
  integrations: string[]
  /** Policy page keys (subset of POLICY_PAGES). */
  policyPages: string[]
  existingWebsite: ExistingWebsite
}

/** One scored line item within a category. */
export interface ScoreLine {
  label: string
  points: number
}

/** A scored category with its contributing lines. */
export interface ScoreCategory {
  key: string
  label: string
  points: number
  lines: ScoreLine[]
}

export type TierLabel =
  'Just getting started' | 'Foundational' | 'Developing' | 'Established' | 'Mature'

export interface ReadinessResult {
  score: number
  tier: TierLabel
  categories: ScoreCategory[]
  /** Up to three warmly-framed, highest-impact next steps. */
  suggestions: string[]
}
