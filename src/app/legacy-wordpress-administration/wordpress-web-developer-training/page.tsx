import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-web-developer-training'
const page = getLegacyWpAdminPageBySlug(SLUG)!

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'FFC web developer training, WHMCS, Cloudflare DNS, Microsoft 365, InterServer, Divi, WPMUDEV, Clarity, Tawk.to, Azure AI',
}

interface PlatformModule {
  id: string
  index: number
  name: string
  purpose: string
  setupNotes: string
  commonChallenges: string[]
  modernReplacement: string
}

const platformModules: PlatformModule[] = [
  {
    id: 'whmcs-hub',
    index: 1,
    name: 'FFC Hub (WHMCS)',
    purpose:
      'Central operations: domain orders, client records, support tickets, billing — all live in WHMCS.',
    setupNotes:
      'Primary contact email must be on an external domain (Outlook) rather than the charity domain. Minimum two contacts per charity for account redundancy. Domain purchases route through the charity-domain mailbox with the coupon code from onboarding confirmation.',
    commonChallenges: [
      'Incomplete onboarding prevents product additions; resolve through a guided screen-share with the charity.',
      'Fraud-flagged orders require verification of US location and matching card/address details — escalate if the charity is legitimate.',
      'Domain transfers fail due to incorrect EPP codes or active privacy settings (especially GoDaddy domains). See wordpress-domains for the transfer-in gotcha list.',
    ],
    modernReplacement:
      'Still in active use; no modern replacement planned. The charity-side billing flow has not migrated.',
  },
  {
    id: 'cloudflare',
    index: 2,
    name: 'Cloudflare (DNS & Email)',
    purpose:
      'DNS authority, SSL provisioning, security rulesets, and email routing infrastructure.',
    setupNotes:
      'Update charity nameservers to FFC Cloudflare servers (ns1.freeforcharity.org / ns2.freeforcharity.org). Configure DMARC for email security. Hook M365 connectivity through Cloudflare automated record insertion using the M365 admin credentials.',
    commonChallenges: [
      'Nameserver propagation can take 24 hours — do not panic if Cloudflare verification is not immediate.',
      'DMARC misconfiguration is the most common cause of email deliverability complaints. Use the M365 connector tool to generate records rather than hand-writing them.',
    ],
    modernReplacement:
      'Still the default DNS and edge layer for both WordPress sites and the Next.js static replacements. No replacement planned.',
  },
  {
    id: 'm365',
    index: 3,
    name: 'Microsoft 365 Email Hosting',
    purpose:
      'Mailbox, calendar, Teams, and the productivity suite the charity actually uses day-to-day.',
    setupNotes:
      'Apply through the Microsoft Nonprofits program after the charity provides their Candid profile. After approval, configure accounts inside the M365 admin portal using the charity domain.',
    commonChallenges: [
      'Nonprofit validation rejection — re-submit with the charity Candid Public Profile link.',
      'Tenant naming collision if the charity used the same domain previously — open a Microsoft support case to release the old tenant.',
    ],
    modernReplacement:
      'Still in active use. M365 administration is one of the two Global Admin training tracks (see /training-plan).',
  },
  {
    id: 'interserver',
    index: 4,
    name: 'InterServer / Hostinger Web Hosting',
    purpose: 'Origin host running WordPress for the charity site.',
    setupNotes:
      'See wordpress-web-hosting for the per-host provisioning steps. Newer onboardings default to Hostinger; legacy sites stay on InterServer.',
    commonChallenges: [
      'Application denial — escalate to FFC founder for tech-sponsor letter.',
      'PHP version drift breaking Divi — roll back to previous PHP minor and open a Divi ticket.',
    ],
    modernReplacement:
      'Replaced by GitHub Pages + Cloudflare for new sites. See /guides/wordpress-to-nextjs-guide.',
  },
  {
    id: 'divi',
    index: 5,
    name: 'Divi WordPress Theme',
    purpose: 'Page builder + theme for charity WordPress sites. Charities author content here.',
    setupNotes:
      'Activate the Divi parent theme, install the FFC child layout, set theme options to match the charity brand colours. Clear the Static CSS cache before any export.',
    commonChallenges: [
      'Divi cached CSS interfering with Simply Static exports — clear cache via Divi > Theme Options > Builder > Advanced > Static CSS before exporting.',
      'Visual builder broken on PHP 8.x minors — see Divi changelog for compatible version.',
    ],
    modernReplacement:
      'Replaced by Tailwind v4 + React components in the Next.js stack. Divi is not used in new builds.',
  },
  {
    id: 'wpmudev',
    index: 6,
    name: 'WPMUDEV Plugin Suite',
    purpose:
      'Performance (Hummingbird, Smush), security (Defender), forms (Forminator), backups (Snapshot), white-labelling (Branda).',
    setupNotes:
      'Install the WPMUDEV Dashboard plugin first, log in with the FFC WPMUDEV account, then add the per-charity bundle from the Hub.',
    commonChallenges: [
      'Plugin tokens trigger GitHub push-protection during Simply Static exports — see docs/ffc-simply-static-config.md for the export-time allowlist.',
      'Snapshot Pro silent failures — check the Hub red badge weekly.',
    ],
    modernReplacement:
      'Not needed in the Next.js stack — static export plus GitHub Pages eliminates the security / performance / backup plugin tier entirely.',
  },
  {
    id: 'clarity',
    index: 7,
    name: 'Microsoft Clarity',
    purpose: 'Heatmaps, session recordings, and user-behaviour analytics on the live charity site.',
    setupNotes:
      'Install via the Clarity WordPress plugin or paste the snippet into the Divi integration field. Site is bound to one Clarity project per charity.',
    commonChallenges: [
      'Project token ends up embedded in the HTML export, triggering GitHub push-protection — handle in docs/ffc-simply-static-config.md plugin exclusion list.',
    ],
    modernReplacement:
      'Plug into the Next.js layout the same way — Clarity supports static sites natively.',
  },
  {
    id: 'tawkto',
    index: 8,
    name: 'Tawk.to Live Chat',
    purpose: 'Customer-support chat widget in the site footer.',
    setupNotes:
      'Install the Tawk.to plugin or paste the widget snippet. Add charity-side responders to the Tawk.to dashboard.',
    commonChallenges: [
      'Widget tokens are the #1 cause of GitHub push-protection failures during Simply Static exports — exclude the Tawk.to plugin from the export.',
    ],
    modernReplacement:
      'Re-evaluate on a per-charity basis. Most charities adopted email + form-based contact instead post-migration.',
  },
  {
    id: 'azure-ai',
    index: 9,
    name: 'Azure AI Language (Question Answering)',
    purpose: 'Custom question-answering knowledge bases for charity chatbots.',
    setupNotes:
      'Optional integration; deploy through the Azure portal under the FFC tenant. Charity-specific knowledge base + Tawk.to integration.',
    commonChallenges: [
      'Cost spike if not rate-limited — set a daily budget alarm on the Azure subscription.',
    ],
    modernReplacement:
      'Re-evaluating in favour of Claude / OpenAI APIs as cost-per-query drops. Not a current default.',
  },
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        FFC web developers operate nine vendor platforms in series to deliver a charity WordPress
        site end-to-end. This guide is the operations-team reference: what each platform does, how
        to set it up, the recurring failure modes, and the modern replacement on the Next.js stack
        where applicable.
      </p>

      <p>
        Charity-facing developer narrative:{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/free-for-charity-ffc-web-developer-training-guide/
        </a>
        .
      </p>

      <h2>How to use this guide</h2>
      <p>
        Read top-to-bottom for first-time admins; jump to a specific module when triaging an active
        charity issue. Each module documents the setup, the recurring failure modes, and what FFC
        does today on the Next.js stack instead.
      </p>

      <h2>Platform modules</h2>
      {platformModules.map((module) => (
        <section key={module.id} id={module.id}>
          <h3>
            {module.index}. {module.name}
          </h3>
          <p>
            <strong>Purpose:</strong> {module.purpose}
          </p>
          <p>
            <strong>Setup notes:</strong> {module.setupNotes}
          </p>
          <p>
            <strong>Common challenges:</strong>
          </p>
          <ul>
            {module.commonChallenges.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p>
            <strong>Modern replacement:</strong> {module.modernReplacement}
          </p>
        </section>
      ))}

      <h2>Resource strategy</h2>
      <p>
        For any platform issue: official documentation first, vendor community / forum second,
        YouTube / third-party guides third. Tools change faster than this page can be updated, so
        always cross-check against the vendor docs before acting.
      </p>

      <h2>Cross-references</h2>
      <ul>
        <li>
          <a href="/training-plan">/training-plan</a> — the modern Global Admin training plan this
          developer guide partially pre-dates.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-hosting-techstack/">
            wordpress-hosting-techstack
          </a>{' '}
          — the layered model these platforms fit into.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-volunteer-proving-ground/">
            wordpress-volunteer-proving-ground
          </a>{' '}
          — the proving-ground checklist developers complete before getting admin access to charity
          sites.
        </li>
        <li>
          <a href="/guides/wordpress-to-nextjs-guide">WordPress-to-Next.js conversion guide</a> —
          what to read next once you understand the WP stack.
        </li>
      </ul>
    </LeafPageShell>
  )
}
