/**
 * Unit tests for the fleet audit script (scripts/fleet-audit.mjs).
 *
 * The audit's parsing and verdict logic is pure — CSV in, fleet out; HTML
 * body in, footer checks out; probe results in, summary/report out — so
 * these tests lock in the fleet-selection filter, every footer-standard
 * check, error classification, and the report rendering, all with mocked
 * data (no network).
 */

let parseCsv,
  selectFleet,
  selectKnownDown,
  analyzeFooter,
  hasAttribution,
  isCompliant,
  classifyError
let buildNotes, buildSummary, buildMarkdownReport

beforeAll(async () => {
  const mod = await import('../scripts/fleet-audit.mjs')
  parseCsv = mod.parseCsv
  selectFleet = mod.selectFleet
  selectKnownDown = mod.selectKnownDown
  analyzeFooter = mod.analyzeFooter
  hasAttribution = mod.hasAttribution
  isCompliant = mod.isCompliant
  classifyError = mod.classifyError
  buildNotes = mod.buildNotes
  buildSummary = mod.buildSummary
  buildMarkdownReport = mod.buildMarkdownReport
})

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

describe('parseCsv', () => {
  it('parses header-keyed records', () => {
    const recs = parseCsv('A,B\n1,2\n3,4\n')
    expect(recs).toEqual([
      { A: '1', B: '2' },
      { A: '3', B: '4' },
    ])
  })

  it('handles quoted fields containing commas and escaped quotes', () => {
    const recs = parseCsv('A,B,C\n"hello, world","say ""hi""",plain\n')
    expect(recs[0]).toEqual({ A: 'hello, world', B: 'say "hi"', C: 'plain' })
  })

  it('handles CRLF line endings and missing trailing newline', () => {
    const recs = parseCsv('A,B\r\n1,2\r\n3,4')
    expect(recs).toHaveLength(2)
    expect(recs[1]).toEqual({ A: '3', B: '4' })
  })

  it('fills missing trailing columns with empty strings', () => {
    const recs = parseCsv('A,B,C\n1,2\n')
    expect(recs[0]).toEqual({ A: '1', B: '2', C: '' })
  })

  it('parses the real committed sites_list.csv without column drift', () => {
    const { readFileSync } = require('fs')
    const { join } = require('path')
    const recs = parseCsv(readFileSync(join(__dirname, '..', 'docs', 'sites_list.csv'), 'utf8'))
    expect(recs.length).toBeGreaterThan(100)
    // Every record must expose the columns the fleet filter depends on.
    for (const key of ['Domain', 'Site Health', 'Left FFC', 'Is Staging', 'Section', 'Status']) {
      expect(Object.keys(recs[0])).toContain(key)
    }
  })
})

// ---------------------------------------------------------------------------
// Fleet selection
// ---------------------------------------------------------------------------

describe('selectFleet', () => {
  const base = {
    Domain: 'example.org',
    Section: 'Cloudflare-Only',
    Status: 'Active',
    'Site Health': 'Live',
    'Left FFC': '',
    'Is Staging': '',
    'Host Category': 'GitHub Pages',
    'Work Tier': '4 - Done / Stable',
  }

  it('includes a live, active charity site', () => {
    const fleet = selectFleet([base])
    expect(fleet).toHaveLength(1)
    expect(fleet[0]).toMatchObject({ domain: 'example.org', hostCategory: 'GitHub Pages' })
  })

  it('includes Redirect rows (the probe follows the redirect and audits the destination)', () => {
    const fleet = selectFleet([{ ...base, 'Site Health': 'Redirect' }])
    expect(fleet).toHaveLength(1)
    expect(fleet[0]).toMatchObject({ domain: 'example.org', siteHealth: 'Redirect' })
  })

  it('excludes health states that are not probed (Unreachable/Error/Unknown)', () => {
    expect(selectFleet([{ ...base, 'Site Health': 'Unreachable' }])).toHaveLength(0)
    expect(selectFleet([{ ...base, 'Site Health': 'Error' }])).toHaveLength(0)
    expect(selectFleet([{ ...base, 'Site Health': 'Unknown' }])).toHaveLength(0)
  })

  it('excludes orgs that left FFC, staging rows, and for-profit sites', () => {
    expect(selectFleet([{ ...base, 'Left FFC': 'Yes' }])).toHaveLength(0)
    expect(selectFleet([{ ...base, 'Is Staging': 'Yes' }])).toHaveLength(0)
    expect(selectFleet([{ ...base, Section: 'For-Profit' }])).toHaveLength(0)
  })

  it('excludes expired, cancelled, fraud, and transferred-away domains', () => {
    for (const status of ['Expired', 'Cancelled', 'Fraud', 'Transferred Away']) {
      expect(selectFleet([{ ...base, Status: status }])).toHaveLength(0)
    }
  })

  it('lowercases and sorts domains', () => {
    const fleet = selectFleet([
      { ...base, Domain: 'ZEBRA.org' },
      { ...base, Domain: 'alpha.org' },
    ])
    expect(fleet.map((f) => f.domain)).toEqual(['alpha.org', 'zebra.org'])
  })
})

describe('selectKnownDown', () => {
  const base = {
    Domain: 'broken.org',
    Section: 'Cloudflare-Only',
    Status: 'Active',
    'Site Health': 'Unreachable',
    'Left FFC': '',
    'Is Staging': '',
  }

  it('collects fleet rows the CSV already marks Unreachable or Error', () => {
    const rows = selectKnownDown([base, { ...base, Domain: 'error.org', 'Site Health': 'Error' }])
    expect(rows.map((r) => r.domain)).toEqual(['broken.org', 'error.org'])
    expect(rows[0].siteHealth).toBe('Unreachable')
  })

  it('applies the same non-health fleet filters and skips probed states', () => {
    expect(selectKnownDown([{ ...base, 'Left FFC': 'Yes' }])).toHaveLength(0)
    expect(selectKnownDown([{ ...base, Section: 'For-Profit' }])).toHaveLength(0)
    expect(selectKnownDown([{ ...base, Status: 'Expired' }])).toHaveLength(0)
    expect(selectKnownDown([{ ...base, 'Site Health': 'Live' }])).toHaveLength(0)
    expect(selectKnownDown([{ ...base, 'Site Health': 'Redirect' }])).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Footer-standard analysis
// ---------------------------------------------------------------------------

const COMPLIANT_HTML = `
  <footer>
    <p>Supported by <a href="https://freeforcharity.org">Free For Charity</a></p>
    <a href="https://freeforcharity.org/hub">FFC Hub</a>
    <p>EIN: 46-2471893</p>
  </footer>`

describe('analyzeFooter', () => {
  it('passes every check on a compliant footer', () => {
    const f = analyzeFooter(COMPLIANT_HTML)
    expect(f).toEqual({
      footerMarker: true,
      ffcLink: true,
      hubLink: true,
      ein: true,
      supportedBy: true,
      projectOf: false,
    })
    expect(isCompliant(f)).toBe(true)
  })

  it('accepts the deployed legacy attribution ("A project of" + FFC link) as compliant', () => {
    // Pre-attribution-standard templates render "A project of …freeforcharity.org";
    // "Supported by" only exists in templates as of tonight, so the audit must
    // pass EITHER wording — while still reporting supportedBy separately as
    // the target-wording progress flag.
    const legacy = `
      <footer>
        <p>A project of <a href="https://freeforcharity.org">Free For Charity</a></p>
        <a href="https://freeforcharity.org/hub">FFC Hub</a>
        <p>EIN: 46-2471893</p>
      </footer>`
    const f = analyzeFooter(legacy)
    expect(f.supportedBy).toBe(false)
    expect(f.projectOf).toBe(true)
    expect(hasAttribution(f)).toBe(true)
    expect(isCompliant(f)).toBe(true)
  })

  it('does NOT accept "A project of" without the freeforcharity.org link', () => {
    const f = analyzeFooter('<footer>A project of Some Other Org</footer>')
    expect(hasAttribution(f)).toBe(false)
  })

  it('matches the marker with and without spaces, case-insensitively', () => {
    expect(analyzeFooter('freeforcharity').footerMarker).toBe(true)
    expect(analyzeFooter('FREE FOR CHARITY').footerMarker).toBe(true)
    expect(analyzeFooter('Free ForCharity').footerMarker).toBe(true)
  })

  it('requires the FFC link to be an actual href, not prose', () => {
    expect(analyzeFooter('visit freeforcharity.org sometime').ffcLink).toBe(false)
    expect(analyzeFooter('<a href="https://www.freeforcharity.org/">x</a>').ffcLink).toBe(true)
  })

  it('matches EIN with and without the hyphen', () => {
    expect(analyzeFooter('EIN: 46-2471893').ein).toBe(true)
    expect(analyzeFooter('EIN 462471893').ein).toBe(true)
    expect(analyzeFooter('EIN: pending').ein).toBe(false)
  })

  it('detects the hub link only when the /hub path is present', () => {
    expect(analyzeFooter('href="https://freeforcharity.org/"').hubLink).toBe(false)
    expect(analyzeFooter('href="https://freeforcharity.org/hub"').hubLink).toBe(true)
  })

  it('fails closed on an empty or footer-less body', () => {
    const f = analyzeFooter('<html><body><h1>Charity</h1></body></html>')
    expect(isCompliant(f)).toBe(false)
    expect(isCompliant(analyzeFooter(''))).toBe(false)
    expect(isCompliant(null)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Error classification
// ---------------------------------------------------------------------------

describe('classifyError', () => {
  it('classifies timeouts', () => {
    const err = new Error('timeout')
    err.name = 'TimeoutError'
    expect(classifyError(err)).toEqual({ reason: 'timeout', tls: false })
  })

  it('classifies TLS certificate failures from the error cause code', () => {
    const err = new TypeError('fetch failed')
    err.cause = Object.assign(new Error('certificate has expired'), {
      code: 'CERT_HAS_EXPIRED',
    })
    const out = classifyError(err)
    expect(out.tls).toBe(true)
    expect(out.reason).toContain('CERT_HAS_EXPIRED')
  })

  it('classifies DNS failures via the cause code', () => {
    const err = new TypeError('fetch failed')
    err.cause = Object.assign(new Error('getaddrinfo ENOTFOUND'), { code: 'ENOTFOUND' })
    expect(classifyError(err)).toEqual({ reason: 'enotfound', tls: false })
  })
})

// ---------------------------------------------------------------------------
// Notes, summary, and report rendering
// ---------------------------------------------------------------------------

const site = (overrides = {}) => ({
  domain: 'example.org',
  section: 'Cloudflare-Only',
  status: 'Active',
  hostCategory: 'GitHub Pages',
  workTier: '4 - Done / Stable',
  ok: true,
  httpStatus: 200,
  httpsOk: true,
  finalUrl: 'https://example.org/',
  redirectChain: [{ url: 'https://example.org/', status: 200 }],
  footer: analyzeFooter(COMPLIANT_HTML),
  error: null,
  retried: false,
  ...overrides,
})

describe('buildNotes', () => {
  it('is empty for a healthy compliant site', () => {
    expect(buildNotes(site())).toBe('')
  })

  it('lists exactly the missing footer checks', () => {
    const s = site({ footer: analyzeFooter('<p>Supported by Free For Charity</p>') })
    expect(buildNotes(s)).toBe('missing: FFC link, hub link, EIN')
  })

  it('reports missing attribution only when NEITHER wording is present', () => {
    const s = site({
      footer: analyzeFooter(
        '<footer><a href="https://freeforcharity.org/hub">Free For Charity hub</a> EIN: 46-2471893</footer>'
      ),
    })
    expect(buildNotes(s)).toBe('missing: attribution ("Supported by" / "A project of")')
  })

  it('flags legacy attribution wording on compliant sites (target-standard progress)', () => {
    const legacy = site({
      footer: analyzeFooter(
        '<footer>A project of <a href="https://freeforcharity.org">Free For Charity</a> ' +
          '<a href="https://freeforcharity.org/hub">hub</a> EIN: 46-2471893</footer>'
      ),
    })
    expect(buildNotes(legacy)).toBe('legacy attribution wording (target: "Supported by")')
  })

  it('reports unreachable sites and redirect destinations', () => {
    expect(buildNotes(site({ ok: false, error: 'enotfound', httpStatus: null }))).toContain(
      'unreachable: enotfound'
    )
    const redirected = site({
      finalUrl: 'https://www.example.org/',
      redirectChain: [
        { url: 'https://example.org/', status: 301 },
        { url: 'https://www.example.org/', status: 200 },
      ],
    })
    expect(buildNotes(redirected)).toContain('redirects to https://www.example.org/')
  })

  it('flags a non-HTTPS final URL', () => {
    const s = site({
      httpsOk: false,
      finalUrl: 'http://example.org/',
      redirectChain: [
        { url: 'https://example.org/', status: 301 },
        { url: 'http://example.org/', status: 200 },
      ],
    })
    expect(buildNotes(s)).toContain('final URL is not HTTPS')
  })
})

describe('buildSummary / buildMarkdownReport', () => {
  const makeSites = () => [
    site(),
    site({ domain: 'missing-footer.org', footer: analyzeFooter('<h1>hi</h1>') }),
    site({
      domain: 'down.org',
      ok: false,
      httpStatus: null,
      httpsOk: null,
      finalUrl: null,
      redirectChain: null,
      footer: null,
      error: 'timeout',
    }),
  ]

  it('counts totals, reachable, down, compliant, and per-check passes', () => {
    const summary = buildSummary(makeSites())
    expect(summary).toMatchObject({ total: 3, reachable: 2, down: 1, compliant: 1 })
    expect(summary.checks.footerMarker).toBe(1)
    expect(summary.checks.ein).toBe(1)
    // Attribution (either wording) and the target wording are counted apart.
    expect(summary.checks.attribution).toBe(1)
    expect(summary.checks.supportedBy).toBe(1)
  })

  it('counts legacy-wording attribution separately from the target wording', () => {
    const legacy = site({
      footer: analyzeFooter(
        '<footer>A project of <a href="https://freeforcharity.org">Free For Charity</a> ' +
          '<a href="https://freeforcharity.org/hub">hub</a> EIN: 46-2471893</footer>'
      ),
    })
    const summary = buildSummary([site(), legacy])
    expect(summary.compliant).toBe(2)
    expect(summary.checks.attribution).toBe(2)
    expect(summary.checks.supportedBy).toBe(1)
  })

  it('renders summary counts, a prominent down-sites section, and both report sections', () => {
    const md = buildMarkdownReport(makeSites(), '2026-07-11')
    expect(md).toContain('# FFC Fleet Audit Report')
    expect(md).toContain('generated on 2026-07-11')
    expect(md).toContain('**Sites audited:** 3')
    expect(md).toContain('**Footer-standard compliant:** 1 / 2')
    expect(md).toContain('## Down or broken sites (action needed)')
    expect(md).toContain('| down.org | unreachable: timeout |')
    expect(md).toContain('## Section A — FFC footer-standard compliance')
    expect(md).toContain(
      '| Charity | Status | HTTPS | Footer marker | Attribution | Supported by (target wording) | EIN | Hub link | Notes |'
    )
    expect(md).toContain('## Section B — Site health')
    // Compliant row: all footer cells yes (attribution + target wording).
    expect(md).toContain('| example.org | 200 | yes | yes | yes | yes | yes | yes |  |')
    // Down row uses em-dash placeholders instead of misleading "no"s.
    expect(md).toContain('| down.org | DOWN | — | — | — | — | — | — |')
  })

  it('lists CSV rows already marked Unreachable/Error in the down table without probing', () => {
    const knownDown = [
      { domain: 'gone.org', siteHealth: 'Unreachable' },
      { domain: 'broken.org', siteHealth: 'Error' },
    ]
    const md = buildMarkdownReport([site()], '2026-07-11', knownDown)
    expect(md).toContain('## Down or broken sites (action needed)')
    expect(md).toContain('| gone.org | marked "Unreachable" in sites_list.csv (not probed) |')
    expect(md).toContain('| broken.org | marked "Error" in sites_list.csv (not probed) |')
    expect(md).toContain('**Already marked Unreachable/Error in the CSV (not probed):** 2')
  })

  it('omits the down-sites section when everything is up', () => {
    const md = buildMarkdownReport([site()], '2026-07-11')
    expect(md).not.toContain('## Down or broken sites')
  })
})
