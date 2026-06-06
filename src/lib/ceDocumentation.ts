/**
 * FFC-issued CE documentation artifact (#358).
 *
 * Turns a volunteer's approved hours (#360/#361) into the verified record they
 * self-report to a certifying body (#356): a signed letter + an hours table,
 * formatted to satisfy what bodies ask for in an audit (date, activity, hours,
 * category, provider contact). Fully data-driven — no manual per-volunteer
 * editing.
 *
 * Format: this builds the document *model* and an audit-friendly Markdown
 * rendering (the MVP, printable/attachable). Per-body CSV export and a digital
 * badge are future formats that can reuse this same model.
 */
import type { CeBody } from '../data/ce-bodies'
import { CE_DISCLAIMER } from '../data/ce-bodies'
import { creditability, type HoursEntry } from '../data/hours-model'
import { FFC_FOUNDER_CONTACT } from '../data/legacy-wordpress-administration'
import type { CreditChannel } from '../data/ce-bodies'

export interface CeIssuer {
  org: string
  taxStatus: string
  /** EIN is kept out of source; supply at generation time or leave the note. */
  ein: string
  signerName: string
  signerRole: string
  verificationEmail: string
  verificationPhone: string
}

/** Default issuer block. EIN intentionally a placeholder — supply at runtime. */
export const FFC_ISSUER: CeIssuer = {
  org: 'Free For Charity',
  taxStatus: '501(c)(3) nonprofit organization',
  ein: '[EIN on file — contact FFC to verify]',
  signerName: FFC_FOUNDER_CONTACT.name,
  signerRole: FFC_FOUNDER_CONTACT.role,
  verificationEmail: FFC_FOUNDER_CONTACT.email,
  verificationPhone: FFC_FOUNDER_CONTACT.phone,
}

export interface CeDocumentRow {
  date: string
  activity: string
  channel: CreditChannel
  hours: number
  /** Eligible toward this body per the compliance matrix (#356). */
  eligible: boolean
  /** The category/cap note or the reason it's ineligible. */
  note: string
  approver: string
}

export interface CeDocument {
  issuer: CeIssuer
  volunteer: string
  githubHandle?: string
  body: { name: string; unitPlural: string }
  issueDate: string
  rows: CeDocumentRow[]
  /** Eligible hours per channel (raw; per-body numeric caps applied by the reader). */
  eligibleByChannel: Record<CreditChannel, number>
  totalEligibleHours: number
  disclaimer: string
}

const CHANNEL_TITLE: Record<CreditChannel, string> = {
  education: 'Training received',
  teaching: 'Training delivered',
  work: 'Domain-relevant work',
}

/**
 * Build the document model for one volunteer + one certifying body from approved
 * hours entries. Only `status: 'approved'` entries are included.
 */
export function buildCeDocument(opts: {
  volunteer: string
  githubHandle?: string
  entries: HoursEntry[]
  body: CeBody
  issuer?: CeIssuer
  now?: Date
}): CeDocument {
  const issuer = opts.issuer ?? FFC_ISSUER
  const now = opts.now ?? new Date()

  const mine = opts.entries.filter(
    (e) =>
      e.status === 'approved' &&
      (opts.githubHandle ? e.githubHandle === opts.githubHandle : e.volunteer === opts.volunteer)
  )

  const rows: CeDocumentRow[] = mine
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => {
      const c = creditability(e, opts.body)
      return {
        date: e.date,
        activity: e.activity,
        channel: e.channel,
        hours: e.rawHours,
        eligible: c.creditable,
        note: c.reason,
        approver: e.approver ?? 'FFC Program Lead',
      }
    })

  const eligibleByChannel: Record<CreditChannel, number> = { education: 0, teaching: 0, work: 0 }
  for (const r of rows) if (r.eligible) eligibleByChannel[r.channel] += r.hours
  const totalEligibleHours = Object.values(eligibleByChannel).reduce((s, n) => s + n, 0)

  return {
    issuer,
    volunteer: opts.volunteer,
    githubHandle: opts.githubHandle,
    body: { name: opts.body.name, unitPlural: opts.body.unitPlural },
    issueDate: now.toISOString().slice(0, 10),
    rows,
    eligibleByChannel,
    totalEligibleHours,
    disclaimer: CE_DISCLAIMER,
  }
}

/** Render the document as an audit-friendly Markdown letter + hours table. */
export function renderCeDocumentMarkdown(doc: CeDocument): string {
  const lines: string[] = []
  lines.push(`# Certification of Volunteer & Training Hours`)
  lines.push('')
  lines.push(`**Issued by:** ${doc.issuer.org} — ${doc.issuer.taxStatus}`)
  lines.push(`**EIN:** ${doc.issuer.ein}`)
  lines.push(`**Issue date:** ${doc.issueDate}`)
  lines.push('')
  lines.push(
    `This letter certifies that **${doc.volunteer}**${
      doc.githubHandle ? ` (GitHub: @${doc.githubHandle})` : ''
    } completed the volunteer and training activities below with ${doc.issuer.org}. ` +
      `Of these, **${doc.totalEligibleHours} hour(s)** are eligible for ${doc.body.name} ` +
      `${doc.body.unitPlural} under that body's published rules.`
  )
  lines.push('')
  lines.push('## Activities')
  lines.push('')
  lines.push('| Date | Activity | Channel | Hours | Eligible | Category / note | Verified by |')
  lines.push('| --- | --- | --- | --- | --- | --- | --- |')
  for (const r of doc.rows) {
    lines.push(
      `| ${r.date} | ${escapePipes(r.activity)} | ${CHANNEL_TITLE[r.channel]} | ${r.hours} | ${
        r.eligible ? 'Yes' : 'No'
      } | ${escapePipes(r.note)} | ${escapePipes(r.approver)} |`
    )
  }
  if (doc.rows.length === 0) {
    lines.push('| — | No approved activities yet | — | 0 | — | — | — |')
  }
  lines.push('')
  lines.push('## Eligible totals by channel')
  lines.push('')
  for (const ch of ['education', 'teaching', 'work'] as CreditChannel[]) {
    lines.push(`- **${CHANNEL_TITLE[ch]}:** ${doc.eligibleByChannel[ch]} hour(s)`)
  }
  lines.push('')
  lines.push(
    `> Note: ${doc.body.name} applies per-channel caps to these totals — see the body's official ` +
      `rules. ${doc.issuer.org} certifies the hours; it does not pre-apply the caps.`
  )
  lines.push('')
  lines.push('## Compliance disclaimer')
  lines.push('')
  lines.push(`> ${doc.disclaimer}`)
  lines.push('')
  lines.push('## Verification')
  lines.push('')
  lines.push(`${doc.issuer.signerName}, ${doc.issuer.signerRole}`)
  lines.push(`${doc.issuer.org}`)
  lines.push(`Email: ${doc.issuer.verificationEmail} · Phone: ${doc.issuer.verificationPhone}`)
  lines.push('')
  return lines.join('\n')
}

function escapePipes(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}
