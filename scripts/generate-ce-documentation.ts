#!/usr/bin/env tsx
/**
 * Generate an FFC CE documentation artifact for one volunteer + body (#358).
 *
 * Reads the committed approved-hours log (public/data/volunteer-hours.json,
 * produced by the hours backend #361/#362) and prints an audit-friendly Markdown
 * certification letter to stdout. Data-driven; no manual per-volunteer editing.
 *
 * Usage:
 *   pnpm tsx scripts/generate-ce-documentation.ts --handle <gh> --body <slug>
 *   pnpm tsx scripts/generate-ce-documentation.ts --volunteer "Jane Doe" --body isc2
 *
 * Optionally pass --ein <value> to fill the issuer EIN.
 */
import { readFileSync } from 'fs'
import { join } from 'path'
import { getCeBody } from '../src/data/ce-bodies'
import type { HoursEntry } from '../src/data/hours-model'
import { buildCeDocument, renderCeDocumentMarkdown, FFC_ISSUER } from '../src/lib/ceDocumentation'

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 ? process.argv[i + 1] : undefined
}

function main() {
  const handle = arg('handle')?.replace(/^@/, '')
  const volunteer = arg('volunteer')
  const bodySlug = arg('body')
  const ein = arg('ein')

  if (!bodySlug || (!handle && !volunteer)) {
    console.error(
      'Usage: pnpm tsx scripts/generate-ce-documentation.ts --body <slug> (--handle <gh> | --volunteer "Name") [--ein <value>]'
    )
    process.exit(1)
  }

  const body = getCeBody(bodySlug)
  if (!body) {
    console.error(`Unknown body slug: ${bodySlug}`)
    process.exit(1)
  }

  const file = join(process.cwd(), 'public', 'data', 'volunteer-hours.json')
  const data = JSON.parse(readFileSync(file, 'utf8')) as { entries: HoursEntry[] }
  const entries = data.entries || []

  // Resolve the volunteer's real name from the hours log when only a handle is given.
  const resolvedName =
    volunteer || entries.find((e) => e.githubHandle === handle)?.volunteer || handle || 'Unknown'

  const doc = buildCeDocument({
    volunteer: resolvedName,
    githubHandle: handle,
    entries,
    body,
    issuer: ein ? { ...FFC_ISSUER, ein } : FFC_ISSUER,
  })

  process.stdout.write(renderCeDocumentMarkdown(doc) + '\n')
}

main()
