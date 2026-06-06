/**
 * Continuing-Education (CE) compliance matrix — single source of truth (#356).
 *
 * Maps "hours of activity → credit at a certifying body", encoding each body's
 * **published** caps and relevance rules so FFC never certifies hours a body
 * would reject. Drives the /continuing-education pillar (#357) and the per-body
 * landing pages (#363). Figures verified against official sources in 2026 —
 * re-verify at build time (rules change; ISACA changes Jan 2027).
 *
 * FFC's CE value flows through three channels, in priority order:
 *   1. Training RECEIVED (Education) — cleanest, near-uncapped almost everywhere.
 *   2. Training DELIVERED (Teaching/Mentoring) — widely credited, often weighted.
 *   3. Domain-relevant volunteer WORK — only where it passes the relevance test.
 *
 * Headline reality: generic charity volunteering does NOT convert for most
 * IT/security bodies. CompTIA credits no volunteering. Microsoft/Google/AWS have
 * no hours model at all. Only CFRE credits general volunteer service (capped).
 */

export type CreditChannel = 'education' | 'teaching' | 'work'

export type ChannelSupport = 'yes' | 'limited' | 'no'

export interface CeChannel {
  support: ChannelSupport
  /** Plain-language cap / rule for this channel at this body. */
  note: string
}

export interface CeBody {
  /** Stable id, e.g. 'isc2'. */
  slug: string
  name: string
  fullName: string
  /** Certs this body issues that the program targets. */
  certs: string[]
  /** Unit of credit, e.g. 'CPE'. */
  unit: string
  unitPlural: string
  /** Recertification cycle in years. */
  cycleYears: number
  /** Total units required per cycle (may vary by cert — kept as prose). */
  total: string
  /** Annual minimum, if the body imposes one. */
  annualMin?: string
  /** Per-channel support + caps. */
  channels: Record<CreditChannel, CeChannel>
  /** Does volunteering have to be profession/domain-relevant? */
  relevance: 'domain-relevant-only' | 'general-ok' | 'not-applicable'
  /** De-dup / once-per-content rules to carry into tracking. */
  dedupRules: string[]
  sourceUrl: string
  /** Whether FFC's hours can convert to this body at all. */
  supported: boolean
  /** Why a body is unsupported (no CE-hours model). */
  unsupportedReason?: string
  /** SEO landing page (#363); omitted for unsupported bodies. */
  landing?: {
    slug: string
    title: string
    description: string
    keywords: string
    /** Honest cost contrast to lead with. */
    costContrast: string
  }
}

export const CE_BODIES: CeBody[] = [
  {
    slug: 'isc2',
    name: 'ISC2',
    fullName: 'ISC2 (CISSP, SSCP, CC)',
    certs: ['CISSP', 'SSCP', 'CC'],
    unit: 'CPE',
    unitPlural: 'CPEs',
    cycleYears: 3,
    total: 'CISSP 120 / 3 yr (Group A min 90, Group B max 30); SSCP 60 / 3 yr; CC 45 / 1 yr',
    annualMin: 'CC requires 15 CPE/yr',
    channels: {
      education: {
        support: 'yes',
        note: 'Training received counts as Group A; the cleanest channel.',
      },
      teaching: {
        support: 'yes',
        note: 'Prep + teaching = Group A, first delivery only. Instructors of ISC2 Official Training Courses get no CPE.',
      },
      work: {
        support: 'limited',
        note: 'Security-related volunteering = Group A; generic non-security volunteering = Group B only (CC cannot use Group B).',
      },
    },
    relevance: 'domain-relevant-only',
    dedupRules: ['Teaching credited for first delivery only'],
    sourceUrl: 'https://www.isc2.org/-/media/ISC2/Certifications/CPE/ISC2-CPE-Handbook.pdf',
    supported: true,
    landing: {
      slug: 'free-cpe-credits-isc2',
      title: 'Free CPE Credits for ISC2 (CISSP, SSCP, CC) by Volunteering',
      description:
        'Earn free CPE credits toward your CISSP, SSCP, or CC by volunteering with Free For Charity — a real 501(c)(3) that certifies your security work and training hours. No training-vendor fee.',
      keywords:
        'free CPE credits CISSP, free CPE ISC2, renew CISSP without paying, CPE credits for volunteering, cybersecurity volunteer opportunities CPE, SSCP CPE, ISC2 CC CPE',
      costContrast:
        'Free volunteering and training vs. ~$2,000 for a 2-day conference to gather the same CPEs.',
    },
  },
  {
    slug: 'pmi',
    name: 'PMI',
    fullName: 'PMI (PMP, CAPM)',
    certs: ['PMP', 'CAPM'],
    unit: 'PDU',
    unitPlural: 'PDUs',
    cycleYears: 3,
    total: 'PMP 60 / 3 yr (Education min 35); CAPM 15 / 3 yr (Education min 9)',
    channels: {
      education: {
        support: 'yes',
        note: '1 PDU = 1 hour of project-management training received.',
      },
      teaching: {
        support: 'yes',
        note: '“Share/Create Knowledge” (teaching/authoring) counts under Giving Back.',
      },
      work: {
        support: 'limited',
        note: 'Giving Back max 25 PDU (PMP) / 6 (CAPM); “Working as a Practitioner” max 8 (PMP) / 2 (CAPM). Must relate to project management.',
      },
    },
    relevance: 'domain-relevant-only',
    dedupRules: ['Generic charity volunteering does not qualify — work must be PM-relevant'],
    sourceUrl:
      'https://www.pmi.org/-/media/pmi/documents/public/pdf/certifications/ccr-certification-requirements-handbook.pdf',
    supported: true,
    landing: {
      slug: 'free-pdus-pmi',
      title: 'Free PDUs for PMP & CAPM by Volunteering',
      description:
        'Earn free PDUs toward your PMP or CAPM by leading project-management work for Free For Charity — a 501(c)(3) that certifies your Giving Back and Education hours. No paid course required.',
      keywords:
        'free PDUs PMP, giving back PDUs, renew PMP without paying, volunteer project manager nonprofit, nonprofit project management PDUs, CAPM PDUs',
      costContrast:
        'Giving Back and Education PDUs at $0 vs. paid PDU bundles from training vendors.',
    },
  },
  {
    slug: 'comptia',
    name: 'CompTIA',
    fullName: 'CompTIA (A+, Network+, Security+, CySA+, …)',
    certs: ['A+', 'Network+', 'Security+', 'CySA+', 'PenTest+'],
    unit: 'CEU',
    unitPlural: 'CEUs',
    cycleYears: 3,
    total: 'Per cert: A+ 20, Network+ 30, Security+ 50, CySA+ 60, PenTest+ 60',
    channels: {
      education: {
        support: 'yes',
        note: 'Training/education received has no max — can fill the whole requirement.',
      },
      teaching: {
        support: 'yes',
        note: 'Teaching/Mentoring 1 CEU/hr; creating instructional materials 2 CEU/hr; SME workshop 1 CEU/hr (Security+ teaching capped at 20).',
      },
      work: {
        support: 'no',
        note: 'Generic volunteering does NOT count. Work experience credited separately at 3 CEU/yr.',
      },
    },
    relevance: 'domain-relevant-only',
    dedupRules: ['Same content credited once per cycle'],
    sourceUrl:
      'https://www.comptia.org/en-us/resources/ce/learn/earn-continuing-education-units-ceus/',
    supported: true,
    landing: {
      slug: 'free-ceus-comptia',
      title: 'Free CEUs for CompTIA (A+, Network+, Security+) by Volunteering',
      description:
        'Earn free CompTIA CEUs by teaching, mentoring, and completing training with Free For Charity. Note: CompTIA does not credit generic volunteering — we focus you on the channels that do count.',
      keywords:
        'free CEUs Security+, free CEUs A+, renew CompTIA without retaking exam, CompTIA CEUs volunteering, teach mentor CompTIA CEUs',
      costContrast:
        '$50/yr CE fee vs. $129–179 for CertMaster CE — earn the units with us for free.',
    },
  },
  {
    slug: 'isaca',
    name: 'ISACA',
    fullName: 'ISACA (CISA, CISM, CRISC, CGEIT)',
    certs: ['CISA', 'CISM', 'CRISC', 'CGEIT'],
    unit: 'CPE',
    unitPlural: 'CPEs',
    cycleYears: 3,
    total: '120 / 3 yr',
    annualMin: '20 CPE/yr minimum',
    channels: {
      education: { support: 'yes', note: 'Self-study and training received: no cap.' },
      teaching: {
        support: 'yes',
        note: 'Teaching/presenting: no cap; 5× presentation time credited for first delivery.',
      },
      work: {
        support: 'limited',
        note: 'Volunteering on ISACA boards/committees 1 CPE/hr (max 20/yr); mentoring max 10/yr.',
      },
    },
    relevance: 'domain-relevant-only',
    dedupRules: [
      'First delivery only for the 5× teaching multiplier',
      '2027 change: ≥90/120 must be domain-aligned; domain volunteering 60 max/cycle, non-domain 30 max/cycle',
    ],
    sourceUrl: 'https://www.isaca.org/credentialing/how-to-earn-cpe',
    supported: true,
    landing: {
      slug: 'free-cpe-credits-isaca',
      title: 'Free CPE Credits for ISACA (CISA, CISM, CRISC) by Volunteering',
      description:
        'Earn free ISACA CPEs toward CISA, CISM, CRISC, or CGEIT by teaching and doing domain-relevant work with Free For Charity. Teaching is uncapped and bonus-weighted.',
      keywords:
        'free CPE ISACA, free CPE CISA, CISM CPE volunteering, renew ISACA without paying, ISACA teaching CPE',
      costContrast: 'Uncapped teaching CPEs at $0 vs. paid ISACA training and conferences.',
    },
  },
  {
    slug: 'cfre',
    name: 'CFRE',
    fullName: 'CFRE (Certified Fund Raising Executive)',
    certs: ['CFRE'],
    unit: 'point',
    unitPlural: 'points',
    cycleYears: 3,
    total:
      '115 / 3 yr (Education category 45 pts; Professional Practice 30; Professional Performance 40)',
    channels: {
      education: { support: 'yes', note: 'Education 1 pt/hr (category max 45 pts).' },
      teaching: {
        support: 'yes',
        note: 'Teaching 2 pts/hr existing material, 3 pts/hr new material; non-fundraising education capped at 5 pts.',
      },
      work: {
        support: 'limited',
        note: 'The only body that credits general volunteer service: “service learning” max 10 pts; volunteer leadership 2 pts/yr each.',
      },
    },
    relevance: 'general-ok',
    dedupRules: ['Service-learning capped at 10 pts/cycle'],
    sourceUrl: 'https://www.cfre.org/certification/recertification/recertification-points',
    supported: true,
    landing: {
      slug: 'free-cfre-points',
      title: 'Free CFRE Points by Volunteering Your Fundraising Skills',
      description:
        'Earn free CFRE recertification points by doing pro bono fundraising and teaching with Free For Charity — the one certification that also credits general volunteer service (capped).',
      keywords:
        'free CFRE points, CFRE recertification volunteering, pro bono fundraising CFRE, renew CFRE without paying',
      costContrast:
        'Earn Education and service-learning points at $0 vs. paid CFRE webinars and courses.',
    },
  },
  {
    slug: 'giac',
    name: 'GIAC',
    fullName: 'GIAC (GSEC, GCIH, …)',
    certs: ['GSEC', 'GCIH', 'GCIA'],
    unit: 'CPE',
    unitPlural: 'CPEs',
    cycleYears: 4,
    total: '36 CPE / 4 yr',
    channels: {
      education: { support: 'yes', note: '“Other InfoSec training” received: max 18 CPE/renewal.' },
      teaching: {
        support: 'limited',
        note: 'Volunteering/Community Participation (incl. conducting training): max 12 CPE/renewal.',
      },
      work: { support: 'limited', note: 'Work experience: max 12 CPE/renewal.' },
    },
    relevance: 'domain-relevant-only',
    dedupRules: ['Community-participation channel capped at 12 CPE/renewal'],
    sourceUrl: 'https://www.giac.org/renewal/cpe-information',
    supported: true,
    landing: {
      slug: 'free-cpe-credits-giac',
      title: 'Free CPE Credits for GIAC by Volunteering',
      description:
        'Earn free GIAC CPEs by completing InfoSec training and contributing security work with Free For Charity. We map your hours to GIAC’s renewal channels and caps.',
      keywords:
        'free CPE GIAC, GIAC renewal CPE, GSEC CPE volunteering, cybersecurity volunteer CPE',
      costContrast: 'InfoSec training and community CPEs at $0 vs. paid GIAC training events.',
    },
  },
  {
    slug: 'ec-council',
    name: 'EC-Council',
    fullName: 'EC-Council (CEH / ECE)',
    certs: ['CEH'],
    unit: 'ECE credit',
    unitPlural: 'ECE credits',
    cycleYears: 3,
    total: '120 / 3 yr (40/yr)',
    channels: {
      education: {
        support: 'yes',
        note: 'Webinars/seminars 1 credit each; training received counts.',
      },
      teaching: { support: 'yes', note: 'Teaching a new course = 21 credits.' },
      work: {
        support: 'no',
        note: 'No clear generic-volunteering category — likely not eligible; verify in the ASPEN portal.',
      },
    },
    relevance: 'domain-relevant-only',
    dedupRules: ['Verify category eligibility in the ASPEN portal'],
    sourceUrl: 'https://cert.eccouncil.org/ece-policy.html',
    supported: true,
    landing: {
      slug: 'free-ece-credits-ec-council',
      title: 'Free ECE Credits for EC-Council (CEH) by Volunteering',
      description:
        'Earn free EC-Council ECE credits toward your CEH by teaching and completing training with Free For Charity. Teaching a new course is worth 21 credits.',
      keywords:
        'free ECE credits CEH, EC-Council ECE volunteering, renew CEH without paying, CEH continuing education',
      costContrast: 'Teaching and training credits at $0 vs. paid EC-Council courseware.',
    },
  },
  // --- Explicitly NOT supported: no CE-hours model (documented so volunteers aren't misled) ---
  {
    slug: 'microsoft',
    name: 'Microsoft',
    fullName: 'Microsoft Certifications',
    certs: ['MS-900', 'AZ-900', 'and role-based certs'],
    unit: 'n/a',
    unitPlural: 'n/a',
    cycleYears: 1,
    total: 'Renewed by a free annual online assessment — no CE hours',
    channels: {
      education: { support: 'no', note: 'No CE-hours model.' },
      teaching: { support: 'no', note: 'No CE-hours model.' },
      work: { support: 'no', note: 'No CE-hours model.' },
    },
    relevance: 'not-applicable',
    dedupRules: [],
    sourceUrl:
      'https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification',
    supported: false,
    unsupportedReason:
      'Microsoft renews certifications via a free annual assessment, not CE hours.',
  },
  {
    slug: 'google-cloud',
    name: 'Google Cloud',
    fullName: 'Google Cloud Certifications',
    certs: ['Associate', 'Professional'],
    unit: 'n/a',
    unitPlural: 'n/a',
    cycleYears: 2,
    total: 'Renewed by retaking the exam — no CE hours',
    channels: {
      education: { support: 'no', note: 'No CE-hours model.' },
      teaching: { support: 'no', note: 'No CE-hours model.' },
      work: { support: 'no', note: 'No CE-hours model.' },
    },
    relevance: 'not-applicable',
    dedupRules: [],
    sourceUrl: 'https://support.google.com/cloud-certification/answer/9907853',
    supported: false,
    unsupportedReason:
      'Google Cloud recertification is by re-exam (Pro 2 yr, Assoc 3 yr), not CE hours.',
  },
  {
    slug: 'aws',
    name: 'AWS',
    fullName: 'AWS Certifications',
    certs: ['Foundational', 'Associate', 'Professional', 'Specialty'],
    unit: 'n/a',
    unitPlural: 'n/a',
    cycleYears: 3,
    total: 'Renewed by retaking the exam — explicitly does not accept CE credits',
    channels: {
      education: { support: 'no', note: 'No CE-hours model.' },
      teaching: { support: 'no', note: 'No CE-hours model.' },
      work: { support: 'no', note: 'No CE-hours model.' },
    },
    relevance: 'not-applicable',
    dedupRules: [],
    sourceUrl: 'https://aws.amazon.com/certification/recertification/',
    supported: false,
    unsupportedReason:
      'AWS recertification is by re-exam and explicitly does not accept CE credits.',
  },
]

/** The compliance disclaimer shipped on every CE page (verbatim from the epic). */
export const CE_DISCLAIMER =
  'FFC certifies the hours and activities a volunteer completed. Acceptance of those hours toward any certification is governed solely by the issuing body’s current rules, which the volunteer is responsible for following. FFC is not an accredited/approved CE provider for these bodies.'

export const CHANNEL_LABELS: Record<CreditChannel, string> = {
  education: 'Training received',
  teaching: 'Training delivered',
  work: 'Domain-relevant work',
}

export const SUPPORTED_CE_BODIES = CE_BODIES.filter((b) => b.supported)
export const UNSUPPORTED_CE_BODIES = CE_BODIES.filter((b) => !b.supported)

/** Bodies that have a per-body SEO landing page (#363). */
export const CE_LANDING_BODIES = CE_BODIES.filter((b) => b.landing)

export function getCeBody(slug: string): CeBody | undefined {
  return CE_BODIES.find((b) => b.slug === slug)
}

export function getCeBodyByLandingSlug(slug: string): CeBody | undefined {
  return CE_BODIES.find((b) => b.landing?.slug === slug)
}
