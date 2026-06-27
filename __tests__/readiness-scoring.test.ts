/**
 * Readiness scoring engine tests.
 *
 * Validates the §16 (Appendix A) point tables, the §15 default decisions,
 * tier-label boundaries, per-person caps, and time-in-status decay.
 */
import {
  computeReadiness,
  tierLabelFor,
  applyTimeInStatusDecay,
  emptyIntake,
  INTEGRATION_PLATFORMS,
  POLICY_PAGES,
  type IntakeData,
} from '@/lib/readiness'

describe('tierLabelFor', () => {
  it('maps scores to the §7 boundaries', () => {
    expect(tierLabelFor(-1)).toBe('Just getting started')
    expect(tierLabelFor(0)).toBe('Foundational')
    expect(tierLabelFor(89)).toBe('Foundational')
    expect(tierLabelFor(90)).toBe('Developing')
    expect(tierLabelFor(179)).toBe('Developing')
    expect(tierLabelFor(180)).toBe('Established')
    expect(tierLabelFor(269)).toBe('Established')
    expect(tierLabelFor(270)).toBe('Mature')
  })
})

describe('computeReadiness — floors and gates', () => {
  it('scores a near-empty intake strongly negative ("Just getting started")', () => {
    const result = computeReadiness(emptyIntake())
    expect(result.score).toBeLessThan(0)
    expect(result.tier).toBe('Just getting started')
    expect(result.suggestions.length).toBeGreaterThan(0)
    expect(result.suggestions.length).toBeLessThanOrEqual(3)
  })

  it('applies the -40 corporate fiscal sponsor penalty (§15 #22)', () => {
    const independent = computeReadiness(emptyIntake({ affiliation: 'independent' }))
    const corporate = computeReadiness(emptyIntake({ affiliation: 'corporate-fiscal-sponsor' }))
    expect(independent.score - corporate.score).toBe(40)
  })

  it('gives the essential mission a +50 bonus over general (§15 #13)', () => {
    const general = computeReadiness(emptyIntake({ missionCategory: 'general' }))
    const essential = computeReadiness(emptyIntake({ missionCategory: 'essential' }))
    expect(essential.score - general.score).toBe(50)
  })

  it('does not double-count duplicate integrations or policy pages', () => {
    const once = computeReadiness(
      emptyIntake({
        charityStage: '501c3',
        integrations: ['Zeffy'],
        policyPages: ['Privacy Policy'],
      })
    )
    const twice = computeReadiness(
      emptyIntake({
        charityStage: '501c3',
        integrations: ['Zeffy', 'Zeffy'],
        policyPages: ['Privacy Policy', 'Privacy Policy'],
      })
    )
    expect(twice.score).toBe(once.score)
  })
})

describe('per-person phone/email caps (§15 #14)', () => {
  it('does not penalize unfilled optional board seats', () => {
    const withoutOptional = computeReadiness(emptyIntake())
    const withOptionalPresentNoContact = computeReadiness(
      emptyIntake({
        contacts: {
          ...emptyIntake().contacts,
          vicePresident: { present: true, phoneType: 'none', emailType: 'none' },
        },
      })
    )
    // An optional role present but with no phone/email floors at 0, never negative.
    expect(withOptionalPresentNoContact.score).toBe(withoutOptional.score)
  })

  it('penalizes a missing required-role phone by -10', () => {
    const base = emptyIntake()
    const withTreasurerPhone = computeReadiness(
      emptyIntake({
        contacts: {
          ...base.contacts,
          treasurer: { present: true, phoneType: 'org-specific', emailType: 'none' },
        },
      })
    )
    const withoutTreasurerPhone = computeReadiness(base)
    // -10 (none) → +10 (org-specific) is a 20-point swing.
    expect(withTreasurerPhone.score - withoutTreasurerPhone.score).toBe(20)
  })
})

describe('time-in-status decay (§15 #17)', () => {
  it('subtracts 2 points per stalled month, capped at recoverable points', () => {
    const result = computeReadiness(emptyIntake({ missionCategory: 'essential' }))
    const decayed = applyTimeInStatusDecay(result, 3, 100)
    expect(decayed.score).toBe(result.score - 6)
  })

  it('never decays more than the recoverable points', () => {
    const result = computeReadiness(emptyIntake({ missionCategory: 'essential' }))
    const decayed = applyTimeInStatusDecay(result, 12, 5)
    expect(decayed.score).toBe(result.score - 5)
  })

  it('is a no-op when nothing is stalled', () => {
    const result = computeReadiness(emptyIntake())
    expect(applyTimeInStatusDecay(result, 0, 100).score).toBe(result.score)
  })
})

/** A maximally-prepared, essential-mission 501(c)(3). Program plan: "~375". */
function maximalEssential501c3(): IntakeData {
  const orgSpecific = {
    present: true,
    phoneType: 'org-specific' as const,
    emailType: 'org-domain' as const,
  }
  const linkedinSeat = { present: true, named: true, linkedin: true }
  return emptyIntake({
    missionCategory: 'essential',
    charityStage: '501c3',
    affiliation: 'independent',
    revenueForm: '990-n',
    trajectory: 'remain-small',
    fundingModel: 'self-funded',
    contacts: {
      orgMain: orgSpecific,
      president: orgSpecific,
      secretary: orgSpecific,
      treasurer: orgSpecific,
      vicePresident: orgSpecific,
      memberAtLarge: orgSpecific,
    },
    board: {
      president: linkedinSeat,
      secretary: linkedinSeat,
      treasurer: linkedinSeat,
      vicePresident: linkedinSeat,
      memberAtLarge: linkedinSeat,
    },
    address: { type: 'registered-agent', additionalRaStates: 3, hasOfficeAndRa: true },
    candid: { profileUrl: true, directLink: true, seal: 'platinum' },
    documents: {
      articlesOfIncorporation: true,
      bylaws: true,
      solicitationRegistrations: 5,
      brandAssets: true,
    },
    integrations: [...INTEGRATION_PLATFORMS],
    policyPages: [...POLICY_PAGES],
    existingWebsite: 'functional',
  })
}

describe('reference fixtures', () => {
  it('scores a maximal essential 501(c)(3) in the Mature band (~375)', () => {
    const result = computeReadiness(maximalEssential501c3())
    expect(result.tier).toBe('Mature')
    expect(result.score).toBeGreaterThanOrEqual(360)
    expect(result.score).toBeLessThanOrEqual(410)
  })

  it("approximates FFC's own ~280 self-score as Mature", () => {
    // General-mission 501(c)(3), 990-N, Platinum seal, full policies — per §16.
    const ffc = emptyIntake({
      missionCategory: 'general',
      charityStage: '501c3',
      revenueForm: '990-n',
      trajectory: 'remain-small',
      fundingModel: 'donations-only',
      contacts: {
        orgMain: { present: true, phoneType: 'org-specific', emailType: 'org-domain' },
        president: { present: true, phoneType: 'personal-cell', emailType: 'org-domain' },
        secretary: { present: true, phoneType: 'personal-cell', emailType: 'org-domain' },
        treasurer: { present: true, phoneType: 'org-specific', emailType: 'org-domain' },
        vicePresident: { present: true, phoneType: 'personal-cell', emailType: 'org-domain' },
        memberAtLarge: { present: true, phoneType: 'personal-cell', emailType: 'org-domain' },
      },
      board: {
        president: { present: true, named: true, linkedin: true },
        secretary: { present: true, named: true, linkedin: true },
        treasurer: { present: true, named: true, linkedin: true },
        vicePresident: { present: true, named: true, linkedin: true },
        memberAtLarge: { present: true, named: true, linkedin: true },
      },
      address: { type: 'registered-agent', additionalRaStates: 2, hasOfficeAndRa: true },
      candid: { profileUrl: true, directLink: true, seal: 'platinum' },
      documents: {
        articlesOfIncorporation: true,
        bylaws: true,
        solicitationRegistrations: 1,
        brandAssets: true,
      },
      integrations: ['Zeffy', 'Idealist', 'Taproot', 'VolunteerMatch', 'Charity Navigator'],
      policyPages: [...POLICY_PAGES],
      existingWebsite: 'functional',
    })
    const result = computeReadiness(ffc)
    expect(result.tier).toBe('Mature')
    expect(result.score).toBeGreaterThanOrEqual(270)
    expect(result.score).toBeLessThanOrEqual(330)
  })
})
