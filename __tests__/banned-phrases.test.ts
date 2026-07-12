/**
 * Banned-phrase guard: the gated charity journey re-sequenced delivery to
 * build → validate on GitHub Pages → domain → email. These phrases all assert
 * the OLD domain-first order (or its WHMCS-era mechanics) and must never
 * reappear in user-facing content. Matching is whitespace-normalized so JSX
 * line breaks and {' '} joiners can't hide a phrase from the scan.
 */
import fs from 'fs'
import path from 'path'

const ROOTS = ['src', 'docs', path.join('.github', 'ISSUE_TEMPLATE')]
const SKIP_DIRS = new Set(['node_modules', '.next', 'out', 'coverage'])
const OWN_FILE = path.join('__tests__', 'banned-phrases.test.ts')

const BANNED: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /the domain comes first/i,
    reason: 'Old order — the website comes first now; the domain follows validation (Gate 4).',
  },
  {
    pattern: /launches it on your Cloudflare-managed domain/i,
    reason: 'Old order — sites launch on their free GitHub Pages URL first, not on a domain.',
  },
  {
    pattern: /discount code to request a new domain/i,
    reason: 'Old WHMCS mechanics — domains are ordered only after Gate-3 validation.',
  },
  {
    pattern: /domain we set up in the previous step/i,
    reason: 'Old order — no domain exists before the site is built and validated.',
  },
  {
    pattern: /registers your domain, sets up Microsoft 365, and builds your site/i,
    reason: 'Old delivery sequence — build and validation now precede domain and email.',
  },
  {
    pattern: /once your domain (name )?is set up/i,
    reason: 'Old order — the domain is set up last, after website validation.',
  },
]

/** Collapse JSX {' '} joiners and all whitespace runs so phrases can't hide. */
function normalize(text: string): string {
  return text.replace(/\{\s*['"] ['"]\s*\}/g, ' ').replace(/\s+/g, ' ')
}

function listFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listFiles(full))
    else if (entry.isFile()) out.push(full)
  }
  return out
}

describe('banned old-order phrases', () => {
  const files = ROOTS.flatMap((root) => {
    const abs = path.join(process.cwd(), root)
    return fs.existsSync(abs) ? listFiles(abs) : []
  }).filter((f) => !f.endsWith(OWN_FILE))

  it('scans a plausible number of content files', () => {
    expect(files.length).toBeGreaterThan(50)
  })

  it.each(BANNED)('no file contains $pattern', ({ pattern, reason }) => {
    const hits: string[] = []
    for (const file of files) {
      let text: string
      try {
        text = fs.readFileSync(file, 'utf8')
      } catch {
        continue // binary/unreadable — nothing textual to match
      }
      if (pattern.test(normalize(text))) {
        hits.push(path.relative(process.cwd(), file))
      }
    }
    expect(
      hits.length === 0
        ? ''
        : `Banned phrase ${pattern} found in:\n  ${hits.join('\n  ')}\nWhy banned: ${reason}`
    ).toBe('')
  })
})
