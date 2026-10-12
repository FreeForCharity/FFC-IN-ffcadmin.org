/**
 * Unit tests for the Gate-3 auto-validation checks (`scripts/gate3-validate.mjs`).
 *
 * Exercises every check function with a mocked `fetch` (no network, no
 * browser — the Playwright runner is injected as a stub) and locks in the
 * verdict-table contract: every machine-checkable Section-4b item reports
 * PASS/FAIL (WARN when the check itself could not run), only the charity's
 * content approval stays MANUAL, and the "Live site:" extraction matches the
 * roadmap generator's marker format.
 */

let liveUrlFrom,
  fetchIssueBody,
  checkHttp,
  checkHost,
  checkFooter,
  checkViewport,
  extractRootRelativeRefs,
  checkAssets,
  runChecks,
  buildVerdictRows,
  buildVerdictTable,
  isRepoSlug,
  deriveRepoFromUrl,
  evaluateCiRuns,
  fetchCiStatus,
  hasElementId,
  findMissingSections,
  resolveTemplate,
  siteBaseUrl,
  checkSections,
  selectCrawlPages,
  isAllowlisted,
  collectConsoleErrors,
  collectAxeViolations,
  evaluateResponsive,
  mdCell,
  parseArgs,
  REQUIREMENTS

beforeAll(async () => {
  const mod = await import('../scripts/gate3-validate.mjs')
  liveUrlFrom = mod.liveUrlFrom
  fetchIssueBody = mod.fetchIssueBody
  checkHttp = mod.checkHttp
  checkHost = mod.checkHost
  checkFooter = mod.checkFooter
  checkViewport = mod.checkViewport
  extractRootRelativeRefs = mod.extractRootRelativeRefs
  checkAssets = mod.checkAssets
  runChecks = mod.runChecks
  buildVerdictRows = mod.buildVerdictRows
  buildVerdictTable = mod.buildVerdictTable
  isRepoSlug = mod.isRepoSlug
  deriveRepoFromUrl = mod.deriveRepoFromUrl
  evaluateCiRuns = mod.evaluateCiRuns
  fetchCiStatus = mod.fetchCiStatus
  hasElementId = mod.hasElementId
  findMissingSections = mod.findMissingSections
  resolveTemplate = mod.resolveTemplate
  siteBaseUrl = mod.siteBaseUrl
  checkSections = mod.checkSections
  selectCrawlPages = mod.selectCrawlPages
  isAllowlisted = mod.isAllowlisted
  collectConsoleErrors = mod.collectConsoleErrors
  collectAxeViolations = mod.collectAxeViolations
  evaluateResponsive = mod.evaluateResponsive
  mdCell = mod.mdCell
  parseArgs = mod.parseArgs
  REQUIREMENTS = mod.REQUIREMENTS
})

const GOOD_HTML = `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Example Charity</title></head>
<body><main>Welcome</main>
<footer>Hosted by <a href="https://freeforcharity.org">Free For Charity</a>
Example Charity Inc. EIN: 12-3456789</footer></body></html>`

const mockResponse = ({ status = 200, url = '', body = '' } = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  url,
  text: async () => body,
  json: async () => JSON.parse(body || '{}'),
})

describe('liveUrlFrom', () => {
  it('extracts the marked Live site URL (roadmap-generator format)', () => {
    expect(liveUrlFrom('intro\nLive site: https://freeforcharity.github.io/FFC-EX-x/\n')).toBe(
      'https://freeforcharity.github.io/FFC-EX-x/'
    )
    expect(liveUrlFrom('- Live URL: http://example.org/page')).toBe('http://example.org/page')
  })

  it('ignores unmarked links and the unfilled stub placeholder', () => {
    expect(liveUrlFrom('See https://www.guidestar.org/profile/12-3456789')).toBeUndefined()
    expect(
      liveUrlFrom('Live site: (paste the https GitHub Pages URL here once the site loads)')
    ).toBeUndefined()
    expect(liveUrlFrom(null)).toBeUndefined()
  })

  it('strips trailing punctuation/markup junk from the captured URL', () => {
    const url = 'https://freeforcharity.github.io/FFC-EX-x/'
    expect(liveUrlFrom(`Live site: <${url}>`)).toBe(url) // autolink angle brackets
    expect(liveUrlFrom(`Live site: **${url}**`)).toBe(url) // bold
    expect(liveUrlFrom(`Live site: ${url}.`)).toBe(url) // sentence period
    expect(liveUrlFrom(`Live site: ${url}, deployed today`)).toBe(url) // trailing comma
    expect(liveUrlFrom(`Live site: (${url})`)).toBe(url) // parenthesized
  })

  it('accepts the markdown-link form and takes the parenthesized URL', () => {
    expect(liveUrlFrom('Live site: [staging](https://freeforcharity.github.io/FFC-EX-x/)')).toBe(
      'https://freeforcharity.github.io/FFC-EX-x/'
    )
    expect(liveUrlFrom('Live site: [https://a.github.io/b/](https://a.github.io/b/)')).toBe(
      'https://a.github.io/b/'
    )
  })
})

describe('fetchIssueBody', () => {
  it('requests the issue via the REST API with the token and returns the body', async () => {
    const fetchFn = jest.fn(async () => mockResponse({ body: '{"body":"Live site: https://x/"}' }))
    const body = await fetchIssueBody('FreeForCharity/FFC-IN-ffcadmin.org', 42, 'tok', fetchFn)
    expect(body).toBe('Live site: https://x/')
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('https://api.github.com/repos/FreeForCharity/FFC-IN-ffcadmin.org/issues/42')
    expect(init.headers.Authorization).toBe('Bearer tok')
  })

  it('throws on a non-2xx API response', async () => {
    const fetchFn = jest.fn(async () => mockResponse({ status: 404 }))
    await expect(fetchIssueBody('o/r', 1, undefined, fetchFn)).rejects.toThrow('404')
  })
})

describe('checkHttp', () => {
  it('passes on HTTP 200 and captures the final URL and html', async () => {
    const fetchFn = jest.fn(async () =>
      mockResponse({ status: 200, url: 'https://o.github.io/r/', body: GOOD_HTML })
    )
    const res = await checkHttp('https://o.github.io/r', fetchFn)
    expect(res.ok).toBe(true)
    expect(res.finalUrl).toBe('https://o.github.io/r/')
    expect(res.html).toContain('Free For Charity')
  })

  it('fails on non-200 status', async () => {
    const fetchFn = jest.fn(async () => mockResponse({ status: 404 }))
    const res = await checkHttp('https://o.github.io/r/', fetchFn)
    expect(res.ok).toBe(false)
    expect(res.status).toBe(404)
  })

  it('fails (not throws) on redirect loops / fetch errors', async () => {
    const fetchFn = jest.fn(async () => {
      throw new Error('redirect count exceeded')
    })
    const res = await checkHttp('https://loop.example/', fetchFn)
    expect(res.ok).toBe(false)
    expect(res.error).toMatch(/redirect count exceeded/)
  })
})

describe('checkHost', () => {
  it('recognizes github.io staging hosts', () => {
    expect(checkHost('https://freeforcharity.github.io/FFC-EX-x/').isGithubIo).toBe(true)
  })

  it('flags custom domains as non-staging', () => {
    const res = checkHost('https://examplecharity.org/')
    expect(res.isGithubIo).toBe(false)
    expect(res.host).toBe('examplecharity.org')
  })

  it('handles unparseable URLs', () => {
    expect(checkHost('not a url').ok).toBe(false)
  })
})

describe('checkFooter', () => {
  it('passes when brand text, freeforcharity.org link, and EIN are all present', () => {
    expect(checkFooter(GOOD_HTML).ok).toBe(true)
  })

  it('accepts EIN without a dash and compact brand spelling', () => {
    const html = 'FreeForCharity — freeforcharity.org — EIN 123456789'
    const res = checkFooter(html)
    expect(res).toMatchObject({ ok: true, brand: true, link: true, ein: true })
  })

  it('reports which markers are missing', () => {
    const res = checkFooter('<footer>Some Charity, EIN: 12-3456789</footer>')
    expect(res.ok).toBe(false)
    expect(res.brand).toBe(false)
    expect(res.link).toBe(false)
    expect(res.ein).toBe(true)
  })
})

describe('checkViewport', () => {
  it('detects the viewport meta tag', () => {
    expect(checkViewport(GOOD_HTML).ok).toBe(true)
    expect(checkViewport('<head><title>x</title></head>').ok).toBe(false)
  })
})

describe('extractRootRelativeRefs / checkAssets', () => {
  const HTML = `<link rel="stylesheet" href="/styles.css" />
    <script src="/app.js"></script>
    <img src="/img/logo.png" /><img src="/img/logo.png" />
    <a href="/FFC-EX-x/about/">ok</a>
    <script src="//cdn.example.com/x.js"></script>
    <a href="https://example.org/abs">abs</a>`

  it('collects deduped root-relative refs, excluding protocol-relative and absolute', () => {
    const refs = extractRootRelativeRefs(HTML)
    expect(refs).toEqual(['/styles.css', '/app.js', '/img/logo.png', '/FFC-EX-x/about/'])
  })

  const fast = { pacingMs: 0 }

  it('fails when a root-relative asset 404s (broken basePath signal)', async () => {
    const fetchFn = jest.fn(async (url) =>
      mockResponse({ status: url.endsWith('/styles.css') ? 404 : 200, url })
    )
    const res = await checkAssets(HTML, 'https://o.github.io/FFC-EX-x/', fetchFn, fast)
    expect(res.ok).toBe(false)
    expect(res.broken).toEqual(['/styles.css'])
    // Root-relative refs must resolve against the ORIGIN, not the basePath.
    expect(fetchFn).toHaveBeenCalledWith('https://o.github.io/styles.css', expect.anything())
  })

  it('checks at most 10 assets', async () => {
    const many = Array.from({ length: 15 }, (_, i) => `<img src="/a${i}.png">`).join('')
    const fetchFn = jest.fn(async (url) => mockResponse({ status: 200, url }))
    const res = await checkAssets(many, 'https://o.github.io/', fetchFn, fast)
    expect(res.checked).toBe(10)
    expect(fetchFn).toHaveBeenCalledTimes(10)
  })

  it('passes trivially when the page has no root-relative refs', async () => {
    const fetchFn = jest.fn()
    const res = await checkAssets(
      '<a href="https://x.org/">x</a>',
      'https://o.github.io/',
      fetchFn,
      fast
    )
    expect(res.ok).toBe(true)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('reports a thrown fetch as unreachable (transient), NOT as a 404', async () => {
    const fetchFn = jest.fn(async (url) => {
      if (url.endsWith('/app.js')) throw new TypeError('fetch failed')
      return mockResponse({ status: 200, url })
    })
    const res = await checkAssets(HTML, 'https://o.github.io/FFC-EX-x/', fetchFn, fast)
    expect(res.ok).toBe(true) // network trouble is not a broken basePath
    expect(res.broken).toEqual([])
    expect(res.unreachable).toEqual(['/app.js'])
  })

  it('retries 403/405 HEAD responses with a ranged GET before judging', async () => {
    // Host rejects HEAD with 405 but serves the ranged GET: conclusive OK.
    const fetchFn = jest.fn(async (url, init = {}) =>
      init.method === 'HEAD'
        ? mockResponse({ status: 405, url })
        : mockResponse({ status: 206, url })
    )
    const res = await checkAssets('<img src="/logo.png">', 'https://o.github.io/', fetchFn, fast)
    expect(res.ok).toBe(true)
    expect(res.broken).toEqual([])
    expect(res.inconclusive).toEqual([])
    const gets = fetchFn.mock.calls.filter(([, init]) => init.method === 'GET')
    expect(gets).toHaveLength(1)
    expect(gets[0][1].headers.range).toBe('bytes=0-0')
  })

  it('a 404 on the ranged GET retry is still a broken asset', async () => {
    const fetchFn = jest.fn(async (url, init = {}) =>
      init.method === 'HEAD'
        ? mockResponse({ status: 403, url })
        : mockResponse({ status: 404, url })
    )
    const res = await checkAssets('<img src="/logo.png">', 'https://o.github.io/', fetchFn, fast)
    expect(res.ok).toBe(false)
    expect(res.broken).toEqual(['/logo.png'])
  })

  it('marks assets inconclusive (unknown) when HEAD and ranged GET are both blocked', async () => {
    const fetchFn = jest.fn(async (url) => mockResponse({ status: 403, url }))
    const res = await checkAssets('<img src="/logo.png">', 'https://o.github.io/', fetchFn, fast)
    expect(res.ok).toBe(true) // unknown, never a FAIL
    expect(res.broken).toEqual([])
    expect(res.inconclusive).toEqual(['/logo.png'])
  })
})

describe('repo derivation (CI row)', () => {
  it('derives FreeForCharity/FFC-EX-<x> from the github.io project URL', () => {
    expect(deriveRepoFromUrl('https://freeforcharity.github.io/FFC-EX-example.org/')).toBe(
      'FreeForCharity/FFC-EX-example.org'
    )
    expect(deriveRepoFromUrl('https://FreeForCharity.github.io/FFC-EX-x/about/')).toBe(
      'FreeForCharity/FFC-EX-x'
    )
    expect(deriveRepoFromUrl('https://someone.github.io/site')).toBe('someone/site')
  })

  it('returns undefined for custom domains, root sites and junk', () => {
    expect(deriveRepoFromUrl('https://examplecharity.org/FFC-EX-x/')).toBeUndefined()
    expect(deriveRepoFromUrl('https://freeforcharity.github.io/')).toBeUndefined()
    expect(deriveRepoFromUrl('not a url')).toBeUndefined()
  })

  it('validates explicit owner/name slugs', () => {
    expect(isRepoSlug('FreeForCharity/FFC-EX-x.org')).toBe(true)
    expect(isRepoSlug('FFC-EX-x.org')).toBe(false)
    expect(isRepoSlug('a/b/c')).toBe(false)
    expect(isRepoSlug('a/b c')).toBe(false)
    expect(isRepoSlug(undefined)).toBe(false)
  })
})

describe('evaluateCiRuns', () => {
  const run = (conclusion) => ({ conclusion, url: `https://github.com/run/${conclusion}` })

  it('passes when every latest run is success, neutral or skipped', () => {
    const res = evaluateCiRuns([
      { name: 'CI', path: '.github/workflows/ci.yml', run: run('success') },
      { name: 'Lint', path: '.github/workflows/lint.yml', run: run('neutral') },
      { name: 'Opt', path: '.github/workflows/opt.yml', run: run('skipped') },
    ])
    expect(res).toMatchObject({ ok: true, checked: 3, failing: [] })
  })

  it('fails on failure, cancelled or timed_out latest runs', () => {
    const res = evaluateCiRuns([
      { name: 'CI', path: '.github/workflows/ci.yml', run: run('failure') },
      { name: 'Deploy', path: '.github/workflows/deploy.yml', run: run('cancelled') },
      { name: 'Smoke', path: '.github/workflows/smoke.yml', run: run('timed_out') },
      { name: 'Ok', path: '.github/workflows/ok.yml', run: run('success') },
    ])
    expect(res.ok).toBe(false)
    expect(res.failing.map((e) => e.name)).toEqual(['CI', 'Deploy', 'Smoke'])
  })

  it('ignores PR-only workflows (no default-branch run) and configured bot/agent workflows', () => {
    const res = evaluateCiRuns([
      { name: 'CI', path: '.github/workflows/ci.yml', run: run('success') },
      { name: 'PR only', path: '.github/workflows/pr.yml', run: null },
      {
        name: 'Dependabot Updates',
        path: 'dynamic/dependabot/dependabot-updates',
        run: run('failure'),
      },
      {
        name: 'Copilot',
        path: 'dynamic/agents/copilot-pull-request-reviewer',
        run: run('failure'),
      },
    ])
    expect(res).toMatchObject({ ok: true, checked: 1, noRuns: ['PR only'] })
    expect(res.ignored).toEqual(['Dependabot Updates', 'Copilot'])
  })

  it('fails when no workflow has a completed default-branch run', () => {
    expect(evaluateCiRuns([]).ok).toBe(false)
    expect(evaluateCiRuns([{ name: 'CI', path: 'x', run: null }]).ok).toBe(false)
  })

  it('every configured ignore entry carries a reason', () => {
    for (const entry of REQUIREMENTS.ci.ignoreWorkflowPaths) {
      expect(entry.reason).toEqual(expect.any(String))
      expect(() => new RegExp(entry.path)).not.toThrow()
    }
  })
})

const jsonResponse = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  url: '',
  json: async () => data,
  text: async () => JSON.stringify(data),
})

/** Route GitHub REST API calls for one repo with the given workflow runs. */
const apiRoutes = ({ runs = { 1: 'success' }, templateRepo, repoStatus = 200 } = {}) => {
  return (url) => {
    const u = new URL(url)
    if (repoStatus !== 200) return jsonResponse({}, repoStatus)
    const runMatch = u.pathname.match(/\/actions\/workflows\/(\d+)\/runs$/)
    if (runMatch) {
      const conclusion = runs[runMatch[1]]
      return jsonResponse({
        workflow_runs: conclusion
          ? [{ conclusion, html_url: `https://github.com/r/${runMatch[1]}` }]
          : [],
      })
    }
    if (u.pathname.endsWith('/actions/workflows')) {
      return jsonResponse({
        workflows: [
          ...Object.keys(runs).map((id) => ({
            id: Number(id),
            name: `WF ${id}`,
            path: `.github/workflows/wf${id}.yml`,
            state: 'active',
          })),
          { id: 99, name: 'Old', path: '.github/workflows/old.yml', state: 'disabled_manually' },
        ],
      })
    }
    return jsonResponse({
      default_branch: 'main',
      ...(templateRepo ? { template_repository: { full_name: templateRepo } } : {}),
    })
  }
}

describe('fetchCiStatus', () => {
  it('reads the default branch, active workflows and their latest completed runs', async () => {
    const route = apiRoutes({
      runs: { 1: 'success', 2: 'failure' },
      templateRepo: 'FreeForCharity/FFC-IN-FFC_Single_Page_Template',
    })
    const fetchFn = jest.fn(async (url) => route(url))
    const res = await fetchCiStatus('FreeForCharity/FFC-EX-x', 'tok', fetchFn)
    expect(res.defaultBranch).toBe('main')
    expect(res.templateRepo).toBe('FreeForCharity/FFC-IN-FFC_Single_Page_Template')
    expect(res.entries.map((e) => [e.name, e.run?.conclusion])).toEqual([
      ['WF 1', 'success'],
      ['WF 2', 'failure'],
    ]) // the disabled workflow is never queried
    const runCall = fetchFn.mock.calls.find(([u]) => u.includes('/workflows/1/runs'))
    expect(runCall[0]).toContain('branch=main')
    expect(runCall[0]).toContain('status=completed')
    expect(runCall[1].headers.Authorization).toBe('Bearer tok')
  })

  it('throws with the HTTP status on API errors', async () => {
    const fetchFn = jest.fn(async () => jsonResponse({}, 404))
    await expect(fetchCiStatus('o/r', undefined, fetchFn)).rejects.toMatchObject({ status: 404 })
  })
})

describe('required sections / template resolution', () => {
  it('matches element ids exactly (quoted or bare), not substrings', () => {
    const html = `<div id="hero"></div><section id='mission'></section><div id=donate>
      <div id="volunteer-form"></div><p>id="volunteer" in text</p>`
    expect(hasElementId(html, 'hero')).toBe(true)
    expect(hasElementId(html, 'mission')).toBe(true)
    expect(hasElementId(html, 'donate')).toBe(true)
    expect(hasElementId(html, 'volunteer')).toBe(false)
    expect(findMissingSections(html, ['hero', 'volunteer', 'faq'])).toEqual(['volunteer', 'faq'])
  })

  it('resolves the template: explicit input > template_repository > heuristic > default', () => {
    const spHtml = '<div id="hero"></div><div id="mission"></div>'
    expect(resolveTemplate({ explicit: 'footer-only', html: spHtml })).toEqual({
      key: 'footer-only',
      source: 'input',
    })
    expect(
      resolveTemplate({
        explicit: 'auto',
        templateRepo: 'freeforcharity/ffc-in-footer_only_template',
        html: spHtml,
      })
    ).toEqual({ key: 'footer-only', source: 'template_repository' })
    expect(resolveTemplate({ templateRepo: 'FreeForCharity/FFC_Single_Page_Template' }).key).toBe(
      'single-page'
    )
    expect(resolveTemplate({ html: spHtml })).toEqual({ key: 'single-page', source: 'detected' })
    expect(resolveTemplate({ html: '<main id="main-content"></main>' })).toEqual({
      key: 'footer-only',
      source: 'default',
    })
    expect(resolveTemplate({ explicit: 'bogus' }).key).toBeUndefined()
  })

  it('config: both templates require main-content and the seven footer policy pages', () => {
    for (const t of Object.values(REQUIREMENTS.templates)) {
      expect(t.homeSectionIds).toContain('main-content')
      expect(t.pages).toHaveLength(7)
      expect(t.pages).toContain('/privacy-policy/')
    }
    expect(REQUIREMENTS.templates['single-page'].homeSectionIds).toEqual(
      expect.arrayContaining(['hero', 'mission', 'volunteer', 'donate'])
    )
  })

  it('siteBaseUrl normalizes to the site root directory', () => {
    expect(siteBaseUrl('https://o.github.io/FFC-EX-x')).toBe('https://o.github.io/FFC-EX-x/')
    expect(siteBaseUrl('https://o.github.io/FFC-EX-x/index.html?a=1#top')).toBe(
      'https://o.github.io/FFC-EX-x/'
    )
    expect(siteBaseUrl('https://o.github.io/FFC-EX-x/')).toBe('https://o.github.io/FFC-EX-x/')
  })

  it('checkSections fetches required pages under the basePath and reports gaps', async () => {
    const fetchFn = jest.fn(async (url) =>
      mockResponse({ status: url.endsWith('/cookie-policy/') ? 404 : 200, url, body: 'ok' })
    )
    const res = await checkSections(
      '<main id="main-content"></main><div id="hero"></div>',
      'https://o.github.io/FFC-EX-x/',
      { key: 'single-page', source: 'input' },
      fetchFn,
      { pacingMs: 0 }
    )
    expect(res.ok).toBe(false)
    expect(res.missingSections).toEqual(['mission', 'volunteer', 'donate'])
    expect(res.missingPages).toEqual([{ path: '/cookie-policy/', status: 404, ok: false }])
    expect(fetchFn).toHaveBeenCalledWith(
      'https://o.github.io/FFC-EX-x/privacy-policy/',
      expect.anything()
    )
  })
})

describe('browser-check helpers', () => {
  const HOME = 'https://o.github.io/FFC-EX-x/'

  it('selectCrawlPages: home first, same-site nav pages, required pages, deduped and capped', () => {
    const pages = selectCrawlPages(
      HOME,
      [
        'https://o.github.io/FFC-EX-x#mission', // in-page anchor = home
        'https://o.github.io/FFC-EX-x/about/',
        'https://o.github.io/FFC-EX-x/about', // same page, no trailing slash
        'https://o.github.io/other-repo/', // outside the basePath
        'https://example.org/', // external
        'mailto:hi@example.org',
        'https://o.github.io/FFC-EX-x/report.pdf', // file, not a page
      ],
      ['/privacy-policy/', '/about/']
    )
    expect(pages).toEqual([
      HOME,
      'https://o.github.io/FFC-EX-x/about/',
      'https://o.github.io/FFC-EX-x/privacy-policy/',
    ])
    const many = Array.from({ length: 20 }, (_, i) => `${HOME}p${i}/`)
    expect(selectCrawlPages(HOME, many)).toHaveLength(10)
  })

  it('isAllowlisted needs every given regex to match and ignores empty entries', () => {
    const allow = [
      { message: 'ResizeObserver loop', reason: 'benign' },
      { message: 'blocked', source: 'zeffy\\.com', reason: 'vendor' },
      { reason: 'no patterns, must never match' },
    ]
    expect(isAllowlisted({ text: 'ResizeObserver loop limit exceeded', url: '' }, allow)).toBe(true)
    expect(isAllowlisted({ text: 'blocked', url: 'https://www.zeffy.com/x.js' }, allow)).toBe(true)
    expect(isAllowlisted({ text: 'blocked', url: 'https://o.github.io/app.js' }, allow)).toBe(false)
    expect(isAllowlisted({ text: 'TypeError: x is undefined', url: '' }, allow)).toBe(false)
  })

  it('the shipped console allowlist entries are documented and valid', () => {
    for (const entry of REQUIREMENTS.consoleAllowlist) {
      expect(entry.reason).toEqual(expect.any(String))
      expect(entry.message || entry.source).toBeTruthy()
    }
  })

  it('collectConsoleErrors flattens console, page and HTTP errors and counts allowlisted noise', () => {
    const allow = [{ source: 'vendor\\.example', reason: 'third-party' }]
    const res = collectConsoleErrors(
      [
        {
          url: HOME,
          status: 200,
          consoleErrors: [
            { text: 'Failed to load resource', url: 'https://vendor.example/x.js' },
            { text: 'Hydration failed', url: `${HOME}app.js` },
          ],
          pageErrors: ['ReferenceError: foo is not defined'],
        },
        { url: `${HOME}gone/`, status: 404, consoleErrors: [], pageErrors: [] },
        { url: `${HOME}slow/`, status: 0, error: 'Timeout 30000ms', consoleErrors: [] },
      ],
      allow
    )
    expect(res.allowlisted).toBe(1)
    expect(res.errors.map((e) => e.text)).toEqual([
      'Hydration failed',
      'uncaught: ReferenceError: foo is not defined',
      'HTTP 404 loading page',
      'page failed to load: Timeout 30000ms',
    ])
  })

  it('collectAxeViolations gates only serious/critical impacts, grouped by rule', () => {
    const res = collectAxeViolations([
      {
        url: HOME,
        axe: {
          violations: [
            { id: 'color-contrast', impact: 'serious', nodes: 3 },
            { id: 'region', impact: 'moderate', nodes: 9 },
          ],
        },
      },
      {
        url: `${HOME}about/`,
        axe: { violations: [{ id: 'color-contrast', impact: 'serious', nodes: 2 }] },
      },
      {
        url: `${HOME}x/`,
        axe: { violations: [{ id: 'image-alt', impact: 'critical', nodes: 1 }] },
      },
      { url: `${HOME}broken/`, axe: { error: 'axe crashed' } },
    ])
    expect(res.scanned).toBe(3)
    expect(res.blocking).toEqual([
      { id: 'color-contrast', impact: 'serious', nodes: 5, pages: [HOME, `${HOME}about/`] },
      { id: 'image-alt', impact: 'critical', nodes: 1, pages: [`${HOME}x/`] },
    ])
    expect(res.scanErrors).toEqual([{ page: `${HOME}broken/`, error: 'axe crashed' }])
  })

  it('evaluateResponsive: horizontal scroll and nav usability rules', () => {
    const base = { scrollWidth: 375, innerWidth: 375, linksBefore: 1 }
    // 1px rounding slack is allowed; 2px is a horizontal scroll.
    expect(evaluateResponsive({ ...base, scrollWidth: 376 }).noHorizontalScroll).toBe(true)
    expect(evaluateResponsive({ ...base, scrollWidth: 377 }).noHorizontalScroll).toBe(false)
    // A visible toggle must actually open the menu.
    expect(evaluateResponsive({ ...base, toggleVisible: true, toggleOpened: true }).ok).toBe(true)
    expect(evaluateResponsive({ ...base, toggleVisible: true, toggleOpened: false }).ok).toBe(false)
    // No toggle: header links must be visible...
    expect(evaluateResponsive({ ...base, linksBefore: 4 })).toMatchObject({
      ok: true,
      navMode: 'links',
    })
    expect(evaluateResponsive(base).ok).toBe(false)
    // ...unless the template ships no header menu (footer-only layout).
    expect(evaluateResponsive(base, { headerNavRequired: false })).toMatchObject({
      ok: true,
      navMode: 'none',
    })
  })

  it('mdCell flattens whitespace, escapes pipes/backticks and truncates', () => {
    expect(mdCell('a | b\n`c`')).toBe("a \\| b 'c'")
    expect(mdCell('x'.repeat(300), 10)).toHaveLength(10)
  })

  it('parseArgs reads the CLI flags', () => {
    expect(
      parseArgs([
        '--issue',
        '12',
        '--site-repo',
        'FreeForCharity/FFC-EX-x',
        '--template',
        'single-page',
        '--no-browser',
      ])
    ).toEqual({
      issueNumber: '12',
      url: undefined,
      repo: undefined,
      siteRepo: 'FreeForCharity/FFC-EX-x',
      template: 'single-page',
      browser: false,
    })
    expect(parseArgs(['--url', 'https://x/']).template).toBe('auto')
  })
})

describe('verdict table (Section-4b mapping)', () => {
  const fast = { pacingMs: 0 }
  const SITE = 'https://freeforcharity.github.io/FFC-EX-x/'
  const SP_HTML = GOOD_HTML.replace(
    '<main>Welcome</main>',
    '<main id="main-content"><div id="hero"></div><div id="mission"></div>' +
      '<div id="volunteer"></div><div id="donate"></div></main>'
  )

  /** Site + GitHub API mock: every page answers `pageStatus` with `html`, assets 200. */
  const siteFetch = ({ html = SP_HTML, pageStatus = () => 200, api = {} } = {}) => {
    const route = apiRoutes(api)
    return jest.fn(async (url, init = {}) => {
      if (url.startsWith('https://api.github.com/')) return route(url)
      if (init.method === 'HEAD') return mockResponse({ status: 200, url })
      const status = pageStatus(url)
      return mockResponse({ status, url, body: status === 200 ? html : '' })
    })
  }

  /** Browser stub: clean pages for whatever selectPages picks. */
  const browserStub = ({ responsive = {}, page = () => ({}) } = {}) =>
    jest.fn(async ({ url, selectPages }) => ({
      responsive: {
        scrollWidth: 375,
        innerWidth: 375,
        linksBefore: 1,
        toggleVisible: true,
        toggleOpened: true,
        ...responsive,
      },
      pages: selectPages(url, []).map((u, i) => ({
        url: u,
        status: 200,
        consoleErrors: [],
        pageErrors: [],
        axe: { violations: [] },
        ...page(u, i),
      })),
    }))

  const rowsFor = async (opts = {}, fetchFn = siteFetch(), url = SITE) => {
    const results = await runChecks(url, fetchFn, {
      ...fast,
      browserRunner: browserStub(),
      ...opts,
    })
    return { results, rows: buildVerdictRows(results) }
  }
  const row = (rows, prefix) => rows.find((r) => r.item.startsWith(prefix))
  const status = (rows, prefix) => row(rows, prefix).status

  it('PASSes every machine-checkable row on a healthy site; only content approval stays MANUAL', async () => {
    const browserRunner = browserStub()
    const { rows } = await rowsFor({ browserRunner })
    const byItem = Object.fromEntries(rows.map((r) => [r.item, r.status]))

    expect(byItem["CI green on the charity's FFC-EX repo"]).toBe('PASS')
    expect(byItem['Site loads at its GitHub Pages URL (HTTP 200, no redirect loops)']).toBe('PASS')
    expect(byItem['FFC-standard footer present and populated']).toBe('PASS')
    expect(byItem['All required sections/pages present per the chosen template']).toBe('PASS')
    expect(byItem['Mobile responsive (spot-check at 375px)']).toBe('PASS')
    expect(byItem['No browser console errors on any page']).toBe('PASS')
    expect(byItem['Accessibility pass (axe clean or Lighthouse a11y ≥ 90)']).toBe('PASS')
    expect(byItem['Content reviewed and approved by the charity']).toBe('MANUAL')
    expect(byItem['basePath sanity (root-relative asset refs resolve)']).toBe('PASS')
    expect(rows.filter((r) => r.status === 'MANUAL')).toHaveLength(1)

    // The browser scans home + the template's required pages (8, under the cap of 10).
    const [{ url, selectPages, axe }] = browserRunner.mock.calls[0]
    expect(url).toBe(SITE)
    expect(axe.failImpacts).toEqual(['serious', 'critical'])
    expect(selectPages(url, [])).toHaveLength(8)
  })

  it('FAILS the CI row on a red latest run and names the workflow', async () => {
    const { rows } = await rowsFor({}, siteFetch({ api: { runs: { 1: 'success', 2: 'failure' } } }))
    const ci = row(rows, 'CI green')
    expect(ci.status).toBe('FAIL')
    expect(ci.detail).toMatch(/WF 2 → failure/)
  })

  it('CI row: explicit repo wins; underivable repo FAILs; 404 FAILs; API outage WARNs', async () => {
    const fetchFn = siteFetch()
    await rowsFor({ siteRepo: 'FreeForCharity/FFC-EX-explicit' }, fetchFn)
    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.github.com/repos/FreeForCharity/FFC-EX-explicit',
      expect.anything()
    )

    const custom = await rowsFor({}, siteFetch(), 'https://examplecharity.org/')
    expect(row(custom.rows, 'CI green').detail).toMatch(/`repo` input/)
    expect(status(custom.rows, 'CI green')).toBe('FAIL')

    const missing = await rowsFor({}, siteFetch({ api: { repoStatus: 404 } }))
    expect(status(missing.rows, 'CI green')).toBe('FAIL')

    const outage = await rowsFor({}, siteFetch({ api: { repoStatus: 503 } }))
    expect(status(outage.rows, 'CI green')).toBe('WARN')
  })

  it('FAILS the sections row when a required section or page is missing', async () => {
    const fetchFn = siteFetch({
      html: SP_HTML.replace('<div id="donate"></div>', ''),
      pageStatus: (u) => (u.endsWith('/terms-of-service/') ? 404 : 200),
      api: { templateRepo: 'FreeForCharity/FFC-IN-FFC_Single_Page_Template' },
    })
    const { rows } = await rowsFor({}, fetchFn)
    const r = row(rows, 'All required sections')
    expect(r.status).toBe('FAIL')
    expect(r.detail).toMatch(/single-page/)
    expect(r.detail).toMatch(/#donate/)
    expect(r.detail).toMatch(/\/terms-of-service\/ \(404\)/)
  })

  it('applies the footer-only requirements (and no header menu) for footer-only repos', async () => {
    const fetchFn = siteFetch({
      html: GOOD_HTML.replace('<main>', '<main id="main-content">'),
      api: { templateRepo: 'FreeForCharity/FFC-IN-Footer_Only_Template' },
    })
    const browserRunner = browserStub({ responsive: { toggleVisible: false, linksBefore: 0 } })
    const { rows } = await rowsFor({ browserRunner }, fetchFn)
    expect(status(rows, 'All required sections')).toBe('PASS')
    expect(row(rows, 'Mobile responsive').detail).toMatch(/footer-only/)
    expect(status(rows, 'Mobile responsive')).toBe('PASS')
  })

  it('FAILS the 375px row on horizontal scroll or an unusable menu', async () => {
    const scroll = await rowsFor({
      browserRunner: browserStub({ responsive: { scrollWidth: 520 } }),
    })
    expect(row(scroll.rows, 'Mobile responsive').detail).toMatch(/scrollWidth 520px > 375px/)
    expect(status(scroll.rows, 'Mobile responsive')).toBe('FAIL')

    const menu = await rowsFor({
      browserRunner: browserStub({ responsive: { toggleOpened: false } }),
    })
    expect(status(menu.rows, 'Mobile responsive')).toBe('FAIL')
    expect(row(menu.rows, 'Mobile responsive').detail).toMatch(/did not reveal/)
  })

  it('FAILS the 375px row without a viewport meta tag, even before the browser check', async () => {
    const fetchFn = siteFetch({ html: SP_HTML.replace(/<meta name="viewport"[^>]*>/, '') })
    const { rows } = await rowsFor({}, fetchFn)
    expect(status(rows, 'Mobile responsive')).toBe('FAIL')
    expect(row(rows, 'Mobile responsive').detail).toMatch(/No viewport meta/)
  })

  it('FAILS the console row on non-allowlisted errors and the a11y row on serious violations', async () => {
    const browserRunner = browserStub({
      page: (u, i) =>
        i === 0
          ? {
              consoleErrors: [{ text: 'Uncaught TypeError: x is null', url: `${u}app.js` }],
              axe: { violations: [{ id: 'image-alt', impact: 'critical', help: 'alt', nodes: 2 }] },
            }
          : { axe: { violations: [{ id: 'region', impact: 'moderate', nodes: 4 }] } },
    })
    const { rows } = await rowsFor({ browserRunner })
    expect(status(rows, 'No browser console errors')).toBe('FAIL')
    expect(row(rows, 'No browser console errors').detail).toMatch(/\/: Uncaught TypeError/)
    const a11y = row(rows, 'Accessibility pass')
    expect(a11y.status).toBe('FAIL')
    expect(a11y.detail).toMatch(/image-alt \(critical, 2 node\(s\) on \/\)/)
    expect(a11y.detail).not.toMatch(/region/) // moderate findings are not gated
  })

  it('WARNS (not FAILS) the browser rows when the browser could not run', async () => {
    const crashing = jest.fn(async () => {
      throw new Error('Executable does not exist')
    })
    const { results, rows } = await rowsFor({ browserRunner: crashing })
    for (const item of ['Mobile responsive', 'No browser console errors', 'Accessibility pass']) {
      expect(status(rows, item)).toBe('WARN')
    }
    expect(row(rows, 'Accessibility pass').detail).toMatch(/Executable does not exist/)
    expect(buildVerdictTable(results)).toMatch(/3 check\(s\) WARN/)

    const disabled = await rowsFor({ browserRunner: null })
    expect(row(disabled.rows, 'No browser console errors').detail).toMatch(/--no-browser/)
  })

  it('FAILS the site-loads row on a custom domain (Gate 3 validates the staging URL)', async () => {
    // A reachable custom domain is the wrong-URL case this check exists for:
    // Gate 3 validates the github.io STAGING URL; the custom domain is Gate 4.
    const { rows } = await rowsFor({}, siteFetch(), 'https://examplecharity.org/')
    const r = row(rows, 'Site loads')
    expect(r.status).toBe('FAIL')
    expect(r.detail).toMatch(/custom domain/)
    expect(r.detail).toMatch(/Gate 3 validates/)
  })

  it('fails every page-dependent row when the page does not load and skips the browser', async () => {
    const browserRunner = browserStub()
    const fetchFn = siteFetch({ pageStatus: () => 404 })
    const { rows } = await rowsFor({ browserRunner }, fetchFn, 'https://o.github.io/missing/')
    for (const item of [
      'Site loads',
      'FFC-standard footer',
      'All required sections',
      'Mobile responsive',
      'No browser console errors',
      'Accessibility pass',
      'basePath',
    ]) {
      expect(status(rows, item)).toBe('FAIL')
    }
    expect(browserRunner).not.toHaveBeenCalled()
    // Content approval stays MANUAL regardless of load failures.
    expect(status(rows, 'Content reviewed')).toBe('MANUAL')
  })

  it('WARNS (not FAILS) the basePath row when assets are unreachable during the check', async () => {
    const route = apiRoutes()
    const fetchFn = jest.fn(async (url, init = {}) => {
      if (url.startsWith('https://api.github.com/')) return route(url)
      if (init.method === 'HEAD' || init.headers?.range) throw new TypeError('fetch failed')
      return mockResponse({ status: 200, url, body: `${SP_HTML}<img src="/logo.png">` })
    })
    const { results, rows } = await rowsFor({}, fetchFn)
    const r = row(rows, 'basePath')
    expect(r.status).toBe('WARN')
    expect(r.detail).toMatch(/unreachable during check — transient\?/)
    const md = buildVerdictTable(results)
    expect(md).not.toMatch(/automated check\(s\) FAILED/)
    expect(md).toMatch(/1 check\(s\) WARN/)
  })

  it('renders a markdown table with a failure summary line', async () => {
    const fetchFn = siteFetch({ html: '<html><body>no footer</body></html>' })
    const results = await runChecks(SITE, fetchFn, { ...fast, browserRunner: browserStub() })
    const md = buildVerdictTable(results, { issueNumber: 123 })
    expect(md).toContain('## Gate-3 auto-validation')
    expect(md).toContain('work order #123')
    expect(md).toContain('| Gate-3 item | Status | Detail |')
    expect(md).toMatch(/automated check\(s\) FAILED/)
    expect(md).toContain('Missing: "Free For Charity" text, freeforcharity.org link, EIN')
  })

  it('renders the all-clear summary when every automated check passes', async () => {
    const results = await runChecks(SITE, siteFetch(), { ...fast, browserRunner: browserStub() })
    const md = buildVerdictTable(results)
    expect(md).toContain('**All automated checks passed.**')
    expect(md).toContain('1 item(s) remain MANUAL')
  })
})

describe('gate3-validate.yml workflow contract', () => {
  const fs = require('fs')
  const path = require('path')
  const yaml = require('js-yaml')
  const file = path.join(process.cwd(), '.github', 'workflows', 'gate3-validate.yml')
  const raw = fs.readFileSync(file, 'utf8')
  const wf = yaml.load(raw)
  const steps = wf.jobs.validate.steps

  it('runs on GITHUB_TOKEN only: no secrets, no environment gate', () => {
    expect(raw).not.toMatch(/secrets\./)
    expect(wf.jobs.validate.environment).toBeUndefined()
    expect(wf.permissions).toEqual({ contents: 'read', issues: 'write' })
  })

  it('installs lockfile-pinned deps and Chromium the same way ci.yml does', () => {
    const runs = steps.map((s) => s.run || '').join('\n')
    expect(runs).toContain('pnpm install --frozen-lockfile')
    expect(runs).toContain('pnpm exec playwright install --with-deps chromium')
  })

  it('exposes the repo and template inputs and passes them to the script', () => {
    const inputs = wf.on.workflow_dispatch.inputs
    expect(inputs.repo.required).toBe(false)
    expect(inputs.template.options).toEqual(['auto', 'single-page', 'footer-only'])
    const run = steps.find((s) => s.name === 'Run Gate-3 checks').run
    expect(run).toContain('--site-repo')
    expect(run).toContain('--template')
  })

  it('keeps the marker-based comment upsert', () => {
    const post = steps.find((s) => s.name === 'Post or update verdict comment').run
    expect(post).toContain("MARKER='<!-- gate3-verdict -->'")
    expect(post).toContain('--method PATCH')
  })
})
