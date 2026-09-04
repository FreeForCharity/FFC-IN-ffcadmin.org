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

  test('ONE unscoped consent default, and it denies', () => {
    // Split at the GTM snippet so text appearing later in the file cannot
    // satisfy these assertions by accident.
    const defaultBlock = layoutSrc.slice(0, layoutSrc.indexOf('googletagmanager.com/gtm.js'))

    const calls = defaultBlock.match(/gtag\(\s*'consent'\s*,\s*'default'/g) || []
    expect(calls).toHaveLength(1)
    expect(defaultBlock).toMatch(/'analytics_storage':\s*'denied'/)
  })

  test('grants storage to nobody by default, and scopes nothing by region', () => {
    // Asserted by ABSENCE. This case replaced one that checked the denial came
    // BEFORE the grant -- an ordering assertion satisfied by any file
    // containing both, so it passed happily against the permissive default it
    // was supposed to be describing. Reinstating that default is a one-line
    // edit, and only a not-present check catches it.
    const defaultBlock = layoutSrc.slice(0, layoutSrc.indexOf('googletagmanager.com/gtm.js'))

    expect(defaultBlock).not.toContain("'region'")
    for (const key of [
      'ad_storage',
      'ad_user_data',
      'ad_personalization',
      'analytics_storage',
      'personalization_storage',
    ]) {
      expect(defaultBlock).toMatch(new RegExp(`'${key}':\\s*'denied'`))
      expect(defaultBlock).not.toMatch(new RegExp(`'${key}':\\s*'granted'`))
    }
  })

  test('keeps functionality_storage and security_storage granted', () => {
    // Neither carries measurement, and a site that cannot remember a consent
    // choice cannot honour one. This is why the comment above the bootstrap
    // says "analytics and advertising storage", not "storage".
    const defaultBlock = layoutSrc.slice(0, layoutSrc.indexOf('googletagmanager.com/gtm.js'))
    expect(defaultBlock).toMatch(/'functionality_storage':\s*'granted'/)
    expect(defaultBlock).toMatch(/'security_storage':\s*'granted'/)
  })

  test('the single default call carries wait_for_update', () => {
    // It used to be asserted on BOTH calls: the denial needed it so a returning
    // EEA visitor's stored grant applied before the first hit, and the grant
    // needed it so a returning decliner elsewhere was not measured under the
    // permissive default first. There is one call now, and the surviving
    // reason is the second one inverted -- a returning GRANTER's opening hit
    // must not go out cookieless.
    const defaultBlock = layoutSrc.slice(0, layoutSrc.indexOf('googletagmanager.com/gtm.js'))
    const waits = defaultBlock.match(/'wait_for_update':\s*500/g)
    expect(waits).toHaveLength(1)
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
    // The default denies personalization_storage for everyone, so the banner's
    // update must be able to lift it — otherwise any visitor who grants
    // marketing would keep the denied default forever. This used to be scoped
    // to the EEA/UK/CH; it now applies to every visitor, which makes the
    // banner's update the only path to a grant rather than one of two.
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
