import type { Metadata } from 'next'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('501c3-application')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'Form 1023 vs. Form 1023-EZ — which to file, typical timelines, and what FFC offers while you wait for IRS determination. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/501c3-application/' },
}

export default function Application501c3Page() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        Two forms grant federal tax exemption. <strong>Form 1023-EZ</strong> is a short, lower-cost
        form for small organizations that expect under $50,000 in annual revenue and meet the
        eligibility checklist. <strong>Form 1023 (long form)</strong> is required for larger or more
        complex organizations — and is a more rigorous foundation if you expect to grow.
      </p>
      <p>
        FFC gives a small readiness bonus for voluntarily filing the long form when EZ would have
        qualified, because it reflects a stronger governance footing. Either form, filed, scores
        well.
      </p>
      <p>
        Determination can take weeks (EZ) to many months (long form). You don’t have to wait to work
        with FFC — pre-501(c)(3) charities are welcome, and we help you prepare so you’re ready the
        day approval lands. A fuller comparison is forthcoming.
      </p>
    </IntakeHelpShell>
  )
}
