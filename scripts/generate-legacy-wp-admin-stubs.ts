#!/usr/bin/env tsx
/**
 * One-shot scaffolder for /legacy-wordpress-administration/<slug>/page.tsx.
 *
 * Reads src/data/legacy-wordpress-administration.ts, writes a stub
 * page.tsx for every entry that does not yet have one. Stubs use
 * <LeafPageShell page={page}> and contain a placeholder body that flags
 * the content as pending migration. Content fill-ins happen in
 * follow-up PRs per page.
 *
 * Idempotent: existing pages are left alone (the script never
 * overwrites). Re-run after adding a new entry to the data file.
 *
 * Usage:  pnpm tsx scripts/generate-legacy-wp-admin-stubs.ts
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  LEGACY_WP_ADMIN_PAGES,
  type LegacyWpAdminPage,
} from '../src/data/legacy-wordpress-administration'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const APP_DIR = resolve(__dirname, '../src/app/legacy-wordpress-administration')

function stubFor(page: LegacyWpAdminPage): string {
  return `import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = ${JSON.stringify(page.slug)}
const page = getLegacyWpAdminPageBySlug(SLUG)!

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: \`https://ffcadmin.org/legacy-wordpress-administration/\${SLUG}/\`,
  },
}

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        <strong>Content migration in progress.</strong> This page is the
        ffcadmin.org operations-team copy of{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          {page.publicSourceUrl}
        </a>
        . Body content is being migrated from the legacy WordPress source as
        part of issue #241.
      </p>
      <p>
        Until the migration lands, see the public version on freeforcharity.org
        for the current content.
      </p>
    </LeafPageShell>
  )
}
`
}

let created = 0
let skipped = 0
for (const page of LEGACY_WP_ADMIN_PAGES) {
  const dir = resolve(APP_DIR, page.slug)
  const file = resolve(dir, 'page.tsx')
  if (existsSync(file)) {
    skipped++
    continue
  }
  mkdirSync(dir, { recursive: true })
  writeFileSync(file, stubFor(page))
  created++
  console.log(`created ${page.slug}/page.tsx`)
}

console.log(`\nDone. created=${created} skipped=${skipped}`)
