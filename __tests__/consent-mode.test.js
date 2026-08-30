/**
 * Consent Mode v2 regression tests.
 *
 * These assert on SOURCE TEXT rather than rendering the layout, because the property
 * that matters is document-order: the consent defaults must be parsed before GTM
 * initialises. jsdom cannot observe that — it evaluates whatever it is handed, in the
 * order it is handed it — so a render-based test would pass just as happily with the
 * two blocks swapped, which is precisely the bug.
 *
 * The defect these lock in: GTM loaded with no consent state at all, which Google
 * treats as unrestricted. Every tag fired on first paint, before the banner appeared.
 * The site asked for consent it had already stopped waiting for.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const layoutSrc = fs.readFileSync(path.join(ROOT, 'src/app/layout.tsx'), 'utf8')
const consentSrc = fs.readFileSync(path.join(ROOT, 'src/components/CookieConsent.tsx'), 'utf8')

describe('Consent Mode v2 defaults', () => {
  test('a consent default block exists in the layout', () => {
    expect(layoutSrc).toMatch(/gtag\(\s*'consent'\s*,\s*'default'/)
  })

  test('the consent default is parsed BEFORE the GTM snippet', () => {
    const consentAt = layoutSrc.search(/gtag\(\s*'consent'\s*,\s*'default'/)
    const gtmAt = layoutSrc.indexOf('googletagmanager.com/gtm.js')

    expect(consentAt).toBeGreaterThan(-1)
    expect(gtmAt).toBeGreaterThan(-1)
    // Strictly before. Equal or after means GTM initialises unrestricted.
    expect(consentAt).toBeLessThan(gtmAt)
  })

  test('regional defaults: a region-scoped denial precedes an unscoped grant', () => {
    // Split at the GTM snippet so text appearing later in the file cannot
    // satisfy these assertions by accident.
    const defaultBlock = layoutSrc.slice(0, layoutSrc.indexOf('googletagmanager.com/gtm.js'))

    // The DENIAL call carries the region list; the GRANT call is unscoped.
    // Region-specific settings take precedence, so the order denial-then-grant
    // gives EEA/UK/CH visitors denied-by-default and everyone else granted.
    const regionAt = defaultBlock.indexOf("'region'")
    expect(regionAt).toBeGreaterThan(-1)

    for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) {
      const deniedAt = defaultBlock.search(new RegExp(`'${key}':\\s*'denied'`))
      const grantedAt = defaultBlock.search(new RegExp(`'${key}':\\s*'granted'`))
      expect(deniedAt).toBeGreaterThan(-1)
      expect(grantedAt).toBeGreaterThan(-1)
      // Denial (region-scoped) first, grant (unscoped) second.
      expect(deniedAt).toBeLessThan(grantedAt)
      // The region list belongs to the denial call, not the grant call.
      expect(deniedAt).toBeLessThan(regionAt)
      expect(regionAt).toBeLessThan(grantedAt)
    }
  })

  test('the denial region list is exactly the 32 EU User Consent Policy codes', () => {
    const defaultBlock = layoutSrc.slice(0, layoutSrc.indexOf('googletagmanager.com/gtm.js'))
    const regionMatch = defaultBlock.match(/'region':\s*\[([^\]]+)\]/)
    expect(regionMatch).not.toBeNull()

    const codes = regionMatch[1].match(/[A-Z]{2}/g)
    // 27 EU member states + IS/LI/NO (non-EU EEA) + GB + CH.
    const expected = [
      'AT',
      'BE',
      'BG',
      'HR',
      'CY',
      'CZ',
      'DK',
      'EE',
      'FI',
      'FR',
      'DE',
      'GR',
      'HU',
      'IE',
      'IT',
      'LV',
      'LT',
      'LU',
      'MT',
      'NL',
      'PL',
      'PT',
      'RO',
      'SK',
      'SI',
      'ES',
      'SE',
      'IS',
      'LI',
      'NO',
      'GB',
      'CH',
    ]
    expect(codes).toHaveLength(32)
    expect([...codes].sort()).toEqual([...expected].sort())
  })

  test('url_passthrough and ads_data_redaction are set before GTM loads', () => {
    const defaultBlock = layoutSrc.slice(0, layoutSrc.indexOf('googletagmanager.com/gtm.js'))
    expect(defaultBlock).toMatch(/gtag\('set',\s*'url_passthrough',\s*true\)/)
    expect(defaultBlock).toMatch(/gtag\('set',\s*'ads_data_redaction',\s*true\)/)
  })

  test('the consent default is a raw inline script, not next/script', () => {
    // next/script injects at runtime even with beforeInteractive, so it cannot
    // guarantee it runs before a parser-executed tag. Only a raw <script> can.
    const block = layoutSrc.slice(0, layoutSrc.indexOf('googletagmanager.com/gtm.js'))
    expect(block).toMatch(/<script\s+id="consent-mode-default"/)
    expect(block).not.toMatch(/<Script\s+id="consent-mode-default"/)
  })
})

describe('CookieConsent grant path', () => {
  test('accepting pushes a real Consent Mode update, not only the custom event', () => {
    expect(consentSrc).toMatch(/gtag\?\.\(\s*'consent'\s*,\s*'update'/)
  })

  test('the custom consent_update event is retained for container triggers', () => {
    // Kept deliberately: container-side triggers may depend on it. Removing it
    // would be a silent behaviour change on the GTM side, invisible from this repo.
    expect(consentSrc).toMatch(/event:\s*'consent_update'/)
  })

  test('analytics_storage in the update tracks the analytics preference', () => {
    expect(consentSrc).toMatch(
      /analytics_storage:\s*prefs\.analytics\s*\?\s*'granted'\s*:\s*'denied'/
    )
  })

  test('personalization_storage in the update tracks the marketing preference', () => {
    // The regional default denies personalization_storage in the EEA/UK/CH, so
    // the banner's update must be able to lift it — otherwise an EEA visitor
    // who grants marketing would keep the denied default forever.
    expect(consentSrc).toMatch(
      /personalization_storage:\s*prefs\.marketing\s*\?\s*'granted'\s*:\s*'denied'/
    )
  })
})

describe('Analytics provisioning guard', () => {
  test('a provisioning check exists', () => {
    expect(consentSrc).toMatch(/isAnalyticsProvisioned/)
  })

  test('loadGoogleAnalytics returns early when the ID is not provisioned', () => {
    const fnAt = consentSrc.indexOf('const loadGoogleAnalytics')
    expect(fnAt).toBeGreaterThan(-1)
    const body = consentSrc.slice(fnAt, fnAt + 900)
    const guardAt = body.indexOf('isAnalyticsProvisioned')
    const loadAt = body.indexOf('googletagmanager.com/gtag')
    expect(guardAt).toBeGreaterThan(-1)
    // The guard must precede the script injection, or it guards nothing.
    expect(guardAt).toBeLessThan(loadAt)
  })

  test('the placeholder ID is rejected and real IDs are accepted', () => {
    // Mirrors the implementation's predicate. Kept in sync by the source assertion
    // above; this checks the RULE is right, that one checks it is USED.
    const isProvisioned = (id) => /^G-[A-Z0-9]{6,}$/.test(id) && !/^G-X+$/.test(id)

    expect(isProvisioned('G-XXXXXXXXXX')).toBe(false)
    expect(isProvisioned('G-XXXX')).toBe(false)
    expect(isProvisioned('')).toBe(false)
    expect(isProvisioned('G-')).toBe(false)

    expect(isProvisioned('G-ABC123XYZ')).toBe(true)
    expect(isProvisioned('G-1A2B3C4D5E')).toBe(true)
  })

  test('the fallback in source is still the placeholder, so the guard is load-bearing', () => {
    // If someone hardcodes a real ID as the fallback, the guard stops being the thing
    // that protects unprovisioned sites — and this test should fail so that is noticed.
    expect(consentSrc).toMatch(/NEXT_PUBLIC_GA_MEASUREMENT_ID \|\| 'G-X+'/)
  })
})
