import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation | Free For Charity Admin',
  description:
    'Comprehensive documentation for Free For Charity administrative portal - guides, setup instructions, and technical references',
  keywords: 'documentation, guides, setup, technical documentation, README files',
}

interface DocSection {
  title: string
  description: string
  icon: string
  docs: Array<{
    name: string
    file: string
    description: string
    audience: string
    githubUrl: string
  }>
}

const documentationSections: DocSection[] = [
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
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/README.md',
      },
      {
        name: 'Quick Start Guide',
        file: 'QUICK_START.md',
        description:
          'A 5-minute setup guide for enabling automatic commit signing using the Free For Charity GPG key. Includes step-by-step instructions for adding the public key to GitHub and configuring repository secrets.',
        audience: 'Repository Administrators, New Developers',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/QUICK_START.md',
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
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/DEPLOYMENT.md',
      },
      {
        name: 'GitHub Actions Workflows',
        file: '.github/workflows/README.md',
        description:
          'Documentation for the three GitHub Actions workflows: CI (continuous integration with testing and linting), CodeQL Analysis (automated security scanning), and Deploy (production deployment to GitHub Pages).',
        audience: 'DevOps Engineers, Developers',
        githubUrl:
          'https://github.com/FreeForCharity/ffcadmin.org/blob/main/.github/workflows/README.md',
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
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/CODE_QUALITY.md',
      },
      {
        name: 'Test Cases Documentation',
        file: 'TEST_CASES.md',
        description:
          'Detailed documentation of all test cases including build output validation, GitHub Pages configuration, SEO metadata, route generation, and configuration validation. Explains the test framework, coverage goals, and maintenance procedures.',
        audience: 'Developers, Quality Assurance, Testers',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/TEST_CASES.md',
      },
      {
        name: 'Test Documentation (Public Page)',
        file: '/testing',
        description:
          'Comprehensive public-facing test documentation covering all 17 test suites, their purposes, what they test, why they are important, and how to verify them manually. Includes running instructions, CI/CD integration details, and test result interpretation. Essential for understanding the testing strategy and quality assurance processes.',
        audience: 'All Users - Developers, QA Testers, Administrators, Auditors',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/app/testing/page.tsx',
      },
    ],
  },
  {
    title: 'Security & Authentication',
    description: 'Security practices and GPG commit signing',
    icon: '🔒',
    docs: [
      {
        name: 'Quick Start: GPG Signing Setup',
        file: 'QUICK_START.md',
        description:
          'Comprehensive 5-minute setup guide for enabling automatic GPG commit signing. Includes step-by-step instructions, verification procedures, troubleshooting, how auto-signing works, and advanced topics. Consolidated from multiple GPG documentation files for easy access.',
        audience: 'Repository Administrators, DevOps Engineers, Developers',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/QUICK_START.md',
      },
      {
        name: 'GPG Signing Configuration',
        file: 'GPG_SIGNING.md',
        description:
          'Technical documentation explaining why GPG signatures are required, how GitHub verifies signatures, and five different solutions for enabling commit signing including repository settings, GitHub Apps, bot configuration, and workflow automation.',
        audience: 'Repository Administrators, Security Team, Developers',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/GPG_SIGNING.md',
      },
      {
        name: 'GPG Keys Directory',
        file: 'gpg-keys/README.md',
        description:
          'Documentation for the official Free For Charity GPG key including key information (ID, fingerprint, validity period), security warnings, setup instructions, and verification procedures. Explains how to safely manage public and private keys.',
        audience: 'Repository Administrators, Security Team',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/gpg-keys/README.md',
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
          'Complete responsive design documentation covering Tailwind CSS breakpoints, navigation behavior across devices (mobile hamburger menu vs desktop inline links), expected behavior at different screen sizes, comprehensive troubleshooting guide for cache and CSS loading issues, and detailed testing and verification results.',
        audience: 'Frontend Developers, Designers, QA Testers',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/RESPONSIVE_DESIGN.md',
      },
    ],
  },
  {
    title: 'Troubleshooting & Issue Resolution',
    description: 'Problem-solving guides and issue analysis',
    icon: '🔧',
    docs: [
      {
        name: 'Issue Resolution',
        file: 'ISSUE_RESOLUTION.md',
        description:
          'Comprehensive analysis and resolution of issues encountered during development. Documents problems, root causes, solutions implemented, and lessons learned. Valuable resource for troubleshooting similar issues in the future.',
        audience: 'Developers, Support Team, Repository Administrators',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/ISSUE_RESOLUTION.md',
      },
    ],
  },
  {
    title: 'Sites Management & Monitoring',
    description: 'Domain and site management tools',
    icon: '🌍',
    docs: [
      {
        name: 'Sites List Documentation',
        file: 'docs/SITES_LIST.md',
        description:
          'Comprehensive documentation for the Sites List system. Covers categorized tables (Active, Transferred, Expired, Fraud), automated site health checks (Live, Redirect, Error, Unreachable), WPMUDEV/WHMCS/Cloudflare data integration, weekly automation workflow, data structure and columns, update script details, troubleshooting guide, and security considerations. Essential reading for understanding the complete Sites List architecture.',
        audience: 'All Users - Administrators, Site Managers, Developers, Auditors',
        githubUrl: 'https://github.com/FreeForCharity/ffcadmin.org/blob/main/docs/SITES_LIST.md',
      },
      {
        name: 'Sites List (Public Page)',
        file: '/sites-list',
        description:
          'Master list of all managed domains with automated health checks and data integration. Displays categorized tables for Active sites, Transferred domains, Expired/Cancelled sites, and Fraudulent/High Risk domains. Integrates data from WHMCS (domain registration), Cloudflare (DNS/CDN), and WPMUDEV (WordPress hosting). Includes real-time site health status (Live, Redirect, Error, Unreachable) and GitHub repository links. Updated automatically via scheduled workflows.',
        audience: 'All Users - Administrators, Site Managers, Auditors, Stakeholders',
        githubUrl:
          'https://github.com/FreeForCharity/ffcadmin.org/blob/main/app/sites-list/page.tsx',
      },
      {
        name: 'Sites List Update Workflow',
        file: '.github/workflows/update-sites-data.yml',
        description:
          'Automated workflow that updates the Sites List weekly. Triggers remote workflows to export data from WHMCS, Cloudflare, and WPMUDEV systems, downloads the exported data, runs automated site health checks (HTTP status validation), merges all data sources into a single CSV file, and creates a pull request with the updates. Enables automated site monitoring and reduces manual data entry.',
        audience: 'Repository Administrators, DevOps Engineers, Site Managers',
        githubUrl:
          'https://github.com/FreeForCharity/ffcadmin.org/blob/main/.github/workflows/update-sites-data.yml',
      },
      {
        name: 'Sites Data Update Script',
        file: 'scripts/update-sites-data.mjs',
        description:
          'Node.js script that processes and merges data from WHMCS, Cloudflare, and WPMUDEV CSV exports. Performs automated site health checks with HTTP requests, categorizes sites by status (Active, Transferred, Expired, Fraud), applies sorting and pairing logic for .org/.com domain pairs, and generates the final sites_list.csv file. Processes sites in chunks to avoid network throttling.',
        audience: 'Developers, DevOps Engineers, Site Managers',
        githubUrl:
          'https://github.com/FreeForCharity/ffcadmin.org/blob/main/scripts/update-sites-data.mjs',
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
          'Documentation that has been archived includes: SETUP_AUTO_SIGNING.md and AUTO_SIGN_TEST.md (consolidated into QUICK_START.md), RESPONSIVE_TESTING_RESULTS.md (consolidated into RESPONSIVE_DESIGN.md), and IMPLEMENTATION_ISSUES.md (all 11 issues complete). Files are preserved for historical reference and audit purposes.',
        audience: 'Repository Administrators, Auditors, Historical Reference',
        githubUrl:
          'https://github.com/FreeForCharity/ffcadmin.org/blob/main/docs/archived/README.md',
      },
    ],
  },
]

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold">Documentation Center</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Comprehensive guides and technical documentation for Free For Charity Admin Portal
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Documentation</h2>
          <p className="text-gray-700 mb-4">
            This page provides a comprehensive index of all documentation files in this repository.
            Each README file serves a specific purpose and is designed to help different audiences
            understand, use, and contribute to this project.
          </p>
          <p className="text-gray-700 mb-4">
            Whether you're a <strong>new developer</strong> getting started, a{' '}
            <strong>global administrator</strong> managing the infrastructure, a{' '}
            <strong>nonprofit partner</strong> understanding our technology, or an{' '}
            <strong>auditor</strong> reviewing our practices, you'll find the documentation you need
            here.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>💡 Tip:</strong> Click the GitHub icon next to each document to view it
              directly in the repository. This ensures you always have access to the latest version
              with full context and history.
            </p>
          </div>
        </div>

        {/* Documentation Sections */}
        {documentationSections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4" aria-hidden="true">
                {section.icon}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
            </div>

            <div className="space-y-6">
              {section.docs.map((doc, docIdx) => (
                <div key={docIdx} className="border-l-4 border-blue-600 pl-4 py-2">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{doc.name}</h3>
                    <a
                      href={doc.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 ml-4 inline-flex items-center px-3 py-1 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                      aria-label={`View ${doc.name} on GitHub`}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View on GitHub
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-mono">{doc.file}</p>
                  <p className="text-gray-700 mb-3">{doc.description}</p>
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      <strong>Audience:</strong> {doc.audience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* How to Use This Documentation */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 md:p-8 border border-indigo-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use This Documentation</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Identify Your Role</h3>
                <p className="text-gray-700">
                  Start by identifying which audience category you fall into. Each document lists
                  its target audience to help you find relevant information quickly.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose Your Starting Point</h3>
                <p className="text-gray-700">
                  <strong>New to the project?</strong> Start with the Main README and Quick Start
                  Guide.
                  <br />
                  <strong>Need to deploy?</strong> Check the Deployment Guide and GitHub Actions
                  Workflows.
                  <br />
                  <strong>Working on code?</strong> Review Code Quality Standards and Test Cases
                  Documentation.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">View on GitHub</h3>
                <p className="text-gray-700">
                  Click the "View on GitHub" button to read the full documentation in the
                  repository. This ensures you see the latest version and can navigate related files
                  easily.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Follow Cross-References</h3>
                <p className="text-gray-700">
                  Many documents reference each other. Following these links will give you a
                  complete understanding of interconnected topics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Additional Help?</h2>
          <p className="text-gray-700 mb-6">
            If you can't find what you're looking for in the documentation, here's how to get
            support:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                General Support
              </h3>
              <p className="text-gray-600 text-sm">
                Open a support ticket with Free For Charity for general questions, feature requests,
                or non-urgent issues.
              </p>
            </div>

            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Emergency Escalation
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                For urgent issues that require immediate attention:
              </p>
              <p className="text-gray-900 text-sm font-semibold">
                Clarke Moyer:{' '}
                <a href="tel:520-222-8104" className="text-blue-600 hover:underline">
                  (520) 222-8104
                </a>
              </p>
              <p className="text-gray-500 text-xs mt-1">(if not answered within 48 hours)</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <strong>Contributing to Documentation:</strong> Found an error or want to improve the
              documentation? Visit our{' '}
              <a
                href="https://github.com/FreeForCharity/ffcadmin.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub repository
              </a>{' '}
              to open an issue or submit a pull request.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
