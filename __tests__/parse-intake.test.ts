/**
 * Intake issue-form parser tests. The option strings asserted here are the
 * contract the charity-intake.yml dropdowns must match.
 */
import { parseIssueForm, parseIntakeIssue } from '@/lib/readiness/parseIntake'
import { computeReadiness } from '@/lib/readiness/scoring'

const SAMPLE = `### Charity name

Helping Hands Shelter

### Brief mission

We provide emergency shelter and food to families experiencing homelessness in our county.

### Charity status

Approved 501(c)(3)

### Mission category

Basic needs (food, water, shelter)

### Affiliation

Independent

### Mission statement

_No response_

### Candid seal

Gold Seal of Transparency

### Candid / GuideStar profile URL

https://www.guidestar.org/profile/example

### Existing website

Functional site with content

### President — name

Jane Doe

### President — linkedin url

https://linkedin.com/in/janedoe

### External integrations

- [x] Zeffy
- [ ] Idealist
- [x] VolunteerMatch

### Policy pages published

- [x] Privacy Policy
- [x] Donation Policy
`

describe('parseIssueForm', () => {
  it('splits headings into a label→value map and drops _No response_', () => {
    const map = parseIssueForm(SAMPLE)
    expect(map.get('charity name')).toBe('Helping Hands Shelter')
    expect(map.get('charity status')).toBe('Approved 501(c)(3)')
    expect(map.get('mission statement')).toBe('')
  })
})

describe('parseIntakeIssue', () => {
  it('maps dropdowns, checkboxes, and board seats into scoring inputs', () => {
    const { intake, charityName, missionExcerpt } = parseIntakeIssue(SAMPLE)
    expect(charityName).toBe('Helping Hands Shelter')
    expect(missionExcerpt).toContain('emergency shelter')
    expect(intake.charityStage).toBe('501c3')
    expect(intake.missionCategory).toBe('basic-needs')
    expect(intake.candid.seal).toBe('gold')
    expect(intake.candid.profileUrl).toBe(true)
    expect(intake.existingWebsite).toBe('functional')
    expect(intake.board.president).toEqual({ present: true, named: true, linkedin: true })
    expect(intake.integrations).toEqual(['Zeffy', 'VolunteerMatch'])
    expect(intake.policyPages).toEqual(['Privacy Policy', 'Donation Policy'])
  })

  it('produces a positive, scoreable result for the sample charity', () => {
    const { intake } = parseIntakeIssue(SAMPLE)
    const result = computeReadiness(intake)
    // Basic-needs mission (+50) + 501(c)(3) (+20) + Gold seal cluster alone clears Foundational.
    expect(result.score).toBeGreaterThan(0)
  })

  it('falls back to baseline on an empty body without throwing', () => {
    const { intake, charityName } = parseIntakeIssue('')
    expect(charityName).toBe('')
    expect(intake.charityStage).toBe('non-pursuing')
  })

  it('auto-classifies the mission tier from text when no category dropdown is set', () => {
    // WHMCS-sourced stubs carry a Brief mission but no Mission category field.
    const basicNeeds = parseIntakeIssue(
      '### Brief mission\n\nWe run a food pantry for hungry families.\n'
    ).intake
    expect(basicNeeds.missionCategory).toBe('basic-needs')

    const vets = parseIntakeIssue(
      '### Brief mission\n\nPeer support for military veterans returning home.\n'
    ).intake
    expect(vets.missionCategory).toBe('veterans')

    const general = parseIntakeIssue(
      '### Brief mission\n\nAfter-school robotics club for local students.\n'
    ).intake
    expect(general.missionCategory).toBe('general')

    // An explicit dropdown always overrides the text classifier.
    const explicit = parseIntakeIssue(
      '### Brief mission\n\nWe run a food pantry.\n\n### Mission category\n\nGeneral\n'
    ).intake
    expect(explicit.missionCategory).toBe('general')
  })

  it('parses documents, application progress, partnership, and operations fields', () => {
    const body = `### Charity status

Pre-501(c)(3) (actively pursuing)

### Documents on file

- [x] Articles of incorporation
- [ ] Bylaws
- [x] Brand assets (logo, brand guide)

### State solicitation registrations

3

### Application progress (pre-501(c)(3))

- [x] State incorporation filed
- [x] EIN obtained from the IRS
- [ ] Bylaws adopted by the board

### Form 1023 status

Form 1023 (long) submitted — voluntary

### Partnership due diligence

Documented outreach to 3+ with reasons partnership was not viable

### Operations evidence (not pursuing 501(c)(3))

- [x] Recurring activities (monthly meetings, regular events)
`
    const { intake } = parseIntakeIssue(body)
    expect(intake.documents.articlesOfIncorporation).toBe(true)
    expect(intake.documents.bylaws).toBe(false)
    expect(intake.documents.brandAssets).toBe(true)
    expect(intake.documents.solicitationRegistrations).toBe(3)
    expect(intake.applicationProgress.incorporationFiled).toBe(true)
    expect(intake.applicationProgress.einObtained).toBe(true)
    expect(intake.applicationProgress.bylawsAdopted).toBe(false)
    expect(intake.applicationProgress.form).toBe('1023-submitted-voluntary')
    expect(intake.partnershipDueDiligence).toBe('outreach-3plus')
    expect(intake.operationsEvidence.recurringActivities).toBe(true)
    expect(intake.operationsEvidence.activeCommunity).toBe(false)
  })
})
