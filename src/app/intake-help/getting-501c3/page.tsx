import type { Metadata } from 'next'
import Link from 'next/link'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('getting-501c3')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'The path from idea to 501(c)(3): incorporate in your state, get an EIN, adopt bylaws, and file Form 1023. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/getting-501c3/' },
}

export default function Getting501c3Page() {
  return (
    <IntakeHelpShell page={page}>
      <p>The usual path from idea to recognized 501(c)(3):</p>
      <ol>
        <li>
          <strong>Incorporate</strong> as a nonprofit in your state (articles of incorporation).
        </li>
        <li>
          <strong>Get an EIN</strong> from the IRS — free, online, takes minutes.
        </li>
        <li>
          <strong>Adopt bylaws</strong> and hold an organizing board meeting with minutes.
        </li>
        <li>
          <strong>File Form 1023 or 1023-EZ</strong> for federal tax-exempt status.
        </li>
      </ol>
      <p>
        You don’t have to wait for IRS approval to work with FFC — pre-501(c)(3) charities are
        welcome, and each milestone you complete raises your readiness score. See{' '}
        <Link href="/intake-help/501c3-application">Form 1023 vs. 1023-EZ</Link> for choosing a
        form. Fuller step-by-step guidance is forthcoming.
      </p>
    </IntakeHelpShell>
  )
}
