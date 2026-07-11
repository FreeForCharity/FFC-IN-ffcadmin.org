import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadRoadmap } from '../roadmap/roadmapData'
import { PIPELINE_STAGES, groupByStage } from './pipelineData'

export const metadata: Metadata = {
  title: 'Charity Pipeline',
  description:
    'Which gate of the FFC journey each charity is at — applied, approved, website building, validated, domain live, email — so stalls are visible at a glance.',
  keywords:
    'Free For Charity pipeline, charity gates, nonprofit website pipeline, FFC delivery stages, charity journey',
  alternates: { canonical: 'https://ffcadmin.org/pipeline/' },
  openGraph: {
    type: 'website',
    title: 'The FFC Charity Pipeline — every charity, by gate',
    description:
      'See which gate of the gated FFC journey each charity is at, from application through validated website to live domain.',
    url: 'https://ffcadmin.org/pipeline/',
  },
}

export default function PipelinePage() {
  const data = loadRoadmap()
  const groups = groupByStage(data.entries)
  const total = data.entries.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Pipeline' }]} />

      {/* Hero */}
      <div className="bg-ffc-gradient text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold md:text-4xl">The FFC Charity Pipeline</h1>
          <p className="mt-3 max-w-3xl text-lg text-teal-50">
            Every charity FFC is helping, grouped by the gate it is at in the gated journey: applied
            → approved → website building → validated → domain → email. A charity sitting in one
            column too long is a stall worth investigating.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        {/* Stage summary strip */}
        <section
          aria-label="Stage totals"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
        >
          {PIPELINE_STAGES.map((stage) => (
            <a
              key={stage.id}
              href={`#${stage.id}`}
              className="rounded-xl border border-gray-200 bg-white p-4 text-center hover:border-teal-300"
            >
              <div className="text-2xl font-bold text-teal-700">{groups[stage.id].length}</div>
              <div className="mt-1 text-sm font-semibold text-gray-700">{stage.label}</div>
            </a>
          ))}
        </section>

        {PIPELINE_STAGES.map((stage) => (
          <section key={stage.id} id={stage.id} className="scroll-mt-24">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{stage.label}</h2>
              <span className="text-sm font-semibold text-gray-500">{groups[stage.id].length}</span>
            </div>
            <p className="mt-1 max-w-3xl text-gray-600">{stage.description}</p>

            {groups[stage.id].length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500">
                No charities at this stage right now.
              </p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups[stage.id].map((entry) => (
                  <li
                    key={`${entry.issueNumber}-${entry.charityName}`}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="font-semibold text-gray-900">{entry.charityName}</div>
                    <div className="mt-1 text-sm text-gray-500">{stage.label}</div>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      {entry.issueNumber > 0 && (
                        <a
                          href={entry.issueUrl}
                          className="font-medium text-teal-700 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Intake issue #{entry.issueNumber}
                        </a>
                      )}
                      {entry.liveUrl && (
                        <a
                          href={entry.liveUrl}
                          className="font-medium text-teal-700 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live site
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="text-center text-sm text-gray-400">
          {total} {total === 1 ? 'charity' : 'charities'} tracked.{' '}
          {data.generatedAt
            ? `Data generated ${new Date(data.generatedAt).toLocaleString('en-US')}.`
            : 'Pipeline data not yet generated.'}{' '}
          Sourced from the same snapshot as the{' '}
          <Link href="/roadmap" className="text-teal-700 hover:underline">
            public roadmap
          </Link>
          .
        </p>
      </main>
    </div>
  )
}
