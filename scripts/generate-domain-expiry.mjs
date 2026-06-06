#!/usr/bin/env node
/**
 * Generate public/data/domain-expiry.json (#337).
 *
 * Reads FFC-managed apex domains from docs/sites_list.csv and looks up each
 * domain's expiration date via RDAP (public, no API key). Writes a committed
 * JSON file the static /sites-list dashboard reads.
 *
 * Network failures and missing expiration events degrade to bucket "unknown".
 * Exits 0 even on partial failure so the pipeline degrades gracefully.
 */
import { writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CSV = join(__dirname, '..', 'docs', 'sites_list.csv')
const OUT = join(__dirname, '..', 'public', 'data', 'domain-expiry.json')

const CONCURRENCY = 4
const DELAY_MS = 250

function bucketFor(daysRemaining) {
  if (daysRemaining === null) return 'unknown'
  if (daysRemaining < 0) return 'expired'
  if (daysRemaining <= 30) return 'expiring30'
  if (daysRemaining <= 60) return 'expiring60'
  if (daysRemaining <= 90) return 'expiring90'
  return 'ok'
}

/**
 * Parse apex domains from the sites CSV. Columns (0-indexed) are:
 * 0 = Section, 1 = Domain, 2 = Status, ... (see update-sites-data.mjs).
 */
function readDomains() {
  const text = readFileSync(CSV, 'utf8')
  const lines = text.split('\n').slice(1) // skip header
  const domains = new Set()
  for (const line of lines) {
    if (!line.trim()) continue
    // naive CSV split is fine: domain/status never contain commas
    const cols = line.split(',')
    let domain = (cols[1] || '').trim().toLowerCase()
    const status = (cols[2] || '').trim().toLowerCase()
    if (!domain) continue
    // Strip any scheme, path, query, or port so we have a registrable domain.
    domain = domain
      .replace(/^https?:\/\//, '')
      .split('/')[0]
      .split('?')[0]
      .split(':')[0]
    if (!domain) continue
    if (['expired', 'cancelled', 'terminated', 'fraud', 'transferred away'].includes(status))
      continue
    // apex only (two labels) — RDAP is for registrable domains, not subdomains
    if (domain.split('.').length !== 2) continue
    domains.add(domain)
  }
  return [...domains].sort()
}

async function lookup(domain) {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { Accept: 'application/rdap+json' },
      redirect: 'follow',
    })
    if (!res.ok)
      return { domain, expiresAt: null, daysRemaining: null, registrar: '', bucket: 'unknown' }
    const data = await res.json()
    const event = (data.events || []).find((e) => e.eventAction === 'expiration')
    const registrarEntity = (data.entities || []).find((e) => (e.roles || []).includes('registrar'))
    let registrar = ''
    if (registrarEntity?.vcardArray) {
      const fn = registrarEntity.vcardArray[1]?.find((f) => f[0] === 'fn')
      registrar = fn?.[3] || ''
    }
    if (!event?.eventDate) {
      return { domain, expiresAt: null, daysRemaining: null, registrar, bucket: 'unknown' }
    }
    const expires = new Date(event.eventDate)
    const days = Math.round((expires.getTime() - Date.now()) / 86_400_000)
    return {
      domain,
      expiresAt: expires.toISOString().slice(0, 10),
      daysRemaining: days,
      registrar,
      bucket: bucketFor(days),
    }
  } catch (err) {
    console.warn(`RDAP failed for ${domain}: ${err.message}`)
    return { domain, expiresAt: null, daysRemaining: null, registrar: '', bucket: 'unknown' }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const domains = readDomains()
  const results = []
  for (let i = 0; i < domains.length; i += CONCURRENCY) {
    const batch = domains.slice(i, i + CONCURRENCY)
    results.push(...(await Promise.all(batch.map(lookup))))
    if (i + CONCURRENCY < domains.length) await sleep(DELAY_MS)
  }

  results.sort((a, b) => {
    if (a.daysRemaining === null) return 1
    if (b.daysRemaining === null) return -1
    return a.daysRemaining - b.daysRemaining
  })

  const summary = {
    total: results.length,
    expired: 0,
    expiring30: 0,
    expiring60: 0,
    expiring90: 0,
    ok: 0,
    unknown: 0,
  }
  for (const r of results) summary[r.bucket]++

  const out = {
    generatedAt: new Date().toISOString(),
    seed: false,
    source: 'RDAP',
    summary,
    domains: results,
  }
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
  console.log(`Wrote ${OUT} (${results.length} domains; ${summary.unknown} unknown)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(0)
})
