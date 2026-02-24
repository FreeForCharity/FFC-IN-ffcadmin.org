/**
 * Shared navigation dropdown data used by the Navigation component.
 * Add new items here so desktop and mobile menus stay in sync.
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

export const trainingDropdown: NavDropdown = {
  label: 'Training',
  id: 'training',
  items: [
    {
      label: 'Global Admin',
      href: '/training-plan',
      description: 'Microsoft 365 Global Administrator certification path.',
    },
    {
      label: 'Canva Designer',
      href: '/canva-designer-path',
      description: 'Canva Designer certification path for nonprofits.',
    },
    {
      label: 'Contributor Ladder',
      href: '/contributor-ladder',
      description: 'Progress from Contributor to Maintainer to Mentor.',
    },
  ],
}

export const resourcesDropdown: NavDropdown = {
  label: 'Resources',
  id: 'resources',
  items: [
    {
      label: 'Tech Stack',
      href: '/tech-stack',
      description: 'Technologies and tools used across FFC projects.',
    },
    {
      label: 'Documentation',
      href: '/documentation',
      description: 'Project documentation and reference materials.',
    },
    {
      label: 'Testing',
      href: '/testing',
      description: 'Testing strategy, tools, and best practices.',
    },
    {
      label: 'Guides',
      href: '/guides',
      description: 'Step-by-step technical guides for common tasks.',
    },
  ],
}
