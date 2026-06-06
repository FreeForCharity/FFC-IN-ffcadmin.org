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
  icon: string
  /** Tailwind gradient classes for the role card/hero. */
  gradient: string
  /** Where this role's track page lives. */
  href: string
  certifications?: string[]
  entries: PathEntry[]
}

/**
 * Module catalog. T1 (Operator) is authored for every module a Site Owner owns;
 * T2 (Practitioner) and T3 (Administrator) are authored for the developer and
 * admin roles, porting the existing Global Administrator curriculum into T3.
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
      T2: {
        objective: 'Manage your own credentials and collaborate on shared repositories.',
        directives: [
          {
            id: 'm-accounts-t2-1',
            text: 'Set up a professional GitHub profile and a profile README managed "as code".',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/modules/introduction-to-github/',
              label: 'Introduction to GitHub',
            },
          },
          {
            id: 'm-accounts-t2-2',
            text: 'Understand repository roles (read / triage / write / maintain) and request the least access you need.',
          },
        ],
      },
      T3: {
        objective: 'Own identity and access management across the organization.',
        directives: [
          {
            id: 'm-accounts-t3-1',
            text: 'Study Microsoft 365 identity and access management (Zero Trust, IAM).',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/modules/describe-identity-principles-concepts/',
              label: 'Microsoft Learn',
            },
          },
          {
            id: 'm-accounts-t3-2',
            text: 'Provision users, enforce MFA, and manage GitHub org membership and teams.',
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
      T2: {
        objective: 'Edit the underlying components and structure new sections.',
        directives: [
          {
            id: 'm-content-t2-1',
            text: 'Understand the page/component structure of the Next.js template and edit JSX directly.',
          },
          {
            id: 'm-content-t2-2',
            text: 'Add new sections/pages that match existing conventions and use assetPath() for images.',
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
      T2: {
        objective: 'Read and edit common DNS records and map a site to its domain.',
        directives: [
          {
            id: 'm-dns-t2-1',
            text: 'Learn the common record types: A/AAAA, CNAME, and TXT.',
          },
          {
            id: 'm-dns-t2-2',
            text: 'Configure Cloudflare DNS and map a custom domain to GitHub Pages, then verify propagation.',
            link: {
              url: 'https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site',
              label: 'GitHub Pages custom domain',
            },
          },
        ],
      },
      T3: {
        objective: 'Administer full DNS, including the records that route email.',
        directives: [
          {
            id: 'm-dns-t3-1',
            text: 'Configure custom domains and DNS records on the live Microsoft 365 tenant.',
            link: {
              url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/setup/setup',
              label: 'Set up Microsoft 365',
            },
          },
          {
            id: 'm-dns-t3-2',
            text: 'Own email DNS (MX, SPF, DKIM, DMARC), registrar transfers, and Cloudflare zone configuration.',
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
      T2: {
        objective: 'Perform common Microsoft 365 admin-center tasks.',
        directives: [
          {
            id: 'm-email-t2-1',
            text: 'Create user accounts and mailboxes and assign licenses.',
          },
          {
            id: 'm-email-t2-2',
            text: 'Manage aliases, distribution lists, and shared mailboxes.',
          },
        ],
      },
      T3: {
        objective: 'Administer Microsoft 365 end to end and hold the MS-900 certification.',
        directives: [
          {
            id: 'm-email-t3-1',
            text: 'Complete the Microsoft 365 Fundamentals (MS-900) learning path and exam.',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/courses/ms-900t01',
              label: 'MS-900 Learning Path',
            },
          },
          {
            id: 'm-email-t3-2',
            text: 'Configure security solutions, compliance, and retention across the tenant.',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-security-solutions/',
              label: 'Security solutions',
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
          { id: 'm-sec-t1-1', text: 'Turn on MFA/2FA everywhere — GitHub and Microsoft 365.' },
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
      T2: {
        objective: 'Triage repository security and keep the supply chain healthy.',
        directives: [
          {
            id: 'm-sec-t2-1',
            text: 'Enable and triage Dependabot and CodeQL alerts; review PR checks before merge.',
            link: {
              url: 'https://docs.github.com/en/code-security/getting-started/securing-your-repository',
              label: 'Securing your repository',
            },
          },
          {
            id: 'm-sec-t2-2',
            text: 'Keep dependencies current and understand what each CI check verifies.',
          },
        ],
      },
      T3: {
        objective: 'Set organization security policy and the Zero-Trust perimeter.',
        directives: [
          {
            id: 'm-sec-t3-1',
            text: 'Apply Zero-Trust/IAM principles and Microsoft 365 security baselines.',
          },
          {
            id: 'm-sec-t3-2',
            text: 'Require branch protection and pull requests for all changes across repositories.',
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
      T2: {
        objective: 'Understand the CI/deploy pipeline and ship via pull requests.',
        directives: [
          {
            id: 'm-pub-t2-1',
            text: 'Deploy a static site with GitHub Pages and understand the build → test → deploy flow.',
            link: {
              url: 'https://docs.github.com/en/pages/getting-started-with-github-pages',
              label: 'GitHub Pages',
            },
          },
          {
            id: 'm-pub-t2-2',
            text: 'Read CI logs, reproduce failures locally, and get checks green before merge.',
          },
        ],
      },
      T3: {
        objective: 'Own the CI/CD pipelines and deployment configuration.',
        directives: [
          {
            id: 'm-pub-t3-1',
            text: 'Maintain the GitHub Actions workflows that build, test, and deploy every charity site.',
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
      T3: {
        objective: 'Own data governance and compliance across the tenant.',
        directives: [
          {
            id: 'm-gov-t3-1',
            text: 'Study and apply Microsoft 365 compliance capabilities and retention policies.',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-compliance-solutions/',
              label: 'Compliance solutions',
            },
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
      T2: {
        objective: 'Configure analytics and on-page SEO.',
        directives: [
          {
            id: 'm-analytics-t2-1',
            text: 'Set up Google Tag Manager / analytics and verify events fire with consent.',
          },
          {
            id: 'm-analytics-t2-2',
            text: 'Maintain titles, meta descriptions, sitemap, and structured data.',
          },
        ],
      },
      T3: {
        objective: 'Own analytics and search presence end to end for the charities you support.',
        directives: [
          {
            id: 'm-analytics-t3-1',
            text: 'Stand up GA4 and Google Tag Manager properly: property/stream setup, consent-mode wiring, and event/conversion definitions that respect the cookie banner.',
            link: {
              url: 'https://skillshop.exceedlms.com/student/path/508845',
              label: 'Google Analytics certification',
            },
          },
          {
            id: 'm-analytics-t3-2',
            text: 'Verify a clean data layer (Tag Assistant / DebugView), exclude internal traffic, and document the measurement plan for each site.',
          },
          {
            id: 'm-analytics-t3-3',
            text: 'Own technical and on-page SEO: Search Console verification, sitemap submission, structured data, and Core Web Vitals follow-up.',
            link: {
              url: 'https://search.google.com/search-console/about',
              label: 'Google Search Console',
            },
          },
        ],
      },
    },
  },
  {
    id: 'google-workspace',
    title: 'Google Workspace',
    icon: '🗂️',
    responsibility: 'Accounts, groups, and sharing for charities that run on Google.',
    tiers: {
      T1: {
        objective: 'Use Google Workspace safely day to day and know what to ask an admin for.',
        directives: [
          {
            id: 'm-gws-t1-1',
            text: 'Understand the core apps (Gmail, Drive, Docs, Calendar, Meet) and that your charity account is managed — turn on 2-Step Verification.',
            link: {
              url: 'https://support.google.com/a/users/answer/9282734',
              label: 'Workspace for users',
            },
          },
          {
            id: 'm-gws-t1-2',
            text: 'Know the difference between a user account, a group, and a shared drive — and request new ones from your Workspace admin rather than guessing.',
          },
          {
            id: 'm-gws-t1-3',
            text: 'Share files responsibly: prefer shared drives over personal Drive, and check link-sharing scope before sending anything outside the charity.',
          },
        ],
      },
      T2: {
        objective: 'Perform common Google Admin console tasks.',
        directives: [
          {
            id: 'm-gws-t2-1',
            text: 'Create and suspend users, build groups, and provision shared drives in the Admin console.',
            link: {
              url: 'https://support.google.com/a/answer/7332836',
              label: 'Get started with Admin console',
            },
          },
          {
            id: 'm-gws-t2-2',
            text: 'Manage organizational units and apply basic sharing and access settings.',
          },
        ],
      },
      T3: {
        objective: 'Administer Google Workspace end to end, backed by certification.',
        directives: [
          {
            id: 'm-gws-t3-1',
            text: 'Configure security: 2SV enforcement, context-aware access, and admin-role delegation; review the security dashboard and alert center.',
            link: {
              url: 'https://support.google.com/a/answer/9211704',
              label: 'Security best practices',
            },
          },
          {
            id: 'm-gws-t3-2',
            text: 'Own domain and email routing (MX, SPF, DKIM, DMARC), data regions, and retention/Vault policy for the tenant.',
          },
          {
            id: 'm-gws-t3-3',
            text: 'Work toward the Google Workspace Administrator certification.',
            link: {
              url: 'https://cloud.google.com/learn/certification/workspace-administrator',
              label: 'Workspace Administrator cert',
            },
          },
        ],
      },
    },
  },
  {
    id: 'data-reporting',
    title: 'Impact Dashboards & Reporting',
    icon: '📊',
    responsibility: 'Turning raw analytics into impact a charity board can read.',
    tiers: {
      T1: {
        objective: 'Read a dashboard and understand what the charity’s numbers mean.',
        directives: [
          {
            id: 'm-data-t1-1',
            text: 'Learn to read your traffic dashboard: sessions, top pages, and where visitors come from — and ask your AI assistant to explain anything unclear.',
          },
          {
            id: 'm-data-t1-2',
            text: 'Agree on the handful of metrics that actually matter to your mission (e.g. donations started, volunteer sign-ups) rather than vanity numbers.',
          },
        ],
      },
      T2: {
        objective: 'Build a shareable impact dashboard from analytics data.',
        directives: [
          {
            id: 'm-data-t2-1',
            text: 'Connect GA4 to Looker Studio and build a one-page impact dashboard the charity can revisit.',
            link: {
              url: 'https://support.google.com/looker-studio/answer/6283323',
              label: 'Looker Studio',
            },
          },
          {
            id: 'm-data-t2-2',
            text: 'Define goals/conversions for the metrics that matter and annotate big changes (campaigns, launches).',
          },
        ],
      },
      T3: {
        objective: 'Own the reporting pipeline and turn it into recurring insight.',
        directives: [
          {
            id: 'm-data-t3-1',
            text: 'Model the measurement plan across sites, standardize naming, and (where useful) export GA4 to BigQuery for deeper analysis.',
            link: {
              url: 'https://support.google.com/analytics/answer/9358801',
              label: 'GA4 BigQuery export',
            },
          },
          {
            id: 'm-data-t3-2',
            text: 'Deliver a recurring impact report and partner with web developers so tracking is built in during the initial site build.',
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
      T2: {
        objective: 'Run the full Issue → PR → merge loop with an AI agent.',
        directives: [
          {
            id: 'm-ai-t2-1',
            text: 'Set up your AI agent (Claude Desktop, Codex, or in an IDE) and connect GitHub.',
            link: { url: '/developer-environment-setup', label: 'Developer Environment Setup' },
          },
          {
            id: 'm-ai-t2-2',
            text: 'Drive the Issue → branch → PR → review loop and let CI validate every change.',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot/',
              label: 'GitHub Copilot fundamentals',
            },
          },
        ],
      },
      T3: {
        objective: 'Orchestrate AI-driven development across many repositories.',
        directives: [
          {
            id: 'm-ai-t3-1',
            text: 'Define agent conventions (AGENTS.md), branch protection, and review gates org-wide.',
          },
        ],
      },
    },
  },
  {
    id: 'site-build-code',
    title: 'Site Build & Code',
    icon: '🧩',
    responsibility: 'Building and maintaining the site’s code itself.',
    tiers: {
      T2: {
        objective: 'Build charity sites from the template and run the toolchain locally.',
        directives: [
          {
            id: 'm-build-t2-1',
            text: 'Create a site from FreeForCharity/FFC_Single_Page_Template and customize it.',
          },
          {
            id: 'm-build-t2-2',
            text: 'Run format, lint, build, and tests locally in the order documented in AGENTS.md.',
            link: { url: '/developer-environment-setup', label: 'Dev environment' },
          },
        ],
      },
      T3: {
        objective: 'Own architecture, new pages, and cross-repo refactors.',
        directives: [
          {
            id: 'm-build-t3-1',
            text: 'Design new pages and components and lead larger refactors with full test coverage.',
          },
        ],
      },
    },
  },
  {
    id: 'brand-design',
    title: 'Brand & Design',
    icon: '🎨',
    responsibility: 'The charity’s visual identity and marketing assets.',
    tiers: {
      T3: {
        objective: 'Deliver a complete brand kit and template library in Canva.',
        directives: [
          {
            id: 'm-brand-t3-1',
            text: 'Complete the official Canva Pro / Design School courses.',
            link: { url: '/canva-designer-path', label: 'Canva Designer path' },
          },
          {
            id: 'm-brand-t3-2',
            text: 'Build brand kits, social templates, and print/email collateral for nonprofits.',
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
    icon: '🌱',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    href: '/site-owner/training',
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
  {
    id: 'web-developer',
    title: 'Web Developer',
    persona: 'You build and maintain charity websites with an AI agent.',
    intro:
      'The practitioner path: build and maintain charity sites hands-on with your AI agent. You run the full development loop and the toolchain yourself — no certifications required, though you can grow into the Administrator tier.',
    icon: '💻',
    gradient: 'from-blue-500 to-indigo-600',
    href: '/training/web-developer',
    entries: [
      { moduleId: 'accounts-access', tier: 'T2' },
      { moduleId: 'building-with-ai', tier: 'T2' },
      { moduleId: 'site-build-code', tier: 'T2' },
      { moduleId: 'website-content', tier: 'T2' },
      { moduleId: 'publishing-deploy', tier: 'T2' },
      { moduleId: 'security-trust', tier: 'T2' },
      { moduleId: 'analytics-seo', tier: 'T2', optional: true },
      { moduleId: 'domains-dns', tier: 'T1' },
      { moduleId: 'governance-privacy', tier: 'T1' },
    ],
  },
  {
    id: 'global-admin',
    title: 'Global Administrator',
    persona: 'You manage Microsoft 365, GitHub, and infrastructure for all FFC charities.',
    intro:
      'The administrator path: full depth across every module, backed by the MS-900 and GitHub Foundations certifications. This is the complete "Operation Digital Sovereignty" program.',
    icon: '🛡️',
    gradient: 'from-teal-500 to-emerald-600',
    href: '/training-plan',
    certifications: ['MS-900 (Microsoft 365 Fundamentals)', 'GitHub Foundations'],
    entries: [
      { moduleId: 'accounts-access', tier: 'T3' },
      { moduleId: 'email-m365', tier: 'T3' },
      { moduleId: 'domains-dns', tier: 'T3' },
      { moduleId: 'security-trust', tier: 'T3' },
      { moduleId: 'governance-privacy', tier: 'T3' },
      { moduleId: 'publishing-deploy', tier: 'T3' },
      { moduleId: 'building-with-ai', tier: 'T3' },
      { moduleId: 'site-build-code', tier: 'T3' },
    ],
  },
  {
    id: 'google-workspace-admin',
    title: 'Google Workspace Admin',
    persona: 'You manage Google Workspace for the charities FFC supports.',
    intro:
      'The administrator path for charities that run on Google: own accounts, groups, shared drives, sharing, and security in the Admin console — backed by the Google Workspace Administrator certification. Used to be folded into general admin work; now a first-class role.',
    icon: '🗂️',
    gradient: 'from-amber-500 to-orange-600',
    href: '/training/google-workspace-admin',
    certifications: ['Google Workspace Administrator'],
    entries: [
      { moduleId: 'google-workspace', tier: 'T3' },
      { moduleId: 'accounts-access', tier: 'T2' },
      { moduleId: 'security-trust', tier: 'T2' },
      { moduleId: 'building-with-ai', tier: 'T1' },
      { moduleId: 'governance-privacy', tier: 'T1' },
      { moduleId: 'domains-dns', tier: 'T1' },
    ],
  },
  {
    id: 'data-analytics',
    title: 'Data & Analytics',
    persona: 'You measure impact — analytics, dashboards, and reporting for charities.',
    intro:
      'The data path: set up GA4/Tag Manager (consent-gated), build impact dashboards, and turn data into clear reporting for charity boards. Deeply connected to the initial website build, so you partner closely with web developers.',
    icon: '📈',
    gradient: 'from-violet-500 to-purple-600',
    href: '/training/data-analytics',
    certifications: ['Google Analytics (GA4)'],
    entries: [
      { moduleId: 'analytics-seo', tier: 'T3' },
      { moduleId: 'data-reporting', tier: 'T3' },
      { moduleId: 'accounts-access', tier: 'T2' },
      { moduleId: 'building-with-ai', tier: 'T2' },
      { moduleId: 'governance-privacy', tier: 'T1' },
    ],
  },
  {
    id: 'designer',
    title: 'Canva Designer',
    persona: 'You create brand identities and marketing materials for nonprofits.',
    intro:
      'The design path: build complete brand kits and template libraries in Canva, plus the account basics and AI workflow to deliver them.',
    icon: '🎨',
    gradient: 'from-orange-500 to-amber-500',
    href: '/canva-designer-path',
    certifications: ['Canva Design School'],
    entries: [
      { moduleId: 'brand-design', tier: 'T3' },
      { moduleId: 'accounts-access', tier: 'T1' },
      { moduleId: 'building-with-ai', tier: 'T1' },
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
