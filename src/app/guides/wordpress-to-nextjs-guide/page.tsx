import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WordPress to Next.js Conversion Guide',
  description:
    'Step-by-step guide for FFC volunteers to convert WordPress/Divi charity sites to Next.js static sites on GitHub Pages. Covers content audit, export, CI/CD, testing, and DNS cutover.',
  keywords:
    'WordPress migration, Next.js, static site, GitHub Pages, volunteer guide, nonprofit website conversion',
}

interface GuideSection {
  id: string
  number: string
  title: string
  icon: string
}

const sections: GuideSection[] = [
  { id: 'why-migrate', number: '1', title: 'Why FFC Migrates Off WordPress', icon: '🎯' },
  { id: 'ffc-stack', number: '2', title: 'The FFC Technology Stack', icon: '🏗️' },
  { id: 'prerequisites', number: '3', title: 'Prerequisites and Tools', icon: '🔧' },
  { id: 'content-audit', number: '4', title: 'Content Audit Process', icon: '📋' },
  { id: 'simply-static', number: '5', title: 'Simply Static Export', icon: '📦' },
  { id: 'template-setup', number: '6', title: 'Template Setup and Customization', icon: '🧩' },
  { id: 'mandatory-footer', number: '7', title: 'Mandatory Footer Section', icon: '📐' },
  { id: 'mandatory-team', number: '8', title: 'Mandatory Team Section', icon: '👥' },
  { id: 'divi-to-tailwind', number: '9', title: 'Divi-to-Tailwind Component Mapping', icon: '🔄' },
  { id: 'cicd-pipeline', number: '10', title: 'CI/CD Pipeline', icon: '⚙️' },
  { id: 'testing', number: '11', title: 'Testing Checklist', icon: '✅' },
  { id: 'deployment', number: '12', title: 'Deployment and DNS Cutover', icon: '🚀' },
  { id: 'rollback', number: '13', title: 'Rollback Procedure', icon: '↩️' },
  { id: 'faq', number: '14', title: 'FAQ for Charities and Admins', icon: '❓' },
  { id: 'references', number: '15', title: 'Reference Links', icon: '🔗' },
]

export default function WordPressToNextJSGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-4">
            <svg
              className="w-10 h-10 mr-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                WordPress to Next.js Conversion Guide
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Standard Operating Procedure for FFC Site Conversions
              </p>
            </div>
          </div>
          <p className="text-blue-100 text-lg max-w-3xl">
            This guide documents the complete process for converting a WordPress/Divi charity
            website to a Next.js static site deployed on GitHub Pages. It serves as both an SOP for
            FFC administrators and an educational resource for charities evaluating the FFC
            technology stack.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-blue-600/50 px-3 py-1 rounded-full text-sm font-medium">
              Last Updated: February 2026
            </span>
            <span className="bg-blue-600/50 px-3 py-1 rounded-full text-sm font-medium">
              Reference: FreeForCharity.org Migration
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <span className="text-xl mr-3" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  <span className="text-blue-600 font-bold mr-1">{section.number}.</span>
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Section 1: Why Migrate */}
        <section id="why-migrate" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🎯
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                1. Why FFC Migrates Off WordPress
              </h2>
              <p className="text-gray-600">
                The case for static sites over WordPress for nonprofits
              </p>
            </div>
          </div>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-700 mb-4">
              Free For Charity made the strategic decision to migrate all supported charity websites
              from WordPress/Divi to Next.js static sites. This section explains the reasoning for
              charities and administrators who may be unfamiliar with the trade-offs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h3 className="font-bold text-red-800 mb-3">WordPress Challenges</h3>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">&#10005;</span>
                    <span>
                      <strong>Hosting costs:</strong> WPMUDEV hosting runs $50-100+/month per site
                      with cPanel infrastructure
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">&#10005;</span>
                    <span>
                      <strong>Security surface:</strong> PHP runtime, database, admin panel, and
                      plugins each present attack vectors requiring constant patching
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">&#10005;</span>
                    <span>
                      <strong>Plugin dependencies:</strong> Divi theme builder, Hummingbird, Smush
                      Pro, SmartCrawl, Beehive Analytics all require updates and licensing
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">&#10005;</span>
                    <span>
                      <strong>Performance overhead:</strong> Dynamic page generation, database
                      queries, and plugin JavaScript increase load times
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">&#10005;</span>
                    <span>
                      <strong>Maintenance burden:</strong> Core updates, plugin updates, PHP version
                      upgrades, database backups, and security monitoring require ongoing effort
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h3 className="font-bold text-green-800 mb-3">Static Site Advantages</h3>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">&#10003;</span>
                    <span>
                      <strong>Free hosting:</strong> GitHub Pages is completely free with unlimited
                      bandwidth for public repos
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">&#10003;</span>
                    <span>
                      <strong>Zero attack surface:</strong> No server, no database, no admin panel,
                      no PHP. Only static HTML/CSS/JS files
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">&#10003;</span>
                    <span>
                      <strong>No dependencies:</strong> No plugins to update, no licenses to renew,
                      no hosting provider to manage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">&#10003;</span>
                    <span>
                      <strong>Blazing performance:</strong> Pre-built HTML served from
                      GitHub/Cloudflare edge. Lighthouse scores of 90+ are standard
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-0.5">&#10003;</span>
                    <span>
                      <strong>Git-based workflow:</strong> Version control, pull requests, automated
                      testing, and CI/CD provide professional-grade development practices
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-blue-900 text-sm">
                <strong>Bottom line:</strong> For a typical charity website (informational content,
                donation links, contact forms), WordPress is overkill. A static site delivers better
                performance, security, and cost savings while requiring less maintenance. The
                content rarely changes, and when it does, a git commit and automated deployment
                handles it.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: FFC Stack */}
        <section id="ffc-stack" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🏗️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">2. The FFC Technology Stack</h2>
              <p className="text-gray-600">What powers every FFC-supported charity website</p>
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Layer
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Technology
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Purpose
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Framework</td>
                  <td className="p-3 border border-gray-200">Next.js 16 (App Router)</td>
                  <td className="p-3 border border-gray-200">
                    React-based static site generator with TypeScript
                  </td>
                  <td className="p-3 border border-gray-200 text-green-700 font-medium">Free</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Styling</td>
                  <td className="p-3 border border-gray-200">Tailwind CSS 4</td>
                  <td className="p-3 border border-gray-200">
                    Utility-first CSS framework for responsive design
                  </td>
                  <td className="p-3 border border-gray-200 text-green-700 font-medium">Free</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Hosting</td>
                  <td className="p-3 border border-gray-200">GitHub Pages</td>
                  <td className="p-3 border border-gray-200">
                    Static file hosting with custom domain + HTTPS
                  </td>
                  <td className="p-3 border border-gray-200 text-green-700 font-medium">Free</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">DNS + DDoS</td>
                  <td className="p-3 border border-gray-200">Cloudflare</td>
                  <td className="p-3 border border-gray-200">
                    DNS management and DDoS protection (DNS-only mode, no CDN caching)
                  </td>
                  <td className="p-3 border border-gray-200 text-green-700 font-medium">Free</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">CI/CD</td>
                  <td className="p-3 border border-gray-200">GitHub Actions</td>
                  <td className="p-3 border border-gray-200">
                    Automated build, test, security scan, deploy, and Lighthouse audit
                  </td>
                  <td className="p-3 border border-gray-200 text-green-700 font-medium">Free</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Source Control</td>
                  <td className="p-3 border border-gray-200">GitHub</td>
                  <td className="p-3 border border-gray-200">
                    Version control, issue tracking, pull requests
                  </td>
                  <td className="p-3 border border-gray-200 text-green-700 font-medium">Free</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-medium">Testing</td>
                  <td className="p-3 border border-gray-200">Jest + Playwright + Lighthouse CI</td>
                  <td className="p-3 border border-gray-200">
                    Unit tests, E2E tests, accessibility, performance audits
                  </td>
                  <td className="p-3 border border-gray-200 text-green-700 font-medium">Free</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-medium">Code Quality</td>
                  <td className="p-3 border border-gray-200">
                    ESLint + Prettier + Husky + commitlint
                  </td>
                  <td className="p-3 border border-gray-200">
                    Linting, formatting, pre-commit hooks, conventional commits
                  </td>
                  <td className="p-3 border border-gray-200 text-green-700 font-medium">Free</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-900 text-sm">
              <strong>Total ongoing cost: $0/month.</strong> The entire stack is free for public
              repositories. Compare this to $50-100+/month for WordPress hosting. For a charity with
              10 websites, that is $6,000-12,000/year saved that goes directly back to the
              charitable mission.
            </p>
          </div>
        </section>

        {/* Section 3: Prerequisites */}
        <section id="prerequisites" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔧
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">3. Prerequisites and Tools</h2>
              <p className="text-gray-600">What you need before starting a conversion</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Required Software</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">1.</span>
                  <span>
                    <strong>Node.js 20.x+</strong> (LTS) &mdash; JavaScript runtime
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">2.</span>
                  <span>
                    <strong>pnpm</strong> (preferred) or npm &mdash; Package manager
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">3.</span>
                  <span>
                    <strong>Git</strong> &mdash; Version control
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">4.</span>
                  <span>
                    <strong>GitHub CLI (gh)</strong> &mdash; Repository and issue management
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">5.</span>
                  <span>
                    <strong>VS Code</strong> &mdash; Recommended editor with TypeScript support
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Required Access</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">1.</span>
                  <span>
                    <strong>WordPress admin</strong> for the source site (to install Simply Static
                    Pro)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">2.</span>
                  <span>
                    <strong>GitHub org membership</strong> in FreeForCharity (to create repos)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">3.</span>
                  <span>
                    <strong>Cloudflare dashboard</strong> access for the charity domain
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">4.</span>
                  <span>
                    <strong>WPMUDEV/cPanel access</strong> for the existing WordPress host
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">FFC Repo Naming Convention</h3>
            <p className="text-sm text-gray-700 mb-2">
              All FFC repositories follow a strict naming pattern:
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>
                <code className="bg-gray-200 px-2 py-0.5 rounded text-blue-800">
                  FFC-EX-DomainName.com
                </code>{' '}
                &mdash; External charity sites (e.g., <code>FFC-EX-AllTypeTowing.com</code>)
              </li>
              <li>
                <code className="bg-gray-200 px-2 py-0.5 rounded text-blue-800">
                  FFC-IN-DomainName.org
                </code>{' '}
                &mdash; Internal/platform FFC sites (e.g., <code>FFC-IN-ffcadmin.org</code>)
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Content Audit */}
        <section id="content-audit" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              📋
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">4. Content Audit Process</h2>
              <p className="text-gray-600">Inventory everything before you start building</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Before writing any code, perform a thorough audit of the existing WordPress site. This
            ensures no content is lost and provides a clear scope for the conversion.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                4.1 &mdash; Query the WordPress REST API
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                WordPress exposes all content via its REST API. Use these endpoints to build a
                complete inventory:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <p className="text-green-400"># Get all pages</p>
                <p>
                  curl
                  &quot;https://DOMAIN/wp-json/wp/v2/pages?per_page=100&amp;_fields=id,title,slug,status,link,modified&quot;
                </p>
                <p className="text-green-400 mt-2"># Get all posts</p>
                <p>
                  curl
                  &quot;https://DOMAIN/wp-json/wp/v2/posts?per_page=100&amp;_fields=id,title,slug,status,link,modified&quot;
                </p>
                <p className="text-green-400 mt-2"># Get all media</p>
                <p>
                  curl
                  &quot;https://DOMAIN/wp-json/wp/v2/media?per_page=100&amp;_fields=id,title,source_url,mime_type,media_details&quot;
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Save results to a CSV file for tracking. If more than 100 items exist, paginate with{' '}
                <code className="bg-gray-200 px-1 rounded">&amp;page=2</code>.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                4.2 &mdash; Cross-Reference with Sitemap
              </h3>
              <p className="text-sm text-gray-700">
                Check <code className="bg-gray-200 px-1 rounded">https://DOMAIN/sitemap.xml</code>{' '}
                and compare against your REST API inventory. Sometimes pages exist in the sitemap
                but not the API (or vice versa).
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                4.3 &mdash; Create URL Mapping Document
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Map every WordPress URL to its Next.js equivalent. Categorize each page:
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <strong className="text-green-700">MATCHED:</strong> WordPress slug matches an
                  existing Next.js route
                </li>
                <li>
                  <strong className="text-yellow-700">TO BUILD:</strong> Page exists in WordPress
                  but not yet in Next.js
                </li>
                <li>
                  <strong className="text-red-700">DROP:</strong> Page is not needed (test pages,
                  WordPress defaults, transactional pages)
                </li>
                <li>
                  <strong className="text-blue-700">REDIRECT:</strong> Slug changed or page dropped;
                  needs 301 redirect
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">4.4 &mdash; Media Asset Inventory</h3>
              <p className="text-sm text-gray-700">
                Catalog all images from{' '}
                <code className="bg-gray-200 px-1 rounded">wp-content/uploads/</code>.
                Cross-reference against assets already in the Next.js repo. Identify images to
                migrate, duplicates to remove, and files to convert to WebP format.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">4.5 &mdash; Content Ownership Matrix</h3>
              <p className="text-sm text-gray-700">
                Document where every piece of content lives in the Next.js repo: which pages use
                JSON data files, which have inline content in components, and what the update
                procedure is for each type.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              <strong>Important:</strong> Freeze all WordPress content edits after the audit. Any
              changes made to WordPress after this point may be lost in the conversion.
            </p>
          </div>
        </section>

        {/* Section 5: Simply Static Export */}
        <section id="simply-static" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              📦
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">5. Simply Static Export</h2>
              <p className="text-gray-600">Extracting a static HTML snapshot from WordPress</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Simply Static Pro is a WordPress plugin that generates a complete static HTML snapshot
            of your site. FFC uses this as a <strong>reference</strong> for content extraction, not
            as the final deployment. The actual Next.js site is built from components, not from
            Simply Static output.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Step 1: Pre-Export Checklist</h3>
              <p className="text-sm text-gray-700 mb-2">
                Disable these WordPress plugins before running Simply Static to avoid interference:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>Hummingbird (performance/caching)</li>
                <li>Smush Pro (image optimization)</li>
                <li>Beehive Analytics (tracking)</li>
                <li>SmartCrawl SEO (may inject dynamic scripts)</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3 mb-2">
                In <strong>Enhanced Crawl &gt; Plugins to Include</strong>, remove all admin-only
                and token-bearing plugins. Only keep Simply Static, Simply Static Pro, and plugins
                with actual frontend output (e.g., Strong Testimonials). Specifically remove:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>
                  <strong>Tawk.to Live Chat</strong> &mdash; embeds API tokens that trigger GitHub
                  push protection
                </li>
                <li>
                  <strong>Microsoft Clarity</strong> &mdash; embeds project ID tokens
                </li>
                <li>
                  <strong>Defender Pro</strong> &mdash; ships webauthn/JWT JS with secret-like
                  patterns
                </li>
                <li>
                  Hustle Pro, Shipper Pro, Snapshot Pro, Broken Link Checker, Branda Pro, Divi Dash,
                  WPMU DEV Dashboard &mdash; admin-only, no frontend assets
                </li>
              </ul>
              <p className="text-sm text-gray-700 mt-2">
                Also clear the Divi Builder cache:{' '}
                <em>
                  Divi &gt; Theme Options &gt; Builder &gt; Advanced &gt; Static CSS File Generation
                  &gt; Clear
                </em>
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Step 2: Configure Simply Static Pro</h3>
              <p className="text-sm text-gray-700 mb-2">
                Navigate to <em>Simply Static &gt; Settings &gt; Deploy</em> and configure:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 border border-gray-200 font-semibold">
                        Setting
                      </th>
                      <th className="text-left p-2 border border-gray-200 font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-gray-200">Deployment Method</td>
                      <td className="p-2 border border-gray-200">GitHub</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-2 border border-gray-200">Organization</td>
                      <td className="p-2 border border-gray-200 font-mono">FreeForCharity</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-200">Repository</td>
                      <td className="p-2 border border-gray-200 font-mono">
                        FFC-EX-DomainName.com (or FFC-IN-...)
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-2 border border-gray-200">Branch</td>
                      <td className="p-2 border border-gray-200 font-mono">simply-static-export</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-200">Folder</td>
                      <td className="p-2 border border-gray-200 font-mono">
                        (leave empty for root)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                The export goes to a{' '}
                <code className="bg-gray-200 px-1 rounded">simply-static-export</code> branch,
                <strong> never to main</strong>. Create this branch before running the export:
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono mt-2">
                gh api repos/FreeForCharity/REPO-NAME/git/refs -f
                ref=refs/heads/simply-static-export -f sha=$(gh api
                repos/FreeForCharity/REPO-NAME/git/refs/heads/main --jq .object.sha)
              </div>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Step 3: Run Diagnostics and Export</h3>
              <p className="text-sm text-gray-700">
                Run <em>Simply Static &gt; Diagnostics</em> first to verify no issues. Then generate
                the static export. The plugin will push the static HTML to your GitHub repo branch.
                This typically takes 5-15 minutes depending on site size.
              </p>
            </div>
          </div>

          <div className="border-l-4 border-purple-600 pl-4 mt-6">
            <h3 className="font-bold text-gray-900 mb-2">
              Step 4: GitHub Push Protection Fix (Required)
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              GitHub enables <strong>secret scanning push protection</strong> on all public
              repositories by default. WordPress HTML pages often contain embedded tokens (tawk.to
              widget IDs, Google Maps API keys, reCAPTCHA site keys, analytics IDs) that trigger
              GitHub&apos;s scanner. When Simply Static tries to commit a batch of files containing
              a flagged pattern, <strong>the entire batch is silently dropped</strong>. The plugin
              still reports &ldquo;Committed X of Y files&rdquo; and marks the export as complete,
              but the HTML pages never reach the branch.
            </p>
            <p className="text-sm text-gray-700 mb-2">
              Additionally, pushing 6,000+ files via the GitHub Trees API in rapid succession
              triggers
              <strong> secondary rate limiting</strong>, which causes further batch failures.
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Fix: Create an org-level branch ruleset that bypasses push protection
            </p>
            <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
              <li>
                Go to{' '}
                <a
                  href="https://github.com/organizations/FreeForCharity/settings/rules/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  GitHub Org Settings &gt; Rulesets &gt; New ruleset
                </a>
              </li>
              <li>
                Name:{' '}
                <code className="bg-gray-200 px-1 rounded">FFC Simply Static Export Bypass</code>
              </li>
              <li>
                Enforcement: <strong>Active</strong>
              </li>
              <li>
                Target: <strong>Branch</strong>, pattern:{' '}
                <code className="bg-gray-200 px-1 rounded">simply-static-export</code>
              </li>
              <li>
                Bypass actors: Add <strong>Organization Admin</strong> with &ldquo;Always&rdquo;
                bypass
              </li>
              <li>
                Under Rules, enable <strong>Block force pushes</strong> (keep protection) but do NOT
                enable &ldquo;Require secret scanning results&rdquo;
              </li>
            </ol>
            <p className="text-sm text-gray-700 mt-2">Alternatively, use the GitHub CLI:</p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono mt-2 overflow-x-auto">
              <pre>{`gh api orgs/FreeForCharity/rulesets \\
  --method POST \\
  -f name="FFC Simply Static Export Bypass" \\
  -f target=branch \\
  -f enforcement=active \\
  -f 'conditions[ref_name][include][]=refs/heads/simply-static-export' \\
  -f 'rules[][type]=secret_scanning' \\
  -f 'bypass_actors[][actor_type]=OrganizationAdmin' \\
  -f 'bypass_actors[][actor_id]=0' \\
  -f 'bypass_actors[][bypass_mode]=always'`}</pre>
            </div>
          </div>

          <div className="border-l-4 border-purple-600 pl-4 mt-6">
            <h3 className="font-bold text-gray-900 mb-2">Step 5: Enable Request Throttling</h3>
            <p className="text-sm text-gray-700 mb-2">
              In Simply Static Pro settings, check{' '}
              <strong>&ldquo;Throttle GitHub Requests&rdquo;</strong> to prevent secondary rate
              limiting when committing large exports. This adds a small delay between API calls and
              dramatically reduces rate limit failures.
            </p>
            <p className="text-sm text-gray-700">
              For sites with 5,000+ URLs, also consider excluding unnecessary directories in the
              <strong> URLs to Exclude</strong> field:
            </p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono mt-2 overflow-x-auto">
              <pre>{`# Exclude admin-only and irrelevant plugin assets
/wp-admin/
/wp-content/plugins/snapshot-backups/
/wp-content/plugins/shipper/
/wp-content/plugins/wp-defender/
/wp-content/plugins/hustle/
/wp-content/plugins/broken-link-checker/
/wp-content/plugins/ultimate-branding/`}</pre>
            </div>
          </div>

          <div className="border-l-4 border-purple-600 pl-4 mt-6">
            <h3 className="font-bold text-gray-900 mb-2">Step 6: Dedicated Fine-Grained PAT</h3>
            <p className="text-sm text-gray-700 mb-2">
              Create a <strong>dedicated fine-grained Personal Access Token</strong> for Simply
              Static exports. Never reuse a broad-scoped PAT. Configure the token with:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>
                <strong>Repository access:</strong> Only selected repositories (the target repo)
              </li>
              <li>
                <strong>Permissions:</strong> Contents (Read and write) only
              </li>
              <li>
                <strong>Expiration:</strong> 90 days maximum, rotate regularly
              </li>
              <li>
                <strong>Name:</strong>{' '}
                <code className="bg-gray-200 px-1 rounded">simply-static-REPONAME</code> for easy
                identification
              </li>
            </ul>
            <p className="text-sm text-red-700 mt-2 font-semibold">
              Never share, commit, or paste PATs in chat, issues, or documentation. If a PAT is
              exposed, revoke it immediately at github.com/settings/tokens.
            </p>
          </div>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 text-sm">
              <strong>Reference implementation:</strong> See the{' '}
              <a
                href="https://github.com/FreeForCharity/FFC-EX-AllTypeTowing.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline hover:text-blue-900"
              >
                FFC-EX-AllTypeTowing.com
              </a>{' '}
              repository for a completed Simply Static export example.
            </p>
          </div>
        </section>

        {/* Section 6: Template Setup */}
        <section id="template-setup" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🧩
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                6. Template Setup and Customization
              </h2>
              <p className="text-gray-600">Starting from the FFC Single Page Template</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Every new FFC site starts from the{' '}
            <a
              href="https://github.com/FreeForCharity/FFC_Single_Page_Template"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              FFC_Single_Page_Template
            </a>{' '}
            repository. This template includes the complete tech stack, CI/CD pipelines, testing
            infrastructure, and mandatory FFC components (footer, team section).
          </p>

          <div className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <p className="text-green-400">
                # 1. Create new repo from template (do NOT fork &mdash; clean history)
              </p>
              <p>gh repo create FreeForCharity/FFC-EX-CharityName.com --public</p>
              <p className="text-green-400 mt-2"># 2. Clone and copy template files</p>
              <p>
                git clone https://github.com/FreeForCharity/FFC_Single_Page_Template.git template
              </p>
              <p>git clone https://github.com/FreeForCharity/FFC-EX-CharityName.com.git site</p>
              <p>cp -r template/* site/</p>
              <p className="text-green-400 mt-2"># 3. Install and verify</p>
              <p>cd site &amp;&amp; pnpm install &amp;&amp; pnpm build</p>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 mt-6 mb-3">Customization Checklist</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
              <span>
                Update <code className="bg-gray-200 px-1 rounded">package.json</code> name and
                description
              </span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
              <span>
                Replace logo, favicon, and brand images in{' '}
                <code className="bg-gray-200 px-1 rounded">public/</code>
              </span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
              <span>
                Update <code className="bg-gray-200 px-1 rounded">src/app/layout.tsx</code> metadata
                (title, description, OG tags)
              </span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
              <span>
                Customize footer with charity contact info, EIN, GuideStar profile, social links
              </span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
              <span>
                Update team member data in{' '}
                <code className="bg-gray-200 px-1 rounded">src/data/team/</code>
              </span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
              <span>
                Add <code className="bg-gray-200 px-1 rounded">public/CNAME</code> with the charity
                domain
              </span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
              <span>
                Configure Google Tag Manager container ID in{' '}
                <code className="bg-gray-200 px-1 rounded">layout.tsx</code>
              </span>
            </label>
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
              <span>Build all content pages from WordPress reference material</span>
            </label>
          </div>
        </section>

        {/* Section 7: Mandatory Footer */}
        <section id="mandatory-footer" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              📐
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">7. Mandatory Footer Section</h2>
              <p className="text-gray-600">Required for ALL FFC-supported charity websites</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm font-bold">
              NON-NEGOTIABLE STANDARD: Every FFC-supported website MUST include all three footer
              columns with all mandatory elements. The structure is identical across all sites; only
              the charity-specific data changes.
            </p>
          </div>

          <div className="space-y-8">
            {/* Column 1 */}
            <div className="border-l-4 border-indigo-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Column 1: Endorsements</h3>
              <p className="text-sm text-gray-700 mb-3">
                Displays the organization&apos;s GuideStar/Candid Platinum Seal of Transparency.
                This badge is critical for donor trust and nonprofit credibility.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 border border-gray-200">Element</th>
                      <th className="text-left p-2 border border-gray-200">Required</th>
                      <th className="text-left p-2 border border-gray-200">Customization</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-gray-200">GuideStar Platinum Seal image</td>
                      <td className="p-2 border border-gray-200 text-green-700 font-bold">YES</td>
                      <td className="p-2 border border-gray-200">Charity&apos;s own seal year</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-2 border border-gray-200">Link to GuideStar profile</td>
                      <td className="p-2 border border-gray-200 text-green-700 font-bold">YES</td>
                      <td className="p-2 border border-gray-200">Charity&apos;s profile URL</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-200">Animated arrow CTA button</td>
                      <td className="p-2 border border-gray-200 text-green-700 font-bold">YES</td>
                      <td className="p-2 border border-gray-200">Links to profile</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-2 border border-gray-200">EIN number display</td>
                      <td className="p-2 border border-gray-200 text-green-700 font-bold">YES</td>
                      <td className="p-2 border border-gray-200">Charity&apos;s EIN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Why: GuideStar seals verify the organization&apos;s transparency and legitimacy.
                Donors check this before contributing. The EIN allows donors to verify 501(c)(3)
                status with the IRS.
              </p>
            </div>

            {/* Column 2 */}
            <div className="border-l-4 border-indigo-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Column 2: Quick Links + Policy Links</h3>
              <p className="text-sm text-gray-700 mb-3">
                Provides navigation and links to all mandatory policy pages. Every charity site must
                have all 6 policy pages.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">
                    Quick Links (navigation)
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Home</li>
                    <li>About</li>
                    <li>Donate</li>
                    <li>Volunteer</li>
                    <li>Contact</li>
                    <li>(Additional page links as needed)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">
                    Policy Links (ALL 6 MANDATORY)
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                    <li>Donation Policy</li>
                    <li>Privacy Policy</li>
                    <li>Cookie Policy</li>
                    <li>Terms of Service</li>
                    <li>Vulnerability Disclosure Policy</li>
                    <li>Security Acknowledgements</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Why: Policy pages are legal requirements for nonprofits accepting online donations.
                The Vulnerability Disclosure Policy and Security Acknowledgements demonstrate
                responsible security practices.
              </p>
            </div>

            {/* Column 3 */}
            <div className="border-l-4 border-indigo-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Column 3: Contact Us</h3>
              <p className="text-sm text-gray-700 mb-3">
                Provides all contact methods and social media links for the organization.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 border border-gray-200">Element</th>
                      <th className="text-left p-2 border border-gray-200">Icon</th>
                      <th className="text-left p-2 border border-gray-200">Link Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-gray-200">Email address</td>
                      <td className="p-2 border border-gray-200">Mail icon</td>
                      <td className="p-2 border border-gray-200">
                        <code className="bg-gray-200 px-1 rounded">mailto:</code>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-2 border border-gray-200">Phone number</td>
                      <td className="p-2 border border-gray-200">Phone icon</td>
                      <td className="p-2 border border-gray-200">
                        <code className="bg-gray-200 px-1 rounded">tel:</code>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-gray-200">Physical address(es)</td>
                      <td className="p-2 border border-gray-200">MapPin icon</td>
                      <td className="p-2 border border-gray-200">Google Maps link</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-2 border border-gray-200">Social media icons</td>
                      <td className="p-2 border border-gray-200">Platform icons</td>
                      <td className="p-2 border border-gray-200">
                        Facebook, X/Twitter, LinkedIn, GitHub
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-l-4 border-indigo-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Bottom Bar: Copyright + FFC Attribution
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Every FFC site must include this exact copyright format:
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono">
                &copy; {'{year}'} All Rights Are Reserved by {'{Charity Name}'} a US 501c3 Non
                Profit | A project of https://freeforcharity.org
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Why: The FFC attribution is required because FFC provides the hosting, domain, and
                technical infrastructure at no cost. This attribution helps FFC demonstrate impact
                to its own donors.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Mandatory Team */}
        <section id="mandatory-team" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              👥
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">8. Mandatory Team Section</h2>
              <p className="text-gray-600">Required for ALL FFC-supported charity websites</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Every FFC site must display the organization&apos;s leadership team using the
            standardized
            <code className="bg-gray-200 px-1 rounded mx-1">TeamMemberCard</code> component.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Component Specifications</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Photo:</strong> 300x300px, circular crop,{' '}
                  <code className="bg-gray-200 px-1 rounded">ring-4</code> white border with shadow
                </li>
                <li>
                  <strong>Format:</strong> WebP (not PNG or JPEG)
                </li>
                <li>
                  <strong>Name:</strong> Full name displayed below photo
                </li>
                <li>
                  <strong>Title:</strong> Role/position in the organization
                </li>
                <li>
                  <strong>LinkedIn:</strong> SVG icon button linking to profile
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Grid Layout (Responsive)</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Desktop:</strong> 3 columns (first row), 2 columns (second row if 5
                  members)
                </li>
                <li>
                  <strong>Tablet:</strong> 2 columns
                </li>
                <li>
                  <strong>Mobile:</strong> 1 column (stacked)
                </li>
                <li>
                  <strong>Anchor:</strong>{' '}
                  <code className="bg-gray-200 px-1 rounded">id=&quot;team&quot;</code> for direct
                  linking
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-2">Data Structure</h3>
            <p className="text-sm text-gray-700 mb-2">
              Team member data lives in{' '}
              <code className="bg-gray-200 px-1 rounded">src/data/team/</code> as individual JSON
              files:
            </p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono">
              {`{
  "name": "Clarke Moyer",
  "title": "Founder / President",
  "imageUrl": "/Images/member1.webp",
  "linkedinUrl": "https://www.linkedin.com/in/clarkemoyer/"
}`}
            </div>
          </div>
        </section>

        {/* Section 9: Divi to Tailwind */}
        <section id="divi-to-tailwind" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔄
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                9. Divi-to-Tailwind Component Mapping
              </h2>
              <p className="text-gray-600">
                Converting WordPress/Divi modules to React/Tailwind components
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            Divi uses &quot;modules&quot; for layout. Each module maps to a Next.js/Tailwind
            component:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Divi Module
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Next.js/Tailwind Equivalent
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900 border border-gray-200">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200">Section + Row + Column</td>
                  <td className="p-3 border border-gray-200">
                    <code className="bg-gray-200 px-1 rounded">{'<section>'}</code> with Tailwind
                    grid/flex
                  </td>
                  <td className="p-3 border border-gray-200">
                    Use <code className="bg-gray-200 px-1 rounded">max-w-7xl mx-auto</code> for
                    container
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Fullwidth Header</td>
                  <td className="p-3 border border-gray-200">
                    <code className="bg-gray-200 px-1 rounded">HeroSection</code> component
                  </td>
                  <td className="p-3 border border-gray-200">Background image + overlay + CTA</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Blurb Module</td>
                  <td className="p-3 border border-gray-200">
                    <code className="bg-gray-200 px-1 rounded">CallToActionCard</code>
                  </td>
                  <td className="p-3 border border-gray-200">Icon + title + description card</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Accordion / Toggle</td>
                  <td className="p-3 border border-gray-200">
                    FAQ component with <code className="bg-gray-200 px-1 rounded">useState</code>
                  </td>
                  <td className="p-3 border border-gray-200">
                    Expand/collapse with plus/minus SVGs
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Testimonial Module</td>
                  <td className="p-3 border border-gray-200">Swiper carousel or grid</td>
                  <td className="p-3 border border-gray-200">Quote marks + author + photo</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Contact Form</td>
                  <td className="p-3 border border-gray-200">External service (Formspree, etc.)</td>
                  <td className="p-3 border border-gray-200">
                    Static sites cannot process forms server-side
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Number Counter</td>
                  <td className="p-3 border border-gray-200">
                    Animated counter with Framer Motion
                  </td>
                  <td className="p-3 border border-gray-200">
                    Trigger on scroll/viewport intersection
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">Gallery Module</td>
                  <td className="p-3 border border-gray-200">CSS Grid + WebP images</td>
                  <td className="p-3 border border-gray-200">Responsive grid with object-cover</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200">Video Module</td>
                  <td className="p-3 border border-gray-200">
                    <code className="bg-gray-200 px-1 rounded">{'<video>'}</code> element with
                    poster
                  </td>
                  <td className="p-3 border border-gray-200">Self-hosted MP4 in public/videos/</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200">CTA Module</td>
                  <td className="p-3 border border-gray-200">Tailwind button/card with Link</td>
                  <td className="p-3 border border-gray-200">
                    Use Next.js Link for internal routes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 10: CI/CD Pipeline */}
        <section id="cicd-pipeline" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ⚙️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">10. CI/CD Pipeline</h2>
              <p className="text-gray-600">Automated build, test, scan, and deploy workflows</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            The FFC template includes 4 GitHub Actions workflows that run automatically:
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  1
                </div>
                <h3 className="font-bold text-gray-900">
                  CI Workflow (<code className="bg-gray-200 px-1 rounded text-sm">ci.yml</code>)
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Runs on every push and pull request. Installs dependencies, runs linting (ESLint),
                type checking (TypeScript), unit tests (Jest), and builds the static site. Must pass
                before merge.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  2
                </div>
                <h3 className="font-bold text-gray-900">
                  CodeQL Analysis (
                  <code className="bg-gray-200 px-1 rounded text-sm">codeql.yml</code>)
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                GitHub&apos;s security scanner. Runs after CI passes. Scans for
                JavaScript/TypeScript vulnerabilities, injection risks, and insecure patterns.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  3
                </div>
                <h3 className="font-bold text-gray-900">
                  Deploy (<code className="bg-gray-200 px-1 rounded text-sm">deploy.yml</code>)
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Runs after CodeQL passes (on main branch only). Builds the production static site
                and deploys to GitHub Pages. Updates the live website automatically.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-3 text-sm">
                  4
                </div>
                <h3 className="font-bold text-gray-900">
                  Lighthouse CI (
                  <code className="bg-gray-200 px-1 rounded text-sm">lighthouse.yml</code>)
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Runs after deploy completes. Audits the live site for Performance, Accessibility,
                Best Practices, and SEO. Target scores: Performance &ge; 90, Accessibility &ge; 95,
                Best Practices &ge; 90, SEO &ge; 90.
              </p>
            </div>
          </div>

          <div className="mt-4 bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Pipeline flow:</strong> Push to main &rarr; CI (lint + type check + test +
              build) &rarr; CodeQL (security scan) &rarr; Deploy (GitHub Pages) &rarr; Lighthouse
              (performance audit)
            </p>
          </div>
        </section>

        {/* Section 11: Testing */}
        <section id="testing" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ✅
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">11. Testing Checklist</h2>
              <p className="text-gray-600">Quality gates before deployment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Automated Tests</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>
                    <strong>Unit tests (Jest)</strong> &mdash; Component rendering, data loaders,
                    utilities
                  </span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>
                    <strong>Accessibility (jest-axe)</strong> &mdash; WCAG 2.1 AA compliance checks
                  </span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>
                    <strong>E2E tests (Playwright)</strong> &mdash; Navigation, forms, mobile menu,
                    footer links
                  </span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>
                    <strong>Lighthouse CI</strong> &mdash; Performance, A11y, Best Practices, SEO
                    scores
                  </span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>
                    <strong>Broken links (Linkinator)</strong> &mdash; All internal and external
                    links verified
                  </span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Manual Verification</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>All pages load without errors</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>Navigation works on desktop and mobile</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>Footer has all 3 columns with all mandatory elements</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>Team section displays all members correctly</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>Content matches WordPress source (page-by-page comparison)</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>Responsive design on mobile, tablet, and desktop</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>Cookie consent banner functions correctly</span>
                </label>
                <label className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded" disabled />
                  <span>SEO meta tags present on every page</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Section 12: Deployment */}
        <section id="deployment" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🚀
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">12. Deployment and DNS Cutover</h2>
              <p className="text-gray-600">Zero-downtime switch from WordPress to Next.js</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Step 1: Configure GitHub Pages</h3>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>
                  Add <code className="bg-gray-200 px-1 rounded">public/CNAME</code> with the
                  charity domain (e.g., <code>charityname.org</code>)
                </li>
                <li>
                  Add <code className="bg-gray-200 px-1 rounded">public/.nojekyll</code> (empty file
                  to disable Jekyll processing)
                </li>
                <li>Enable GitHub Pages in repo Settings &gt; Pages &gt; Source: GitHub Actions</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Step 2: Set Up Cloudflare Redirects</h3>
              <p className="text-sm text-gray-700 mb-2">
                Configure Cloudflare Bulk Redirects for any changed or dropped URLs:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>Create a Bulk Redirect List in Cloudflare dashboard</li>
                <li>Add 301 redirects for each old URL &rarr; new URL</li>
                <li>Enable the Bulk Redirect Rule</li>
              </ul>
              <p className="text-sm text-gray-600 mt-1">
                Note: Cloudflare is used in <strong>DNS-only mode</strong> (orange cloud OFF for
                most records). No CDN caching rules, no Workers, no Page Rules are needed.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Step 3: Staging Test</h3>
              <p className="text-sm text-gray-700">
                Before touching DNS, deploy to the GitHub Pages default URL and run full
                verification. The site should be accessible at{' '}
                <code className="bg-gray-200 px-1 rounded">
                  https://freeforcharity.github.io/REPO-NAME/
                </code>
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="font-bold text-gray-900 mb-2">Step 4: DNS Cutover</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <p className="text-green-400"># In Cloudflare DNS:</p>
                <p className="text-green-400">
                  # 1. Change the A record (pointing to WordPress/cPanel IP)
                </p>
                <p className="text-red-400">DELETE A charityname.org &rarr; 66.45.234.13</p>
                <p className="text-green-400"># 2. Add CNAME to GitHub Pages</p>
                <p className="text-blue-400">
                  ADD CNAME charityname.org &rarr; freeforcharity.github.io
                </p>
                <p className="text-green-400">
                  # 3. Set proxy status: DNS-only (gray cloud) for DDoS protection
                </p>
                <p className="text-green-400">
                  # 4. Wait for GitHub HTTPS certificate provisioning (up to 1 hour)
                </p>
                <p className="text-green-400"># 5. Verify all pages at https://charityname.org</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <p className="text-amber-900 text-sm">
              <strong>Important:</strong> Keep the WordPress site running for at least 2 weeks after
              cutover. This provides a rollback option if any issues are discovered. Do NOT cancel
              WordPress hosting until the Next.js site is verified and stable.
            </p>
          </div>
        </section>

        {/* Section 13: Rollback */}
        <section id="rollback" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ↩️
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">13. Rollback Procedure</h2>
              <p className="text-gray-600">How to revert to WordPress if needed</p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            If critical issues are discovered after cutover, reverting to WordPress takes about 5
            minutes:
          </p>

          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-bold text-red-600 mr-2">1.</span>
              <span>
                In Cloudflare DNS, delete the CNAME record pointing to{' '}
                <code className="bg-gray-200 px-1 rounded">freeforcharity.github.io</code>
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-red-600 mr-2">2.</span>
              <span>
                Re-create the A record pointing to the WordPress/cPanel IP (e.g.,{' '}
                <code className="bg-gray-200 px-1 rounded">66.45.234.13</code>)
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-red-600 mr-2">3.</span>
              <span>Wait for DNS propagation (typically 5-30 minutes with Cloudflare)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-red-600 mr-2">4.</span>
              <span>Verify the WordPress site is accessible at the domain</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-red-600 mr-2">5.</span>
              <span>Investigate and fix the Next.js issue before attempting cutover again</span>
            </li>
          </ol>

          <div className="mt-4 bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <p className="text-green-900 text-sm">
              <strong>Why this works:</strong> The WordPress site is untouched during the entire
              conversion process. DNS is the only thing that changes. Reverting DNS restores
              WordPress immediately.
            </p>
          </div>
        </section>

        {/* Section 14: FAQ */}
        <section id="faq" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              ❓
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">14. FAQ for Charities and Admins</h2>
              <p className="text-gray-600">Common questions about the conversion process</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Q: Will our website look different after conversion?
              </h3>
              <p className="text-sm text-gray-700">
                The goal is to maintain the same visual appearance and content. The technology
                changes behind the scenes, but visitors should see the same website. Performance
                will typically improve significantly.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Q: How do we update content after the conversion?
              </h3>
              <p className="text-sm text-gray-700">
                Content is updated by editing files in the GitHub repository. For simple text
                changes, you can edit directly on GitHub.com. For more complex changes, clone the
                repo locally, make changes, and push. The site rebuilds and deploys automatically.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">Q: What about our contact forms?</h3>
              <p className="text-sm text-gray-700">
                Static sites cannot process form submissions server-side. FFC uses external form
                services like Formspree or integrates with the charity&apos;s existing form
                provider. The form still works for visitors; it just submits to an external service
                instead of WordPress.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">Q: What about donations?</h3>
              <p className="text-sm text-gray-700">
                Donation processing is handled by external payment platforms (Zeffy, PayPal, Stripe,
                etc.) that the charity already uses. The donation page links to these external
                services. No payment processing happens on the website itself.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Q: Is there any downtime during the switch?
              </h3>
              <p className="text-sm text-gray-700">
                With proper execution, there is zero downtime. The new site is fully deployed and
                tested before the DNS switch. DNS changes with Cloudflare propagate in minutes.
                WordPress stays running as a backup during the transition period.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">Q: What does it cost us?</h3>
              <p className="text-sm text-gray-700">
                Nothing. The entire stack (hosting, DNS, CI/CD, source control) is free. FFC
                provides the conversion service at no cost. The only requirement is the mandatory
                footer attribution.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-bold text-gray-900 mb-2">
                Q: Can we go back to WordPress if we don&apos;t like it?
              </h3>
              <p className="text-sm text-gray-700">
                Yes. FFC keeps the WordPress site running for at least 2 weeks after cutover.
                Reverting is a 5-minute DNS change. However, most charities prefer the new stack due
                to better performance and zero maintenance requirements.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Q: Do we need technical staff to manage the new site?
              </h3>
              <p className="text-sm text-gray-700">
                For basic content updates, no. Simple text changes can be made through GitHub&apos;s
                web interface. For more complex changes (adding pages, modifying layout), some
                familiarity with HTML/React is helpful. FFC volunteers are available to assist with
                changes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 15: References */}
        <section id="references" className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4" aria-hidden="true">
              🔗
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">15. Reference Links</h2>
              <p className="text-gray-600">All related repositories, documentation, and tools</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">FFC Repositories</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a
                    href="https://github.com/FreeForCharity/FFC_Single_Page_Template"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    FFC_Single_Page_Template
                  </a>
                  <span className="text-gray-500"> &mdash; Canonical template for all sites</span>
                </li>
                <li>
                  <a
                    href="https://github.com/FreeForCharity/FFC-IN-freeforcharity.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    FFC-IN-freeforcharity.org
                  </a>
                  <span className="text-gray-500">
                    {' '}
                    &mdash; Main FFC website (conversion in progress)
                  </span>
                </li>
                <li>
                  <a
                    href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    FFC-IN-ffcadmin.org
                  </a>
                  <span className="text-gray-500"> &mdash; Admin portal (tracking issues)</span>
                </li>
                <li>
                  <a
                    href="https://github.com/FreeForCharity/FFC-EX-AllTypeTowing.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    FFC-EX-AllTypeTowing.com
                  </a>
                  <span className="text-gray-500">
                    {' '}
                    &mdash; First Simply Static reference export
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Technologies</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <a
                    href="https://nextjs.org/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Next.js Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://tailwindcss.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Tailwind CSS Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://pages.github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    GitHub Pages Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://playwright.dev/docs/intro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Playwright Testing Framework
                  </a>
                </li>
                <li>
                  <a
                    href="https://simplystatic.com/docs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Simply Static Pro Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-gray-900 mb-3">FFC Admin Documentation</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="/documentation" className="text-blue-600 underline hover:text-blue-800">
                  Documentation Center
                </a>
                <span className="text-gray-500"> &mdash; All admin portal documentation</span>
              </li>
              <li>
                <a href="/tech-stack" className="text-blue-600 underline hover:text-blue-800">
                  Tech Stack Overview
                </a>
                <span className="text-gray-500"> &mdash; Complete technology stack details</span>
              </li>
              <li>
                <a href="/sites-list" className="text-blue-600 underline hover:text-blue-800">
                  Sites List
                </a>
                <span className="text-gray-500">
                  {' '}
                  &mdash; All managed charity domains and health status
                </span>
              </li>
              <li>
                <a href="/testing" className="text-blue-600 underline hover:text-blue-800">
                  Testing Documentation
                </a>
                <span className="text-gray-500"> &mdash; Test suites and quality assurance</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Revision History */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revision History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left p-2 font-semibold text-gray-900 border border-gray-300">
                    Date
                  </th>
                  <th className="text-left p-2 font-semibold text-gray-900 border border-gray-300">
                    Version
                  </th>
                  <th className="text-left p-2 font-semibold text-gray-900 border border-gray-300">
                    Changes
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-gray-300">February 2026</td>
                  <td className="p-2 border border-gray-300">1.1</td>
                  <td className="p-2 border border-gray-300">
                    Added GitHub push protection fix, request throttling, PAT security guidance, and
                    URL exclusion list for Simply Static exports (Section 5, Steps 4-6)
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-300">February 2026</td>
                  <td className="p-2 border border-gray-300">1.0</td>
                  <td className="p-2 border border-gray-300">
                    Initial guide created during FreeForCharity.org conversion project
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            This guide is maintained at{' '}
            <a
              href="https://github.com/FreeForCharity/FFC-IN-ffcadmin.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              FFC-IN-ffcadmin.org
            </a>{' '}
            and published at{' '}
            <a
              href="https://ffcadmin.org/guides/wordpress-to-nextjs-guide"
              className="text-blue-600 underline"
            >
              ffcadmin.org/guides/wordpress-to-nextjs-guide
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
