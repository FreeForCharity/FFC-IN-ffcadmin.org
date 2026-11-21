import type { Metadata } from 'next'
import IntakeHelpRedirect from '@/components/intake-help/IntakeHelpRedirect'
import { INTAKE_HELP_HUB_TARGET } from '@/data/intake-help'

export const metadata: Metadata = {
  title: 'Intake Help (moved)',
  description: 'Help for charities applying to Free For Charity has moved to freeforcharity.org.',
  robots: { index: false, follow: true },
  alternates: { canonical: INTAKE_HELP_HUB_TARGET },
}

export default function IntakeHelpHub() {
  return <IntakeHelpRedirect title="Help for charities" target={INTAKE_HELP_HUB_TARGET} />
}
