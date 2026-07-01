import fs from 'fs'
import path from 'path'
import sitemap from '@/app/sitemap'
import { SEARCH_DOCS } from '@/data/search-index'

function normalize(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

describe('sitemap coverage', () => {
  const sitemapPaths = new Set(sitemap().map((e) => normalize(new URL(e.url).pathname)))

  it('has no duplicate URLs', () => {
    expect(sitemapPaths.size).toBe(sitemap().length)
  })

  // If the page is worth surfacing in site search, it's worth surfacing to
  // search engines. This catches new sections being added to the search index
  // (or a data module) without sitemap entries — the roadmap + intake-help
  // sections shipped with 16 pages missing from the sitemap this exact way.
  SEARCH_DOCS.forEach((doc) => {
    it(`search-indexed page ${doc.href} is in the sitemap`, () => {
      expect(sitemapPaths.has(normalize(doc.href))).toBe(true)
    })
  })
})

describe('custom 404 page (requires build output)', () => {
  const notFoundPath = path.join(process.cwd(), 'out', '404.html')
  const built = fs.existsSync(notFoundPath)
  const maybe = built ? it : it.skip

  maybe('404.html is the branded recovery page with search', () => {
    const html = fs.readFileSync(notFoundPath, 'utf-8')
    expect(html).toContain('Page not found')
    expect(html).toContain('Search the site')
    expect(html).toContain('Popular destinations')
  })
})
