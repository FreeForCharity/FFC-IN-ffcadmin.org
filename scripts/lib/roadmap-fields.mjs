/**
 * Shared work-order field extraction/cleaning helpers.
 *
 * The ONE implementation of `liveUrlFrom` (used by both the roadmap generator
 * `scripts/generate-roadmap-data.ts` and the Gate-3 validator
 * `scripts/gate3-validate.mjs` — previously two hand-mirrored copies) plus the
 * candid-URL / EIN cleaners the roadmap generator publishes to
 * `public/data/roadmap.json`. Pure (no fs / network), dependency-free plain
 * ESM so the Gate-3 workflow can run it with bare `node` (no install) and unit
 * tests can import it directly.
 */

/**
 * Extract the live site URL only when explicitly marked (e.g. "Live site: …"),
 * so unrelated links in the body (GuideStar, LinkedIn, etc.) are never mistaken
 * for the charity's site.
 *
 * Volunteers paste URLs in many shapes — `<https://…>` autolinks, `**bold**`,
 * markdown `[text](https://…)` links, or a trailing comma/period from prose —
 * so the capture accepts a markdown link's parenthesized URL and strips
 * trailing `>` `*` `)` `,` `.` `]` junk that is punctuation, not URL.
 *
 * @param {string | null | undefined} body
 * @returns {string | undefined}
 */
export function liveUrlFrom(body) {
  if (!body) return undefined
  const line = body.match(/^[ \t>*-]*live\s*(?:site|url)\s*[:：]\s*(.+)$/im)
  if (!line) return undefined
  const value = line[1].trim()
  // Markdown link form: "Live site: [text](https://…)" — take the URL inside
  // the parentheses, not the closing paren.
  const md = value.match(/^\[[^\]]*\]\(\s*(https?:\/\/[^)\s]+)\s*\)/)
  if (md) return md[1]
  const plain = value.match(/https?:\/\/\S+/)
  if (!plain) return undefined
  const url = plain[0].replace(/[>*),.\]]+$/, '')
  return url || undefined
}

/**
 * Decode the HTML entities WHMCS/GitHub commonly store in a URL so the parsed
 * value matches `whmcs-applications.mjs`. `&amp;` query separators (and the
 * double-encoded `&amp;amp;`) would otherwise survive into `new URL()` and the
 * link would point at a mangled query string. Angle brackets are intentionally
 * left encoded (anti-injection); a URL never legitimately contains a raw `<`/`>`.
 *
 * @param {string} s
 * @returns {string}
 */
export function decodeUrlEntities(s) {
  let out = s
  for (let i = 0; i < 3 && out.includes('&'); i++) {
    const next = out.replace(/&amp;/gi, '&').replace(/&#0*38;/g, '&')
    if (next === out) break
    out = next
  }
  return out
}

/**
 * A real Candid/GuideStar profile URL never runs anywhere near this long; a
 * value that does is almost certainly other issue-body content glued onto the
 * field by an upstream parsing bug (see #697 block 8 — the site-config
 * attachment once folded into the Candid field and a ~2KB percent-encoded
 * blob reached the published roadmap.json).
 */
const MAX_CANDID_URL_LENGTH = 300

/**
 * Public Candid/GuideStar profile URL only (HTML-unwrapped, placeholders
 * dropped). Defense in depth: only the field's first line is considered, and
 * candidates containing markup (`<`) or exceeding ~300 chars are rejected
 * outright, so an upstream field-parsing regression can never publish a
 * glued-on blob to the public snapshot.
 *
 * @param {string | undefined} raw
 * @returns {string | undefined}
 */
export function cleanCandidUrl(raw) {
  if (!raw) return undefined
  // A well-formed field value is a single line; anything after the first line
  // is not part of the URL.
  const firstLine = String(raw).trim().split('\n', 1)[0].trim()
  const href = /href=["']([^"']+)["']/i.exec(firstLine)
  const candidate = decodeUrlEntities((href ? href[1] : firstLine).trim())
  if (candidate.length > MAX_CANDID_URL_LENGTH || candidate.includes('<')) return undefined
  try {
    const u = new URL(candidate)
    if (
      (u.protocol === 'https:' || u.protocol === 'http:') &&
      /(^|\.)(candid\.org|guidestar\.org)$/i.test(u.hostname)
    ) {
      return u.toString()
    }
  } catch {
    /* not a URL */
  }
  return undefined
}

/**
 * Validate a US EIN (NN-NNNNNNN); public for registered charities.
 *
 * @param {string | undefined} raw
 * @returns {string | undefined}
 */
export function cleanEin(raw) {
  const m = /\b(\d{2})-?(\d{7})\b/.exec(raw ?? '')
  return m ? `${m[1]}-${m[2]}` : undefined
}
