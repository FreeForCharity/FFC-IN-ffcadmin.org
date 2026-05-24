import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-training-programs'
const page = getLegacyWpAdminPageBySlug(SLUG)!

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'FFC training programs, volunteer pipeline, researcher, business analyst, web developer, nonprofit skills',
}

interface Program {
  id: string
  name: string
  level: string
  description: string
  salaryRange: string
  intakeNotes: string
  modernEquivalent: { label: string; href: string } | null
}

const programs: Program[] = [
  {
    id: 'researchers',
    name: 'Researchers',
    level: 'Entry to mid-level',
    description:
      'Move beyond casual web searches to professional data-collection and research methodology. Output feeds the FFC service / technology / consultant directories on freeforcharity.org.',
    salaryRange: '$24,000 – $52,000 (average $31,000)',
    intakeNotes:
      'Lowest barrier to entry of the three legacy tracks. Today this work is covered by the Global Admin path and a research-flavoured contributor ladder rung.',
    modernEquivalent: { label: 'Contributor ladder', href: '/contributor-ladder' },
  },
  {
    id: 'business-analysts',
    name: 'Business Analysts',
    level: 'Entry to high-level',
    description:
      'Translate research into recommendations — pick the right tool for the charity, the right plan tier, the right vendor. Closest legacy analogue to product management.',
    salaryRange: '~$52,898 annually',
    intakeNotes:
      'Required Excel, Word, and PowerPoint then. Required equivalent in Google Workspace / Microsoft 365 now. Modern FFC absorbs this into the Global Admin training plan.',
    modernEquivalent: { label: 'Training plan', href: '/training-plan' },
  },
  {
    id: 'web-developers',
    name: 'Web Developers',
    level: 'Entry to high-level',
    description:
      'Build and ship charity sites. The legacy curriculum centred on PHP and Divi; the modern curriculum centres on Next.js, GitHub Pages, and Cloudflare.',
    salaryRange: '~$69,781 annually (full-time positions)',
    intakeNotes:
      'Volunteers entering through this track today should be routed to the Web Developer training guide and the WordPress-to-Next.js conversion guide.',
    modernEquivalent: {
      label: 'Web developer training (WordPress era)',
      href: '/legacy-wordpress-administration/wordpress-web-developer-training',
    },
  },
]

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        FFC&apos;s legacy training catalogue defined three volunteer tracks — Researchers, Business
        Analysts, and Web Developers — built around a &ldquo;win-win-win&rdquo; model: volunteers
        gain portfolio-grade skills, partner charities receive needed work at no cost, and FFC
        builds sector capacity.
      </p>

      <p>
        The charity-facing version of this page lives at{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/free-training-programs/
        </a>{' '}
        and is targeted at prospective volunteers. This page is the operations-team view: what the
        legacy tracks were, what their modern equivalents are, and where to send incoming volunteers
        today.
      </p>

      <h2>How to use this page</h2>
      <p>
        If a new volunteer asks &ldquo;which track should I follow,&rdquo; route them to the modern
        equivalent in the table below. The legacy track descriptions remain useful for framing the
        salary outcomes and the win-win-win pitch — those numbers come from US Bureau of Labor
        Statistics data and still hold up.
      </p>

      <h2>The three legacy tracks</h2>

      {programs.map((program) => (
        <section key={program.id} id={program.id}>
          <h3>{program.name}</h3>
          <p>
            <strong>Level:</strong> {program.level}
          </p>
          <p>
            <strong>What the track did:</strong> {program.description}
          </p>
          <p>
            <strong>Reference salary range:</strong> {program.salaryRange}
          </p>
          <p>
            <strong>Intake notes:</strong> {program.intakeNotes}
          </p>
          {program.modernEquivalent && (
            <p>
              <strong>Modern equivalent:</strong>{' '}
              <a href={program.modernEquivalent.href}>{program.modernEquivalent.label}</a>
            </p>
          )}
        </section>
      ))}

      <h2>FAQ — legacy answers, modern context</h2>

      <h3>Will employers value the experience?</h3>
      <p>
        Yes — every FFC engagement produces a shipped artefact (site, directory entry, audit
        report). Volunteers leave with public links to point at, not just certificate PDFs. That has
        been the consistent feedback from hiring managers since the legacy tracks launched.
      </p>

      <h3>Does it cost anything?</h3>
      <p>
        No. FFC operates on a donation-supported model. Successful charity engagements generate
        sponsorships that fund the next intake cohort.
      </p>

      <h3>Eligibility?</h3>
      <p>
        Two requirements: motivation to learn and commitment to ship work that actually helps a
        charity. Selection prioritises candidates who show up consistently to the weekly stand-ups
        and finish their first project before chasing the next one.
      </p>

      <h2>Where to point volunteers today</h2>
      <p>
        The modern FFC volunteer pipeline starts at <a href="/get-involved">/get-involved</a>,
        splits into the Global Administrator and Canva Designer paths, and progresses through the{' '}
        <a href="/contributor-ladder">contributor ladder</a>. The legacy three-track catalogue feeds
        into those paths but is no longer the primary intake.
      </p>
    </LeafPageShell>
  )
}
