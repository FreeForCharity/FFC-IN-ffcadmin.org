import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-volunteer-proving-ground'
const page = getLegacyWpAdminPageBySlug(SLUG)!

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
}

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        <strong>Content migration in progress.</strong> This page is the ffcadmin.org
        operations-team copy of{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          {page.publicSourceUrl}
        </a>
        . Body content is being migrated from the legacy WordPress source as part of issue #241.
      </p>
      <p>
        Until the migration lands, see the public version on freeforcharity.org for the current
        content.
      </p>
    </LeafPageShell>
  )
}
