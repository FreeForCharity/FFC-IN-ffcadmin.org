import type { Metadata } from 'next'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('supporting-documents')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'What documents to share during FFC intake and where — public GitHub issues vs. private channels — so you never expose sensitive information. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/supporting-documents/' },
}

export default function SupportingDocumentsPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>Some intake evidence is public-friendly; some is not. Use the right channel:</p>
      <ul>
        <li>
          <strong>Fine in a public issue:</strong> mission, board names with LinkedIn, your EIN
          (public for 501(c)(3) charities), Candid profile URL, links to your articles, bylaws
          summary, and policy pages.
        </li>
        <li>
          <strong>Never in a public issue:</strong> bank or financial account details, donor
          personal data, beneficiary information, security vulnerabilities, or anything that could
          harm the charity or its people if disclosed.
        </li>
      </ul>
      <p>
        For anything sensitive, use the private coordination channel or text FFC directly rather
        than attaching it to a public issue. When in doubt, share a link or a summary publicly and
        the details privately. Fuller guidance is forthcoming.
      </p>
    </IntakeHelpShell>
  )
}
