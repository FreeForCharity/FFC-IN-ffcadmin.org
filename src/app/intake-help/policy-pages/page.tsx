import type { Metadata } from 'next'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('policy-pages')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'The five policy pages FFC recognizes — donation, privacy, terms, vulnerability disclosure, and security acknowledgement — and why each one matters. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/policy-pages/' },
}

export default function PolicyPagesPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>FFC recognizes five public policy pages, each worth readiness points:</p>
      <ul>
        <li>
          <strong>Donation Policy</strong> — how donations are used, acknowledged, and refunded.
        </li>
        <li>
          <strong>Privacy Policy</strong> — what data you collect and how you protect it.
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
        These reassure donors and partners that you operate responsibly. FFC’s site template
        includes starting points for each; publish them and list them in your intake. Template
        language is forthcoming.
      </p>
    </IntakeHelpShell>
  )
}
