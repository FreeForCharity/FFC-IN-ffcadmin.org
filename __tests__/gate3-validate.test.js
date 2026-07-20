/**
 * Unit tests for the Gate-3 auto-validation checks (`scripts/gate3-validate.mjs`).
 *
 * Exercises every check function with a mocked `fetch` (no network) and locks
 * in the verdict-table contract: automated Section-4b items report PASS/FAIL,
 * human-judgment items always stay MANUAL, and the "Live site:" extraction
 * matches the roadmap generator's marker format.
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
  buildVerdictTable

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

describe('verdict table (Section-4b mapping)', () => {
  const fast = { pacingMs: 0 }
  const goodFetch = (finalUrl) =>
    jest.fn(async (url, init = {}) =>
      init.method === 'HEAD'
        ? mockResponse({ status: 200, url })
        : mockResponse({ status: 200, url: finalUrl, body: GOOD_HTML })
    )

  it('marks automated items PASS and human-judgment items MANUAL on a healthy staging site', async () => {
    const url = 'https://freeforcharity.github.io/FFC-EX-x/'
    const results = await runChecks(url, goodFetch(url), fast)
    const rows = buildVerdictRows(results)
    const byItem = Object.fromEntries(rows.map((r) => [r.item, r.status]))

    expect(byItem["CI green on the charity's FFC-EX repo"]).toBe('MANUAL')
    expect(byItem['Site loads at its GitHub Pages URL (HTTP 200, no redirect loops)']).toBe('PASS')
    expect(byItem['FFC-standard footer present and populated']).toBe('PASS')
    expect(byItem['All required sections/pages present per the chosen template']).toBe('MANUAL')
    expect(byItem['Mobile responsive (spot-check at 375px)']).toBe('PASS')
    expect(byItem['No browser console errors on any page']).toBe('MANUAL')
    expect(byItem['Accessibility pass (axe clean or Lighthouse a11y ≥ 90)']).toBe('MANUAL')
    expect(byItem['Content reviewed and approved by the charity']).toBe('MANUAL')
    expect(byItem['basePath sanity (root-relative asset refs resolve)']).toBe('PASS')
  })

  it('FAILS the site-loads row on a custom domain (Gate 3 validates the staging URL)', async () => {
    // A reachable custom domain is the wrong-URL case this check exists for:
    // Gate 3 validates the github.io STAGING URL; the custom domain is Gate 4.
    const url = 'https://examplecharity.org/'
    const results = await runChecks(url, goodFetch(url), fast)
    const row = buildVerdictRows(results).find((r) => r.item.startsWith('Site loads'))
    expect(row.status).toBe('FAIL')
    expect(row.detail).toMatch(/custom domain/)
    expect(row.detail).toMatch(/Gate 3 validates/)
  })

  it('fails dependent rows when the page does not load', async () => {
    const fetchFn = jest.fn(async () => mockResponse({ status: 404 }))
    const results = await runChecks('https://o.github.io/missing/', fetchFn, fast)
    const rows = buildVerdictRows(results)
    for (const item of ['Site loads', 'FFC-standard footer', 'Mobile responsive', 'basePath']) {
      expect(rows.find((r) => r.item.startsWith(item)).status).toBe('FAIL')
    }
    // MANUAL items stay MANUAL regardless of load failures.
    expect(rows.find((r) => r.item.startsWith('Content reviewed')).status).toBe('MANUAL')
  })

  it('WARNS (not FAILS) the basePath row when assets are unreachable during the check', async () => {
    const fetchFn = jest.fn(async (url, init = {}) => {
      if (init.method === 'HEAD' || init.headers?.range) throw new TypeError('fetch failed')
      return mockResponse({
        status: 200,
        url,
        body: `${GOOD_HTML}<img src="/logo.png">`,
      })
    })
    const results = await runChecks('https://o.github.io/FFC-EX-x/', fetchFn, fast)
    const row = buildVerdictRows(results).find((r) => r.item.startsWith('basePath'))
    expect(row.status).toBe('WARN')
    expect(row.detail).toMatch(/unreachable during check — transient\?/)
    const md = buildVerdictTable(results)
    expect(md).not.toMatch(/automated check\(s\) FAILED/)
    expect(md).toMatch(/1 check\(s\) WARN/)
  })

  it('renders a markdown table with a failure summary line', async () => {
    const fetchFn = jest.fn(async (url, init = {}) =>
      init.method === 'HEAD'
        ? mockResponse({ status: 200, url })
        : mockResponse({ status: 200, url, body: '<html><body>no footer</body></html>' })
    )
    const results = await runChecks('https://o.github.io/FFC-EX-x/', fetchFn, fast)
    const md = buildVerdictTable(results, { issueNumber: 123 })
    expect(md).toContain('## Gate-3 auto-validation')
    expect(md).toContain('work order #123')
    expect(md).toContain('| Gate-3 item | Status | Detail |')
    expect(md).toMatch(/automated check\(s\) FAILED/)
    expect(md).toContain('Missing: "Free For Charity" text, freeforcharity.org link, EIN')
  })

  it('renders the all-clear summary when every automated check passes', async () => {
    const url = 'https://freeforcharity.github.io/FFC-EX-x/'
    const results = await runChecks(url, goodFetch(url), fast)
    const md = buildVerdictTable(results)
    expect(md).toContain('**All automated checks passed.**')
    expect(md).toMatch(/\d+ item\(s\) remain MANUAL/)
  })
})
