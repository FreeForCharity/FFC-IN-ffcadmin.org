import type { Metadata } from 'next'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('mission-statement')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'What makes a nonprofit mission statement clear, credible, and fundable. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/mission-statement/' },
}

export default function MissionStatementPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        A strong mission statement says <strong>who you help</strong>, <strong>what you do</strong>,
        and <strong>the change you create</strong> — in one or two plain sentences a stranger
        immediately understands. Avoid jargon, buzzwords, and lists of activities; name the
        beneficiary and the outcome.
      </p>
      <p>
        Good: “We provide emergency shelter and meals to families experiencing homelessness in Pima
        County.” Weaker: “We leverage synergies to empower stakeholders toward holistic community
        wellness.”
      </p>
      <p>
        Your mission also drives your readiness sort order: FFC categorizes missions as essential,
        general, or niche. A clear statement helps us categorize accurately. Fuller guidance,
        examples, and a worksheet are forthcoming.
      </p>
    </IntakeHelpShell>
  )
}
