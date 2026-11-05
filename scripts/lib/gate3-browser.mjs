/**
 * Browser half of the Gate-3 auto-validation (`scripts/gate3-validate.mjs`).
 *
 * Drives headless Chromium via Playwright to collect the raw facts behind
 * three Section-4b rows. It returns observations only — the verdict mapping,
 * console allowlist filtering and page selection live in the pure, unit-tested
 * functions of gate3-validate.mjs:
 *
 *   - 375px responsive: the home page at 375x812 — document scroll width vs
 *     innerWidth, and whether the header navigation is usable (links visible,
 *     or a visible menu toggle that reveals links when clicked);
 *   - console errors: console 'error' messages and uncaught page errors on the
 *     home page and each page picked by `selectPages` (nav-linked same-origin
 *     pages plus the template's required pages, capped);
 *   - accessibility: an axe-core scan (@axe-core/playwright) of the same pages,
 *     scoped to the top document (third-party iframes excluded — their markup
 *     belongs to the vendor, mirroring the templates' own tests/axe.spec.ts).
 *
 * Playwright and axe are imported lazily so the unit tests and the non-browser
 * checks never need a browser installed. Requires `@playwright/test` (its
 * `chromium` export) and `@axe-core/playwright`, both pinned devDependencies,
 * plus `pnpm exec playwright install --with-deps chromium`.
 */

const MOBILE_VIEWPORT = { width: 375, height: 812 }
const DESKTOP_VIEWPORT = { width: 1280, height: 900 }
const NAV_TIMEOUT_MS = 30_000
// After `load`, give hydration and late scripts a moment to log errors.
const SETTLE_MS = 1_500

const MENU_TOGGLE_SELECTOR = [
  'header button[aria-expanded]',
  'header button[aria-controls]',
  'header button[aria-label*="menu" i]',
  '[role="banner"] button[aria-expanded]',
  '[role="banner"] button[aria-label*="menu" i]',
  'button[aria-label*="menu" i]',
].join(', ')

/**
 * In-page: count visible links in the site header (or, with no header, in any
 * nav outside the footer). `extraSelector` adds a toggle's aria-controls panel.
 */
function countVisibleNavLinks(extraSelector) {
  const isVisible = (el) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'
  }
  const hasHeader = document.querySelector('header, [role="banner"]') !== null
  const scope = hasHeader ? 'header a[href], [role="banner"] a[href]' : 'nav a[href]'
  const selector = extraSelector ? `${scope}, ${extraSelector}` : scope
  const links = new Set(
    [...document.querySelectorAll(selector)].filter((a) => !a.closest('footer') && isVisible(a))
  )
  return links.size
}

/** Responsive facts for the home page at 375px. */
async function checkResponsive(browser, url) {
  const context = await browser.newContext({ viewport: MOBILE_VIEWPORT })
  try {
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS })
    await page.waitForTimeout(SETTLE_MS)
    const { scrollWidth, innerWidth } = await page.evaluate(() => {
      const el = document.scrollingElement || document.documentElement
      return { scrollWidth: el.scrollWidth, innerWidth: window.innerWidth }
    })
    const linksBefore = await page.evaluate(countVisibleNavLinks, null)

    let toggleVisible = false
    let toggleOpened = false
    const toggles = page.locator(MENU_TOGGLE_SELECTOR)
    const count = await toggles.count()
    for (let i = 0; i < count; i++) {
      const toggle = toggles.nth(i)
      if (!(await toggle.isVisible())) continue
      toggleVisible = true
      const controls = await toggle.getAttribute('aria-controls')
      try {
        await toggle.click({ timeout: 5_000 })
        await page.waitForTimeout(500)
        const extra = controls ? `[id="${controls.replace(/"/g, '')}"] a[href]` : null
        const linksAfter = await page.evaluate(countVisibleNavLinks, extra)
        toggleOpened = linksAfter > linksBefore
      } catch {
        toggleOpened = false
      }
      break
    }
    return { scrollWidth, innerWidth, linksBefore, toggleVisible, toggleOpened }
  } finally {
    await context.close()
  }
}

/** Console errors, page errors and axe violations for one page. */
async function scanPage(context, url, AxeBuilder, axeConfig) {
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error')
      consoleErrors.push({ text: msg.text(), url: msg.location()?.url || '' })
  })
  page.on('pageerror', (err) => pageErrors.push(err?.message || String(err)))
  const result = { url, status: 0, consoleErrors, pageErrors, navHrefs: [], axe: null }
  try {
    const res = await page.goto(url, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS })
    result.status = res ? res.status() : 0
    await page.waitForTimeout(SETTLE_MS)
    result.navHrefs = await page.evaluate(() =>
      [...document.querySelectorAll('header a[href], [role="banner"] a[href], nav a[href]')]
        .filter((a) => !a.closest('footer'))
        .map((a) => a.href)
    )
    try {
      const scan = await new AxeBuilder({ page })
        .exclude('iframe')
        .withTags(axeConfig.tags)
        .analyze()
      result.axe = {
        violations: scan.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.length,
        })),
      }
    } catch (err) {
      result.axe = { error: err?.message || String(err) }
    }
  } catch (err) {
    result.error = err?.message || String(err)
  } finally {
    await page.close()
  }
  return result
}

/**
 * Run every browser check against `url` (the site's final home URL).
 * `selectPages(homeUrl, navHrefs)` returns the ordered page list to scan
 * (home first); it is injected so the selection rule stays pure and tested.
 */
export async function runBrowserChecks({ url, selectPages, axe: axeConfig }) {
  const { chromium } = await import('@playwright/test')
  const { default: AxeBuilder } = await import('@axe-core/playwright')
  const browser = await chromium.launch()
  try {
    const responsive = await checkResponsive(browser, url)
    const context = await browser.newContext({ viewport: DESKTOP_VIEWPORT })
    try {
      const home = await scanPage(context, url, AxeBuilder, axeConfig)
      const pages = [home]
      for (const pageUrl of selectPages(url, home.navHrefs).slice(1)) {
        pages.push(await scanPage(context, pageUrl, AxeBuilder, axeConfig))
      }
      for (const p of pages) delete p.navHrefs // internal: only the home page's links matter
      return { responsive, pages }
    } finally {
      await context.close()
    }
  } finally {
    await browser.close()
  }
}
