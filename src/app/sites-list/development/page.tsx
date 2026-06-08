import { Metadata } from 'next'
import { loadSites, dataRefreshedAge } from '../sitesData'
import { PersonaView } from '../PersonaView'

export const metadata: Metadata = {
  title: 'Development Priority — Sites',
  description: 'New builds and redesigns in progress, ranked for developer volunteers.',
}

export default function DevelopmentView() {
  return (
    <PersonaView
      href="/sites-list/development"
      icon="🛠️"
      title="Development Priority"
      intro="For developer volunteers: new domains and redesigns in progress — active repos, staging sites, recently-registered domains, and in-build (Error) sites — ranked by how ready they are for hands-on work."
      accent="from-purple-600 to-fuchsia-600"
      sites={loadSites()}
      score={(s) => s.devScore}
      columns={['repo', 'lastPr', 'staging']}
      refreshed={dataRefreshedAge()}
    />
  )
}
