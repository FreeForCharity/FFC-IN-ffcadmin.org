import type { Metadata } from 'next'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('policy-pages')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'The six policy pages every FFC charity site publishes — donation, privacy, cookie, terms, vulnerability disclosure, and security acknowledgement — and why each one matters. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/policy-pages/' },
}

export default function PolicyPagesPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        Every FFC charity site publishes six policy pages, linked from its footer. Each is worth
        readiness points:
      </p>
      <ul>
        <li>
          <strong>Donation Policy</strong> — your charity&apos;s own policy: whether gifts are tax
          deductible, the receipts donors get, and when a donation can be refunded. There is one
          donation policy, in your charity&apos;s name; there is no separate Free For Charity
          donation policy on your site.
        </li>
        <li>
          <strong>Privacy Policy</strong> — what data you collect and how you protect it.
        </li>
        <li>
          <strong>Cookie Policy</strong> — which cookies the site sets and how visitors consent to
          them.
        </li>
        <li>
          <strong>Terms of Service</strong> — the terms for using your site.
        </li>
        <li>
          <strong>Vulnerability Disclosure Policy</strong> — how security researchers can report
          issues safely.
        </li>
        <li>
          <strong>Security Acknowledgement</strong> — how you credit those who report in good faith.
        </li>
      </ul>
      <p>
        These reassure donors and partners that you operate responsibly. FFC’s site templates ship
        all six, branded with your charity&apos;s name and published with the public contact email
        and city/state from your application, so donors know who to reach. List the ones you have
        published in your intake.
      </p>
    </IntakeHelpShell>
  )
}
