import type { CharityStage, MissionCategory, TierLabel } from '@/lib/readiness/types'
import type { RoadmapEntry, RoadmapSectionId } from './roadmapData'

const TIER_BADGE: Record<TierLabel, string> = {
  Mature: 'bg-emerald-100 text-emerald-800',
  Established: 'bg-teal-100 text-teal-800',
  Developing: 'bg-sky-100 text-sky-800',
  Foundational: 'bg-amber-100 text-amber-800',
  'Just getting started': 'bg-gray-100 text-gray-700',
}

const MISSION_BADGE: Record<MissionCategory, { label: string; className: string }> = {
  'basic-needs': { label: 'Basic needs', className: 'bg-orange-100 text-orange-800' },
  veterans: { label: 'Veterans / military', className: 'bg-indigo-100 text-indigo-800' },
  general: { label: 'General mission', className: 'bg-gray-100 text-gray-700' },
}

const STAGE_BADGE: Record<CharityStage, { label: string; className: string }> = {
  '501c3': { label: '501(c)(3)', className: 'bg-green-100 text-green-800' },
  'pre-501c3': { label: 'Pre-501(c)(3)', className: 'bg-blue-100 text-blue-800' },
  'non-pursuing': { label: 'Nonprofit project', className: 'bg-gray-100 text-gray-700' },
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}

function formatDate(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return ''
  return new Date(t).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface RoadmapCardProps {
  entry: RoadmapEntry
  section: RoadmapSectionId
}

/**
 * A single roadmap card. Content adapts to the section (§9): the needs-admin
 * queue surfaces the sponsor CTA + vote count; active builds show the
 * sponsoring admin; recently-launched links to the live site.
 */
export default function RoadmapCard({ entry, section }: RoadmapCardProps) {
  const mission = MISSION_BADGE[entry.missionCategory]
  const stage = STAGE_BADGE[entry.charityStage]
  const accent = entry.missionCategory === 'basic-needs' ? 'border-orange-300' : 'border-gray-200'

  return (
    <article className={`flex flex-col rounded-xl border ${accent} bg-white p-5 shadow-sm`}>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {entry.readinessTier ? (
          <>
            <Badge className={stage.className}>{stage.label}</Badge>
            <Badge className={mission.className}>{mission.label}</Badge>
            <Badge className={TIER_BADGE[entry.readinessTier]}>{entry.readinessTier}</Badge>
          </>
        ) : (
          // Portfolio entry: stage/mission are placeholders until intake, so we
          // show only what we actually know rather than asserting them.
          <>
            <Badge className="bg-emerald-100 text-emerald-800">Live site</Badge>
            <Badge className="bg-gray-100 text-gray-500">Readiness pending</Badge>
          </>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{entry.charityName}</h3>
      {entry.missionExcerpt && (
        <p className="mt-1 text-sm text-gray-600 line-clamp-3">{entry.missionExcerpt}</p>
      )}

      <dl className="mt-3 space-y-1 text-sm text-gray-500">
        <div className="flex gap-1">
          <dt className="font-medium text-gray-600">Seeking:</dt>
          <dd>{entry.serviceTier}</dd>
        </div>
        {entry.ein && (
          <div className="flex gap-1">
            <dt className="font-medium text-gray-600">EIN:</dt>
            <dd>{entry.ein}</dd>
          </div>
        )}
        {entry.candidUrl && (
          <div className="flex gap-1">
            <dt className="font-medium text-gray-600">Transparency:</dt>
            <dd>
              <a
                href={entry.candidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-700 hover:text-blue-900"
              >
                Candid / GuideStar profile ↗
              </a>
            </dd>
          </div>
        )}
        {section === 'review' && entry.submittedAt && (
          <div className="flex gap-1">
            <dt className="font-medium text-gray-600">Submitted:</dt>
            <dd>{formatDate(entry.submittedAt)}</dd>
          </div>
        )}
      </dl>

      {entry.sponsor && (
        <a
          href={entry.sponsor.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.sponsor.avatarUrl}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
          />
          <span>
            Sponsored by <span className="font-medium">@{entry.sponsor.handle}</span>
          </span>
        </a>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="text-sm text-gray-500">
          {section === 'needs-admin' && (
            <span aria-label={`${entry.plusOne} community votes`}>👍 {entry.plusOne}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {section === 'launched' && entry.liveUrl && (
            <a
              href={entry.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-700 hover:text-emerald-900"
            >
              Visit site ↗
            </a>
          )}
          {section === 'needs-admin' ? (
            <a
              href={entry.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-3 py-1.5 font-semibold text-white hover:opacity-90"
            >
              Sponsor this site
            </a>
          ) : (
            // Only link to GitHub for entries backed by a real issue; portfolio
            // entries have no issue (issueUrl is the site), so "Visit site" suffices.
            entry.issueNumber > 0 && (
              <a
                href={entry.issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-700 hover:text-blue-900"
              >
                {section === 'active' ? 'Follow progress' : 'View on GitHub'} ↗
              </a>
            )
          )}
        </div>
      </div>
    </article>
  )
}

export { Badge }
