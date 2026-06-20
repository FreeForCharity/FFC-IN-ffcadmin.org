import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  MISSION_POINTS,
  CHARITY_STAGE_POINTS,
  AFFILIATION_POINTS,
  REVENUE_FORM_POINTS,
  TRAJECTORY_POINTS,
  FUNDING_MODEL_POINTS,
  PHONE_POINTS,
  EMAIL_POINTS,
  ADDRESS_POINTS,
  BOARD_REQUIRED,
  BOARD_OPTIONAL,
  CANDID_PROFILE_URL,
  CANDID_DIRECT_LINK,
  CANDID_SEAL_POINTS,
  EXISTING_WEBSITE_POINTS,
  INTEGRATION_PLATFORMS,
  POLICY_PAGES,
  INTEGRATION_POINTS_EACH,
  POLICY_POINTS_EACH,
  TIER_BOUNDARIES,
} from '@/lib/readiness/config'

export const metadata: Metadata = {
  title: 'Readiness Scoring Methodology',
  description:
    'Exactly how Free For Charity computes a charity’s readiness score and sort order on the public roadmap — every category, how to improve, decay rules, and tier labels. Transparent by design.',
  keywords:
    'FFC readiness score, charity scoring methodology, nonprofit readiness, roadmap sort order, transparency',
  alternates: { canonical: 'https://ffcadmin.org/roadmap/methodology/' },
}

function fmt(points: number): string {
  return points > 0 ? `+${points}` : `${points}`
}

function PointTable({ rows }: { rows: { label: string; points: number }[] }) {
  return (
    <table className="mt-3 w-full border-collapse text-sm">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-gray-100">
            <td className="py-1.5 pr-4 text-gray-700">{row.label}</td>
            <td className="py-1.5 text-right font-mono font-medium text-gray-900">
              {fmt(row.points)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Category({
  title,
  improve,
  rows,
}: {
  title: string
  improve?: string
  rows: { label: string; points: number }[]
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <PointTable rows={rows} />
      {improve && <p className="mt-3 text-sm text-gray-500">How to improve: {improve}</p>}
    </section>
  )
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Roadmap', href: '/roadmap' },
          { label: 'Methodology' },
        ]}
      />

      <div className="bg-ffc-gradient-teal text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold md:text-4xl">Readiness scoring methodology</h1>
          <p className="mt-3 max-w-2xl text-lg text-teal-50">
            We’re not arbitrary about who FFC helps or in what order. Every charity gets a readiness
            score from the same transparent rules — here they are in full.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-bold text-gray-900">How the queue is sorted</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-700">
            <li>
              <strong>Mission tier</strong> — essential-mission charities carry a large bonus and
              sort first.
            </li>
            <li>
              <strong>Readiness score</strong> — higher scores sort higher within a mission tier.
            </li>
            <li>
              <strong>Community votes</strong> — 👍 reactions on the issue break ties.
            </li>
            <li>
              <strong>Submission date</strong> — oldest waiting first, all else equal.
            </li>
          </ol>
          <p className="mt-3 text-sm text-gray-500">
            The score affects sort order and the tier badge — never eligibility. A charity that is
            “Just getting started” is welcome; it is simply lower in the queue.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-bold text-gray-900">Tier labels</h2>
          <PointTable
            rows={[...TIER_BOUNDARIES]
              .filter((t) => t.min !== -Infinity)
              .map((t) => ({ label: t.label, points: t.min }))}
          />
          <p className="mt-3 text-sm text-gray-500">
            Labels map from the numeric score (shown as the lower bound). Below 0 is “Just getting
            started.” We show the tier badge publicly, but not the numeric score.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <Category
            title="Mission category"
            improve="Essential missions (food, water, shelter, emergency response, disaster relief, mental-health crisis, veterans, domestic violence) carry the largest bonus."
            rows={[
              { label: 'Essential', points: MISSION_POINTS.essential },
              { label: 'General', points: MISSION_POINTS.general },
              { label: 'Niche', points: MISSION_POINTS.niche },
            ]}
          />
          <Category
            title="Charity stage"
            rows={[
              { label: 'Approved 501(c)(3)', points: CHARITY_STAGE_POINTS['501c3'] },
              { label: 'Pre-501(c)(3), pursuing', points: CHARITY_STAGE_POINTS['pre-501c3'] },
              {
                label: 'Ongoing project, not pursuing',
                points: CHARITY_STAGE_POINTS['non-pursuing'],
              },
            ]}
          />
          <Category
            title="Affiliation"
            improve="Independent charities and FFC-recipient–sponsored charities score best; corporate fiscal sponsorship is penalized. See /intake-help/fiscal-sponsorship."
            rows={[
              { label: 'Independent', points: AFFILIATION_POINTS.independent },
              { label: 'FFC-recipient sponsored', points: AFFILIATION_POINTS['ffc-sponsored'] },
              {
                label: 'FFC-sponsored + own 501(c)(3)',
                points: AFFILIATION_POINTS['ffc-sponsored-pursuing'],
              },
              { label: 'Franchise / national affiliate', points: AFFILIATION_POINTS.franchise },
              {
                label: 'Non-FFC operating 501(c)(3)',
                points: AFFILIATION_POINTS['non-ffc-sponsored'],
              },
              {
                label: 'Corporate fiscal sponsor',
                points: AFFILIATION_POINTS['corporate-fiscal-sponsor'],
              },
            ]}
          />
          <Category
            title="Revenue & form filed"
            rows={[
              { label: 'Pre-revenue / in formation', points: REVENUE_FORM_POINTS['pre-revenue'] },
              { label: '990-N (≤ $50K)', points: REVENUE_FORM_POINTS['990-n'] },
              { label: '990-EZ ($50K–$200K)', points: REVENUE_FORM_POINTS['990-ez'] },
              { label: '990 ($200K–$500K)', points: REVENUE_FORM_POINTS['990-200k-500k'] },
              { label: '990 ($500K–$1M)', points: REVENUE_FORM_POINTS['990-500k-1m'] },
              { label: '990 ($1M–$5M)', points: REVENUE_FORM_POINTS['990-1m-5m'] },
              { label: '990 (over $5M)', points: REVENUE_FORM_POINTS['990-over-5m'] },
            ]}
          />
          <Category
            title="Trajectory (5-year)"
            rows={[
              { label: 'Plans to remain small', points: TRAJECTORY_POINTS['remain-small'] },
              { label: 'Modest growth', points: TRAJECTORY_POINTS['modest-growth'] },
              { label: 'Substantial growth', points: TRAJECTORY_POINTS['substantial-growth'] },
              { label: 'Major-grant pursuit', points: TRAJECTORY_POINTS['major-grant'] },
              { label: 'No clear trajectory', points: TRAJECTORY_POINTS.unclear },
            ]}
          />
          <Category
            title="Funding model"
            rows={[
              { label: 'Self-funded', points: FUNDING_MODEL_POINTS['self-funded'] },
              { label: 'Donations only', points: FUNDING_MODEL_POINTS['donations-only'] },
              {
                label: 'Donations + small grants',
                points: FUNDING_MODEL_POINTS['donations-small-grants'],
              },
              { label: 'Significant grants', points: FUNDING_MODEL_POINTS['significant-grants'] },
              {
                label: 'Major grant-dependent',
                points: FUNDING_MODEL_POINTS['major-grant-dependent'],
              },
              {
                label: 'Government contract primary',
                points: FUNDING_MODEL_POINTS['government-contract'],
              },
            ]}
          />
          <Category
            title="Phone (per required contact)"
            improve="An org-specific number (Google Voice, Teams, T-Mobile DIGITS, PBX) scores best. See /intake-help/public-contact-info."
            rows={[
              { label: 'No phone', points: PHONE_POINTS.none },
              { label: 'Landline', points: PHONE_POINTS.landline },
              { label: 'Personal cell', points: PHONE_POINTS['personal-cell'] },
              { label: 'Org-specific number', points: PHONE_POINTS['org-specific'] },
            ]}
          />
          <Category
            title="Email (per required contact)"
            improve="Org-domain email scores best — FFC sets these up automatically at launch."
            rows={[
              { label: 'No email', points: EMAIL_POINTS.none },
              { label: 'Personal free provider', points: EMAIL_POINTS['personal-free'] },
              { label: 'orgname@gmail.com', points: EMAIL_POINTS['org-gmail'] },
              { label: 'Org-domain email', points: EMAIL_POINTS['org-domain'] },
            ]}
          />
          <Category
            title="Mailing address (primary)"
            improve="A registered-agent service (any provider) scores highest; add more states for up to +15. See /intake-help/mailing-address."
            rows={[
              { label: 'No address', points: ADDRESS_POINTS.none },
              { label: 'Personal residence', points: ADDRESS_POINTS.personal },
              { label: 'PO box', points: ADDRESS_POINTS['po-box'] },
              { label: 'Commercial mailbox', points: ADDRESS_POINTS.commercial },
              { label: 'Real office', points: ADDRESS_POINTS.office },
              { label: 'Registered agent', points: ADDRESS_POINTS['registered-agent'] },
            ]}
          />
          <Category
            title="Board seats"
            improve="Name the three required officers (President, Secretary, Treasurer) with LinkedIn URLs. See /intake-help/board-requirements."
            rows={[
              { label: 'Required seat — missing', points: BOARD_REQUIRED.missing },
              { label: 'Required seat — named', points: BOARD_REQUIRED.named },
              { label: 'Required seat — with LinkedIn', points: BOARD_REQUIRED.linkedin },
              { label: 'Optional seat — named', points: BOARD_OPTIONAL.named },
              { label: 'Optional seat — with LinkedIn', points: BOARD_OPTIONAL.linkedin },
            ]}
          />
          <Category
            title="Candid / GuideStar (501(c)(3))"
            improve="Gold is FFC’s minimum; reach Platinum for the most points. See /intake-help/guidestar-candid."
            rows={[
              { label: 'Profile URL', points: CANDID_PROFILE_URL },
              { label: 'Direct profile link', points: CANDID_DIRECT_LINK },
              { label: 'Gold Seal', points: CANDID_SEAL_POINTS.gold },
              { label: 'Platinum Seal', points: CANDID_SEAL_POINTS.platinum },
            ]}
          />
          <Category
            title="Existing website"
            rows={[
              { label: 'None', points: EXISTING_WEBSITE_POINTS.none },
              { label: 'Placeholder / landing only', points: EXISTING_WEBSITE_POINTS.placeholder },
              { label: 'Functional with content', points: EXISTING_WEBSITE_POINTS.functional },
            ]}
          />
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-bold text-gray-900">Additive bonuses</h2>
          <p className="mt-2 text-sm text-gray-700">
            <strong>External integrations</strong> ({fmt(INTEGRATION_POINTS_EACH)} each):{' '}
            {INTEGRATION_PLATFORMS.join(', ')}.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            <strong>Policy pages</strong> ({fmt(POLICY_POINTS_EACH)} each):{' '}
            {POLICY_PAGES.join(', ')}. See{' '}
            <Link href="/intake-help/policy-pages" className="text-blue-600 hover:underline">
              policy pages
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-bold text-gray-900">Time-in-status decay</h2>
          <p className="mt-2 text-sm text-gray-700">
            Charities that submit and then stall gradually lose points (−2 per month past the
            expected window for a milestone, capped at the points originally earned). Keeping your
            issue updated as you progress avoids decay entirely. This rewards momentum without ever
            removing a charity from the queue.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-bold text-gray-900">Why we score some things negatively</h2>
          <p className="mt-2 text-sm text-gray-700">
            Negative scores aren’t judgments — they reflect where FFC’s free volunteer capacity
            creates the most marginal value (small, non-grant-funded, US-based charities). Anything
            scored down is explained here, and most can be improved with the{' '}
            <Link href="/intake-help/board-requirements" className="text-blue-600 hover:underline">
              intake-help guides
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  )
}
