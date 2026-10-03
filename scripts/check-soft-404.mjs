#!/usr/bin/env node
/**
 * Soft-404 / content-drift check for external links (refs #251, #391).
 *
 * linkinator decides "broken" by HTTP status, so a vendor that retires a page
 * but keeps answering 200 — a "soft 404" — passes the weekly external scan
 * forever. Measured 2026-10-03: the training catalogue's Google Analytics
 * certification link (skillshop.exceedlms.com/student/path/508845) returned
 * HTTP 200 with `<title>Not Found : Google</title>` and the body "This content
 * is no longer available and may have been retired or replaced", and the scan
 * reported it OK. The courses had moved to a new Skillshop host.
 *
 * This script reads linkinator's JSON report, re-fetches every EXTERNAL URL it
 * marked OK, and classifies the page *content*, not its status code:
 *
 *   stale        title or body carries a retirement / not-found phrase, or a
 *                phrase .link-expectations.json says must be present is
 *                missing                                  -> exit 1 (fails CI)
 *   redirected   landed on a different host, or on a site root when a deeper
 *                path was requested                        -> warning
 *   unverifiable JS-rendered shell with no readable text (e.g. a Docebo
 *                course page titled "Loading")             -> warning
 *   ok           readable page, no retirement signal
 *
 * Warnings are printed so a human triaging the weekly run can see what the
 * check could NOT judge — a silent "ok" over an empty shell would be the same
 * false green this script exists to remove.
 *
 * .link-expectations.json maps a URL to a phrase the live page must contain.
 * Use it for pages whose *content* matters, not just their existence (a
 * course index must still list the certification). An expectation whose URL
 * is not in the report is reported too: an absence proves nothing about a
 * check that had no input.
 *
 * Usage:
 *   node scripts/check-soft-404.mjs link-report.json [--out soft-404-report.json]
 *
 * The classifier (classifyPage) and the report filter (selectCandidates) are
 * pure and unit-tested in __tests__/soft-404-check.test.js. Only main() does
 * network I/O.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
export const EXPECTATIONS_FILE = join(SCRIPT_DIR, '..', '.link-expectations.json')

export const REQUEST_TIMEOUT_MS = 15_000
export const CONCURRENCY = 6
const USER_AGENT =
  'Mozilla/5.0 (compatible; ffcadmin-soft-404-check/1.0; +https://github.com/FreeForCharity/FFC-IN-ffcadmin.org)'

/** Title text that means "this is an error page", whatever the status code. */
export const STALE_TITLE_PATTERNS = [
  /\bnot found\b/i,
  /\b404\b/,
  /no longer available/i,
  /page (?:does not|doesn't|cannot be|can't be) (?:exist|found)/i,
]

/**
 * Body phrases vendors use when a page is retired but still served with 200.
 * The first entry is the exact Skillshop wording that motivated this check.
 */
export const STALE_BODY_PATTERNS = [
  /no longer available/i,
  /(?:has been|was|may have been) (?:retired|discontinued|removed)/i,
  /retired or replaced/i,
  /page (?:you(?:'re| are) looking for|you requested) (?:does not|doesn't|cannot be|can't be|could not be|couldn't be|is no longer|no longer) (?:exist|found|available|exists)/i,
  /(?:this )?(?:page|content) has (?:been )?moved/i,
  /\bpage not found\b/i,
  /sorry,? we (?:couldn't|could not|can't) find/i,
]

/** Titles a client-rendered shell shows before its JS runs. */
const SHELL_TITLE_PATTERNS = [/^\s*$/, /^\s*loading(?:\.{3}|…)?\s*$/i]
/** Below this many characters of visible text, a page cannot be judged. */
export const MIN_READABLE_CHARS = 200

/** Strip markup to visible text. Pure. */
export function extractText(html) {
  return String(html ?? '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&rsquo;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(String(html ?? ''))
  return m ? extractText(m[1]) : ''
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

function pathOf(url) {
  try {
    return new URL(url).pathname
  } catch {
    return ''
  }
}

/** A snippet around the first match, for the human reading the report. */
function snippetAround(text, match, radius = 80) {
  const i = text.indexOf(match)
  if (i < 0) return match
  return text.slice(Math.max(0, i - radius), i + match.length + radius).trim()
}

/**
 * Classify one fetched page. Pure — takes what the fetch observed.
 *
 * @param {object} page
 * @param {string} page.requestedUrl   URL as it appears on the site
 * @param {string} [page.finalUrl]     URL after redirects (fetch's res.url)
 * @param {number} [page.status]       HTTP status of the final response
 * @param {string} [page.contentType]  Content-Type header
 * @param {string} [page.html]         response body
 * @param {string} [page.expect]       phrase the body must contain
 * @returns {{ state: 'ok'|'stale'|'redirected'|'unverifiable', reasons: string[] }}
 */
export function classifyPage({ requestedUrl, finalUrl, status, contentType, html, expect }) {
  const reasons = []

  if (typeof status === 'number' && (status < 200 || status >= 400)) {
    // linkinator owns status-code failures; report but do not duplicate them.
    return { state: 'unverifiable', reasons: [`re-fetch returned HTTP ${status}`] }
  }

  const type = String(contentType ?? '').toLowerCase()
  if (type && !/html|xml|text\/plain/.test(type)) {
    // PDFs, images, feeds: nothing to read for retirement text.
    return { state: 'ok', reasons: [] }
  }

  const title = extractTitle(html)
  const text = extractText(html)

  for (const re of STALE_TITLE_PATTERNS) {
    if (re.test(title)) {
      reasons.push(`title reads "${title}"`)
      break
    }
  }
  for (const re of STALE_BODY_PATTERNS) {
    const m = re.exec(text)
    if (m) {
      reasons.push(`body says "…${snippetAround(text, m[0])}…"`)
      break
    }
  }
  if (expect && !text.toLowerCase().includes(String(expect).toLowerCase())) {
    reasons.push(`expected phrase missing: "${expect}"`)
  }
  if (reasons.length) return { state: 'stale', reasons }

  const isShell = SHELL_TITLE_PATTERNS.some((re) => re.test(title))
  if (text.length < MIN_READABLE_CHARS || (isShell && text.length < MIN_READABLE_CHARS * 5)) {
    return {
      state: 'unverifiable',
      reasons: [
        `only ${text.length} chars of readable text (title "${title || '—'}"); page is probably client-rendered`,
      ],
    }
  }

  if (finalUrl && finalUrl !== requestedUrl) {
    const fromHost = hostOf(requestedUrl)
    const toHost = hostOf(finalUrl)
    if (fromHost && toHost && fromHost !== toHost) {
      reasons.push(`redirected to another host: ${finalUrl}`)
    } else if (pathOf(requestedUrl).replace(/\/+$/, '') !== '' && pathOf(finalUrl) === '/') {
      reasons.push(`redirected to the site root: ${finalUrl}`)
    }
    if (reasons.length) return { state: 'redirected', reasons }
  }

  return { state: 'ok', reasons: [] }
}

/**
 * From a linkinator JSON report, the distinct external URLs it marked OK,
 * each with the pages that link to it. Internal links are served from
 * localhost by linkinator; skipped and broken ones are someone else's job.
 */
export function selectCandidates(report) {
  const links = Array.isArray(report?.links) ? report.links : []
  const byUrl = new Map()
  for (const link of links) {
    const url = String(link?.url ?? '')
    if (link?.state !== 'OK') continue
    if (!/^https?:\/\//i.test(url)) continue
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(url)) continue
    const entry = byUrl.get(url) ?? { url, parents: new Set() }
    if (link.parent) entry.parents.add(String(link.parent))
    byUrl.set(url, entry)
  }
  return [...byUrl.values()]
    .map((e) => ({ url: e.url, parents: [...e.parents].sort() }))
    .sort((a, b) => a.url.localeCompare(b.url))
}

export function loadExpectations(file = EXPECTATIONS_FILE) {
  if (!existsSync(file)) return {}
  const raw = JSON.parse(readFileSync(file, 'utf8'))
  const out = {}
  for (const [url, phrase] of Object.entries(raw)) {
    if (url.startsWith('$') || url.startsWith('_')) continue // "$schema" / "_comment" keys
    if (typeof phrase === 'string' && phrase.trim()) out[url] = phrase.trim()
  }
  return out
}

async function fetchPage(url, fetchFn = fetch) {
  try {
    const res = await fetchFn(url, {
      redirect: 'follow',
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,*/*;q=0.8' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    const contentType = res.headers.get('content-type') ?? ''
    const html = /html|xml|text\/plain/i.test(contentType) ? await res.text() : ''
    return { finalUrl: res.url || url, status: res.status, contentType, html }
  } catch (err) {
    return { error: err?.message ?? String(err) }
  }
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

/** Run the check over a report. Injectable fetch for tests. */
export async function runCheck(report, { expectations = {}, fetchFn = fetch } = {}) {
  const candidates = selectCandidates(report)
  const seen = new Set(candidates.map((c) => c.url))

  const results = await mapLimit(candidates, CONCURRENCY, async ({ url, parents }) => {
    const page = await fetchPage(url, fetchFn)
    if (page.error) {
      return { url, parents, state: 'unverifiable', reasons: [`fetch failed: ${page.error}`] }
    }
    const verdict = classifyPage({ requestedUrl: url, expect: expectations[url], ...page })
    return { url, parents, finalUrl: page.finalUrl, ...verdict }
  })

  const idleExpectations = Object.keys(expectations).filter((u) => !seen.has(u))
  return {
    checked: candidates.length,
    stale: results.filter((r) => r.state === 'stale'),
    warnings: results.filter((r) => r.state === 'redirected' || r.state === 'unverifiable'),
    idleExpectations,
    results,
  }
}

function printSummary(summary) {
  console.log('=== Soft-404 content check ===')
  console.log(`External URLs re-read: ${summary.checked}`)
  console.log(`Stale (served 200, content retired/missing): ${summary.stale.length}`)
  console.log(`Warnings (redirected / unverifiable): ${summary.warnings.length}`)
  if (summary.stale.length) {
    console.log('\n=== Stale URLs ===')
    for (const r of summary.stale) {
      console.log(`  [STALE] ${r.url}`)
      for (const reason of r.reasons) console.log(`          ${reason}`)
      for (const p of r.parents) console.log(`          linked from ${p}`)
    }
  }
  if (summary.warnings.length) {
    console.log('\n=== Could not fully verify ===')
    for (const r of summary.warnings) {
      console.log(`  [${r.state.toUpperCase()}] ${r.url}`)
      for (const reason of r.reasons) console.log(`          ${reason}`)
    }
  }
  if (summary.idleExpectations.length) {
    console.log('\n=== Expectations with no matching link in the report ===')
    for (const u of summary.idleExpectations) {
      console.log(`  [IDLE] ${u} — nothing on the built site links here any more; prune or fix`)
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const reportPath = args.find((a) => !a.startsWith('--'))
  const outIdx = args.indexOf('--out')
  const outPath = outIdx >= 0 ? args[outIdx + 1] : null
  if (!reportPath) {
    console.error('usage: node scripts/check-soft-404.mjs <linkinator-report.json> [--out <file>]')
    process.exit(2)
  }
  const report = JSON.parse(readFileSync(reportPath, 'utf8'))
  const expectations = loadExpectations()
  const summary = await runCheck(report, { expectations })
  printSummary(summary)
  if (outPath) {
    writeFileSync(
      outPath,
      JSON.stringify({ generatedAt: new Date().toISOString(), ...summary }, null, 2)
    )
  }
  process.exit(summary.stale.length ? 1 : 0)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(`soft-404 check crashed: ${err?.stack ?? err}`)
    process.exit(2)
  })
}
