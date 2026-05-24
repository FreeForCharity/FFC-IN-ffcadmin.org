/**
 * Single source of truth for the /legacy-wordpress-administration/ section.
 *
 * Used by:
 *   - src/app/legacy-wordpress-administration/page.tsx (hub landing)
 *   - src/components/legacy-wordpress-administration/Sidebar.tsx
 *   - src/components/legacy-wordpress-administration/CategoryGrid.tsx
 *   - src/components/legacy-wordpress-administration/PageHeader.tsx
 *   - src/app/sitemap.ts
 *
 * Adding a page: append a row to LEGACY_WP_ADMIN_PAGES and create
 * src/app/legacy-wordpress-administration/<slug>/page.tsx using the
 * shared PageHeader pattern.
 */

export const LEGACY_WP_ADMIN_BASE = '/legacy-wordpress-administration'

/**
 * FFC founder escalation contact. Single source of truth so that role
 * changes only need to land here. Avoid hardcoding in leaf page bodies.
 */
export const FFC_FOUNDER_CONTACT = {
  name: 'Clarke Moyer',
  role: 'FFC founder',
  email: 'clarkemoyer@freeforcharity.org',
  phone: '520-222-8104',
  phoneHref: 'tel:5202228104',
  escalationCadence: 'unresolved within 48 hours',
} as const

export type LegacyWpAdminCategoryId =
  | 'wordpress-operations'
  | 'charity-onboarding'
  | 'volunteer-programs'

export interface LegacyWpAdminCategory {
  id: LegacyWpAdminCategoryId
  label: string
  description: string
}

export const LEGACY_WP_ADMIN_CATEGORIES: LegacyWpAdminCategory[] = [
  {
    id: 'wordpress-operations',
    label: 'WordPress Operations',
    description: 'Hosting, domains, cPanel, and the layered WordPress stack FFC operates.',
  },
  {
    id: 'charity-onboarding',
    label: 'Charity Onboarding',
    description: 'Validation, GuideStar maintenance, and the service-delivery lifecycle.',
  },
  {
    id: 'volunteer-programs',
    label: 'Volunteer Programs',
    description: 'Training programs, web-developer paths, tools, and proving-ground competencies.',
  },
]

export interface LegacyWpAdminPage {
  /** URL slug under /legacy-wordpress-administration/ — always prefixed `wordpress-`. */
  slug: string
  /** Display title used in nav, breadcrumbs, and the page <h1>. */
  title: string
  /** Short label used in the sidebar (the `wordpress-` prefix is dropped here). */
  shortLabel: string
  /** Card / hub-grid description, ~1 sentence. */
  summary: string
  category: LegacyWpAdminCategoryId
  /** Public-facing canonical page on freeforcharity.org. */
  publicSourceUrl: string
  /** Optional cross-link from another section of ffcadmin.org (e.g. /training-plan/). */
  relatedFfcAdminPaths?: string[]
  /**
   * Optional inline cross-references to sibling leaves. Renders via the
   * <RelatedLeaves /> component. Each entry is a slug + a one-line note
   * explaining the relationship. Slug typing is intentionally `string`
   * here because the slug union is derived from this same array — a
   * stricter type would create a circular type-check.
   */
  relatedLeaves?: Array<{ slug: string; note: string }>
}

export const LEGACY_WP_ADMIN_PAGES: LegacyWpAdminPage[] = [
  {
    slug: 'wordpress-hosting-techstack',
    title: 'WordPress Hosting Techstack',
    shortLabel: 'Hosting Techstack',
    summary:
      'The layered hosting stack behind FFC WordPress sites — Cloudflare, the origin host, cPanel/Hostinger, and the plugin floor.',
    category: 'wordpress-operations',
    publicSourceUrl: 'https://freeforcharity.org/techstack/',
    relatedFfcAdminPaths: ['/tech-stack'],
  },
  {
    slug: 'wordpress-web-hosting',
    title: 'WordPress Web Hosting Operations',
    shortLabel: 'Web Hosting Ops',
    summary:
      'Operational procedures for provisioning, maintaining, and migrating FFC WordPress hosting accounts.',
    category: 'wordpress-operations',
    publicSourceUrl: 'https://freeforcharity.org/free-charity-web-hosting/',
  },
  {
    slug: 'wordpress-domains',
    title: 'WordPress Domain Administration',
    shortLabel: 'Domain Admin',
    summary:
      'DNS handoff, registrar workflows, and Cloudflare configuration for FFC-managed WordPress domains.',
    category: 'wordpress-operations',
    publicSourceUrl: 'https://freeforcharity.org/domains/',
  },
  {
    slug: 'wordpress-cpanel-backup-sop',
    title: 'cPanel Backup SOP',
    shortLabel: 'cPanel Backup SOP',
    summary:
      'Standard operating procedure for cPanel full and partial backups across FFC WordPress hosts.',
    category: 'wordpress-operations',
    publicSourceUrl: 'https://freeforcharity.org/ffcadmin-free-for-charity-cpanel-backup-sop/',
    relatedLeaves: [
      {
        slug: 'wordpress-hosting-techstack',
        note: 'the layer the backup operates against',
      },
      {
        slug: 'wordpress-service-delivery-stages',
        note: 'Stage 8 first-backup verification',
      },
    ],
  },
  {
    slug: 'wordpress-online-impacts-onboarding',
    title: 'Online Impacts Onboarding (WordPress)',
    shortLabel: 'Online Impacts Onboarding',
    summary: 'Onboarding playbook for charities arriving through the Online Impacts program.',
    category: 'wordpress-operations',
    publicSourceUrl: 'https://freeforcharity.org/online-impacts-onboarding-guide/',
  },
  {
    slug: 'wordpress-service-delivery-stages',
    title: 'FFC Service Delivery Stages',
    shortLabel: 'Service Delivery Stages',
    summary:
      'The intake → validation → build → handoff lifecycle FFC follows for every charity engagement.',
    category: 'charity-onboarding',
    publicSourceUrl: 'https://freeforcharity.org/free-for-charity-ffc-service-delivery-stages/',
  },
  {
    slug: 'wordpress-charity-validation',
    title: 'Charity Validation Guide (WordPress era)',
    shortLabel: 'Charity Validation',
    summary:
      'Comprehensive validation process FFC uses to confirm 501(c)(3) status and mutual benefit before service delivery.',
    category: 'charity-onboarding',
    publicSourceUrl:
      'https://freeforcharity.org/charity-validation-guide-ensuring-mutual-benefit-through-comprehensive-validation-processes/',
  },
  {
    slug: 'wordpress-guidestar-guide',
    title: 'GuideStar / Candid Maintenance Guide',
    shortLabel: 'GuideStar Guide',
    summary:
      'How FFC maintains Candid (GuideStar) profiles and the seal-of-transparency renewal cycle.',
    category: 'charity-onboarding',
    publicSourceUrl: 'https://freeforcharity.org/guidestar-guide/',
  },
  {
    slug: 'wordpress-training-programs',
    title: 'Free Training Programs (WordPress era)',
    shortLabel: 'Training Programs',
    summary:
      'Catalog of training programs FFC volunteers complete on the way to charity-site delivery.',
    category: 'volunteer-programs',
    publicSourceUrl: 'https://freeforcharity.org/free-training-programs/',
    relatedFfcAdminPaths: ['/training-plan'],
  },
  {
    slug: 'wordpress-web-developer-training',
    title: 'FFC Web Developer Training Guide',
    shortLabel: 'Web Developer Training',
    summary:
      'Skills, certifications, and project milestones for FFC volunteer web developers (WordPress-era).',
    category: 'volunteer-programs',
    publicSourceUrl:
      'https://freeforcharity.org/free-for-charity-ffc-web-developer-training-guide/',
    relatedFfcAdminPaths: ['/training-plan'],
  },
  {
    slug: 'wordpress-tools-for-success',
    title: "Free For Charity's Tools for Success",
    shortLabel: 'Tools for Success',
    summary:
      'The full toolset (productivity, design, communication, finance) FFC issues to partner charities and volunteers.',
    category: 'volunteer-programs',
    publicSourceUrl: 'https://freeforcharity.org/free-for-charitys-tools-for-success/',
  },
  {
    slug: 'wordpress-volunteer-proving-ground',
    title: 'FFC Volunteer Proving Ground: Core Competencies',
    shortLabel: 'Volunteer Proving Ground',
    summary:
      'Core-competency checklist volunteers complete to advance through the FFC contributor ladder.',
    category: 'volunteer-programs',
    publicSourceUrl: 'https://freeforcharity.org/ffc-volunteer-proving-ground-core-competencies/',
    relatedFfcAdminPaths: ['/contributor-ladder'],
  },
]

/** Slug literal union derived from LEGACY_WP_ADMIN_PAGES. */
export type LegacyWpAdminSlug = (typeof LEGACY_WP_ADMIN_PAGES)[number]['slug']

export function getLegacyWpAdminPagesByCategory(
  category: LegacyWpAdminCategoryId
): LegacyWpAdminPage[] {
  return LEGACY_WP_ADMIN_PAGES.filter((p) => p.category === category)
}

export function getLegacyWpAdminPageBySlug(slug: LegacyWpAdminSlug): LegacyWpAdminPage {
  // Slug is constrained to known values at the type level, so this lookup
  // is total. The non-null assertion documents that contract.
  return LEGACY_WP_ADMIN_PAGES.find((p) => p.slug === slug)!
}

export function getLegacyWpAdminHref(slug: LegacyWpAdminSlug): string {
  return `${LEGACY_WP_ADMIN_BASE}/${slug}`
}
