/**
 * Shared navigation data used by the Navigation component.
 *
 * Audience-first mega-menu structure. Top level:
 *   Home · 🌱 Manage My Site (button) · Volunteer ▾ · Operate ▾ · For Charities & Donors ↗
 *
 * The two dropdowns are multi-section mega-menus:
 *   - Volunteer  → "Get involved" + "Training tracks"
 *   - Operate    → "Operations" + "Resources"
 *
 * Add new items to the relevant section so desktop and mobile menus stay in sync.
 */

export interface NavDropdownItem {
  label: string
  href: string
  description: string
}

export interface NavSection {
  heading: string
  items: NavDropdownItem[]
}

export interface NavMenu {
  label: string
  id: string
  sections: NavSection[]
}

/** Flattened items across all sections — used for active-state checks. */
export function menuItems(menu: NavMenu): NavDropdownItem[] {
  return menu.sections.flatMap((s) => s.items)
}

/** Join & grow: the volunteer funnel, the designations you earn, and training. */
export const volunteerMenu: NavMenu = {
  label: 'Volunteer',
  id: 'volunteer',
  sections: [
    {
      heading: 'Get involved',
      items: [
        {
          label: 'Get Involved',
          href: '/get-involved',
          description: 'Ways to volunteer with FFC and how to start.',
        },
        {
          label: 'Account & Tool Setup',
          href: '/guides',
          description:
            'Set up the accounts every role needs — GitHub, MFA, AI assistant, and more.',
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
    },
    {
      heading: 'Training tracks',
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
          label: 'Microsoft 365 Administrator',
          href: '/training-plan',
          description: 'Run M365 email, identity & security — MS-900 + GitHub Foundations.',
        },
        {
          label: 'Google Workspace Administrator',
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
    },
  ],
}

/** Run & reference: operational tools and supporting content for the team. */
export const operateMenu: NavMenu = {
  label: 'Operate',
  id: 'operate',
  sections: [
    {
      heading: 'Operations',
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
          label: 'Automation',
          href: '/automation',
          description: 'The workflow catalog: how FFC automates its infrastructure.',
        },
        {
          label: 'Agentic OS',
          href: '/agentic-os',
          description: 'How FFC runs on AI agents: architecture, governance, session inventory.',
        },
        {
          label: 'Testing',
          href: '/testing',
          description: 'Testing strategy, live CI status, and best practices.',
        },
        {
          label: 'Legacy WP Admin',
          href: '/legacy-wordpress-administration',
          description: 'WordPress-era operations, SOPs, and procedures for supported charities.',
        },
      ],
    },
    {
      heading: 'Resources',
      items: [
        {
          label: 'Guides',
          href: '/guides',
          description: 'Step-by-step how-to guides and account setup walkthroughs.',
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
        {
          label: 'Charity Prerequisites',
          href: '/charity-prerequisites',
          description:
            'Start here if you run a charity: eligibility, accounts to set up, how to apply.',
        },
        {
          label: 'Intake Help',
          href: '/intake-help',
          description:
            'Help for charities completing intake: board, contact info, mailing address, and more.',
        },
      ],
    },
  ],
}

/** The dropdown menus rendered in the top bar, in order. */
export const NAV_MENUS: NavMenu[] = [volunteerMenu, operateMenu]
