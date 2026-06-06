import type { Metadata } from 'next'
import HowToSchema from '@/components/legacy-wordpress-administration/HowToSchema'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import {
  FFC_FOUNDER_CONTACT,
  getLegacyWpAdminPageBySlug,
} from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-charity-offboarding'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'charity offboarding, deprovisioning, domain transfer-back, Microsoft 365 offboarding, Google Workspace offboarding, Cloudflare zone, WHMCS closure, backup retention, Free For Charity',
}

interface Step {
  index: number
  id: string
  title: string
  description: string
  adminCheck: string
}

const offboardingFlow: Step[] = [
  {
    index: 1,
    id: 'confirm-intent',
    title: 'Confirm the offboarding request in writing',
    description:
      'Get written confirmation from an authorized board member that the charity is leaving FFC, and the effective date. Record who requested it and why.',
    adminCheck:
      'Do not act on a verbal or single-volunteer request — offboarding is destructive. Require board-level confirmation.',
  },
  {
    index: 2,
    id: 'final-backup',
    title: 'Take a final backup and archive it',
    description:
      'Run a full backup of the site and data per the cPanel backup SOP, label it with the charity and date, and move it to the offboarding archive.',
    adminCheck:
      'Verify the backup restores before deleting anything. Archived backups are retained for 90 days, then purged.',
  },
  {
    index: 3,
    id: 'return-domain',
    title: 'Return or release the domain',
    description:
      'If the charity wants to keep the domain, initiate a transfer-out to their chosen registrar (unlock + EPP code). If not, let it expire or release it after the retention window.',
    adminCheck:
      'A departing charity owns its name and brand — never hold a domain hostage. Disable WHOIS privacy before issuing the EPP code so the transfer does not fail.',
  },
  {
    index: 4,
    id: 'deprovision-identity',
    title: 'Deprovision Microsoft 365 / Google Workspace',
    description:
      'Export any mailboxes/data the charity requests, then remove user accounts and licenses. Reclaim FFC-sponsored licenses.',
    adminCheck:
      'Offer a data export first; only deprovision after the charity confirms they have what they need or the retention window closes.',
  },
  {
    index: 5,
    id: 'close-infra',
    title: 'Close Cloudflare zone and WHMCS account',
    description:
      'Remove the Cloudflare zone (after DNS has moved), and close the WHMCS/billing record. Revoke any remaining shared-tool access (e.g. password-manager shares).',
    adminCheck:
      'Confirm DNS has fully moved to the charity’s new provider before removing the Cloudflare zone, or the site/email will go dark.',
  },
  {
    index: 6,
    id: 'purge',
    title: 'Purge after the retention window',
    description:
      'After 90 days, purge the archived backups and any residual data, and mark the offboarding complete in the records.',
    adminCheck:
      'Document the purge date. If litigation hold or a records request applies, pause the purge and escalate.',
  },
]

const principles = [
  'The charity owns its content, domain, and brand — offboarding returns control, it does not seize it.',
  'Always offer a data export before deprovisioning.',
  'Backups are retained for 90 days after offboarding, then purged.',
  'Board-level written confirmation is required before any destructive step.',
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <HowToSchema
        name={page.title}
        description={page.summary}
        url={`https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`}
        steps={offboardingFlow.map((s) => ({
          name: s.title,
          text: `${s.description} Admin check: ${s.adminCheck}`,
        }))}
      />
      <p>
        When a charity leaves FFC, offboarding cleanly closes out the services we provisioned during
        onboarding — the reverse of the service-delivery lifecycle. The guiding rule:{' '}
        <strong>the charity keeps everything that is theirs</strong> (content, domain, brand, data),
        and FFC reclaims only what it sponsored.
      </p>

      <h2>Principles</h2>
      <ul>
        {principles.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <h2>The offboarding flow</h2>
      {offboardingFlow.map((step) => (
        <section key={step.id} id={step.id}>
          <h3>
            Step {step.index} &mdash; {step.title}
          </h3>
          <p>{step.description}</p>
          <p>
            <strong>Admin check:</strong> {step.adminCheck}
          </p>
        </section>
      ))}

      <h2>Cross-references</h2>
      <ul>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-domains/">wordpress-domains</a> — the
          registration flow this reverses (transfer-out, EPP codes, WHOIS privacy).
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-cpanel-backup-sop/">
            wordpress-cpanel-backup-sop
          </a>{' '}
          — the final backup before archival.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-service-delivery-stages/">
            wordpress-service-delivery-stages
          </a>{' '}
          — offboarding closes this lifecycle.
        </li>
      </ul>

      <h2>Support contact</h2>
      <p>
        {FFC_FOUNDER_CONTACT.name} ({FFC_FOUNDER_CONTACT.role}):{' '}
        <a href={`mailto:${FFC_FOUNDER_CONTACT.email}`}>{FFC_FOUNDER_CONTACT.email}</a>,{' '}
        <a href={FFC_FOUNDER_CONTACT.phoneHref}>{FFC_FOUNDER_CONTACT.phone}</a>.
      </p>
    </LeafPageShell>
  )
}
