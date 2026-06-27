/**
 * Parse a charity-intake GitHub issue-form body into computable `IntakeData`.
 *
 * Pure (no fs / network) so it is unit-tested and reused by the roadmap
 * generator. The option strings here are the source of truth that
 * `.github/ISSUE_TEMPLATE/charity-intake.yml` dropdowns must match.
 *
 * Best-effort: any field that is absent or "_No response_" falls back to the
 * `emptyIntake()` baseline, so a half-completed issue still scores without
 * throwing.
 */
import { emptyIntake } from './defaults'
import type {
  Affiliation,
  AddressType,
  CandidSeal,
  CharityStage,
  EmailType,
  ExistingWebsite,
  Form1023Status,
  FundingModel,
  IntakeData,
  MissionCategory,
  PartnershipDueDiligence,
  PhoneType,
  RevenueForm,
  Trajectory,
} from './types'
import { INTEGRATION_PLATFORMS, POLICY_PAGES } from './config'

const NO_RESPONSE = /^_no response_$/i

/** Split an issue-form body into a label→value map (`### Label\n\nvalue`). */
export function parseIssueForm(body: string): Map<string, string> {
  const map = new Map<string, string>()
  if (!body) return map
  const normalized = body.replace(/\r\n/g, '\n').replace(/^###\s+/, '')
  for (const part of normalized.split(/\n###\s+/)) {
    const nl = part.indexOf('\n')
    if (nl === -1) continue
    const label = part.slice(0, nl).trim().toLowerCase()
    const value = part.slice(nl + 1).trim()
    map.set(label, NO_RESPONSE.test(value) ? '' : value)
  }
  return map
}

function checked(value: string): string[] {
  return value
    .split('\n')
    .filter((line) => /^\s*-\s*\[x\]/i.test(line))
    .map((line) => line.replace(/^\s*-\s*\[x\]\s*/i, '').trim())
}

function mapEnum<T extends string>(value: string, table: Record<string, T>, fallback: T): T {
  const hit = table[value.trim()]
  return hit ?? fallback
}

const STAGE: Record<string, CharityStage> = {
  'Approved 501(c)(3)': '501c3',
  'Pre-501(c)(3) (actively pursuing)': 'pre-501c3',
  'Ongoing nonprofit-nature project (not pursuing 501(c)(3))': 'non-pursuing',
}
const MISSION: Record<string, MissionCategory> = {
  Essential: 'essential',
  General: 'general',
  Niche: 'niche',
}
const AFFILIATION: Record<string, Affiliation> = {
  Independent: 'independent',
  'Sponsored by an FFC charity recipient': 'ffc-sponsored',
  'Sponsored by an FFC charity recipient and pursuing our own 501(c)(3)': 'ffc-sponsored-pursuing',
  'Franchise / local affiliate of a national parent': 'franchise',
  'Sponsored by a non-FFC operating 501(c)(3)': 'non-ffc-sponsored',
  'Sponsored by a corporate fiscal sponsor': 'corporate-fiscal-sponsor',
}
const REVENUE: Record<string, RevenueForm> = {
  'Pre-revenue / in formation': 'pre-revenue',
  '990-N filer (under $50K)': '990-n',
  '990-EZ filer ($50K–$200K)': '990-ez',
  '990 filer ($200K–$500K)': '990-200k-500k',
  '990 filer ($500K–$1M)': '990-500k-1m',
  '990 filer ($1M–$5M)': '990-1m-5m',
  '990 filer (over $5M)': '990-over-5m',
}
const TRAJECTORY: Record<string, Trajectory> = {
  'Plans to remain small': 'remain-small',
  'Modest growth within current form size': 'modest-growth',
  'Substantial growth (toward full 990)': 'substantial-growth',
  'Major-grant pursuit (over $100K)': 'major-grant',
  'No clear trajectory': 'unclear',
}
const FUNDING: Record<string, FundingModel> = {
  'Self-funded (dues, fees, founder contributions)': 'self-funded',
  'Donations only': 'donations-only',
  'Donations + small grants (under $25K)': 'donations-small-grants',
  'Significant grants ($25K–$100K)': 'significant-grants',
  'Major grant-dependent ($100K+)': 'major-grant-dependent',
  'Government contract primary': 'government-contract',
}
const ADDRESS: Record<string, AddressType> = {
  'No address': 'none',
  'Personal residence': 'personal',
  'PO box (USPS)': 'po-box',
  'Commercial mailbox (UPS Store, etc.)': 'commercial',
  'Real office address': 'office',
  'Registered agent service': 'registered-agent',
}
const SEAL: Record<string, CandidSeal> = {
  'Not on Candid / no seal': 'none',
  'Gold Seal of Transparency': 'gold',
  'Platinum Seal of Transparency': 'platinum',
}
const WEBSITE: Record<string, ExistingWebsite> = {
  'No existing website': 'none',
  'Placeholder / landing page only': 'placeholder',
  'Functional site with content': 'functional',
}
const PHONE: Record<string, PhoneType> = {
  'No phone': 'none',
  Landline: 'landline',
  'Personal cell phone': 'personal-cell',
  'Org-specific number': 'org-specific',
}
const EMAIL: Record<string, EmailType> = {
  'No email': 'none',
  'Personal free provider (Gmail, Yahoo, etc.)': 'personal-free',
  'orgname@gmail.com placeholder': 'org-gmail',
  'Org-domain email': 'org-domain',
}
const FORM_1023: Record<string, Form1023Status> = {
  'Not started': 'none',
  'Form 1023-EZ drafted': '1023ez-drafted',
  'Form 1023-EZ submitted': '1023ez-submitted',
  'Form 1023 (long) drafted': '1023-drafted',
  'Form 1023 (long) submitted — voluntary': '1023-submitted-voluntary',
  'Form 1023 (long) submitted — required': '1023-submitted-required',
}
const PARTNERSHIP: Record<string, PartnershipDueDiligence> = {
  'No documented outreach to existing organizations': 'none',
  'Vague — we looked around': 'vague',
  'Named at least one organization considered': 'named-one',
  'Documented outreach to 2+ organizations': 'outreach-2plus',
  'Documented outreach to 3+ with reasons partnership was not viable': 'outreach-3plus',
  'An existing org declined or referred us to start independently': 'declined-referred',
}

function contact(map: Map<string, string>, role: string, defaultPresent: boolean) {
  // parseIssueForm lowercases every heading, so look up with a lowercased key.
  const key = role.toLowerCase()
  const phone = mapEnum(map.get(`${key} — phone type`) ?? '', PHONE, 'none')
  const email = mapEnum(map.get(`${key} — email type`) ?? '', EMAIL, 'none')
  const name = map.get(`${key} — name`) ?? ''
  return {
    present: defaultPresent || name.length > 0 || phone !== 'none' || email !== 'none',
    phoneType: phone,
    emailType: email,
  }
}

function seat(map: Map<string, string>, role: string) {
  const key = role.toLowerCase()
  const name = (map.get(`${key} — name`) ?? '').trim()
  const linkedin = (map.get(`${key} — linkedin url`) ?? '').trim()
  return { present: name.length > 0, named: name.length > 0, linkedin: linkedin.length > 0 }
}

export interface ParsedIntake {
  intake: IntakeData
  charityName: string
  missionExcerpt: string
  serviceTier: string
}

/** Parse an intake issue body into scoring inputs + display fields. */
export function parseIntakeIssue(body: string): ParsedIntake {
  const map = parseIssueForm(body)
  const integrations = checked(map.get('external integrations') ?? '').filter((i) =>
    (INTEGRATION_PLATFORMS as readonly string[]).includes(i)
  )
  const policyPages = checked(map.get('policy pages published') ?? '').filter((p) =>
    (POLICY_PAGES as readonly string[]).includes(p)
  )

  const docs = checked(map.get('documents on file') ?? '')
  const appProgress = checked(map.get('application progress (pre-501(c)(3))') ?? '')
  const ops = checked(map.get('operations evidence (not pursuing 501(c)(3))') ?? '')

  const intake = emptyIntake({
    missionCategory: mapEnum(map.get('mission category') ?? '', MISSION, 'general'),
    charityStage: mapEnum(map.get('charity status') ?? '', STAGE, 'non-pursuing'),
    affiliation: mapEnum(map.get('affiliation') ?? '', AFFILIATION, 'independent'),
    revenueForm: mapEnum(map.get('revenue and form filed') ?? '', REVENUE, 'pre-revenue'),
    trajectory: mapEnum(map.get('5-year trajectory') ?? '', TRAJECTORY, 'unclear'),
    fundingModel: mapEnum(map.get('primary funding model') ?? '', FUNDING, 'donations-only'),
    contacts: {
      orgMain: contact(map, 'Org main contact', true),
      president: contact(map, 'President', false),
      secretary: contact(map, 'Secretary', false),
      treasurer: contact(map, 'Treasurer', false),
      vicePresident: contact(map, 'Vice President', false),
      memberAtLarge: contact(map, 'Member at Large', false),
    },
    board: {
      president: seat(map, 'President'),
      secretary: seat(map, 'Secretary'),
      treasurer: seat(map, 'Treasurer'),
      vicePresident: seat(map, 'Vice President'),
      memberAtLarge: seat(map, 'Member at Large'),
    },
    address: {
      type: mapEnum(map.get('mailing address type') ?? '', ADDRESS, 'none'),
      additionalRaStates: Math.max(
        0,
        Number(map.get('additional registered-agent states') ?? '0') || 0
      ),
      hasOfficeAndRa: /^\s*-\s*\[x\]/im.test(map.get('office plus registered agent') ?? ''),
    },
    candid: {
      profileUrl: (map.get('candid / guidestar profile url') ?? '').length > 0,
      directLink: (map.get('candid direct profile link') ?? '').length > 0,
      seal: mapEnum(map.get('candid seal') ?? '', SEAL, 'none'),
    },
    documents: {
      articlesOfIncorporation: docs.includes('Articles of incorporation'),
      bylaws: docs.includes('Bylaws'),
      solicitationRegistrations: Math.max(
        0,
        Number(map.get('state solicitation registrations') ?? '0') || 0
      ),
      brandAssets: docs.includes('Brand assets (logo, brand guide)'),
    },
    applicationProgress: {
      incorporationFiled: appProgress.includes('State incorporation filed'),
      incorporationApproved: appProgress.includes('State incorporation approved'),
      einObtained: appProgress.includes('EIN obtained from the IRS'),
      bylawsDrafted: appProgress.includes('Bylaws drafted'),
      bylawsAdopted: appProgress.includes('Bylaws adopted by the board'),
      form: mapEnum(map.get('form 1023 status') ?? '', FORM_1023, 'none'),
    },
    operationsEvidence: {
      documentedActivities6mo: ops.includes('Documented activities in the last 6 months'),
      recurringActivities: ops.includes('Recurring activities (monthly meetings, regular events)'),
      sponsoringInstitution: ops.includes('Sponsoring institution (school, church, troop, etc.)'),
      attestationLetter: ops.includes('Letter/attestation from a sponsoring institution'),
      activeCommunity: ops.includes('Active community of 10+ named participants'),
    },
    partnershipDueDiligence: mapEnum(
      map.get('partnership due diligence') ?? '',
      PARTNERSHIP,
      'vague'
    ),
    integrations,
    policyPages,
    existingWebsite: mapEnum(map.get('existing website') ?? '', WEBSITE, 'none'),
  })

  // Empty (not a placeholder) when absent, so callers can fall back to the
  // issue title for stub issues rather than showing "Unnamed charity".
  const charityName = map.get('charity name') ?? ''
  const missionStatement = map.get('brief mission') ?? map.get('mission statement') ?? ''
  const missionExcerpt =
    missionStatement.length > 180 ? `${missionStatement.slice(0, 177)}…` : missionStatement
  const serviceTier = map.get('which ffc service are you seeking?') ?? 'Tier 1 — Application'

  return { intake, charityName, missionExcerpt, serviceTier }
}
