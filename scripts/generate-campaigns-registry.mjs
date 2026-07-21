#!/usr/bin/env node
/**
 * Generate public/data/campaigns-registry.json
 * (FFC-Cloudflare-Automation#746, child of the campaign-registry epic #745).
 *
 * FFC-supported charity sites are static Next exports, so every Zeffy
 * donation/ticketing surface (iframe embed or anchor link) is present in the
 * served HTML. This collector reads the live/served fleet from
 * public/data/fleet-smoke-status.json (#738), fetches each site's root HTML on
 * both its apex domain and its default *.github.io URL, extracts every
 * `zeffy.com` URL, and builds a registry that maps:
 *   - campaign  -> the sites using it (deduped, first-seen / last-seen)
 *   - site      -> the campaigns it surfaces
 *
 * Classification (#744 ground truth — the 10 FFC-owned campaigns exported by
 * workflow 401 on 2026-07-19): a detected surface whose canonical URL matches
 * an FFC campaign is `ffc-owned` (interim — must eventually be replaced by a
 * charity-specific campaign per site); anything else is `charity-specific`.
 * `unknown` is reserved for the defensive case where the FFC list could not be
 * established at all. This matches the epic's acceptance criterion that
 * freedomrisingusa's parade form (not an FFC campaign) reads `charity-specific`.
 * Once #744 commits docs/data/ffc-zeffy-campaigns.json to the hub, this script
 * fetches that raw list first (best-effort) and only falls back to the embedded
 * ground truth below, so the classification stays authoritative with no code
 * change here.
 *
 * All data read here is public (served HTML + a public raw JSON). No token is
 * required; if the network is unavailable or no site could be fetched, the
 * previous committed registry is left untouched and the process exits 0 so the
 * daily data pipeline degrades gracefully.
 */
import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(SCRIPT_DIR, '..', 'public', 'data')
const FLEET_SMOKE = join(DATA_DIR, 'fleet-smoke-status.json')
const OUT = join(DATA_DIR, 'campaigns-registry.json')

const ORG = 'FreeForCharity'
const USER_AGENT = 'ffc-campaigns-registry'
const FETCH_TIMEOUT_MS = 15_000

// Best-effort authoritative FFC campaign list once FFC-Cloudflare-Automation#744
// commits it; until then the embedded ground truth below is used.
const FFC_CAMPAIGNS_RAW_URL =
  'https://raw.githubusercontent.com/FreeForCharity/FFC-Cloudflare-Automation/main/docs/data/ffc-zeffy-campaigns.json'

// Ground truth from workflow 401's 2026-07-19 Zeffy export (10 campaigns),
// embedded verbatim in FFC-Cloudflare-Automation#744. Used as the fallback when
// the committed hub list is not yet available.
export const FFC_CAMPAIGNS_FALLBACK = [
  'https://www.zeffy.com/ticketing/website-design-and-development',
  'https://www.zeffy.com/donation-form/c22b9a5a-bd4c-4ec7-b619-b72d55710a71',
  'https://www.zeffy.com/ticketing/website-hosting-and-support-membership',
  'https://www.zeffy.com/ticketing/free-charity-website-hosting-and-maintenance',
  'https://www.zeffy.com/ticketing/free-for-charity-annual-gala',
  'https://www.zeffy.com/ticketing/free-for-charitys-shop',
  'https://www.zeffy.com/ticketing/free-for-charity-global-administrators-membership',
  'https://www.zeffy.com/donation-form/free-for-charity-endowment-fund',
  'https://www.zeffy.com/donation-form/345319a9-b5ed-4ee9-af45-89dc01acc111',
  'https://www.zeffy.com/donation-form/da2dd4cf-1027-4444-b602-c8656398436e',
]

// Serving states from fleet-smoke-status.json that mean "something is actually
// served" (so it can carry a Zeffy surface). 'not-cutover' sites are live on
// their default *.github.io URL, so they are included too. 'not-deployed'
// (Pages off) and 'unknown' (serving identity undeterminable) are skipped.
const LIVE_STATES = new Set(['passing', 'failing', 'running', 'stale-monitor', 'not-cutover'])

/**
 * Canonicalize a Zeffy URL so an embed and its plain-link twin dedupe and match
 * the FFC list: force host `zeffy.com` (drop `www.`), drop a leading locale
 * segment (e.g. `/en-US/`) and any `/embed/` prefix, drop the query/hash, and
 * strip the trailing slash. Returns null for a non-Zeffy or unparseable URL.
 */
export function normalizeZeffyUrl(raw) {
  let u
  try {
    // Decode the &amp; HTML entity first so an href written `…slug&amp;margin=2`
    // does not leak query text into the path when the URL carries no `?`.
    u = new URL(String(raw).trim().replace(/&amp;/gi, '&'))
  } catch {
    return null
  }
  const host = u.hostname.toLowerCase().replace(/^www\./, '')
  if (host !== 'zeffy.com') return null
  const segments = u.pathname.split('/').filter(Boolean)
  // Drop a leading locale segment like `en-US` / `fr` if present.
  if (segments[0] && /^[a-z]{2}(-[a-z]{2})?$/i.test(segments[0])) segments.shift()
  // Drop a leading `embed` segment — an embed URL is the same campaign as its link.
  if (segments[0] === 'embed') segments.shift()
  // A Zeffy campaign slug never contains `&`/`?`/`#`; treat anything from the
  // first of those as stray query text (e.g. an entity-encoded embed URL with
  // no `?`) so `…/slug` and `…/slug&margin=2` collapse to one campaign.
  const path = segments.join('/').split(/[&?#]/)[0].replace(/\/+$/, '')
  if (!path) return null
  return `https://zeffy.com/${path}`
}

/** The campaign type, derived from the canonical path's first segment. */
export function campaignKind(canonicalUrl) {
  const seg = String(canonicalUrl)
    .replace(/^https:\/\/zeffy\.com\//, '')
    .split('/')[0]
  if (seg === 'ticketing') return 'ticketing'
  if (seg === 'donation-form') return 'donation-form'
  if (seg === 'peer-to-peer') return 'peer-to-peer'
  return 'other'
}

/** How a surface appears on the page: an iframe/embed URL vs a plain link. */
export function surfaceOf(rawUrl) {
  return /\/embed\//.test(String(rawUrl)) ? 'embed' : 'link'
}

/**
 * Classify a canonical campaign URL against the FFC campaign set.
 *   ffc-owned        — matches an FFC-owned (interim) campaign.
 *   charity-specific — a real campaign that is not one of FFC's own.
 *   unknown          — only when the FFC set could not be established at all.
 */
export function classifyCampaign(canonicalUrl, ffcCanonicalSet) {
  if (!ffcCanonicalSet || ffcCanonicalSet.size === 0) return 'unknown'
  return ffcCanonicalSet.has(canonicalUrl) ? 'ffc-owned' : 'charity-specific'
}

/** Extract every distinct raw `zeffy.com` URL string from a blob of HTML. */
export function extractZeffyUrls(html) {
  if (!html) return []
  const found = new Set()
  const re = /https?:\/\/(?:www\.)?zeffy\.com\/[^\s"'<>)\\]+/gi
  let m
  while ((m = re.exec(html)) !== null) {
    // Trim a trailing punctuation/quote the greedy class may have caught.
    found.add(m[0].replace(/[.,;]+$/, ''))
  }
  return [...found]
}

/**
 * Merge freshly-detected campaigns with the previous registry so first-seen
 * dates persist and campaigns detected on an earlier run are not lost on a run
 * where a site was briefly unreachable.
 *
 * `detected` is a Map<canonicalUrl, {kind, surfaces:Set, sites:Set}> from this
 * run. `previous` is the parsed previous registry (or null). `ffcSet` classifies
 * every campaign fresh so a newly-authoritative FFC list re-labels old entries.
 * Site and surface attribution is cumulative (union of previous + this run) so a
 * transient per-site fetch failure never drops a site from a still-live campaign.
 * Returns { campaigns, sites } ready to serialize.
 */
export function mergeRegistries(detected, previous, ffcSet, nowIso) {
  const prevByUrl = new Map()
  for (const c of previous?.campaigns || []) prevByUrl.set(c.url, c)

  const urls = new Set([...detected.keys(), ...prevByUrl.keys()])
  const campaigns = []
  for (const url of urls) {
    const cur = detected.get(url)
    const prev = prevByUrl.get(url)
    const firstSeen = prev?.firstSeen || nowIso
    if (cur) {
      // Union this run's attribution with the previous entry's so a campaign
      // that stays live on one site does not lose another site whose fetch was
      // transiently down this run (the reverse `sites` map would otherwise flap).
      // lastSeen still reflects this run since the campaign was detected now.
      const sites = new Set([...(prev?.sites || []), ...cur.sites])
      const surfaces = new Set([...(prev?.surfaces || []), ...cur.surfaces])
      campaigns.push({
        url,
        kind: cur.kind,
        surfaces: [...surfaces].sort(),
        class: classifyCampaign(url, ffcSet),
        sites: [...sites].sort(),
        firstSeen,
        lastSeen: nowIso,
      })
    } else {
      // Not detected this run — carry the previous entry forward unchanged,
      // except re-classify so a newer FFC list applies retroactively.
      campaigns.push({
        ...prev,
        class: classifyCampaign(url, ffcSet),
        firstSeen,
      })
    }
  }
  campaigns.sort((a, b) => a.url.localeCompare(b.url))

  // site -> sorted unique campaign URLs
  const sitesMap = {}
  for (const c of campaigns) {
    for (const site of c.sites || []) {
      ;(sitesMap[site] ||= []).push(c.url)
    }
  }
  const sites = {}
  for (const site of Object.keys(sitesMap).sort()) {
    sites[site] = [...new Set(sitesMap[site])].sort()
  }
  return { campaigns, sites }
}

/**
 * A content key for a registry object with the volatile `generatedAt` removed,
 * so a run that changed nothing but the timestamp is detected as unchanged
 * regardless of JSON formatting/whitespace. Returns null for a nullish input.
 */
export function stableKey(registry) {
  if (!registry) return null
  const clone = { ...registry }
  delete clone.generatedAt
  return JSON.stringify(clone)
}

async function fetchText(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' },
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/** Load the FFC campaign set (canonical URLs). Committed hub list first, else fallback. */
export async function loadFfcCampaignSet(fetchImpl = fetchText) {
  let list = null
  try {
    const raw = await fetchImpl(FFC_CAMPAIGNS_RAW_URL)
    if (raw) {
      const parsed = JSON.parse(raw)
      const arr = Array.isArray(parsed) ? parsed : parsed?.campaigns
      if (Array.isArray(arr) && arr.length) {
        list = arr.map((c) => (typeof c === 'string' ? c : c?.url)).filter(Boolean)
      }
    }
  } catch {
    // fall through to the embedded ground truth
  }
  if (!list) list = FFC_CAMPAIGNS_FALLBACK
  const set = new Set()
  for (const u of list) {
    const n = normalizeZeffyUrl(u)
    if (n) set.add(n)
  }
  return set
}

/** Candidate served URLs for a fleet site: apex (if cut over) + default Pages URL. */
export function siteUrls(site) {
  const urls = []
  if (site.domain) urls.push(`https://${site.domain}/`)
  urls.push(`https://${ORG.toLowerCase()}.github.io/${site.repo}/`)
  return [...new Set(urls)]
}

async function main() {
  let fleet
  try {
    fleet = JSON.parse(readFileSync(FLEET_SMOKE, 'utf8'))
  } catch (err) {
    console.warn(`Cannot read ${FLEET_SMOKE}: ${err.message}; leaving registry unchanged.`)
    return
  }

  const liveSites = (fleet.sites || []).filter((s) => LIVE_STATES.has(s.state))
  console.log(`Sweeping ${liveSites.length} live fleet sites for Zeffy campaigns…`)

  const ffcSet = await loadFfcCampaignSet()

  // canonicalUrl -> { kind, surfaces:Set, sites:Set }
  const detected = new Map()
  let anyFetched = false

  const BATCH = 8
  for (let i = 0; i < liveSites.length; i += BATCH) {
    const chunk = liveSites.slice(i, i + BATCH)
    await Promise.all(
      chunk.map(async (site) => {
        const siteKey = site.domain || site.repo
        let siteFetched = false
        for (const url of siteUrls(site)) {
          const html = await fetchText(url)
          if (html === null) continue
          siteFetched = true
          anyFetched = true
          for (const raw of extractZeffyUrls(html)) {
            const canonical = normalizeZeffyUrl(raw)
            if (!canonical) continue
            const entry = detected.get(canonical) || {
              kind: campaignKind(canonical),
              surfaces: new Set(),
              sites: new Set(),
            }
            entry.surfaces.add(surfaceOf(raw))
            entry.sites.add(siteKey)
            detected.set(canonical, entry)
          }
        }
        if (!siteFetched) console.warn(`  ${siteKey}: no served URL reachable`)
      })
    )
  }

  if (!anyFetched) {
    console.warn('No fleet site was reachable; leaving registry unchanged.')
    return
  }

  let previous = null
  try {
    previous = JSON.parse(readFileSync(OUT, 'utf8'))
  } catch {
    // first run
  }

  const nowIso = new Date().toISOString()
  const { campaigns, sites } = mergeRegistries(detected, previous, ffcSet, nowIso)

  const out = {
    generatedAt: nowIso,
    org: ORG,
    campaignCount: campaigns.length,
    summary: {
      'ffc-owned': campaigns.filter((c) => c.class === 'ffc-owned').length,
      'charity-specific': campaigns.filter((c) => c.class === 'charity-specific').length,
      unknown: campaigns.filter((c) => c.class === 'unknown').length,
    },
    campaigns,
    sites,
  }

  // Suppress a generatedAt-only churn so an unchanged registry doesn't open a PR
  // every day. Compare the parsed objects with the timestamp removed, so the
  // check is independent of JSON formatting/whitespace.
  if (previous && stableKey(previous) === stableKey(out)) {
    console.log('No campaign changes.')
    return
  }
  const next = JSON.stringify(out, null, 2) + '\n'
  writeFileSync(OUT, next)
  console.log(
    `Wrote ${OUT}: ${campaigns.length} campaigns ` +
      `(${out.summary['ffc-owned']} ffc-owned, ${out.summary['charity-specific']} charity-specific) ` +
      `across ${Object.keys(sites).length} sites`
  )
}

// Only run the sweep when invoked directly (not when imported by unit tests).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    // Degrade gracefully: keep the previous committed file rather than failing
    // the whole data-refresh pipeline on a transient error.
    console.warn(`campaigns-registry generation failed: ${err.message}`)
  })
}
