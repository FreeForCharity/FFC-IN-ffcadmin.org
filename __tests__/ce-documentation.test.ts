import { buildCeDocument, renderCeDocumentMarkdown, FFC_ISSUER } from '../src/lib/ceDocumentation'
import { getCeBody } from '../src/data/ce-bodies'
import type { HoursEntry } from '../src/data/hours-model'

const entries: HoursEntry[] = [
  {
    id: '1',
    volunteer: 'Jane Doe',
    githubHandle: 'jane',
    date: '2026-05-02',
    activityType: 'training-received',
    activity: 'Completed Security & Trust module',
    channel: 'education',
    rawHours: 3,
    source: 'self-log',
    domainRelevant: true,
    dedupKey: 'jane|2026-05-02|training-received|',
    approver: 'Program Lead',
    status: 'approved',
  },
  {
    id: '2',
    volunteer: 'Jane Doe',
    githubHandle: 'jane',
    date: '2026-05-05',
    activityType: 'pull_request',
    activity: 'Secured a charity site',
    channel: 'work',
    rawHours: 4,
    source: 'github',
    domainRelevant: true,
    dedupKey: 'jane|2026-05-05|pull_request|x',
    approver: 'Program Lead',
    status: 'approved',
  },
  {
    id: '3',
    volunteer: 'Jane Doe',
    githubHandle: 'jane',
    date: '2026-05-06',
    activityType: 'design',
    activity: 'Pending entry should be excluded',
    channel: 'work',
    rawHours: 9,
    source: 'self-log',
    domainRelevant: true,
    dedupKey: 'jane|2026-05-06|design|',
    approver: 'Program Lead',
    status: 'pending',
  },
]

describe('CE documentation artifact (#358)', () => {
  it('includes only approved entries for the named volunteer', () => {
    const doc = buildCeDocument({
      volunteer: 'Jane Doe',
      githubHandle: 'jane',
      entries,
      body: getCeBody('isc2')!,
      now: new Date('2026-06-06T00:00:00Z'),
    })
    expect(doc.rows).toHaveLength(2) // pending excluded
    expect(doc.issueDate).toBe('2026-06-06')
  })

  it('applies per-body eligibility (ISC2 credits domain work; CompTIA does not)', () => {
    const isc2Doc = buildCeDocument({
      volunteer: 'Jane Doe',
      githubHandle: 'jane',
      entries,
      body: getCeBody('isc2')!,
    })
    // education 3 + work 4 both eligible for ISC2
    expect(isc2Doc.totalEligibleHours).toBe(7)

    const comptiaDoc = buildCeDocument({
      volunteer: 'Jane Doe',
      githubHandle: 'jane',
      entries,
      body: getCeBody('comptia')!,
    })
    // CompTIA: education eligible (3), work not (0)
    expect(comptiaDoc.eligibleByChannel.work).toBe(0)
    expect(comptiaDoc.eligibleByChannel.education).toBe(3)
  })

  it('renders an audit-friendly letter with issuer, disclaimer, and verification', () => {
    const doc = buildCeDocument({
      volunteer: 'Jane Doe',
      githubHandle: 'jane',
      entries,
      body: getCeBody('isc2')!,
    })
    const md = renderCeDocumentMarkdown(doc)
    expect(md).toContain('Certification of Volunteer & Training Hours')
    expect(md).toContain(FFC_ISSUER.org)
    expect(md).toContain('501(c)(3)')
    expect(md).toContain('not an accredited/approved CE provider')
    expect(md).toContain('Verification')
    expect(md).toContain('Completed Security & Trust module')
  })

  it('allows the EIN to be supplied at generation time', () => {
    const doc = buildCeDocument({
      volunteer: 'Jane Doe',
      githubHandle: 'jane',
      entries,
      body: getCeBody('isc2')!,
      issuer: { ...FFC_ISSUER, ein: '12-3456789' },
    })
    expect(renderCeDocumentMarkdown(doc)).toContain('12-3456789')
  })
})
