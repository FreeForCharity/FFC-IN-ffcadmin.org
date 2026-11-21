import type { Metadata } from 'next'
import IntakeHelpRedirect from '@/components/intake-help/IntakeHelpRedirect'
import { getIntakeHelpRedirect } from '@/data/intake-help'

const page = getIntakeHelpRedirect('social-media')

export const metadata: Metadata = {
  title: `${page.title} (moved)`,
  description: 'This help page has moved to freeforcharity.org.',
  robots: { index: false, follow: true },
  alternates: { canonical: page.target },
}

export default function Page() {
  return <IntakeHelpRedirect title={page.title} target={page.target} />
}
