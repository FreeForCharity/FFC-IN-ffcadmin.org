/**
 * Shared blog post data used across Navigation, Footer, Blog listing, and sitemap.
 * Add new blog posts here so all components stay in sync.
 */

export interface BlogPost {
  title: string
  slug: string
  description: string
  date: string
  author: string
  tags: string[]
  href: string
}

export const blogPosts: BlogPost[] = [
  {
    title: 'Welcome to Free For Charity',
    slug: 'welcome-to-ffc',
    description:
      'Learn how Free For Charity trains volunteers to build free websites for 501(c)(3) nonprofits — and how you can get involved.',
    date: '2026-02-24',
    author: 'FFC Team',
    tags: ['announcement', 'mission', 'volunteering'],
    href: '/blog/welcome-to-ffc',
  },
  {
    title: 'Volunteer Spotlight: Building Websites for Nonprofits',
    slug: 'volunteer-spotlight-web-development',
    description:
      'Meet the volunteers who donate their web development skills to help charities go online with professional, secure websites.',
    date: '2026-02-24',
    author: 'FFC Team',
    tags: ['volunteer', 'web development', 'spotlight'],
    href: '/blog/volunteer-spotlight-web-development',
  },
  {
    title: 'A Day in the Life of an FFC Global Admin',
    slug: 'day-in-the-life-global-admin',
    description:
      'What does an FFC Global Administrator actually do? Walk through a typical day of managing Microsoft 365, GitHub, and Cloudflare for nonprofits.',
    date: '2026-02-24',
    author: 'FFC Team',
    tags: ['global admin', 'training', 'day-in-the-life'],
    href: '/blog/day-in-the-life-global-admin',
  },
]
