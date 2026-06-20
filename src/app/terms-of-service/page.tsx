import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import PolicyCrossLinks from '@/components/PolicyCrossLinks'
import PolicyTOC from '@/components/PolicyTOC'

export const metadata: Metadata = {
  alternates: { canonical: 'https://ffcadmin.org/terms-of-service/' },
  title: 'Terms of Service',
  description:
    'Terms of Service for Free For Charity — general terms for everyone, plus sections specific to general visitors, volunteers, and supported charities (the full-stack commitment, account security, data, and AI use).',
}

// Update this date when the terms change.
const LAST_UPDATED = 'June 20, 2026'
const ORIGINAL_EFFECTIVE = 'November 20, 2024'

// Table of contents — keep in sync with the section ids below.
const TOC = [
  { n: 1, label: 'Introduction' },
  { n: 2, label: 'Who these Terms apply to' },
  { n: 3, label: 'Eligibility' },
  { n: 4, label: 'Use of Services' },
  { n: 5, label: 'Donations' },
  { n: 6, label: 'Payments' },
  { n: 7, label: 'Intellectual Property' },
  { n: 8, label: 'Privacy' },
  { n: 9, label: 'Third-Party Links' },
  { n: 10, label: 'Disclaimer of Warranties' },
  { n: 11, label: 'Limitation of Liability' },
  { n: 12, label: 'Indemnification' },
  { n: 13, label: 'Governing Law' },
  { n: 14, label: 'Changes to Terms' },
  { n: 15, label: 'Termination' },
  { n: 16, label: 'General Visitors', note: 'audience-specific' },
  { n: 17, label: 'Volunteers', note: 'audience-specific' },
  { n: 18, label: 'Supported Charities', note: 'audience-specific' },
  { n: 19, label: 'Contact Us' },
]

/**
 * Inline cross-reference to another section, rendered as a jump link. The
 * display text (children) can name a sub-section (e.g. "Section 4.2") while the
 * link targets the parent top-level section.
 */
function Ref({ n, children }: { n: number; children: ReactNode }) {
  return (
    <a href={`#section-${n}`} className="text-blue-600 hover:underline">
      {children}
    </a>
  )
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h1 className="text-3xl sm:text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-blue-100 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-8 text-gray-700">
            <p className="text-sm text-gray-600">
              These Terms have two parts. The <strong>General Terms</strong> (Sections 1–15 and 19,
              originally effective {ORIGINAL_EFFECTIVE}) apply to <strong>everyone</strong> who uses
              Free For Charity&apos;s services. The <strong>audience-specific terms</strong>{' '}
              (Sections 16–18) add terms for each role that describes you — a{' '}
              <a href="#section-16" className="text-blue-600 hover:underline">
                general visitor
              </a>
              , a{' '}
              <a href="#section-17" className="text-blue-600 hover:underline">
                volunteer
              </a>
              , or a{' '}
              <a href="#section-18" className="text-blue-600 hover:underline">
                supported charity
              </a>
              . If more than one role applies to you (for example, you volunteer for a charity FFC
              supports), the terms for <strong>each role you act in</strong> apply.
            </p>

            {/* ---- Table of contents ---- */}
            <PolicyTOC items={TOC} />

            {/* ---- General Terms ---- */}
            <section id="section-1" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to Free For Charity! These Terms of Service (&quot;Terms&quot;) govern your
                access to and use of our website, services, and platforms (collectively,
                &quot;Services&quot;), provided by Free For Charity (&quot;we,&quot; &quot;us,&quot;
                or &quot;our&quot;). By accessing or using our Services, you agree to be bound by
                these Terms. If you do not agree to these Terms, please do not use our Services.
              </p>
            </section>

            <section id="section-2" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Who these Terms apply to</h2>
              <p className="mb-4">
                The General Terms (Sections 1–15, plus Section 19 — Contact Us) apply to everyone.
                In addition, one or more of these audience sections applies to you, depending on how
                you use the Services. If more than one applies, the terms for each role apply
                together:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <a href="#section-16" className="text-blue-600 hover:underline">
                    <strong>General visitors</strong>
                  </a>{' '}
                  (Section 16) — anyone browsing our sites, reading content, or donating.
                </li>
                <li>
                  <a href="#section-17" className="text-blue-600 hover:underline">
                    <strong>Volunteers</strong>
                  </a>{' '}
                  (Section 17) — people who contribute their skills to FFC or to charity projects.
                </li>
                <li>
                  <a href="#section-18" className="text-blue-600 hover:underline">
                    <strong>Supported charities</strong>
                  </a>{' '}
                  (Section 18) — nonprofits that apply for or receive the FFC technology stack, and
                  the people acting on their behalf.
                </li>
              </ul>
            </section>

            <section id="section-3" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Eligibility</h2>
              <p>
                Our Services are available only to individuals who are at least 18 years old. By
                using our Services, you represent and warrant that you are at least 18 years of age.
              </p>
            </section>

            <section id="section-4" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Use of Services</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Account Registration</h3>
              <p className="mb-4">
                To access certain features of our Services, you may be required to register for an
                account. You agree to provide accurate, current, and complete information during the
                registration process and to update such information to keep it accurate, current,
                and complete. You are responsible for safeguarding your password and for any
                activities or actions under your account.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                4.2 Prohibited Activities
              </h3>
              <p className="mb-4">
                You agree not to use our Services for any unlawful purpose or in any way that could
                harm, disable, overburden, or impair the Services. Prohibited activities include,
                but are not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Engaging in any activity that violates any applicable law or regulation</li>
                <li>Transmitting any harmful or malicious code, viruses, or malware</li>
                <li>Interfering with or disrupting the integrity or performance of our Services</li>
                <li>Collecting or storing personal data about other users without their consent</li>
                <li>
                  Using the Services to solicit funds outside the scope of Free For Charity&apos;s
                  mission
                </li>
              </ul>
            </section>

            <section id="section-5" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Donations</h2>
              <p>
                All donations made to Free For Charity are voluntary and non-refundable. By making a
                donation, you agree to our{' '}
                <Link href="/donation-policy" className="text-blue-600 hover:underline">
                  Donation Policy
                </Link>
                , which is incorporated by reference into these Terms.
              </p>
            </section>

            <section id="section-6" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payments</h2>
              <p>
                All payments made to Free For Charity are voluntary and non-refundable. No refunds
                will be given due to the nonprofit nature of Free For Charity.
              </p>
            </section>

            <section id="section-7" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Ownership</h3>
              <p className="mb-4">
                All content, trademarks, logos, and other intellectual property included in our
                Services are the property of Free For Charity or its licensors. You agree not to
                use, reproduce, distribute, or create derivative works based on our intellectual
                property without our express written consent.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 User Content</h3>
              <p>
                By submitting content to our Services, you grant us a non-exclusive, worldwide,
                royalty-free, and transferable license to use, reproduce, distribute, prepare
                derivative works of, and display such content in connection with our Services.
                (Supported charities retain ownership of their own content — see{' '}
                <Ref n={18}>Section 18.6</Ref> — and volunteer contributions are addressed in{' '}
                <Ref n={17}>Section 17.6</Ref>.)
              </p>
            </section>

            <section id="section-8" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our{' '}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                , which describes how we collect, use, and disclose information about you.
              </p>
            </section>

            <section id="section-9" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links</h2>
              <p>
                Our Services may contain links to third-party websites or services that are not
                owned or controlled by Free For Charity. We are not responsible for the content,
                privacy policies, or practices of any third-party websites or services. You
                acknowledge and agree that Free For Charity shall not be liable for any damages or
                loss caused by or in connection with your use of any third-party websites or
                services.
              </p>
            </section>

            <section id="section-10" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Disclaimer of Warranties
              </h2>
              <p>
                Our Services are provided on an &quot;as is&quot; and &quot;as available&quot;
                basis. Free For Charity makes no representations or warranties of any kind, express
                or implied, regarding the use or the results of our Services in terms of accuracy,
                reliability, or otherwise. Free For Charity disclaims all warranties, express or
                implied, including, but not limited to, implied warranties of merchantability,
                fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section id="section-11" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <p className="mb-4">
                To the fullest extent permitted by law, Free For Charity shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or any loss of
                profits or revenues, whether incurred directly or indirectly, or any loss of data,
                use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your use of or inability to use our Services</li>
                <li>
                  Any unauthorized access to or use of our servers and/or any personal information
                  stored therein
                </li>
                <li>Any interruption or cessation of transmission to or from our Services</li>
                <li>
                  Any bugs, viruses, trojan horses, or the like that may be transmitted to or
                  through our Services by any third party
                </li>
              </ul>
            </section>

            <section id="section-12" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Free For Charity, its officers,
                directors, employees, and agents, from and against any and all claims, liabilities,
                damages, losses, and expenses, including reasonable attorneys&apos; fees, arising
                out of or in any way connected with your access to or use of our Services, or your
                violation of these Terms.
              </p>
            </section>

            <section id="section-13" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                United States and the State of North Carolina, without regard to its conflict of law
                principles.
              </p>
            </section>

            <section id="section-14" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. If we make changes, we will
                provide notice by updating the date at the top of these Terms and posting the
                modified Terms on our website. Your continued use of our Services after the
                effective date of the modified Terms will constitute your acceptance of the changes.
              </p>
            </section>

            <section id="section-15" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Termination</h2>
              <p>
                We may terminate or suspend your access to our Services, without prior notice or
                liability, for any reason, including, without limitation, if you breach these Terms.
                Upon termination, your right to use our Services will immediately cease.
              </p>
            </section>

            {/* ---- Audience: General Visitors ---- */}
            <section id="section-16" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. General Visitors</h2>
              <p className="mb-4">
                <em>
                  This section is for anyone browsing our sites, reading content, or donating —
                  without being a volunteer or a supported charity.
                </em>
              </p>
              <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm">
                <strong className="text-gray-900">In short:</strong> browse and donate freely — no
                account needed. Be respectful and lawful, our content stays ours, and donations are
                voluntary and non-refundable.
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The{' '}
                  <strong>
                    General Terms (Sections 1–15) are the complete terms that apply to you
                  </strong>
                  . You do not need an account or any further commitment to browse or donate.
                </li>
                <li>
                  You may read and share our public content for informational purposes; our content
                  and marks remain ours (<Ref n={7}>Section 7.1</Ref>).
                </li>
                <li>
                  Please use the sites respectfully and lawfully (<Ref n={4}>Section 4.2</Ref>).
                  Donations are voluntary and non-refundable (<Ref n={5}>Sections 5–6</Ref>).
                </li>
                <li>
                  How we handle visitor data, cookies, and analytics is described in our{' '}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </li>
              </ul>
            </section>

            {/* ---- Audience: Volunteers ---- */}
            <section id="section-17" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Volunteers</h2>
              <p className="mb-4">
                <em>
                  This section is for people who contribute their skills to Free For Charity or to
                  the charity projects FFC supports (web development, Microsoft 365 / Google
                  Workspace administration, data &amp; analytics, design, military and other
                  volunteers).
                </em>
              </p>
              <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm">
                <strong className="text-gray-900">In short:</strong> volunteering is unpaid and not
                employment. Use your own MFA-secured account, keep what you access confidential, use
                AI responsibly, and your contributions are donated under the project&apos;s
                open-source license. You can stop anytime; FFC can end access anytime.
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                17.1 Volunteer relationship
              </h3>
              <p className="mb-4">
                Free For Charity is a 100% volunteer organization. Volunteering is{' '}
                <strong>unpaid and is not employment</strong> — it creates no wage, benefit, or
                contractor relationship. You volunteer at-will and may stop at any time, and FFC may
                end a volunteer&apos;s access or role at any time, with or without cause. FFC may,
                at its discretion, fund certifications and provide recognition (see the{' '}
                <Link href="/contributor-ladder" className="text-blue-600 hover:underline">
                  Contributor Ladder
                </Link>
                ), but none of these is guaranteed.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                17.2 Accounts &amp; security
              </h3>
              <p className="mb-4">
                Volunteers follow the same security baseline as everyone in the FFC ecosystem: use
                your <strong>own account in your real name</strong>, secured with{' '}
                <strong>multi-factor authentication</strong>; never share credentials; use unique
                passwords; and use the approved, supported browsers. Protect any access you are
                granted to FFC or charity systems and use the least privilege needed (see the{' '}
                <Link href="/guides" className="text-blue-600 hover:underline">
                  setup guides
                </Link>
                ).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">17.3 Conduct</h3>
              <p className="mb-4">
                Act lawfully, professionally, and respectfully toward other volunteers, charities,
                and the communities they serve. Follow each project&apos;s conventions and the
                standard contribution workflow; do not harass others, introduce malicious code, or
                disrupt the Services (<Ref n={4}>Section 4.2</Ref> applies in full).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                17.4 Confidentiality &amp; data
              </h3>
              <p className="mb-4">
                In the course of volunteering you may be given access to FFC or charity data. Use it
                only as needed for your volunteer work, keep it confidential, do not copy, export,
                or misuse it, and follow the data-handling expectations in{' '}
                <Ref n={18}>Section 18.7</Ref>. Report any suspected security issue promptly (see
                the{' '}
                <Link
                  href="/vulnerability-disclosure-policy"
                  className="text-blue-600 hover:underline"
                >
                  Vulnerability Disclosure Policy
                </Link>
                ).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">17.5 Responsible AI use</h3>
              <p className="mb-4">
                Volunteer work is AI-assisted. Review AI output before committing or publishing it,
                do not paste secrets or sensitive personal data into AI tools except where FFC has
                approved a tool for that use, and follow each AI provider&apos;s own terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                17.6 Contributions &amp; intellectual property
              </h3>
              <p className="mb-4">
                Your contributions are donated. You grant Free For Charity and the relevant charity
                a license to use, reproduce, modify, and distribute your contributions in connection
                with the Services and the project&apos;s open-source license (consistent with{' '}
                <Ref n={7}>Section 7.2</Ref>). You represent that you have the right to contribute
                what you submit and that it does not infringe anyone else&apos;s rights.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                17.7 No authority to bind; conflicts of interest
              </h3>
              <p>
                Volunteers do not represent or speak for Free For Charity or any charity, and cannot
                enter commitments on their behalf, unless expressly authorized in writing. Disclose
                any conflict of interest. When you stop volunteering or change roles, your access is
                revoked or returned.
              </p>
            </section>

            {/* ---- Audience: Supported Charities ---- */}
            <section id="section-18" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Supported Charities</h2>
              <p className="mb-4">
                <em>
                  This section is for nonprofit organizations that apply for or receive the Free For
                  Charity technology stack, and the people who act on the organization&apos;s behalf
                  (applicant, board members, staff, and volunteers).
                </em>
              </p>
              <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm">
                <strong className="text-gray-900">In short:</strong> FFC gives eligible nonprofits a
                complete technology stack for free. In return, you adopt the{' '}
                <strong>whole stack</strong> (not pieces), keep accounts MFA-secured, handle your
                data lawfully, keep the small &ldquo;built by FFC&rdquo; credit, and stay eligible
                with a ~30-minute annual refresh. You keep ownership of your own content and data.
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.1 What FFC provides (and that it is free)
              </h3>
              <p className="mb-4">
                FFC provides, at no cost, an <strong>integrated stack</strong> for eligible
                nonprofits — typically a domain, professional email, a website you maintain
                yourself, design assets, analytics, access to donated software, and trained
                volunteer support. FFC is a volunteer- and donor-funded 501(c)(3); services are
                provided <strong>as-is</strong> (<Ref n={10}>Sections 10</Ref> and{' '}
                <Ref n={11}>11</Ref> apply).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.2 The full-stack commitment
              </h3>
              <p className="mb-4">
                FFC delivers an integrated stack, not an à-la-carte menu. The organization agrees to{' '}
                <strong>adopt and use the complete Free For Charity stack as designed</strong> — not
                to pick and choose individual pieces while declining the rest. This includes, as
                applicable: the FFC-managed domain and DNS; professional email on the
                FFC-provisioned platform; the website maintained through the standard FFC
                (GitHub-based, AI-assisted) workflow; the security baseline; and the supporting
                accounts the program depends on. The stack is secure, recoverable, and maintainable
                because the pieces work together; partial adoption creates security and support gaps
                that undermine the free model for every charity FFC serves.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.3 Eligibility &amp; prerequisites
              </h3>
              <p className="mb-4">
                Service is granted only after the organization meets the eligibility floor and
                completes the prerequisite steps (including the smaller-charity revenue gate —
                currently under US$1M in annual revenue — account setup, and validation checks). See{' '}
                <Link href="/charity-prerequisites" className="text-blue-600 hover:underline">
                  Charity Prerequisites
                </Link>
                .
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.4 Account &amp; security responsibilities
              </h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  Use your <strong>own</strong> account in your <strong>real name</strong>, secured
                  with <strong>multi-factor authentication</strong>, and never share credentials
                  except through approved credential-sharing tooling at the organizational phase.
                </li>
                <li>Use a unique password for every service; never reuse passwords.</li>
                <li>Keep MFA recovery codes stored safely so a lost device is never a lockout.</li>
                <li>Use only the approved, supported browsers (Chrome or Edge) for FFC work.</li>
                <li>
                  Promptly report suspected account compromise, and report security vulnerabilities
                  through the{' '}
                  <Link
                    href="/vulnerability-disclosure-policy"
                    className="text-blue-600 hover:underline"
                  >
                    Vulnerability Disclosure Policy
                  </Link>
                  .
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.5 Acceptable use &amp; content standards
              </h3>
              <p className="mb-4">
                FFC accounts, domains, sites, and tools may be used only for the organization&apos;s
                lawful, charitable, on-mission purpose. In addition to the prohibited activities in{' '}
                <Ref n={4}>Section 4.2</Ref>, the organization agrees not to publish content that is
                hateful, harassing, deceptive, or otherwise unlawful, and not to transfer
                FFC-provided access or assets to unrelated third parties. The organization is
                responsible for all content it publishes on its FFC-built site and is expected to
                keep that content accurate, lawful, and <strong>accessible</strong>.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.6 Your content, data &amp; ownership
              </h3>
              <p className="mb-4">
                The organization{' '}
                <strong>retains ownership of its own content, data, and brand</strong>. FFC claims
                no ownership of the charity&apos;s content (FFC&apos;s own software, templates, and
                trademarks remain FFC&apos;s, per <Ref n={7}>Section 7</Ref>). If the organization
                leaves, FFC will support a reasonable handover of the domain and the content/data
                the charity owns, and will make a reasonable effort to delete the
                organization&apos;s data from FFC-managed systems on request after offboarding,
                subject to backups and legal retention.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.7 Data handling &amp; privacy
              </h3>
              <p className="mb-4">
                The organization is responsible for the constituent and donor data it stores in
                FFC-provided systems and agrees to handle it lawfully and respectfully — collecting
                only what is needed, restricting access, honoring applicable privacy laws (U.S.
                state privacy laws first, then GDPR where relevant), and not uploading data it has
                no right to hold.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">18.8 Responsible AI use</h3>
              <p className="mb-4">
                The FFC stack is AI-assisted. The organization agrees to review AI output before
                publishing or acting on it, not to paste sensitive data (constituent/donor personal
                data, secrets, credentials) into AI tools except where FFC has approved a tool for
                that use, and to follow each AI provider&apos;s own terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.9 Third-party &amp; donated software; what&apos;s free vs. paid
              </h3>
              <p className="mb-4">
                Much of the stack is donated or discounted third-party software (e.g. Microsoft,
                Google, Canva via TechSoup/Goodstack). Use of those products is also subject to each
                vendor&apos;s terms, and eligibility is the vendor&apos;s decision, not FFC&apos;s.
                The core FFC stack is free; optional paid add-ons (for example premium AI seats such
                as GitHub Copilot or Microsoft 365 Copilot, or paid LastPass tiers) are the
                organization&apos;s own cost and choice, and FFC does not commit to funding them.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.10 People &amp; access changes
              </h3>
              <p className="mb-4">
                The organization keeps its access list current: when a volunteer, board member, or
                staffer leaves or changes roles, the organization promptly revokes or adjusts their
                access to FFC-provided accounts and repositories, following the least-privilege
                principle.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.11 Conflict of interest
              </h3>
              <p className="mb-4">
                People acting for the organization must disclose any conflict of interest and must
                not use their access for personal gain. Board members accept the responsibility and
                liability of their role, which they signal publicly by linking the charity under
                their LinkedIn &quot;Volunteering&quot; section.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.12 Branding &amp; attribution
              </h3>
              <p className="mb-4">
                In return for free technology, the organization agrees to the &quot;credit FFC&quot;
                expectation — keeping the standard, unobtrusive Free For Charity attribution (a
                small footer acknowledgment and, where appropriate, a link back) that FFC includes
                with delivered work, unless FFC agrees otherwise in writing.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.13 Support expectations
              </h3>
              <p className="mb-4">
                FFC support is best-effort and volunteer-run. There is no service-level agreement or
                guaranteed response time. Self-service walkthroughs and guides are available at any
                time, and a &quot;contact us for help&quot; path is provided during onboarding.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.14 Continued eligibility &amp; annual refresh
              </h3>
              <p className="mb-4">
                Continued service depends on the organization staying eligible and current — keeping
                accounts secured, its Candid/GuideStar profile and seal up to date (an annual
                ~30-minute refresh), and the full-stack commitment intact. Letting prerequisites
                lapse may pause service until they are restored.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                18.15 Acknowledgment &amp; authority
              </h3>
              <p>
                The person who acknowledges these Terms on the organization&apos;s behalf confirms
                they are authorized to commit the organization. Acceptance is recorded through the
                FFC application acknowledgment, and confirms the organization agrees to these Terms,
                including the full-stack commitment and the responsibilities in this Section 18.
              </p>
            </section>

            <section id="section-19" className="scroll-mt-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">19. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <strong>Free For Charity</strong>
                </p>
                <p className="mb-2">
                  Email:{' '}
                  <a
                    href="mailto:clarkemoyer@freeforcharity.org"
                    className="text-blue-600 hover:underline"
                  >
                    clarkemoyer@freeforcharity.org
                  </a>
                </p>
                <p>
                  Phone:{' '}
                  <a href="tel:520-222-8104" className="text-blue-600 hover:underline">
                    520-222-8104
                  </a>
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Thank you for supporting Free For Charity and for complying with these Terms of
                Service.
              </p>
            </section>

            <PolicyCrossLinks current="/terms-of-service" />
          </div>
        </div>
      </div>
    </div>
  )
}
