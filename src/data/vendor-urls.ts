/**
 * Centralized vendor URL registry.
 *
 * Goal: when a vendor restructures their docs / product URL, the fix
 * is a single line in this file instead of a grep across every leaf
 * that referenced them.
 *
 * Each entry carries a `lastVerified` date. The weekly linkinator
 * workflow (.github/workflows/linkinator-legacy-wp-admin.yml) scans
 * the rendered site for 4xx/5xx and flags stale URLs; this `lastVerified`
 * field is the human-tracked counterpart.
 *
 * Adding a vendor: append an entry. Bumping a verification date: edit
 * just the `lastVerified` value when a URL has been re-confirmed.
 *
 * Refs issue #269.
 */

export interface VendorUrl {
  url: string
  /** ISO date (YYYY-MM-DD) when the URL was last manually confirmed. */
  lastVerified: string
  /** What this URL is, in case the slug becomes unclear. */
  description: string
}

export const VENDOR_URLS = {
  candid: {
    url: 'https://candid.org/',
    lastVerified: '2026-05-24',
    description: 'Candid (formerly GuideStar) — canonical US nonprofit registry.',
  },
  techsoup: {
    url: 'https://www.techsoup.org/',
    lastVerified: '2026-05-24',
    description: 'TechSoup — discounted software for validated nonprofits.',
  },
  volunteermatch: {
    url: 'https://www.volunteermatch.org/',
    lastVerified: '2026-05-24',
    description: 'VolunteerMatch — volunteer-recruitment platform.',
  },
  cloudflareSignup: {
    url: 'https://dash.cloudflare.com/sign-up',
    lastVerified: '2026-05-24',
    description: 'Cloudflare account signup — first step in the FFC domain flow.',
  },
  microsoftLearnHome: {
    url: 'https://learn.microsoft.com/',
    lastVerified: '2026-05-24',
    description: 'Microsoft Learn — MS-900 / MS-700 study material.',
  },
  interserverSales: {
    url: 'mailto:sales@interserver.net',
    lastVerified: '2026-05-24',
    description: 'InterServer nonprofit sales contact.',
  },
  onlineImpacts: {
    url: 'https://onlineimpacts.org/',
    lastVerified: '2026-05-24',
    description: 'Online Impacts — charity-services partner that pre-dated FFC.',
  },
  freeforcharity501c3: {
    url: 'https://freeforcharity.org/501c3/',
    lastVerified: '2026-05-24',
    description: '501(c)(3) charity onboarding entry point on the marketing site.',
  },
  freeforcharityPre501c3: {
    url: 'https://freeforcharity.org/pre501c3/',
    lastVerified: '2026-05-24',
    description: 'Pre-501(c)(3) onboarding entry point.',
  },
  freeforcharitySubmit: {
    url: 'https://freeforcharity.org/submit-information/',
    lastVerified: '2026-05-24',
    description: 'Charity application form — the primary CTA target.',
  },
} as const satisfies Record<string, VendorUrl>

export type VendorUrlKey = keyof typeof VENDOR_URLS

/** How stale a vendor URL can get before the periodic check should flag it. */
export const VENDOR_URL_FRESHNESS_DAYS = 90

/**
 * Returns vendor URLs whose lastVerified is older than the freshness
 * window. Used by the linkinator workflow + ad-hoc audit scripts.
 */
export function staleVendorUrls(today: Date = new Date()): VendorUrlKey[] {
  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() - VENDOR_URL_FRESHNESS_DAYS)
  const cutoffStr = cutoff.toISOString().slice(0, 10)
  return (Object.keys(VENDOR_URLS) as VendorUrlKey[]).filter(
    (key) => VENDOR_URLS[key].lastVerified < cutoffStr
  )
}
