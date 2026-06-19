/**
 * Volunteer recruitment landing pages (#189).
 *
 * Each entry renders a keyword-tuned landing page at /volunteer/<slug> via the
 * dynamic route src/app/volunteer/[role]/page.tsx. Keep these focused on
 * recruitment intent; the deep curriculum lives in the training tracks.
 */

export interface VolunteerRole {
  slug: string
  /** Page <h1> + nav/breadcrumb label. */
  title: string
  tagline: string
  intro: string
  keywords: string
  responsibilities: string[]
  /** Where the "start" CTA points (a training track or the dev-env hub). */
  startHref: string
  startLabel: string
  /**
   * LearningPath id (src/data/training-modules.ts) this role maps to, used to
   * surface the same "Before you start" account prerequisites as the track.
   * Omitted for cross-role entries (e.g. military) that span every track.
   */
  pathId?: string
  gradient: string
  icon: string
}

export const VOLUNTEER_ROLES: VolunteerRole[] = [
  {
    slug: 'web-developer',
    title: 'Web Developer Volunteer',
    tagline: 'Build and maintain charity websites with an AI agent',
    intro:
      'Help nonprofits get a fast, modern website by building and updating Next.js sites with your AI agent — describe changes in plain English, open pull requests, and let CI handle the checks. No heavy local setup required.',
    keywords:
      'volunteer web developer nonprofit, Next.js volunteer, React volunteer, AI agent developer, GitHub volunteer, free nonprofit website developer',
    responsibilities: [
      'Build and customize charity sites from the FFC template',
      'Run the Issue → PR → merge workflow with your AI agent',
      'Keep sites accessible, fast, and secure',
      'Help charity owners hand off to self-service editing',
    ],
    startHref: '/training/web-developer',
    pathId: 'web-developer',
    startLabel: 'Start the Web Developer track',
    gradient: 'from-blue-500 to-indigo-600',
    icon: '💻',
  },
  {
    slug: 'microsoft-365-admin',
    title: 'Microsoft 365 Administrator Volunteer',
    tagline: 'Run email, identity, and security for charities',
    intro:
      'Administer Microsoft 365 for nonprofits — mailboxes, identity, MFA, and security baselines — and earn the MS-900 certification along the way. This is the infrastructure backbone every charity relies on.',
    keywords:
      'Microsoft 365 admin volunteer, MS-900 volunteer, nonprofit IT volunteer, Entra ID volunteer, email administration volunteer',
    responsibilities: [
      'Provision mailboxes, licenses, and security policies',
      'Enforce MFA and Conditional Access',
      'Manage compliance and data retention',
      'Earn MS-900 (FFC sponsors the exam)',
    ],
    startHref: '/training-plan',
    pathId: 'global-admin',
    startLabel: 'Start the Microsoft 365 Administrator track',
    gradient: 'from-teal-500 to-emerald-600',
    icon: '🛡️',
  },
  {
    slug: 'google-workspace-admin',
    title: 'Google Workspace Administrator Volunteer',
    tagline: 'Manage Google Workspace for charities',
    intro:
      'Set up and run Google Workspace for nonprofits — accounts, groups, sharing, and security. A first-class role that used to be folded into general admin work.',
    keywords:
      'Google Workspace admin volunteer, GSuite nonprofit volunteer, Google admin volunteer, nonprofit Google Workspace',
    responsibilities: [
      'Provision users, groups, and shared drives',
      'Configure security and sharing controls',
      'Support charity staff on Workspace tools',
      'Coordinate with the analytics and web roles',
    ],
    startHref: '/training/google-workspace-admin',
    pathId: 'google-workspace-admin',
    startLabel: 'Start the Google Workspace track',
    gradient: 'from-amber-500 to-orange-600',
    icon: '🗂️',
  },
  {
    slug: 'data-analytics',
    title: 'Data & Analytics Volunteer',
    tagline: 'Measure impact with analytics and dashboards',
    intro:
      'Help charities understand their reach — set up analytics (GA4 / Tag Manager), build impact dashboards, and turn data into clear reporting. Deeply connected to the initial website build.',
    keywords:
      'data analytics volunteer, Google Analytics volunteer, GA4 volunteer, nonprofit data volunteer, impact reporting volunteer',
    responsibilities: [
      'Configure analytics and event tracking (consent-gated)',
      'Build dashboards and impact reports',
      'Maintain on-page SEO and search presence',
      'Partner with web developers during site builds',
    ],
    startHref: '/training/data-analytics',
    pathId: 'data-analytics',
    startLabel: 'Start the Data & Analytics track',
    gradient: 'from-violet-500 to-purple-600',
    icon: '📈',
  },
  {
    slug: 'canva-designer',
    title: 'Canva Designer Volunteer',
    tagline: 'Create brand identities and marketing materials',
    intro:
      'Design professional brand kits, social templates, and marketing collateral for nonprofits using Canva Pro — and earn Canva Design School recognition.',
    keywords:
      'Canva designer volunteer, nonprofit graphic design volunteer, brand kit volunteer, Canva Pro volunteer',
    responsibilities: [
      'Build complete brand kits and style guides',
      'Create social media and email templates',
      'Design print and marketing collateral',
      'Complete Canva Design School courses',
    ],
    startHref: '/canva-designer-path',
    pathId: 'designer',
    startLabel: 'Start the Designer path',
    gradient: 'from-orange-500 to-amber-500',
    icon: '🎨',
  },
  {
    slug: 'military-volunteers',
    title: 'Military Volunteers (MOVSM)',
    tagline: 'Serve charities and earn recognition for it',
    intro:
      'Service members who perform sustained volunteer work for charities may qualify for the Military Outstanding Volunteer Service Medal (MOVSM). FFC welcomes military volunteers across every role and can help document your qualifying hours.',
    keywords:
      'military volunteer, MOVSM, Military Outstanding Volunteer Service Medal, service member volunteer, veteran volunteer nonprofit',
    responsibilities: [
      'Contribute in any FFC role (dev, admin, design, analytics)',
      'Track qualifying volunteer hours (self-report + board attestation)',
      'Work toward MOVSM eligibility',
      'Get started by texting FFC to find your fit',
    ],
    startHref: '/movsm',
    startLabel: 'Learn about the MOVSM',
    gradient: 'from-slate-600 to-slate-800',
    icon: '🎖️',
  },
]

export function getVolunteerRole(slug: string): VolunteerRole | undefined {
  return VOLUNTEER_ROLES.find((r) => r.slug === slug)
}
