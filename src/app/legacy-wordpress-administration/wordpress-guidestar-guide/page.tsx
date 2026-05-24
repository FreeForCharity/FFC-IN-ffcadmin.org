import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-guidestar-guide'
const page = getLegacyWpAdminPageBySlug(SLUG)!

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'Candid GuideStar profile, transparency seal, Bronze Silver Gold Platinum, NTEE code, 501c3 verification, FFC onboarding',
}

interface Seal {
  id: string
  name: string
  ffcRequirement: 'minimum' | 'preferred' | 'starting' | 'optional'
  requirements: string[]
  adminNotes: string
}

const seals: Seal[] = [
  {
    id: 'bronze',
    name: 'Bronze Seal',
    ffcRequirement: 'starting',
    requirements: [
      'Mission statement',
      'Address and contact details',
      'EIN / Tax ID',
      'Leadership names and titles',
    ],
    adminNotes:
      'Confirm the EIN matches the intake record and the IRS Business Master File. Mismatches are an early sign of an incorrect entity record.',
  },
  {
    id: 'silver',
    name: 'Silver Seal',
    ffcRequirement: 'starting',
    requirements: [
      'Program names and descriptions',
      'Geographic service areas',
      'Goals and target beneficiary populations',
    ],
    adminNotes:
      'The "geographic service areas" entries feed the technology- and service-directory cross-references on freeforcharity.org. Keep them accurate.',
  },
  {
    id: 'gold',
    name: 'Gold Seal',
    ffcRequirement: 'minimum',
    requirements: [
      'IRS Form 990 (most recent year)',
      'Audited financial statements (when available)',
      'Fiscal-year financial data (revenue, expenses, assets, liabilities)',
      'Diversity, Equity, and Inclusion organizational data',
      'Board roster + IRS determination letter (FFC requirement on top of Candid baseline)',
    ],
    adminNotes:
      'This is the FFC floor for full onboarding. A charity below Gold gets routed to "complete your GuideStar Gold seal first" rather than to service-delivery scheduling.',
  },
  {
    id: 'platinum',
    name: 'Platinum Seal',
    ffcRequirement: 'preferred',
    requirements: [
      'Quantitative impact metrics (individuals served, program outcomes, performance indicators)',
      'Strategic planning documents or relevant board reports',
    ],
    adminNotes:
      'Platinum is the bar FFC itself holds (see Candid profile 9159614). Charities at Platinum receive the FFC widget treatment and a featured slot in the FFC partner directory.',
  },
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        Candid (formerly GuideStar) is the canonical public registry for US nonprofits. Every FFC
        partner charity maintains an active Candid profile, and FFC volunteer admins help them
        progress through the four transparency seals — Bronze, Silver, Gold, Platinum. This page is
        the operations-team runbook for that process.
      </p>

      <p>
        The charity-facing version of this page is{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/guidestar-guide/
        </a>{' '}
        and is written for charity staff doing the work. This page is the FFC admin&apos;s coaching
        guide — what to check, what to require, what the gotchas are.
      </p>

      <h2>FFC requirement floor</h2>
      <p>
        FFC requires <strong>at minimum the Gold seal</strong> plus board roster and IRS
        determination letter uploads before completing service delivery. Charities below Gold get
        routed back to seal completion before kickoff.
      </p>

      <p>Time budget for the charity:</p>
      <ul>
        <li>Initial run to Platinum: 2-3 hours.</li>
        <li>Annual refresh: roughly 30 minutes.</li>
      </ul>

      <h2>Part 1 &mdash; Earning the seals</h2>

      <h3>Step 0 &mdash; Claim the profile</h3>
      <ol>
        <li>
          Create a free Candid account at{' '}
          <a href="https://candid.org/" target="_blank" rel="noopener noreferrer">
            candid.org
          </a>
          .
        </li>
        <li>
          Search by EIN. If the profile already exists, current managers must add the charity&apos;s
          email as an authorized updater — coach the charity through that handoff rather than
          creating a duplicate profile.
        </li>
        <li>Verify the charity-side contact through the email confirmation Candid sends.</li>
      </ol>

      {seals.map((seal) => (
        <section key={seal.id} id={seal.id}>
          <h3>
            {seal.name} {seal.ffcRequirement === 'minimum' && <em>— FFC minimum requirement</em>}
            {seal.ffcRequirement === 'preferred' && <em>— FFC preferred level</em>}
            {seal.ffcRequirement === 'starting' && <em>— starting requirement</em>}
          </h3>
          <p>
            <strong>What the charity must supply:</strong>
          </p>
          <ul>
            {seal.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p>
            <strong>Admin notes:</strong> {seal.adminNotes}
          </p>
        </section>
      ))}

      <h2>Part 2 &mdash; Sharing the profile with FFC</h2>
      <p>
        After publishing the seal, Candid exposes three artefacts FFC needs in the intake record.
        Collect them and paste into the charity&apos;s WHMCS notes:
      </p>
      <ol>
        <li>
          <strong>Full Profile link</strong> — the authenticated view, used by FFC admins to
          double-check submissions.
        </li>
        <li>
          <strong>Public Profile link</strong> — the URL displayed on the charity&apos;s eventual
          FFC-delivered site and on the FFC directory pages.
        </li>
        <li>
          <strong>Seal Code</strong> — the embed snippet that renders the seal badge. Used on the
          charity&apos;s site footer (and FFC&apos;s own footer; see the GuideStar widget at the
          bottom of this site).
        </li>
      </ol>

      <h2>Annual refresh</h2>
      <p>
        Calendar a 30-minute slot every year — Q1 is the FFC convention. Refresh the most recent
        990, reaffirm the impact metrics, and re-publish so the seal stays current. Lapsed seals
        roll back to the previous tier publicly.
      </p>

      <h2>Cross-references</h2>
      <ul>
        <li>
          Charity validation gate that requires this seal:{' '}
          <a href="/legacy-wordpress-administration/wordpress-charity-validation/">
            wordpress-charity-validation
          </a>
          .
        </li>
        <li>
          Stage where this typically blocks delivery:{' '}
          <a href="/legacy-wordpress-administration/wordpress-service-delivery-stages/">
            wordpress-service-delivery-stages
          </a>
          .
        </li>
      </ul>
    </LeafPageShell>
  )
}
