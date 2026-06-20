import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
  INTAKE_HELP_BASE,
  INTAKE_HELP_CATEGORIES,
  intakeHelpPagesByCategory,
} from '@/data/intake-help'

export const metadata: Metadata = {
  title: 'Intake Help',
  description:
    'Practical guides for charities completing Free For Charity intake — board requirements, public contact info, mailing address, GuideStar, fiscal sponsorship, and more.',
  keywords:
    'charity intake help, nonprofit board, public contact info, mailing address, registered agent, GuideStar, fiscal sponsorship',
  alternates: { canonical: 'https://ffcadmin.org/intake-help/' },
}

export default function IntakeHelpHub() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Intake Help' }]} />

      <div className="bg-ffc-gradient text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold md:text-4xl">Intake help</h1>
          <p className="mt-3 max-w-3xl text-lg text-teal-50">
            Completing your FFC intake? These guides explain what we ask for and how to improve your
            readiness — they double as practical how-tos for running a credible charity.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        {INTAKE_HELP_CATEGORIES.map((category) => (
          <section key={category.id}>
            <h2 className="text-2xl font-bold text-gray-900">{category.label}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {intakeHelpPagesByCategory(category.id).map((page) => (
                <Link
                  key={page.slug}
                  href={`${INTAKE_HELP_BASE}/${page.slug}`}
                  className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-teal-400 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{page.title}</h3>
                    {!page.full && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        Starter
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{page.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
