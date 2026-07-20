import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import PromptBox from '@/components/PromptBox'

export const metadata: Metadata = {
  title: 'Adopting the FFC Footer on an Existing Website',
  description:
    'Add the FFC footer and compliance layer — policy pages, cookie consent, analytics, team section — to a charity site that already has its own design, so it passes FFC validation and unlocks the domain step: a new .org registered, or the domain you already own transferred, in Cloudflare.',
  keywords:
    'FFC footer, Footer-Only Template, existing charity website, policy pages, cookie consent, GDPR, Google Tag Manager, FFC validation, Free For Charity guide',
  alternates: {
    canonical: 'https://ffcadmin.org/guides/adopt-ffc-footer-on-existing-site/',
  },
}

const tocItems = [
  { id: 'who', label: '1. Who this path is for' },
  { id: 'adopt', label: '2. What the charity adopts' },
  { id: 'add', label: '3. Add the layer to the existing site' },
  { id: 'validate', label: '4. Pass FFC validation' },
  { id: 'unlock', label: '5. What passing unlocks' },
]

export default function AdoptFfcFooterGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guides', href: '/guides' },
          { label: 'Adopt the FFC Footer' },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🦶
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Adopting the FFC Footer on an Existing Website
              </h1>
              <p className="text-emerald-100 text-sm mt-1">
                The compliance layer that gets an already-designed site through FFC validation
              </p>
            </div>
          </div>
          <p className="text-emerald-50 text-lg max-w-3xl">
            Charities that already have a designed website don&apos;t rebuild it — they adopt the{' '}
            <strong>FreeForCharity/FFC-IN-Footer_Only_Template</strong> layer on top of their
            existing design. Passing FFC validation on the site&apos;s GitHub Pages address is what
            unlocks the domain step — FFC registers a new .org, or transfers the domain you already
            own, in Cloudflare and points it at your validated site.
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
                <a href={`#${t.id}`} className="text-emerald-700 underline hover:text-emerald-900">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 1 */}
        <section id="who" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Who this path is for</h2>
          <p className="text-gray-700 mb-4">
            FFC&apos;s gated onboarding journey has two website paths, and both converge on the same
            validation gate:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5 mb-4">
            <li>
              <strong>No website yet?</strong> An FFC volunteer builds a complete single-page site
              from the charity&apos;s content — see{' '}
              <Link
                href="/guides/build-charity-site-from-template"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                Build a Charity Site from the Template
              </Link>
              .
            </li>
            <li>
              <strong>Already have a designed website?</strong> This guide. The charity keeps its
              design and adopts the FFC footer and compliance layer from{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                FFC-IN-Footer_Only_Template
              </a>
              , which is what makes the site pass FFC validation.
            </li>
          </ul>
          <p className="text-gray-700 text-sm">
            In both cases the site goes live on its <strong>free GitHub Pages address first</strong>{' '}
            (no custom domain). Only after it passes validation there does FFC register the
            charity&apos;s new .org — or transfer the domain it already owns — in Cloudflare. The
            full sequence is on the{' '}
            <a
              href="https://freeforcharity.org/charity-onboarding-journey/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline hover:text-emerald-900"
            >
              charity onboarding journey
            </a>{' '}
            page.
          </p>
        </section>

        {/* 2 */}
        <section id="adopt" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. What the charity adopts</h2>
          <p className="text-gray-700 mb-4">
            The Footer-Only Template contributes exactly the pieces an already-designed site is
            usually missing — the legal, compliance, and infrastructure formality of the FFC
            standard:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>
              <strong>FFC footer</strong> — contact info, social links, policy links, GuideStar
              badge, and branding.
            </li>
            <li>
              <strong>7 legal/policy pages</strong> — privacy policy, cookie policy, terms of
              service, donation policies, vulnerability disclosure, and security acknowledgements.
            </li>
            <li>
              <strong>GDPR cookie consent</strong> — banner with granular opt-in/opt-out controls.
            </li>
            <li>
              <strong>Analytics</strong> — Google Tag Manager with a consent-aware data layer.
            </li>
            <li>
              <strong>Team section</strong> — data-driven team member display.
            </li>
            <li>
              <strong>SEO infrastructure</strong> — sitemap, robots.txt, Open Graph and Twitter Card
              metadata.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section id="add" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. Add the layer to the existing site
          </h2>
          <p className="text-gray-700 mb-4">
            The charity&apos;s site lives in a FreeForCharity repository and deploys to GitHub
            Pages, with the existing design preserved. Point your AI agent at the template and let
            it graft the compliance layer in.
          </p>
          <PromptBox accent="emerald" label="Paste this into your AI agent">
            &ldquo;Read <strong>FreeForCharity/FFC-IN-Footer_Only_Template</strong> and its README.
            Then, on a new branch in <strong>&lt;charity-repo&gt;</strong>, adopt the FFC footer,
            the 7 policy pages, the cookie consent banner, the GTM integration, and the team section
            — without changing the site&apos;s existing design or content. Fill in{' '}
            <strong>&lt;Charity Name&gt;</strong>&apos;s contact details and team data, and show me
            what changed before opening anything.&rdquo;
          </PromptBox>
          <p className="text-gray-700 mt-4 text-sm">
            Run the repo&apos;s formatting, lint, build, and test checks as documented in its own
            conventions, then open a pull request and let CI validate it. Once it merges, GitHub
            Pages publishes the updated site on its <code>*.github.io</code> address.
          </p>
        </section>

        {/* 4 */}
        <section
          id="validate"
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pass FFC validation</h2>
          <p className="text-gray-700 mb-4">
            FFC validates the live site on its GitHub Pages address. An already-designed site that
            has adopted the footer layer passes when:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 list-disc ml-5">
            <li>
              The site is <strong>live on its GitHub Pages URL</strong> with a green CI build — no
              custom domain yet.
            </li>
            <li>
              The <strong>FFC footer renders on every page</strong> with the required policy links,
              contact info, and branding.
            </li>
            <li>
              All <strong>7 policy pages resolve</strong> and contain the charity&apos;s information
              rather than placeholder text.
            </li>
            <li>
              The <strong>cookie consent banner</strong> appears and gates analytics until consent
              is given.
            </li>
            <li>
              <strong>GTM analytics</strong> fires (consent-aware) and the{' '}
              <strong>team section</strong> shows real people.
            </li>
            <li>
              <strong>SEO basics</strong> are in place — sitemap, robots.txt, and page metadata.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section id="unlock" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. What passing unlocks</h2>
          <p className="text-gray-700 mb-4">
            Validation is the gate. Once the site passes on its GitHub Pages address, FFC{' '}
            <strong>
              registers a new .org — or transfers the domain the charity already owns — in
              Cloudflare
            </strong>{' '}
            and points it at the validated site (Cloudflare DNS → GitHub Pages, a Global Admin task
            — see the{' '}
            <Link href="/training" className="text-emerald-700 underline hover:text-emerald-900">
              Domains &amp; DNS module
            </Link>
            ). The domain in turn unlocks charity email setup.
          </p>
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded text-sm text-emerald-900">
            The order is deliberate: build → validate on GitHub Pages → domain → email. No domain is
            registered or transferred for a site that hasn&apos;t passed validation.
          </div>
        </section>

        {/* Footer nav */}
        <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/guides" className="text-emerald-700 underline hover:text-emerald-900">
                &larr; All Guides
              </Link>
            </li>
            <li>
              <Link
                href="/guides/build-charity-site-from-template"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                Build a Charity Site from the Template (no-website path)
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline hover:text-emerald-900"
              >
                FFC-IN-Footer_Only_Template on GitHub
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
