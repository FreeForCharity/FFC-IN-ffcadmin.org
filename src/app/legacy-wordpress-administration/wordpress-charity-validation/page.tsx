import Link from 'next/link'
import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-charity-validation'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    '501c3 validation, GuideStar, TechSoup, VolunteerMatch, charity vetting, FFC intake, mutual benefit',
}

interface Check {
  id: string
  index: number
  name: string
  whyFfcRunsIt: string
  charitySideValue: string
  runbook: string[]
}

const externalChecks: Check[] = [
  {
    id: '501c3-guidestar',
    index: 1,
    name: '501(c)(3) status via Candid / GuideStar',
    whyFfcRunsIt:
      'Confirms the charity is what it claims to be against the canonical nonprofit transparency authority, and surfaces the NTEE code we use for mission-alignment scoring.',
    charitySideValue:
      'Verified GuideStar profile improves donor confidence and unlocks funding opportunities the charity may not have known about.',
    runbook: [
      'Search the EIN at https://candid.org/ (formerly GuideStar).',
      'Confirm 501(c)(3) status is active (not revoked, not pending).',
      'Record the NTEE code in the FFC intake record.',
      'If no profile exists, queue the charity for GuideStar profile setup via the GuideStar guide.',
    ],
  },
  {
    id: 'techsoup',
    index: 2,
    name: 'TechSoup legal-entity confirmation',
    whyFfcRunsIt:
      'Independent vetting from a respected charity-services provider; also unlocks the discounted-software pipeline (QuickBooks, Adobe, Microsoft) FFC routes charities through.',
    charitySideValue:
      'TechSoup membership gives the charity access to enterprise software at nonprofit prices, often saving thousands per year.',
    runbook: [
      'Search the EIN at https://www.techsoup.org/.',
      'Confirm validation status is "Validated" (not "Pending").',
      'If "Pending", help the charity submit the missing paperwork to TechSoup.',
    ],
  },
  {
    id: 'volunteermatch',
    index: 3,
    name: 'VolunteerMatch engagement check',
    whyFfcRunsIt:
      'Signals whether the charity already engages volunteers — important because FFC delivery depends on charity staff being able to receive and respond to volunteer work.',
    charitySideValue:
      'A public VolunteerMatch presence opens the charity to FFC technical volunteers as well as their existing networks.',
    runbook: [
      'Search the charity at https://www.volunteermatch.org/.',
      'Note the cadence of their listings (active / dormant / never posted).',
      'If never posted, flag the intake record so FFC volunteer coordinators know to onboard them.',
    ],
  },
  {
    id: 'facebook-page',
    index: 4,
    name: 'Verified Facebook page',
    whyFfcRunsIt:
      "Cross-checks that the charity's public information matches what they submitted on the intake form. Discrepancies are an early signal of identity / branding inconsistency.",
    charitySideValue:
      'Confirmed Facebook presence supports outreach, donor communication, and event marketing.',
    runbook: [
      "Locate the charity's Facebook page.",
      'Compare name, address, mission, leadership against the intake form.',
      'Note any discrepancies for follow-up before service delivery starts.',
    ],
  },
  {
    id: 'email-microsoft',
    index: 5,
    name: 'Email on a reputable provider (Microsoft 365 preferred)',
    whyFfcRunsIt:
      "A charity emailing from a Gmail / Yahoo address blocks our ability to set up SPF / DKIM / DMARC under the charity's own domain, and risks IP blacklisting on the FFC origin server.",
    charitySideValue:
      'M365 (free for nonprofits) gives the charity a professional address, calendar, Teams, and the productivity suite FFC volunteers also use.',
    runbook: [
      'Confirm at least one charity-domain mailbox exists.',
      'If only personal-provider mailboxes exist, plan an M365 nonprofit onboarding before site launch.',
    ],
  },
  {
    id: 'whmcs-paypal',
    index: 6,
    name: 'WHMCS account + PayPal donor flow',
    whyFfcRunsIt:
      'WHMCS account creation acts as a Know-Your-Customer step that reduces inbound spam; PayPal integration is the path through which donors fund the charity once their FFC site is live.',
    charitySideValue:
      'Secure transaction handling, donor confidence, and the "Donate Now" flow on the eventual FFC-delivered site.',
    runbook: [
      'Confirm the charity has created a WHMCS account against the same EIN.',
      'Confirm PayPal Giving Fund (or equivalent) is set up; if not, add to the onboarding checklist.',
    ],
  },
]

const internalChecks: Check[] = [
  {
    id: 'cost-funding-analysis',
    index: 1,
    name: 'Cost-and-funding analysis (small-charity profile)',
    whyFfcRunsIt:
      "Sizes the charity's budget so FFC can scope the engagement realistically. Lets us route micro-charities (under $50k revenue) to lighter-weight templates and larger ones to the full FFC service.",
    charitySideValue:
      'Documented financial resourcefulness becomes an asset when courting cost-conscious donors and grant-makers.',
    runbook: [
      "Pull the charity's most recent Form 990 / 990-EZ / 990-N from GuideStar or ProPublica Nonprofit Explorer.",
      'Categorize as micro (under $50k), small ($50k-$250k), mid ($250k-$1M), large (over $1M).',
      'Record the category on the intake record — it drives template selection.',
    ],
  },
  {
    id: 'website-form-review',
    index: 2,
    name: 'Existing website + intake-form content review',
    whyFfcRunsIt:
      "Holistic check that the charity's mission, leadership, and program description line up across every public source — their current site, the intake form, the GuideStar profile, and social.",
    charitySideValue:
      'The charity gets explicit feedback on mission consistency and public messaging before we touch their site.',
    runbook: [
      'Read the existing website end-to-end (every page).',
      'Compare against the intake form line-by-line.',
      'List discrepancies and surface them in the intake reply before kickoff.',
    ],
  },
  {
    id: 'demographic-assessment',
    index: 3,
    name: 'Target-demographic assessment',
    whyFfcRunsIt:
      'Establishes who the charity actually serves — the foundation for everything from copy tone to image selection to accessibility considerations on the FFC-delivered site.',
    charitySideValue:
      'Specialized impact becomes a recruitable narrative: aligned donors, aligned volunteers, aligned grant opportunities.',
    runbook: [
      'Identify the primary served population (age, geography, condition, sector).',
      'Confirm with the charity that this matches their lived experience.',
      'Record demographic notes on the intake record — they feed into the design brief.',
    ],
  },
]

function ChecksTable({ rows, title, lead }: { rows: Check[]; title: string; lead: string }) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{lead}</p>
      {rows.map((row) => (
        <section key={row.id} id={row.id}>
          <h3>
            {row.index}. {row.name}
          </h3>
          <p>
            <strong>Why FFC runs it:</strong> {row.whyFfcRunsIt}
          </p>
          <p>
            <strong>What the charity gets:</strong> {row.charitySideValue}
          </p>
          <p>
            <strong>Runbook:</strong>
          </p>
          <ol>
            {row.runbook.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ))}
    </section>
  )
}

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        FFC validates every prospective partner charity against a fixed set of external and internal
        checks before any service-delivery work starts. The checks exist for two reasons at once:
        they protect FFC&apos;s mission integrity, and they hand the charity a richer public
        footprint than they walked in with.
      </p>

      <p>
        The charity-facing version of this page is the{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          Charity Validation Guide on freeforcharity.org
        </a>{' '}
        and explains the &ldquo;mutual benefit&rdquo; framing in plain language. This page is the
        operations-team runbook — what an FFC volunteer admin actually does, in what order, for each
        check.
      </p>

      <h2>When to run validation</h2>
      <p>
        Validation runs during <strong>Stage 1 — Intake</strong> in the FFC service-delivery
        lifecycle. See{' '}
        <Link href="/legacy-wordpress-administration/wordpress-service-delivery-stages/">
          service delivery stages
        </Link>{' '}
        for how this fits into the broader engagement.
      </p>

      <ChecksTable
        title="External validation checks"
        lead="Six third-party signals FFC confirms before committing service-delivery time."
        rows={externalChecks}
      />

      <ChecksTable
        title="Internal validation checks"
        lead="Three FFC-internal reviews that scope the engagement once external checks pass."
        rows={internalChecks}
      />

      <h2>Outcome</h2>
      <p>
        A passing validation lands the charity in the FFC backlog with a complete intake record:
        EIN, NTEE code, validated public profiles, target-demographic notes, and a sized engagement.
        From there, FFC schedules the kickoff and the migration playbook (legacy WordPress today,
        Next.js / static increasingly going forward) takes over.
      </p>
    </LeafPageShell>
  )
}
