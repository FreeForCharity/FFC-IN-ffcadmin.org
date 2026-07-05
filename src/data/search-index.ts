/**
 * Global site search index.
 *
 * A single, flat list of every meaningful page on the site, aggregated from the
 * existing data modules (so titles/descriptions stay in one place and don't
 * drift) plus a curated list of standalone pages that aren't backed by a data
 * module. Consumed by the header `GlobalSearch` component.
 *
 * Adding a page: if it belongs to one of the aggregated data modules (blog,
 * guides, intake-help, volunteer roles, legacy WP admin, CE bodies) it appears
 * here automatically. Otherwise add it to `STANDALONE_PAGES` below.
 */
import { blogPosts } from './blog'
import { guides } from './guides'
import { SETUP_GUIDES } from './setup-guides'
import { INTAKE_HELP_PAGES, INTAKE_HELP_BASE } from './intake-help'
import { VOLUNTEER_ROLES } from './volunteer-roles'
import { LEGACY_WP_ADMIN_PAGES, LEGACY_WP_ADMIN_BASE } from './legacy-wordpress-administration'
import { CE_BODIES } from './ce-bodies'
import { NAV_MENUS } from './navigation'

export interface SearchDoc {
  title: string
  description: string
  href: string
  /** Human-readable grouping shown as a chip in results. */
  category: string
  /** Extra terms to match on that aren't in the title/description. */
  keywords?: string
}

/** Map a nav section heading to a search category label. */
const NAV_SECTION_CATEGORY: Record<string, string> = {
  'Get involved': 'Volunteer',
  'Training tracks': 'Training',
  Operations: 'Operations',
  Resources: 'Resources',
}

// Pages that aren't backed by a data module (hubs, policies, single pages).
const STANDALONE_PAGES: SearchDoc[] = [
  {
    title: 'Home',
    description:
      'The Free For Charity volunteer & admin portal — training, operations, and the public roadmap.',
    href: '/',
    category: 'Main',
    keywords: 'home start portal ffc admin',
  },
  {
    title: 'Public Roadmap',
    description:
      'Every charity FFC is helping — in review, awaiting a sponsor, in active build, and launched.',
    href: '/roadmap',
    category: 'Roadmap',
    keywords: 'transparency queue charities status pipeline',
  },
  {
    title: 'Submit a request',
    description:
      'Apply for FFC service, request another service, or file a question or escalation.',
    href: '/roadmap/submit',
    category: 'Roadmap',
    keywords: 'apply application intake escalation request',
  },
  {
    title: 'Become a sponsoring admin',
    description: 'Steward a charity build as a verified volunteer sponsor.',
    href: '/roadmap/sponsor',
    category: 'Roadmap',
    keywords: 'sponsor sponsoring admin steward volunteer',
  },
  {
    title: 'Readiness methodology',
    description: 'How FFC scores charity readiness transparently and sorts the queue.',
    href: '/roadmap/methodology',
    category: 'Roadmap',
    keywords: 'readiness scoring methodology tiers sort',
  },
  {
    title: 'Intake Help',
    description: 'Guides for charities completing FFC intake — board, contact info, and more.',
    href: '/intake-help',
    category: 'For charities',
    keywords: 'intake help charity onboarding requirements',
  },
  {
    title: 'Manage my charity site',
    description: 'Edit and maintain the FFC-built website for your charity.',
    href: '/site-owner',
    category: 'Site owners',
    keywords: 'site owner edit manage my site charity website',
  },
  {
    title: 'Accept your site invitation',
    description: 'Set up access to manage your charity website.',
    href: '/site-owner/accept-invitation',
    category: 'Site owners',
    keywords: 'invitation invite access onboarding github',
  },
  {
    title: 'Common site edits',
    description:
      'Ready-to-paste prompts for the most common charity website edits — contact info, hours, donate button, photos, and more.',
    href: '/site-owner/common-edits',
    category: 'Site owners',
    keywords: 'edits prompts contact hours donate photos team social',
  },
  {
    title: 'Claude Desktop setup',
    description: 'Set up Claude Desktop as your AI coding assistant for FFC work.',
    href: '/developer-environment-setup/claude-desktop',
    category: 'Resources',
    keywords: 'claude desktop ai assistant setup environment',
  },
  {
    title: 'Codex setup',
    description: 'Set up OpenAI Codex as your AI coding assistant for FFC work.',
    href: '/developer-environment-setup/codex',
    category: 'Resources',
    keywords: 'codex openai ai assistant setup environment',
  },
  {
    title: 'Google Antigravity setup',
    description: 'Set up Google Antigravity as your AI coding assistant for FFC work.',
    href: '/developer-environment-setup/google-antigravity',
    category: 'Resources',
    keywords: 'google antigravity gemini ai assistant setup environment',
  },
  {
    title: 'VS Code setup',
    description: 'Set up VS Code with Copilot for FFC development.',
    href: '/developer-environment-setup/vscode',
    category: 'Resources',
    keywords: 'vscode visual studio code copilot ai setup environment',
  },
  {
    title: 'Agent Session Inventory',
    description:
      'Org-wide inventory of AI agent PR sessions across all FreeForCharity public repositories.',
    href: '/agentic-os/session-inventory',
    category: 'Operations',
    keywords: 'agent sessions claude copilot inventory dashboard ai transparency',
  },
  {
    title: 'Agentic OS Architecture',
    description:
      'Six capability layers across five repository planes, gaps, and the phased roadmap.',
    href: '/agentic-os/architecture',
    category: 'Operations',
    keywords: 'agentic os architecture layers planes roadmap governance mcp',
  },
  {
    title: 'Sites in development',
    description: 'FFC-managed charity sites currently being built.',
    href: '/sites-list/development',
    category: 'Operations',
    keywords: 'sites list development building',
  },
  {
    title: 'Sites in maintenance',
    description: 'FFC-managed charity sites in ongoing maintenance.',
    href: '/sites-list/maintenance',
    category: 'Operations',
    keywords: 'sites list maintenance',
  },
  {
    title: 'Sites in migration',
    description: 'FFC-managed charity sites migrating from WordPress to Next.js.',
    href: '/sites-list/migration',
    category: 'Operations',
    keywords: 'sites list migration wordpress nextjs',
  },
  {
    title: 'Sites list summary',
    description: 'Overview counts and health across all FFC-managed domains.',
    href: '/sites-list/summary',
    category: 'Operations',
    keywords: 'sites list summary counts health',
  },
  {
    title: 'Terms of Service',
    description: 'The terms governing use of FFC services and this site.',
    href: '/terms-of-service',
    category: 'Policies',
    keywords: 'terms of service legal policy',
  },
  {
    title: 'Privacy Policy',
    description: 'How FFC handles personal data and privacy.',
    href: '/privacy-policy',
    category: 'Policies',
    keywords: 'privacy data legal policy',
  },
  {
    title: 'Cookie Policy',
    description: 'How this site uses cookies.',
    href: '/cookie-policy',
    category: 'Policies',
    keywords: 'cookies tracking legal policy',
  },
  {
    title: 'Donation Policy',
    description: 'How FFC handles donations and financial transparency.',
    href: '/donation-policy',
    category: 'Policies',
    keywords: 'donation donate financial legal policy',
  },
  {
    title: 'Vulnerability Disclosure Policy',
    description: 'How to responsibly report a security vulnerability to FFC.',
    href: '/vulnerability-disclosure-policy',
    category: 'Policies',
    keywords: 'security vulnerability disclosure report responsible',
  },
  {
    title: 'Security Acknowledgements',
    description: 'Researchers recognized for responsibly disclosing security issues.',
    href: '/security-acknowledgements',
    category: 'Policies',
    keywords: 'security acknowledgements hall of fame researchers',
  },
]

// Hub/section pages driven by the nav mega-menus (single source of truth).
const NAV_PAGES: SearchDoc[] = NAV_MENUS.flatMap((menu) =>
  menu.sections.flatMap((section) =>
    section.items.map((item) => ({
      title: item.label,
      description: item.description,
      href: item.href,
      category: NAV_SECTION_CATEGORY[section.heading] ?? menu.label,
    }))
  )
)

const BLOG_PAGES: SearchDoc[] = blogPosts.map((post) => ({
  title: post.title,
  description: post.description,
  href: post.href,
  category: 'Blog',
}))

const GUIDE_PAGES: SearchDoc[] = guides.map((guide) => ({
  title: guide.title,
  description: guide.description,
  href: guide.href,
  category: 'Guides',
}))

const SETUP_GUIDE_PAGES: SearchDoc[] = SETUP_GUIDES.map((g) => ({
  title: g.title,
  description: g.description,
  href: `/guides/${g.slug}`,
  category: 'Account setup',
  keywords: `${g.category} ${g.audience}`,
}))

const INTAKE_HELP_SEARCH_PAGES: SearchDoc[] = INTAKE_HELP_PAGES.map((p) => ({
  title: p.title,
  description: p.summary,
  href: `${INTAKE_HELP_BASE}/${p.slug}`,
  category: 'For charities',
}))

const VOLUNTEER_ROLE_PAGES: SearchDoc[] = VOLUNTEER_ROLES.map((role) => ({
  title: role.title,
  description: role.tagline,
  href: `/volunteer/${role.slug}`,
  category: 'Volunteer',
  keywords: role.keywords,
}))

const LEGACY_WP_PAGES: SearchDoc[] = LEGACY_WP_ADMIN_PAGES.map((p) => ({
  title: p.title,
  description: p.summary,
  href: `${LEGACY_WP_ADMIN_BASE}/${p.slug}`,
  category: 'Legacy WP admin',
}))

const CE_PAGES: SearchDoc[] = CE_BODIES.filter((b) => b.landing).map((b) => ({
  title: b.landing!.title,
  description: b.landing!.description,
  href: `/continuing-education/${b.landing!.slug}`,
  category: 'Continuing education',
  keywords: b.name,
}))

/** Normalize an href for de-duplication (drop trailing slash, lowercase). */
function normalizeHref(href: string): string {
  const trimmed = href.replace(/\/+$/, '')
  return (trimmed === '' ? '/' : trimmed).toLowerCase()
}

/**
 * The full search index. Earlier entries win on duplicate href, so the curated
 * standalone/nav entries take precedence over auto-generated ones.
 */
export const SEARCH_DOCS: SearchDoc[] = (() => {
  const all = [
    ...STANDALONE_PAGES,
    ...NAV_PAGES,
    ...BLOG_PAGES,
    ...GUIDE_PAGES,
    ...SETUP_GUIDE_PAGES,
    ...INTAKE_HELP_SEARCH_PAGES,
    ...VOLUNTEER_ROLE_PAGES,
    ...LEGACY_WP_PAGES,
    ...CE_PAGES,
  ]
  const seen = new Set<string>()
  const deduped: SearchDoc[] = []
  for (const doc of all) {
    const key = normalizeHref(doc.href)
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(doc)
  }
  return deduped
})()

function scoreDoc(doc: SearchDoc, tokens: string[]): number {
  const title = doc.title.toLowerCase()
  const keywords = (doc.keywords ?? '').toLowerCase()
  const description = doc.description.toLowerCase()
  const category = doc.category.toLowerCase()
  let score = 0
  for (const token of tokens) {
    // AND semantics: every token must match somewhere in the doc.
    if (
      !title.includes(token) &&
      !keywords.includes(token) &&
      !description.includes(token) &&
      !category.includes(token)
    ) {
      return -1
    }
    if (title.startsWith(token)) score += 100
    else if (title.includes(token)) score += 60
    else if (keywords.includes(token)) score += 25
    else if (description.includes(token)) score += 12
    else score += 5 // category-only match
  }
  return score
}

/**
 * Rank the index against a free-text query. Returns the top `limit` docs,
 * highest score first, ties broken alphabetically. Empty query → no results.
 */
export function searchDocs(query: string, limit = 8): SearchDoc[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return []
  return SEARCH_DOCS.map((doc) => ({ doc, score: scoreDoc(doc, tokens) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
    .slice(0, limit)
    .map((x) => x.doc)
}
