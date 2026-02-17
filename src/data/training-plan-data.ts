export type Directive = {
  id: string
  text: string
  link?: {
    url: string
    label: string
  }
  notes?: string
}

export type TrainingBlock = {
  id: string
  title: string
  badge?: string
  description: string
  objective: string
  directives: Directive[]
  promotionEvent?: string
}

export type TrainingPhase = {
  id: string
  title: string
  mission: string
  endState: string
  blocks: TrainingBlock[]
  finalGate?: {
    title: string
    mission: string
    link?: {
      url: string
      label: string
    }
    support: string
  }
}

export const TRAINING_CURRICULUM: TrainingPhase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: Operation Certified Foundation (Microsoft 365)',
    mission: 'Establish the secure identity perimeter and governance structure.',
    endState:
      'Candidate holds Global Administrator access to the live tenant and possesses the MS-900 Certification.',
    blocks: [
      {
        id: 'block-a',
        title: 'Block A: Security & Intelligence (Pre-Deployment)',
        badge: 'A',
        description:
          'Initial gear check and perimeter security. Before touching the live environment, we establish the secure identity protocols.',
        objective:
          'Understand the "Zero Trust" defense doctrine and Identity Access Management (IAM).',
        directives: [
          {
            id: 'p1-a-1',
            text: 'Study: Describe Microsoft 365 identity and access management',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/modules/describe-identity-principles-concepts/',
              label: 'Microsoft Learn',
            },
          },
          {
            id: 'p1-a-2',
            text: 'Study: Describe Microsoft 365 security solutions',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-security-solutions/',
              label: 'Microsoft Learn',
            },
          },
          {
            id: 'p1-a-3',
            text: 'Training Resource: Crash Course in Microsoft 365 Business Premium for Nonprofits',
            link: {
              url: 'https://share.google/WN4KlwWZnm1Ykb5kV',
              label: 'Watch Video',
            },
          },
          {
            id: 'p1-a-4',
            text: 'Action: Configure personal MFA and secure authentication methods.',
          },
        ],
      },
      {
        id: 'block-b',
        title: 'Block B: The MS-900 Theoretical Gate (Simulation)',
        badge: 'B',
        description:
          'Simulated Combat Evaluation. The candidate must prove competence in a controlled environment before receiving command codes.',
        objective: 'Master the core concepts of cloud services and SaaS.',
        directives: [
          {
            id: 'p1-b-1',
            text: 'Study: Microsoft 365 Fundamentals (MS-900) Learning Path',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/courses/ms-900t01',
              label: 'Microsoft Learn',
            },
          },
          {
            id: 'p1-b-2',
            text: 'Validation Event: Complete official MS-900 Practice Tests.',
          },
          {
            id: 'p1-b-3',
            text: 'Pass Criteria: Must achieve a score of >80%.',
          },
        ],
        promotionEvent:
          'Upon successful completion of the >80% threshold, the candidate is granted Global Administrator rights to the live Charity Tenant.',
      },
      {
        id: 'block-c',
        title: 'Block C: Live Terrain Configuration (Field Operations)',
        badge: 'C',
        description:
          'Taking Command. The candidate now operates on the live tenant (the new charity environment).',
        objective:
          'Configure the tenant for active duty using the newly granted Global Admin rights.',
        directives: [
          {
            id: 'p1-c-1',
            text: 'Execution: Configure custom domains (DNS records).',
          },
          {
            id: 'p1-c-2',
            text: 'Execution: Create initial user accounts and assign licenses.',
          },
          {
            id: 'p1-c-3',
            text: 'Reference: Set up Microsoft 365 for business',
            link: {
              url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/setup/setup',
              label: 'Microsoft Learn',
            },
          },
        ],
      },
      {
        id: 'block-d',
        title: 'Block D: Governance & Compliance (Fortification)',
        badge: 'D',
        description:
          'Digging in. Establishing long-term governance and compliance rules on the live tenant.',
        objective: 'Implement data handling and compliance policies.',
        directives: [
          {
            id: 'p1-d-1',
            text: 'Study & Apply: Describe Microsoft 365 compliance capabilities',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-compliance-solutions/',
              label: 'Microsoft Learn',
            },
          },
          {
            id: 'p1-d-2',
            text: 'Execution: Configure base retention policies and compliance alerts in the live tenant.',
          },
        ],
      },
    ],
    finalGate: {
      title: 'Phase 1 Final Gate: MS-900 Certification',
      mission: 'Pass the official Microsoft 365 Fundamentals (MS-900) Exam.',
      link: {
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-900/',
        label: 'Exam Details',
      },
      support: 'Voucher provided by unit command.',
    },
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Operation Code Supremacy (GitHub & Copilot)',
    mission: 'Deploy the web presence and master AI-driven development ("Vibe Coding").',
    endState:
      'Candidate holds Code Owner rights, a live website, and the GitHub Foundations Certification.',
    blocks: [
      {
        id: 'gate-1',
        title: 'Gate 1: Initial Infiltration (Profile Deployment)',
        badge: '1',
        description: 'Establishing the Digital Beachhead.',
        objective: 'Deploy a professional GitHub profile managed "as code."',
        directives: [
          {
            id: 'p2-g1-1',
            text: 'Training: Introduction to GitHub',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/modules/introduction-to-github/',
              label: 'Microsoft Learn',
            },
          },
          {
            id: 'p2-g1-2',
            text: 'Action: Create the GitHub account, set up 2FA, and create the profile README.md.',
          },
        ],
      },
      {
        id: 'gate-2',
        title: 'Gate 2: Forward Operating Base (Coming Soon Site)',
        badge: '2',
        description: 'Establishing the FOB. A placeholder presence to signal operations.',
        objective: 'Deploy a "Coming Soon" page using GitHub Pages.',
        directives: [
          {
            id: 'p2-g2-1',
            text: 'Training: GitHub Pages documentation',
            link: {
              url: 'https://docs.github.com/en/pages/getting-started-with-github-pages',
              label: 'GitHub Docs',
            },
          },
          {
            id: 'p2-g2-2',
            text: 'Action: Create a public repository and deploy a static HTML index page.',
          },
        ],
      },
      {
        id: 'gate-3',
        title: 'Gate 3: Fortification (Security & Cloudflare)',
        badge: '3',
        description: 'Securing the Perimeter. The repository is public; defenses must be active.',
        objective: 'Secure the supply chain and map the custom domain.',
        directives: [
          {
            id: 'p2-g3-1',
            text: 'Training: Securing your repository',
            link: {
              url: 'https://docs.github.com/en/code-security/getting-started/securing-your-repository',
              label: 'GitHub Docs',
            },
          },
          {
            id: 'p2-g3-2',
            text: 'Action: Enable Dependabot and CodeQL.',
          },
          {
            id: 'p2-g3-3',
            text: 'Action: Configure Cloudflare DNS and map to GitHub Pages.',
          },
        ],
      },
      {
        id: 'gate-4',
        title: 'Gate 4: Strategic Code Review (Vibe Coding & Auto-PRs)',
        badge: '4',
        description:
          'AI-Augmented Command. The Global Admin (Commander) dictates the intent via an Issue, and the AI (Vibe Coding) executes the tactic via a PR.',
        objective: 'Execute the "Issue-to-PR" workflow using GitHub Copilot.',
        directives: [
          {
            id: 'p2-g4-1',
            text: 'Training: GitHub Copilot Fundamentals',
            link: {
              url: 'https://learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot/',
              label: 'Microsoft Learn',
            },
          },
          {
            id: 'p2-g4-2',
            text: 'Training: Using GitHub Copilot for Pull Requests',
            link: {
              url: 'https://docs.github.com/en/copilot',
              label: 'GitHub Docs',
            },
          },
          {
            id: 'p2-g4-3',
            text: 'Action: Implement Branch Protection rules requiring PRs for all changes.',
          },
        ],
      },
    ],
  },
]
