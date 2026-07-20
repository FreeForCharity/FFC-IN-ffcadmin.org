/**
 * Unit tests for the fleet audit script (scripts/fleet-audit.mjs).
 *
 * The audit's parsing and verdict logic is pure — CSV in, fleet out; HTML
 * body in, footer checks out; probe results in, level verdicts, gap classes,
 * summary, and report out — so these tests lock in the fleet-selection
 * filter, every footer-standard check, the two-level (pre-501c3 / full
 * 501c3) verdict model, the gap classification (with a fixture body per
 * class, including a pre-501c3 site bearing a false 501(c)(3) status
 * claim), error classification, the roadmap stage join, and the report
 * rendering, all with mocked data (no network).
 */

let parseCsv,
  selectFleet,
  selectKnownDown,
  analyzeFooter,
  detectStatusClaim,
  hasAttribution,
  missingLevelChecks,
  checkLabel,
  passesLevel1,
  passesLevel2,
  classifyGap,
  evaluateSite,
  buildStageIndex,
  matchCharity,
  classifyError
let buildNotes, buildSummary, buildMarkdownReport, levelCell

beforeAll(async () => {
  const mod = await import('../scripts/fleet-audit.mjs')
  parseCsv = mod.parseCsv
  selectFleet = mod.selectFleet
  selectKnownDown = mod.selectKnownDown
  analyzeFooter = mod.analyzeFooter
  detectStatusClaim = mod.detectStatusClaim
  hasAttribution = mod.hasAttribution
  missingLevelChecks = mod.missingLevelChecks
  checkLabel = mod.checkLabel
  passesLevel1 = mod.passesLevel1
  passesLevel2 = mod.passesLevel2
  classifyGap = mod.classifyGap
  evaluateSite = mod.evaluateSite
  buildStageIndex = mod.buildStageIndex
  matchCharity = mod.matchCharity
  classifyError = mod.classifyError
  buildNotes = mod.buildNotes
  buildSummary = mod.buildSummary
  buildMarkdownReport = mod.buildMarkdownReport
  levelCell = mod.levelCell
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
// Footer fixtures — one HTML body per gap class
// ---------------------------------------------------------------------------

const YEAR = new Date().getFullYear()

// Level 1 (pre-501c3): all six positive checks, NO 501(c)(3) status claim.
const L1_HTML = `
  <footer>
    <p>Supported by <a href="https://freeforcharity.org">Free For Charity</a></p>
    <a href="https://freeforcharity.org/hub">FFC Hub</a>
    <p>EIN: 46-2471893</p>
    <p>&copy; ${YEAR} All Rights Are Reserved by Example Charity</p>
  </footer>`

// Level 2 (full 501c3): Level 1 + Candid/GuideStar link + status line
// (the deployed templates render "a US 501c3 Non Profit").
const L2_HTML = `
  <footer>
    <p>Supported by <a href="https://freeforcharity.org">Free For Charity</a></p>
    <a href="https://freeforcharity.org/hub">FFC Hub</a>
    <a href="https://www.guidestar.org/profile/46-2471893">Candid profile</a>
    <p>EIN: 46-2471893</p>
    <p>&copy; ${YEAR} All Rights Are Reserved by Example Charity, a US 501c3 Non Profit</p>
  </footer>`

// attribution-only: FFC marker + EIN + FFC link present, missing ONLY the
// attribution wording and the hub link → one-line footer edit.
const ATTRIBUTION_ONLY_HTML = `
  <footer>
    <a href="https://freeforcharity.org">Free For Charity</a>
    <p>EIN: 46-2471893</p>
    <p>&copy; ${YEAR} Example Charity</p>
  </footer>`

// partial: some FFC elements (attribution + FFC link) but missing several
// of the six checks.
const PARTIAL_HTML = `
  <footer>
    <p>Supported by <a href="https://freeforcharity.org">Free For Charity</a></p>
  </footer>`

// structural: no FFC footer element at all (a bare copyright line does not
// make a site FFC-footered).
const STRUCTURAL_HTML = `<h1>Charity</h1><p>&copy; ${YEAR} Example Charity</p>`

// pre-501c3 violation: a Level-1 footer that ALSO asserts 501(c)(3) status.
const PRE501C3_WITH_CLAIM_HTML = L1_HTML.replace(
  'All Rights Are Reserved by Example Charity',
  'All Rights Are Reserved by Example Charity, a US 501c3 Non Profit'
)

// ---------------------------------------------------------------------------
// Footer-standard analysis
// ---------------------------------------------------------------------------

describe('analyzeFooter', () => {
  it('passes every check on a Level-2 footer', () => {
    const f = analyzeFooter(L2_HTML)
    expect(f).toEqual({
      footerMarker: true,
      ffcLink: true,
      hubLink: true,
      ein: true,
      supportedBy: true,
      projectOf: false,
      copyrightCurrentYear: true,
      guidestarLink: true,
      statusClaim501c3: true,
    })
  })

  it('reports the Level-1 footer with no claim and no Candid/GuideStar link', () => {
    const f = analyzeFooter(L1_HTML)
    expect(f.statusClaim501c3).toBe(false)
    expect(f.guidestarLink).toBe(false)
    expect(missingLevelChecks(f)).toEqual([])
  })

  it('accepts the deployed legacy attribution ("A project of" + FFC link)', () => {
    const legacy = L1_HTML.replace('Supported by', 'A project of')
    const f = analyzeFooter(legacy)
    expect(f.supportedBy).toBe(false)
    expect(f.projectOf).toBe(true)
    expect(hasAttribution(f)).toBe(true)
    expect(passesLevel1(f)).toBe(true)
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

  it('requires the copyright year to be CURRENT, in either order', () => {
    expect(analyzeFooter(`&copy; ${YEAR} Example Charity`).copyrightCurrentYear).toBe(true)
    expect(analyzeFooter(`© ${YEAR} Example`).copyrightCurrentYear).toBe(true)
    expect(analyzeFooter(`${YEAR} © Example`).copyrightCurrentYear).toBe(true)
    expect(analyzeFooter(`Copyright ${YEAR}`).copyrightCurrentYear).toBe(true)
    // A hard-coded stale year fails.
    expect(analyzeFooter(`&copy; ${YEAR - 2} Example Charity`).copyrightCurrentYear).toBe(false)
    // An injectable year keeps the check testable across New Year's Eve runs.
    expect(analyzeFooter('© 2019 Example', 2019).copyrightCurrentYear).toBe(true)
  })

  it('detects Candid/GuideStar profile links (guidestar.org or candid.org hrefs)', () => {
    expect(analyzeFooter('<a href="https://www.guidestar.org/profile/x">p</a>').guidestarLink).toBe(
      true
    )
    expect(analyzeFooter('<a href="https://app.candid.org/profile/x">p</a>').guidestarLink).toBe(
      true
    )
    expect(analyzeFooter('read about guidestar.org in prose').guidestarLink).toBe(false)
  })

  it('fails closed on an empty or footer-less body', () => {
    expect(passesLevel1(analyzeFooter('<html><body><h1>Charity</h1></body></html>'))).toBe(false)
    expect(passesLevel1(analyzeFooter(''))).toBe(false)
    expect(passesLevel1(null)).toBe(false)
    expect(passesLevel2(null)).toBe(false)
  })
})

describe('detectStatusClaim', () => {
  it('matches the template status line in its deployed renderings', () => {
    expect(detectStatusClaim('a US 501c3 Non Profit')).toBe(true)
    expect(detectStatusClaim('a US 501(c)(3) Non Profit')).toBe(true)
    expect(detectStatusClaim('a US 501 (c)(3) nonprofit organization')).toBe(true)
    expect(detectStatusClaim('a 501(c)3 non-profit')).toBe(true)
  })

  it('requires nonprofit wording near the 501(c)(3) token', () => {
    expect(detectStatusClaim('call 501-555-0123 for details')).toBe(false)
    expect(detectStatusClaim('section 501(c)(3) of the tax code, unrelated prose far away')).toBe(
      false
    )
  })

  it("does NOT count FFC's own status line in the attribution as the charity's claim", () => {
    expect(
      detectStatusClaim(
        'Supported by <a href="https://freeforcharity.org">Free For Charity</a>, a US 501(c)(3) Non Profit'
      )
    ).toBe(false)
    expect(
      detectStatusClaim('All Rights Are Reserved by Free For Charity, a US 501(c)(3) Non Profit')
    ).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Level verdicts and gap classification
// ---------------------------------------------------------------------------

describe('passesLevel1 / passesLevel2', () => {
  it('passes Level 1 on the six positives with no status claim', () => {
    const f = analyzeFooter(L1_HTML)
    expect(passesLevel1(f)).toBe(true)
    expect(passesLevel2(f)).toBe(false) // no Candid link, no status line
  })

  it('passes Level 2 on the six positives plus Candid link plus status line', () => {
    const f = analyzeFooter(L2_HTML)
    expect(passesLevel2(f)).toBe(true)
    expect(passesLevel1(f)).toBe(false) // the claim is a Level-1 violation
  })

  it('fails Level 1 when the footer asserts 501(c)(3) status', () => {
    const f = analyzeFooter(PRE501C3_WITH_CLAIM_HTML)
    expect(missingLevelChecks(f)).toEqual([])
    expect(passesLevel1(f)).toBe(false)
    expect(passesLevel2(f)).toBe(false) // claim without the Candid link
  })

  it('fails Level 2 without the Candid/GuideStar link even with the status line', () => {
    const f = analyzeFooter(PRE501C3_WITH_CLAIM_HTML)
    expect(f.statusClaim501c3).toBe(true)
    expect(f.guidestarLink).toBe(false)
    expect(passesLevel2(f)).toBe(false)
  })
})

describe('classifyGap', () => {
  it('classifies each fixture body into its gap class', () => {
    expect(classifyGap(analyzeFooter(L2_HTML))).toBe('compliant-L2')
    expect(classifyGap(analyzeFooter(L1_HTML))).toBe('compliant-L1')
    expect(classifyGap(analyzeFooter(ATTRIBUTION_ONLY_HTML))).toBe('attribution-only')
    expect(classifyGap(analyzeFooter(PARTIAL_HTML))).toBe('partial')
    expect(classifyGap(analyzeFooter(STRUCTURAL_HTML))).toBe('structural')
    expect(classifyGap(null)).toBe('structural')
  })

  it('lists exactly the missing checks for a partial site', () => {
    const f = analyzeFooter(PARTIAL_HTML)
    expect(missingLevelChecks(f)).toEqual(['hubLink', 'ein', 'copyrightCurrentYear'])
    expect(missingLevelChecks(f).map(checkLabel)).toEqual([
      'hub link',
      'EIN',
      'current-year copyright',
    ])
  })

  it('keeps attribution-only scoped to attribution wording and/or hub link', () => {
    const f = analyzeFooter(ATTRIBUTION_ONLY_HTML)
    expect(missingLevelChecks(f).sort()).toEqual(['attribution', 'hubLink'])
    // The same site missing the EIN as well is partial, not a quick win.
    const noEin = analyzeFooter(ATTRIBUTION_ONLY_HTML.replace('EIN: 46-2471893', ''))
    expect(classifyGap(noEin)).toBe('partial')
  })

  it('classifies six-positives-with-claim-but-no-Candid-link as partial (level mismatch)', () => {
    expect(classifyGap(analyzeFooter(PRE501C3_WITH_CLAIM_HTML))).toBe('partial')
  })

  it('treats a bare copyright line as structural (no FFC element)', () => {
    const f = analyzeFooter(STRUCTURAL_HTML)
    expect(f.copyrightCurrentYear).toBe(true)
    expect(classifyGap(f)).toBe('structural')
  })
})

describe('evaluateSite', () => {
  const probed = (overrides = {}) => ({
    domain: 'example.org',
    ok: true,
    httpStatus: 200,
    stage: 'unknown',
    footer: analyzeFooter(L2_HTML),
    error: null,
    ...overrides,
  })

  it('attaches both level verdicts, the gap class, and missing checks', () => {
    const s = evaluateSite(probed())
    expect(s).toMatchObject({
      level1: false,
      level2: true,
      gapClass: 'compliant-L2',
      missingChecks: [],
      falseClaim: false,
    })
  })

  it('flags a pre-501c3 site bearing a 501(c)(3) status claim as a false claim', () => {
    const s = evaluateSite(
      probed({ stage: 'pre-501c3', footer: analyzeFooter(PRE501C3_WITH_CLAIM_HTML) })
    )
    expect(s.falseClaim).toBe(true)
    expect(s.gapClass).toBe('partial')
  })

  it('does not raise the false-claim flag when the stage is unknown or 501c3', () => {
    const claim = analyzeFooter(PRE501C3_WITH_CLAIM_HTML)
    expect(evaluateSite(probed({ stage: 'unknown', footer: claim })).falseClaim).toBe(false)
    expect(evaluateSite(probed({ stage: '501c3', footer: claim })).falseClaim).toBe(false)
  })

  it('marks down sites as gap class "down" with every check missing', () => {
    const s = evaluateSite(probed({ ok: false, footer: null, error: 'timeout' }))
    expect(s.gapClass).toBe('down')
    expect(s.level1).toBe(false)
    expect(s.level2).toBe(false)
    expect(s.missingChecks).toHaveLength(6)
  })
})

// ---------------------------------------------------------------------------
// Charity stage join (roadmap.json)
// ---------------------------------------------------------------------------

describe('buildStageIndex / matchCharity', () => {
  const index = () =>
    buildStageIndex([
      { charityName: 'acharyaapp.org', charityStage: 'pre-501c3' },
      {
        charityName: 'Free For Charity',
        charityStage: '501c3',
        liveUrl: 'https://freeforcharity.org',
      },
      { charityName: 'Droplets of Love', charityStage: '501c3' },
      { charityName: '', charityStage: '501c3' },
    ])

  it('matches by exact liveUrl host (www-insensitive)', () => {
    expect(matchCharity('www.freeforcharity.org', index())).toEqual({
      stage: '501c3',
      charityName: 'Free For Charity',
    })
  })

  it('matches roadmap entries whose charityName IS the domain', () => {
    expect(matchCharity('acharyaapp.org', index())).toEqual({
      stage: 'pre-501c3',
      charityName: 'acharyaapp.org',
    })
    // Subdomain rows fuzzy-match the same charity.
    expect(matchCharity('az.acharyaapp.org', index())).toEqual({
      stage: 'pre-501c3',
      charityName: 'acharyaapp.org',
    })
  })

  it('fuzzy-matches a charity name against the domain label', () => {
    expect(matchCharity('dropletsoflove.org', index())).toEqual({
      stage: '501c3',
      charityName: 'Droplets of Love',
    })
  })

  it('returns null (stage unknown) when nothing matches', () => {
    expect(matchCharity('zzz.org', index())).toBeNull()
    expect(matchCharity('', index())).toBeNull()
  })

  it('survives unparseable liveUrl values', () => {
    const idx = buildStageIndex([
      { charityName: 'X Org Charity', charityStage: '501c3', liveUrl: 'not a url' },
    ])
    expect(matchCharity('xorgcharity.org', idx)).toEqual({
      stage: '501c3',
      charityName: 'X Org Charity',
    })
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
  stage: '501c3',
  ok: true,
  httpStatus: 200,
  httpsOk: true,
  finalUrl: 'https://example.org/',
  redirectChain: [{ url: 'https://example.org/', status: 200 }],
  footer: analyzeFooter(L2_HTML),
  error: null,
  retried: false,
  ...overrides,
})

describe('buildNotes', () => {
  it('is empty for a healthy Level-2 site at stage 501c3', () => {
    expect(buildNotes(site())).toBe('')
  })

  it('lists exactly the missing footer checks', () => {
    const s = site({ stage: 'unknown', footer: analyzeFooter(PARTIAL_HTML) })
    expect(buildNotes(s)).toBe('missing: hub link, EIN, current-year copyright')
  })

  it('reports missing attribution only when NEITHER wording is present', () => {
    const s = site({ stage: 'unknown', footer: analyzeFooter(ATTRIBUTION_ONLY_HTML) })
    expect(buildNotes(s)).toBe('missing: hub link, attribution ("Supported by" / "A project of")')
  })

  it('flags the false status claim prominently on pre-501c3 sites', () => {
    const s = site({ stage: 'pre-501c3', footer: analyzeFooter(PRE501C3_WITH_CLAIM_HTML) })
    expect(buildNotes(s)).toContain(
      '⚠️ false status claim: pre-501c3 site asserts 501(c)(3) status'
    )
  })

  it('explains the status-line-without-Candid-link level mismatch', () => {
    const s = site({ stage: 'unknown', footer: analyzeFooter(PRE501C3_WITH_CLAIM_HTML) })
    expect(buildNotes(s)).toBe(
      'has the 501(c)(3) status line but no Candid/GuideStar link ' +
        '(add the link for L2, or strip the status line for L1)'
    )
  })

  it('tells a confirmed 501c3 charity resting at Level 1 what Level 2 adds', () => {
    const s = site({ stage: '501c3', footer: analyzeFooter(L1_HTML) })
    expect(buildNotes(s)).toBe(
      'passes L1 only; stage 501c3 expects L2 (add Candid/GuideStar link + status line)'
    )
  })

  it('flags legacy attribution wording (target-standard progress)', () => {
    const legacy = site({
      stage: 'pre-501c3',
      footer: analyzeFooter(L1_HTML.replace('Supported by', 'A project of')),
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

describe('levelCell', () => {
  it('judges a known-stage site against its own level only', () => {
    expect(levelCell(site())).toBe('L2 pass')
    expect(levelCell(site({ stage: '501c3', footer: analyzeFooter(L1_HTML) }))).toBe('L2 FAIL')
    expect(levelCell(site({ stage: 'pre-501c3', footer: analyzeFooter(L1_HTML) }))).toBe('L1 pass')
    expect(
      levelCell(site({ stage: 'pre-501c3', footer: analyzeFooter(PRE501C3_WITH_CLAIM_HTML) }))
    ).toBe('L1 FAIL')
  })

  it('reports BOTH level verdicts when the stage is unknown', () => {
    expect(levelCell(site({ stage: 'unknown', footer: analyzeFooter(L1_HTML) }))).toBe(
      'L1 pass / L2 fail'
    )
    expect(levelCell(site({ stage: 'unknown' }))).toBe('L1 fail / L2 pass')
  })

  it('renders an em dash for down sites', () => {
    expect(levelCell(site({ ok: false, footer: null }))).toBe('—')
  })
})

describe('buildSummary / buildMarkdownReport', () => {
  const makeSites = () => [
    site(), // compliant-L2, stage 501c3
    site({ domain: 'level1.org', stage: 'pre-501c3', footer: analyzeFooter(L1_HTML) }),
    site({
      domain: 'quickwin.org',
      stage: 'unknown',
      footer: analyzeFooter(ATTRIBUTION_ONLY_HTML),
    }),
    site({ domain: 'partial.org', stage: 'unknown', footer: analyzeFooter(PARTIAL_HTML) }),
    site({ domain: 'bare.org', stage: 'unknown', footer: analyzeFooter(STRUCTURAL_HTML) }),
    site({
      domain: 'falseclaim.org',
      stage: 'pre-501c3',
      footer: analyzeFooter(PRE501C3_WITH_CLAIM_HTML),
    }),
    site({
      domain: 'down.org',
      stage: 'unknown',
      ok: false,
      httpStatus: null,
      httpsOk: null,
      finalUrl: null,
      redirectChain: null,
      footer: null,
      error: 'timeout',
    }),
  ]

  it('counts totals, levels, gap classes, stages, and false claims', () => {
    const summary = buildSummary(makeSites())
    expect(summary).toMatchObject({ total: 7, reachable: 6, down: 1 })
    expect(summary.levels).toEqual({ level1: 1, level2: 1 })
    expect(summary.gapClasses).toEqual({
      'compliant-L2': 1,
      'compliant-L1': 1,
      'attribution-only': 1,
      partial: 2, // partial.org + the false-claim level mismatch
      structural: 1,
    })
    expect(summary.stages).toEqual({ '501c3': 1, 'pre-501c3': 2, unknown: 4 })
    expect(summary.falseClaims).toBe(1)
  })

  it('counts the new per-check passes (copyright, Candid link, status line)', () => {
    const summary = buildSummary([site(), site({ footer: analyzeFooter(L1_HTML) })])
    expect(summary.checks.copyrightCurrentYear).toBe(2)
    expect(summary.checks.guidestarLink).toBe(1)
    expect(summary.checks.statusClaim501c3).toBe(1)
    expect(summary.checks.attribution).toBe(2)
    expect(summary.checks.supportedBy).toBe(2)
  })

  it('renders the summary, false-claim, quick-win, structural, down, and per-site sections', () => {
    const md = buildMarkdownReport(makeSites(), '2026-07-12')
    expect(md).toContain('# FFC Fleet Audit Report')
    expect(md).toContain('generated on 2026-07-12')
    expect(md).toContain('**Sites audited:** 7')
    expect(md).toContain('**Level 2 (full 501c3) passes:** 1 / 6 reachable')
    expect(md).toContain('**Level 1 (pre-501c3) passes:** 1 / 6 reachable')
    expect(md).toContain(
      'compliant-L2 1, compliant-L1 1, attribution-only 1 (one-line quick wins), partial 2, structural 1'
    )
    expect(md).toContain('## ⚠️ False 501(c)(3) status claims (legal exposure — fix first)')
    expect(md).toContain('| falseclaim.org | pre-501c3 | footer asserts 501(c)(3) status |')
    expect(md).toContain('## Attribution-only quick wins (close now)')
    expect(md).toContain(
      '| quickwin.org | unknown | hub link, attribution ("Supported by" / "A project of") |'
    )
    expect(md).toContain('## Structural gaps (full adoption-checklist retrofit)')
    expect(md).toContain('| bare.org | unknown |')
    expect(md).toContain('## Down or broken sites (action needed)')
    expect(md).toContain('| down.org | unreachable: timeout |')
    expect(md).toContain('## Section A — FFC footer standard by level')
    expect(md).toContain('| Charity | Status | HTTPS | Stage | Level verdict | Gap class | Notes |')
    // Known-stage rows are judged against their own level…
    expect(md).toContain('| example.org | 200 | yes | 501c3 | L2 pass | compliant-L2 |  |')
    // …and unknown-stage rows report BOTH verdicts.
    expect(md).toContain(
      '| quickwin.org | 200 | yes | unknown | L1 fail / L2 fail | attribution-only |'
    )
    expect(md).toContain('## Section B — Site health')
    // Down row uses em-dash placeholders instead of misleading cells.
    expect(md).toContain('| down.org | DOWN | — | — | — | — |')
  })

  it('lists CSV rows already marked Unreachable/Error in the down table without probing', () => {
    const knownDown = [
      { domain: 'gone.org', siteHealth: 'Unreachable' },
      { domain: 'broken.org', siteHealth: 'Error' },
    ]
    const md = buildMarkdownReport([site()], '2026-07-12', knownDown)
    expect(md).toContain('## Down or broken sites (action needed)')
    expect(md).toContain('| gone.org | marked "Unreachable" in sites_list.csv (not probed) |')
    expect(md).toContain('| broken.org | marked "Error" in sites_list.csv (not probed) |')
    expect(md).toContain('**Already marked Unreachable/Error in the CSV (not probed):** 2')
  })

  it('omits the false-claim, quick-win, structural, and down sections when empty', () => {
    const md = buildMarkdownReport([site()], '2026-07-12')
    expect(md).not.toContain('## Down or broken sites')
    expect(md).not.toContain('False 501(c)(3) status claims (legal exposure')
    expect(md).not.toContain('## Attribution-only quick wins')
    expect(md).not.toContain('## Structural gaps')
  })
})
