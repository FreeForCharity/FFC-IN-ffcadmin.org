import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-online-impacts-onboarding'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'Online Impacts onboarding, charity transition, FFC takeover, InterServer nonprofit, Microsoft 365 nonprofit, GuideStar onboarding',
}

const prereqMaterials = [
  'IRS 501(c)(3) determination letter',
  'EIN (Employer Identification Number)',
  'Board member names, titles, contact info, LinkedIn profiles, and bios',
  'Mission statement',
  'Most recent Form 990',
  'Annual report (if available)',
  'Programs and services list',
  'Financial statements (past 2 years)',
  'Current operating budget',
  'Strategic plan (if available)',
  'Current website URL',
  'Social media links',
  'High-resolution logo files',
  'Brand guidelines',
]

const externalAccounts = [
  {
    name: 'Charity-named Outlook mailbox',
    adminNote: 'M365 nonprofit tenant; FFC creates the tenant on behalf of the charity if missing.',
  },
  {
    name: 'Candid (GuideStar) profile at Gold or higher',
    adminNote: 'See wordpress-guidestar-guide for the seal-progression runbook.',
  },
  {
    name: 'Verified Nonprofit Facebook page',
    adminNote: 'Cross-checked against intake record during validation.',
  },
  {
    name: 'Verified Nonprofit LinkedIn page',
    adminNote: 'Required for board-bio cross-references.',
  },
  {
    name: 'VolunteerMatch profile',
    adminNote: 'Even if dormant — confirms the charity engages volunteers.',
  },
  {
    name: 'TechSoup validated account',
    adminNote: 'Drives the discounted-software pipeline (QuickBooks, Adobe, Microsoft).',
  },
  {
    name: 'PayPal Nonprofits account',
    adminNote: 'Donor flow target after the FFC-delivered site is live.',
  },
]

interface OnboardingStep {
  index: number
  id: string
  title: string
  description: string
  adminAction: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    index: 1,
    id: 'guidestar-verification',
    title: 'GuideStar 501(c)(3) verification',
    description:
      'Charity supplies both the Public Profile link and the Full Profile link from their Candid record.',
    adminAction:
      'Validate the EIN matches the IRS Business Master File. Confirm seal ≥ Gold or queue them back to wordpress-guidestar-guide.',
  },
  {
    index: 2,
    id: 'board-contact-info',
    title: 'Board contact information',
    description:
      'Charity supplies full contact details for President/Chair, Secretary, Treasurer. Optionally Vice and Member-At-Large.',
    adminAction:
      'Cross-reference board names against the GuideStar profile and any pre-existing FFC records.',
  },
  {
    index: 3,
    id: 'primary-technical-contacts',
    title: 'Primary + technical contacts',
    description:
      'Full contact details for the charity-side primary contact and the technical contact, including timezone and preferred contact hours.',
    adminAction:
      'Add both to the M365 tenant directory under the charity domain once Stage 5 completes.',
  },
  {
    index: 4,
    id: 'onboarding-form',
    title: 'Complete the WHMCS onboarding form',
    description:
      'Charity submits the "Online Impacts to FFC Onboarding" product at the FFC store. This creates the charity record in WHMCS and triggers the FFC intake notification.',
    adminAction:
      'Watch the FFC intake inbox for the form submission, then proceed to domain + hosting steps below.',
  },
]

interface ResourceStep {
  index: number
  id: string
  title: string
  steps: string[]
  adminGotcha: string
}

const domainSteps: ResourceStep = {
  index: 1,
  id: 'domain-email',
  title: 'Domain + email setup',
  steps: [
    'Issue the charity a domain discount code through WHMCS once Stage 4 (Basic Services) starts.',
    'Direct them to freeforcharity.org/domains to request a new .org or transfer an existing one.',
    "Once domain management is in FFC's control, provision charity-domain mailboxes on the M365 tenant (board@, info@, donate@, etc.).",
  ],
  adminGotcha:
    'Domain transfers from non-cooperative registrars can take 5-10 business days. Set the charity expectation up front so they do not chase the status weekly.',
}

const hostingSteps: ResourceStep = {
  index: 2,
  id: 'hosting-setup',
  title: 'InterServer / Hostinger hosting setup',
  steps: [
    'Charity creates an account at my.interserver.net (or hpanel.hostinger.com for newer onboarding) using the charity-domain mailbox.',
    "Charity emails the host's nonprofit-services address with a copy of the IRS 501(c)(3) letter and the registered domain.",
    'FFC admin co-signs as tech sponsor.',
    "Once the host's nonprofit program approves, log in to the control panel and proceed to WordPress install.",
  ],
  adminGotcha:
    "InterServer's nonprofit approval letter routes through sales@interserver.net — historically 24-48 hours; budget a full week to keep expectations conservative.",
}

const wpInstallSteps: ResourceStep = {
  index: 3,
  id: 'wordpress-install',
  title: 'WordPress install + FFC admin account',
  steps: [
    'In Softaculous (DirectAdmin) or the equivalent on hPanel, install WordPress at the root of the charity domain (leave the "directory" field blank).',
    'Set admin username/password from the FFC password manager. Use a generated password — never re-use across charities.',
    'Set site title and tagline from the intake record.',
    'After install, create a second admin user: username globaladmin, email globaladmin@freeforcharity.org, generated password.',
    'Add the "Powered by InterServer" footer link within 30 days of install (or "Powered by Hostinger" on hPanel-hosted sites). This is a hard requirement of the nonprofit hosting deal.',
  ],
  adminGotcha:
    'Missing the footer-link requirement converts a free hosting account into a paid one retroactively. Calendar a 28-day check and ship the link.',
}

const resourceSteps = [domainSteps, hostingSteps, wpInstallSteps]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        Online Impacts charities transitioning into the FFC support footprint follow a structured
        onboarding sequence. The flow exists because Online Impacts and FFC have slightly different
        intake requirements, and the transition needs to capture the delta before service delivery
        starts.
      </p>

      <p>
        The charity-facing version of this guide lives at{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/online-impacts-onboarding-guide/
        </a>{' '}
        and walks the charity team through it. This page is the admin-side companion — what to watch
        for at each step.
      </p>

      <h2>Prerequisites (charity supplies)</h2>
      <p>
        Confirm the charity has the following in hand before the onboarding form goes out. Missing
        prereqs are the single biggest source of stuck onboardings.
      </p>
      <ul>
        {prereqMaterials.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      <h2>External validation accounts</h2>
      <p>
        Each account below maps to a check from{' '}
        <a href="/legacy-wordpress-administration/wordpress-charity-validation/">
          wordpress-charity-validation
        </a>
        :
      </p>
      <ul>
        {externalAccounts.map((acct) => (
          <li key={acct.name}>
            <strong>{acct.name}</strong> — {acct.adminNote}
          </li>
        ))}
      </ul>

      <h2>Onboarding flow</h2>
      {onboardingSteps.map((step) => (
        <section key={step.id} id={step.id}>
          <h3>
            Step {step.index} &mdash; {step.title}
          </h3>
          <p>{step.description}</p>
          <p>
            <strong>Admin action:</strong> {step.adminAction}
          </p>
        </section>
      ))}

      <h2>Resource provisioning (FFC admin runs)</h2>
      {resourceSteps.map((step) => (
        <section key={step.id} id={step.id}>
          <h3>
            {step.index}. {step.title}
          </h3>
          <ol>
            {step.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p>
            <strong>Gotcha:</strong> {step.adminGotcha}
          </p>
        </section>
      ))}

      <h2>Support contacts</h2>
      <ul>
        <li>
          Clarke Moyer (FFC founder) — clarkemoyer@freeforcharity.org,{' '}
          <a href="tel:5202228104">520-222-8104</a>
        </li>
        <li>Pardhasaradhi Namburi (Online Impacts founder) — pardhu@onlineimpacts.org</li>
      </ul>

      <h2>Cross-references</h2>
      <ul>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-service-delivery-stages/">
            wordpress-service-delivery-stages
          </a>{' '}
          — broader lifecycle this fits into.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-charity-validation/">
            wordpress-charity-validation
          </a>{' '}
          — checks that gate each step.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-guidestar-guide/">
            wordpress-guidestar-guide
          </a>{' '}
          — seal progression requirement.
        </li>
      </ul>
    </LeafPageShell>
  )
}
