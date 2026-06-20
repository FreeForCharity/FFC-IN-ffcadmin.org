import type { Metadata } from 'next'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('guidestar-candid')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'Reaching Candid/GuideStar’s Gold Seal of Transparency — FFC’s minimum for 501(c)(3) charities. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/guidestar-candid/' },
}

export default function GuidestarCandidPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        Candid (formerly GuideStar) is where donors and grantmakers check whether a charity is
        transparent. Charities earn <strong>Seals of Transparency</strong> — Bronze, Silver, Gold,
        Platinum — by completing increasing levels of profile information.
      </p>
      <p>
        For approved 501(c)(3) charities, <strong>Gold is FFC’s minimum</strong>. Gold requires
        basic org info plus your mission, programs, board, and key financials — all things a healthy
        charity already has. Charities below Gold are placed on hold with guidance to reach it
        before progressing, because the same work makes you fundable everywhere else too.
      </p>
      <p>
        Claim your profile at <code>candid.org</code>, then add the sections each seal requires.
        Provide your profile URL in intake to earn readiness points. A fuller walkthrough is
        forthcoming.
      </p>
    </IntakeHelpShell>
  )
}
