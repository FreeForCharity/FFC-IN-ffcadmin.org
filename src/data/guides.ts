/**
 * Shared guides data used across Navigation, Footer, and Guides landing page.
 * Add new guides here so all components stay in sync.
 */

export interface Guide {
  title: string
  shortTitle: string
  description: string
  href: string
}

export const guides: Guide[] = [
  {
    title: 'Build a Charity Site from the Template',
    shortTitle: 'Build from Template',
    description:
      'Stand up a new charity website from the FFC single-page template with your AI agent — from repo to deployed site.',
    href: '/guides/build-charity-site-from-template',
  },
  {
    title: 'Adopting the FFC Footer on an Existing Website',
    shortTitle: 'Adopt the FFC Footer',
    description:
      'Add the FFC footer and compliance layer to an already-designed charity site so it passes FFC validation and unlocks the free .org domain.',
    href: '/guides/adopt-ffc-footer-on-existing-site',
  },
  {
    title: 'WordPress to Next.js Conversion Guide',
    shortTitle: 'WordPress to Next.js',
    description: 'Convert WordPress/Divi charity sites to Next.js static sites on GitHub Pages.',
    href: '/guides/wordpress-to-nextjs-guide',
  },
  {
    title: 'Zeffy Member Data Migration Guide',
    shortTitle: 'Zeffy Data Migration',
    description: 'Migrate nonprofit membership records into Zeffy CRM using Claude AI.',
    href: '/guides/zeffy-member-data-migration',
  },
]
