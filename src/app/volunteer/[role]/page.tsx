import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { VOLUNTEER_ROLES, getVolunteerRole } from '@/data/volunteer-roles'

export function generateStaticParams() {
  return VOLUNTEER_ROLES.map((r) => ({ role: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>
}): Promise<Metadata> {
  const { role: slug } = await params
  const role = getVolunteerRole(slug)
  if (!role) return {}
  return {
    title: role.title,
    description: role.intro,
    keywords: role.keywords,
    alternates: { canonical: `https://ffcadmin.org/volunteer/${role.slug}/` },
  }
}

export default async function VolunteerRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role: slug } = await params
  const role = getVolunteerRole(slug)
  if (!role) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Volunteer', href: '/volunteer' },
          { label: role.title },
        ]}
      />

      {/* Hero */}
      <div className={`bg-gradient-to-r ${role.gradient} text-white py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <span className="text-5xl mr-4" aria-hidden="true">
              {role.icon}
            </span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{role.title}</h1>
              <p className="text-white/90 text-sm mt-1">{role.tagline}</p>
            </div>
          </div>
          <p className="text-white/90 text-lg max-w-3xl">{role.intro}</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What you&apos;ll do</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {role.responsibilities.map((r) => (
              <li key={r} className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-0.5">&#10003;</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={role.startHref}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
            >
              {role.startLabel}
            </Link>
            <a
              href="sms:520-222-8104"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              Text FFC to get started
            </a>
          </div>
        </section>

        {/* Other roles */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Other ways to volunteer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {VOLUNTEER_ROLES.filter((r) => r.slug !== role.slug).map((r) => (
              <Link
                key={r.slug}
                href={`/volunteer/${r.slug}`}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-xl mr-3" aria-hidden="true">
                  {r.icon}
                </span>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                  {r.title}
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Not sure?{' '}
            <Link href="/get-involved" className="text-blue-600 underline hover:text-blue-800">
              See all volunteer tracks
            </Link>{' '}
            or{' '}
            <Link href="/site-owner" className="text-blue-600 underline hover:text-blue-800">
              edit your own charity&apos;s site
            </Link>
            .
          </p>
        </section>
      </main>
    </div>
  )
}
