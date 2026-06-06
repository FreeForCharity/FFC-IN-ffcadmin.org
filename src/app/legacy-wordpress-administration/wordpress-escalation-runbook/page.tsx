import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import {
  FFC_FOUNDER_CONTACT,
  getLegacyWpAdminPageBySlug,
} from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-escalation-runbook'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'FFC escalation, vendor SLA, incident severity, P1 P2 P3 P4, hosting support, Cloudflare support, Microsoft 365 support, escalation runbook, Free For Charity',
}

interface Severity {
  level: string
  label: string
  examples: string
  firstResponse: string
}

const severityMatrix: Severity[] = [
  {
    level: 'P1',
    label: 'Critical — site/email down for a live charity',
    examples: 'Site returns 5xx, domain not resolving, all mail bouncing, suspected compromise.',
    firstResponse: 'Immediately. Notify the FFC founder in parallel with the vendor.',
  },
  {
    level: 'P2',
    label: 'High — major function broken, no full outage',
    examples: 'Forms failing, SSL warning, one mailbox down, deploy pipeline broken.',
    firstResponse: 'Same business day.',
  },
  {
    level: 'P3',
    label: 'Medium — degraded or non-urgent',
    examples: 'Slow pages, a broken link, a plugin warning, a single user access issue.',
    firstResponse: 'Within 2 business days.',
  },
  {
    level: 'P4',
    label: 'Low — cosmetic or informational',
    examples: 'Copy tweaks, enhancement requests, questions.',
    firstResponse: 'Best effort / next cycle.',
  },
]

interface Vendor {
  name: string
  scope: string
  path: string
}

// DRAFT — populated from each vendor's public support model. Confirm exact
// contacts/SLAs with the FFC founder before relying on these in an incident.
const vendors: Vendor[] = [
  {
    name: 'InterServer / Hostinger (hosting)',
    scope: 'Origin host, cPanel, server uptime.',
    path: 'Host control-panel support ticket + live chat; phone for outages.',
  },
  {
    name: 'Cloudflare (DNS / CDN / SSL)',
    scope: 'DNS resolution, proxy, SSL, WAF.',
    path: 'Cloudflare dashboard support; community + docs for config. Paid plans add priority support.',
  },
  {
    name: 'Microsoft 365 (email / identity)',
    scope: 'Mailboxes, Entra/Conditional Access, licensing.',
    path: 'M365 admin center → Support; nonprofit support channel where eligible.',
  },
  {
    name: 'WPMU DEV (WordPress plugins/support)',
    scope: 'Managed WordPress plugin stack and support.',
    path: 'WPMU DEV hub support tickets / live chat.',
  },
  {
    name: 'eNom / domain registrar',
    scope: 'Domain registration, transfers, ICANN verification.',
    path: 'Registrar/reseller support via the FFC WHMCS hub.',
  },
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <div
        style={{
          borderLeft: '4px solid #d97706',
          background: '#fffbeb',
          padding: '0.75rem 1rem',
          borderRadius: '0.25rem',
        }}
      >
        <strong>Draft:</strong> the vendor contacts and response targets below are drafted from each
        vendor&apos;s public support model. Confirm the exact escalation contacts and SLAs with the
        FFC founder before relying on them during a real incident.
      </div>

      <p>
        This runbook consolidates the scattered escalation paths into one place: how to classify an
        incident, which vendor owns it, and when to pull in FFC leadership.
      </p>

      <h2>Severity matrix</h2>
      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>What it means</th>
            <th>Examples</th>
            <th>First response</th>
          </tr>
        </thead>
        <tbody>
          {severityMatrix.map((s) => (
            <tr key={s.level}>
              <td>
                <strong>{s.level}</strong>
              </td>
              <td>{s.label}</td>
              <td>{s.examples}</td>
              <td>{s.firstResponse}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Vendor escalation paths</h2>
      <table>
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Owns</th>
            <th>How to escalate</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v.name}>
              <td>{v.name}</td>
              <td>{v.scope}</td>
              <td>{v.path}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>FFC internal escalation</h2>
      <ul>
        <li>
          <strong>Global Admin threshold:</strong> if a volunteer or admin cannot resolve an issue,
          escalate to the FFC founder when it is{' '}
          <strong>{FFC_FOUNDER_CONTACT.escalationCadence}</strong> (sooner for P1).
        </li>
        <li>
          <strong>P1 incidents:</strong> notify the founder immediately, in parallel with the vendor
          — do not wait for the 48-hour threshold.
        </li>
        <li>
          <strong>Founder escalation contact:</strong> {FFC_FOUNDER_CONTACT.name} (
          {FFC_FOUNDER_CONTACT.role}) —{' '}
          <a href={`mailto:${FFC_FOUNDER_CONTACT.email}`}>{FFC_FOUNDER_CONTACT.email}</a>,{' '}
          <a href={FFC_FOUNDER_CONTACT.phoneHref}>{FFC_FOUNDER_CONTACT.phone}</a>.
        </li>
      </ul>

      <h2>Cross-references</h2>
      <ul>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-hosting-techstack/">
            wordpress-hosting-techstack
          </a>{' '}
          — the layered stack so you know which vendor owns a given failure.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-web-hosting/">
            wordpress-web-hosting
          </a>{' '}
          — host-level operations.
        </li>
      </ul>
    </LeafPageShell>
  )
}
