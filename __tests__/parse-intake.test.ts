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

Essential

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
    expect(intake.missionCategory).toBe('essential')
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
    // Essential mission (+50) + 501(c)(3) (+20) + Gold seal cluster alone clears Foundational.
    expect(result.score).toBeGreaterThan(0)
  })

  it('falls back to baseline on an empty body without throwing', () => {
    const { intake, charityName } = parseIntakeIssue('')
    expect(charityName).toBe('Unnamed charity')
    expect(intake.charityStage).toBe('non-pursuing')
  })
})
