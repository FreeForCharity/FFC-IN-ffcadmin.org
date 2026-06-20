import type { Metadata } from 'next'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('social-media')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'Which social platforms matter for a small charity and how to set up organization-owned accounts. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/social-media/' },
}

export default function SocialMediaPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        You don’t need to be everywhere — you need a couple of well-kept, organization-owned
        accounts. For most small US charities, a <strong>Facebook Page</strong> and a{' '}
        <strong>LinkedIn Page</strong> cover donor trust and credibility; add{' '}
        <strong>Instagram</strong> if your work is visual.
      </p>
      <p>
        Create each account under an <em>organization</em> email you control (not a personal login),
        and add a second admin so access never depends on one person. Use the same name, logo, and
        link everywhere so supporters can verify they’ve found the real you.
      </p>
      <p>
        FFC can help connect your accounts during onboarding. Fuller platform-by-platform setup
        steps are forthcoming.
      </p>
    </IntakeHelpShell>
  )
}
