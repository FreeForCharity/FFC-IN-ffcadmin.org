import Link from 'next/link'
import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-web-hosting'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'FFC web hosting, free charity hosting, InterServer nonprofit, Hostinger nonprofit, WordPress hosting, FFC operations',
}

interface Host {
  id: string
  name: string
  panel: string
  ipPattern: string
  status: 'legacy' | 'current'
  notes: string
}

const hosts: Host[] = [
  {
    id: 'interserver-da',
    name: 'InterServer DirectAdmin',
    panel: 'DirectAdmin',
    ipPattern: '192.64.86.202 (shared)',
    status: 'legacy',
    notes:
      'The original FFC origin host. Most charity sites pre-2024 live here. Nonprofit deal is brokered through sales@interserver.net with a copy of the IRS 501(c)(3) letter. Account creation requires the "Powered by InterServer" footer link within 30 days.',
  },
  {
    id: 'interserver-rs1',
    name: 'InterServer RS1 (managed)',
    panel: 'DirectAdmin',
    ipPattern: '216.158.234.18',
    status: 'legacy',
    notes:
      'A handful of larger charity sites (e.g. legion-in-the-woods, technologymonastery) run on RS1 instead of the shared DA. Same nonprofit deal, same footer-link requirement.',
  },
  {
    id: 'hostinger',
    name: 'Hostinger hPanel',
    panel: 'hPanel',
    ipPattern: '153.92.213.212 (shared)',
    status: 'current',
    notes:
      'Default host for new FFC WordPress onboardings since 2024. Nonprofit pricing applied via the Hostinger nonprofit program; footer link is "Powered by Hostinger".',
  },
  {
    id: 'hostpapa',
    name: 'HostPapa',
    panel: 'cPanel',
    ipPattern: '204.44.192.77',
    status: 'legacy',
    notes:
      'Used for a small set of For-Profit + .com charity pairs. Not a default for new onboardings.',
  },
]

const operationalProcedures = [
  {
    id: 'provisioning',
    title: 'Provisioning a new hosting account',
    steps: [
      'Confirm the charity has cleared the wordpress-charity-validation gate.',
      'Open a nonprofit account with the chosen host (Hostinger is current default) using the charity-domain mailbox.',
      'Email host nonprofit support with the IRS letter + the registered domain.',
      'FFC admin co-signs as tech sponsor.',
      'Once approved, install WordPress via Softaculous / hPanel one-click installer.',
      'Create the globaladmin@freeforcharity.org admin user on the new install.',
      'Verify SSL provisioning, set Cloudflare DNS, run a baseline Lighthouse, save the result in the intake record.',
    ],
  },
  {
    id: 'monitoring',
    title: 'Monitoring an existing hosting account',
    steps: [
      'WPMUDEV Hub dashboard surfaces uptime + Defender alerts. Check weekly.',
      'Cloudflare zone analytics shows traffic anomalies (large 4xx spikes, sustained bot traffic).',
      'Snapshot Pro reports red runs in the Hub; investigate before they chain.',
      'For PHP version drift: hosts auto-upgrade minor versions; major upgrades (PHP 8.x → 8.y) require a manual smoke test on staging first.',
    ],
  },
  {
    id: 'migration-between-hosts',
    title: 'Migrating between hosts',
    steps: [
      'Take a full backup on the source host (see wordpress-cpanel-backup-sop).',
      'Spin up an empty WordPress install on the target host.',
      'Restore the database + uploads onto the target install.',
      'Update wp-config.php with new database credentials.',
      'Run wp search-replace from the old hostname to the new (or the same hostname if just changing host IP).',
      'Swap Cloudflare A record to the new origin IP only after smoke-test passes on staging.',
      'Run Lighthouse on the new origin; investigate any > 10-point regression.',
      'Decommission the source account 7 days after the swap (long enough to catch propagation issues, short enough that the charity is not billed twice).',
    ],
  },
  {
    id: 'static-migration',
    title: 'Migrating off WordPress entirely',
    steps: [
      'Run a Simply Static export per docs/ffc-simply-static-config.md.',
      'Convert the export into a Next.js / Tailwind site using the FFC_Single_Page_Template scaffold.',
      'Cut DNS to GitHub Pages (185.199.108-111.153) once the static site is verified.',
      'Keep the WordPress origin running for 30 days as a fallback (read-only).',
      'Decommission the WP hosting account after the 30-day soak.',
    ],
  },
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        FFC operates WordPress hosting for partner charities across two active hosts (Hostinger,
        InterServer) and two legacy hosts (HostPapa, older InterServer RS1 boxes). This page is the
        operations-team reference for provisioning, monitoring, migrating, and eventually retiring
        those accounts.
      </p>

      <p>
        The charity-facing &ldquo;why free hosting&rdquo; pitch lives at{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/free-charity-web-hosting/
        </a>{' '}
        — keep that page for prospective charity applicants. This page is for the FFC admin actually
        running the hosting.
      </p>

      <h2>Active hosts</h2>
      {hosts.map((host) => (
        <section key={host.id} id={host.id}>
          <h3>
            {host.name} {host.status === 'legacy' && <em>(legacy)</em>}
            {host.status === 'current' && <em>(current default)</em>}
          </h3>
          <p>
            <strong>Control panel:</strong> {host.panel}
          </p>
          <p>
            <strong>Origin IP pattern:</strong> <code>{host.ipPattern}</code>
          </p>
          <p>{host.notes}</p>
        </section>
      ))}

      <h2>Operational procedures</h2>
      {operationalProcedures.map((proc) => (
        <section key={proc.id} id={proc.id}>
          <h3>{proc.title}</h3>
          <ol>
            {proc.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ))}

      <h2>Source of truth for per-charity mapping</h2>
      <p>
        The full list of FFC-managed charity domains, the host each lives on, and the migration
        status is at <Link href="/sites-list">/sites-list</Link> — refreshed automatically from{' '}
        <code>docs/SITES_LIST.md</code> on every push to main.
      </p>

      <h2>Cross-references</h2>
      <ul>
        <li>
          <Link href="/legacy-wordpress-administration/wordpress-hosting-techstack/">
            wordpress-hosting-techstack
          </Link>{' '}
          — the layered model these hosts fit into.
        </li>
        <li>
          <Link href="/legacy-wordpress-administration/wordpress-cpanel-backup-sop/">
            wordpress-cpanel-backup-sop
          </Link>{' '}
          — what to run before risky host operations.
        </li>
        <li>
          <Link href="/legacy-wordpress-administration/wordpress-domains/">wordpress-domains</Link>{' '}
          — DNS and registrar side.
        </li>
        <li>
          <Link href="/guides/wordpress-to-nextjs-guide">
            WordPress-to-Next.js conversion guide
          </Link>{' '}
          — the modern destination for charity sites.
        </li>
      </ul>
    </LeafPageShell>
  )
}
