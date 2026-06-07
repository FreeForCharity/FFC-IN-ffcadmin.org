/**
 * Shared navigation data used by the Navigation component.
 *
 * Top level (audience-first): Home · Volunteer ▾ · Edit My Site · Training ▾ ·
 * Operate ▾ · Resources ▾ · For Charities & Donors ↗. Add new items here so
 * desktop and mobile menus stay in sync.
 */

export interface NavDropdownItem {
  label: string
  href: string
  description: string
}

export interface NavDropdown {
  label: string
  id: string
  items: NavDropdownItem[]
}

/** Join & grow: the volunteer funnel and the designations you earn. */
export const volunteerDropdown: NavDropdown = {
  label: 'Volunteer',
  id: 'volunteer',
  items: [
    {
      label: 'Get Involved',
      href: '/get-involved',
      description: 'Ways to volunteer with FFC and how to start.',
    },
    {
      label: 'Volunteer Roles',
      href: '/volunteer',
      description: 'Web dev, Microsoft 365 / Google Workspace admin, data, design, military.',
    },
    {
      label: 'Contributor Ladder',
      href: '/contributor-ladder',
      description: 'Progress from Contributor to Maintainer to Mentor.',
    },
    {
      label: 'Recognition',
      href: '/recognition',
      description: 'Volunteer badges that map 1:1 to GitHub access roles.',
    },
    {
      label: 'Continuing Education',
      href: '/continuing-education',
      description: 'Earn free CE credit (CPE/PDU/CEU) toward your certification.',
    },
    {
      label: 'MOVSM',
      href: '/movsm',
      description: 'Military Outstanding Volunteer Service Medal pathway.',
    },
  ],
}

/** Role-based training tracks (modules × tiers). */
export const trainingDropdown: NavDropdown = {
  label: 'Training',
  id: 'training',
  items: [
    {
      label: 'All Training Tracks',
      href: '/training',
      description: 'Pick your role and see what you’re responsible for, by depth.',
    },
    {
      label: 'Site Owner',
      href: '/site-owner/training',
      description: 'Operator-level training for editing your own charity site.',
    },
    {
      label: 'Web Developer',
      href: '/training/web-developer',
      description: 'Build and maintain charity sites with an AI agent.',
    },
    {
      label: 'Global Admin',
      href: '/training-plan',
      description: 'Microsoft 365 Global Administrator certification path.',
    },
    {
      label: 'Google Workspace Admin',
      href: '/training/google-workspace-admin',
      description: 'Manage Google Workspace for charities, backed by certification.',
    },
    {
      label: 'Data & Analytics',
      href: '/training/data-analytics',
      description: 'GA4, dashboards, and impact reporting for nonprofits.',
    },
    {
      label: 'Canva Designer',
      href: '/canva-designer-path',
      description: 'Canva Designer certification path for nonprofits.',
    },
  ],
}

/** Day-to-day operational tools for the FFC technical team. */
export const operateDropdown: NavDropdown = {
  label: 'Operate',
  id: 'operate',
  items: [
    {
      label: 'Sites List',
      href: '/sites-list',
      description: 'All FFC-managed domains with health and migration status.',
    },
    {
      label: 'Documentation',
      href: '/documentation',
      description: 'Project documentation and reference materials.',
    },
    {
      label: 'Tech Stack',
      href: '/tech-stack',
      description: 'Technologies and tools used across FFC projects.',
    },
    {
      label: 'Testing',
      href: '/testing',
      description: 'Testing strategy, live CI status, and best practices.',
    },
    {
      label: 'Legacy WP Admin',
      href: '/legacy-wordpress-administration',
      description: 'WordPress-era operations, SOPs, and procedures for partner charities.',
    },
  ],
}

/** Reference, how-to, and supporting content. */
export const resourcesDropdown: NavDropdown = {
  label: 'Resources',
  id: 'resources',
  items: [
    {
      label: 'Guides',
      href: '/guides',
      description: 'Step-by-step how-to guides for common tasks.',
    },
    {
      label: 'Dev Environment Setup',
      href: '/developer-environment-setup',
      description: 'Start with your AI of choice — Claude, Codex, Gemini, or Copilot.',
    },
    {
      label: 'Blog',
      href: '/blog',
      description: 'News, volunteer spotlights, and FFC stories.',
    },
    {
      label: 'What FFC Delivers',
      href: '/what-ffc-delivers',
      description: 'What’s included when FFC builds a charity’s website.',
    },
  ],
}

/** The dropdown menus rendered in the top bar, in order. */
export const NAV_DROPDOWNS: NavDropdown[] = [
  volunteerDropdown,
  trainingDropdown,
  operateDropdown,
  resourcesDropdown,
]
