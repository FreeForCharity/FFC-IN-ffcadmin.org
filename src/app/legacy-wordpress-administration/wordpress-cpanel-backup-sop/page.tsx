import type { Metadata } from 'next'
import HowToSchema from '@/components/legacy-wordpress-administration/HowToSchema'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-cpanel-backup-sop'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'cPanel backup, WordPress full backup, DirectAdmin, Hostinger hPanel, Snapshot Pro, FFC SOP',
}

interface Step {
  id: string
  index: number
  name: string
  details: string[]
  gotcha?: string
}

const fullBackupSteps: Step[] = [
  {
    id: 'pre-checks',
    index: 1,
    name: 'Pre-flight checks',
    details: [
      'Confirm disk-space headroom in cPanel/DirectAdmin/hPanel ≥ 2× the current site footprint.',
      'Confirm WPMUDEV Snapshot Pro shows green on the most recent automated run; if red, fix that before doing a manual backup so you do not chain failures.',
      'Pause any active Simply Static export — the export branch will compete for the same resources.',
    ],
    gotcha:
      'On Hostinger hPanel, the "Disk Usage" widget under-reports email storage. Open File Manager and confirm the mail directory separately.',
  },
  {
    id: 'cpanel-full-backup',
    index: 2,
    name: 'cPanel / DirectAdmin full backup',
    details: [
      'Log in to cPanel / DirectAdmin / hPanel for the charity account.',
      'Navigate to "Backup" (cPanel), "Create / Restore Backups" (DirectAdmin), or "Files → Backups" (hPanel).',
      'Choose "Full Backup" — includes home directory, MySQL, mail, and configuration.',
      'Set destination: "Generate / Download a Full Backup", then download to the FFC encrypted volume once it completes.',
    ],
    gotcha:
      'Full backups can take 30-90 minutes for a populated charity site. Do not interrupt the panel session — most hosts produce a partial tarball if you do.',
  },
  {
    id: 'database-export',
    index: 3,
    name: 'Database export (belt and suspenders)',
    details: [
      'Open phpMyAdmin from the panel.',
      'Select the WordPress database for the charity site.',
      'Export → custom → format SQL → check "Add DROP TABLE" → check "Save as file" → gzipped output.',
      'Store the .sql.gz alongside the full backup, named <charity>-<YYYY-MM-DD>.sql.gz.',
    ],
    gotcha:
      'wp_options.cron and wp_options.transient bloat databases over time. If the export is > 100 MB, run a transient-cleanup plugin before re-exporting.',
  },
  {
    id: 'verify',
    index: 4,
    name: 'Verify the backup is restorable',
    details: [
      'Pull the cPanel tarball into a local Docker (e.g. lscr.io/linuxserver/wordpress) or a staging subdomain.',
      'Confirm site loads, admin login works, key pages render.',
      'Log the verification timestamp in the charity intake record.',
    ],
    gotcha:
      'A backup that has never been restored is not a backup. Run this step at least quarterly per charity.',
  },
  {
    id: 'rotate',
    index: 5,
    name: 'Rotate and offsite',
    details: [
      'Move the backup off the host volume to FFC offsite storage (Microsoft 365 SharePoint, Google Drive nonprofit tier, or the FFC SFTP archive).',
      'Retention: keep weekly snapshots for one month, monthly for one year, annual indefinitely.',
      'Encrypt the offsite copy at rest (host storage encryption is fine; if using consumer cloud, wrap with `age` or `gpg`).',
    ],
    gotcha:
      'Do not store the backup on the same host volume long-term. A compromised host loses both the live site and the backup.',
  },
]

const partialBackupTriggers = [
  'Before a major plugin or theme update.',
  'Before a content audit run that rewrites images at scale.',
  'Before a Simply Static export attempt on a charity site (the export rewrites links and clears caches; revert path needs a known-good baseline).',
  'Before any DNS / nameserver / SSL change at the registrar.',
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <HowToSchema
        name={page.title}
        description={page.summary}
        url={`https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`}
        steps={fullBackupSteps.map((s) => ({
          name: s.name,
          text: s.details.join(' '),
        }))}
      />
      <p>
        Every FFC-managed WordPress site is backed up automatically by WPMUDEV Snapshot Pro on a
        daily cadence. This SOP covers the <em>manual</em> backup path — what an FFC admin runs
        before risky operations, on quarterly verification cadence, and during rescue scenarios.
      </p>

      <p>
        The charity-facing version of this page on{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org
        </a>{' '}
        is access-controlled (it is an internal FFC SOP). This ffcadmin.org copy is the
        operations-team reference for volunteer admins onboarding to backup duty.
      </p>

      <h2>When to run a manual full backup</h2>
      <ul>
        {partialBackupTriggers.map((t) => (
          <li key={t}>{t}</li>
        ))}
        <li>On a quarterly cadence per site (restore verification).</li>
        <li>Whenever Snapshot Pro reports red for more than one consecutive day.</li>
      </ul>

      <h2>The five-step procedure</h2>
      {fullBackupSteps.map((step) => (
        <section key={step.id} id={step.id}>
          <h3>
            Step {step.index} &mdash; {step.name}
          </h3>
          <ul>
            {step.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          {step.gotcha && (
            <p>
              <strong>Gotcha:</strong> {step.gotcha}
            </p>
          )}
        </section>
      ))}

      <h2>Restore quick-reference</h2>
      <ol>
        <li>Spin up the target environment (staging subdomain or local Docker).</li>
        <li>Restore the database from the .sql.gz first.</li>
        <li>Extract the cPanel tarball into the WordPress document root.</li>
        <li>
          Run <code>wp search-replace</code> against the live → staging hostname.
        </li>
        <li>
          Run <code>wp cache flush</code> and <code>wp transient delete --all</code>.
        </li>
        <li>Spot-check: home, donate, two interior pages, admin login.</li>
      </ol>

      <h2>Cross-references</h2>
      <ul>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-hosting-techstack/">
            wordpress-hosting-techstack
          </a>{' '}
          — the layer the backup operates against.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-service-delivery-stages/">
            wordpress-service-delivery-stages
          </a>{' '}
          — Stage 8 first-backup verification.
        </li>
        <li>
          <code>docs/ffc-simply-static-config.md</code> — Simply Static export interactions with the
          backup window.
        </li>
      </ul>
    </LeafPageShell>
  )
}
