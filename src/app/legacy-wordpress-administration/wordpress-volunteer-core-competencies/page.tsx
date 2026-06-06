import Link from 'next/link'
import type { Metadata } from 'next'
import LeafPageShell from '@/components/legacy-wordpress-administration/LeafPageShell'
import { getLegacyWpAdminPageBySlug } from '@/data/legacy-wordpress-administration'

const SLUG = 'wordpress-volunteer-core-competencies'
const page = getLegacyWpAdminPageBySlug(SLUG)

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
  alternates: {
    canonical: `https://ffcadmin.org/legacy-wordpress-administration/${SLUG}/`,
  },
  keywords:
    'FFC volunteer proving ground, core competencies, LastPass, AI assistants, MS-900, MS-700, OneDrive, Planner, Microsoft 365',
}

interface Module {
  id: string
  index: number
  name: string
  duration: string
  purpose: string
  keyConcept: string
  proficiencyTask: string
  resources: string[]
  modernNotes: string
}

const modules: Module[] = [
  {
    id: 'lastpass',
    index: 1,
    name: 'LastPass — Security Standard',
    duration: '1-2 hours',
    purpose: 'Establish secure password management as the foundation for all FFC system access.',
    keyConcept:
      'Volunteers handle nonprofit-client data. Protecting that data is the highest priority — never share credentials over email or text.',
    proficiencyTask: 'Explain why sharing passwords through email or text poses security risks.',
    resources: [
      'LastPass 101 official video',
      'LastPass User Training portal',
      'LastPass Authenticator app (MFA requirement)',
    ],
    modernNotes:
      'FFC is evaluating Bitwarden / 1Password Teams as the post-LastPass replacement. Either way, the password-hygiene competency stays the same.',
  },
  {
    id: 'ai-assistants',
    index: 2,
    name: 'Introduction to AI Assistants',
    duration: '2-4 hours',
    purpose: 'Master generative AI tools as learning accelerators for every subsequent module.',
    keyConcept:
      'AI assistants enable self-directed learning — a critical volunteer skill since FFC cannot run synchronous training for every charity-side task.',
    proficiencyTask:
      'List four key elements of an effective AI prompt (context, role, constraints, output format).',
    resources: [
      'Microsoft Copilot tutorial',
      'Google Gemini overview',
      'Mobile app access for both platforms',
    ],
    modernNotes:
      'Update: Claude and GPT-class models are now the FFC primary recommendation; Copilot / Gemini remain acceptable. Prompt-engineering principles unchanged.',
  },
  {
    id: 'ms-900',
    index: 3,
    name: 'MS-900 — Microsoft 365 Fundamentals',
    duration: '12-16 hours',
    purpose: 'Foundational knowledge of M365 cloud services, apps, security, and compliance.',
    keyConcept:
      'FFC operational infrastructure is built on the Microsoft 365 platform. Every volunteer must understand the basics.',
    proficiencyTask:
      'Explain the primary difference between Microsoft 365 and Office 365 (subscription bundle vs. productivity-app suite).',
    resources: [
      'Microsoft Learn self-paced course',
      'Official MS-900 study guide',
      'Optional: certification exam funding available case-by-case',
    ],
    modernNotes:
      'Required for the Global Admin training plan. See /training-plan for the full progression beyond MS-900.',
  },
  {
    id: 'ms-700',
    index: 4,
    name: 'MS-700 — Teams Administration Fundamentals',
    duration: '8-12 hours',
    purpose: 'Microsoft Teams admin: teams, channels, governance, integrations.',
    keyConcept:
      'Teams is the central FFC collaboration hub. Volunteers must understand governance before getting admin rights.',
    proficiencyTask:
      'Differentiate between standard, private, and shared channels; provide a use case for each.',
    resources: [
      'Microsoft Teams Quick Start video training',
      'MS-700 official learning path',
      'MS-700 study guide',
      'Optional: certification exam funding available case-by-case',
    ],
    modernNotes:
      'Stage 2 of the Global Admin training plan. The exam itself is optional; the competency is mandatory.',
  },
  {
    id: 'onedrive',
    index: 5,
    name: 'Microsoft OneDrive — Shared File System',
    duration: '2 hours',
    purpose: 'Document access, organization, and secure sharing within FFC systems.',
    keyConcept:
      'OneDrive is the FFC single source of truth for all official documents. No charity work in personal Drive / Dropbox.',
    proficiencyTask:
      'Describe the steps to share a file with "View Only" permissions, including link expiry and required-sign-in options.',
    resources: [
      'OneDrive video basics',
      'OneDrive Quickstart Guide (PDF)',
      'OneDrive Help & Learning Center',
    ],
    modernNotes:
      'Pairs with SharePoint for the FFC team library. Volunteers join the shared library after completing this module.',
  },
  {
    id: 'planner',
    index: 6,
    name: 'Microsoft Planner — Task Management in Teams',
    duration: '2 hours',
    purpose: 'Task creation, management, and tracking for individual + team projects.',
    keyConcept:
      'Planner provides clear visibility into project progress and integrates with Teams as a tab.',
    proficiencyTask:
      'Explain the difference between a Bucket and a Task; describe how each is used to organize a charity engagement.',
    resources: ['Microsoft Planner video training', 'Planner integration guide for Teams'],
    modernNotes:
      'Project management for individual charity engagements. The FFC backlog itself is tracked in GitHub Issues / Projects.',
  },
  {
    id: 'm365-apps',
    index: 7,
    name: 'Microsoft 365 Apps Quick Start',
    duration: '6-8 hours',
    purpose: 'Baseline proficiency in Word, Excel, and PowerPoint web applications.',
    keyConcept:
      'These apps are the universal standard for creating and sharing professional documents with partner charities.',
    proficiencyTask:
      'Explain how to share a document from any Microsoft 365 web app (Share button → permissions → link options).',
    resources: ['Microsoft 365 Quick Starts official hub'],
    modernNotes:
      'Volunteers entering through the Canva Designer path follow a parallel competency in Canva Pro instead of PowerPoint.',
  },
]

const totalHoursLow = modules.reduce((sum, m) => sum + parseInt(m.duration.split('-')[0], 10), 0)
const totalHoursHigh = modules.reduce(
  (sum, m) => sum + parseInt(m.duration.split('-')[1] ?? m.duration.split('-')[0], 10),
  0
)

export default function Page() {
  return (
    <LeafPageShell page={page}>
      <p>
        FFC volunteers complete seven proving-ground modules before getting admin access to
        partner-charity systems. The program is{' '}
        <strong>
          {totalHoursLow}-{totalHoursHigh} hours total
        </strong>{' '}
        and emphasizes mastery over speed — time estimates are learning guides, not deadlines.
      </p>

      <p>
        Charity-facing version:{' '}
        <a href={page.publicSourceUrl} target="_blank" rel="noopener noreferrer">
          freeforcharity.org/ffc-volunteer-proving-ground-core-competencies/
        </a>
        .
      </p>

      <h2>Why the proving ground exists</h2>
      <p>
        Rigorous training ensures only the most dedicated and capable individuals get access to FFC
        internal systems and partner-charity data. Completing all seven modules demonstrates
        commitment and prepares a volunteer for real-world impact.
      </p>

      <h2>The seven modules</h2>
      <ol>
        {modules.map((m) => (
          <li key={m.id}>
            <a href={`#${m.id}`}>
              Module {m.index} — {m.name}
            </a>{' '}
            ({m.duration})
          </li>
        ))}
      </ol>

      {modules.map((module) => (
        <section key={module.id} id={module.id}>
          <h3>
            Module {module.index} &mdash; {module.name}
          </h3>
          <p>
            <strong>Duration:</strong> {module.duration}
          </p>
          <p>
            <strong>Purpose:</strong> {module.purpose}
          </p>
          <p>
            <strong>Key concept:</strong> {module.keyConcept}
          </p>
          <p>
            <strong>Proficiency task:</strong> {module.proficiencyTask}
          </p>
          <p>
            <strong>Resources:</strong>
          </p>
          <ul>
            {module.resources.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p>
            <strong>Modern notes:</strong> {module.modernNotes}
          </p>
        </section>
      ))}

      <h2>What comes after</h2>
      <p>
        Volunteers who complete the proving ground graduate into the{' '}
        <Link href="/contributor-ladder">contributor ladder</Link> and pick one of the two modern
        training paths:
      </p>
      <ul>
        <li>
          <Link href="/training-plan">Global Administrator</Link> — Microsoft 365 + GitHub + DNS
          administration.
        </li>
        <li>
          <Link href="/canva-designer-path">Canva Designer</Link> — brand identities + marketing
          materials for charities.
        </li>
      </ul>

      <h2>Cross-references</h2>
      <ul>
        <li>
          <Link href="/legacy-wordpress-administration/wordpress-training-programs/">
            wordpress-training-programs
          </Link>{' '}
          — the broader catalog this proving ground sits inside.
        </li>
        <li>
          <Link href="/legacy-wordpress-administration/wordpress-web-developer-training/">
            wordpress-web-developer-training
          </Link>{' '}
          — the developer-specific platform tour that follows the proving ground.
        </li>
        <li>
          <Link href="/contributor-ladder">/contributor-ladder</Link> — modern progression path
          beyond the proving ground.
        </li>
      </ul>
    </LeafPageShell>
  )
}
