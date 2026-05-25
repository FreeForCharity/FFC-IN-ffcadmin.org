/**
 * Build-time validation that the on-disk directory tree of
 * /legacy-wordpress-administration/ matches the data file.
 *
 * Catches two failure modes:
 *
 *   1. Orphan directory — a `wordpress-<slug>/page.tsx` exists but its
 *      slug was removed from LEGACY_WP_ADMIN_PAGES. The page still
 *      routes but is invisible in the sidebar / hub.
 *
 *   2. Missing directory — a slug is in LEGACY_WP_ADMIN_PAGES but no
 *      corresponding directory exists on disk. Build will fail loudly,
 *      but this test surfaces the cause without needing the build.
 */

import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { LEGACY_WP_ADMIN_PAGES } from '@/data/legacy-wordpress-administration'

const SECTION_DIR = join(process.cwd(), 'src', 'app', 'legacy-wordpress-administration')

function leafDirectories(): string[] {
  return readdirSync(SECTION_DIR).filter((entry) => {
    if (!entry.startsWith('wordpress-')) return false
    const full = join(SECTION_DIR, entry)
    return statSync(full).isDirectory()
  })
}

describe('Legacy WordPress Administration directory ↔ data sync', () => {
  const onDisk = leafDirectories()
  const declared = LEGACY_WP_ADMIN_PAGES.map((p) => p.slug)

  test('every declared slug has a matching directory on disk', () => {
    const missing = declared.filter((slug) => !onDisk.includes(slug))
    expect(missing).toEqual([])
  })

  test('every on-disk leaf directory is declared in the data file', () => {
    const orphans = onDisk.filter((dir) => !declared.includes(dir))
    expect(orphans).toEqual([])
  })

  test('every leaf directory contains a page.tsx', () => {
    const missingPage = onDisk.filter((dir) => {
      try {
        statSync(join(SECTION_DIR, dir, 'page.tsx'))
        return false
      } catch {
        return true
      }
    })
    expect(missingPage).toEqual([])
  })
})
