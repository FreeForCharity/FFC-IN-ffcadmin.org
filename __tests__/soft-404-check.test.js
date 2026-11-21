/**
 * Unit tests for scripts/check-soft-404.mjs — the content-level complement to
 * linkinator's status-code check (refs #251, #391).
 *
 * The motivating case is pinned verbatim: on 2026-10-03 the training
 * catalogue's Google Analytics certification link returned HTTP 200 with
 * `<title>Not Found : Google</title>` and a "retired or replaced" banner, and
 * the weekly external scan called it OK. classifyPage must call that stale.
 */

let classifyPage, selectCandidates, runCheck, extractText, extractTitle, MIN_READABLE_CHARS

beforeAll(async () => {
  const mod = await import('../scripts/check-soft-404.mjs')
  classifyPage = mod.classifyPage
  selectCandidates = mod.selectCandidates
  runCheck = mod.runCheck
  extractText = mod.extractText
  extractTitle = mod.extractTitle
  MIN_READABLE_CHARS = mod.MIN_READABLE_CHARS
})

const filler = (n = 400) =>
  Array.from({ length: Math.ceil(n / 12) }, (_, i) => `paragraph ${i}`).join(' ')

/** What skillshop.exceedlms.com/student/path/508845 served on 2026-10-03. */
const SKILLSHOP_RETIRED = `<!doctype html><html><head><title>Not Found : Google</title>
<script>window.IntellumDataLayer = {"course":{"id":508845,"name":"Google Analytics Certification"}}</script>
</head><body><main><h1>Oops!</h1>
<p>This content is no longer available and may have been retired or replaced. Check out this
<a href="/">catalog</a> for the latest.</p>${filler()}</main></body></html>`

/** The page Google now points learners at. */
const GOOGLE_COURSE_INDEX = `<html><head><title>Enroll in Analytics Academy courses on Skillshop - Analytics Help</title></head>
<body><h1>Enroll in Analytics Academy courses on Skillshop</h1>
<ul><li>101: Get started using Google Analytics&nbsp;(GA)</li>
<li>102: Manage GA&nbsp;data and learn to read reports</li>
<li>201: Dive deeper into GA&nbsp;data and reports</li>
<li>301: Use GA&nbsp;with other tools and data sources</li>
<li><a href="https://skillshop.docebosaas.com/learn/courses/14810/google-analytics-certification">Google Analytics Certification</a></li></ul>
${filler()}</body></html>`

/** A Docebo course page before its JavaScript runs. */
const DOCEBO_SHELL = `<html><head><title>Loading</title><script src="/app.js"></script></head>
<body><div id="root"></div><noscript>You need to enable JavaScript to run this app.</noscript></body></html>`

const COURSE_URL =
  'https://skillshop.docebosaas.com/learn/courses/14810/google-analytics-certification'
const RETIRED_URL = 'https://skillshop.exceedlms.com/student/path/508845'
const INDEX_URL = 'https://support.google.com/analytics/answer/15068052'

describe('extractText / extractTitle', () => {
  it('drops scripts, styles and markup and decodes nbsp', () => {
    expect(extractTitle(SKILLSHOP_RETIRED)).toBe('Not Found : Google')
    const text = extractText(GOOGLE_COURSE_INDEX)
    expect(text).toContain('101: Get started using Google Analytics (GA)')
    expect(text).not.toContain('<li>')
    expect(extractText(SKILLSHOP_RETIRED)).not.toContain('IntellumDataLayer')
  })

  it('strips a script whose closing tag carries whitespace or junk (CodeQL: bad HTML filtering regexp)', () => {
    for (const close of ['</script>', '</script >', '</script\t\n bar>', '</SCRIPT foo="1">']) {
      const html = `<p>keep</p><script>var secret = "no longer available"${close}<p>also keep</p>`
      const text = extractText(html)
      expect(text).toBe('keep also keep')
      expect(text).not.toContain('no longer available')
    }
    const style = '<p>a</p><style\n>.x{content:"page not found"}</style\t\n x><p>b</p>'
    expect(extractText(style)).toBe('a b')
  })

  it('decodes entities in a single pass, so an escaped entity is not double-unescaped', () => {
    // CodeQL: double unescaping. `&amp;quot;` is the literal text `&quot;`, not a quote.
    expect(extractText('a &amp;quot;b&amp;quot; c')).toBe('a &quot;b&quot; c')
    expect(extractText('x &amp; y &quot;z&quot; &#39;w&#39; &lt;b&gt;')).toBe('x & y "z" \'w\' <b>')
  })
})

describe('classifyPage', () => {
  it('calls the retired Skillshop path stale although it was served with HTTP 200', () => {
    const v = classifyPage({
      requestedUrl: RETIRED_URL,
      finalUrl: RETIRED_URL,
      status: 200,
      contentType: 'text/html; charset=utf-8',
      html: SKILLSHOP_RETIRED,
    })
    expect(v.state).toBe('stale')
    expect(v.reasons.join('\n')).toMatch(/title reads "Not Found : Google"/)
    expect(v.reasons.join('\n')).toMatch(/no longer available/)
  })

  it('detects the body phrase alone when the title is innocuous', () => {
    const html = `<html><head><title>Google Analytics Certification</title></head><body>
      <p>This content is no longer available and may have been retired or replaced.</p>${filler()}</body></html>`
    const v = classifyPage({
      requestedUrl: RETIRED_URL,
      status: 200,
      contentType: 'text/html',
      html,
    })
    expect(v.state).toBe('stale')
    expect(v.reasons).toHaveLength(1)
    expect(v.reasons[0]).toMatch(/^body says/)
  })

  it('calls the Google Cloud certification soft 404 stale (second case found by the full-site pass)', () => {
    const html = `<html><head><title></title></head><body><nav>Google Cloud Overview Solutions Products Pricing Resources</nav>
      <h1>404. Page Not Found</h1><p>Sorry, we can't find that page</p>
      <p>404 error. The requested URL /learn/certification/workspace-administrator was not found on this server.</p>
      <a href="/">Back to home</a>${filler()}</body></html>`
    const v = classifyPage({
      requestedUrl: 'https://cloud.google.com/learn/certification/workspace-administrator',
      status: 200,
      contentType: 'text/html',
      html,
    })
    expect(v.state).toBe('stale')
    expect(v.reasons[0]).toMatch(/404. Page Not Found/)
  })

  it('does not flag ordinary prose that mentions removal, 404s or retirement (false positives from the first full-site pass)', () => {
    const prose = [
      // charity site: a button, not the page, was removed
      'The run is so close to finished, please just donate directly to MS. The Paypal button has been removed.',
      // GitHub Pages docs explaining unpublishing
      'Unpublish your GitHub Pages site so that your current deployment is removed and the site is no longer available. Creating a custom 404 page for your site.',
      // a README
      'Note: GPG commit signing was previously required but has been removed. See FAILED_FEATURES.md for details.',
      // our own tools page
      'This guide lists which tools FFC requires, which it recommends, and which have been retired or replaced since the original guide was published.',
    ]
    for (const p of prose) {
      const html = `<html><head><title>Guide</title></head><body><p>${p}</p>${filler()}</body></html>`
      expect(
        classifyPage({ requestedUrl: INDEX_URL, status: 200, contentType: 'text/html', html }).state
      ).toBe('ok')
    }
    // issue titles that merely contain "404"
    for (const t of [
      'Nothing validates that a sites-list Repo URL resolves: a 404 sat in the public dataset · Issue #1044 · GitHub',
      'Conditional basePath missing: default-Pages-URL sites serve pages with 404 assets · Issue #748 · GitHub',
    ]) {
      const html = `<html><head><title>${t}</title></head><body>${filler()}</body></html>`
      expect(
        classifyPage({ requestedUrl: INDEX_URL, status: 200, contentType: 'text/html', html }).state
      ).toBe('ok')
    }
  })

  it('only searches the leading text for retirement phrases', () => {
    const deep = `<html><head><title>Long article</title></head><body>${filler(2500)}
      <p>This content is no longer available.</p></body></html>`
    expect(
      classifyPage({ requestedUrl: INDEX_URL, status: 200, contentType: 'text/html', html: deep })
        .state
    ).toBe('ok')
  })

  it('passes a healthy, readable page', () => {
    const v = classifyPage({
      requestedUrl: INDEX_URL,
      finalUrl: INDEX_URL,
      status: 200,
      contentType: 'text/html; charset=utf-8',
      html: GOOGLE_COURSE_INDEX,
    })
    expect(v).toEqual({ state: 'ok', reasons: [] })
  })

  it('enforces an expected phrase, case-insensitively, and reports its absence', () => {
    const base = {
      requestedUrl: INDEX_URL,
      status: 200,
      contentType: 'text/html',
      html: GOOGLE_COURSE_INDEX,
    }
    expect(classifyPage({ ...base, expect: 'google analytics certification' }).state).toBe('ok')
    const v = classifyPage({ ...base, expect: 'Universal Analytics' })
    expect(v.state).toBe('stale')
    expect(v.reasons[0]).toBe('expected phrase missing: "Universal Analytics"')
  })

  it('reports a client-rendered shell as unverifiable rather than ok', () => {
    const v = classifyPage({
      requestedUrl: COURSE_URL,
      finalUrl: COURSE_URL,
      status: 200,
      contentType: 'text/html',
      html: DOCEBO_SHELL,
    })
    expect(v.state).toBe('unverifiable')
    expect(v.reasons[0]).toMatch(/client-rendered/)
    expect(v.reasons[0]).toMatch(/title "Loading"/)
  })

  it('warns when a deep link lands on the site root or on another host', () => {
    const html = `<html><head><title>Vendor home</title></head><body>${filler()}</body></html>`
    const root = classifyPage({
      requestedUrl: 'https://vendor.example/docs/old-guide',
      finalUrl: 'https://vendor.example/',
      status: 200,
      contentType: 'text/html',
      html,
    })
    expect(root.state).toBe('redirected')
    expect(root.reasons[0]).toMatch(/site root/)

    const host = classifyPage({
      requestedUrl: 'https://www.volunteermatch.org/',
      finalUrl: 'https://www.idealist.org/en/volunteer',
      status: 200,
      contentType: 'text/html',
      html,
    })
    expect(host.state).toBe('redirected')
    expect(host.reasons[0]).toMatch(/another host/)
  })

  it('treats a www-only or same-host deeper redirect as ok', () => {
    const html = `<html><head><title>Guide</title></head><body>${filler()}</body></html>`
    const v = classifyPage({
      requestedUrl: 'https://vendor.example/guide',
      finalUrl: 'https://www.vendor.example/guide/',
      status: 200,
      contentType: 'text/html',
      html,
    })
    expect(v.state).toBe('ok')
  })

  it('does not try to read non-HTML resources', () => {
    const v = classifyPage({
      requestedUrl: 'https://vendor.example/brochure.pdf',
      status: 200,
      contentType: 'application/pdf',
      html: '',
    })
    expect(v).toEqual({ state: 'ok', reasons: [] })
  })

  it('leaves status-code failures to linkinator', () => {
    const v = classifyPage({
      requestedUrl: RETIRED_URL,
      status: 404,
      contentType: 'text/html',
      html: '',
    })
    expect(v.state).toBe('unverifiable')
    expect(v.reasons[0]).toBe('re-fetch returned HTTP 404')
  })

  it('needs a few hundred characters before it will vouch for a page', () => {
    expect(MIN_READABLE_CHARS).toBeGreaterThanOrEqual(100)
    const tiny = `<html><head><title>Fine</title></head><body><p>short</p></body></html>`
    expect(
      classifyPage({ requestedUrl: INDEX_URL, status: 200, contentType: 'text/html', html: tiny })
        .state
    ).toBe('unverifiable')
  })
})

describe('selectCandidates', () => {
  const report = {
    links: [
      {
        url: 'http://localhost:5000/training/',
        status: 200,
        state: 'OK',
        parent: 'http://localhost:5000/',
      },
      {
        url: RETIRED_URL,
        status: 200,
        state: 'OK',
        parent: 'http://localhost:5000/training/data-analytics/',
      },
      {
        url: RETIRED_URL,
        status: 200,
        state: 'OK',
        parent: 'http://localhost:5000/training/web-developer/',
      },
      {
        url: 'https://www.facebook.com/ffc',
        status: 0,
        state: 'SKIPPED',
        parent: 'http://localhost:5000/',
      },
      {
        url: 'https://dead.example/x',
        status: 404,
        state: 'BROKEN',
        parent: 'http://localhost:5000/',
      },
      {
        url: 'mailto:hello@example.org',
        status: 0,
        state: 'SKIPPED',
        parent: 'http://localhost:5000/',
      },
    ],
  }

  it('keeps only distinct external URLs linkinator marked OK, with every parent', () => {
    const out = selectCandidates(report)
    expect(out).toEqual([
      {
        url: RETIRED_URL,
        parents: [
          'http://localhost:5000/training/data-analytics/',
          'http://localhost:5000/training/web-developer/',
        ],
      },
    ])
  })

  it('tolerates a malformed report', () => {
    expect(selectCandidates(null)).toEqual([])
    expect(selectCandidates({ links: 'nope' })).toEqual([])
  })
})

describe('runCheck (injected fetch, no network)', () => {
  const response = (url, html, contentType = 'text/html; charset=utf-8', status = 200) => ({
    url,
    status,
    headers: { get: (k) => (k.toLowerCase() === 'content-type' ? contentType : null) },
    text: async () => html,
  })

  it('fails on the retired page, warns on the shell, and names an idle expectation', async () => {
    const report = {
      links: [
        { url: RETIRED_URL, state: 'OK', status: 200, parent: 'http://localhost:5000/a/' },
        { url: COURSE_URL, state: 'OK', status: 200, parent: 'http://localhost:5000/a/' },
        { url: INDEX_URL, state: 'OK', status: 200, parent: 'http://localhost:5000/a/' },
      ],
    }
    const pages = {
      [RETIRED_URL]: SKILLSHOP_RETIRED,
      [COURSE_URL]: DOCEBO_SHELL,
      [INDEX_URL]: GOOGLE_COURSE_INDEX,
    }
    const fetchFn = async (url) => response(url, pages[url])
    const summary = await runCheck(report, {
      fetchFn,
      expectations: {
        [INDEX_URL]: 'Google Analytics Certification',
        'https://vendor.example/no-longer-linked': 'anything',
      },
    })
    expect(summary.checked).toBe(3)
    expect(summary.stale.map((r) => r.url)).toEqual([RETIRED_URL])
    expect(summary.warnings.map((r) => [r.url, r.state])).toEqual([[COURSE_URL, 'unverifiable']])
    expect(summary.idleExpectations).toEqual(['https://vendor.example/no-longer-linked'])
  })

  it('reports a network failure as unverifiable, never as ok', async () => {
    const report = {
      links: [{ url: INDEX_URL, state: 'OK', status: 200, parent: 'http://localhost:5000/' }],
    }
    const fetchFn = async () => {
      throw new Error('ECONNRESET')
    }
    const summary = await runCheck(report, { fetchFn })
    expect(summary.stale).toEqual([])
    expect(summary.warnings).toHaveLength(1)
    expect(summary.warnings[0].reasons[0]).toBe('fetch failed: ECONNRESET')
  })
})
