import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import RoadmapSection from './RoadmapSection'
import { loadRoadmap, sectionEntries, graduatedCount } from './roadmapData'

export const metadata: Metadata = {
  title: 'Public Roadmap',
  description:
    'See every charity Free For Charity is helping, at every stage — in application review, awaiting a sponsoring admin, in active build, and recently launched. Transparent intake, readiness, and sponsorship.',
  keywords:
    'Free For Charity roadmap, nonprofit intake, charity sponsorship, FFC queue, volunteer admin, charity website pipeline',
  alternates: { canonical: 'https://ffcadmin.org/roadmap/' },
}

export default function RoadmapPage() {
  const data = loadRoadmap()
  const review = sectionEntries(data, 'review')
  const needsAdmin = sectionEntries(data, 'needs-admin')
  const active = sectionEntries(data, 'active')
  const launched = sectionEntries(data, 'launched')
  const graduated = graduatedCount(data)

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Roadmap' }]} />

      {/* Hero */}
      <div className="bg-ffc-gradient text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold md:text-4xl">The FFC Public Roadmap</h1>
          <p className="mt-3 max-w-3xl text-lg text-teal-50">
            Free For Charity grows charities through stages of digital maturity. This is the live
            queue — who has applied, who is waiting for a volunteer sponsor, what is being built,
            and what just launched.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/roadmap/submit"
              className="rounded-lg bg-white px-5 py-2.5 font-semibold text-teal-700 shadow-sm hover:bg-teal-50"
            >
              Submit a request
            </Link>
            <Link
              href="/roadmap/sponsor"
              className="rounded-lg border border-white/70 px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              Become a sponsoring admin
            </Link>
            <a
              href="#needs-admin"
              className="rounded-lg border border-white/70 px-5 py-2.5 font-semibold text-white hover:bg-white/10"
            >
              Browse the backlog
            </a>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <RoadmapSection
          id="review"
          heading="In application & verification review"
          description="FFC has received these applications and is reviewing mission fit and basic eligibility before offering products."
          entries={review}
          emptyMessage="No applications are awaiting review right now."
        />

        <RoadmapSection
          id="needs-admin"
          heading="Needs a sponsoring admin"
          description="Approved charities waiting for a verified volunteer to steward their build. Essential-mission and higher-readiness charities sort first; community votes (👍) break ties."
          entries={needsAdmin}
          emptyMessage="Every approved charity currently has a sponsor — check back soon."
        />

        <RoadmapSection
          id="active"
          heading="Active builds"
          description="Charities with a committed sponsoring admin, currently being built and configured."
          entries={active}
          emptyMessage="No active builds at the moment."
        />

        <RoadmapSection
          id="launched"
          heading="Recently launched"
          description="Charity sites that went live in the last 90 days. 🎉"
          entries={launched}
          emptyMessage="No launches in the last 90 days — yours could be next."
        />

        {/* Graduated alumni tile (Phase 2 page; placeholder in Phase 1A) */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">Graduated alumni</h2>
          <p className="mt-1 text-gray-600">
            <span className="text-2xl font-bold text-teal-700">{graduated}</span> charit
            {graduated === 1 ? 'y has' : 'ies have'} graduated to financial self-sustainability. A
            full alumni showcase is coming soon.
          </p>
        </section>

        <p className="text-center text-sm text-gray-400">
          {data.generatedAt
            ? `Roadmap data generated ${new Date(data.generatedAt).toLocaleString('en-US')}.`
            : 'Roadmap data not yet generated.'}{' '}
          Readiness is computed transparently — see the{' '}
          <Link href="/roadmap/methodology" className="text-blue-600 hover:underline">
            methodology
          </Link>
          .
        </p>
      </main>
    </div>
  )
}
