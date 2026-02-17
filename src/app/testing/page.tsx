import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Documentation | Free For Charity Admin',
  description:
    'Comprehensive testing documentation for the Free For Charity administrative portal - test suites, verification procedures, and quality assurance',
  keywords:
    'testing, test suites, quality assurance, automated testing, jest, react testing library',
}

interface TestSuite {
  name: string
  category: string
  file: string
  purpose: string
  testsCount: number
  whatItTests: string[]
  whyImportant: string
  manualVerification: string
  relatedDocs?: string[]
}

const testSuites: TestSuite[] = [
  // Configuration Tests
  {
    name: 'Configuration Validation',
    category: 'Configuration & Build',
    file: '__tests__/config-validation.test.js',
    purpose: 'Validates that all project configuration files are correctly set up and consistent',
    testsCount: 21,
    whatItTests: [
      'package.json structure and required fields',
      'Node.js version requirement matches CI environment',
      'Package manager lock file (pnpm-lock.yaml) existence and validity',
      'Script commands availability (build, test, lint, format)',
      'DevDependencies are properly declared',
    ],
    whyImportant:
      'Configuration errors can cause silent failures in CI/CD pipelines. These tests catch misconfigurations before deployment, ensuring consistent behavior across development and production environments.',
    manualVerification:
      'Run `pnpm install --frozen-lockfile` to verify lock file integrity. Check that `pnpm run build`, `pnpm test`, and `pnpm run lint` all execute without errors.',
    relatedDocs: ['CODE_QUALITY.md', 'CONTRIBUTING.md'],
  },
  {
    name: 'EditorConfig',
    category: 'Configuration & Build',
    file: '__tests__/editorconfig.test.js',
    purpose: 'Ensures EditorConfig file exists and is properly formatted for IDE consistency',
    testsCount: 12,
    whatItTests: [
      '.editorconfig file existence',
      'Basic structure validation',
      'Common settings presence (indent_style, indent_size, end_of_line)',
      'File is readable and parseable',
    ],
    whyImportant:
      'EditorConfig ensures consistent coding style across different editors and IDEs. This prevents formatting inconsistencies that can cause merge conflicts and code review noise.',
    manualVerification:
      'Open .editorconfig and verify it contains settings for indent_style, indent_size, end_of_line, and charset. Confirm your IDE respects these settings when editing files.',
    relatedDocs: ['CODE_QUALITY.md', '.editorconfig'],
  },
  {
    name: 'Commitlint Configuration',
    category: 'Configuration & Build',
    file: '__tests__/commitlint-config.test.js',
    purpose: 'Validates commit message linting configuration for consistent commit history',
    testsCount: 8,
    whatItTests: [
      'commitlint.config.js file existence',
      'Configuration extends conventional commits',
      'File is valid JavaScript',
      'Exports a configuration object',
    ],
    whyImportant:
      'Consistent commit messages improve project maintainability, enable automated changelog generation, and make git history easier to navigate and understand.',
    manualVerification:
      'Run `echo "test: example commit" | npx commitlint` to test the configuration. Valid conventional commit types include: feat, fix, docs, style, refactor, test, chore.',
    relatedDocs: ['CONTRIBUTING.md'],
  },
  {
    name: 'Bundle Analyzer Configuration',
    category: 'Configuration & Build',
    file: '__tests__/bundle-analyzer.test.js',
    purpose: 'Validates bundle size analysis configuration for performance monitoring',
    testsCount: 11,
    whatItTests: [
      '@next/bundle-analyzer dependency installation',
      'Analyze script presence in package.json',
      'Next.js configuration imports bundle analyzer',
      'ANALYZE environment variable usage',
      'Static export configuration preservation',
    ],
    whyImportant:
      'Bundle size directly impacts page load performance. These tests ensure the bundle analyzer is properly configured so developers can identify and address bloat before it reaches production.',
    manualVerification:
      'Run `pnpm run analyze` to generate bundle analysis reports. Review the generated HTML reports in your browser to identify large dependencies and optimization opportunities.',
    relatedDocs: ['CODE_QUALITY.md', 'next.config.ts'],
  },
  {
    name: 'Lighthouse Configuration',
    category: 'Configuration & Build',
    file: '__tests__/lighthouse-config.test.js',
    purpose: 'Validates Lighthouse CI configuration for automated performance auditing',
    testsCount: 11,
    whatItTests: [
      'lighthouserc.json file existence and validity',
      'Configuration structure (ci.collect, ci.assert)',
      'Static distribution directory set to ./out',
      'Multiple URL configurations for comprehensive testing',
      'numberOfRuns configuration for consistent results',
      'Performance, accessibility, best-practices, and SEO thresholds',
    ],
    whyImportant:
      'Lighthouse audits catch performance, accessibility, and SEO issues before they impact users. Automated testing ensures quality standards are maintained with every deployment.',
    manualVerification:
      'Check the GitHub Actions "Lighthouse CI" workflow runs after deployments. Download the lighthouse-results artifact to review detailed HTML reports for each page.',
    relatedDocs: ['LIGHTHOUSE.md', 'CODE_QUALITY.md', '.github/workflows/lighthouse.yml'],
  },
  {
    name: 'Workflow Dependencies',
    category: 'Configuration & Build',
    file: '__tests__/workflow-dependencies.test.js',
    purpose:
      'Ensures GitHub Actions workflows run in the correct order to prevent premature deployment',
    testsCount: 14,
    whatItTests: [
      'Deploy workflow runs after CI workflow completes',
      'Lighthouse workflow runs after successful deployment',
      'Workflow YAML files are valid and parseable',
      'workflow_run triggers are properly configured',
    ],
    whyImportant:
      'Deploying before tests complete can push broken code to production. These tests verify that deployment only happens after all quality checks pass.',
    manualVerification:
      'Push a commit to a PR and observe the Actions tab. Verify CI runs first, then deployment (on merge to main), then Lighthouse audits. No workflow should start before its dependencies complete.',
    relatedDocs: ['.github/workflows/README.md', 'DEPLOYMENT.md'],
  },

  // Build & Deployment Tests
  {
    name: 'Build Output',
    category: 'Build & Deployment',
    file: '__tests__/build-output.test.js',
    purpose: 'Verifies that the build process produces the correct output structure',
    testsCount: 7,
    whatItTests: [
      'out/ directory creation after build',
      'index.html (home page) existence',
      'tech-stack/index.html presence',
      '_next/ directory with JavaScript and CSS bundles',
      '404.html (error page) generation',
      '_next/static/ directory with static assets',
    ],
    whyImportant:
      'Missing or incorrectly structured build output causes deployment failures or broken pages. These tests catch build configuration issues early.',
    manualVerification:
      'Run `pnpm run build` and inspect the out/ directory. Confirm all expected HTML files exist, _next/static/ contains CSS and JS files, and you can open out/index.html in a browser.',
    relatedDocs: ['DEPLOYMENT.md', 'next.config.ts'],
  },
  {
    name: 'GitHub Pages Configuration',
    category: 'Build & Deployment',
    file: '__tests__/github-pages-config.test.js',
    purpose: 'Ensures the site is properly configured for GitHub Pages static hosting',
    testsCount: 7,
    whatItTests: [
      '.nojekyll file presence in output directory',
      'Next.js configuration has output: "export"',
      'Images are unoptimized for static export',
      'Trailing slashes enabled for proper routing',
    ],
    whyImportant:
      'Without .nojekyll, GitHub Pages Jekyll processing breaks Next.js assets. These tests prevent deployment issues that would make CSS and JavaScript fail to load.',
    manualVerification:
      'After building, verify `out/.nojekyll` exists. Check next.config.ts contains output: "export", images: { unoptimized: true }, and trailingSlash: true.',
    relatedDocs: ['DEPLOYMENT.md', 'ISSUE_RESOLUTION.md', 'public/.nojekyll'],
  },
  {
    name: 'Route Generation',
    category: 'Build & Deployment',
    file: '__tests__/route-generation.test.js',
    purpose: 'Validates that all application routes are generated as static HTML pages',
    testsCount: 10,
    whatItTests: [
      'Home page (index.html) generation',
      'Tech Stack page generation',
      'Documentation page generation',
      'Privacy Policy page generation',
      'Cookie Policy page generation',
      'Training Plan page generation',
      'All route directories contain index.html',
    ],
    whyImportant:
      'Missing route generation means 404 errors in production. These tests ensure every defined route is properly exported as a static page.',
    manualVerification:
      'After building, navigate through out/ directory and confirm each route has its own directory with an index.html file. Open each HTML file in a browser to verify it renders correctly.',
    relatedDocs: ['DEPLOYMENT.md', 'src/app/ directory structure'],
  },
  {
    name: 'SEO Metadata',
    category: 'Build & Deployment',
    file: '__tests__/seo-metadata.test.js',
    purpose: 'Verifies that SEO-critical files are generated and properly formatted',
    testsCount: 6,
    whatItTests: [
      'robots.txt file existence in output',
      'robots.txt is a valid file (not directory)',
      'robots.txt contains User-agent directive',
      'sitemap.xml file existence',
      'sitemap.xml is properly formatted XML',
    ],
    whyImportant:
      'robots.txt and sitemap.xml are essential for search engine crawling and indexing. Missing or malformed files can significantly harm SEO.',
    manualVerification:
      'After building, check out/robots.txt contains valid directives like "User-agent: *". Verify out/sitemap.xml is valid XML with <url> entries for each page. Test at https://www.xml-sitemaps.com/validate-xml-sitemap.html',
    relatedDocs: ['public/robots.txt', 'public/sitemap.xml'],
  },

  // Design & Responsiveness Tests
  {
    name: 'Responsive Design',
    category: 'Design & Responsiveness',
    file: '__tests__/responsive-design.test.js',
    purpose: 'Validates Tailwind CSS breakpoints and responsive utility classes',
    testsCount: 11,
    whatItTests: [
      'Tailwind CSS configuration file existence',
      'Responsive breakpoints (sm: 640px, md: 768px, lg: 1024px)',
      'Mobile-first responsive classes availability',
      'Utility classes for hiding/showing elements at breakpoints',
      'Grid and flex responsive utilities',
    ],
    whyImportant:
      'Responsive design ensures the site works on all device sizes. These tests verify that Tailwind is configured correctly for mobile, tablet, and desktop layouts.',
    manualVerification:
      'Open the site in your browser and use DevTools responsive mode (F12 → Toggle device toolbar). Test at 375px (mobile), 768px (tablet), and 1280px (desktop). Verify navigation, layout, and content adapt appropriately.',
    relatedDocs: ['RESPONSIVE_DESIGN.md', 'tailwind.config.ts'],
  },
  {
    name: 'Mobile Responsiveness',
    category: 'Design & Responsiveness',
    file: '__tests__/mobile-responsiveness.test.js',
    purpose: 'Validates mobile-specific behavior including navigation and viewport configuration',
    testsCount: 17,
    whatItTests: [
      'Hamburger menu button has proper responsive classes',
      'Desktop navigation hidden on mobile (md:flex class)',
      'Mobile menu visible only on small screens',
      'Viewport meta tag presence and configuration',
      'Logo responsive behavior',
    ],
    whyImportant:
      'Mobile users represent a significant portion of traffic. These tests ensure mobile navigation works correctly and the viewport is configured for proper rendering on small screens.',
    manualVerification:
      'On a mobile device or DevTools mobile emulator at 375px width: 1) Hamburger menu should be visible, 2) Desktop links should be hidden, 3) Clicking hamburger opens the menu, 4) Page should not require horizontal scrolling.',
    relatedDocs: ['RESPONSIVE_DESIGN.md', 'src/components/Navigation.tsx'],
  },
  {
    name: 'Accessibility',
    category: 'Design & Responsiveness',
    file: '__tests__/accessibility.test.js',
    purpose: 'Validates that all pages meet WCAG accessibility standards',
    testsCount: 6,
    whatItTests: [
      'Home page accessibility violations (using axe-core)',
      'Tech Stack page accessibility',
      'Documentation page accessibility',
      'Cookie Policy page accessibility',
      'Privacy Policy page accessibility',
      'Training Plan page accessibility',
    ],
    whyImportant:
      'Accessibility is both a legal requirement and ethical obligation. These tests catch common issues like missing alt text, poor color contrast, and improper heading structure that would prevent users with disabilities from accessing the site.',
    manualVerification:
      'Use browser accessibility tools: 1) Chrome DevTools Lighthouse (Accessibility category), 2) WAVE browser extension, 3) Keyboard navigation test (tab through page without mouse), 4) Screen reader test (NVDA on Windows or VoiceOver on Mac).',
    relatedDocs: ['CODE_QUALITY.md', 'LIGHTHOUSE.md'],
  },
  {
    name: 'Navigation Coverage',
    category: 'Design & Responsiveness',
    file: '__tests__/navigation-coverage.test.js',
    purpose: 'Ensures all application pages are accessible through at least one navigation area',
    testsCount: 13,
    whatItTests: [
      'All pages (Home, Tech Stack, Documentation, Testing, Training Plan, Privacy, Cookie) accessible via navigation or footer',
      'No orphaned pages exist that users cannot discover',
      'Navigation component structure (desktop and mobile menus)',
      'Footer component structure (Quick Links, Admin Docs, Policy links)',
      'External links present (GitHub, social media)',
    ],
    whyImportant:
      'Pages that exist but are not linked from any navigation area are effectively invisible to users. This test ensures complete site discoverability and prevents orphaned content.',
    manualVerification:
      'For each page in the app, verify it can be reached by: 1) Clicking a link in the top navigation (desktop or mobile), 2) Clicking a link in the footer, or 3) Direct URL entry. No page should be completely unreachable through normal navigation.',
    relatedDocs: ['src/components/Navigation.tsx', 'src/components/Footer.tsx'],
  },

  // Component Tests
  {
    name: 'Navigation Component',
    category: 'Component Tests',
    file: '__tests__/components/Navigation.test.tsx',
    purpose: 'Tests the Navigation component rendering, behavior, and user interactions',
    testsCount: 11,
    whatItTests: [
      'Component renders without crashing',
      'Logo is displayed correctly',
      'Desktop navigation links render (Home, Tech Stack, Training Plan, GitHub)',
      'Mobile navigation includes Testing link (not in desktop)',
      'Hamburger menu button functionality',
      'Mobile menu opens and closes correctly',
      'Links are accessible and clickable',
      'ARIA attributes for accessibility',
    ],
    whyImportant:
      'The navigation is the primary way users move through the site. Broken navigation severely impacts usability and user experience.',
    manualVerification:
      'Desktop (>768px): Verify logo and inline links (Home, Tech Stack, Training Plan, GitHub) are visible. Mobile (<768px): Verify hamburger menu works - click to open, displays all navigation links including Testing, click link to close, click X to close.',
    relatedDocs: ['src/components/Navigation.tsx', 'RESPONSIVE_DESIGN.md'],
  },
  {
    name: 'Footer Component',
    category: 'Component Tests',
    file: '__tests__/components/Footer.test.tsx',
    purpose: 'Tests the Footer component rendering and link functionality',
    testsCount: 10,
    whatItTests: [
      'Component renders correctly',
      'Copyright text displays with current year',
      'Privacy Policy link presence and href',
      'Cookie Policy link presence and href',
      'Training Plan link presence and href',
      'External GitHub link functionality',
      'All links are accessible',
    ],
    whyImportant:
      'The footer provides essential links to legal pages and external resources. Broken footer links can cause compliance issues and frustrate users seeking information.',
    manualVerification:
      'Scroll to the bottom of any page. Verify: 1) Copyright shows current year, 2) All links are present and clickable, 3) Privacy Policy and Cookie Policy links work, 4) GitHub link opens in new tab.',
    relatedDocs: ['src/components/Footer.tsx', 'src/app/privacy-policy/page.tsx'],
  },
  {
    name: 'Home Page Component',
    category: 'Component Tests',
    file: '__tests__/components/HomePage.test.tsx',
    purpose: 'Tests the Home page component rendering and content',
    testsCount: 4,
    whatItTests: [
      'Page renders without errors',
      'Main heading is present and accessible',
      'Primary content sections render correctly',
      'Call-to-action buttons are present',
      'Links to key pages work correctly',
    ],
    whyImportant:
      'The home page is the main entry point to the site. It must render correctly and guide users to important resources.',
    manualVerification:
      'Navigate to the home page (https://ffcadmin.org). Verify: 1) Page loads without errors, 2) All text and images display correctly, 3) All buttons and links are clickable, 4) Layout looks correct on mobile and desktop.',
    relatedDocs: ['src/app/page.tsx'],
  },
]

const categories = [
  {
    name: 'Configuration & Build',
    description:
      'Tests that validate project configuration files and build tooling setup. These ensure consistent development environments and catch configuration errors early.',
    icon: '⚙️',
  },
  {
    name: 'Build & Deployment',
    description:
      'Tests that verify the build output is correct and ready for deployment to GitHub Pages. These prevent broken deployments and missing pages.',
    icon: '🚀',
  },
  {
    name: 'Design & Responsiveness',
    description:
      'Tests that ensure the site works correctly on all device sizes and meets accessibility standards. These verify mobile, tablet, and desktop layouts.',
    icon: '📱',
  },
  {
    name: 'Component Tests',
    description:
      'Tests that validate individual React components render correctly and behave as expected. These catch UI bugs before they reach users.',
    icon: '🧩',
  },
]

export default function Testing() {
  // Calculate test statistics dynamically from the testSuites array
  const totalTestSuites = testSuites.length
  const totalTests = testSuites.reduce((sum, suite) => sum + suite.testsCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12 px-4 sm:px-6 lg:px-8">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold">Test Documentation</h1>
          </div>
          <p className="text-green-100 text-lg">
            Comprehensive testing documentation for the Free For Charity Admin Portal
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Testing</h2>
          <p className="text-gray-700 mb-4">
            This project includes <strong>{totalTestSuites} comprehensive test suites</strong> with{' '}
            <strong>{totalTests} automated tests</strong> that validate every aspect of the
            application from configuration to deployment.
          </p>
          <p className="text-gray-700 mb-4">
            Testing is integrated into the CI/CD pipeline and runs automatically on every pull
            request. All tests must pass before code can be merged to the main branch.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <div className="flex items-center mb-2">
                <svg
                  className="w-6 h-6 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-semibold text-gray-900">Test Suites</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{totalTestSuites}</p>
              <p className="text-sm text-gray-600">Organized by category</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <div className="flex items-center mb-2">
                <svg
                  className="w-6 h-6 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="font-semibold text-gray-900">Total Tests</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{totalTests}</p>
              <p className="text-sm text-gray-600">All passing</p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
              <div className="flex items-center mb-2">
                <svg
                  className="w-6 h-6 text-purple-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h3 className="font-semibold text-gray-900">CI/CD</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">Automated</p>
              <p className="text-sm text-gray-600">Every PR & deployment</p>
            </div>
          </div>
        </div>

        {/* Test Categories */}
        {categories.map((category, idx) => (
          <div key={idx} className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4" aria-hidden="true">
                  {category.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                {testSuites
                  .filter((suite) => suite.category === category.name)
                  .map((suite, suiteIdx) => (
                    <div key={suiteIdx} className="border-l-4 border-green-600 pl-6 py-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{suite.name}</h3>
                          <p className="text-sm text-gray-500 font-mono mb-2">{suite.file}</p>
                          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {suite.testsCount} tests passing
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Purpose</h4>
                          <p className="text-gray-700">{suite.purpose}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">What It Tests</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {suite.whatItTests.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Why It's Important</h4>
                          <p className="text-gray-700">{suite.whyImportant}</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                              />
                            </svg>
                            Manual Verification
                          </h4>
                          <p className="text-blue-900 text-sm">{suite.manualVerification}</p>
                        </div>

                        {suite.relatedDocs && suite.relatedDocs.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Related Documentation
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {suite.relatedDocs.map((doc, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  {doc}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}

        {/* Running Tests Section (truncated for length, continuing in next message) */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 md:p-8 border border-indigo-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Running Tests</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Developers: Local Testing
              </h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="mb-2"># Run all tests</div>
                <div className="text-green-400">pnpm test</div>
                <div className="mt-4 mb-2"># Run tests in watch mode (auto-rerun on changes)</div>
                <div className="text-green-400">pnpm test:watch</div>
                <div className="mt-4 mb-2"># Run tests with coverage report</div>
                <div className="text-green-400">pnpm test:coverage</div>
                <div className="mt-4 mb-2"># Run specific test file</div>
                <div className="text-green-400">pnpm test __tests__/accessibility.test.js</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Contributors: Before Committing
              </h3>
              <p className="text-gray-700 mb-3">
                Always run the full quality check sequence before pushing code:
              </p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-green-400">
                  pnpm run format && pnpm run lint && pnpm run build && pnpm test
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                This matches the CI pipeline order and catches issues before they reach GitHub.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                For Administrators: CI/CD Pipeline
              </h3>
              <p className="text-gray-700 mb-3">Tests run automatically in GitHub Actions:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>On Pull Requests:</strong> All tests run before merge is allowed
                </li>
                <li>
                  <strong>On Push to Main:</strong> Tests run before deployment to production
                </li>
                <li>
                  <strong>After Deployment:</strong> Lighthouse CI runs performance audits
                </li>
              </ul>
              <p className="text-gray-600 text-sm mt-3">
                View test results in the GitHub Actions tab:{' '}
                <a
                  href="https://github.com/FreeForCharity/ffcadmin.org/actions"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Actions Dashboard
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Understanding Test Results */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Test Results</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-green-600 pl-4 py-2">
              <h3 className="font-semibold text-green-900 mb-1 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                ✅ All Tests Passing
              </h3>
              <p className="text-gray-700 text-sm">
                Everything is working correctly. Code quality standards are met and the application
                is ready for deployment.
              </p>
            </div>

            <div className="border-l-4 border-red-600 pl-4 py-2">
              <h3 className="font-semibold text-red-900 mb-1 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                ❌ Test Failures
              </h3>
              <p className="text-gray-700 text-sm mb-2">
                One or more tests failed. This indicates a problem that must be fixed before code
                can be merged. Common causes:
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>Configuration file is missing or invalid</li>
                <li>Build output structure changed</li>
                <li>Component rendering failed</li>
                <li>Accessibility violations introduced</li>
              </ul>
            </div>

            <div className="border-l-4 border-yellow-600 pl-4 py-2">
              <h3 className="font-semibold text-yellow-900 mb-1 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                ⚠️ Console Warnings
              </h3>
              <p className="text-gray-700 text-sm">
                Tests pass but warnings are present (e.g., React act() warnings). These should be
                addressed but don't block deployment. They indicate potential issues that could
                cause problems later.
              </p>
            </div>
          </div>
        </div>

        {/* For More Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Documentation
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <a
                    href="https://github.com/FreeForCharity/ffcadmin.org/blob/main/TEST_CASES.md"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TEST_CASES.md
                  </a>{' '}
                  - Detailed test strategy
                </li>
                <li>
                  <a
                    href="https://github.com/FreeForCharity/ffcadmin.org/blob/main/CODE_QUALITY.md"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CODE_QUALITY.md
                  </a>{' '}
                  - Quality standards
                </li>
                <li>
                  <a
                    href="https://github.com/FreeForCharity/ffcadmin.org/blob/main/CONTRIBUTING.md"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CONTRIBUTING.md
                  </a>{' '}
                  - Development workflow
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Testing Frameworks
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <a
                    href="https://jestjs.io/docs/getting-started"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Jest
                  </a>{' '}
                  - Test runner and assertions
                </li>
                <li>
                  <a
                    href="https://testing-library.com/docs/react-testing-library/intro/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    React Testing Library
                  </a>{' '}
                  - Component testing
                </li>
                <li>
                  <a
                    href="https://github.com/nickcolley/jest-axe"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    jest-axe
                  </a>{' '}
                  - Accessibility testing
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <strong>Questions or issues with tests?</strong> Check our{' '}
              <a
                href="https://github.com/FreeForCharity/ffcadmin.org/issues"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Issues
              </a>{' '}
              or review the{' '}
              <a href="/documentation" className="text-blue-600 hover:underline">
                Documentation Center
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
