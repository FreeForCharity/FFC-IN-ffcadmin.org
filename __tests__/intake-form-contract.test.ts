/**
 * Contract test: the dropdown options in charity-intake.yml must stay in sync
 * with the parseIntake mapping. If an option string drifts, it would silently
 * collapse to the parser's fallback — this test catches that by asserting each
 * single-select field's options map to as many distinct values as there are
 * options.
 */
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { parseIntakeIssue } from '@/lib/readiness/parseIntake'
import type { IntakeData } from '@/lib/readiness/types'

interface FormField {
  type: string
  attributes?: { label?: string; options?: string[] }
}

const form = yaml.load(
  fs.readFileSync(
    path.join(process.cwd(), '.github', 'ISSUE_TEMPLATE', 'charity-intake.yml'),
    'utf8'
  )
) as { body: FormField[] }

function optionsFor(label: string): string[] {
  const field = form.body.find(
    (f) => f.type === 'dropdown' && f.attributes?.label?.toLowerCase() === label.toLowerCase()
  )
  if (!field?.attributes?.options)
    throw new Error(`No dropdown field "${label}" in charity-intake.yml`)
  return field.attributes.options
}

function parseWith(label: string, option: string): IntakeData {
  return parseIntakeIssue(`### ${label}\n\n${option}\n`).intake
}

const SINGLE_SELECTS: { label: string; read: (i: IntakeData) => unknown }[] = [
  { label: 'Charity status', read: (i) => i.charityStage },
  { label: 'Mission category', read: (i) => i.missionCategory },
  { label: 'Affiliation', read: (i) => i.affiliation },
  { label: 'Revenue and form filed', read: (i) => i.revenueForm },
  { label: '5-year trajectory', read: (i) => i.trajectory },
  { label: 'Primary funding model', read: (i) => i.fundingModel },
  { label: 'Mailing address type', read: (i) => i.address.type },
  { label: 'Candid seal', read: (i) => i.candid.seal },
  { label: 'Existing website', read: (i) => i.existingWebsite },
  { label: 'Form 1023 status', read: (i) => i.applicationProgress.form },
  { label: 'Partnership due diligence', read: (i) => i.partnershipDueDiligence },
  { label: 'Org main contact — phone type', read: (i) => i.contacts.orgMain.phoneType },
  { label: 'Org main contact — email type', read: (i) => i.contacts.orgMain.emailType },
]

describe('charity-intake.yml ↔ parseIntake contract', () => {
  it.each(SINGLE_SELECTS)(
    'every option of "$label" is recognized by the parser',
    ({ label, read }) => {
      const options = optionsFor(label)
      const distinct = new Set(options.map((opt) => read(parseWith(label, opt))))
      expect(distinct.size).toBe(options.length)
    }
  )

  it('checkbox option labels match the scored integration platforms', () => {
    const integrationsField = form.body.find((f) => f.attributes?.label === 'External integrations')
    // js-yaml parses checkbox options as { label } objects under attributes.options.
    const labels = (
      integrationsField?.attributes as unknown as { options: { label: string }[] }
    ).options.map((o) => o.label)
    expect(labels).toEqual([
      'Zeffy',
      'Idealist',
      'Taproot',
      'VolunteerMatch',
      'Charity Navigator',
      'Benevity',
      'Network for Good',
    ])
  })
})
