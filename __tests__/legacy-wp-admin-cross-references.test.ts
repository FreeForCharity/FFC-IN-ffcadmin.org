/**
 * Cross-reference integrity for the Legacy WordPress Administration section.
 *
 * Every leaf page hand-codes links to sibling pages in the form
 * `/legacy-wordpress-administration/<slug>/`. If a slug is renamed in
 * src/data/legacy-wordpress-administration.ts, those hardcoded links
 * silently break. This test grep-style scans every leaf page.tsx and
 * the hub page, then asserts every referenced slug exists in the data
 * file.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { LEGACY_WP_ADMIN_PAGES } from '@/data/legacy-wordpress-administration'

const APP_DIR = join(process.cwd(), 'src', 'app', 'legacy-wordpress-administration')

const KNOWN_SLUGS = new Set(LEGACY_WP_ADMIN_PAGES.map((p) => p.slug))

// Hardcoded literal regex (CodeQL js/incomplete-sanitization compliant).
// The section root is a fixed compile-time path; no dynamic interpolation.
const linkPattern = /\/legacy-wordpress-administration\/([a-z0-9-]+)\/?/g

function walk(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      out.push(...walk(full))
    } else if (entry === 'page.tsx') {
      out.push(full)
    }
  }
  return out
}

describe('Legacy WordPress Administration cross-references', () => {
  const pageFiles = walk(APP_DIR)

  test('found page.tsx for every documented slug + the hub', () => {
    // 12 leaves + 1 hub = 13 page.tsx files
    expect(pageFiles.length).toBe(LEGACY_WP_ADMIN_PAGES.length + 1)
  })

  test.each(pageFiles)('cross-references in %s all resolve to known slugs', (file) => {
    const contents = readFileSync(file, 'utf-8')
    const unknown: string[] = []
    let match: RegExpExecArray | null
    while ((match = linkPattern.exec(contents)) !== null) {
      const slug = match[1]
      // Empty slug means the link is to the hub itself, which is fine.
      if (!slug) continue
      if (!KNOWN_SLUGS.has(slug)) {
        unknown.push(slug)
      }
    }
    expect(unknown).toEqual([])
  })
})
