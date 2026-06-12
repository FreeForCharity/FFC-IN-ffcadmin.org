/**
 * Validates the build-time alerts feed generator (#427): runs the script and
 * checks the shape and consistency of public/data/sites-alerts.json.
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const OUT = path.join(process.cwd(), 'public', 'data', 'sites-alerts.json')

describe('generate-sites-alerts.mjs (#427)', () => {
  let feed

  beforeAll(() => {
    execSync('node scripts/generate-sites-alerts.mjs', { cwd: process.cwd() })
    feed = JSON.parse(fs.readFileSync(OUT, 'utf8'))
  })

  it('writes a parseable feed with a fresh timestamp', () => {
    expect(Number.isNaN(Date.parse(feed.generatedAt))).toBe(false)
    expect(Date.now() - Date.parse(feed.generatedAt)).toBeLessThan(60_000)
  })

  it('every alert has type, severity, domain, and detail', () => {
    expect(Array.isArray(feed.alerts)).toBe(true)
    for (const a of feed.alerts) {
      expect(['health', 'expiry']).toContain(a.type)
      expect(['high', 'medium', 'low']).toContain(a.severity)
      expect(a.domain).toBeTruthy()
      expect(a.detail).toBeTruthy()
    }
  })

  it('summary counts match the alerts array', () => {
    expect(feed.summary.total).toBe(feed.alerts.length)
    const health = feed.alerts.filter((a) => a.type === 'health').length
    expect(feed.summary.health || 0).toBe(health)
  })

  it('never alerts on inactive/archived (tier 6) domains', () => {
    const { parse } = require('csv-parse/sync')
    const csv = fs.readFileSync(path.join(process.cwd(), 'docs', 'sites_list.csv'), 'utf8')
    const rows = parse(csv, { columns: true, skip_empty_lines: true, trim: true })
    const healthDomains = feed.alerts.filter((a) => a.type === 'health').map((a) => a.domain)
    for (const row of rows) {
      if ((row['Work Tier'] || '').startsWith('6')) {
        expect(healthDomains).not.toContain(row['Domain'])
      }
    }
  })
})
