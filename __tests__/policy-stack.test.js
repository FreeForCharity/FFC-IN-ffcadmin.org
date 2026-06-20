/**
 * Policy Stack Integrity Tests
 *
 * These tests lock the invariants of the legal / policy / security stack so a
 * future edit cannot silently break it:
 *   - the six policy pages stay self-contained (no external policy links),
 *   - each renders the shared cross-link block keyed to its own route,
 *   - the long pages' Table of Contents stays in sync with their section ids,
 *   - the footer and sitemap keep entry points to every policy page.
 */

const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', 'src')
const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8')

// route -> source file, for every page in the stack
const POLICY_PAGES = {
  '/terms-of-service': 'app/terms-of-service/page.tsx',
  '/privacy-policy': 'app/privacy-policy/page.tsx',
  '/cookie-policy': 'app/cookie-policy/page.tsx',
  '/donation-policy': 'app/donation-policy/page.tsx',
  '/vulnerability-disclosure-policy': 'app/vulnerability-disclosure-policy/page.tsx',
  '/security-acknowledgements': 'app/security-acknowledgements/page.tsx',
}

// the long pages that carry a clickable Table of Contents
const TOC_PAGES = ['/terms-of-service', '/privacy-policy', '/cookie-policy']

describe('Policy stack integrity', () => {
  describe('Each page renders the shared cross-link block for its own route', () => {
    Object.entries(POLICY_PAGES).forEach(([route, file]) => {
      test(`${route} renders <PolicyCrossLinks current="${route}">`, () => {
        const src = read(file)
        expect(src).toContain('PolicyCrossLinks')
        expect(src).toContain(`current="${route}"`)
      })
    })
  })

  describe('Pages stay self-contained (no external policy links)', () => {
    const externalPolicy =
      /freeforcharity\.org\/(terms|privacy|cookie|donation|vulnerability|security)/
    Object.entries(POLICY_PAGES).forEach(([route, file]) => {
      test(`${route} has no external freeforcharity.org policy link`, () => {
        expect(read(file)).not.toMatch(externalPolicy)
      })
    })
  })

  describe('Table of Contents stays in sync with section ids', () => {
    TOC_PAGES.forEach((route) => {
      test(`${route}: every TOC entry has a matching section id and vice versa`, () => {
        const src = read(POLICY_PAGES[route])

        // numbers declared in the `const TOC = [ { n: N, ... } ]` array
        const tocNums = [...src.matchAll(/\{\s*n:\s*(\d+)\s*,/g)]
          .map((m) => Number(m[1]))
          .sort((a, b) => a - b)
        // ids actually present on the page sections
        const idNums = [...src.matchAll(/id="section-(\d+)"/g)]
          .map((m) => Number(m[1]))
          .sort((a, b) => a - b)

        expect(tocNums.length).toBeGreaterThan(0)
        expect(src).toContain('PolicyTOC items={TOC}')
        expect(idNums).toEqual(tocNums)
      })
    })
  })

  describe('Cross-page deep-link targets exist', () => {
    // Other pages deep-link into specific Terms of Service sections; guard the targets.
    const tos = read(POLICY_PAGES['/terms-of-service'])

    test('Terms of Service has the section ids other pages deep-link to', () => {
      // privacy-policy -> /terms-of-service#section-3 (eligibility / age)
      expect(tos).toContain('id="section-3"')
      // charity-prerequisites -> /terms-of-service#section-18 (supported charities)
      expect(tos).toContain('id="section-18"')
    })

    test('pages that deep-link to ToS sections target ids that exist', () => {
      const sources = {
        'app/privacy-policy/page.tsx': read('app/privacy-policy/page.tsx'),
        'app/charity-prerequisites/page.tsx': read('app/charity-prerequisites/page.tsx'),
      }
      Object.values(sources).forEach((src) => {
        for (const m of src.matchAll(/\/terms-of-service#section-(\d+)/g)) {
          expect(tos).toContain(`id="section-${m[1]}"`)
        }
      })
    })
  })

  describe('PolicyCrossLinks component lists exactly the six pages, each described', () => {
    test('POLICY_PAGES hrefs and blurbs are complete', () => {
      const src = read('components/PolicyCrossLinks.tsx')
      Object.keys(POLICY_PAGES).forEach((route) => {
        expect(src).toContain(`href: '${route}'`)
      })
      // one blurb per page (six entries)
      const blurbs = [...src.matchAll(/blurb:/g)]
      expect(blurbs).toHaveLength(Object.keys(POLICY_PAGES).length)
    })
  })

  describe('Footer and sitemap reach every policy page', () => {
    const footer = read('components/Footer.tsx')
    const sitemap = read('app/sitemap.ts')
    Object.keys(POLICY_PAGES).forEach((route) => {
      test(`Footer links to ${route}`, () => {
        expect(footer).toContain(`href="${route}"`)
      })
      test(`Sitemap includes ${route}`, () => {
        expect(sitemap).toContain(`${route}/`)
      })
    })
  })
})
