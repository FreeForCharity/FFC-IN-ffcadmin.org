#!/usr/bin/env node
/**
 * Site-config bridge (Gate 3 of the gated charity journey): turn ONE
 * validated WHMCS application record — the PII-safe shape produced by
 * scripts/whmcs-applications.mjs (`buildApplicationRecords`) — into a
 * `siteConfig` PARTIAL for the charity's FFC-EX site.
 *
 * The emitted `siteConfig` object uses the canonical shared shape both FFC
 * site templates are converging on (template convergence,
 * FreeForCharity/FFC-Cloudflare-Automation#693): the typed `SiteConfig` in
 * FFC-IN-FFC_Single_Page_Template's src/lib/site.config.ts. Every key is
 * directly transcribable into that file — same names, same nesting — so a
 * volunteer copies values across without translating between shapes.
 * Keys the application data cannot supply are omitted and itemized in
 * `manualFields` (see docs/footer-bridge.md).
 *
 * Pure transform, no network calls: the WHMCS sync already fetched the data.
 * Missing required fields mean the application is NOT validated for footer
 * generation, so the script fails loudly and lists every gap instead of
 * emitting a half-empty config.
 *
 * Usage:
 *   node scripts/generate-footer-config.mjs --input application.json
 *   cat application.json | node scripts/generate-footer-config.mjs
 *   node scripts/generate-footer-config.mjs --sample            # demo record
 *   node scripts/generate-footer-config.mjs --input apps.json --id ffc-90
 *   ... --output site.config.partial.json                       # else stdout
 *
 * Input is a single application record, or an array of them (e.g. the
 * WHMCS_DRY_RUN output) plus --id to pick one.
 */
import fs from 'fs'
import { pathToFileURL } from 'url'

/**
 * Fields the footer cannot be generated without. Presence here is the
 * "validated" bar: an approved 501(c)(3) application always carries them.
 * Exported for unit testing.
 */
export const REQUIRED_FIELDS = [
  ['charityName', 'public organization legal name'],
  ['ein', 'EIN (NN-NNNNNNN; public for registered charities)'],
  ['candidUrl', 'Candid/GuideStar profile URL (transparency endorsement)'],
  // The footer's copyright line legally asserts US 501(c)(3) status, so the
  // stage must be present AND '501c3' — never assumed. A record without it is
  // not validated (fail closed; a pre-501(c)(3) must not be mis-asserted).
  ['charityStage', "charity stage (must be '501c3'; the footer asserts 501(c)(3) status)"],
]

/**
 * Optional record fields the config uses when present. The social page URLs
 * (`facebookUrl` / `linkedinUrl` / `instagramUrl` / `xUrl` / `youtubeUrl`) and
 * the public footer contact fields (`contactEmail` / `contactPhone` /
 * `contactCityState`) are the PUBLIC-by-design values the hardened onboarding
 * forms collect for the charity's website footer — never board-member profiles
 * or private "reach you at" contact info — surfaced by the WHMCS sync's PII-safe
 * allowlist. `candidDirectUrl` is Candid's "direct/shared" profile link.
 * Exported for unit testing.
 */
export const OPTIONAL_FIELDS = [
  'missionExcerpt',
  'facebookUrl',
  'linkedinUrl',
  'instagramUrl',
  'xUrl',
  'youtubeUrl',
  'contactEmail',
  'contactPhone',
  'contactCityState',
  'candidDirectUrl',
  'submittedAt',
]

/**
 * Permanent "Supported by" attribution required by the FFC footer standard on
 * every supported charity site (SiteConfig.supportedBy). These values are
 * intentionally FFC's, forever — never derived from the application record and
 * never a rebrand target. Exported for unit testing.
 */
export const SUPPORTED_BY = Object.freeze({
  name: 'Free For Charity',
  url: 'https://freeforcharity.org',
  hubUrl: 'https://freeforcharity.org/hub/',
})

/**
 * SiteConfig keys the WHMCS application can NEVER supply — always present in the
 * output's `manualFields` so the provisioning volunteer knows exactly what to
 * fill by hand. The public footer contact fields and the Candid direct link are
 * NOT here: the hardened onboarding forms now capture their public-by-design
 * values, so they are emitted into the partial when present and only fall back
 * to `manualFields` (see MANUAL_FIELDS_CONDITIONAL) when the record lacks them.
 * Exported for unit testing.
 */
export const MANUAL_FIELDS_BASE = [
  {
    key: 'integrations',
    note: 'per-charity Zeffy / Idealist / SociableKit / Microsoft Forms endpoints — not collected at application time',
  },
  {
    key: 'url',
    note: "the site's canonical production URL — set when the FFC-EX repo/domain is provisioned",
  },
  {
    key: 'tagline',
    note: 'short slogan for the default <title> — not collected by the application; agree it with the charity',
  },
]

/**
 * SiteConfig keys the application CAN supply from the hardened onboarding forms'
 * public footer fields, but only when the applicant filled them in. Each is
 * emitted into the partial when the record carries it, and appended to
 * `manualFields` (with the note below) only when it does not. Exported for unit
 * testing. `has(record)` decides "did the record supply this key?".
 */
export const MANUAL_FIELDS_CONDITIONAL = [
  {
    key: 'contactEmail',
    has: (r) => Boolean(String(r.contactEmail ?? '').trim()),
    note: 'no public contact email on the application — take it from the charity website',
  },
  {
    key: 'phone',
    has: (r) => Boolean(String(r.contactPhone ?? '').trim()),
    note: 'no public phone on the application — fill { display, tel } from the charity website',
  },
  {
    key: 'addresses',
    has: (r) => Boolean(String(r.contactCityState ?? '').trim()),
    note: 'no public city & state on the application — fill [{ label, lines, mapUrl }] from the charity website',
  },
  {
    key: 'guidestar.directProfileUrl',
    has: (r) => Boolean(sanitizeSocialUrl(r.candidDirectUrl, GUIDESTAR_HOST_RE)),
    note: 'no Candid "direct/shared" profile link on the application — add it from the charity\'s Candid profile',
  },
]

/** Candid/GuideStar host allowlist for the direct ("shared") profile link. */
const GUIDESTAR_HOST_RE = /(^|\.)(candid\.org|guidestar\.org)$/i

/** Accept only a real https/http URL on the expected social host, else ''. */
function sanitizeSocialUrl(raw, hostRe) {
  if (!raw) return ''
  let u
  try {
    u = new URL(String(raw).trim())
  } catch {
    return ''
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return ''
  if (!hostRe.test(u.hostname)) return ''
  return u.toString()
}

/**
 * Documented sample record for testing/demo (--sample). Mirrors the exact
 * shape `buildApplicationRecords` publishes for an approved 501(c)(3)
 * application, plus the public social page URLs and public footer contact
 * fields the hardened onboarding forms collect. All values are clearly fake
 * (example.org / obviously-fake handles). Exported for unit testing.
 */
export const SAMPLE_APPLICATION = {
  id: 'ffc-90',
  charityName: 'Helping Hands Shelter',
  charityStage: '501c3',
  charityStatusOption: 'Approved 501(c)(3)',
  serviceTier: 'Tier 1 — Application & verification (501(c)(3))',
  missionCategoryOption: 'Basic needs (food, water, shelter)',
  missionExcerpt: 'We provide shelter, food, and job placement to families in crisis.',
  candidUrl: 'https://www.guidestar.org/profile/12-3456789',
  candidDirectUrl: 'https://www.guidestar.org/profile/shared/12-3456789',
  ein: '12-3456789',
  submittedAt: '2026-07-11T00:00:00.000Z',
  facebookUrl: 'https://www.facebook.com/helpinghandsshelter',
  linkedinUrl: 'https://www.linkedin.com/company/helping-hands-shelter/',
  instagramUrl: 'https://www.instagram.com/helpinghandsshelter',
  xUrl: 'https://x.com/helpinghands',
  youtubeUrl: 'https://www.youtube.com/@helpinghandsshelter',
  contactEmail: 'hello@example.org',
  contactPhone: '+1 520-555-0100',
  contactCityState: 'Tucson, AZ',
}

/**
 * Validate an application record for footer generation. Returns the list of
 * problems (empty = validated). Missing data means the application has not
 * finished validation — the caller must fail loudly, not emit a partial
 * footer. Exported for unit testing.
 */
export function validateApplication(record) {
  const problems = []
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return ['input is not an application record object']
  }
  for (const [field, why] of REQUIRED_FIELDS) {
    const v = String(record[field] ?? '').trim()
    if (!v) problems.push(`missing "${field}" — ${why}`)
  }
  const ein = String(record.ein ?? '').trim()
  if (ein && !/^\d{2}-\d{7}$/.test(ein)) {
    problems.push(`invalid "ein" (${ein}) — expected NN-NNNNNNN`)
  }
  // The footer's copyright line asserts US 501(c)(3) status; a pre-501(c)(3)
  // application has not cleared Gate 3's legal-status validation yet. (A
  // MISSING stage is already a problem via REQUIRED_FIELDS — fail closed.)
  if (record.charityStage && record.charityStage !== '501c3') {
    problems.push(
      `charityStage is "${record.charityStage}" — footer generation requires a validated 501c3 application`
    )
  }
  return problems
}

/**
 * Pure transform: validated application record -> siteConfig partial in the
 * shared SiteConfig shape (template convergence,
 * FreeForCharity/FFC-Cloudflare-Automation#693). Throws with the full problem
 * list when the record is not validated. Exported for unit testing.
 *
 * Output contract:
 *   - `source`       provenance: which validated application this derives from
 *                    (including the validated charityStage the 501(c)(3)
 *                    copyright assertion rests on).
 *   - `manualFields` every SiteConfig key the application could not supply,
 *                    each with a note telling the volunteer where to get it.
 *   - `siteConfig`   the partial itself — keys named and nested exactly as in
 *                    the template's typed SiteConfig, ready to transcribe.
 */
export function buildSiteConfigPartial(record, { now = new Date() } = {}) {
  const problems = validateApplication(record)
  if (problems.length > 0) {
    throw new Error(
      `Application record is not validated for footer generation:\n` +
        problems.map((p) => `  - ${p}`).join('\n')
    )
  }
  const legalName = String(record.charityName).trim()

  // SiteConfig.social — icon in the template footer resolves by `label`, so
  // the labels here must match the template's known set exactly. All hosts are
  // validated; a wrong-host or non-URL value is dropped.
  const social = []
  const facebook = sanitizeSocialUrl(record.facebookUrl, /(^|\.)facebook\.com$/i)
  if (facebook) social.push({ label: 'Facebook', href: facebook })
  const linkedin = sanitizeSocialUrl(record.linkedinUrl, /(^|\.)linkedin\.com$/i)
  if (linkedin) social.push({ label: 'LinkedIn', href: linkedin })
  const instagram = sanitizeSocialUrl(record.instagramUrl, /(^|\.)instagram\.com$/i)
  if (instagram) social.push({ label: 'Instagram', href: instagram })
  const x = sanitizeSocialUrl(record.xUrl, /(^|\.)(x\.com|twitter\.com)$/i)
  if (x) social.push({ label: 'X (Twitter)', href: x })
  const youtube = sanitizeSocialUrl(record.youtubeUrl, /(^|\.)(youtube\.com|youtu\.be)$/i)
  if (youtube) social.push({ label: 'YouTube', href: youtube })

  const mission = String(record.missionExcerpt ?? '').trim()

  // PUBLIC footer contact fields the hardened onboarding forms now capture.
  const contactEmail = String(record.contactEmail ?? '').trim()
  const contactPhone = String(record.contactPhone ?? '').trim()
  const contactCityState = String(record.contactCityState ?? '').trim()
  // SiteConfig.phone is { display, tel }: display is verbatim, tel strips to the
  // href-safe subset (leading + and digits) for the footer's tel: link.
  const phone = contactPhone
    ? { display: contactPhone, tel: contactPhone.replace(/[^\d+]/g, '') }
    : null
  // SiteConfig.addresses is [{ label, lines, mapUrl }]; the application supplies
  // only a public city & state, so emit a single labelled line.
  const addresses = contactCityState ? [{ label: 'Location', lines: [contactCityState] }] : []
  // Candid "direct/shared" profile link — sanitized to a candid.org/guidestar.org
  // URL; '' keeps the guidestar object's template shape when absent.
  const guidestarDirectProfileUrl = sanitizeSocialUrl(record.candidDirectUrl, GUIDESTAR_HOST_RE)

  // manualFields: the conditional public keys the record did NOT supply, then
  // the always-manual base, then description/social when the record lacks them.
  const manualFields = [
    ...MANUAL_FIELDS_CONDITIONAL.filter((f) => !f.has(record)).map(({ key, note }) => ({
      key,
      note,
    })),
    ...MANUAL_FIELDS_BASE,
  ]
  if (!mission) {
    manualFields.push({
      key: 'description',
      note: 'no mission excerpt on the application — write the <meta description> from the charity website',
    })
  }
  if (social.length === 0) {
    manualFields.push({
      key: 'social',
      note: 'no valid social PAGE URL on the application — fill [{ label, href }] from the charity public presence',
    })
  }

  return {
    // Provenance: which validated application this partial derives from.
    source: {
      applicationId: String(record.id || ''),
      system: 'WHMCS',
      generatedBy: 'scripts/generate-footer-config.mjs',
      generatedAt: now.toISOString(),
      // Required + validated above — never defaulted (the footer's copyright
      // line legally asserts 501(c)(3) status).
      charityStage: record.charityStage,
    },
    // SiteConfig keys the application cannot supply — the volunteer's
    // fill-by-hand checklist. Everything else transcribes verbatim.
    manualFields,
    // The partial: key names and nesting match the template's SiteConfig
    // (src/lib/site.config.ts) exactly. Keys listed in manualFields are
    // omitted (the volunteer never transcribes a placeholder as real data),
    // EXCEPT guidestar.directProfileUrl which is always emitted (as '' when
    // absent) so the guidestar object keeps the template's full shape.
    siteConfig: {
      name: legalName,
      ...(mission ? { description: mission } : {}),
      social,
      ...(contactEmail ? { contactEmail } : {}),
      ...(phone ? { phone } : {}),
      ...(addresses.length ? { addresses } : {}),
      ein: record.ein,
      guidestar: {
        profileUrl: record.candidUrl,
        directProfileUrl: guidestarDirectProfileUrl,
      },
      // FFC footer standard: always present, always these values.
      supportedBy: { ...SUPPORTED_BY },
    },
  }
}

/**
 * Resolve one record from parsed input: a single object passes through; an
 * array (e.g. the sync's dry-run output) needs --id unless it has exactly one
 * entry. Exported for unit testing.
 */
export function selectRecord(parsed, id) {
  if (Array.isArray(parsed)) {
    if (id) {
      const hit = parsed.find((r) => r && r.id === id)
      if (!hit) throw new Error(`no application with id "${id}" in input array`)
      return hit
    }
    if (parsed.length === 1) return parsed[0]
    throw new Error(
      `input is an array of ${parsed.length} records — pass --id <application id> to pick one`
    )
  }
  return parsed
}

function parseArgs(argv) {
  const args = { input: '', output: '', id: '', sample: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--sample') args.sample = true
    else if (a === '--input') args.input = argv[++i] || ''
    else if (a === '--output') args.output = argv[++i] || ''
    else if (a === '--id') args.id = argv[++i] || ''
    else throw new Error(`unknown argument "${a}"`)
  }
  return args
}

async function readStdin() {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return data
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  let record
  if (args.sample) {
    record = SAMPLE_APPLICATION
  } else {
    const raw = args.input ? fs.readFileSync(args.input, 'utf8') : await readStdin()
    if (!raw.trim()) {
      throw new Error('no input: pipe an application record JSON, or pass --input/--sample')
    }
    record = selectRecord(JSON.parse(raw), args.id)
  }
  const config = buildSiteConfigPartial(record)
  const json = `${JSON.stringify(config, null, 2)}\n`
  if (args.output) {
    fs.writeFileSync(args.output, json)
    console.error(`site.config partial written to ${args.output}`)
  } else {
    process.stdout.write(json)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err))
    process.exitCode = 1
  })
}
