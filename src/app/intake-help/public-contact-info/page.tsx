import type { Metadata } from 'next'
import Link from 'next/link'
import IntakeHelpShell from '@/components/intake-help/IntakeHelpShell'
import { getIntakeHelpPage } from '@/data/intake-help'

const page = getIntakeHelpPage('public-contact-info')!

export const metadata: Metadata = {
  title: `${page.title} — Intake Help`,
  description:
    'Email and phone options for charities, ranked, with step-by-step setup for Google Voice, Microsoft Teams Business Voice, and T-Mobile DIGITS for Business — and how contact choices affect readiness scoring.',
  keywords:
    'charity contact info, nonprofit phone number, Google Voice nonprofit, Teams business voice, T-Mobile DIGITS, org-domain email',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/public-contact-info/' },
}

export default function PublicContactInfoPage() {
  return (
    <IntakeHelpShell page={page}>
      <p>
        Public contact information builds donor trust and meets the expectations of regulators and
        charity-rating platforms. A charity with no findable way to reach it looks abandoned — or
        worse, fraudulent. FFC scores contact info per key person, so it’s worth getting right.
      </p>

      <h2>Email options, best to worst</h2>
      <ol>
        <li>
          <strong>Org-domain email</strong> (e.g. <code>president@yourcharity.org</code>) — best,
          and what FFC sets up automatically at launch. Nothing signals legitimacy like email on
          your own domain.
        </li>
        <li>
          <strong>Org-owned Gmail</strong> (e.g. <code>yourcharity@gmail.com</code>) — acceptable as
          an interim, as long as the <em>organization</em> controls the account, not an individual.
        </li>
        <li>
          <strong>Personal email</strong> — a last resort. It ties the charity to one person and
          disappears when they do.
        </li>
      </ol>

      <h2>Phone options, best to worst</h2>
      <ol>
        <li>
          <strong>Org-specific number</strong> — Google Voice for Business, Microsoft Teams Business
          Voice, T-Mobile DIGITS for Business, or a real PBX. Owned by the org, forwards to whoever
          is on duty.
        </li>
        <li>
          <strong>Personal cell</strong> — workable for a brand-new charity, but plan to move off
          it.
        </li>
        <li>
          <strong>Landline</strong> — fine but increasingly rare.
        </li>
        <li>
          <strong>No phone</strong> — scored negatively; donors expect a way to call.
        </li>
      </ol>

      <h2>Set up Google Voice with a charity-owned account</h2>
      <ol>
        <li>Create or use your organization’s Google account (not a personal one).</li>
        <li>
          Go to <code>voice.google.com</code>, choose a number in your area, and link it to the org
          account.
        </li>
        <li>Set call forwarding to the volunteer or officer currently on duty.</li>
        <li>
          Publish the number on your site and in your intake — calls and texts route to the org.
        </li>
      </ol>

      <h2>Set up Microsoft Teams Business Voice</h2>
      <ol>
        <li>
          In your Microsoft 365 nonprofit tenant, assign a <em>Teams Phone</em> license (FFC helps
          eligible charities obtain nonprofit licensing).
        </li>
        <li>Acquire or port a phone number in the Teams admin center.</li>
        <li>Assign the number to a shared “main line” resource account or a call queue.</li>
        <li>Route incoming calls to the right people via a call queue or auto-attendant.</li>
      </ol>

      <h2>Set up T-Mobile DIGITS for Business</h2>
      <ol>
        <li>From a T-Mobile for Business account, add a DIGITS line for the organization.</li>
        <li>Share the line across officers’ devices so any of them can answer.</li>
        <li>Keep the number with the org account, independent of any one person’s SIM.</li>
      </ol>

      <h2>How this affects your readiness score</h2>
      <p>
        Each required contact (org main contact, President, Secretary, Treasurer) is scored on both
        phone and email type. Org-specific numbers and org-domain email earn the most; missing
        contact info for a required role is penalized. Optional officers can only help, never hurt.
        At launch, FFC provisions org-domain email for you, so that portion of the score lifts
        automatically. See the <Link href="/roadmap/methodology">methodology page</Link> for exact
        values.
      </p>
    </IntakeHelpShell>
  )
}
