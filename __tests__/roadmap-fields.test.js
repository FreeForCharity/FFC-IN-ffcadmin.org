/**
 * Unit tests for the shared work-order field helpers
 * (`scripts/lib/roadmap-fields.mjs`) — the single implementation behind both
 * the roadmap generator (`scripts/generate-roadmap-data.ts`, which publishes
 * to the PUBLIC public/data/roadmap.json) and the Gate-3 validator
 * (`scripts/gate3-validate.mjs`).
 *
 * The cleanCandidUrl hardening cases are defense in depth for #697 block 8:
 * an upstream field-parsing bug once glued the ~2KB site-config attachment
 * onto the Candid-URL field, and the cleaner let the percent-encoded blob
 * through to the published snapshot. The published value must be a short,
 * markup-free Candid/GuideStar URL or nothing.
 */

let liveUrlFrom, decodeUrlEntities, cleanCandidUrl, cleanEin

beforeAll(async () => {
  const mod = await import('../scripts/lib/roadmap-fields.mjs')
  liveUrlFrom = mod.liveUrlFrom
  decodeUrlEntities = mod.decodeUrlEntities
  cleanCandidUrl = mod.cleanCandidUrl
  cleanEin = mod.cleanEin
})

describe('liveUrlFrom (shared implementation)', () => {
  const url = 'https://freeforcharity.github.io/FFC-EX-x/'

  it('extracts the marked URL and ignores unmarked links / the placeholder', () => {
    expect(liveUrlFrom(`intro\nLive site: ${url}\n`)).toBe(url)
    expect(liveUrlFrom('- Live URL: http://example.org/page')).toBe('http://example.org/page')
    expect(liveUrlFrom('See https://www.guidestar.org/profile/12-3456789')).toBeUndefined()
    expect(
      liveUrlFrom('Live site: (paste the https GitHub Pages URL here once the site loads)')
    ).toBeUndefined()
    expect(liveUrlFrom(null)).toBeUndefined()
    expect(liveUrlFrom(undefined)).toBeUndefined()
  })

  it('strips trailing angle-bracket, bold, paren, comma, and period junk', () => {
    expect(liveUrlFrom(`Live site: <${url}>`)).toBe(url)
    expect(liveUrlFrom(`Live site: **${url}**`)).toBe(url)
    expect(liveUrlFrom(`Live site: ${url})`)).toBe(url)
    expect(liveUrlFrom(`Live site: ${url},`)).toBe(url)
    expect(liveUrlFrom(`Live site: ${url}.`)).toBe(url)
  })

  it('accepts the markdown-link form', () => {
    expect(liveUrlFrom(`Live site: [the staging site](${url})`)).toBe(url)
  })
})

describe('decodeUrlEntities', () => {
  it('decodes &amp; (including double encoding) but leaves angle brackets encoded', () => {
    expect(decodeUrlEntities('https://x.org/?a=1&amp;b=2')).toBe('https://x.org/?a=1&b=2')
    expect(decodeUrlEntities('https://x.org/?a=1&amp;amp;b=2')).toBe('https://x.org/?a=1&b=2')
    expect(decodeUrlEntities('https://x.org/?q=&lt;s&gt;')).toBe('https://x.org/?q=&lt;s&gt;')
  })
})

describe('cleanCandidUrl', () => {
  const candid = 'https://www.guidestar.org/profile/12-3456789'

  it('accepts Candid/GuideStar profile URLs (plain or HTML-wrapped)', () => {
    expect(cleanCandidUrl(candid)).toBe(candid)
    expect(cleanCandidUrl(`<a href="${candid}">profile</a>`)).toBe(candid)
    expect(cleanCandidUrl('https://app.candid.org/profile/1234')).toBe(
      'https://app.candid.org/profile/1234'
    )
  })

  it('rejects non-Candid hosts, non-URLs, and empty values', () => {
    expect(cleanCandidUrl('https://example.org/guidestar.org')).toBeUndefined()
    expect(cleanCandidUrl('not a url')).toBeUndefined()
    expect(cleanCandidUrl('')).toBeUndefined()
    expect(cleanCandidUrl(undefined)).toBeUndefined()
  })

  it('rejects candidates containing markup (defense in depth vs. glued issue-body blocks)', () => {
    expect(cleanCandidUrl(`${candid}<details><summary>x</summary></details>`)).toBeUndefined()
    expect(cleanCandidUrl('<details>...</details>')).toBeUndefined()
  })

  it('rejects candidates longer than ~300 chars (never publish a glued blob)', () => {
    const monster = `${candid}?x=${'a'.repeat(400)}`
    expect(cleanCandidUrl(monster)).toBeUndefined()
    // …but a normal-length querystring is fine.
    expect(cleanCandidUrl(`${candid}?utm=1`)).toBe(`${candid}?utm=1`)
  })

  it('considers only the first line of a multi-line field value', () => {
    // A pre-fix issue body still live on GitHub: the attachment sits inside
    // the Candid field's value, starting on a later line.
    const glued = `${candid}\n\n<details><summary>Generated site.config partial</summary>\nblob\n</details>`
    expect(cleanCandidUrl(glued)).toBe(candid)
  })
})

describe('cleanEin', () => {
  it('normalizes valid EINs and rejects everything else', () => {
    expect(cleanEin('46-2471893')).toBe('46-2471893')
    expect(cleanEin('EIN 462471893')).toBe('46-2471893')
    expect(cleanEin('pending')).toBeUndefined()
    expect(cleanEin(undefined)).toBeUndefined()
  })
})
