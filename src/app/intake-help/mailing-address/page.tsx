import type { Metadata } from 'next'
import Link from 'next/link'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('mailing-address')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'How to choose a public mailing address for your charity — PO box, commercial mailbox, real office, or registered agent — why FFC recommends Northwest Registered Agent, and how the choice affects readiness scoring.',
  keywords:
    'charity mailing address, nonprofit registered agent, Northwest Registered Agent, PO box, commercial mailbox, multi-state registration',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/mailing-address/' },
}

export default function MailingAddressPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        Charities need a public mailing address — for donor mail, state filings, and the “contact
        us” expectation every legitimate nonprofit meets. You generally do not want that address to
        be a board member’s home. Here are the options, from least to most preferred.
      </p>

      <h2>Address options, ranked</h2>
      <ul>
        <li>
          <strong>Personal residence</strong> — works at the very start, but exposes a volunteer’s
          home and looks informal. Scored slightly negative.
        </li>
        <li>
          <strong>PO box (USPS)</strong> — cheap and private, but can’t receive courier deliveries
          and some states won’t accept it for official filings.
        </li>
        <li>
          <strong>Commercial mailbox</strong> (UPS Store, etc.) — a real street address with a suite
          number; accepts couriers.
        </li>
        <li>
          <strong>Real office address</strong> — ideal if you have one.
        </li>
        <li>
          <strong>Registered agent service</strong> — highest scored. A registered agent provides a
          compliant address in each state you register in and reliably forwards legal and state
          mail.
        </li>
      </ul>

      <h2>Why FFC recommends Northwest Registered Agent</h2>
      <p>
        Among registered-agent services, FFC recommends <strong>Northwest Registered Agent</strong>{' '}
        for its privacy practices, flat pricing, and responsive mail forwarding. This is an
        editorial recommendation, not a scoring preference: readiness scoring treats <em>any</em>{' '}
        registered-agent service equally. You are free to use a different provider and score
        identically.
      </p>
      <h3>How Northwest’s registered-agent service works</h3>
      <p>
        Northwest acts as your registered agent in whatever state(s) you choose. They receive any
        service of process (lawsuits, subpoenas) and official state mail on your behalf, then scan
        it the same business day to your online account and notify you — so nothing important gets
        lost, and a board member’s home address stays off the public record. Registered-agent
        service is free the first year, then a flat annual fee per state (around $125/year as of
        2026). Free same-day mail scanning is included; optional premium forwarding adds unlimited
        physical mail.
      </p>

      <h3>Setting it up for your charity</h3>
      <ol>
        <li>
          Create an account at <code>northwestregisteredagent.com</code> using an{' '}
          <strong>organization</strong> email you control (not a personal address).
        </li>
        <li>
          Add <strong>Registered Agent Service</strong> in your state of incorporation. Northwest
          gives you a compliant street address you can use as your charity’s public/registered
          address.
        </li>
        <li>
          Use that Northwest address on your state filings and as your public mailing address. Keep
          mail-scan notifications on so state and legal mail reaches your team promptly.
        </li>
        <li>
          Add their service in each additional state where you register to solicit donations (see
          below).
        </li>
      </ol>
      <div className="not-prose rounded-lg border border-teal-300 bg-teal-50 p-3 text-sm text-teal-900">
        <strong>Working with FFC?</strong> If FFC helps administer your registered agent, we’ll
        confirm whether the account is set up under your charity’s own login or coordinated through
        FFC, and which states to cover — just ask in your intake issue or text 520-222-8104.
      </div>

      <h2>Multi-state registration</h2>
      <p>
        If your charity solicits donations in more than one state, you may need to register — and
        maintain a registered agent — in each. FFC’s scoring rewards additional registered-agent
        states (up to a cap), because multi-state coverage signals a charity operating carefully and
        at scale.
      </p>

      <h2>How this affects your readiness score</h2>
      <p>
        Your primary address type sets the base points; additional registered-agent states add more
        (capped); and having both a real office and a registered agent earns a small combined bonus.
        Exact values are on the <Link href="/roadmap/methodology">methodology page</Link>.
      </p>
    </IntakeHelpShell>
  )
}
