import Link from 'next/link'
import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-tools-for-success'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'FFC tools for success, nonprofit toolkit, productivity, accounting, CRM, password management, M365 nonprofit, Salesforce, TechSoup',
}

interface Tool {
  id: string
  name: string
  cost: string
  description: string
  ffcStance: 'required' | 'recommended' | 'optional' | 'deprecated'
  modernNotes: string
}

interface ToolCategory {
  id: string
  label: string
  blurb: string
  tools: Tool[]
}

const categories: ToolCategory[] = [
  {
    id: 'general-everyone',
    label: 'General tools for everyone',
    blurb: 'Personal-productivity tools FFC recommends to anyone working with a charity.',
    tools: [
      {
        id: 'lastpass',
        name: 'LastPass',
        cost: 'Free + Premium',
        description:
          'Password vault for credential storage. Legacy FFC standard for secrets sharing across volunteers.',
        ffcStance: 'recommended',
        modernNotes:
          'Modern FFC is migrating to Bitwarden / 1Password Teams. Still acceptable but evaluate at next renewal.',
      },
      {
        id: 'mint',
        name: 'Mint',
        cost: 'Free, ad-supported',
        description: 'Personal financial tracking — earning and spending patterns over time.',
        ffcStance: 'optional',
        modernNotes:
          'Intuit retired Mint in early 2024. Replacements: Credit Karma (same vendor), Monarch, YNAB.',
      },
      {
        id: 'credit-karma',
        name: 'Credit Karma',
        cost: 'Free, ad-supported',
        description: 'Credit score and report monitoring.',
        ffcStance: 'optional',
        modernNotes: 'Still active; the Mint replacement for budgeting features.',
      },
      {
        id: 'rescuetime',
        name: 'RescueTime',
        cost: 'Free + Premium',
        description: 'Personal productivity tracking — surfaces work-habit patterns.',
        ffcStance: 'optional',
        modernNotes: 'Workplace IT may block installation. Use only on personal machines.',
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        cost: 'Free + Premium',
        description:
          'Professional networking; functions as the durable contact record for FFC volunteers.',
        ffcStance: 'recommended',
        modernNotes: 'Required for proving-ground board cross-references.',
      },
      {
        id: 'dragon',
        name: 'Dragon NaturallySpeaking',
        cost: '~$200',
        description:
          'Speech-to-text for accessibility — particularly useful for volunteers with dyslexia.',
        ffcStance: 'optional',
        modernNotes:
          'macOS and Windows now ship comparable built-in dictation. Evaluate built-in tools first.',
      },
    ],
  },
  {
    id: 'nonprofit-specific',
    label: 'Nonprofit-specific tools',
    blurb: 'Tools FFC routes partner charities to as part of standard onboarding.',
    tools: [
      {
        id: 'guidestar',
        name: 'Candid (GuideStar)',
        cost: 'Free + paid',
        description: 'Canonical US nonprofit directory; FFC requires at minimum the Gold seal.',
        ffcStance: 'required',
        modernNotes: 'See wordpress-guidestar-guide for the seal-progression runbook.',
      },
      {
        id: 'techsoup',
        name: 'TechSoup',
        cost: 'Free + admin fees',
        description:
          'Validated-charity gateway to discounted software (Adobe, Microsoft, QuickBooks).',
        ffcStance: 'required',
        modernNotes:
          'Charity must complete TechSoup validation before FFC routes them through the discount pipeline.',
      },
      {
        id: 'volunteermatch',
        name: 'VolunteerMatch',
        cost: 'Free basic + paid upgrades',
        description: 'Volunteer recruitment + LinkedIn integration.',
        ffcStance: 'recommended',
        modernNotes:
          'Used in charity-validation to confirm the charity engages volunteers — even a dormant profile counts.',
      },
      {
        id: 'm365-nonprofit',
        name: 'Microsoft 365 Enterprise for Nonprofits',
        cost: 'Free + premium tiers',
        description:
          'Mailbox, calendar, Teams, OneDrive, and the Office suite — FFC default productivity stack.',
        ffcStance: 'required',
        modernNotes:
          'M365 admin is one of the two FFC Global Admin training tracks. See /training-plan.',
      },
      {
        id: 'google-workspace',
        name: 'Google Workspace for Nonprofits',
        cost: 'Free + paid plans',
        description: 'Gmail, Drive, AdWords grant.',
        ffcStance: 'optional',
        modernNotes:
          "FFC default is M365; Google Workspace remains acceptable if the charity is already deeply embedded. Don't migrate them just for parity.",
      },
      {
        id: 'salesforce',
        name: 'Salesforce Nonprofit Cloud',
        cost: 'Free up to 10 seats annually',
        description: 'CRM for donor + program management.',
        ffcStance: 'recommended',
        modernNotes:
          'Available through the Salesforce Foundation. Substantial overhead — only deploy if the charity has staff capacity to operate it.',
      },
      {
        id: 'quickbooks',
        name: 'QuickBooks Online (Nonprofit)',
        cost: '$75/year (5 users)',
        description:
          'Industry-standard accounting software, available at nonprofit pricing via TechSoup.',
        ffcStance: 'recommended',
        modernNotes: 'Wave Accounting (below) is the free alternative for very small charities.',
      },
      {
        id: 'grantstation',
        name: 'GrantStation',
        cost: '~$199/year',
        description: 'Grant research and writing tooling.',
        ffcStance: 'optional',
        modernNotes: 'Only worth the cost if the charity has a dedicated grant writer.',
      },
      {
        id: 'mailchimp',
        name: 'MailChimp',
        cost: 'Tiered + 15% nonprofit discount',
        description: 'Marketing automation and email broadcasts.',
        ffcStance: 'optional',
        modernNotes: 'Many charities migrate to ConvertKit / Brevo as MailChimp pricing climbs.',
      },
    ],
  },
  {
    id: 'small-business',
    label: 'Small-business tools',
    blurb: 'Useful when the charity has earned-revenue or consulting income alongside donations.',
    tools: [
      {
        id: 'wave',
        name: 'Wave Accounting',
        cost: 'Free, ad-supported',
        description: 'Basic accounting for very small charities or earned-revenue arms.',
        ffcStance: 'optional',
        modernNotes: 'Migrate to QuickBooks once the charity has more than one income stream.',
      },
      {
        id: 'shoeboxed',
        name: 'Shoeboxed',
        cost: 'Free + premium',
        description: 'Receipt scanning + OCR for charity expense tracking.',
        ffcStance: 'optional',
        modernNotes:
          'M365 + OneDrive + Power Automate covers most of this need now for FFC-managed charities.',
      },
      {
        id: 'fiverr',
        name: 'Fiverr',
        cost: '$5+/task',
        description: 'Outsourced micro-tasks.',
        ffcStance: 'optional',
        modernNotes:
          'Use sparingly — charity-relevant tasks usually need a long-term relationship.',
      },
      {
        id: 'upwork',
        name: 'Upwork',
        cost: 'Per-project',
        description: 'Outsourced larger freelance work.',
        ffcStance: 'optional',
        modernNotes: 'Vet vendors carefully — FFC volunteers are the first line for charity work.',
      },
    ],
  },
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        FFC partners with three audiences — charities, volunteers, and the FFC operations team — and
        each one needs a different slice of the broader nonprofit toolkit. This page is the
        operations-team reference: which tools FFC requires, which it recommends, which it
        tolerates, and which have been retired or replaced since the original guide was published.
      </p>

      <p>
        The charity-facing curated list lives at{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/free-for-charitys-tools-for-success/
        </a>
        . This page adds the FFC stance (required / recommended / optional / deprecated) plus modern
        notes so a volunteer admin onboarding a charity knows what to push for, what to tolerate,
        and what to skip.
      </p>

      <h2>How to read the stance column</h2>
      <ul>
        <li>
          <strong>Required</strong> — FFC will not complete service delivery without this in place
          at the charity.
        </li>
        <li>
          <strong>Recommended</strong> — FFC actively suggests this; deviation needs a reason.
        </li>
        <li>
          <strong>Optional</strong> — Fine if the charity wants it, fine if they do not.
        </li>
        <li>
          <strong>Deprecated</strong> — Was on the legacy list; we no longer recommend it.
        </li>
      </ul>

      {categories.map((category) => (
        <section key={category.id} id={category.id}>
          <h2>{category.label}</h2>
          <p>{category.blurb}</p>
          {category.tools.map((tool) => (
            <section key={tool.id} id={tool.id}>
              <h3>
                {tool.name} <em>({tool.ffcStance})</em>
              </h3>
              <p>
                <strong>Cost:</strong> {tool.cost}
              </p>
              <p>{tool.description}</p>
              <p>
                <strong>Modern notes:</strong> {tool.modernNotes}
              </p>
            </section>
          ))}
        </section>
      ))}

      <h2>Cross-references</h2>
      <ul>
        <li>
          <Link href="/legacy-wordpress-administration/wordpress-online-impacts-onboarding/">
            wordpress-online-impacts-onboarding
          </Link>{' '}
          — the external-validation account checklist.
        </li>
        <li>
          <Link href="/legacy-wordpress-administration/wordpress-guidestar-guide/">
            wordpress-guidestar-guide
          </Link>{' '}
          — Candid is the most-required tool on this list.
        </li>
        <li>
          <Link href="/training-plan">/training-plan</Link> — the FFC volunteer-side toolkit
          alignment.
        </li>
      </ul>
    </LeafPageShell>
  )
}
