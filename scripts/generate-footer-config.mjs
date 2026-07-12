#!/usr/bin/env node
/**
 * Footer-config bridge (Gate 3 of the gated charity journey): turn ONE
 * validated WHMCS application record — the PII-safe shape produced by
 * scripts/whmcs-applications.mjs (`buildApplicationRecords`) — into the
 * FFC-standard footer config for a charity's FFC-EX site (the footer component
 * lives in FFC-IN-Footer_Only_Template; both site templates render the same
 * block: endorsements/EIN, policy links, contact, social icons, copyright).
 * NOTE: no template consumes this JSON yet — volunteers transcribe it into the
 * charity repo's src/lib/site.config.ts (see docs/footer-bridge.md).
 *
 * Pure transform, no network calls: the WHMCS sync already fetched the data.
 * Missing required fields mean the application is NOT validated for footer
 * generation, so the script fails loudly and lists every gap instead of
 * emitting a half-empty footer.
 *
 * Usage:
 *   node scripts/generate-footer-config.mjs --input application.json
 *   cat application.json | node scripts/generate-footer-config.mjs
 *   node scripts/generate-footer-config.mjs --sample            # demo record
 *   node scripts/generate-footer-config.mjs --input apps.json --id ffc-90
 *   ... --output footer.config.json                             # else stdout
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
 * Optional record fields the footer uses when present. `facebookUrl` and
 * `linkedinUrl` are the charity PAGE URLs from the hardened onboarding forms
 * (fields `facebook-page` / `linkedin-page`, never board-member profiles),
 * surfaced by the WHMCS sync's PII-safe allowlist. Exported for unit testing.
 */
export const OPTIONAL_FIELDS = ['missionExcerpt', 'facebookUrl', 'linkedinUrl', 'submittedAt']

/** The FFC-standard policy stack every charity site footer links to. */
export const POLICY_LINKS = [
  { name: 'Donation Policy', href: '/free-for-charity-donation-policy' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Cookie Policy', href: '/cookie-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'Vulnerability Disclosure Policy', href: '/vulnerability-disclosure-policy' },
  { name: 'Security Acknowledgement', href: '/security-acknowledgements' },
]

/**
 * Documented sample record for testing/demo (--sample). Mirrors the exact
 * shape `buildApplicationRecords` publishes for an approved 501(c)(3)
 * application, plus the two social page URLs the hardened onboarding forms
 * collect. Exported for unit testing.
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
  ein: '12-3456789',
  submittedAt: '2026-07-11T00:00:00.000Z',
  facebookUrl: 'https://www.facebook.com/helpinghandsshelter',
  linkedinUrl: 'https://www.linkedin.com/company/helping-hands-shelter/',
}

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
 * Pure transform: validated application record -> FFC footer config. Throws
 * with the full problem list when the record is not validated. Exported for
 * unit testing.
 */
export function buildFooterConfig(record, { now = new Date() } = {}) {
  const problems = validateApplication(record)
  if (problems.length > 0) {
    throw new Error(
      `Application record is not validated for footer generation:\n` +
        problems.map((p) => `  - ${p}`).join('\n')
    )
  }
  const legalName = String(record.charityName).trim()
  const socialLinks = []
  const facebook = sanitizeSocialUrl(record.facebookUrl, /(^|\.)facebook\.com$/i)
  if (facebook) socialLinks.push({ platform: 'facebook', label: 'Facebook', url: facebook })
  const linkedin = sanitizeSocialUrl(record.linkedinUrl, /(^|\.)linkedin\.com$/i)
  if (linkedin) socialLinks.push({ platform: 'linkedin', label: 'LinkedIn', url: linkedin })

  return {
    // Provenance: which validated application this footer derives from.
    source: {
      applicationId: String(record.id || ''),
      system: 'WHMCS',
      generatedBy: 'scripts/generate-footer-config.mjs',
      generatedAt: now.toISOString(),
    },
    organization: {
      legalName,
      ein: record.ein,
      // Required + validated above — never defaulted (the footer legally
      // asserts 501(c)(3) status).
      charityStage: record.charityStage,
      ...(record.missionExcerpt ? { missionStatement: record.missionExcerpt } : {}),
    },
    // Column 1 of the FFC footer: transparency endorsements.
    endorsements: {
      guidestarProfileUrl: record.candidUrl,
      einLine: `${legalName} EIN: ${record.ein}`,
    },
    // Column 3: contact + social. Contact details are PII the WHMCS sync
    // deliberately never surfaces; the provisioning volunteer fills these
    // from the charity's public website before committing the file.
    contact: { email: null, phone: null, addressLines: [] },
    socialLinks,
    // Column 2: the FFC-standard policy stack (same routes on every site).
    policyLinks: POLICY_LINKS,
    copyright: {
      holder: legalName,
      year: now.getFullYear(),
      line: `© ${now.getFullYear()} All Rights Are Reserved by ${legalName} a US 501c3 Non Profit`,
      projectOf: { name: 'Free For Charity', url: 'https://freeforcharity.org' },
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
  const config = buildFooterConfig(record)
  const json = `${JSON.stringify(config, null, 2)}\n`
  if (args.output) {
    fs.writeFileSync(args.output, json)
    console.error(`footer config written to ${args.output}`)
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
