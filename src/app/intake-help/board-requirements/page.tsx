import type { Metadata } from 'next'
import Link from 'next/link'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('board-requirements')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'Why a nonprofit needs at least three unrelated board officers, what donors and the IRS look for, common board pitfalls, and template language for a basic board agreement.',
  keywords:
    'nonprofit board requirements, 501(c)(3) board of directors, board officers, president secretary treasurer, board independence',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/board-requirements/' },
}

export default function BoardRequirementsPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        A real, functioning board is the single clearest signal that an organization is a genuine
        charity rather than one person’s project. FFC asks for at least the three required officers
        —<strong> President, Secretary, and Treasurer</strong> — named, with LinkedIn URLs where
        possible. Vice President and Member at Large are welcome but optional.
      </p>

      <h2>What the IRS expects</h2>
      <p>
        The IRS does not set a single magic number, but a 501(c)(3) is expected to be governed by a
        board that exercises real oversight. In practice that means at least three directors, a
        majority of whom are <strong>not related by blood, marriage, or business</strong>. A board
        made up entirely of one family, or a single person wearing every hat, undermines the
        independence that tax-exempt status assumes — and it is one of the most common reasons an
        application stalls.
      </p>

      <h2>What donors and partners look for</h2>
      <p>
        Donors, grantmakers, and platforms like Candid/GuideStar look at your board to judge
        credibility. Named directors with real professional profiles signal that the organization is
        accountable to more than its founder. This is exactly why FFC prefers a LinkedIn URL for
        each required officer: it lets a stranger verify that real, identifiable people stand behind
        the mission.
      </p>

      <h2>Common pitfalls</h2>
      <ul>
        <li>
          <strong>Single-person boards.</strong> One person as President, Secretary, and Treasurer
          is not a board. Recruit at least two more unrelated people before applying.
        </li>
        <li>
          <strong>All-family boards.</strong> A board where everyone is related raises conflict-of-
          interest and private-benefit concerns. Aim for an unrelated majority.
        </li>
        <li>
          <strong>Boards that never meet.</strong> Keep minutes for at least an annual meeting; the
          Secretary’s job is to record decisions. No paper trail looks like no governance.
        </li>
      </ul>

      <h2>Don’t have three people yet?</h2>
      <p>
        That’s common and fixable. Start with people who genuinely believe in the mission — a former
        colleague, a community leader, a professional whose work touches your cause. You are asking
        for a few hours a year of real oversight, not full-time work. If you are still recruiting,
        you can still submit your intake; your readiness score simply reflects the seats you have
        filled so far, and rises as you add officers.
      </p>

      <h2>Template: a basic board agreement</h2>
      <blockquote>
        <p>
          <em>
            I, [Name], agree to serve as [Role] of [Organization]. I will act in the organization’s
            best interest, avoid conflicts of interest, attend at least the annual board meeting,
            review the organization’s finances, and help ensure it operates lawfully and in
            furtherance of its charitable mission. I understand this is a voluntary, uncompensated
            governance role.
          </em>
        </p>
      </blockquote>

      <p>
        Once your officers are named, add their names and LinkedIn URLs to your intake issue and
        your board score updates automatically. See how board composition factors into the overall
        score on the <Link href="/roadmap/methodology">methodology page</Link>.
      </p>
    </IntakeHelpShell>
  )
}
