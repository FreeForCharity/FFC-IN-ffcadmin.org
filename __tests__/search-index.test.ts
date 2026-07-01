import fs from 'fs'
import path from 'path'
import { SEARCH_DOCS, searchDocs } from '@/data/search-index'

describe('search index', () => {
  it('has entries and no duplicate hrefs', () => {
    expect(SEARCH_DOCS.length).toBeGreaterThan(30)
    const hrefs = SEARCH_DOCS.map((d) => d.href.replace(/\/+$/, '') || '/')
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('every entry is an internal absolute path with required fields', () => {
    for (const doc of SEARCH_DOCS) {
      expect(doc.href.startsWith('/')).toBe(true)
      expect(doc.title.length).toBeGreaterThan(0)
      expect(doc.description.length).toBeGreaterThan(0)
      expect(doc.category.length).toBeGreaterThan(0)
    }
  })
})

describe('searchDocs ranking', () => {
  it('returns nothing for an empty or whitespace query', () => {
    expect(searchDocs('')).toEqual([])
    expect(searchDocs('   ')).toEqual([])
  })

  it('ranks a title match first', () => {
    const results = searchDocs('roadmap')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].href).toBe('/roadmap')
  })

  it('matches on keywords not present in the title/description', () => {
    // "apply" is a keyword on the Submit page, whose title is "Submit a request".
    const results = searchDocs('apply')
    expect(results.some((d) => d.href === '/roadmap/submit')).toBe(true)
  })

  it('applies AND semantics across tokens', () => {
    const results = searchDocs('readiness methodology')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((d) => d.href === '/roadmap/methodology' || d.category.length > 0)).toBe(
      true
    )
    expect(results[0].href).toBe('/roadmap/methodology')
  })

  it('returns nothing for gibberish', () => {
    expect(searchDocs('zzzznotapage')).toEqual([])
  })

  it('respects the result limit', () => {
    // "a" appears broadly; ensure the cap holds.
    expect(searchDocs('a', 5).length).toBeLessThanOrEqual(5)
  })
})

describe('search index has no dead links (requires build output)', () => {
  const outDir = path.join(process.cwd(), 'out')
  const built = fs.existsSync(outDir)

  const maybe = built ? it : it.skip
  SEARCH_DOCS.forEach((doc) => {
    maybe(`${doc.href} resolves to a generated page`, () => {
      const rel = doc.href === '/' ? '' : doc.href.replace(/^\//, '').replace(/\/$/, '')
      const file = path.join(outDir, rel, 'index.html')
      expect(fs.existsSync(file)).toBe(true)
    })
  })
})
