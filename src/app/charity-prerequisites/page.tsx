import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getSetupGuide } from '@/data/setup-guides'

export const metadata: Metadata = {
  title: 'Charity Prerequisites — Start Here',
  description:
    'Free For Charity gives your nonprofit a free domain, professional email, a website, design, and training — not just a site. Here is the prerequisite path: check eligibility, set up the accounts every charity needs, then apply on freeforcharity.org.',
  keywords:
    'free nonprofit website, free charity domain, free nonprofit email, 501c3 prerequisites, charity application requirements, Free For Charity apply, nonprofit onboarding',
  alternates: { canonical: 'https://ffcadmin.org/charity-prerequisites/' },
}

/** What FFC provides — the value is far more than a website. */
const VALUE = [
  {
    icon: '🌐',
    title: 'A free domain',
    body: 'Your own yourcharity.org, registered and managed for you.',
  },
  {
    icon: '✉️',
    title: 'Professional email',
    body: 'Microsoft 365 or Google Workspace mailboxes on your domain.',
  },
  {
    icon: '💻',
    title: 'A professional website',
    body: 'A fast, secure, accessible site you can edit yourself with AI.',
  },
  {
    icon: '🎨',
    title: 'Design & brand',
    body: 'Canva Pro brand kit, social templates, and marketing collateral.',
  },
  {
    icon: '📈',
    title: 'Analytics & SEO',
    body: 'GA4, Microsoft Clarity, and the basics of being found online.',
  },
  {
    icon: '🤝',
    title: 'Volunteers & software',
    body: 'Trained volunteers plus access to donated software via TechSoup & Goodstack.',
  },
]

/** Eligibility gates (summarized from the application prerequisites inventory). */
const ELIGIBILITY = [
  {
    title: 'A 501(c)(3) — or on the pre-501(c)(3) track',
    body: 'Recognized public charities qualify. Forming organizations can start on the pre-501(c)(3) track and grow into full eligibility.',
  },
  {
    title: 'Under $1M in annual revenue',
    body: 'A hard gate, measured per year (e.g. your most recent Form 990). FFC focuses on the smaller charities that need the most help.',
  },
  {
    title: 'Not primarily federally funded',
    body: 'Priority goes to organizations that are not already federally funded.',
  },
  {
    title: 'At least two accountable people',
    body: 'A US mailing address, a public phone number, and two people who own the accounts and decisions.',
  },
]

/** Core personal prerequisites every applicant sets up (drawn from the setup guides). */
const PERSONAL_PREREQS = [
  'github-account',
  'multi-factor-authentication',
  'password-manager',
  'ai-assistant',
  'linkedin',
  'facebook',
  'microsoft-365-email',
  'cloud-storage-scanning',
  'canva',
  'candid',
]

/** Organizational prerequisites that come once the charity is recognized. */
const ORG_PREREQS = ['techsoup', 'goodstack', 'microsoft-365-organization', 'canva-organization']

function GuideChips({ slugs }: { slugs: string[] }) {
  const guides = slugs
    .map((s) => getSetupGuide(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {guides.map((g) => (
        <Link
          key={g.slug}
          href={`/guides/${g.slug}`}
          className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 hover:shadow-md hover:border-gray-300 transition-all"
        >
          <span className="text-2xl" role="img" aria-label={g.shortTitle}>
            {g.icon}
          </span>
          <span className="min-w-0 flex-1 text-sm font-semibold text-gray-900 group-hover:text-blue-700">
            {g.shortTitle}
          </span>
          <span className="text-gray-300 group-hover:text-blue-600" aria-hidden="true">
            →
          </span>
        </Link>
      ))}
    </div>
  )
}

export default function CharityPrerequisitesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Charity Prerequisites' }]} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🏛️
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Start here: prepare your charity</h1>
              <p className="text-blue-100 text-sm mt-1">
                Free domain, email, website — and the tools and training to run them
              </p>
            </div>
          </div>
          <p className="text-blue-50 text-lg max-w-3xl">
            Free For Charity gives your nonprofit much more than a website — a free domain,
            professional email, a site you can edit yourself, design, analytics, donated software,
            and trained volunteers. This page is the <strong>prerequisite path</strong>: confirm
            you&apos;re eligible, set up the accounts every charity needs, then apply.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What you get */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What Free For Charity provides</h2>
          <p className="text-gray-600 text-sm mb-6 max-w-3xl">
            Most charities find us for the free domain, email, and website — but the value goes
            further. See the full list on{' '}
            <Link href="/what-ffc-delivers" className="text-blue-700 underline hover:text-blue-900">
              What FFC Delivers
            </Link>
            .
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALUE.map((v) => (
              <div key={v.title} className="bg-white rounded-xl border border-gray-200 p-5">
                <span className="text-2xl" aria-hidden="true">
                  {v.icon}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2">{v.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step 1: Eligibility */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">1. Check you&apos;re eligible</h2>
          <p className="text-gray-600 text-sm mb-6 max-w-3xl">
            FFC focuses on smaller US charities. The core gates:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ELIGIBILITY.map((e) => (
              <div
                key={e.title}
                className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-blue-500 p-5"
              >
                <h3 className="text-base font-bold text-gray-900">{e.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{e.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step 2: Personal prerequisites */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            2. Set up your personal accounts
          </h2>
          <p className="text-gray-600 text-sm mb-6 max-w-3xl">
            Everything at FFC is run by <strong>real people, not anonymous logins</strong>. The
            applicant (and each board member where it applies) sets up these accounts first — each
            has a standalone, every-step guide. See them all on the{' '}
            <Link href="/guides" className="text-blue-700 underline hover:text-blue-900">
              Account &amp; Tool Setup
            </Link>{' '}
            hub.
          </p>
          <GuideChips slugs={PERSONAL_PREREQS} />
        </section>

        {/* Step 3: Organizational prerequisites */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            3. Organizational setup (once recognized)
          </h2>
          <p className="text-gray-600 text-sm mb-6 max-w-3xl">
            After 501(c)(3) recognition, get your charity validated so donated software unlocks —{' '}
            <strong>TechSoup</strong> (QuickBooks, Microsoft, Adobe) and <strong>Goodstack</strong>{' '}
            (Canva, Google) — and stand up the organization-level accounts.
          </p>
          <GuideChips slugs={ORG_PREREQS} />
        </section>

        {/* Step 4: Apply */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 border-l-4 border-l-emerald-500 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Apply</h2>
            <p className="text-gray-700 text-sm mb-5 max-w-3xl">
              Most charities find and apply to Free For Charity on the main{' '}
              <strong>freeforcharity.org</strong> website. Start there — the team will guide you
              into the rest of onboarding.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://freeforcharity.org/501c3/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
              >
                Apply (501c3) at freeforcharity.org
              </a>
              <a
                href="https://freeforcharity.org/pre501c3/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Pre-501(c)(3) track
              </a>
            </div>
          </div>
        </section>

        {/* After onboarding */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">After FFC builds your site</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/site-owner"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-all"
            >
              <span className="text-2xl" aria-hidden="true">
                🌱
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-gray-900 group-hover:text-emerald-700">
                  Edit My Charity Website
                </span>
                <span className="block text-sm text-gray-600">
                  Keep your site current yourself — in plain English, no coding.
                </span>
              </span>
              <span className="text-gray-300 group-hover:text-emerald-600" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/get-involved"
              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-all"
            >
              <span className="text-2xl" aria-hidden="true">
                🚀
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-gray-900 group-hover:text-blue-700">
                  Volunteer with FFC
                </span>
                <span className="block text-sm text-gray-600">
                  Help build and run sites for other charities.
                </span>
              </span>
              <span className="text-gray-300 group-hover:text-blue-600" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
