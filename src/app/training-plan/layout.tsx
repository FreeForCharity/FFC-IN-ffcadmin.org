import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Global Admin Training Plan | Free For Charity Admin',
  description:
    'Operation Digital Sovereignty - Global Administrator certification program covering Microsoft 365 and GitHub administration for Free For Charity volunteers.',
}

export default function TrainingPlanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
