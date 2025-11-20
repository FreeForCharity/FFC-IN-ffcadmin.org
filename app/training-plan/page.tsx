import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Global Admin Training Plan | Free For Charity',
  description:
    'Operation Digital Sovereignty - Comprehensive training plan for Global Administrator and Code Owner track, covering Microsoft 365 and GitHub certifications with military-themed progression.',
  keywords:
    'training plan, MS-900, GitHub Foundations, Global Administrator, certification, Microsoft 365, GitHub Copilot',
}

export default function TrainingPlan() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold">Global Admin Training Plan</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Operation Digital Sovereignty - Forge a dual-hatted leader with Global Administrator and
            Code Owner authority
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Executive Summary */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="border-l-4 border-blue-600 pl-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Executive Summary: Operation Digital Sovereignty
            </h2>
            <p className="text-gray-600 italic">Commander,</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              Per your directive, the following is the reconstituted and fully integrated
              operational training plan for the Global Administrator and Code Owner track. This plan
              has been restructured to align with the specific "Free for Charity" operational tempo.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
              <p className="text-blue-900 font-semibold mb-2">Mission Objective:</p>
              <p className="text-blue-900">
                To forge a dual-hatted leader capable of holding full Global Administrator authority
                over the Microsoft 365 tenant and Owner rights over the GitHub Organization.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Operational Overview:</h3>
            <ul className="space-y-3 mb-6">
              <li className="text-gray-700">
                <strong className="text-blue-600">Phase 1 (The Administrative Beachhead):</strong>{' '}
                Focuses on Microsoft 365 identity, security, and governance. Candidates must pass a
                simulated validation (MS-900 practice) before being granted live "Global Admin" keys
                to the charity tenant. The phase concludes with the actual MS-900 certification.
              </li>
              <li className="text-gray-700">
                <strong className="text-blue-600">Phase 2 (The Code Supremacy Campaign):</strong>{' '}
                Focuses on GitHub proficiency, specifically leveraging "Vibe Coding" (AI-driven
                development) to transform Global Admin-written Issues directly into Pull Requests.
                This phase concludes with the GitHub Foundations certification and the launch of the
                charity's digital presence.
              </li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
              <p className="text-green-900">
                <strong>Logistics Note:</strong> Test vouchers for both MS-900 and GitHub
                Foundations are fully funded at nonprofit/student rates.
              </p>
            </div>
          </div>
        </section>

        {/* Quartermaster's Report */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Detailed Analysis: Logistics and Licensing
          </h2>
          <p className="text-gray-700 mb-6">
            Before deployment, the following Quartermaster's report outlines the necessary tooling
            and financial requirements to support the "Vibe Stack" (AI-augmented administration).
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Quartermaster's Report: Licensing & Costs
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
              <caption className="sr-only">
                Licensing costs and operational notes for Free For Charity products
              </caption>
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Product / License
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Tactical Purpose
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Standard Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300"
                  >
                    Nonprofit / FFC Price
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Operational Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    Microsoft 365 Business Premium
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    Full Tenant Command, Intune, Defender, Conditional Access
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $22.00 /user/mo
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    $0.00 (First 10 seats)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Primary command infrastructure
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    GitHub Team (Organization)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    "Owner" status, branch protection, repo management
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $4.00 /user/mo
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    $0.00 (Unlimited seats)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Requires "GitHub for Nonprofits" application
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    GitHub Copilot Business
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    "Vibe Coding," CLI assistance, Automated PRs
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $19.00 /user/mo
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-red-600 border-r border-gray-300">
                    $19.00 /user/mo
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Hard Cost. Essential for the "Issue-to-PR" workflow
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    Microsoft 365 Copilot
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    "Vibe Working," AI in Office/Teams, Agent building
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $30.00 /user/mo
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-yellow-600 border-r border-gray-300">
                    $25.50 /user/mo
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Strategic augmentation. Requires base license
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    Cloudflare (Project Galileo)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    WAF, DDoS protection, Page Rules
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $20 - $200 /mo
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-green-600 border-r border-gray-300">
                    $0.00
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Project Galileo application required for full suite
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                    LastPass Teams/Business
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    Secure "Break Glass" vault
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300">
                    $4.00 - $7.00 /user/mo
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-yellow-600 border-r border-gray-300">
                    ~30% Discount
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    Contact Sales for "Impact Program"
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Phase 1 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="border-l-4 border-indigo-600 pl-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Phase 1: Operation Certified Foundation (Microsoft 365)
            </h2>
            <p className="text-gray-600">
              <strong>Mission:</strong> Establish the secure identity perimeter and governance
              structure.
            </p>
            <p className="text-gray-600">
              <strong>End State:</strong> Candidate holds Global Administrator access to the live
              tenant and possesses the MS-900 Certification.
            </p>
          </div>

          {/* Block A */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                A
              </span>
              Block A: Security & Intelligence (Pre-Deployment)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Initial gear check and perimeter security. Before touching
                the live environment, we establish the secure identity protocols.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Understand the "Zero Trust" defense doctrine and Identity Access Management (IAM).
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Study:</strong>{' '}
                    <a
                      href="https://learn.microsoft.com/en-us/training/modules/describe-identity-principles-concepts/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Describe Microsoft 365 identity and access management
                    </a>{' '}
                    (Microsoft Learn)
                  </li>
                  <li className="text-gray-700">
                    <strong>Study:</strong>{' '}
                    <a
                      href="https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-security-solutions/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Describe Microsoft 365 security solutions
                    </a>{' '}
                    (Microsoft Learn)
                  </li>
                  <li className="text-gray-700">
                    <strong>Action:</strong> Configure personal MFA and secure authentication
                    methods.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Block B */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                B
              </span>
              Block B: The MS-900 Theoretical Gate (Simulation)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Simulated Combat Evaluation. The candidate must prove
                competence in a controlled environment before receiving command codes.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Master the core concepts of cloud services and SaaS.
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Study:</strong>{' '}
                    <a
                      href="https://learn.microsoft.com/en-us/training/courses/ms-900t01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Microsoft 365 Fundamentals (MS-900) Learning Path
                    </a>{' '}
                    (Microsoft Learn)
                  </li>
                  <li className="text-gray-700">
                    <strong>Validation Event:</strong> Complete official MS-900 Practice Tests.
                  </li>
                  <li className="text-gray-700">
                    <strong>Pass Criteria:</strong> Must achieve a score of &gt;80%.
                  </li>
                </ul>
                <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded mt-4">
                  <p className="text-green-900 font-semibold">
                    Promotion Event: Upon successful completion of the &gt;80% threshold, the
                    candidate is granted Global Administrator rights to the live Charity Tenant.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Block C */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                C
              </span>
              Block C: Live Terrain Configuration (Field Operations)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Taking Command. The candidate now operates on the live
                tenant (the new charity environment).
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Configure the tenant for active duty using the newly granted Global Admin rights.
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Execution:</strong> Configure custom domains (DNS records).
                  </li>
                  <li className="text-gray-700">
                    <strong>Execution:</strong> Create initial user accounts and assign licenses.
                  </li>
                  <li className="text-gray-700">
                    <strong>Reference:</strong>{' '}
                    <a
                      href="https://learn.microsoft.com/en-us/microsoft-365/admin/setup/setup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Set up Microsoft 365 for business
                    </a>{' '}
                    (Microsoft Learn)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Block D */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                D
              </span>
              Block D: Governance & Compliance (Fortification)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Digging in. Establishing long-term governance and
                compliance rules on the live tenant.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Implement data handling and compliance policies.
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Study & Apply:</strong>{' '}
                    <a
                      href="https://learn.microsoft.com/en-us/training/paths/describe-capabilities-of-microsoft-compliance-solutions/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Describe Microsoft 365 compliance capabilities
                    </a>{' '}
                    (Microsoft Learn)
                  </li>
                  <li className="text-gray-700">
                    <strong>Execution:</strong> Configure base retention policies and compliance
                    alerts in the live tenant.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phase 1 Final Gate */}
          <div className="bg-indigo-50 border-2 border-indigo-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">
              Phase 1 Final Gate: MS-900 Certification
            </h3>
            <ul className="space-y-2">
              <li className="text-indigo-900">
                <strong>Mission:</strong> Pass the official{' '}
                <a
                  href="https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-900/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Microsoft 365 Fundamentals (MS-900) Exam
                </a>
                .
              </li>
              <li className="text-indigo-900">
                <strong>Support:</strong> Voucher provided by unit command.
              </li>
            </ul>
          </div>
        </section>

        {/* Phase 2 */}
        <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="border-l-4 border-purple-600 pl-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Phase 2: Operation Code Supremacy (GitHub & Copilot)
            </h2>
            <p className="text-gray-600">
              <strong>Mission:</strong> Deploy the web presence and master AI-driven development
              ("Vibe Coding").
            </p>
            <p className="text-gray-600">
              <strong>End State:</strong> Candidate holds Code Owner rights, a live website, and the
              GitHub Foundations Certification.
            </p>
          </div>

          {/* Gate 1 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                1
              </span>
              Gate 1: Initial Infiltration (Profile Deployment)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Establishing the Digital Beachhead.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Deploy a professional GitHub profile managed "as code."
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Training:</strong>{' '}
                    <a
                      href="https://learn.microsoft.com/en-us/training/modules/introduction-to-github/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Introduction to GitHub
                    </a>{' '}
                    (Microsoft Learn)
                  </li>
                  <li className="text-gray-700">
                    <strong>Action:</strong> Create the GitHub account, set up 2FA, and create the
                    profile README.md.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gate 2 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                2
              </span>
              Gate 2: Forward Operating Base (Coming Soon Site)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Establishing the FOB. A placeholder presence to signal
                operations.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Deploy a "Coming Soon" page using GitHub Pages.
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Training:</strong>{' '}
                    <a
                      href="https://docs.github.com/en/pages/getting-started-with-github-pages"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      GitHub Pages documentation
                    </a>{' '}
                    (GitHub Docs)
                  </li>
                  <li className="text-gray-700">
                    <strong>Action:</strong> Create a public repository and deploy a static HTML
                    index page.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gate 3 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                3
              </span>
              Gate 3: Fortification (Security & Cloudflare)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Securing the Perimeter. The repository is public; defenses
                must be active.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Secure the supply chain and map the custom domain.
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Training:</strong>{' '}
                    <a
                      href="https://docs.github.com/en/code-security/getting-started/securing-your-repository"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Securing your repository
                    </a>{' '}
                    (GitHub Docs)
                  </li>
                  <li className="text-gray-700">
                    <strong>Action:</strong> Enable Dependabot and CodeQL.
                  </li>
                  <li className="text-gray-700">
                    <strong>Action:</strong> Configure Cloudflare DNS and map to GitHub Pages.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gate 4 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                4
              </span>
              Gate 4: Strategic Code Review (Vibe Coding & Auto-PRs)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> AI-Augmented Command. This is the core of the new
                doctrine. The Global Admin (Commander) dictates the intent via an Issue, and the AI
                (Vibe Coding) executes the tactic via a PR.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Execute the "Issue-to-PR" workflow using GitHub Copilot.
                </p>
                <p className="text-gray-900 font-semibold mb-2">Doctrine:</p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li className="text-gray-700">
                    Global Admin writes a structured, detailed Issue defining a feature or fix.
                  </li>
                  <li className="text-gray-700">
                    Copilot Workspace/CLI is used to read the Issue context.
                  </li>
                  <li className="text-gray-700">
                    Copilot generates the code changes automatically.
                  </li>
                  <li className="text-gray-700">
                    Copilot opens the Pull Request (PR) referencing the Issue.
                  </li>
                </ul>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Training:</strong>{' '}
                    <a
                      href="https://learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      GitHub Copilot Fundamentals
                    </a>{' '}
                    (Microsoft Learn)
                  </li>
                  <li className="text-gray-700">
                    <strong>Training:</strong>{' '}
                    <a
                      href="https://docs.github.com/en/copilot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Using GitHub Copilot for Pull Requests
                    </a>{' '}
                    (GitHub Docs)
                  </li>
                  <li className="text-gray-700">
                    <strong>Action:</strong> Implement Branch Protection rules requiring PRs for all
                    changes.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gate 5 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                5
              </span>
              Gate 5: Automated Supply Chain (CI/CD)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Logistics Automation. Ensuring valid code is deployed
                immediately.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Implement GitHub Actions for Continuous Deployment.
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Training:</strong>{' '}
                    <a
                      href="https://learn.microsoft.com/en-us/training/modules/introduction-to-github-actions/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Automate your workflow with GitHub Actions
                    </a>{' '}
                    (Microsoft Learn)
                  </li>
                  <li className="text-gray-700">
                    <strong>Action:</strong> Create a .yml workflow that automatically builds and
                    deploys the website upon PR merge.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gate 6 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                6
              </span>
              Gate 6: Victory (Launch & Handover)
            </h3>
            <div className="ml-11 space-y-4">
              <p className="text-gray-700">
                <strong>Concept:</strong> Final Verification and Transition to Operations.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 font-semibold mb-2">Objective:</p>
                <p className="text-gray-700 mb-4">
                  Launch the full site and establish the Volunteer hierarchy.
                </p>
                <p className="text-gray-900 font-semibold mb-2">Directives:</p>
                <ul className="space-y-2">
                  <li className="text-gray-700">
                    <strong>Action:</strong> Merge the final "Launch" PR.
                  </li>
                  <li className="text-gray-700">
                    <strong>Action:</strong> Invite volunteers to the GitHub Organization with
                    restricted (non-Admin) roles.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phase 2 Final Gate */}
          <div className="bg-purple-50 border-2 border-purple-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-purple-900 mb-3">
              Phase 2 Final Gate: GitHub Foundations Certification
            </h3>
            <ul className="space-y-2">
              <li className="text-purple-900">
                <strong>Mission:</strong> Pass the official{' '}
                <a
                  href="https://learn.microsoft.com/en-us/credentials/certifications/github-foundations/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  GitHub Foundations Exam
                </a>
                .
              </li>
              <li className="text-purple-900">
                <strong>Support:</strong> Voucher provided by unit command.
              </li>
            </ul>
          </div>
        </section>

        {/* Commander's Next Step */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 md:p-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commander's Next Step</h2>
          <p className="text-gray-700 mb-4">
            This training plan provides the complete operational framework for developing a
            dual-hatted Global Administrator and Code Owner. Each phase builds upon the previous,
            ensuring candidates develop both the technical competency and strategic understanding
            necessary for mission success.
          </p>
          <div className="bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-blue-900 font-semibold mb-2">Ready to Begin?</p>
            <p className="text-blue-900">
              Start with Phase 1, Block A and progress through each gate. All training materials are
              linked directly to official Microsoft Learn and GitHub documentation. Test vouchers
              and support resources are available through unit command.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
