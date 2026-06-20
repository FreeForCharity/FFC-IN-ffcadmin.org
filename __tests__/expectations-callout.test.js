/**
 * Expectations Callout Tie-in Tests
 *
 * The ExpectationsCallout surfaces the gist of the audience-specific Terms of
 * Service sections on public marketing pages. These tests keep that wiring
 * correct: the component deep-links to the right ToS sections, and the expected
 * pages render it with the right audience.
 */

const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', 'src')
const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8')

describe('ExpectationsCallout component', () => {
  const src = read('components/ExpectationsCallout.tsx')

  test('volunteer audience deep-links to ToS Section 17', () => {
    expect(src).toContain("href: '/terms-of-service#section-17'")
  })

  test('charity audience deep-links to ToS Section 18', () => {
    expect(src).toContain("href: '/terms-of-service#section-18'")
  })
})

describe('ExpectationsCallout is wired into the public pages', () => {
  const volunteerPages = [
    'app/volunteer/page.tsx',
    'app/get-involved/page.tsx',
    'app/volunteer/[role]/page.tsx',
  ]
  const charityPages = ['app/charity-prerequisites/page.tsx', 'app/what-ffc-delivers/page.tsx']

  volunteerPages.forEach((file) => {
    test(`${file} renders the volunteer expectations`, () => {
      const src = read(file)
      expect(src).toContain('ExpectationsCallout')
      expect(src).toMatch(/audience="volunteer"/)
    })
  })

  charityPages.forEach((file) => {
    test(`${file} renders the charity expectations`, () => {
      const src = read(file)
      expect(src).toContain('ExpectationsCallout')
      expect(src).toMatch(/audience="charity"/)
    })
  })
})

describe('ExpectationsCallout deep-link targets exist in the Terms of Service', () => {
  const tos = read('app/terms-of-service/page.tsx')
  const component = read('components/ExpectationsCallout.tsx')

  test('every ToS section the component links to has a matching id', () => {
    for (const m of component.matchAll(/\/terms-of-service#section-(\d+)/g)) {
      expect(tos).toContain(`id="section-${m[1]}"`)
    }
  })
})
