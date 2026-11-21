import fs from 'fs'
import { dataRefreshedAge } from '../src/app/sites-list/sitesData'

// dataRefreshedAge() backs the "Site data refreshed …" line on /sites-list.
// It used to read the CSV's file mtime, which on CI is the checkout time, so
// every build claimed the data was fresh. It now reads the syncedAt that
// update-sites-data.yml writes, and hides the line when that is unknown.
describe('dataRefreshedAge', () => {
  const realReadFileSync = fs.readFileSync
  let meta: string | null

  beforeEach(() => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(((
      file: fs.PathOrFileDescriptor,
      ...rest: unknown[]
    ) => {
      if (String(file).endsWith('sites_list.meta.json')) {
        if (meta === null) throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
        return meta
      }
      return (realReadFileSync as (...a: unknown[]) => unknown)(file, ...rest)
    }) as typeof fs.readFileSync)
  })

  afterEach(() => jest.restoreAllMocks())

  it('reports the age of the recorded sync, not the file mtime', () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 86_400_000).toISOString()
    meta = JSON.stringify({ syncedAt: tenDaysAgo })
    expect(dataRefreshedAge()).toBe('10 days ago')
  })

  it('returns empty (line hidden) when the meta file is missing', () => {
    meta = null
    expect(dataRefreshedAge()).toBe('')
  })

  it('returns empty rather than "unknown" for a malformed timestamp', () => {
    meta = JSON.stringify({ syncedAt: 'not-a-date' })
    expect(dataRefreshedAge()).toBe('')
  })

  it('returns empty when syncedAt is absent or the file is not JSON', () => {
    meta = JSON.stringify({})
    expect(dataRefreshedAge()).toBe('')
    meta = '{ not json'
    expect(dataRefreshedAge()).toBe('')
  })
})
