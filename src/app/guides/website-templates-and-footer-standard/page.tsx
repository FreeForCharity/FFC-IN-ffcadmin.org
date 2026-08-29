import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Website Templates & the Footer Standard',
  description:
    'The orientation guide for FFC volunteers: when to use the Single Page template vs the Footer-Only template, what both ship, why every item in the FFC footer exists — Candid link, donate pathway, policy pages, consent — and how the standard is generated and enforced.',
  keywords:
    'FFC templates, Single Page Template, Footer-Only Template, FFC footer standard, Candid, GuideStar, policy pages, cookie consent, Level 1, Level 2, Gate 3, Free For Charity guide',
  alternates: {
    canonical: 'https://ffcadmin.org/guides/website-templates-and-footer-standard/',
  },
}

const tocItems = [
  { id: 'decision', label: '1. Which template, when' },
  { id: 'ship', label: '2. What both templates ship' },
  { id: 'footer', label: '3. The footer, item by item' },
  { id: 'levels', label: '4. The two passing levels' },
  { id: 'generated', label: '5. Generated, not hand-typed' },
  { id: 'enforced', label: '6. How the standard is enforced' },
]

interface FooterItem {
  name: string
  why: string
}

const footerItems: FooterItem[] = [
  {
    name: 'Candid (GuideStar) seal, profile link, and EIN',
    why: 'Grant makers and serious donors verify a charity on Candid before funding it, so the footer puts a working profile link and the EIN one click away on every page — a verifiable 501(c)(3) claim, and a ready-to-cite link for the charity’s own grant applications. Level 2 only: it renders exclusively once the charity actually holds IRS recognition and a public profile (see section 4).',
  },
  {
    name: 'Donate quick link',
    why: 'Every page ends with a giving pathway. Sites from the Single Page template ship a Zeffy donation form (zero-fee processing); post-deploy smoke monitoring treats lost donation capability as a failure class, not a cosmetic defect.',
  },
  {
    name: 'Two donation policies',
    why: 'The charity’s own Donation Policy (deductibility, receipts, refunds) plus the Free For Charity Donation Policy. The FFC entry keeps FFC’s name after any rebrand — deliberately, because that page documents FFC’s own gift-acceptance policy — and the drift checker exempts exactly that label.',
  },
  {
    name: 'Privacy policy, cookie policy, and the consent banner',
    why: 'The consent layer is built to the strictest common bar visitors browse under: analytics and marketing scripts stay off until opt-in (the posture UK/EU rules expect), withdrawal actually deletes tracking cookies, and the privacy policy carries data-rights language plus a no-selling-data statement (the posture California expects). A two-person charity inherits it all by default.',
  },
  {
    name: 'Terms of service',
    why: 'A stated legal basis for the visitor relationship — eligibility, acceptable use, governing law — so no charity launches without one.',
  },
  {
    name: 'Vulnerability disclosure policy + security acknowledgements',
    why: 'Coordinated disclosure with safe-harbor language, wired into RFC 9116 security.txt so researchers’ tools find it. Charities hold donor data; this is how a finder reports a problem safely.',
  },
  {
    name: 'Contact block: email, phone, physical addresses',
    why: 'The legitimacy signals grant applications, nonprofit tech programs, and payment processors check — and a human-reachable path for donors, journalists, and partners. Address links open in Google Maps with the visible text kept in the accessible name (WCAG 2.5.3).',
  },
  {
    name: '“Supported by Free For Charity” + Supported Charity Login',
    why: 'The permanent attribution (siteConfig.supportedBy) and the hub login link. This is the one element that is never a rebrand target: it records the provenance of the free stack, gives every charity a path into the FFC hub from its own site, and is how the next charity discovers FFC. check:drift and check:rebrand deliberately exempt it.',
  },
  {
    name: 'Copyright + tax-status line',
    why: 'The year is computed at build time — never hand-typed, never stale. The “a US 501c3 Non Profit” clause renders only when it is true; on a pre-501(c)(3) site it would be a false legal claim, which is what the two passing levels exist to prevent.',
  },
]

export default function WebsiteTemplatesAndFooterStandardGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: 'Templates & Footer Standard' },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🧭
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Website Templates &amp; the Footer Standard
              </h1>
              <p className="text-sky-100 text-sm mt-1">
                Which template to use when — and why every item in the FFC footer earns its place
              </p>
            </div>
          </div>
          <p className="text-sky-50 text-lg max-w-3xl">
            Every FFC-supported site starts from one of two open-source templates, and both converge
            on the same FFC footer standard — the compliance and trust layer Gate-3 validation
            checks on every page. This is the orientation guide: the decision rule, the feature
            inventory, and the rationale behind each footer element. The step-by-step how-tos are
            separate guides, linked throughout.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* TOC */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">On this page</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {tocItems.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-sky-700 underline hover:text-sky-900">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 1 */}
        <section
          id="decision"
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Which template, when</h2>
          <p className="text-gray-700 mb-4">
            The decision rule is one question:{' '}
            <strong>does the charity already have a website design it wants to keep?</strong>
          </p>
          <ul className="space-y-3 text-sm text-gray-700 list-disc ml-5 mb-4">
            <li>
              <strong>No website yet</strong> (most pre-501(c)(3)s, plus mature charities that never
              had one) →{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline hover:text-sky-900"
              >
                FFC-IN-FFC_Single_Page_Template
              </a>
              . A volunteer builds a complete single-page site from the charity&apos;s content, so
              every required section — mission, programs, team, donate, contact, legal pages, footer
              — exists from day one. How-to:{' '}
              <Link
                href="/guides/build-charity-site-from-template"
                className="text-sky-700 underline hover:text-sky-900"
              >
                Build a Charity Site from the Template
              </Link>
              .
            </li>
            <li>
              <strong>Already has a designed website</strong> →{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline hover:text-sky-900"
              >
                FFC-IN-Footer_Only_Template
              </a>
              . The charity keeps its design and adopts the compliance layer — footer, seven policy
              pages, consent, analytics, team section, SEO — on top of it. How-to:{' '}
              <Link
                href="/guides/adopt-ffc-footer-on-existing-site"
                className="text-sky-700 underline hover:text-sky-900"
              >
                Adopting the FFC Footer on an Existing Website
              </Link>
              .
            </li>
            <li>
              <strong>Live on WordPress (or other legacy hosting)</strong> → the site is first
              converted to a static build (see the{' '}
              <Link
                href="/guides/wordpress-to-nextjs-guide"
                className="text-sky-700 underline hover:text-sky-900"
              >
                WordPress to Next.js Conversion Guide
              </Link>
              ), then brought to the footer standard like any other already-designed site.
            </li>
          </ul>
          <p className="text-gray-700 text-sm">
            When in doubt, choose the Single Page template — it is the fastest path to a validated
            site. Both paths converge on the same gate: the site validated live on its free GitHub
            Pages address, which unlocks the free .org domain, which unlocks email.
          </p>
        </section>

        {/* 2 */}
        <section id="ship" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. What both templates ship</h2>
          <p className="text-gray-700 mb-4">
            Beyond their different starting points, the templates deliver the same infrastructure,
            driven by one shared <code>site.config.ts</code> shape (a config written for one
            template transcribes directly into the other):
          </p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>
              <strong>The FFC footer</strong> on every page — the full anatomy in section 3.
            </li>
            <li>
              <strong>Seven legal/policy pages</strong> — privacy policy, cookie policy, terms of
              service, the charity&apos;s donation policy, the FFC donation policy, vulnerability
              disclosure, and security acknowledgements.
            </li>
            <li>
              <strong>Consent banner</strong> — Accept All / Decline All / Customize, four cookie
              categories, analytics and marketing gated until opt-in, and cookie deletion on
              withdrawal.
            </li>
            <li>
              <strong>Analytics</strong> — Google Tag Manager with a consent-aware data layer (the
              charity swaps in its own container id during customization).
            </li>
            <li>
              <strong>Team section</strong> — data-driven, initials monograms so no charity has to
              source portrait photos; self-hides when no members are configured.
            </li>
            <li>
              <strong>SEO + accessibility + security plumbing</strong> — sitemap, robots, per-page
              metadata and canonicals, skip links, WCAG AA targets, CSP, and RFC 9116 security.txt.
            </li>
            <li>
              <strong>Static export for GitHub Pages</strong> — free hosting, with{' '}
              <code>assetPath()</code> handling project-page base paths.
            </li>
          </ul>
          <p className="text-gray-700 text-sm mt-4">
            The Single Page template additionally ships the eleven home-page sections, schema.org
            JSON-LD, and integrations (Zeffy, Idealist, events widgets); the Footer-Only template
            deliberately ships none of that — it is the &ldquo;backend formality&rdquo; layer only.
          </p>
        </section>

        {/* 3 */}
        <section id="footer" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. The footer, item by item</h2>
          <p className="text-gray-700 mb-4">
            The footer is the only element guaranteed to appear on every page — which makes it the
            one place a donor, grant maker, or regulator always finds what they need, wherever a
            search engine dropped them. That is why Gate-3 validation checks it on every page. Every
            item, and why it is there:
          </p>
          <dl className="space-y-4">
            {footerItems.map((item) => (
              <div key={item.name} className="border-l-4 border-sky-600 bg-sky-50/50 rounded p-4">
                <dt className="font-bold text-gray-900 text-sm mb-1">{item.name}</dt>
                <dd className="text-sm text-gray-700">{item.why}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 4 */}
        <section id="levels" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. The two passing levels</h2>
          <p className="text-gray-700 mb-4">
            The standard is level-aware so the footer never claims more than the charity can prove:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5 mb-4">
            <li>
              <strong>Level 1 (pre-501(c)(3))</strong> — the full footer <em>minus</em> the two
              items that assert IRS recognition: strip the &ldquo;a US 501c3 Non Profit&rdquo;
              status line (a false legal claim on a pre-501(c)(3) site, flagged by the fleet audit
              as a violation) and skip the Candid/GuideStar item (no public profile exists yet).
            </li>
            <li>
              <strong>Level 2 (full 501(c)(3))</strong> — everything in Level 1 plus the
              Candid/GuideStar profile link and the status line. When a charity&apos;s determination
              letter arrives, a small follow-up PR adds the two Level-2 items.
            </li>
          </ul>
          <p className="text-gray-700 text-sm">
            Operational details live in the repo doc{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/docs/footer-standard-adoption-checklist.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 underline hover:text-sky-900"
            >
              footer-standard-adoption-checklist.md
            </a>
            , which also sequences the retrofit of live sites that predate the standard.
          </p>
        </section>

        {/* 5 */}
        <section
          id="generated"
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Generated, not hand-typed</h2>
          <p className="text-gray-700 mb-4">
            Footer data comes from the charity&apos;s <strong>validated application record</strong>,
            not from anyone&apos;s memory. The generator script builds the site-config partial from
            the application data; if it exits listing gaps, those are onboarding gaps — the
            application goes back for completion in WHMCS rather than anyone guessing values. This
            is what makes the footer trustworthy: every EIN, address, and profile link on a
            supported site traces to reviewed application data.
          </p>
          <div className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded text-sm text-sky-900">
            Never hand-type an EIN, legal name, or Candid URL into a footer. Generate it, and if the
            data is missing, fix the application — not the footer.
          </div>
        </section>

        {/* 6 */}
        <section
          id="enforced"
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. How the standard is enforced</h2>
          <p className="text-gray-700 mb-4">
            The standard is machine-enforced at every stage of a site&apos;s life:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>
              <strong>In the templates</strong> — unit tests pin the footer&apos;s required content,
              and <code>check:drift</code> / <code>check:rebrand</code> stop a customized fork from
              shipping FFC&apos;s identity while explicitly protecting the permanent{' '}
              <code>supportedBy</code> attribution and the FFC donation-policy label.
            </li>
            <li>
              <strong>At Gate 3</strong> — auto-validation live-verifies the footer markers (brand
              text, freeforcharity.org link, EIN) on the deployed GitHub Pages site before any
              domain money is spent.
            </li>
            <li>
              <strong>After deploy</strong> — post-deploy smoke checks every live site for its
              footer, required policy links, and donation capability.
            </li>
            <li>
              <strong>Monitoring the monitors</strong> — a dedicated canary site is deliberately
              broken one failure class at a time (footer element removed, policy link missing, dead
              donation link, lost consent banner, unrebranded defaults) to prove the smoke engine
              catches each one with the expected message.
            </li>
            <li>
              <strong>Across the fleet</strong> — the fleet audit classifies every live supported
              site against Level 1 / Level 2 and drives the retrofit backlog.
            </li>
          </ul>
        </section>

        {/* Footer nav */}
        <div className="bg-gradient-to-br from-gray-50 to-sky-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/guides" className="text-sky-700 underline hover:text-sky-900">
                &larr; All Guides
              </Link>
            </li>
            <li>
              <Link
                href="/guides/build-charity-site-from-template"
                className="text-sky-700 underline hover:text-sky-900"
              >
                Build a Charity Site from the Template (no-website path)
              </Link>
            </li>
            <li>
              <Link
                href="/guides/adopt-ffc-footer-on-existing-site"
                className="text-sky-700 underline hover:text-sky-900"
              >
                Adopting the FFC Footer on an Existing Website (already-designed path)
              </Link>
            </li>
            <li>
              <a
                href="https://freeforcharity.org/website-templates/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 underline hover:text-sky-900"
              >
                The charity-facing explainer on freeforcharity.org
              </a>
            </li>
            <li>
              <Link href="/what-ffc-delivers" className="text-sky-700 underline hover:text-sky-900">
                What FFC Delivers
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
