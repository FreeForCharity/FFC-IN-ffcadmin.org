import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-service-delivery-stages'
const page = getLegacyWpAdminPageBySlug(SLUG)!

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'FFC service delivery, intake validation kickoff, WHMCS portal, charity onboarding lifecycle, WPMUDEV, M365 nonprofit',
}

interface Stage {
  id: string
  index: number
  name: string
  description: string
  exitGate: string
  blockerHandling: string
  ownerRole: 'Intake Volunteer' | 'FFC Global Admin' | 'Web Developer Volunteer'
}

const stages: Stage[] = [
  {
    id: 'initial-contact',
    index: 1,
    name: 'Initial Contact & Onboarding',
    description:
      'Charity discovers FFC and completes account setup through the WHMCS portal by selecting the "Charity Onboarding & Validation" product. Intake form is submitted at no cost.',
    exitGate:
      'WHMCS account exists, intake form is fully completed, charity has acknowledged the FFC AUP.',
    blockerHandling:
      'Missing fields → reply with the specific gaps. International charities → polite decline, US-only restriction.',
    ownerRole: 'Intake Volunteer',
  },
  {
    id: 'validation-checks',
    index: 2,
    name: 'FFC Validation Checks',
    description:
      'External + internal validation runs against the intake record (501(c)(3) status, NTEE code, TechSoup, VolunteerMatch, Facebook, email, WHMCS / PayPal, financial sizing, content review, demographic).',
    exitGate: 'All nine validation checks resolve to a documented pass or a documented exception.',
    blockerHandling:
      'Below Gold seal → bounce back to GuideStar guide. Below US-citizen point of contact → polite decline. Pending TechSoup → put intake on hold with reminder cadence.',
    ownerRole: 'Intake Volunteer',
  },
  {
    id: 'service-offer',
    index: 3,
    name: 'FFC Offers Services',
    description:
      'Approved charity receives a service offer based on mission fit and operational capacity. Priority is given to charities with under $1M revenue that are not federally grant-funded. FFC supports up to 100 organizations.',
    exitGate: 'Charity accepts the offer in writing (WHMCS quote signed).',
    blockerHandling:
      'Over capacity → backlog with a quarterly review. Mission misalignment → polite decline with rationale.',
    ownerRole: 'FFC Global Admin',
  },
  {
    id: 'basic-services',
    index: 4,
    name: 'Basic Services Package',
    description:
      'Two FFC-funded foundations: (a) free domain, registered and maintained by FFC, connected through Cloudflare; (b) Microsoft 365 tenant via the Nonprofits program with domain validation.',
    exitGate:
      'Domain resolves through Cloudflare. Microsoft 365 tenant validates and grants nonprofit pricing.',
    blockerHandling:
      "Cloudflare verification stuck → check registrar nameserver records first. M365 nonprofit validation rejected → re-submit with the charity's Candid profile link.",
    ownerRole: 'FFC Global Admin',
  },
  {
    id: 'system-website-setup',
    index: 5,
    name: 'Charity System & Website Setup',
    description:
      'Branches by status. Pre-501(c)(3) charities complete the WordPress site checkout product and receive an auto-built starter site. 501(c)(3) charities complete the InterServer / Hostinger nonprofit application and designate FFC as tech sponsor.',
    exitGate:
      'WordPress install is live on its eventual production hostname; charity has admin credentials.',
    blockerHandling:
      'Hosting application denied → escalate to the FFC founder for sponsor letter. WordPress install errors → see wordpress-hosting-techstack escalation order.',
    ownerRole: 'FFC Global Admin',
  },
  {
    id: 'tech-stack-assignment',
    index: 6,
    name: 'Technical Stack Assignment',
    description:
      'Volunteer admin configures the underlying WordPress infrastructure: SSO accounts, role assignments to charity stakeholders, two-factor enforcement, backup schedule.',
    exitGate: 'Charity primary contact can log into WP admin and into the M365 tenant via SSO.',
    blockerHandling:
      'SSO mismatch (charity using personal email instead of charity-domain mailbox) → block until charity-domain mailbox exists.',
    ownerRole: 'Web Developer Volunteer',
  },
  {
    id: 'plugin-theme-deployment',
    index: 7,
    name: 'Plugin & Theme Deployment',
    description:
      'Install the WPMUDEV Dashboard plugin, Defender (security), Hummingbird / Smush (performance), Snapshot (backups). Deploy Divi parent theme and the FFC child layout.',
    exitGate:
      'WPMUDEV Dashboard reports green across security, performance, backup. Divi child theme is active.',
    blockerHandling:
      'Plugin licence conflicts → confirm the WPMUDEV account membership covers the site.',
    ownerRole: 'Web Developer Volunteer',
  },
  {
    id: 'launch-config',
    index: 8,
    name: 'Initial Site Launch & Configuration',
    description:
      "Functional template site goes live in minutes, pre-populated with the charity's onboarding info. Upgrade PHP to the host-supported 8.x track. First production backup runs.",
    exitGate:
      'Site is reachable at production hostname over HTTPS, Lighthouse > 80, first backup successfully restored to staging as a smoke test.',
    blockerHandling:
      'PHP upgrade breaks Divi → roll back to the previous PHP minor and open a Divi support ticket.',
    ownerRole: 'Web Developer Volunteer',
  },
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        FFC delivers a charity website through an eight-stage lifecycle. Each stage has a clear exit
        gate, a clear owner role, and a documented way to handle the typical blockers. This page is
        the operations-team reference; the charity-facing version on{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org
        </a>{' '}
        describes the same flow from the charity&apos;s perspective.
      </p>

      <h2>The &ldquo;filter out&rdquo; philosophy</h2>
      <p>
        FFC&apos;s intake is intentionally selective: charities demonstrate readiness through the
        validation steps before service-delivery resources commit. This protects volunteer time and
        ensures every shipped site lands at a charity that can actually run it.
      </p>

      <h2>Eligibility floor</h2>
      <ul>
        <li>US-based charity with US-citizen point of contact.</li>
        <li>501(c)(3) status active (or pre-501(c)(3) using the pre501c3 track).</li>
        <li>At minimum Gold Candid seal (see wordpress-guidestar-guide).</li>
        <li>Revenue under $1M and not federally grant-funded (priority criterion).</li>
      </ul>

      <h2>Stage table</h2>

      {stages.map((stage) => (
        <section key={stage.id} id={stage.id}>
          <h3>
            Stage {stage.index} &mdash; {stage.name}
          </h3>
          <p>{stage.description}</p>
          <p>
            <strong>Owner role:</strong> {stage.ownerRole}
          </p>
          <p>
            <strong>Exit gate:</strong> {stage.exitGate}
          </p>
          <p>
            <strong>Blocker handling:</strong> {stage.blockerHandling}
          </p>
        </section>
      ))}

      <h2>After Stage 8 &mdash; service expansion</h2>
      <p>
        Once the basic site is launched and the charity demonstrates they can actually operate it
        (post a few news items, respond to a contact-form submission, manage their own user
        accounts), FFC unlocks advanced services: full design polish, custom functionality, advocacy
        tooling, and increasingly, a static-site migration to the modern{' '}
        <a href="/tech-stack">FFC Next.js stack</a>.
      </p>

      <h2>Cross-references</h2>
      <ul>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-charity-validation/">
            wordpress-charity-validation
          </a>{' '}
          — Stage 2 detail.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-guidestar-guide/">
            wordpress-guidestar-guide
          </a>{' '}
          — Eligibility floor.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-hosting-techstack/">
            wordpress-hosting-techstack
          </a>{' '}
          — Stages 4-8 vendor map.
        </li>
        <li>
          <a href="/guides/wordpress-to-nextjs-guide">WordPress-to-Next.js conversion guide</a> —
          Where charities go after they outgrow the WordPress delivery.
        </li>
      </ul>
    </LeafPageShell>
  )
}
