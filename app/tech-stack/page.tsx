import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technology Stack | Free For Charity',
  description: 'Complete technology stack documentation for Free For Charity - nonprofit technology initiative delivering free, secure, and scalable websites for charities.',
  keywords: 'nonprofit technology, charity websites, GitHub Pages, Next.js, React, Cloudflare, technology stack',
}

export default function TechStack() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Free For Charity — Tech Stack
            </h1>
            <p className="text-sm text-gray-600">
              <strong>Version:</strong> 1.0 | <strong>Last updated:</strong> November 14, 2025 | <strong>Owner:</strong> Global Admin (Free For Charity)
            </p>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction: What Free For Charity Does</h2>
            <p className="text-gray-700 mb-4">
              Free For Charity is a nonprofit technology initiative that delivers free, secure, and scalable websites for charities. 
              We act as a general contractor for technology, integrating best‑in‑class platforms—GitHub, Microsoft 365, and Cloudflare—to 
              build, host, secure, and operate modern static sites.
            </p>
            <p className="text-gray-700">
              <strong>Who this page is for:</strong> nonprofit partners, developers, auditors, and admins who need a transparent, 
              detailed view of how we run, secure, and support the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Priorities</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Speed &amp; simplicity</strong> — Static‑by‑default React + Next.js exports, globally cached, minimal moving parts</li>
              <li><strong>Security by design</strong> — MFA, automated scanning, least‑privilege access, auditable workflows</li>
              <li><strong>Compliance &amp; privacy</strong> — U.S. privacy laws (CCPA/CPRA) first, then GDPR; consent‑gated analytics via custom banner + secure cookies + Zaraz</li>
              <li><strong>AI‑powered productivity</strong> — GitHub Copilot Pro (Agent Mode) &amp; Microsoft Copilot for Microsoft 365</li>
              <li><strong>Resilience</strong> — Verified backups to OneDrive for Business with automated restore drills</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Charities retain full ownership of their content and brand. Free For Charity coordinates providers, safeguards the platform, and supports operations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">At‑a‑Glance</h2>
            <p className="text-gray-700 mb-4">This is the single source of truth for our stack, operations, and governance.</p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sections 1–8</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                <a href="#section-1" className="hover:text-blue-600">1) Hosting &amp; Version Control</a>
                <a href="#section-2" className="hover:text-blue-600">2) Development</a>
                <a href="#section-3" className="hover:text-blue-600">3) AI Assistance</a>
                <a href="#section-4" className="hover:text-blue-600">4) Security &amp; Edge Performance</a>
                <a href="#section-5" className="hover:text-blue-600">5) Compliance &amp; Privacy</a>
                <a href="#section-6" className="hover:text-blue-600">6) Backup &amp; DR</a>
                <a href="#section-7" className="hover:text-blue-600">7) Project Management</a>
                <a href="#section-8" className="hover:text-blue-600">8) Monitoring &amp; Observability</a>
              </div>
            </div>

            <div className="space-y-2 text-gray-700">
              <p><a href="#support-model" className="hover:text-blue-600 font-semibold">Support Model</a> — How to get help and escalate</p>
              <p className="font-semibold">Appendices</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><a href="#appendix-a" className="hover:text-blue-600">Appendix A — Global Admin Policies &amp; Licensing</a></li>
                <li><a href="#appendix-b" className="hover:text-blue-600">Appendix B — GitHub Security &amp; Quality Workflows</a></li>
                <li><a href="#appendix-c" className="hover:text-blue-600">Appendix C — Compliance &amp; Privacy Snippets</a></li>
                <li><a href="#appendix-d" className="hover:text-blue-600">Appendix D — Backup &amp; DR Workflows</a></li>
                <li><a href="#appendix-e" className="hover:text-blue-600">Appendix E — Changelog</a></li>
              </ul>
            </div>
          </section>

          <section id="section-1" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1) Hosting &amp; Version Control</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>GitHub Pro Pages</strong> — Static hosting for nonprofit sites (HTTPS, custom domains)</li>
              <li><strong>GitHub Actions</strong> — CI/CD for build, test, deploy, security, backups</li>
              <li><strong>GitHub Packages</strong> — Package/dependency hosting (as needed)</li>
              <li><strong>GitHub Pro (Nonprofit)</strong> — Org/repo plan benefits and Actions minutes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Repository standards</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Node:</strong> 20 LTS · <strong>Package manager:</strong> pnpm (lockfile committed)</li>
              <li><strong>Branch protection:</strong> required checks on main, linear history, no force pushes</li>
              <li><strong>Commits:</strong> Conventional Commits (feat/fix/docs/refactor/etc.)</li>
              <li><strong>Versioning:</strong> Semantic Versioning (tags on releases)</li>
              <li><strong>Labels:</strong> shared taxonomy (see §7)</li>
              <li><strong>Templates:</strong> Issue/PR templates, CODEOWNERS (see §7)</li>
            </ul>
          </section>

          <section id="section-2" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2) Development Framework &amp; UI</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-100 p-3 rounded">React</div>
              <div className="bg-gray-100 p-3 rounded">Next.js (SSG)</div>
              <div className="bg-gray-100 p-3 rounded">Tailwind CSS</div>
              <div className="bg-gray-100 p-3 rounded">TypeScript</div>
              <div className="bg-gray-100 p-3 rounded">PostCSS</div>
              <div className="bg-gray-100 p-3 rounded">Autoprefixer</div>
              <div className="bg-gray-100 p-3 rounded">ESLint</div>
              <div className="bg-gray-100 p-3 rounded">Prettier</div>
              <div className="bg-gray-100 p-3 rounded">Stylelint</div>
              <div className="bg-gray-100 p-3 rounded">Lighthouse CI</div>
              <div className="bg-gray-100 p-3 rounded">HTMLHint</div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance, accessibility &amp; SEO budgets</h3>
            <p className="text-gray-700 mb-2">CI enforced:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li><strong>Lighthouse thresholds:</strong> Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95 (build fails if below)</li>
              <li><strong>Images:</strong> optimized at build; Cloudflare edge compression; (optional) Cloudflare Images/Polish</li>
              <li><strong>SEO:</strong> sitemap.xml, robots.txt, canonical tags</li>
            </ul>
          </section>

          <section id="section-3" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3) AI Assistance</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Vibe Coding</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>GitHub Copilot Pro (Agent Mode) (licensed)</li>
              <li>Copilot Chat (VS Code)</li>
              <li>GitHub Codespaces</li>
              <li>VS Code · Dev Containers</li>
              <li>GitHub CLI · Markdownlint</li>
              <li>GitHub Agent assigned to Issues for triage/summaries/proposed fixes</li>
            </ul>
            <p className="text-gray-700 italic mb-4">
              <strong>Acceptable use &amp; privacy:</strong> No secrets in prompts; review outputs; adhere to repo policies and license compliance.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Vibe Working</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Microsoft Copilot for Microsoft 365</strong> (licensed)</li>
              <li>Outlook · Teams (Intelligent Recap) · Word · Excel · PowerPoint · Planner · Whiteboard · Power Automate</li>
            </ul>
            <p className="text-gray-700 italic">
              Copilot outputs are aids, not authoritative policy/legal advice; human review required.
            </p>
          </section>

          <section id="section-4" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4) Security &amp; Edge Performance</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 GitHub‑native security (Public repos)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Dependabot · Secret Scanning · Push Protection · Code Scanning (CodeQL) · Dependency Review</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-900 mb-2">Secrets policy &amp; supply chain</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Secrets in GitHub Secrets only; rotate every 90 days; least‑privilege tokens</li>
              <li><strong>Threat model:</strong> static site (no server) → primary risks: npm supply chain, secret leakage, client script injection</li>
              <li><strong>Mitigations:</strong> CI scanners, branch protection, CSP (see Appendix C), consent‑gated analytics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Cloudflare edge (security &amp; performance)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Security:</strong> WAF, DDoS protection, SSL/TLS Full (strict), DNSSEC</li>
              <li><strong>Performance:</strong> CDN caching, Brotli compression, HTTP/2/3, Page Rules/redirects</li>
              <li><strong>Headers</strong> (managed at Cloudflare): CSP, HSTS, Referrer‑Policy, Permissions‑Policy (see Appendix C for recommended values)</li>
            </ul>
          </section>

          <section id="section-5" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5) Compliance &amp; Privacy (U.S. first, then EU)</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Regulatory scope</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>CCPA/CPRA &amp; U.S. state laws:</strong> disclosure, opt‑out ("Do Not Sell/Share"), consent before analytics</li>
              <li><strong>GDPR (EU):</strong> explicit, revocable consent before analytics; records of consent</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Consent enforcement (GitHub Pages‑compatible)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Custom blocking banner (Accept/Decline); consent stored in Secure, SameSite cookie or localStorage</li>
              <li><strong>Accept</strong> → Cloudflare Zaraz loads Microsoft Clarity</li>
              <li><strong>Decline</strong> → analytics blocked; essential site only</li>
              <li><strong>Revocation:</strong> "Privacy &amp; Cookies" (or "Do Not Sell/Share") page clears consent cookie and reloads</li>
              <li><strong>Retention:</strong> consent cookie 6 months; CI artifacts 90 days; Clarity retention per Microsoft defaults (confirm in tenant)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy checks in CI/CD</h3>
            <p className="text-gray-700 mb-4">Lighthouse CI, HTMLHint, custom script check ensure no analytics loads pre‑consent</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Third‑party processors</h3>
            <p className="text-gray-700">GitHub, Microsoft (Clarity, M365), Cloudflare (Zaraz, CDN); DPAs/privacy pages linked in Appendix C notes</p>
          </section>

          <section id="section-6" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6) Backup &amp; Disaster Recovery</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>GitHub Actions</strong> — scheduled backups, verification, alerts</li>
              <li><strong>GitHub Releases/Artifacts</strong> — immutable build snapshots</li>
              <li><strong>OneDrive for Business</strong> — off‑site backup destination</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">RTO/RPO targets</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>RTO:</strong> ≤ 2 hours (restore time)</li>
              <li><strong>RPO:</strong> ≤ 24 hours (maximum data loss window)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Restore validation</h3>
            <p className="text-gray-700">Checksums match; preview build on a temporary branch or URL; GitHub Issue logs results</p>
          </section>

          <section id="section-7" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7) Project Management</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>Microsoft Planner</strong> — Kanban per charity</li>
              <li><strong>GitHub Projects</strong> — roadmaps/boards (Issues/PRs)</li>
              <li><strong>GitHub Issues</strong> — backlog, bugs, features</li>
              <li><strong>GitHub Milestones</strong> — releases/quarters</li>
              <li>Issue/PR Templates · CODEOWNERS · actions/labeler · github/issue‑metrics</li>
              <li><strong>Power Automate</strong> — sync Issues ↔ Planner; Teams notifications</li>
              <li><strong>GitHub for Microsoft Teams app</strong> — PR/Issue/Actions notifications</li>
              <li><strong>GitHub Agent (AI)</strong> — triage/summarize/propose fixes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Label taxonomy &amp; SLAs</h3>
            <p className="text-gray-700 mb-2"><strong>Types:</strong> type/bug, type/feature, type/docs, type/chore</p>
            <p className="text-gray-700 mb-2"><strong>Priority:</strong> prio/p0 (critical), p1, p2, p3</p>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-2">SLA targets (business hours):</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li><strong>P0:</strong> acknowledge ≤ 1h, resolve ≤ 4h</li>
              <li><strong>P1:</strong> acknowledge ≤ 4h, resolve ≤ 2 days</li>
              <li><strong>P2:</strong> acknowledge ≤ 1 day, resolve ≤ 1 week</li>
              <li><strong>P3:</strong> acknowledge ≤ 2 days, resolve as scheduled</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Contribution</h3>
            <p className="text-gray-700">Public repos accept PRs; see CONTRIBUTING.md &amp; Code of Conduct in each repo</p>
          </section>

          <section id="section-8" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8) Monitoring &amp; Observability</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Uptime:</strong> UptimeRobot (or GitHub Status Pages) for public endpoint checks</li>
              <li><strong>Link integrity:</strong> lycheeverse/lychee in CI to catch broken links</li>
              <li><strong>Error tracking (optional):</strong> Sentry for client‑side JS (respect consent)</li>
              <li><strong>Performance telemetry:</strong> Lighthouse CI trends per commit/PR</li>
            </ul>
          </section>

          <section id="support-model" className="mb-8 bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Support Model</h2>
            <p className="text-gray-700 mb-4">
              Free For Charity is your general contractor: we integrate and coordinate providers, triage issues, and route to the best channel.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>First stop:</strong> Open a support ticket with Free For Charity</li>
              <li><strong>Escalation:</strong> If your ticket is not answered within 48 hours, text Founder, Clarke Moyer at 520‑222‑8104</li>
            </ul>
          </section>

          <section id="appendix-a" className="mb-8 border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appendix A — Global Admin Policies &amp; Licensing</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">A1. Role &amp; Responsibilities</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Secure M365 tenant, GitHub Organization, Cloudflare</li>
              <li>Enforce MFA, least privilege, branch protection, WAF baselines</li>
              <li>Maintain license assignments (M365 Copilot, GitHub Copilot Pro)</li>
              <li>Oversee backups/DR, compliance, incident response</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">A2. Security Baseline</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li><strong>MFA:</strong> Microsoft Authenticator required for all admins (GitHub &amp; M365)</li>
              <li><strong>Passwords:</strong> LastPass vault; unique/strong; rotate break‑glass credentials</li>
              <li><strong>GitHub Org:</strong> branch protection; required checks; Dependabot; Secret Scanning; Push Protection; CodeQL (public repos)</li>
              <li><strong>Cloudflare:</strong> WAF, DDoS, SSL/TLS Full (strict), DNSSEC; Zaraz for analytics only after consent</li>
              <li><strong>M365:</strong> Conditional Access for admins; block legacy auth; Business Premium security features</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">A3. Licensing Table &amp; Calculator</h3>
            <p className="text-gray-700 mb-4">
              <strong>Notes:</strong><br />
              • GitHub for Nonprofits covers GitHub plan benefits, not GitHub Copilot Pro seats.<br />
              • Microsoft Copilot for M365 has nonprofit pricing (discounted vs commercial).<br />
              • Always verify in your nonprofit portals before purchase. Reviewed quarterly.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Supports</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nonprofit Program / Pricing Link</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Price per User/Year*</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Seats</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">GitHub (Org Plan under Nonprofits)</td>
                    <td className="border border-gray-300 px-4 py-2">Repo features, Actions minutes</td>
                    <td className="border border-gray-300 px-4 py-2">Hosting, CI/CD, Security</td>
                    <td className="border border-gray-300 px-4 py-2"><a href="https://github.com/nonprofits" className="text-blue-600 hover:underline">github.com/nonprofits</a></td>
                    <td className="border border-gray-300 px-4 py-2">$P_GITHUB</td>
                    <td className="border border-gray-300 px-4 py-2">SEATS_DEV</td>
                    <td className="border border-gray-300 px-4 py-2">= P_GITHUB × SEATS_DEV</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">GitHub Copilot Pro</td>
                    <td className="border border-gray-300 px-4 py-2">AI coding + Agent Mode, Issues agent</td>
                    <td className="border border-gray-300 px-4 py-2">Dev &amp; Issue Triage</td>
                    <td className="border border-gray-300 px-4 py-2"><a href="https://github.com/features/copilot" className="text-blue-600 hover:underline">github.com/features/copilot</a></td>
                    <td className="border border-gray-300 px-4 py-2">$P_COPILOT_PRO</td>
                    <td className="border border-gray-300 px-4 py-2">SEATS_DEV</td>
                    <td className="border border-gray-300 px-4 py-2">= P_COPILOT_PRO × SEATS_DEV</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Microsoft 365 Business Premium</td>
                    <td className="border border-gray-300 px-4 py-2">Email/Teams/security</td>
                    <td className="border border-gray-300 px-4 py-2">Productivity, Compliance, DR</td>
                    <td className="border border-gray-300 px-4 py-2"><a href="https://www.microsoft.com/nonprofits" className="text-blue-600 hover:underline">microsoft.com/nonprofits</a></td>
                    <td className="border border-gray-300 px-4 py-2">$P_M365_BP</td>
                    <td className="border border-gray-300 px-4 py-2">SEATS_M365</td>
                    <td className="border border-gray-300 px-4 py-2">= P_M365_BP × SEATS_M365</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Microsoft Copilot for M365</td>
                    <td className="border border-gray-300 px-4 py-2">AI across Outlook/Word/Excel/Teams</td>
                    <td className="border border-gray-300 px-4 py-2">Vibe Working</td>
                    <td className="border border-gray-300 px-4 py-2"><a href="https://www.microsoft.com/nonprofits" className="text-blue-600 hover:underline">microsoft.com/nonprofits</a></td>
                    <td className="border border-gray-300 px-4 py-2">$P_COPILOT_M365</td>
                    <td className="border border-gray-300 px-4 py-2">SEATS_M365</td>
                    <td className="border border-gray-300 px-4 py-2">= P_COPILOT_M365 × SEATS_M365</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Cloudflare (Free + Zaraz)</td>
                    <td className="border border-gray-300 px-4 py-2">DNS/CDN/WAF + consent‑controlled analytics</td>
                    <td className="border border-gray-300 px-4 py-2">Edge Security &amp; Privacy</td>
                    <td className="border border-gray-300 px-4 py-2"><a href="https://www.cloudflare.com/" className="text-blue-600 hover:underline">cloudflare.com</a></td>
                    <td className="border border-gray-300 px-4 py-2">$0</td>
                    <td className="border border-gray-300 px-4 py-2">n/a</td>
                    <td className="border border-gray-300 px-4 py-2">$0</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">LastPass Teams</td>
                    <td className="border border-gray-300 px-4 py-2">Password vault &amp; policy</td>
                    <td className="border border-gray-300 px-4 py-2">Security, Admin Access</td>
                    <td className="border border-gray-300 px-4 py-2"><a href="https://www.lastpass.com/" className="text-blue-600 hover:underline">lastpass.com</a></td>
                    <td className="border border-gray-300 px-4 py-2">$P_LASTPASS</td>
                    <td className="border border-gray-300 px-4 py-2">SEATS_ADMIN</td>
                    <td className="border border-gray-300 px-4 py-2">= P_LASTPASS × SEATS_ADMIN</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-gray-700 mt-4 text-sm italic">
              *Replace variables with current nonprofit rates from official portals.<br />
              Total Annual Cost = Σ(Subtotals). Current seats: set SEATS_* to calculate.<br />
              <strong>Review cadence:</strong> Quarterly (next due: Feb 2026). Record updates in Appendix E (Changelog).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">A4. Identity &amp; Access Management (IAM)</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Least privilege roles; quarterly access reviews</li>
              <li>Break‑glass tenant admin account (no CA), vaulted &amp; monitored</li>
              <li><strong>Onboarding checklist:</strong> create user → assign M365 license(s) → enforce MFA → add to LastPass → add to GitHub teams → repo access → security training acknowledgement</li>
              <li><strong>Offboarding checklist:</strong> disable sign‑in → revoke sessions → transfer GitHub ownership/issues → rotate secrets → remove LastPass access → document completion</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">A5. Disaster Recovery &amp; Escalation</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Primary recovery:</strong> GitHub Releases + OneDrive backups</li>
              <li><strong>Comms:</strong> Notify via Teams/email; status notes in GitHub Issue</li>
              <li><strong>Escalation:</strong> Unresolved in 4 hours → escalate to Founder (Clarke Moyer)</li>
            </ul>
          </section>

          <section id="appendix-b" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appendix B — GitHub Security &amp; Quality Workflows</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Dependabot config (<code className="bg-gray-100 px-2 py-1 rounded">.github/dependabot.yml</code>)</li>
              <li>CodeQL workflow (<code className="bg-gray-100 px-2 py-1 rounded">.github/workflows/codeql-analysis.yml</code>)</li>
              <li>Security &amp; Quality workflow (<code className="bg-gray-100 px-2 py-1 rounded">.github/workflows/security-and-quality.yml</code>)
                <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                  <li>ESLint · Stylelint · Prettier check · tests · Lighthouse CI · HTMLHint</li>
                  <li>Link check: lycheeverse/lychee</li>
                  <li>(Optional) A11y tests: axe-core/jest-axe on key pages</li>
                </ul>
              </li>
            </ul>
            <p className="text-gray-700 text-sm italic">Full YAML examples are included here; integrate thresholds and fail criteria as shown.</p>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded mt-4 overflow-x-auto">
              <pre className="text-sm"><code>{`# (Abridged) Add to security-and-quality.yml
- name: Link check
  run: npx lychee --exclude-mail --no-progress --quiet ./out`}</code></pre>
            </div>
          </section>

          <section id="appendix-c" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appendix C — Compliance &amp; Privacy Snippets (Consent &amp; Headers)</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">C1. Custom Consent Banner (blocking) — HTML/JS</h3>
            <p className="text-gray-700 mb-2">Implements Accept/Decline; sets Secure, SameSite cookie; triggers Zaraz on accept.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">C2. Cloudflare Zaraz — Conditional Firing (Consent Cookie)</h3>
            <p className="text-gray-700 mb-2">Reads consent=analytics-accepted and fires Microsoft Clarity.</p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded mt-4 overflow-x-auto">
              <pre className="text-sm"><code>{`{
  "variables": [{
    "name": "consent",
    "type": "cookie",
    "key": "consent"
  }],
  "triggers": [{
    "name": "analytics-consent",
    "conditions": [{
      "variable": "consent",
      "operator": "equals",
      "value": "analytics-accepted"
    }]
  }],
  "tags": [{
    "name": "Microsoft Clarity",
    "trigger": "analytics-consent",
    "type": "script",
    "src": "https://www.clarity.ms/tag/CLARITY_PROJECT_ID"
  }]
}`}</code></pre>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">C3. CI Check — Block hardcoded Clarity</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded mt-4 overflow-x-auto">
              <pre className="text-sm"><code>{`! grep -R "https://www.clarity.ms/tag" -n ./out || (echo "Clarity must be injected via Zaraz post‑consent." && exit 1)`}</code></pre>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">C4. Security Headers (Cloudflare)</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Content‑Security‑Policy (example):</strong></p>
              <code className="block bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                default-src 'self'; script-src 'self' https://www.clarity.ms 'unsafe-inline' 'nonce-{'{RANDOM}'}'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://www.clarity.ms; frame-ancestors 'none'; base-uri 'self'
              </code>
              <p className="mt-4"><strong>HSTS:</strong> <code className="bg-gray-100 px-2 py-1 rounded">max-age=31536000; includeSubDomains; preload</code></p>
              <p><strong>Referrer‑Policy:</strong> <code className="bg-gray-100 px-2 py-1 rounded">strict-origin-when-cross-origin</code></p>
              <p><strong>Permissions‑Policy:</strong> <code className="bg-gray-100 px-2 py-1 rounded">camera=(), microphone=(), geolocation=()</code></p>
              <p className="text-sm italic mt-2">Tune CSP per actual script/style usage and prefer nonces over unsafe-inline where possible.</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">C5. Revocation &amp; Do‑Not‑Sell/Share</h3>
            <p className="text-gray-700 mb-2"><strong>Route:</strong> /privacy and /do-not-sell-or-share</p>
            <p className="text-gray-700"><strong>Action:</strong> clear consent cookie, reload, show state = "declined"</p>
          </section>

          <section id="appendix-d" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appendix D — Backup &amp; DR Workflows</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Build → Manifest → Zip → Release (Next.js out/ + checksums)</li>
              <li>Off‑site sync to OneDrive (rclone)</li>
              <li>Integrity verification (download + checksum)</li>
              <li>Alert on failure (GitHub Issue + optional Teams webhook)</li>
              <li><strong>Retention:</strong> Releases 30 days; OneDrive zips 90 days</li>
            </ul>
            <p className="text-gray-700 text-sm italic">YAML examples included (from prior version). Add weekly restore drill and log result in a GitHub Issue template.</p>
          </section>

          <section id="appendix-e" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appendix E — Changelog</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Date (YYYY‑MM‑DD)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Version</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Summary of Changes</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Approved By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">2025‑11‑14</td>
                    <td className="border border-gray-300 px-4 py-2">1.0</td>
                    <td className="border border-gray-300 px-4 py-2">Initial publication with AI, consent, Zaraz, CI, DR, Admin &amp; Licensing</td>
                    <td className="border border-gray-300 px-4 py-2">Global Admin</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-green-50 p-4 rounded">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ What changed in this revision</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>Variable‑based Licensing Table with nonprofit program links; clarified Copilot licensing (GitHub Copilot Pro not free; M365 Copilot discounted for nonprofits) and added a calculator</li>
                <li>Added version stamp and Changelog</li>
                <li>Added Repository standards, Lighthouse thresholds, CSP/HSTS plan, Consent revocation, Monitoring/Observability, RTO/RPO, On/Offboarding checklists, SLAs, and label taxonomy</li>
                <li>Split out Cloudflare edge performance from security, with headers managed at Cloudflare</li>
              </ul>
            </div>
          </section>

          <footer className="mt-12 pt-6 border-t text-center text-gray-600 text-sm">
            <p>Free For Charity — Technology Stack Documentation</p>
            <p className="mt-2">For questions or support, please open a support ticket or contact Clarke Moyer at 520‑222‑8104</p>
          </footer>
        </div>
      </div>
    </main>
  )
}
