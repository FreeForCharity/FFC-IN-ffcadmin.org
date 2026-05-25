import type { Metadata } from 'next'
import HowToSchema from '@/components/legacy-wordpress-administration/HowToSchema'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import {
  FFC_FOUNDER_CONTACT,
  getLegacyWpAdminPageBySlug,
} from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-domains'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'FFC domains, eNom reseller, Cloudflare DNS, .org registration, domain transfer, ICANN verification, nonprofit domain',
}

interface Step {
  index: number
  id: string
  title: string
  description: string
  adminCheck: string
}

const fourStepFlow: Step[] = [
  {
    index: 1,
    id: 'cloudflare-signup',
    title: 'Charity creates Cloudflare account',
    description:
      'Direct the charity to https://dash.cloudflare.com/sign-up using their charity-domain Outlook mailbox. They must keep this tab open through the entire flow.',
    adminCheck:
      'Confirm the account uses the charity-domain mailbox (not a personal Gmail). Cloudflare verification emails land in the same mailbox; personal addresses cause silent failures later.',
  },
  {
    index: 2,
    id: 'open-management',
    title: 'Access the FFC domain management system',
    description:
      'The charity opens hub.freeforcharity.org (WHMCS) using the credentials issued during charity onboarding.',
    adminCheck:
      'If the charity has not completed onboarding (Stage 1-2 of service delivery), do not issue a domain — route them back to the validation flow first.',
  },
  {
    index: 3,
    id: 'register-domain',
    title: 'Register a new .org through FFC',
    description:
      'FFC operates as a Platinum eNom reseller. The charity selects the .org name, applies the discount coupon code from their onboarding confirmation email, and submits.',
    adminCheck:
      'The coupon code is mandatory — without it, the charity is charged real money. If they paste the wrong code, cancel the order and reissue rather than refunding.',
  },
  {
    index: 4,
    id: 'configure-dns',
    title: 'Configure DNS to point at Cloudflare',
    description:
      'In Cloudflare, add the new domain, copy the assigned nameservers, and paste them into the FFC eNom record under "Nameservers". Cloudflare confirms within 24 hours via email.',
    adminCheck:
      "If Cloudflare verification does not complete within 24 hours, check that nameservers were entered in eNom (not the WHMCS UI) and that the charity's mailbox actually received the verification email.",
  },
]

const hardRequirements = [
  'Use an organizational Outlook.com mailbox (never personal Gmail).',
  'Keep the Cloudflare tab open through the domain purchase.',
  'Include the discount coupon code from onboarding confirmation (mandatory).',
  'Provide a payment method despite the $0 invoice (eNom requires a card on file).',
  'Create at least two user accounts with admin access for redundancy and recovery.',
  'Respond to every ICANN verification email within 14 days. Failure suspends the domain.',
]

const transferGotchas = [
  'GoDaddy transfers fail when privacy is active — disable WHOIS privacy on the source first.',
  'EPP codes must be entered exactly as supplied; trailing whitespace is a common cause of "invalid code" errors.',
  'Fraud-flagged orders (typically because of mismatched billing address) need verification of US location and matching card/address — escalate to the FFC founder if the charity is legitimate.',
  'Transfers typically take 5-10 business days. Set the charity expectation up front.',
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <HowToSchema
        name={page.title}
        description={page.summary}
        url={`https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`}
        steps={fourStepFlow.map((s) => ({
          name: s.title,
          text: `${s.description} Admin check: ${s.adminCheck}`,
        }))}
      />
      <p>
        FFC issues free .org domains to validated partner charities through its eNom Platinum
        reseller account. This page covers <strong>two scenarios in equal depth</strong>:
        <strong> registering a new .org</strong> (the dominant flow) and{' '}
        <strong>transferring an existing domain</strong> from another registrar (the gotcha-heavy
        alternative).
      </p>

      <p>
        Charity-facing version:{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/domains/
        </a>
        .
      </p>

      <h2>Which pathway applies</h2>
      <p>
        Use the table below to pick the right entry point. Both scenarios share the same four-step
        flow once the registrar question is settled.
      </p>

      <ul>
        <li>
          <strong>Charity does not yet have a domain</strong> → start at the four-step registration
          flow.
        </li>
        <li>
          <strong>Charity has a domain on another registrar</strong> (GoDaddy, Namecheap, etc.) →
          read the transfer-in gotchas first, then run the four-step flow.
        </li>
      </ul>

      <h2>Two pathways into the domain flow</h2>
      <ul>
        <li>
          <strong>501(c)(3) charities</strong> complete the standard onboarding via{' '}
          <a href="https://freeforcharity.org/501c3/" target="_blank" rel="noopener noreferrer">
            freeforcharity.org/501c3
          </a>{' '}
          before being issued a coupon.
        </li>
        <li>
          <strong>Pre-501(c)(3) organizations</strong> use the alternate flow at{' '}
          <a href="https://freeforcharity.org/pre501c3/" target="_blank" rel="noopener noreferrer">
            freeforcharity.org/pre501c3
          </a>{' '}
          which trades a smaller toolkit for a faster path to a domain.
        </li>
      </ul>

      <h2>The four-step domain flow</h2>
      {fourStepFlow.map((step) => (
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

      <h2>Hard requirements (do not skip)</h2>
      <ul>
        {hardRequirements.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <h2>Domain transfers from another registrar</h2>
      <p>
        For charities arriving with an existing domain (e.g. on GoDaddy, Namecheap, or another
        registrar) we run a transfer-in instead of a new registration. Same coupon process, but with
        these recurring gotchas:
      </p>
      <ul>
        {transferGotchas.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>

      <h2>Email hosting (downstream)</h2>
      <p>
        Once the domain resolves through Cloudflare, the charity moves to Microsoft 365 Business
        Premium for email — free for verified 501(c)(3) organizations, up to 10 mailboxes. See{' '}
        <a href="/legacy-wordpress-administration/wordpress-online-impacts-onboarding/">
          wordpress-online-impacts-onboarding
        </a>{' '}
        for the M365 provisioning steps.
      </p>

      <h2>Cross-references</h2>
      <ul>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-web-hosting/">
            wordpress-web-hosting
          </a>{' '}
          — host setup that pairs with this domain registration.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-hosting-techstack/">
            wordpress-hosting-techstack
          </a>{' '}
          — DNS / SSL layer.
        </li>
        <li>
          <a href="/legacy-wordpress-administration/wordpress-service-delivery-stages/">
            wordpress-service-delivery-stages
          </a>{' '}
          — Stage 4-5 (Basic Services + Charity System & Website Setup).
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
