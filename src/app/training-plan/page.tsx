import type { Metadata } from 'next'
import TrackPrerequisites from '@/components/TrackPrerequisites'
import { TrainingPlanInteractive } from './components/TrainingPlanInteractive'

export const metadata: Metadata = {
  title: 'Microsoft 365 Administrator Training Plan',
  description:
    'Operation Digital Sovereignty — the full Microsoft 365 Administrator + GitHub Owner training plan, backed by MS-900 and GitHub Foundations.',
  alternates: { canonical: 'https://ffcadmin.org/training-plan/' },
}

// Server shell: renders the (server-only) account prerequisites — keeping the
// large setup-guides dataset out of the client bundle — then hands off to the
// interactive, progress-tracking client component.
export default function TrainingPlanPage() {
  return (
    <TrainingPlanInteractive
      prerequisites={<TrackPrerequisites pathId="global-admin" accent="blue" />}
    />
  )
}
