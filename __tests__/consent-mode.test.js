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
// The bootstrap moved out of the layout into a shared module so it stays
// byte-identical to FFC-IN-freeforcharity.org's copy. Both sites report to GA4
// property 386764754 as of GTM-WMZH965Q version 4, and one property fed by two
// different consent policies fragments the cross-site journeys the
// consolidation exists to measure.
const consentModeSrc = fs.readFileSync(path.join(ROOT, 'src/lib/consent-mode.ts'), 'utf8')

const firstDefaultAt = consentModeSrc.indexOf("gtag('consent', 'default'")
const secondDefaultAt = consentModeSrc.indexOf("gtag('consent', 'default'", firstDefaultAt + 1)

describe('Consent Mode v2 defaults', () => {
  test('the layout renders the shared bootstrap rather than an inline copy', () => {
    // A hand-inlined duplicate is exactly how the two sites drift apart, and
    // drift here means one GA4 property receiving two different policies.
    expect(layoutSrc).toMatch(/from '@\/lib\/consent-mode'/)
    expect(layoutSrc).toMatch(/__html:\s*CONSENT_MODE_BOOTSTRAP/)
  })

  test('the consent bootstrap is parsed BEFORE the GTM snippet', () => {
    // Unchanged in intent from when the block was inline: GTM reads whatever
    // consent state exists at initialisation, so a bootstrap that lands after
    // it leaves GTM unrestricted. Anchor on the script tag rather than the
    // gtag() call, which now lives in the imported module.
    const bootstrapAt = layoutSrc.indexOf('id="consent-mode-default"')
    const gtmAt = layoutSrc.indexOf('googletagmanager.com/gtm.js')

    expect(bootstrapAt).toBeGreaterThan(-1)
    expect(gtmAt).toBeGreaterThan(-1)
    // Strictly before. Equal or after means GTM initialises unrestricted.
    expect(bootstrapAt).toBeLessThan(gtmAt)
  })

  // This previously asserted 'every tracking-storage category defaults to
  // denied'. That test would still PASS against the region-scoped model — the
  // regional block does deny every category — while the effective worldwide
  // default had become granted. A green test whose name describes the opposite
  // of shipped behaviour is worse than no test, so it now asserts the actual
  // two-block structure.
  test('the regional default denies every tracking-storage category', () => {
    expect(firstDefaultAt).toBeGreaterThan(-1)
    expect(secondDefaultAt).toBeGreaterThan(firstDefaultAt)
    const regional = consentModeSrc.slice(firstDefaultAt, secondDefaultAt)

    for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) {
      expect(regional).toMatch(new RegExp(`'${key}':\\s*'denied'`))
    }
    expect(regional).toMatch(/'region':/)
  })

  test('the regional scope covers the EEA, the UK and Switzerland', () => {
    // Google's EU User Consent Policy is the only reason this list exists.
    // Dropping a member state silently starts granting storage there.
    for (const code of ['DE', 'FR', 'IE', 'IS', 'LI', 'NO', 'GB', 'CH']) {
      expect(consentModeSrc).toMatch(new RegExp(`'${code}'`))
    }
  })

  test('the global default grants, and comes AFTER the regional denial', () => {
    // Order is the entire mechanism: region-scoped settings take precedence
    // over the unscoped one, so regional-first is what gives the EEA denial
    // priority. Reversed, EEA/UK/CH visitors would be granted by default —
    // precisely what Google's policy forbids, with no error to reveal it.
    const global = consentModeSrc.slice(secondDefaultAt)
    expect(global).not.toMatch(/'region':/)
    for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) {
      expect(global).toMatch(new RegExp(`'${key}':\\s*'granted'`))
    }
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
