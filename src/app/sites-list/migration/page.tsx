import { Metadata } from 'next'
import { loadSites, dataRefreshedAge } from '../sitesData'
import { PersonaView } from '../PersonaView'

export const metadata: Metadata = {
  title: 'Migration Priority — Sites',
  description: 'Live FFC sites on legacy hosting, ranked for migration to GitHub Pages.',
}

export default function MigrationView() {
  return (
    <PersonaView
      href="/sites-list/migration"
      icon="🚚"
      title="Migration Priority"
      intro="For migration volunteers: live FFC sites still on legacy/external hosting, ranked by how much value moving them to GitHub Pages unlocks (host control, traffic-ready health, WordPress content, domain age)."
      accent="from-blue-600 to-indigo-600"
      sites={loadSites()}
      score={(s) => s.migrationScore}
      columns={['host', 'wp', 'age', 'progress']}
      refreshed={dataRefreshedAge()}
    />
  )
}
