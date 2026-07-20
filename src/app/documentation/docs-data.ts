const GH_BLOB = 'https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main'

export interface DocLink {
  name: string
  file: string
  description: string
  audience: string
  githubUrl: string
  /** Optional on-site page (e.g. a runbook leaf) shown as an "Open page" link. */
  liveUrl?: string
}

export interface DocSection {
  title: string
  description: string
  icon: string
  docs: DocLink[]
}

export const documentationSections: DocSection[] = [
  {
    title: 'Getting Started',
    description: 'Essential guides to get up and running quickly',
    icon: '🚀',
    docs: [
      {
        name: 'Main README',
        file: 'README.md',
        description:
          'The primary documentation for this repository. Covers deployment status, responsive design, analytics setup, testing, code quality standards, and commit signing requirements. This is your starting point for understanding the entire project.',
        audience: 'Everyone - Developers, Administrators, New Contributors',
        githubUrl: `${GH_BLOB}/README.md`,
      },
      {
        name: 'Quick Start Guide',
        file: 'QUICK_START.md',
        description:
          'A 5-minute setup guide for enabling automatic commit signing using the Free For Charity GPG key. Includes step-by-step instructions for adding the public key to GitHub and configuring repository secrets.',
        audience: 'Repository Administrators, New Developers',
        githubUrl: `${GH_BLOB}/QUICK_START.md`,
      },
    ],
  },
  {
    title: 'Runbooks & Playbooks',
    description: 'Step-by-step operational procedures for common scenarios',
    icon: '📑',
    docs: [
      {
        name: 'Onboard a new charity',
        file: '/legacy-wordpress-administration/wordpress-online-impacts-onboarding',
        description:
          'End-to-end workflow for bringing a new charity online: validation, accounts, hosting, and the service-delivery stages. Start here when a new charity is approved.',
        audience: 'Global Admins, Onboarding volunteers',
        githubUrl: `${GH_BLOB}/src/app/legacy-wordpress-administration/wordpress-online-impacts-onboarding/page.tsx`,
        liveUrl: '/legacy-wordpress-administration/wordpress-online-impacts-onboarding',
      },
      {
        name: 'Handle a DNS / hosting issue (escalation)',
        file: '/legacy-wordpress-administration/wordpress-escalation-runbook',
        description:
          'Consolidated escalation paths for when a site won’t load, email breaks, or a domain may have lapsed — who to contact and in what order.',
        audience: 'Global Admins, Maintainers',
        githubUrl: `${GH_BLOB}/src/app/legacy-wordpress-administration/wordpress-escalation-runbook/page.tsx`,
        liveUrl: '/legacy-wordpress-administration/wordpress-escalation-runbook',
      },
      {
        name: 'DNS cutover runbook',
        file: 'docs/dns-cutover-runbook.md',
        description:
          'The step-by-step procedure and redirect-verification script for cutting a domain over to the static stack. Use alongside the cutover site plan.',
        audience: 'Global Admins, DevOps',
        githubUrl: `${GH_BLOB}/docs/dns-cutover-runbook.md`,
      },
      {
        name: 'Respond to a security alert',
        file: 'SECURITY.md',
        description:
          'How FFC handles security reports and Dependabot/CodeQL alerts, the disclosure policy, and who to contact. Read before acting on any security finding.',
        audience: 'Global Admins, Security Team',
        githubUrl: `${GH_BLOB}/SECURITY.md`,
      },
      {
        name: 'Charity site-owner repo configuration',
        file: 'docs/site-owner-repo-config.md',
        description:
          'The required repository settings (auto-merge + branch protection + write access) so a charity owner’s "approve → it publishes" flow works.',
        audience: 'Global Admins',
        githubUrl: `${GH_BLOB}/docs/site-owner-repo-config.md`,
      },
    ],
  },
  {
    title: 'Deployment & Operations',
    description: 'Guides for deploying and operating the site',
    icon: '🌐',
    docs: [
      {
        name: 'Deployment Guide',
        file: 'DEPLOYMENT.md',
        description:
          'Comprehensive guide for deploying this Next.js site to GitHub Pages. Covers Next.js configuration for static export, custom domain setup, GitHub Actions workflow, build output structure, and troubleshooting common deployment issues.',
        audience: 'DevOps Engineers, Repository Administrators',
        githubUrl: `${GH_BLOB}/DEPLOYMENT.md`,
      },
      {
        name: 'GitHub Actions Workflows',
        file: '.github/workflows/README.md',
        description:
          'Documentation for the GitHub Actions workflows: CI (continuous integration with testing and linting), CodeQL Analysis (automated security scanning), Deploy (production deployment), and the scheduled data feeds (sites list, CI status, domain expiry, volunteer hours).',
        audience: 'DevOps Engineers, Developers',
        githubUrl: `${GH_BLOB}/.github/workflows/README.md`,
      },
      {
        name: 'Dashboard data contracts',
        file: 'docs/data-contracts.md',
        description:
          'The committed-JSON contracts behind the live dashboards (CI status, domain expiry, volunteer hours): what each feed contains, how it refreshes, and how the UI degrades gracefully when data is stale.',
        audience: 'Developers, Global Admins',
        githubUrl: `${GH_BLOB}/docs/data-contracts.md`,
      },
    ],
  },
  {
    title: 'Development & Code Quality',
    description: 'Standards, guidelines, and best practices for code',
    icon: '💻',
    docs: [
      {
        name: 'Code Quality Standards',
        file: 'CODE_QUALITY.md',
        description:
          'Comprehensive overview of code quality standards including ESLint configuration, TypeScript type safety, testing framework (Jest + React Testing Library), security scanning, and recommendations for enhancements. Essential reading for maintaining high code quality.',
        audience: 'Developers, Code Reviewers, Quality Assurance',
        githubUrl: `${GH_BLOB}/CODE_QUALITY.md`,
      },
      {
        name: 'Test Cases Documentation',
        file: 'TEST_CASES.md',
        description:
          'Detailed documentation of all test cases including build output validation, GitHub Pages configuration, SEO metadata, route generation, and configuration validation. Explains the test framework, coverage goals, and maintenance procedures.',
        audience: 'Developers, Quality Assurance, Testers',
        githubUrl: `${GH_BLOB}/TEST_CASES.md`,
      },
      {
        name: 'Test Documentation (Public Page)',
        file: '/testing',
        description:
          'Comprehensive public-facing test documentation covering every test suite, their purposes, what they test, why they are important, and how to verify them manually. Includes a live CI status badge.',
        audience: 'All Users - Developers, QA Testers, Administrators, Auditors',
        githubUrl: `${GH_BLOB}/src/app/testing/page.tsx`,
        liveUrl: '/testing',
      },
    ],
  },
  {
    title: 'Security & Authentication',
    description: 'Security practices and GPG commit signing',
    icon: '🔒',
    docs: [
      {
        name: 'Security Policy',
        file: 'SECURITY.md',
        description:
          'How to report a vulnerability, the disclosure policy, and how FFC triages Dependabot and CodeQL alerts.',
        audience: 'Everyone, Security Team',
        githubUrl: `${GH_BLOB}/SECURITY.md`,
      },
      {
        name: 'GPG Signing Configuration',
        file: 'GPG_SIGNING.md',
        description:
          'Technical documentation explaining why GPG signatures are required, how GitHub verifies signatures, and solutions for enabling commit signing including repository settings, GitHub Apps, bot configuration, and workflow automation.',
        audience: 'Repository Administrators, Security Team, Developers',
        githubUrl: `${GH_BLOB}/GPG_SIGNING.md`,
      },
      {
        name: 'Security Controls',
        file: 'docs/security-controls.md',
        description:
          'The enforced security controls (MFA, Conditional Access) and the documented gaps, with SSO status. Reference when answering a security questionnaire.',
        audience: 'Global Admins, Security Team, Auditors',
        githubUrl: `${GH_BLOB}/docs/security-controls.md`,
      },
    ],
  },
  {
    title: 'Design & User Experience',
    description: 'Responsive design and accessibility documentation',
    icon: '🎨',
    docs: [
      {
        name: 'Responsive Design',
        file: 'RESPONSIVE_DESIGN.md',
        description:
          'Complete responsive design documentation covering Tailwind CSS breakpoints, navigation behavior across devices, expected behavior at different screen sizes, a troubleshooting guide for cache and CSS loading issues, and testing/verification results.',
        audience: 'Frontend Developers, Designers, QA Testers',
        githubUrl: `${GH_BLOB}/RESPONSIVE_DESIGN.md`,
      },
    ],
  },
  {
    title: 'Sites Management & Monitoring',
    description: 'Domain and site management tools',
    icon: '🌍',
    docs: [
      {
        name: 'Sites List (Public Page)',
        file: '/sites-list',
        description:
          'Master list of all managed domains with health checks, the domain-expiration tracker, and per-row quick links. Integrates WHMCS, Cloudflare, and WPMUDEV data, refreshed by scheduled workflows.',
        audience: 'All Users - Administrators, Site Managers, Auditors',
        githubUrl: `${GH_BLOB}/src/app/sites-list/page.tsx`,
        liveUrl: '/sites-list',
      },
      {
        name: 'Sites List Update Workflow',
        file: '.github/workflows/update-sites-data.yml',
        description:
          'Automated weekly workflow that fetches the published sites list (CSV + JSON) from FreeForCharity/FFC-Cloudflare-Automation — where the WHMCS/Cloudflare/WPMUDEV merge, health checks, and scoring run — and opens a pull request to sync it here.',
        audience: 'Repository Administrators, DevOps Engineers, Site Managers',
        githubUrl: `${GH_BLOB}/.github/workflows/update-sites-data.yml`,
      },
    ],
  },
  {
    title: 'AI & Agentic Operations',
    description: 'How FFC runs AI coding agents at scale: architecture, inventory, and governance',
    icon: '🤖',
    docs: [
      {
        name: 'Agentic OS (Public Pages)',
        file: '/agentic-os',
        description:
          'The public overview of the FFC Agentic OS: the five repository planes, the six capability layers, and links to the session inventory dashboard and architecture pages.',
        audience: 'Everyone - Volunteers, Administrators, AI Agents',
        githubUrl: `${GH_BLOB}/src/app/agentic-os/page.tsx`,
        liveUrl: '/agentic-os',
      },
      {
        name: 'Agentic OS Blueprint',
        file: 'docs/agentic-os/README.md',
        description:
          'The full blueprint directory: research summary, session inventory methodology and findings, target architecture, gap analysis, phased roadmap, and the governance model for a volunteer 501(c)(3).',
        audience: 'Global Admins, Maintainers, AI Agents',
        githubUrl: `${GH_BLOB}/docs/agentic-os/README.md`,
      },
      {
        name: 'Autonomy Ladder & Ops Concierge Pilot',
        file: 'docs/agentic-os/07-autonomy.md',
        description:
          'The path from supervised agent sessions to a "Jarvis"-style assistant: the live daily Ops Concierge Routine (feeds → triage → issues → morning report), the @claude conversational entry setup, and the bot-identity gate for org-wide autonomy.',
        audience: 'Global Admins, Maintainers, AI Agents',
        githubUrl: `${GH_BLOB}/docs/agentic-os/07-autonomy.md`,
      },
      {
        name: 'Agent Issue-to-PR Workflow',
        file: 'docs/agent-issue-pr-workflow.md',
        description:
          'The coordination runbook every AI agent follows: issue claims, branch naming, PR requirements, and the no-self-merge policy.',
        audience: 'AI Agents, Maintainers',
        githubUrl: `${GH_BLOB}/docs/agent-issue-pr-workflow.md`,
      },
      {
        name: 'Agent Session Inventory (Dashboard)',
        file: '/agentic-os/session-inventory',
        description:
          'Per-repo Claude and Copilot PR session counts, date ranges, and task categories across all public FreeForCharity repositories, rendered from the committed snapshot.',
        audience: 'Everyone - Administrators, Auditors, AI Agents',
        githubUrl: `${GH_BLOB}/src/app/agentic-os/session-inventory/page.tsx`,
        liveUrl: '/agentic-os/session-inventory',
      },
    ],
  },
  {
    title: 'Archived Documentation',
    description: 'Previously active documentation that has been consolidated or completed',
    icon: '📦',
    docs: [
      {
        name: 'Archived Files',
        file: 'docs/archived/README.md',
        description:
          'Documentation that has been archived (consolidated GPG/auto-signing guides, responsive testing results, and completed implementation issues). Preserved for historical reference and audit purposes.',
        audience: 'Repository Administrators, Auditors, Historical Reference',
        githubUrl: `${GH_BLOB}/docs/archived/README.md`,
      },
    ],
  },
]
