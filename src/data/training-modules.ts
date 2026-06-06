import type { Directive } from './training-plan-data'

/**
 * Modular training model (Epic #320).
 *
 * Training is organized along two axes instead of one monolithic role track:
 *  - Responsibility-aligned **modules** (what you are accountable for), and
 *  - Depth **tiers** for the same module:
 *      T1 Operator (AI-driven, no cert) · T2 Practitioner · T3 Administrator (certified).
 *
 * Roles (Site Owner, Web Developer, Global Admin, Designer) are *compositions*
 * of modules at a chosen tier, so one content source feeds every path.
 */

export type Tier = 'T1' | 'T2' | 'T3'

export const TIER_LABELS: Record<Tier, string> = {
  T1: 'Operator',
  T2: 'Practitioner',
  T3: 'Administrator',
}

export const TIER_BLURB: Record<Tier, string> = {
  T1: 'Understand the fundamental and do it safely with your AI assistant — no certification needed.',
  T2: 'Hands-on mechanics you can perform yourself and help others with.',
  T3: 'Full administrator depth, owned org-wide, backed by certification.',
}

export type ModuleTier = {
  objective: string
  directives: Directive[]
}

export type TrainingModule = {
  id: string
  title: string
  icon: string
  /** One-line "what you own" statement. */
  responsibility: string
  tiers: Partial<Record<Tier, ModuleTier>>
}

export type PathEntry = {
  moduleId: string
  tier: Tier
  optional?: boolean
}

export type LearningPath = {
  id: string
  title: string
  persona: string
  intro: string
  entries: PathEntry[]
}

/**
 * Module catalog. This first pass authors the Operator (T1) tier for the
 * modules a charity Site Owner is responsible for. Practitioner (T2) and
 * Administrator (T3) tiers are added by their dedicated sub-issues of #320.
 */
export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'accounts-access',
    title: 'Accounts & Access',
    icon: '🔑',
    responsibility: 'The logins that prove the website and email are yours.',
    tiers: {
      T1: {
        objective: 'Hold secure accounts and the access you need — nothing more.',
        directives: [
          {
            id: 'm-accounts-t1-1',
            text: 'Create a free GitHub account and turn on two-factor authentication (2FA).',
            link: { url: 'https://github.com/signup', label: 'github.com/signup' },
          },
          {
            id: 'm-accounts-t1-2',
            text: 'Request access to your charity’s repository and accept the invitation (you’re added as a writer).',
            link: { url: '/site-owner', label: 'Before you start' },
          },
          {
            id: 'm-accounts-t1-3',
            text: 'Sign in to Microsoft 365 and turn on MFA; store your recovery codes somewhere safe.',
          },
        ],
      },
    },
  },
  {
    id: 'website-content',
    title: 'Website Content',
    icon: '📝',
    responsibility: 'Everything visitors read and see on your pages.',
    tiers: {
      T1: {
        objective: 'Make everyday content changes by describing them to your AI assistant.',
        directives: [
          {
            id: 'm-content-t1-1',
            text: 'Walk through one real change end to end (text, photo, contact info).',
            link: { url: '/site-owner', label: 'Make your first edit' },
          },
          {
            id: 'm-content-t1-2',
            text: 'Keep the cookbook handy for the changes you’ll make most often.',
            link: { url: '/site-owner/common-edits', label: 'Common Edits Cookbook' },
          },
          {
            id: 'm-content-t1-3',
            text: 'Habit: make one change at a time and read it before approving.',
          },
        ],
      },
    },
  },
  {
    id: 'domains-dns',
    title: 'Domains & DNS',
    icon: '🌐',
    responsibility: 'Your web address — and the email that depends on it.',
    tiers: {
      T1: {
        objective: 'Understand your domain and keep it healthy, without breaking anything.',
        directives: [
          {
            id: 'm-dns-t1-1',
            text: 'Know your domain name and that it must be renewed (usually yearly). Confirm who renews it — FFC or your charity — so it never lapses.',
          },
          {
            id: 'm-dns-t1-2',
            text: 'Understand at a high level that DNS records point your web address at your site and route your charity email. Your site is mapped through Cloudflare to GitHub Pages.',
          },
          {
            id: 'm-dns-t1-3',
            text: 'Don’t edit DNS records yourself. If something needs changing, ask your AI assistant to explain it and have an FFC admin make the change.',
          },
          {
            id: 'm-dns-t1-4',
            text: 'Red flag: if your site won’t load or email suddenly stops, suspect DNS or an expired domain and escalate to FFC right away.',
          },
        ],
      },
    },
  },
  {
    id: 'email-m365',
    title: 'Email & Microsoft 365',
    icon: '✉️',
    responsibility: 'Your charity’s email and Microsoft 365 account.',
    tiers: {
      T1: {
        objective: 'Operate your charity email safely day to day.',
        directives: [
          {
            id: 'm-email-t1-1',
            text: 'Know that your charity email lives in Microsoft 365, and turn on MFA — this is the single most important step for protecting it.',
          },
          {
            id: 'm-email-t1-2',
            text: 'Understand the difference between a mailbox (a real account someone signs into) and an alias (another address that lands in an existing mailbox).',
          },
          {
            id: 'm-email-t1-3',
            text: 'Need a new mailbox, alias, or license? Request it from your FFC admin rather than guessing in the admin center.',
          },
          {
            id: 'm-email-t1-4',
            text: 'Stay alert to phishing: never enter your password from an email link, and never share MFA codes.',
            link: {
              url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/setup/setup',
              label: 'Microsoft 365 basics',
            },
          },
        ],
      },
    },
  },
  {
    id: 'security-trust',
    title: 'Security & Trust',
    icon: '🛡️',
    responsibility: 'Keeping your site and accounts safe.',
    tiers: {
      T1: {
        objective: 'Build safe habits and understand the automatic safety checks.',
        directives: [
          {
            id: 'm-sec-t1-1',
            text: 'Turn on MFA/2FA everywhere — GitHub and Microsoft 365.',
          },
          {
            id: 'm-sec-t1-2',
            text: 'Never paste passwords or secret keys into the chat, your website, or GitHub.',
          },
          {
            id: 'm-sec-t1-3',
            text: 'Understand the checks: a green check means a change is safe to publish; a red one means it did not go live — ask your assistant to fix it.',
          },
          {
            id: 'm-sec-t1-4',
            text: 'Security alerts (Dependabot/CodeQL) may appear on your repository. Your AI assistant can read and resolve most of them — ask it to.',
          },
          {
            id: 'm-sec-t1-5',
            text: 'If you think an account is compromised, change the password, confirm MFA, and tell FFC immediately.',
          },
        ],
      },
    },
  },
  {
    id: 'publishing-deploy',
    title: 'Publishing & Deploy',
    icon: '🚀',
    responsibility: 'How your changes go from “approved” to live.',
    tiers: {
      T1: {
        objective: 'Approve changes confidently and know when they’re live.',
        directives: [
          {
            id: 'm-pub-t1-1',
            text: 'Learn the publish flow: review what changed, approve, and it goes live automatically.',
            link: { url: '/site-owner', label: 'See your change and publish it' },
          },
          {
            id: 'm-pub-t1-2',
            text: 'Set expectations: checks run for a minute or two, then your live site updates within a few minutes. Refresh to see it.',
          },
          {
            id: 'm-pub-t1-3',
            text: 'If a check fails, nothing went live — ask your assistant to read the error and fix it.',
          },
        ],
      },
    },
  },
  {
    id: 'governance-privacy',
    title: 'Governance & Privacy',
    icon: '⚖️',
    responsibility: 'Staying compliant, accessible, and trustworthy.',
    tiers: {
      T1: {
        objective: 'Keep required policies current and publish responsibly.',
        directives: [
          {
            id: 'm-gov-t1-1',
            text: 'Your site has a privacy policy and cookie notice. Keep them accurate when what you collect changes — ask your assistant to update them.',
          },
          {
            id: 'm-gov-t1-2',
            text: 'Accessibility matters: ask your assistant to add descriptive alt text to images and keep color contrast readable.',
          },
          {
            id: 'm-gov-t1-3',
            text: 'Remember your site is public. Only post board minutes or documents your board approved for public release.',
            link: { url: '/site-owner/common-edits', label: 'Board minutes caveat' },
          },
        ],
      },
    },
  },
  {
    id: 'analytics-seo',
    title: 'Analytics & SEO',
    icon: '📈',
    responsibility: 'Knowing who visits and being findable in search.',
    tiers: {
      T1: {
        objective: 'See your traffic and keep your basic search presence healthy.',
        directives: [
          {
            id: 'm-analytics-t1-1',
            text: 'Ask your assistant to show you how many people visit and which pages are popular.',
          },
          {
            id: 'm-analytics-t1-2',
            text: 'Basic SEO (page titles and descriptions) is handled for you — ask your assistant to review it when you add pages.',
          },
        ],
      },
    },
  },
  {
    id: 'building-with-ai',
    title: 'Building with AI',
    icon: '🤖',
    responsibility: 'The one skill that powers everything above.',
    tiers: {
      T1: {
        objective: 'Describe what you want, review it, and approve — let the agent do the work.',
        directives: [
          {
            id: 'm-ai-t1-1',
            text: 'Describe changes in plain English; the assistant figures out the technical steps.',
          },
          {
            id: 'm-ai-t1-2',
            text: 'Always read the summary of what changed before you approve.',
          },
          {
            id: 'm-ai-t1-3',
            text: 'When you’re unsure or something looks wrong, ask the assistant to explain — or escalate to FFC.',
            link: { url: '/site-owner', label: 'Site Owner walkthrough' },
          },
        ],
      },
    },
  },
]

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'site-owner',
    title: 'Site Owner',
    persona: 'You run one charity and manage its FFC-built website with AI.',
    intro:
      'Everything you are responsible for as a charity site owner — at operator depth. You don’t need certifications; you need to understand each area and handle it safely with your AI assistant, and know when to ask FFC for help.',
    entries: [
      { moduleId: 'accounts-access', tier: 'T1' },
      { moduleId: 'building-with-ai', tier: 'T1' },
      { moduleId: 'website-content', tier: 'T1' },
      { moduleId: 'publishing-deploy', tier: 'T1' },
      { moduleId: 'domains-dns', tier: 'T1' },
      { moduleId: 'email-m365', tier: 'T1' },
      { moduleId: 'security-trust', tier: 'T1' },
      { moduleId: 'governance-privacy', tier: 'T1' },
      { moduleId: 'analytics-seo', tier: 'T1', optional: true },
    ],
  },
]

export function getModule(id: string): TrainingModule | undefined {
  return TRAINING_MODULES.find((m) => m.id === id)
}

export function getPath(id: string): LearningPath | undefined {
  return LEARNING_PATHS.find((p) => p.id === id)
}
