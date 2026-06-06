import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getPath, getModule, TIER_LABELS, TIER_BLURB, type Tier } from '@/data/training-modules'

export const metadata: Metadata = {
  title: 'Site Owner Training',
  description:
    'Everything a charity site owner is responsible for — accounts, content, your domain & DNS, Microsoft 365 email, security, publishing, governance, and working with AI — taught at operator depth. Understand each area and handle it safely with your AI assistant; no certifications required.',
  keywords:
    'charity site owner training, nonprofit website responsibilities, domain management, Microsoft 365 email, website security, AI website management, Free For Charity',
  alternates: {
    canonical: 'https://ffcadmin.org/site-owner/training/',
  },
}

function DirectiveLink({ url, label }: { url: string; label: string }) {
  if (url.startsWith('/')) {
    return (
      <Link href={url} className="text-teal-700 underline hover:text-teal-900">
        {label}
      </Link>
    )
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-teal-700 underline hover:text-teal-900"
    >
      {label}
    </a>
  )
}

export default function SiteOwnerTrainingPage() {
  const path = getPath('site-owner')
  if (!path) return null

  const modules = path.entries
    .map((entry) => ({ entry, module: getModule(entry.moduleId) }))
    .filter(
      (
        m
      ): m is {
        entry: (typeof path.entries)[number]
        module: NonNullable<ReturnType<typeof getModule>>
      } => Boolean(m.module)
    )

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Edit My Charity Website', href: '/site-owner' },
          { label: 'Site Owner Training' },
        ]}
      />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              🎓
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Site Owner Training</h1>
              <p className="text-teal-50 text-sm mt-1">
                What you&apos;re responsible for — and how to handle each part with AI
              </p>
            </div>
          </div>
          <p className="text-teal-50 text-lg max-w-3xl">{path.intro}</p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            <span aria-hidden="true">🟢</span>
            {TIER_LABELS.T1} level — no certification required
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What "operator level" means */}
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded mb-8 text-sm text-emerald-900">
          <strong>Operator level.</strong> {TIER_BLURB.T1} You don&apos;t need to become a Microsoft
          administrator or a developer — but you shouldn&apos;t miss the fundamentals either. Each
          area below tells you what you own and the safe way to handle it. FFC volunteers go deeper
          (Practitioner and Administrator levels with certifications); you can too if you ever want
          to.
        </div>

        {/* What you're responsible for — quick list */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What you&apos;re responsible for
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {modules.map(({ entry, module }) => (
              <a
                key={module.id}
                href={`#${module.id}`}
                className="flex items-start p-2 rounded-lg hover:bg-teal-50 transition-colors group"
              >
                <span className="text-xl mr-3" aria-hidden="true">
                  {module.icon}
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-gray-900 group-hover:text-teal-700">
                    {module.title}
                  </span>
                  {entry.optional && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      Optional
                    </span>
                  )}
                  <span className="block text-gray-600">{module.responsibility}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Module detail sections */}
        <div className="space-y-8">
          {modules.map(({ entry, module }) => {
            const tier = entry.tier as Tier
            const content = module.tiers[tier]
            if (!content) return null
            return (
              <section
                key={module.id}
                id={module.id}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 scroll-mt-20"
              >
                <div className="flex items-center mb-3">
                  <span className="text-4xl mr-4" aria-hidden="true">
                    {module.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-900">{module.title}</h2>
                      {entry.optional && (
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{module.responsibility}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Your goal:</span> {content.objective}
                </p>
                <ul className="space-y-3">
                  {content.directives.map((d) => (
                    <li key={d.id} className="flex items-start">
                      <span className="text-teal-600 mr-2 mt-0.5" aria-hidden="true">
                        &#10003;
                      </span>
                      <span className="text-sm text-gray-700">
                        {d.text}
                        {d.link && (
                          <>
                            {' '}
                            (<DirectiveLink url={d.link.url} label={d.link.label} />)
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        {/* Footer nav */}
        <div className="mt-10 bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Where to next</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="/site-owner" className="text-teal-700 underline hover:text-teal-900">
                Edit Your Charity&apos;s Website
              </Link>
              <span className="text-gray-500"> &mdash; the hands-on walkthrough</span>
            </li>
            <li>
              <Link
                href="/site-owner/common-edits"
                className="text-teal-700 underline hover:text-teal-900"
              >
                Common Edits Cookbook
              </Link>
              <span className="text-gray-500"> &mdash; ready-to-paste prompts</span>
            </li>
            <li>
              <Link href="/training-plan" className="text-teal-700 underline hover:text-teal-900">
                Go deeper: Global Administrator track
              </Link>
              <span className="text-gray-500"> &mdash; full depth + certifications</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
