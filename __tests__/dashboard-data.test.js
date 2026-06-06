/**
 * Dashboard data pipeline tests (#337).
 *
 * Validates the committed JSON matches the documented data contracts and that
 * the generator scripts and scheduled workflows are wired up.
 */
const fs = require('fs')
const path = require('path')

const dataDir = path.join(process.cwd(), 'public', 'data')

describe('CI status data contract', () => {
  const file = path.join(dataDir, 'ci-status.json')

  it('exists and is valid JSON', () => {
    expect(fs.existsSync(file)).toBe(true)
    expect(() => JSON.parse(fs.readFileSync(file, 'utf8'))).not.toThrow()
  })

  it('matches the contract shape', () => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    expect(typeof data.generatedAt).toBe('string')
    expect(typeof data.repo).toBe('string')
    expect(Array.isArray(data.workflows)).toBe(true)
    for (const wf of data.workflows) {
      expect(typeof wf.name).toBe('string')
      expect(typeof wf.status).toBe('string')
      expect('conclusion' in wf).toBe(true)
    }
  })
})

describe('Domain expiry data contract', () => {
  const file = path.join(dataDir, 'domain-expiry.json')
  const buckets = ['expired', 'expiring30', 'expiring60', 'expiring90', 'ok', 'unknown']

  it('exists and is valid JSON', () => {
    expect(fs.existsSync(file)).toBe(true)
    expect(() => JSON.parse(fs.readFileSync(file, 'utf8'))).not.toThrow()
  })

  it('matches the contract shape', () => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    expect(typeof data.generatedAt).toBe('string')
    expect(data.source).toBe('RDAP')
    expect(typeof data.summary.total).toBe('number')
    for (const b of buckets) expect(typeof data.summary[b]).toBe('number')
    expect(Array.isArray(data.domains)).toBe(true)
    for (const d of data.domains) {
      expect(typeof d.domain).toBe('string')
      expect(buckets).toContain(d.bucket)
    }
  })
})

describe('Volunteer hours data contract (#361/#362)', () => {
  const file = path.join(dataDir, 'volunteer-hours.json')
  const channels = ['education', 'teaching', 'work']

  it('exists and is valid JSON', () => {
    expect(fs.existsSync(file)).toBe(true)
    expect(() => JSON.parse(fs.readFileSync(file, 'utf8'))).not.toThrow()
  })

  it('matches the contract shape', () => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    expect(typeof data.generatedAt).toBe('string')
    expect(data.source).toBe('github-issues')
    expect(typeof data.summary.approvedCount).toBe('number')
    for (const c of channels) expect(typeof data.summary.byChannel[c]).toBe('number')
    expect(Array.isArray(data.entries)).toBe(true)
  })

  it('has an Issue Form for self-logging hours', () => {
    const tmpl = path.join(process.cwd(), '.github', 'ISSUE_TEMPLATE', 'volunteer-hours.yml')
    expect(fs.existsSync(tmpl)).toBe(true)
    const content = fs.readFileSync(tmpl, 'utf8')
    expect(content).toContain('volunteer-hours')
  })

  it('has a scheduled workflow that ingests approved issues', () => {
    const wf = fs.readFileSync(
      path.join(process.cwd(), '.github', 'workflows', 'update-volunteer-hours.yml'),
      'utf8'
    )
    expect(wf).toContain('scripts/generate-volunteer-hours.mjs')
    expect(wf).toContain('issues:')
  })
})

describe('Pipeline wiring', () => {
  it('generator scripts exist', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'scripts', 'generate-ci-status.mjs'))).toBe(true)
    expect(fs.existsSync(path.join(process.cwd(), 'scripts', 'generate-domain-expiry.mjs'))).toBe(
      true
    )
    expect(fs.existsSync(path.join(process.cwd(), 'scripts', 'generate-volunteer-hours.mjs'))).toBe(
      true
    )
  })

  it('scheduled workflows reference the generators', () => {
    const ci = fs.readFileSync(
      path.join(process.cwd(), '.github', 'workflows', 'update-ci-status.yml'),
      'utf8'
    )
    expect(ci).toContain('scripts/generate-ci-status.mjs')
    expect(ci).toContain('schedule:')

    const dom = fs.readFileSync(
      path.join(process.cwd(), '.github', 'workflows', 'update-domain-expiry.yml'),
      'utf8'
    )
    expect(dom).toContain('scripts/generate-domain-expiry.mjs')
    expect(dom).toContain('schedule:')
  })

  it('documents the data contracts', () => {
    const doc = fs.readFileSync(path.join(process.cwd(), 'docs', 'data-contracts.md'), 'utf8')
    expect(doc).toContain('ci-status.json')
    expect(doc).toContain('domain-expiry.json')
  })
})
