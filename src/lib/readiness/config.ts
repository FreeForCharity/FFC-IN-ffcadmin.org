/**
 * Readiness scoring — canonical point tables and labels.
 *
 * This is the SINGLE SOURCE OF TRUTH for the program-plan §16 (Appendix A)
 * point values and the §15 default decisions. The methodology page renders
 * these tables directly and the scoring function consumes them, so the public
 * explanation can never drift from the computed result.
 *
 * Editing a value here changes both the score and the published methodology.
 */

import type {
  Affiliation,
  AddressType,
  CandidSeal,
  CharityStage,
  EmailType,
  ExistingWebsite,
  Form1023Status,
  FundingModel,
  MissionCategory,
  PartnershipDueDiligence,
  PhoneType,
  RevenueForm,
  TierLabel,
  Trajectory,
} from './types'

/** Mission category bonus — §15 #13 (bonus, not a hard sort tier). */
export const MISSION_POINTS: Record<MissionCategory, number> = {
  essential: 50,
  general: 0,
  niche: -10,
}

/** §15 #39 — the essential-mission category list (editorial copy). */
export const ESSENTIAL_MISSIONS = [
  'Food',
  'Water',
  'Shelter',
  'Emergency response',
  'Disaster relief',
  'Mental health crisis services',
  'Veterans services',
  'Domestic violence services',
] as const

export const CHARITY_STAGE_POINTS: Record<CharityStage, number> = {
  '501c3': 20,
  'pre-501c3': 5,
  'non-pursuing': 0,
}

/** §15 #22–26 — affiliation penalties. */
export const AFFILIATION_POINTS: Record<Affiliation, number> = {
  independent: 0,
  'ffc-sponsored': 0,
  'ffc-sponsored-pursuing': 5,
  franchise: -15,
  'non-ffc-sponsored': -20,
  'corporate-fiscal-sponsor': -40,
}

export const REVENUE_FORM_POINTS: Record<RevenueForm, number> = {
  'pre-revenue': 0,
  '990-n': 20,
  '990-ez': 12,
  '990-200k-500k': 5,
  '990-500k-1m': 0,
  '990-1m-5m': -5,
  '990-over-5m': -10,
}

export const TRAJECTORY_POINTS: Record<Trajectory, number> = {
  'remain-small': 10,
  'modest-growth': 3,
  'substantial-growth': -3,
  'major-grant': -8,
  unclear: 0,
}

export const FUNDING_MODEL_POINTS: Record<FundingModel, number> = {
  'self-funded': 8,
  'donations-only': 8,
  'donations-small-grants': 5,
  'significant-grants': 0,
  'major-grant-dependent': -5,
  'government-contract': -5,
}

/** Phone points. Required roles take the penalty on "none"; optional roles floor at 0. */
export const PHONE_POINTS: Record<PhoneType, number> = {
  none: -10,
  landline: 0,
  'personal-cell': 5,
  'org-specific': 10,
}

export const EMAIL_POINTS: Record<EmailType, number> = {
  none: -10,
  'personal-free': 2,
  'org-gmail': 5,
  'org-domain': 10,
}

/** Mailing address primary tier. */
export const ADDRESS_POINTS: Record<AddressType, number> = {
  none: -20,
  personal: -3,
  'po-box': 3,
  commercial: 5,
  office: 10,
  // §15 #15 — all registered-agent services equal; Northwest is editorial only.
  'registered-agent': 12,
}

/** Additional registration states with an RA: +5 each, capped. */
export const ADDRESS_ADDITIONAL_STATE_POINTS = 5
export const ADDRESS_ADDITIONAL_STATE_MAX = 15
/** Bonus when the charity has both a real office and a registered agent. */
export const ADDRESS_OFFICE_PLUS_RA_BONUS = 3

/** Board composition. */
export const BOARD_REQUIRED = {
  missing: -15,
  named: 3,
  linkedin: 5,
} as const
export const BOARD_OPTIONAL = {
  missing: 0,
  named: 2,
  linkedin: 5,
} as const

/** Candid / GuideStar (501(c)(3) only). Gold is FFC's floor; sub-Gold is gated. */
export const CANDID_PROFILE_URL = 10
export const CANDID_DIRECT_LINK = 5
export const CANDID_SEAL_POINTS: Record<CandidSeal, number> = {
  none: 0,
  gold: 20,
  platinum: 30,
}

/** Application progress (pre-501(c)(3)). Form value replaces its "drafted" precursor. */
export const APPLICATION_POINTS = {
  incorporationFiled: 10,
  incorporationApproved: 5,
  einObtained: 10,
  bylawsDrafted: 5,
  bylawsAdopted: 5,
} as const

/** §15 #16 — Form 1023 vs 1023-EZ recognition. */
export const FORM_1023_POINTS: Record<Form1023Status, number> = {
  none: 0,
  '1023ez-drafted': 5,
  '1023ez-submitted': 10,
  '1023-drafted': 5,
  '1023-submitted-voluntary': 12,
  '1023-submitted-required': 10,
}

/** Operations evidence (non-pursuing nonprofit-nature). */
export const OPERATIONS_POINTS = {
  documentedActivities6mo: 5,
  recurringActivities: 5,
  sponsoringInstitution: 5,
  attestationLetter: 5,
  activeCommunity: 3,
} as const

/** Partnership due diligence (pre-501(c)(3) and non-pursuing). */
export const PARTNERSHIP_POINTS: Record<PartnershipDueDiligence, number> = {
  none: -10,
  vague: 0,
  'named-one': 3,
  'outreach-2plus': 8,
  'outreach-3plus': 12,
  'declined-referred': 15,
}

/** Documents. */
export const DOCUMENT_POINTS = {
  articlesOfIncorporation: 3,
  bylaws: 5,
  solicitationRegistrationEach: 3,
  solicitationRegistrationMax: 15,
  brandAssets: 3,
} as const

/** §15 #38 — external integration platforms (+3 each). */
export const INTEGRATION_PLATFORMS = [
  'Zeffy',
  'Idealist',
  'Taproot',
  'VolunteerMatch',
  'Charity Navigator',
  'Benevity',
  'Network for Good',
] as const
export const INTEGRATION_POINTS_EACH = 3

/** Which integrations are creditable per stage. */
export const INTEGRATIONS_BY_STAGE: Record<CharityStage, readonly string[]> = {
  '501c3': INTEGRATION_PLATFORMS,
  'pre-501c3': ['Idealist', 'Taproot', 'VolunteerMatch'],
  'non-pursuing': ['Idealist', 'Taproot'],
}

/** §15 #37 — recognized policy pages (+3 each). */
export const POLICY_PAGES = [
  'Donation Policy',
  'Privacy Policy',
  'Terms of Service',
  'Vulnerability Disclosure Policy',
  'Security Acknowledgement',
] as const
export const POLICY_POINTS_EACH = 3

export const EXISTING_WEBSITE_POINTS: Record<ExistingWebsite, number> = {
  none: 0,
  placeholder: 3,
  functional: 8,
}

/** §7 / §16 — public tier-label boundaries (lower bound inclusive). */
export const TIER_BOUNDARIES: { min: number; label: TierLabel }[] = [
  { min: 270, label: 'Mature' },
  { min: 180, label: 'Established' },
  { min: 90, label: 'Developing' },
  { min: 0, label: 'Foundational' },
  { min: -Infinity, label: 'Just getting started' },
]
