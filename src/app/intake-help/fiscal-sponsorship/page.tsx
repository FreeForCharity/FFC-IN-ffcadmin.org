import type { Metadata } from 'next'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('fiscal-sponsorship')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'FFC’s policy on fiscal sponsorship and franchise/affiliate charities, and how each affiliation type affects readiness scoring. A starter guide for FFC intake.',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/fiscal-sponsorship/' },
}

export default function FiscalSponsorshipPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        Fiscal sponsorship lets a project operate under another organization’s tax-exempt status.
        FFC’s scoring reflects how well each arrangement fits our mission of building{' '}
        <em>independent</em> charity capacity:
      </p>
      <ul>
        <li>
          <strong>Independent</strong> charities — best fit.
        </li>
        <li>
          <strong>Sponsored by an FFC charity recipient</strong> — neutral; a small bonus if you’re
          also pursuing your own 501(c)(3).
        </li>
        <li>
          <strong>Franchise / national affiliate</strong> (Legion posts, lodges, chapters) — modest
          penalty; an independent auxiliary 501(c)(3) is scored on its own merits.
        </li>
        <li>
          <strong>Corporate fiscal sponsors</strong> (Players Philanthropy Fund, Tides, Open
          Collective, etc.) — largest penalty, since the project isn’t building independent
          capacity.
        </li>
      </ul>
      <h2>How FFC works with fiscally sponsored projects</h2>
      <p>
        FFC works with fiscally sponsored projects <strong>through the sponsor</strong>: the
        sponsoring 501(c)(3) submits the FFC application and approves the project as officially
        theirs. That mechanic isn’t optional — the Microsoft 365 and Google Workspace nonprofit
        email grants attach to the sponsor’s 501(c)(3), so the sponsor must be the applicant of
        record for the project to receive them.
      </p>
      <p>
        Given the scoring penalty above, projects under a corporate fiscal sponsor (Tides, Open
        Collective, Players Philanthropy Fund) should talk with FFC before having their sponsor
        apply.
      </p>
      <p>
        If you’re only <em>considering</em> fiscal sponsorship, talk with FFC first — we’ll help you
        weigh independence against speed. A fuller policy explainer is forthcoming.
      </p>
    </IntakeHelpShell>
  )
}
