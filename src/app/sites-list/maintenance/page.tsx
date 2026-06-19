import { Metadata } from 'next'
import { loadSites, dataRefreshedAge } from '../sitesData'
import { PersonaView } from '../PersonaView'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/sites-list/maintenance/' },
  title: 'Maintenance Priority — Sites',
  description: 'Live FFC production sites ranked for ongoing maintenance and monitoring.',
}

export default function MaintenanceView() {
  return (
    <PersonaView
      href="/sites-list/maintenance"
      icon="🔧"
      title="Maintenance Priority"
      intro="For maintenance volunteers: already-live production sites that need ongoing care, ranked by value (health, hosting, an existing repo to fix things in, domain age and investment)."
      accent="from-teal-600 to-emerald-600"
      sites={loadSites()}
      score={(s) => s.maintenanceScore}
      columns={['host', 'repo', 'age']}
      refreshed={dataRefreshedAge()}
    />
  )
}
