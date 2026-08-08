// Google Consent Mode v2 defaults.
//
// Policy: the most permissive configuration Google's own rules allow.
//
// This file is deliberately a near-copy of the module of the same name in
// FFC-IN-freeforcharity.org. That is not incidental duplication — as of
// GTM-WMZH965Q container version 4, ffcadmin.org and freeforcharity.org
// report to the SAME GA4 property (386764754, measurement id
// G-541Y8JRDLX) so that a visitor's movement between the two sites is one
// journey rather than two unrelated ones.
//
// A single property receiving two DIFFERENT consent policies is a data
// integrity problem, not a style inconsistency. Before this change
// ffcadmin denied every storage category worldwide while freeforcharity
// granted outside the EEA/UK/CH, so the same visitor crossing between the
// sites would flip consent state mid-journey: sessions would fragment,
// and the cross-domain continuity the consolidation exists to provide
// would be silently undone. Keep the two files in step. If you change the
// region list or the defaults here, change them there in the same PR.
//
// Google's EU User Consent Policy binds us as a Google Analytics
// customer, and it requires opt-IN consent before setting cookies or
// reading identifiers for visitors in the EEA, the UK, and Switzerland.
// Everywhere else no such Google-imposed requirement exists, so storage
// defaults to GRANTED and measurement is complete from the first pageview.
//
// Under Consent Mode the Google tags always load; what changes by region
// is whether they may use cookies:
//
//   - Outside EEA/UK/CH  → granted immediately; full cookie-based
//                          measurement, no banner interaction needed.
//   - Inside EEA/UK/CH   → denied until the visitor accepts, but GA4 still
//                          sends COOKIELESS pings, so pageviews are
//                          modeled rather than lost. Accepting flips
//                          storage to granted via a `consent update`.
//
// IMPORTANT — this governs GOOGLE tags only. Consent Mode is a Google
// protocol and Microsoft Clarity does not speak it, so Clarity cannot be
// gated from here. It is gated container-side instead: the Clarity tag in
// GTM-WMZH965Q carries `consentStatus: needed` on `analytics_storage` as
// of version 4. Before that it fired on every pageview regardless of
// choice, while this site's cookie policy promised that declining
// analytics stopped it — the policy was accurate about intent and wrong
// about behaviour. If you ever see Clarity recording a declining
// visitor, that container setting is what regressed.

/**
 * ISO 3166 region codes where Google's EU User Consent Policy applies:
 * the 27 EU member states + the 3 non-EU EEA states (IS, LI, NO), plus
 * the UK (GB) and Switzerland (CH).
 */
export const EU_CONSENT_REGIONS = [
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
  // Non-EU EEA
  'IS',
  'LI',
  'NO',
  // UK + Switzerland
  'GB',
  'CH',
] as const

/**
 * Milliseconds tags wait for a `consent update` before firing with the
 * default state. 500ms is Google's documented starting point: long enough
 * for the stored-preference read, short enough not to meaningfully delay
 * the first hit.
 */
export const CONSENT_WAIT_FOR_UPDATE_MS = 500

/**
 * The inline bootstrap that must execute BEFORE GTM loads.
 *
 * Emitted into <head> in the root layout as a raw inline <script>, not
 * next/script: next/script "beforeInteractive" is still injected by the
 * runtime, whereas a raw tag is executed by the parser at exactly its
 * document position. GTM reads whatever consent state exists when it
 * initialises, so "before" is a correctness requirement here, not a
 * preference. `__tests__/consent-mode.test.js` locks that ordering in.
 *
 * Two `consent default` calls, in Google's documented order: the
 * region-scoped denial FIRST, then the global grant. Region-specific
 * settings take precedence over the unscoped one, so EEA/UK/CH visitors
 * get denied-by-default and everyone else gets granted-by-default.
 * Reversing the two would grant the EEA as well.
 *
 * `url_passthrough` keeps click ids flowing through navigation when
 * cookies are denied, and `ads_data_redaction` strips ad identifiers
 * while `ad_storage` is denied — both are no-ops once consent is granted,
 * so they cost nothing outside the EEA.
 *
 * Declared as a function declaration so `gtag` lands on `window` and the
 * consent banner shares one queue with it.
 */
export const CONSENT_MODE_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'granted',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': ${CONSENT_WAIT_FOR_UPDATE_MS},
  'region': ${JSON.stringify([...EU_CONSENT_REGIONS])}
});
gtag('consent', 'default', {
  'ad_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
  'analytics_storage': 'granted',
  'functionality_storage': 'granted',
  'personalization_storage': 'granted',
  'security_storage': 'granted'
});
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
`.trim()
