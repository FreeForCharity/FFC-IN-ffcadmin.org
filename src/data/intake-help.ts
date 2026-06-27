/**
 * Registry for the /intake-help section — single source of truth for the
 * sidebar, the hub landing grid, and cross-links. Each leaf page renders its
 * own body inside <IntakeHelpShell page={page}>.
 *
 * `full: true` pages carry substantive first-pass content; the rest are short
 * stubs the intake form links to (no 404s) and fill in over time.
 */

export interface IntakeHelpPage {
  slug: string
  title: string
  shortLabel: string
  summary: string
  category: IntakeHelpCategoryId
  full: boolean
}

export type IntakeHelpCategoryId = 'get-started' | 'governance-contact' | 'compliance'

export const INTAKE_HELP_BASE = '/intake-help'

export const INTAKE_HELP_CATEGORIES: { id: IntakeHelpCategoryId; label: string }[] = [
  { id: 'get-started', label: 'Get started' },
  { id: 'governance-contact', label: 'Governance & contact' },
  { id: 'compliance', label: 'Compliance & transparency' },
]

export const INTAKE_HELP_PAGES: IntakeHelpPage[] = [
  {
    slug: 'mission-statement',
    title: 'Writing a strong mission statement',
    shortLabel: 'Mission statement',
    summary: 'What makes a mission statement clear, credible, and fundable.',
    category: 'get-started',
    full: false,
  },
  {
    slug: 'getting-501c3',
    title: 'Getting to 501(c)(3)',
    shortLabel: 'Getting to 501(c)(3)',
    summary: 'For charities not yet incorporated or not yet tax-exempt.',
    category: 'get-started',
    full: false,
  },
  {
    slug: 'board-requirements',
    title: 'Board requirements',
    shortLabel: 'Board requirements',
    summary: 'Why FFC asks for three named officers with LinkedIn URLs — and how to get there.',
    category: 'governance-contact',
    full: true,
  },
  {
    slug: 'public-contact-info',
    title: 'Public contact information',
    shortLabel: 'Public contact info',
    summary: 'Email and phone options ranked, with step-by-step setup for org-owned numbers.',
    category: 'governance-contact',
    full: true,
  },
  {
    slug: 'mailing-address',
    title: 'Choosing a mailing address',
    shortLabel: 'Mailing address',
    summary: 'PO box vs. commercial mailbox vs. registered agent, and why FFC uses Northwest.',
    category: 'governance-contact',
    full: true,
  },
  {
    slug: 'social-media',
    title: 'Setting up social media',
    shortLabel: 'Social media',
    summary: 'Which platforms matter and how to set up org-owned accounts.',
    category: 'governance-contact',
    full: false,
  },
  {
    slug: 'guidestar-candid',
    title: 'Candid / GuideStar transparency',
    shortLabel: 'Candid / GuideStar',
    summary: 'Reaching the Gold Seal of Transparency — FFC’s minimum for 501(c)(3) charities.',
    category: 'compliance',
    full: false,
  },
  {
    slug: '501c3-application',
    title: 'Form 1023 vs. 1023-EZ',
    shortLabel: '501(c)(3) application',
    summary: 'Which form, what timelines, and what FFC offers while you wait.',
    category: 'compliance',
    full: false,
  },
  {
    slug: 'fiscal-sponsorship',
    title: 'Fiscal sponsorship policy',
    shortLabel: 'Fiscal sponsorship',
    summary: 'FFC’s policy on fiscal sponsors and franchise/affiliate charities.',
    category: 'compliance',
    full: false,
  },
  {
    slug: 'policy-pages',
    title: 'Policy pages',
    shortLabel: 'Policy pages',
    summary: 'Donation, privacy, terms, vulnerability disclosure, and security acknowledgement.',
    category: 'compliance',
    full: false,
  },
  {
    slug: 'supporting-documents',
    title: 'Sharing supporting documents',
    shortLabel: 'Supporting documents',
    summary: 'What to share where — public issues vs. private channels.',
    category: 'compliance',
    full: false,
  },
]

export function getIntakeHelpPage(slug: string): IntakeHelpPage | undefined {
  return INTAKE_HELP_PAGES.find((p) => p.slug === slug)
}

export function intakeHelpPagesByCategory(category: IntakeHelpCategoryId): IntakeHelpPage[] {
  return INTAKE_HELP_PAGES.filter((p) => p.category === category)
}
