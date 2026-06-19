import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Microsoft 365 Administrator Training Plan',
  description:
    'Operation Digital Sovereignty - the Microsoft 365 Administrator certification program (covering Microsoft 365 Global Administrator duties and GitHub administration) for Free For Charity volunteers.',
}

export default function TrainingPlanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
