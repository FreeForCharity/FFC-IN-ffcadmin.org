/**
 * Factory for a baseline `IntakeData` so callers (tests, the roadmap generator)
 * can construct a record by overriding only the fields they care about.
 *
 * The baseline is a "nothing supplied yet" charity: no contacts, no board,
 * no address — i.e. the worst-case inputs. Scoring it yields a strongly
 * negative number, which is the correct floor.
 */

import type { ContactPerson, IntakeData } from './types'

const EMPTY_CONTACT: ContactPerson = { present: false, phoneType: 'none', emailType: 'none' }

export function emptyIntake(overrides: Partial<IntakeData> = {}): IntakeData {
  const base: IntakeData = {
    missionCategory: 'general',
    charityStage: 'non-pursuing',
    affiliation: 'independent',
    revenueForm: 'pre-revenue',
    trajectory: 'unclear',
    fundingModel: 'donations-only',
    contacts: {
      orgMain: { ...EMPTY_CONTACT, present: true },
      president: { ...EMPTY_CONTACT },
      secretary: { ...EMPTY_CONTACT },
      treasurer: { ...EMPTY_CONTACT },
      vicePresident: { ...EMPTY_CONTACT },
      memberAtLarge: { ...EMPTY_CONTACT },
    },
    board: {
      president: { present: false, named: false, linkedin: false },
      secretary: { present: false, named: false, linkedin: false },
      treasurer: { present: false, named: false, linkedin: false },
      vicePresident: { present: false, named: false, linkedin: false },
      memberAtLarge: { present: false, named: false, linkedin: false },
    },
    address: { type: 'none', additionalRaStates: 0, hasOfficeAndRa: false },
    candid: { profileUrl: false, directLink: false, seal: 'none' },
    applicationProgress: {
      incorporationFiled: false,
      incorporationApproved: false,
      einObtained: false,
      bylawsDrafted: false,
      bylawsAdopted: false,
      form: 'none',
    },
    operationsEvidence: {
      documentedActivities6mo: false,
      recurringActivities: false,
      sponsoringInstitution: false,
      attestationLetter: false,
      activeCommunity: false,
    },
    partnershipDueDiligence: 'vague',
    documents: {
      articlesOfIncorporation: false,
      bylaws: false,
      solicitationRegistrations: 0,
      brandAssets: false,
    },
    integrations: [],
    policyPages: [],
    existingWebsite: 'none',
  }
  return { ...base, ...overrides }
}
