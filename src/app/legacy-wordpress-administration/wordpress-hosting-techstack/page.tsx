import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-hosting-techstack'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'WordPress hosting, InterServer DirectAdmin, Hostinger, WPMUDEV, Divi, Cloudflare DNS, Microsoft 365, FFC operations',
}

interface Layer {
  id: string
  index: number
  name: string
  vendor: string
  metaphor: string
  responsibility: string
  escalationOrder: string[]
  notes: string
}

const layers: Layer[] = [
  {
    id: 'foundation',
    index: 1,
    name: 'Foundation: Hosting Infrastructure',
    vendor: 'InterServer (DirectAdmin) — legacy; Hostinger (hPanel) for current sites',
    metaphor: 'The land beneath the house.',
    responsibility:
      'Physical servers, network, and the OS-level control panel that hosts every charity WordPress install.',
    escalationOrder: [
      'Vendor support (InterServer or Hostinger) for outages, server errors, disk / quota issues.',
      'FFC Global Admin if vendor escalation is needed.',
    ],
    notes:
      'Most legacy FFC sites live on InterServer DirectAdmin (IPs 192.64.86.202, 216.158.234.18). Newer sites have been migrated to Hostinger hPanel (IP 153.92.213.212). See the FFC sites list for the per-domain mapping.',
  },
  {
    id: 'wordpress-install',
    index: 2,
    name: 'WordPress Installation: Softaculous',
    vendor: 'Softaculous (bundled with DirectAdmin / hPanel)',
    metaphor: 'The foundation of the house.',
    responsibility:
      'Automated WordPress install / upgrade / clone. Owns the wp-config.php, the database name, and the file ownership at install time.',
    escalationOrder: [
      'Host vendor support for install-time errors.',
      'FFC Global Admin for charity-side reinstall / clone / staging copy.',
    ],
    notes:
      "Softaculous installs land in the host's WordPress staging slot. The FFC convention is one charity per cPanel/hPanel account so backups stay scoped.",
  },
  {
    id: 'plugins',
    index: 3,
    name: 'Plugins: WPMUDEV Suite',
    vendor: 'WPMUDEV',
    metaphor: 'Essential utilities (electricity, water, HVAC).',
    responsibility:
      'Security (Defender Pro), performance (Hummingbird, Smush Pro), backups (Snapshot Pro / Shipper Pro), and the WPMUDEV Dashboard plugin that ties everything together.',
    escalationOrder: [
      'WPMUDEV in-product help and documentation.',
      'FFC Global Admin for hub-level account access.',
    ],
    notes:
      'WPMUDEV plugins ship admin tokens that trigger GitHub push-protection during Simply Static exports — see docs/ffc-simply-static-config.md for the plugin allowlist used at conversion time.',
  },
  {
    id: 'theme',
    index: 4,
    name: 'Theme: Divi',
    vendor: 'Elegant Themes',
    metaphor: 'Interior design.',
    responsibility:
      'Page builder, theme styling, and per-site customization. Owns the visual layer the charity edits day-to-day.',
    escalationOrder: [
      'Elegant Themes support for theme bugs and customization.',
      'FFC Global Admin for licence and customization-template questions.',
    ],
    notes:
      'Divi Builder ships its own cached CSS — clear Divi > Theme Options > Builder > Advanced > Static CSS before any Simply Static export.',
  },
  {
    id: 'dns-ssl',
    index: 5,
    name: 'DNS and SSL: Cloudflare',
    vendor: 'Cloudflare',
    metaphor: 'The security system.',
    responsibility:
      "DNS authority, SSL certificate provisioning, WAF, and bulk-redirect rulesets. Connects the charity's domain to its origin server.",
    escalationOrder: [
      'Cloudflare in-product diagnostics (Trace, Audit Log).',
      'FFC Global Admin for zone-level changes (registrar transfers, nameserver updates).',
    ],
    notes:
      'See docs/cloudflare-bulk-redirects-cutover.csv for the redirect set used during a static-site cutover.',
  },
  {
    id: 'email',
    index: 6,
    name: 'Email: Microsoft 365',
    vendor: 'Microsoft 365 (Tenant: freeforcharity.onmicrosoft.com)',
    metaphor: 'The post office.',
    responsibility:
      'Mailbox, calendar, and Teams services for FFC staff and partner-charity contacts. Separate trust boundary from the WordPress install — the WP server does not relay mail.',
    escalationOrder: [
      'Microsoft 365 admin centre for tenant issues.',
      'FFC Global Admin for licence assignments and tenant-level requests.',
    ],
    notes:
      'M365 admin is one of the two Global Administrator tracks volunteers complete in the FFC contributor ladder — see /training-plan/.',
  },
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        FFC charity WordPress sites combine six distinct vendor services in a single stack. Each
        layer has a clear owner, a clear escalation path, and a clear failure mode. This page is the
        operations-team reference for that stack — use it when triaging a charity issue, onboarding
        a new volunteer admin, or scoping a migration off WordPress.
      </p>

      <p>
        The charity-facing version of this content lives at{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/techstack/
        </a>{' '}
        and uses simpler &ldquo;your house&rdquo; metaphors for non-technical charity staff. The
        layers below preserve those metaphors as anchors.
      </p>

      <h2>How to use this page</h2>
      <p>
        Each layer below documents <strong>what it is</strong>, <strong>who owns it</strong>,{' '}
        <strong>how to escalate</strong>, and the <strong>operational notes</strong> a volunteer
        admin needs to know — including the gotchas that show up during static-site conversions.
      </p>

      <p>
        If a charity issue is unresolved within 48 hours of escalating, text founder Clarke Moyer at{' '}
        <a href="tel:5202228104">520-222-8104</a> — same cadence as the charity-facing page.
      </p>

      <h2>The six layers</h2>
      <ol>
        {layers.map((layer) => (
          <li key={layer.id}>
            <a href={`#${layer.id}`}>{layer.name}</a>
          </li>
        ))}
      </ol>

      {layers.map((layer) => (
        <section key={layer.id} id={layer.id}>
          <h2>
            Layer {layer.index} &mdash; {layer.name}
          </h2>
          <p>
            <em>{layer.metaphor}</em>
          </p>
          <p>
            <strong>Vendor:</strong> {layer.vendor}
          </p>
          <p>
            <strong>Responsibility:</strong> {layer.responsibility}
          </p>
          <p>
            <strong>Escalation path:</strong>
          </p>
          <ol>
            {layer.escalationOrder.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            <strong>Operational notes:</strong> {layer.notes}
          </p>
        </section>
      ))}

      <h2>Why this is &ldquo;legacy&rdquo;</h2>
      <p>
        Every charity site FFC builds today targets the GitHub Pages / Next.js static stack instead
        — no WordPress, no plugin sprawl, no monthly licence cost. The layered model above still
        applies (we still operate vendor-by-vendor), but the layers collapse to{' '}
        <em>GitHub Pages + Cloudflare + Microsoft 365</em>: hosting, DNS, and email. No Softaculous,
        no WPMUDEV, no Divi.
      </p>
      <p>
        Read the{' '}
        <a href="/guides/wordpress-to-nextjs-guide">WordPress-to-Next.js conversion guide</a> for
        the migration playbook, and the <a href="/tech-stack">current FFC tech stack</a> for the
        modern equivalent of this page.
      </p>
    </LeafPageShell>
  )
}
