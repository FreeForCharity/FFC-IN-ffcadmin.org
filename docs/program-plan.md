# FFC Public Roadmap and Intake Program Plan (v2)

**Status:** Draft for review
**Last updated:** 2026-05-09
**Owner:** Clarke Moyer
**Supersedes:** v1 (2026-05-09)

**Repos affected:**

- `FreeForCharity/FFC-IN-ffcadmin.org` (operational/admin hub — primary build target)
- `FreeForCharity/FFC-IN-ffcadmin-private` (new — verified-admin coordination)
- `FreeForCharity/freeforcharity-web` (charity-facing marketing site — parallel migration)
- `FreeForCharity/FFC-Cloudflare-Automation` (automation hub — minor changes)
- `FreeForCharity/FFC-EX-*` (per-charity sites — no changes in this phase)

**External systems referenced:**

- Zeffy (CRM, membership, mass email, donations — front-door intake)
- WHMCS (transitional billing/domain — being retired as Cloudflare direct registration replaces it)
- Cloudflare (DNS, edge, domain registration going forward)
- Microsoft 365 (charity productivity stack)

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Why v2 supersedes v1](#2-why-v2-supersedes-v1)
3. [The actual FFC architecture](#3-the-actual-ffc-architecture)
4. [What already exists vs. what's new](#4-what-already-exists-vs-whats-new)
5. [The intake flow end to end](#5-the-intake-flow-end-to-end)
6. [Service tier architecture](#6-service-tier-architecture)
7. [Readiness scoring system](#7-readiness-scoring-system)
8. [Sponsorship and verification](#8-sponsorship-and-verification)
9. [Public roadmap UI](#9-public-roadmap-ui)
10. [Educational content additions](#10-educational-content-additions)
11. [Escalation and responsible disclosure](#11-escalation-and-responsible-disclosure)
12. [Cross-repo automation](#12-cross-repo-automation)
13. [WHMCS retirement and Cloudflare direct registration](#13-whmcs-retirement-and-cloudflare-direct-registration)
14. [Phasing and sequence](#14-phasing-and-sequence)
15. [Open decisions with defaults](#15-open-decisions-with-defaults)
16. [Appendix A: Full readiness score reference](#16-appendix-a-full-readiness-score-reference)
17. [Appendix B: Existing FFC content audit](#17-appendix-b-existing-ffc-content-audit)

---

## 1. Executive summary

Free For Charity provides infrastructure and operational know-how to small US-based 501(c)(3) charities (and pre-501(c)(3) organizations actively pursuing approval). FFC's preferred service population is charities with revenue under $1 million that are not federally grant-funded — those for whom FFC's free volunteer-driven service creates the most marginal value.

FFC's service is not "we build websites." FFC operates a **graduated capability platform** that grows charities through stages of digital and operational maturity, transferring the same toolkit FFC uses for itself (Microsoft 365, GitHub Pages, Cloudflare, Zeffy, GuideStar, TechSoup) so charities develop in-house competence rather than vendor dependence. Charities enter at the stage they're ready for, advance as they grow, and eventually graduate to financial self-sustainability — at which point the relationship shifts from active service to consulting.

This program adds three things FFC does not have today:

1. **A public roadmap** that visualizes the queue of charities at each lifecycle stage so prospective charities, donors, and volunteer admins can see exactly what FFC is doing and where their help fits.
2. **Structured intake** that captures the data FFC needs in a form computable for automated readiness scoring, public visibility, and downstream provisioning automation.
3. **A verifiable sponsorship model** where trained volunteer admins are gated through GitHub team membership in a private coordination repo, and sponsorship is the gating mechanism for site provisioning.

The program coexists with FFC's existing tools rather than replacing them. Zeffy remains the customer front door for billing, CRM, and mass email. WHMCS continues handling domain management until Cloudflare direct registration fully replaces it. Existing FFC documentation on prioritization policy, service requirements, and operational philosophy stays canonical and is migrated rather than rewritten.

Phase 1A is the immediate scope: ~3 weeks of focused work to ship the public roadmap, structured intake, and verification workflow. Subsequent phases add service tiers, volunteer management deepening, and integrated funding visibility.

---

## 2. Why v2 supersedes v1

v1 was drafted before I had read the actual FFC documentation. It treated FFC as if we were designing policies and processes from scratch, when in reality those exist on freeforcharity.org and at the FFCadmin Next.js site. v1 also misidentified the architecture in several ways:

- It treated FFCadmin.org and freeforcharity.org as two parallel sites with similar roles. They're complementary: ffcadmin.org is the admin/operations face, freeforcharity.org is the charity-facing marketing/documentation face.
- It assumed WordPress was the active tech stack. WordPress was replaced; the new stack is documented at ffcadmin.org/tech-stack and reflected in the freeforcharity-web repo currently migrating WordPress content to Next.js.
- It assumed GitHub would be the primary intake channel. The actual front door is Zeffy, with GitHub as the structured operational layer downstream.
- It overstated Zeffy's API capabilities. Zeffy's API is read-only Beta for Payments, Contacts, and Campaigns; cannot create or modify records.
- It underspecified the Cloudflare repo's existing maturity. The Cloudflare repo already has well-developed issue templates, labels, and a `15-website-provision.yml` workflow; we extend rather than replace.

v2 reflects what FFC actually is and bounds the work appropriately.

---

## 3. The actual FFC architecture

Five distinct components handle distinct concerns. Understanding their relationships is necessary before scoping any work.

### freeforcharity.org (charity-facing marketing site)

The public face of FFC for charities, donors, and prospective volunteers learning about the organization. Currently runs on WordPress; being migrated to Next.js GitHub Pages in the `freeforcharity-web` repo. Hosts:

- FFC philosophy and prioritization policy (`/free-for-charity-ffc-service-delivery-stages/`)
- 501(c)(3) onboarding requirements (`/501c3/`)
- Pre-501(c)(3) onboarding (`/pre501c3/`)
- GuideStar profile setup guide (`/guidestar-guide/`)
- Charity validation guide
- Tech stack documentation (currently shows WordPress-era stack — needs updating for new stack)
- Donor pages, blog, success stories

Migration of these pages to Next.js is **out of scope for this program** but is a parallel project that should reference Phase 1A's outputs.

### ffcadmin.org (operational/admin site)

The face of FFC for active volunteer admins, training, internal documentation, and (newly) the public roadmap. Already running on Next.js 16 + Tailwind 4 at GitHub Pages. Currently hosts:

- Volunteer onboarding (`/volunteer`)
- Training plan (`/training-plan`)
- Canva designer path (`/canva-designer-path`)
- Contributor ladder (`/contributor-ladder`)
- Sites list with health dashboard (`/sites-list`)
- Tech stack documentation (the canonical current stack)
- Get involved (`/get-involved`)
- Documentation, guides, blog, testing

Phase 1A adds:

- `/roadmap` — public roadmap visualization
- `/roadmap/submit` — intake landing page with links to Zeffy and GitHub paths
- `/roadmap/sponsor` — sponsoring admin onboarding
- `/roadmap/methodology` — readiness scoring transparency
- `/intake-help/*` — educational content for charities completing intake
- New issue templates in `.github/ISSUE_TEMPLATE/` for charity intake and escalation
- Workflows for verification, cross-repo automation triggering, and roadmap data refresh

### FFC-IN-ffcadmin-private (new, private)

Coordination space for verified admins. Created as part of Phase 1A prerequisites. Functions:

- Access gate: membership in the `sponsoring-admins` GitHub team grants access; team membership IS the verification artifact
- Sensitive-content channel: security incidents, charity disputes, sensitive escalations, follow-up on intake items requiring private discussion
- Volunteer tracking data (Phase 2 deepens this; Phase 1A creates only the empty structure)
- Discussion space for admin coordination

### FFC-Cloudflare-Automation (existing automation hub)

Continues to handle automation as today. Phase 1A modifies it minimally:

- The existing `15-website-provision.yml` workflow gains a `repository_dispatch` trigger so it can be invoked from FFCadmin after verification
- Public-facing `02-website-request.yml` template gets a deprecation notice pointing to the new FFCadmin intake flow (template stays but is renamed to `_deprecated-`)
- Other admin-only templates (03-06) remain unchanged
- The `update-sites-data.yml` pattern becomes the model for Phase 1A's roadmap data refresh workflow

Phase 1B (later) inventories the Cloudflare repo's issue-creating workflows and migrates them to file in FFCadmin or the private coordination repo as appropriate.

### FFC-EX-\* (per-charity sites)

No changes in Phase 1A. Each is a static GitHub Pages site for an individual charity, fronted by Cloudflare. The 58 active sites continue normal operation while WordPress migration completes elsewhere.

### Zeffy (external — front door)

FFC's CRM, membership management, mass email, and donation processing platform. Free for nonprofits, optional donor tip funds the service.

Current FFC Zeffy products (as of 2026-05):

- General Application & Verification (no specific service; charity application + mission fit assessment)
- Domain Name + Microsoft 365 Setup
- Hosting + AI Design Support

Planned: additional products for stages before and after these (pre-501(c)(3) coaching, brand & content support, donor infrastructure setup, etc.).

**API constraints (verified May 2026):**

- Zeffy API is in Beta
- Read-only access to three resources only: Payments, Contacts, Campaigns
- 100 requests/minute per API key
- No write operations; cannot create or modify records via API
- Webhooks available (added April 2026) but scoped to payment events
- Memberships are not currently exposed as a distinct API resource
- Zapier integration available with same data structure as API

**This means**: FFC cannot programmatically push form submissions into Zeffy or trigger Zeffy emails from external systems. Data flows out of Zeffy (to GitHub) only via the read-only API or via charity action (the charity manually files the GitHub issue after receiving the Zeffy confirmation email).

### WHMCS (external — transitional)

Still active for domain management today. Already being phased out in favor of Cloudflare direct registration (FFC purchases domains directly through Cloudflare). The `update-sites-data.yml` workflow currently exports WHMCS data; this dependency goes away once domain management fully transitions.

Phase 1A does not depend on WHMCS for any new functionality. Phase 1A's roadmap data pipeline reads from GitHub issues only, not WHMCS.

---

## 4. What already exists vs. what's new

Most of what we've discussed across this planning conversation is FFC policy and operational practice that already exists in some form. The genuinely new work is narrower than it might seem.

### Already documented; reused or migrated, not redesigned

- The "filter out, not filter in" prioritization philosophy
- Preference for charities under $1M revenue, non-grant-funded
- US-based-only constraint
- Maximum capacity around 100 concurrent organizations
- The GuideStar Gold Seal of Transparency minimum requirement
- The pre-onboarding checklist (Outlook email, GuideStar, Facebook, LinkedIn, VolunteerMatch, TechSoup, PayPal/Zeffy)
- The board roster requirements (President, Secretary, Treasurer required; VP and Member at Large optional; LinkedIn URLs preferred)
- Multi-step service delivery stages (intake → validation → offers → basic services package → site setup → tech stack assignment → deployment → launch → service expansion)
- Northwest Registered Agent as the preferred registered-agent service
- The 9-component WordPress-era tech stack documentation (some components still apply: Cloudflare, Microsoft 365, GuideStar, TechSoup; some replaced: WordPress → GitHub Pages, Divi → Tailwind, etc.)

### Genuinely new in Phase 1A

- Public roadmap visualization (no equivalent exists today)
- Structured GitHub-based intake template that captures readiness data in a computable form
- Automated readiness scoring system
- Pre-stub workflow that creates GitHub issues from new Zeffy contacts via API polling
- Updated Zeffy confirmation email with clear next-step instructions
- Verification workflow that gates issue assignment on `sponsoring-admins` team membership
- Cross-repo automation trigger from FFCadmin to Cloudflare after verified assignment
- Public escalation template separated from intake
- Private coordination repo (`FFC-IN-ffcadmin-private`)
- Sponsoring admin onboarding page with binding commitment language
- Methodology page documenting the scoring transparently
- Educational content pages for charities completing intake (board requirements, public contact info, fiscal sponsorship policy, mailing address with Northwest details)

---

## 5. The intake flow end to end

The flow as it should work after Phase 1A ships.

### Step 1: Discovery

Charity learns about FFC at freeforcharity.org or through referral. They read the philosophy, prioritization preferences, and 501(c)(3) onboarding requirements. They complete pre-onboarding setup (Outlook email, GuideStar profile to Gold seal minimum if they're 501(c)(3), social media accounts, etc.).

### Step 2: Zeffy submission

Charity submits the FFC Charity Application & Verification Zeffy form. The form captures minimal data:

- Charity name
- Primary contact name and email
- Charity status (Approved 501(c)(3) / Pre-501(c)(3) / Not pursuing 501(c)(3))
- Which FFC service product (dropdown of available Zeffy products)
- Acknowledgment of FFC's prioritization policy
- Acknowledgment that structured intake will continue via GitHub

The Zeffy form deliberately stays under 8 fields. Substantial intake happens in the next step.

### Step 3: Confirmation email and GitHub stub

Two things happen near-simultaneously:

**Zeffy sends a confirmation email** that:

- Welcomes them and confirms submission
- Explains FFC's process and what happens next
- Provides a direct link to the auto-created GitHub issue (or instructions for finding it)
- Provides the manual fallback (text 520-222-8104) for charities not comfortable with GitHub
- Sets expectations on response time (5 business days for triage)
- Notes that their charity will appear on the public roadmap

**A scheduled GitHub Action runs every 4-6 hours**, polls the Zeffy API for new contacts since the last run, and for each new contact:

- Searches existing GitHub issues for the contact email; if a match exists, skips
- If no match, creates a stub issue in FFCadmin with:
  - Title from the charity name
  - Body containing the Zeffy data and a structured template for the charity to complete
  - Labels: `kind:intake`, `status:intake`, `needs-info`
  - A pinned comment explaining the next steps

This means **the public roadmap shows charities as soon as they submit to Zeffy**, even before they complete the GitHub-side intake. Status reflects what stage they're at (`needs-info` until structured data is provided).

### Step 4: Charity completes structured intake

The charity edits their auto-created issue body to add the full structured intake data. Most charities will do this within a few days of receiving the Zeffy email. Charities that don't engage with GitHub can text 520-222-8104 and an FFC admin will complete it on their behalf.

### Step 5: Triage and scoring

FFC staff reviews new intake within 5 business days:

- Confirms mission fit and prioritization policy alignment
- Removes `needs-info` label if structured data is sufficient
- Adds mission tier label (`mission:basic-needs` / `mission:veterans` / `mission:general`)
- Adds affiliation labels if applicable (`affiliation:franchise`, `affiliation:fiscal-sponsored`, etc.)
- Confirms sponsorship eligibility decisions
- Changes status to `status:needs-admin` if approved, or `status:on-hold` with explanation if not yet eligible

The data pipeline computes the readiness score automatically based on the issue body fields. A score breakdown comment is posted to the issue (warm framing, top improvement suggestions, link to methodology page).

### Step 6: Sponsoring admin claims the issue

A trained admin browses the public roadmap, identifies a site they want to sponsor, comments on the issue indicating interest, and FFC assigns them. The verification workflow checks `sponsoring-admins` team membership and either confirms the assignment (applying `verified-assignment` label) or removes it with explanation.

### Step 7: Provisioning automation

After verified assignment, a workflow in FFCadmin sends a `repository_dispatch` event to the Cloudflare repo. The existing `15-website-provision.yml` workflow receives the event, provisions the per-charity repo, sets up Cloudflare DNS, configures Microsoft 365 emails, and reports back. The FFCadmin issue updates with provisioning status and links to the new `FFC-EX-*` repo.

### Step 8: Site build and launch

The sponsoring admin works with the charity to populate content, customize the site, and launch. Status moves to `status:active-build` then `status:live`. The charity now appears in the "Recently launched" section of the roadmap.

### Step 9: Ongoing service

The sponsoring admin maintains the charity's site, handling routine updates in the per-charity repo. When the charity matures and is ready for additional service tiers (additional Zeffy memberships), the cycle starts over for each new tier.

### Step 10: Eventual graduation

When the charity reaches financial self-sustainability and no longer needs FFC's volunteer capacity for routine operations, they're moved to graduated alumni status. The relationship continues in consulting form. They appear on the FFC alumni page (Phase 2 deliverable) demonstrating impact.

---

## 6. Service tier architecture

FFC's service is not a single product; it's a graduated capability platform. Each tier corresponds to a Zeffy membership product.

### Tier 0: Pre-501(c)(3) coaching (Zeffy product TBD)

Coaching and consulting for organizations actively pursuing 501(c)(3) status. Documented at freeforcharity.org/pre501c3/. May or may not include site provisioning depending on charity readiness.

### Tier 1: Application & Verification (Zeffy product: General Application & Verification)

The supported-charities listing entry point. Mission fit is judged here before any technical product is offered. Outcomes:

- Approved and progresses to product offerings
- Approved for listing only (in supported-charities directory but no website yet)
- Declined (mission misalignment, policy violation, etc.)

This tier produces the `Supported Charities` list — charities FFC publicly endorses even if no specific service is currently being delivered.

### Tier 2: Foundational digital presence (Zeffy product: Domain Name + Microsoft 365 Setup)

Domain registration through Cloudflare, Microsoft 365 nonprofit licensing, basic email infrastructure, Outlook tenant setup. The infrastructure foundation everything else builds on.

### Tier 3: Site build (Zeffy product: Hosting + AI Design Support)

GitHub Pages site provisioning, Next.js or static template selection, AI-assisted design, Cloudflare configuration, content migration from any existing site, launch.

### Tier 4 and beyond (planned, not yet productized in Zeffy)

Likely additions, listed in a probable order:

- **Brand and content** — logo finalization, brand guidelines, social media account setup, content strategy templates
- **Donor infrastructure** — Zeffy account setup for the charity itself (so they can receive donations through Zeffy), donor management training
- **Volunteer management** — VolunteerMatch profile, Idealist setup, volunteer onboarding workflows
- **Operations and analytics** — Microsoft Clarity setup, Cloudflare Zaraz, impact reporting templates, Microsoft Planner per charity
- **Graduated alumni consulting** — light-touch advisory for charities that have matured to self-sustainability

Each tier becomes its own Zeffy membership product as it's productized. Each has its own GitHub issue lifecycle (a charity can have multiple concurrent issues across tiers). The roadmap can filter by tier so volunteer admins see queues for their specialty area.

### How charities progress through tiers

Tier progression is admin-judged, not automatic. Criteria for being offered the next tier:

- Successful completion of current tier (site live and stable, charity using the tools competently)
- Operational maturity demonstrated (responsive to admin questions, providing content on time, maintaining the work)
- Charity expresses interest in next tier and is ready to engage

A charity may stay at Tier 2 forever if they're satisfied with just a website. A charity may rapidly progress through Tiers 2-3-4 if they're ready for each in succession. Progression happens at the charity's pace within FFC's capacity constraints.

### Volunteer admin specialization

Different tiers benefit from different volunteer skills:

- Tier 1 (application/verification): organizational/legal mentor, due diligence reviewer
- Tier 2 (domain + M365): infrastructure-focused admin (DNS, M365 tenant management)
- Tier 3 (site build): web developer, designer
- Tier 4 (brand/content): content strategist, social media specialist
- Tier 5 (donor infra): fundraising operations, Zeffy expert
- Tier 6 (volunteer infra): volunteer ops / HR-adjacent
- Tier 7 (ops/analytics): operations consultant
- Tier 8 (alumni consulting): senior advisor

Phase 1A creates a single `sponsoring-admins` team. Phase 2+ may sub-divide this into specialty teams as tier coverage expands.

---

## 7. Readiness scoring system

Computed automatically from intake data. Drives sort order on the public roadmap. Provides charities transparent feedback on where they stand and how to improve.

### Score components summary

The score is a sum of points across categories. Some categories are additive (each instance contributes points); some are tiered (one option per category); some have negative values for missing or inadequate inputs.

| Category                                    | Range                                     | Type                               |
| ------------------------------------------- | ----------------------------------------- | ---------------------------------- |
| Mission category                            | -10 to +50                                | Tiered, single                     |
| Charity stage                               | -40 to +20                                | Tiered, single                     |
| Affiliation status                          | -40 to +5                                 | Tiered, single                     |
| Revenue and form filed                      | -10 to +20                                | Tiered, single                     |
| Trajectory (5-year plans)                   | -8 to +10                                 | Tiered, single                     |
| Funding model                               | -5 to +8                                  | Tiered, single                     |
| Phones (per person × 6)                     | -10 to +10 each, capped at required roles | Additive across people             |
| Emails (per person × 6)                     | -10 to +10 each, capped at required roles | Additive across people             |
| Address (with multi-state)                  | -20 to +35                                | Combined: tiered + additive states |
| Board composition                           | -45 to +25                                | Per-role                           |
| Candid/GuideStar (501c3 only)               | 0 to +45                                  | Additive                           |
| Application progress (pre-501c3 only)       | 0 to +60                                  | Additive                           |
| Operations evidence (non-pursuing only)     | 0 to +23                                  | Additive                           |
| Partnership due diligence (non-501c3 paths) | -10 to +15                                | Tiered                             |
| Documents (varies by stage)                 | 0 to +30                                  | Additive                           |
| External integrations (varies by stage)     | 0 to +21                                  | Additive                           |
| Policy pages                                | 0 to +15                                  | Additive                           |
| Existing website                            | 0 to +8                                   | Tiered                             |

Full point values, conditions, and decay rules are in [Appendix A](#16-appendix-a-full-readiness-score-reference).

### Tier labels

Public-facing labels mapped from the numeric score. Charities see their own tier in the readiness comment on their issue; the public roadmap shows the tier label as a badge on each card.

| Score range | Tier label           |
| ----------- | -------------------- |
| < 0         | Just getting started |
| 0 – 89      | Foundational         |
| 90 – 179    | Developing           |
| 180 – 269   | Established          |
| 270+        | Mature               |

A maximally-prepared 501(c)(3) charity with a basic-needs mission scores around +375. FFC's own self-score is approximately +280 (Mature, with room to grow on multi-state RA coverage and full social platform presence).

### What the score affects

- **Sort order on the public roadmap** within each lifecycle status section. Higher scores appear higher.
- **Tier badge displayed on each card** for at-a-glance positioning.
- **Automated comment on the intake issue** providing the score, breakdown, and top three improvement suggestions.
- **Methodology page** explains how the score is computed transparently.

### What the score does NOT affect

- **Eligibility for service.** A charity at "Just getting started" is not excluded; they're just lower in the queue. The only hard exclusions are those coded explicitly (e.g., fiscal sponsorship policy, US-only requirement, 501(c)(3) status mismatched with service type).
- **Mission tier ranking primacy.** Mission category contributes a substantial bonus (+50 for basic-needs, +30 for veterans), making favored-mission charities sort higher even when their other scoring is moderate. But mission isn't a hard tier gate; an exceptional general-mission charity can sort above a stalled basic-needs-mission charity.

### Time-in-status decay

Charities that submit and stall accumulate score decay over time. Specific milestones with expected windows:

| Milestone                                           | Expected window | Decay starts              | Decay rate                          |
| --------------------------------------------------- | --------------- | ------------------------- | ----------------------------------- |
| State incorporation filed → approved                | 2-4 weeks       | 90 days                   | -2/month, capped at original points |
| EIN obtained post-incorporation                     | 1-2 weeks       | 60 days                   | -2/month                            |
| Bylaws drafted post-incorporation                   | 3 months        | 6 months                  | -2/month                            |
| Form 1023-EZ submission post-incorporation          | 6 months        | 12 months                 | -2/month                            |
| Form 1023 long form submission post-incorporation   | 9 months        | 18 months                 | -2/month                            |
| 1023-EZ submission → IRS determination              | 2-6 weeks       | 90 days post-submission   | -2/month                            |
| 1023 long → IRS determination                       | 6-18 months     | 24 months post-submission | -2/month                            |
| Most recent documented activity (non-501c3 ongoing) | 12 months       | 12 months no activity     | -5 immediately, then -1/month       |

Decay encourages charities to keep their issue updated as they progress. A charity that updates their issue with new milestone dates as they happen avoids decay entirely. A charity that submits and abandons gradually loses score and moves down the queue.

### Form 1023 vs. Form 1023-EZ recognition

Long form is a more rigorous foundation than the streamlined EZ form. Small bonus for choosing the long form when not strictly required:

| Form filing                                        | Points |
| -------------------------------------------------- | ------ |
| 1023-EZ submitted (qualifies for EZ)               | +10    |
| 1023 long submitted (when EZ would have qualified) | +12    |
| 1023 long submitted (required for org's size/type) | +10    |

---

## 8. Sponsorship and verification

### What sponsorship means

A sponsoring admin is a verified volunteer who has:

1. Completed the FFC Microsoft 365 Global Admin training (existing `/training-plan` at ffcadmin.org)
2. Had a verification conversation with Clarke (currently text-based at 520-222-8104)
3. Been added to the `sponsoring-admins` GitHub team in the FreeForCharity org
4. Been granted access to the `FFC-IN-ffcadmin-private` coordination repo
5. Accepted public responsibility for stewarding a specific charity site through its build and ongoing maintenance

Sponsorship is gating, not a multiplier. A site cannot move from `status:needs-admin` to `status:active-build` without an assigned sponsor.

### How verification works

GitHub team membership is the verification artifact. The workflow `verify-assignment.yml` triggers on `issues.assigned` and:

1. Checks if the assignee is a member of the `sponsoring-admins` team via the GitHub API
2. If yes: applies `verified-assignment` label; the next workflow proceeds to provisioning trigger
3. If no: removes the assignment, posts a comment explaining the requirement and linking to `/roadmap/sponsor`, applies `verified-admin-action-needed` label

This prevents accidental assignments from triggering provisioning.

### Capacity expectations

Each verified admin has a maximum of 3 concurrent active sponsorships (one in active-build, others in support/maintenance). This is a hard cap surfaced on the sponsor page — taking on a fourth requires explicit FFC leadership approval. Phase 2's volunteer tracking system enforces this more rigorously.

### Stepping back

Admins can step back by commenting on issues they're assigned to and requesting reassignment. The site returns to the `status:needs-admin` pool. This is normal operation; admins should not feel locked in.

### The commitment

The `/roadmap/sponsor` page includes commitment language admins agree to publicly. Draft language to be reviewed by Clarke before publishing:

> By accepting assignment as a sponsoring admin for an FFC charity site, I commit to:
>
> - Actively coordinating with the charity through the build phase, including responding to their questions within 3 business days during active build and within 7 business days during ongoing maintenance
> - Maintaining the site post-launch, including security updates, link rot fixes, and content updates the charity requests
> - Escalating to FFC central via the public escalation channel or the private coordination repo when issues exceed my scope or judgment
> - Operating within FFC's prioritization policy and code of conduct
> - Not soliciting the charity's contacts for unrelated commercial purposes
> - Treating information shared in the coordination repo as confidential to the FFC community
> - Requesting reassignment promptly if circumstances change rather than going silent
> - Maintaining no more than 3 concurrent active sponsorships unless explicitly approved by FFC leadership

### Public admin recognition

The public roadmap shows each sponsored card with the sponsoring admin's GitHub avatar, handle, and link to their profile. This is real public attribution — verified admins are publicly on the hook for the work, which both creates accountability and provides recognition for the volunteers.

A future Phase 2 deliverable: a public admin directory at `/volunteers` showing all `sponsoring-admins` team members with their current and completed sponsorships.

---

## 9. Public roadmap UI

### `/roadmap` — main page

Server-rendered Next.js page reading `src/data/roadmap.json` at build time. Updated by the data pipeline workflow. Same architecture as the existing `/sites-list` page.

**Hero section** matching FFCadmin's existing brand gradient pattern. Three primary CTAs:

1. "Submit a request" → `/roadmap/submit`
2. "Become a sponsoring admin" → `/roadmap/sponsor`
3. "Browse the backlog" → anchor to first major section

**Section: In application & verification review** (top)

Issues at Tier 1 (FFC application). Status `status:intake` or `status:needs-info`. Sorted by submission date. Each card shows:

- Charity name and brief mission excerpt
- Zeffy product applied for
- Submission date
- Tier label badge ("Foundational" through "Mature")
- "View on GitHub" link

This section communicates: FFC has received your application; we're reviewing mission fit and basic eligibility before offering products.

**Section: Needs a sponsoring admin**

Issues with `status:needs-admin`, no assignee. Sorted by:

1. Mission tier bonus (basic-needs, then veterans, first via the score)
2. Readiness score (higher first)
3. `+1` reaction count (community signal)
4. Created date (oldest first)

Each card prominently displays:

- Charity name and mission tier badge (basic-needs cards visually accented)
- Tier label badge (readiness)
- Service tier they're seeking (Tier 2, Tier 3, etc.)
- Sponsoring admin CTA: "Sponsor this site"
- `+1` vote count for community signal

**Section: Active builds**

Issues with `status:active-build` or `status:sponsored` and assignees. Sorted by `updated_at` descending.

Each card shows:

- Charity name and tier
- Sponsoring admin avatar + handle (linked to GitHub profile)
- Current sub-status
- "Follow progress" link

No voting or sponsorship CTAs — these are committed.

**Section: Recently launched**

Closed issues with `status:live` updated within the last 90 days. Celebratory framing. Links to the live charity site (parsed from issue body).

**Section: Graduated alumni** (small tile)

Summary count of charities that have graduated to self-sustainability. Links to `/alumni` page (Phase 2 deliverable; placeholder in Phase 1A).

### `/roadmap/submit` — intake landing page

300-500 word landing page explaining the intake process. Three large cards:

- "Apply for FFC service" → links to Zeffy application form
- "I'm an existing FFC charity needing additional services" → links to Zeffy product selection
- "I'm a community member with a question or escalation" → links to public escalation template

Sets expectations: FFC triages within 5 business days. Mentions the manual fallback (text 520-222-8104) prominently.

### `/roadmap/sponsor` — admin onboarding

400-600 words covering:

- What sponsorship is (commitment, not a casual claim)
- Prerequisites: training + verification conversation
- The artifact: sponsoring-admins team membership + access to coordination repo
- How to claim a site
- What's expected ongoing (the commitment language above)
- Capacity guidance
- How to step back gracefully
- What gets escalated to FFC central vs. handled in-repo

### `/roadmap/methodology` — scoring transparency

Renders the readiness score table from the same source-of-truth config as the data pipeline (no duplication). Explains:

- The four-step sort order (mission tier → readiness → community votes → date)
- Each scoring category with how to improve
- Time-in-status decay rules
- Why FFC scores some things negatively (with warm framing)
- Tier label boundaries
- Links to the relevant `/intake-help/*` pages

This is the "we're not arbitrary about this" page that anyone can be pointed to for explanation.

### Navigation update

Add "Roadmap" as a top-level link in `src/data/navigation.ts`, positioned between the existing "Training" and "Resources" dropdowns.

---

## 10. Educational content additions

The `/intake-help/*` pages serve double duty: they educate intake submitters in real-time, and they're SEO-valuable content furthering FFC's mission of helping charities operate competently.

### Phase 1A: full first-pass content

Two pages get substantive content (~500-800 words each):

**`/intake-help/board-requirements`**

- IRS expectations for nonprofit boards
- What donors and partners look for
- Common pitfalls (single-person boards, all-family boards, no real meetings)
- Template language for a basic board agreement
- What to do if you don't have three people lined up yet
- How LinkedIn URLs help with credibility
- Why FFC requires names + LinkedIn for required roles

**`/intake-help/public-contact-info`**

- Why charities need public contact info (donor trust, regulatory expectations)
- Email options ranked: org-domain (best, what FFC provides at launch) > org-Gmail interim > personal as fallback
- Phone options ranked: org-specific (Google Voice business, MS Teams Business Voice, T-Mobile DIGITS Business, real PBX) > personal cell > landline > nothing
- Step-by-step setup for Google Voice with a charity-owned account
- Step-by-step setup for MS Teams Business Voice
- Step-by-step setup for T-Mobile DIGITS for Business
- How readiness scoring interacts with phone/email choices
- What FFC provides at launch (org-domain emails created automatically)

### Phase 1A: stub pages

Brief content (~150 words) with "fuller guidance forthcoming" notes. Intake template links to them so there are no 404s, but deep content fills in over time.

- `/intake-help/getting-501c3` — for charities not yet 501(c)(3)
- `/intake-help/guidestar-candid` — fuller version of what's already partially in the existing template
- `/intake-help/mailing-address` — Northwest Registered Agent, PO box, commercial mailbox; why FFC chose Northwest
- `/intake-help/social-media` — which platforms matter, how to set up org accounts
- `/intake-help/mission-statement` — what makes a strong mission statement
- `/intake-help/policy-pages` — donation/privacy/ToS/vulnerability/security policy templates
- `/intake-help/fiscal-sponsorship` — FFC's policy on fiscal sponsorship and franchise charities
- `/intake-help/501c3-application` — Form 1023 vs. 1023-EZ, timelines, what FFC offers during the wait
- `/intake-help/supporting-documents` — what to share where, public vs. private channels

### Layout

`/intake-help/` is a top-level route with its own layout that sidebars all pages and provides cross-links. Each page has a clear "back to intake" link.

---

## 11. Escalation and responsible disclosure

### The escalation template

Distinct from intake. Used by sponsoring admins who hit something they can't handle alone, charities who need FFC central involvement, and community members reporting abuse or content concerns.

**Type-of-escalation dropdown:**

- Security or abuse — redirected to private channel, do not file publicly
- DNS or infrastructure — handled in FFCadmin (public)
- Scope or policy — handled in FFCadmin (public)
- Admin handoff — sometimes private, depending on context
- Charity dispute — usually private
- Other

**Severity dropdown:**

- Critical (security, abuse) — auto-pings Clarke, expected response within hours
- Urgent (charity-impacting) — same-day response goal
- Normal — within 3 business days
- Low (informational) — within 1-2 weeks

**Required fields:**

- Which site (domain dropdown)
- What the sponsoring admin already tried (if applicable)
- Description (with strong inline warnings)
- Whether the charity is aware/has consented to this escalation

**Inline banners:**

> **Stop and read before submitting.** This issue will be public. Do not paste credentials, beneficiary information, security vulnerability details, charity bank or financial account details, or anything else that could harm a charity if disclosed.
>
> For sensitive escalations, use the private coordination repo: only verified admins have access. Or text Clarke at 520-222-8104 directly.

### Responsible disclosure across repos

**Org-level `SECURITY.md`** at `FreeForCharity/.github/SECURITY.md` — appears in any FFC repo without its own version.

Content covers:

- What is reportable (vulnerabilities, abuse, charity safety concerns, sensitive data exposure)
- What does NOT go in public issues
- The private channels (text Clarke + security email)
- GitHub's private vulnerability reporting feature
- Acknowledgment policy and how reporters are credited
- Scope and response time commitments

**Per-repo `SECURITY.md`** in FFCadmin and per-site repos as needed for site-specific guidance.

### The coordination repo's escalation templates

In `FFC-IN-ffcadmin-private`, more detailed escalation templates exist for genuinely sensitive content. Only verified admins (sponsoring-admins team members) can see or submit these. They follow the same severity/type structure but allow inclusion of details the public escalations cannot accept.

When a public escalation is filed and turns out to require sensitive context, an admin creates a corresponding private issue in the coordination repo and links the two with a comment on the public one ("Continued in private channel; will update this issue with non-sensitive resolution status").

---

## 12. Cross-repo automation

### Provisioning trigger

The existing `15-website-provision.yml` in the Cloudflare repo currently triggers on `issues.assigned` within that repo. After Phase 1A, the workflow needs to trigger when an FFCadmin intake issue passes verification and gets assigned.

**Mechanism: `repository_dispatch`**

The Cloudflare workflow gains a new trigger type alongside the existing `issues.assigned`:

```yaml
on:
  issues:
    types: [assigned] # legacy path during transition
  repository_dispatch:
    types: [ffcadmin-website-provision]
  workflow_dispatch:
    inputs: ...
```

In FFCadmin, a new workflow `trigger-provisioning.yml` runs after `verify-assignment.yml` succeeds:

1. Reads the FFCadmin intake issue
2. Extracts the relevant fields (domain, charity name, contact info, etc.)
3. Sends a `repository_dispatch` event to the Cloudflare repo with payload containing the issue data
4. Comments on the FFCadmin issue confirming provisioning has been triggered

### Authentication: GitHub Actions environments

Cross-repo workflow triggers require a PAT with appropriate scopes. FFCadmin already uses `secrets.GH_PAT` for the existing `update-sites-data.yml`. We formalize this as a named environment.

**Environment: `cloudflare-automation`**

Defined in FFCadmin repo settings. Contains:

- `GH_PAT` secret — PAT with `repo` and `workflow` scopes for the Cloudflare repo
- Optional approval gate for protected operations (Phase 1B may add this)

### Zeffy → GitHub data pipeline

A new workflow `sync-from-zeffy.yml` runs every 4-6 hours:

1. Queries the Zeffy API (read-only) for new contacts since the last run
2. For each new contact, checks if a corresponding GitHub issue exists
3. If not, creates a stub issue with the limited Zeffy data and a structured template for the charity to complete
4. Updates a state file `src/data/zeffy-sync-state.json` with the last-synced timestamp

This workflow requires a Zeffy API key (free, generated from the Zeffy dashboard) stored as a secret in the `cloudflare-automation` environment or a new dedicated `zeffy-integration` environment.

### Roadmap data pipeline

Mirrors the pattern of `update-sites-data.yml`. The workflow `build-roadmap-data.yml`:

1. Triggers on issue events (opened, edited, labeled, etc.) and on a daily schedule
2. Queries this repo's issues filtered to `kind:intake`
3. Computes readiness scores
4. Generates `src/data/roadmap.json`
5. Opens a PR to update the file (matches the no-direct-commits-to-main convention)

PR-based updates rather than direct commits because the repo enforces the convention.

---

## 13. WHMCS retirement and Cloudflare direct registration

WHMCS currently handles domain management for FFC. The transition to Cloudflare direct registration is underway: FFC purchases domains directly through Cloudflare for new charities, and existing WHMCS-managed domains are progressively migrated.

This program does not depend on WHMCS for any new functionality. Specifically:

- The new intake flow (Zeffy → GitHub → provisioning automation) does not touch WHMCS
- The roadmap data pipeline reads from GitHub issues, not WHMCS
- The provisioning automation in the Cloudflare repo can use Cloudflare's domain APIs directly rather than WHMCS's domain integration
- The existing `update-sites-data.yml` workflow that reads WHMCS data continues running for legacy domain reporting until WHMCS is fully retired, then is updated or removed

The retirement timeline is not part of Phase 1A scope. As WHMCS-related workflows lose their dependencies, they can be retired individually.

The benefit of this transition is that FFC owns the domain registrations directly rather than through a billing intermediary. This simplifies governance (one less system in the chain), reduces cost (no WHMCS license/fees), and aligns with the GitHub-native, Cloudflare-fronted architecture FFC is moving to.

---

## 14. Phasing and sequence

### Phase 1A: Public roadmap and intake foundation (immediate, ~3 weeks)

**Prerequisite work (Clarke, before Claude Code starts):**

- Create `FFC-IN-ffcadmin-private` private repo
- Create `sponsoring-admins` GitHub team in the FreeForCharity org
- Grant the team access to the private repo
- Add Clarke and current verified admins to the team
- Create or update `FreeForCharity/.github` with org-level `SECURITY.md`
- Generate a Zeffy API key from the Zeffy dashboard (free)
- Confirm `secrets.GH_PAT` has cross-repo scopes needed; or generate a new PAT for the `cloudflare-automation` environment
- Define the `cloudflare-automation` GitHub Actions environment in FFCadmin repo settings
- Update the existing Zeffy confirmation email template (in Zeffy dashboard) with new instructions

**Phase 1A deliverables (in FFCadmin repo):**

1. Issue templates with embedded educational content:
   - Intake template (single template; charity stage and tier interest as conditional fields)
   - Public escalation template
2. Lifecycle/mission/affiliation/severity labels in `.github/labels.yml` + sync workflow
3. `verify-assignment.yml` workflow (team-membership check on assignment)
4. `trigger-provisioning.yml` workflow (cross-repo `repository_dispatch` after verification)
5. `sync-from-zeffy.yml` workflow (Zeffy API polling, GitHub stub creation)
6. `build-roadmap-data.yml` workflow (roadmap.json generator)
7. Roadmap pages (`/roadmap`, `/roadmap/submit`, `/roadmap/sponsor`, `/roadmap/methodology`)
8. Educational content (`/intake-help/board-requirements` and `/intake-help/public-contact-info` full; others as stubs)
9. `SECURITY.md` for FFCadmin
10. Navigation update
11. Tests (Jest unit + Playwright E2E + jest-axe)
12. `docs/program-plan.md` (this document)
13. `docs/migration-plan.md` (Cloudflare repo template deprecation, in-flight issue handling)
14. `docs/private-repo-setup.md` (coordination repo configuration)

**Phase 1A milestone:** new charity intake works end-to-end through Zeffy → GitHub stub → structured intake → triage → assignment → verification → provisioning. The public roadmap shows the queue accurately. Verified-admin assignment triggers Cloudflare provisioning automation.

### Phase 1B: Automation source migration (1-2 weeks after 1A ships)

**Goal:** redirect issue-creating automations in the Cloudflare repo so they file in FFCadmin or the coordination repo as appropriate.

- Inventory all Cloudflare repo workflows that create issues
- For each, decide target repo and severity classification
- Update workflows to file via cross-repo `gh api` calls
- Retire the `_deprecated-02-website-request.yml` template entirely
- Document cross-repo automation patterns

### Phase 2: Volunteer tracking system (3-4 weeks, ~Q3 2026)

- `volunteers.json` data file in coordination repo with structured volunteer records
- Public admin directory at `/volunteers` on FFCadmin
- Capacity enforcement in verify-assignment workflow
- Recruitment funnel integration (Idealist, Taproot intake feeding into prospect records)
- Per-volunteer portfolio pages

### Phase 3: Service tier expansion (varies by tier, ongoing)

- Each new Zeffy product gets its own intake template, scoring criteria, and roadmap section
- Multi-tier roadmap view with tier filtering
- Per-tier specialty admin teams (`sponsoring-admins-tier-2`, etc.)
- Tier-specific educational content
- Tier graduation tracking

### Phase 4: Funding visibility (3-4 weeks, after multiple tiers shipped)

- Zeffy webhook integration for donation events (now possible since payment webhooks exist)
- Per-charity funding totals tracked and displayed on roadmap cards
- Donor recognition (with consent) on charity cards
- Funded vs. volunteer track distinction in roadmap UI

### Phase 5: Alumni and impact reporting (ongoing)

- `/alumni` page with case studies of graduated charities
- Impact reporting templates and dashboards
- Donor-facing narrative about FFC's marginal-value targeting
- Annual impact report generation

---

## 15. Open decisions with defaults

These need confirmation from Clarke. Each has a proposed default that will be applied if no override is given. Edit any default that's wrong.

### 15.1 Repo and infrastructure

| #   | Question                          | Default                                                                                                                                |
| --- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Coordination repo name            | **`FFC-IN-ffcadmin-private`** (confirmed)                                                                                              |
| 2   | Cross-repo trigger mechanism      | **`repository_dispatch`** with PAT-scoped environment                                                                                  |
| 3   | Zeffy API enablement              | **Required prerequisite** — Clarke generates API key from Zeffy dashboard before Phase 1A starts                                       |
| 4   | GitHub Actions environment naming | **`cloudflare-automation`** (one env, encompasses Cloudflare-bound and Zeffy-bound secrets) or split into two; default is one combined |
| 5   | PAT scope minimum                 | **`repo`, `workflow`, `read:org` (for team membership check)**                                                                         |

### 15.2 Intake form structure

| #   | Question                                                                                  | Default                                                                                                            |
| --- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 6   | Single intake template vs. four type-specific templates                                   | **Single template with conditional fields based on charity stage and tier interest** — simpler to maintain         |
| 7   | Whether to require the readiness score acknowledgment in the form                         | **No** — score is computed automatically; no charity-side acknowledgment needed                                    |
| 8   | Whether to ask explicit form fields for each readiness criterion vs. parse from free-text | **Explicit structured fields** — more reliable scoring, no text-parsing fragility                                  |
| 9   | EIN field collection                                                                      | **Yes, in public form** — EIN is publicly disclosable for 501(c)(3) charities                                      |
| 10  | Board member personal home address                                                        | **No** — collect only the org's mailing address publicly                                                           |
| 11  | Per-board-member phone/email type dropdowns                                               | **Yes** — required to compute the per-person scoring                                                               |
| 12  | "I confirm I'm not fiscally sponsored by a corporate fiscal sponsor" required checkbox    | **Yes** — keeps charities flowing through corporate-FS path with appropriate scoring rather than blocking outright |

### 15.3 Scoring weights

| #   | Question                                              | Default                                                                                                                                     |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 13  | Mission category as point bonus vs. sort tier         | **Bonus** (+50 basic-needs, +30 veterans, 0 general) — single combined sort key; no niche penalty tier                                      |
| 14  | Phone/email per-person caps                           | **Cap penalties to required roles only** (org main + 3 required board) — optional roles missing is 0, not negative                          |
| 15  | Northwest specifically vs. registered-agent generally | **Treat all registered-agent services equally at +20**; Northwest preference is editorial in `/intake-help/mailing-address`, not in scoring |
| 16  | Form 1023 vs. 1023-EZ small bonus                     | **+12 voluntary long form, +10 either form when used as required**                                                                          |
| 17  | Time-in-status decay rate                             | **-2 per month past expected window, capped at original points**                                                                            |
| 18  | Auto-comment with readiness breakdown                 | **Yes**, with warm framing and top 3 improvement suggestions                                                                                |
| 19  | Tier label wording                                    | **"Just getting started" / "Foundational" / "Developing" / "Established" / "Mature"**                                                       |
| 20  | Show tier label publicly on roadmap cards             | **Yes** — supports transparency without comparative ranking                                                                                 |
| 21  | Show numeric score publicly                           | **No** — only on the auto-comment visible to charity and admins                                                                             |

### 15.4 Affiliations and policy

| #   | Question                                                                  | Default                                                                                      |
| --- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 22  | Fiscal sponsorship corporate penalty                                      | **-40**                                                                                      |
| 23  | Fiscal sponsorship non-FFC operating charity penalty                      | **-20**                                                                                      |
| 24  | Fiscal sponsorship FFC charity recipient (the loud-and-clear exception)   | **0** baseline (neutral); +5 if also pursuing own 501(c)(3)                                  |
| 25  | Franchise charity penalty (Legion posts, IEEE chapters, fraternal lodges) | **-15**                                                                                      |
| 26  | Auxiliary 501(c)(3) recognition                                           | **Yes** — auxiliary scored as independent 501(c)(3), parent franchise penalty does not apply |
| 27  | "Considering fiscal sponsorship" form path                                | **Block submission with educational redirect**                                               |
| 28  | FFC sponsor confirmation window                                           | **14 days**                                                                                  |

### 15.5 Public visibility

| #   | Question                                                             | Default                                                       |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------- |
| 29  | Public roadmap displays Zeffy data                                   | **No, GitHub only** — simpler, single source of truth         |
| 30  | Per-card vote count via `+1` reactions                               | **Yes** — community signal as score input and visible badge   |
| 31  | Roadmap UI: separate sections per service tier vs. tabs vs. unified  | **Unified with primary filter** — single page, filter by tier |
| 32  | Charity stage badges (501(c)(3)/Pre-501(c)(3)/Non-pursuing) on cards | **Yes** — admins self-select toward stages they can support   |
| 33  | Show readiness tier label on cards                                   | **Yes**; numeric score not shown publicly                     |

### 15.6 Educational content

| #   | Question                                                      | Default                                                                                                   |
| --- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 34  | Phase 1A content depth                                        | **Full first-pass for board requirements + public contact info; stubs for the rest**                      |
| 35  | Northwest setup walkthrough on `/intake-help/mailing-address` | **Yes, full first-pass** — Clarke provides FFC's specific Northwest setup details for accuracy            |
| 36  | Sponsor commitment language final wording                     | **Drafted by Phase 1A, reviewed by Clarke before publishing** — paused for explicit approval before merge |

### 15.7 Lists

| #   | Question                                                                                                      | Default                                                                                                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 37  | Policy pages list (5 confirmed): Donation, Privacy, Terms, Vulnerability Disclosure, Security Acknowledgement | **Confirmed** — drop Code of Conduct and Conflict of Interest from scoring                                                                                                                           |
| 38  | External integrations list                                                                                    | **Zeffy, Idealist, Taproot, VolunteerMatch, Charity Navigator, Benevity, Network for Good** (7 platforms × +3 = max +21) — drop AmazonSmile and GiveWell                                             |
| 39  | Mission tiers (self-attested, 3 only)                                                                         | **Basic needs (food, water, shelter) +50; Veterans / military +30; all other missions 0** — self-attested via the WHMCS onboarding org-type dropdown, with keyword auto-classification as a fallback |

### 15.8 Operational

| #   | Question                                                    | Default                                                                    |
| --- | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| 40  | Triage SLA                                                  | **5 business days**                                                        |
| 41  | Manual fallback phone number                                | **520-222-8104** (Clarke's existing number)                                |
| 42  | First-pass triage owner                                     | **Clarke** until volunteer admins gain triage permissions                  |
| 43  | Whether triaging admins need `sponsoring-admins` membership | **No** — separate permission; triage role is FFC central staff             |
| 44  | Pre-stub workflow polling frequency                         | **Every 4-6 hours** — balances responsiveness with API rate limit headroom |

---

## 16. Appendix A: Full readiness score reference

### Mission category (single, applied)

| Category                                                | Points |
| ------------------------------------------------------- | ------ |
| Basic needs (food, water, shelter)                      | +50    |
| Veterans / military                                     | +30    |
| General (all other missions — most 501(c)(3) charities) | 0      |

### Charity stage (single, applied)

| Stage                                                    | Points |
| -------------------------------------------------------- | ------ |
| Approved 501(c)(3)                                       | +20    |
| Pre-501(c)(3) actively pursuing                          | +5     |
| Ongoing nonprofit-nature project, not pursuing 501(c)(3) | 0      |

### Affiliation status (single, applied)

| Affiliation                                                                                                    | Points |
| -------------------------------------------------------------------------------------------------------------- | ------ |
| Independent                                                                                                    | 0      |
| Sponsored by an FFC charity recipient                                                                          | 0      |
| Sponsored by an FFC charity recipient AND own 501(c)(3) application in progress                                | +5     |
| Franchise charity / local affiliate of national parent (Legion post, VFW, fraternal lodge, IEEE chapter, etc.) | -15    |
| Sponsored by a non-FFC operating 501(c)(3)                                                                     | -20    |
| Sponsored by a corporate fiscal sponsor (Players Philanthropy Fund, Tides, NEO, Open Collective, etc.)         | -40    |

### Revenue and form filed (single, applied)

| State                      | Points |
| -------------------------- | ------ |
| Pre-revenue / in formation | 0      |
| 990-N filer ($50K or less) | +20    |
| 990-EZ filer ($50K-$200K)  | +12    |
| 990 filer, $200K-$500K     | +5     |
| 990 filer, $500K-$1M       | 0      |
| 990 filer, $1M-$5M         | -5     |
| 990 filer, over $5M        | -10    |

### Trajectory (single, applied)

| 5-year plan                                           | Points |
| ----------------------------------------------------- | ------ |
| Plans to remain small (intentionally 990-N or 990-EZ) | +10    |
| Plans modest growth within current form size          | +3     |
| Plans substantial growth (toward full 990)            | -3     |
| Major-grant pursuit (over $100K)                      | -8     |
| Don't have a clear trajectory                         | 0      |

### Funding model (single, applied)

| Primary funding                                                    | Points |
| ------------------------------------------------------------------ | ------ |
| Self-funded (membership dues, program fees, founder contributions) | +8     |
| Donations only (individual donors, no grants)                      | +8     |
| Donations + small grants (under $25K total)                        | +5     |
| Significant grants ($25K-$100K total)                              | 0      |
| Major grant-dependent ($100K+ in grants)                           | -5     |
| Government contract primary                                        | -5     |

### Phone numbers (per person, applied to org main contact + 3 required board roles + 2 optional board roles)

For org main contact, President, Secretary, Treasurer (negative scoring applies):

| Phone type                                                                                                | Points |
| --------------------------------------------------------------------------------------------------------- | ------ |
| No phone provided                                                                                         | -10    |
| Landline                                                                                                  | 0      |
| Personal cell phone                                                                                       | +5     |
| Org-specific number (Google Voice for Business, Teams Business Voice, T-Mobile DIGITS Business, real PBX) | +10    |

For VP and Member at Large (no penalty for missing):

| Phone type                                   | Points |
| -------------------------------------------- | ------ |
| No phone (role missing or no phone provided) | 0      |
| Landline                                     | 0      |
| Personal cell phone                          | +5     |
| Org-specific number                          | +10    |

**Maximum**: 60 points (all 6 with org-specific). **Minimum**: -40 points (4 required missing).

### Email addresses (per person, same applicability rules as phones)

For org main + required board roles:

| Email type                                  | Points |
| ------------------------------------------- | ------ |
| No email                                    | -10    |
| Personal free provider (Gmail, Yahoo, etc.) | +2     |
| `orgname@gmail.com` placeholder             | +5     |
| Org-domain email                            | +10    |

For optional board roles: same point values, no penalty for missing role.

**Maximum**: 60 points. **Minimum**: -40 points.

### Mailing address (combined: tiered primary + additive states)

Primary mailing address:

| Address type                                                       | Points |
| ------------------------------------------------------------------ | ------ |
| No address                                                         | -20    |
| Personal residence                                                 | -3     |
| PO box at USPS                                                     | +3     |
| Commercial mailbox (UPS Store, etc.)                               | +5     |
| Real office address                                                | +10    |
| Registered agent service (Northwest Registered Agent or any other) | +12    |

Additional states of registration with registered agent: **+5 each, max +15** (three additional states)

Combined office + RA bonus: **+3** if charity has both a primary real office AND a registered agent in any state

**Maximum**: 35 points (+12 RA primary, +15 three additional states with RA, +3 if also has real office). **Minimum**: -20.

### Board composition (per role)

For required roles (President, Secretary, Treasurer):

| State                    | Points |
| ------------------------ | ------ |
| Missing                  | -15    |
| Filled, name only        | +3     |
| Filled with LinkedIn URL | +5     |

For optional roles (VP, Member at Large):

| State                    | Points |
| ------------------------ | ------ |
| Missing                  | 0      |
| Filled, name only        | +2     |
| Filled with LinkedIn URL | +5     |

**Maximum**: 25 points. **Minimum**: -45 points.

### Candid/GuideStar (501(c)(3) only; additive within section)

| Component                         | Points                                            |
| --------------------------------- | ------------------------------------------------- |
| Profile URL provided              | +10                                               |
| Direct profile link also provided | +5 (additional)                                   |
| Bronze Seal of Transparency       | (not applicable — Gold is FFC's minimum)          |
| Silver Seal                       | (not applicable — Gold is FFC's minimum)          |
| Gold Seal                         | +20 (additional, total +35 with profile + direct) |
| Platinum Seal                     | +30 (additional, total +45 with profile + direct) |

Charities below Gold are placed on `status:on-hold` with an educational comment directing them to reach Gold seal before progressing. Phase 1A does not score sub-Gold charities; they are gated.

**Maximum**: 45 points. **Minimum**: 0 (Gold seal floor enforced separately via on-hold gating).

### Application progress (pre-501(c)(3) only; additive)

| Milestone                                              | Points                 |
| ------------------------------------------------------ | ---------------------- |
| State incorporation filed                              | +10                    |
| State incorporation approved                           | +5 (additional)        |
| EIN obtained from IRS                                  | +10                    |
| Bylaws drafted                                         | +5                     |
| Bylaws adopted by board                                | +5 (additional)        |
| Form 1023-EZ drafted                                   | +5                     |
| Form 1023-EZ submitted (when EZ qualifies)             | +10 (replaces drafted) |
| Form 1023 long form drafted                            | +5                     |
| Form 1023 long form submitted (voluntary)              | +12 (replaces drafted) |
| Form 1023 long form submitted (required for size/type) | +10 (replaces drafted) |

Time-in-status decay applies per the table in section 7.

**Maximum**: 60 points. **Minimum**: 0 (with decay potentially making net negative for stalled charities).

### Operations evidence (non-pursuing nonprofit-nature only; additive)

| Evidence                                                | Points |
| ------------------------------------------------------- | ------ |
| Documented activities in last 6 months                  | +5     |
| Recurring activities (monthly meetings, regular events) | +5     |
| Sponsoring institution (school, church, troop, etc.)    | +5     |
| Letter or attestation from sponsoring institution       | +5     |
| Active community of participants (>10 named)            | +3     |

Time-in-status decay for inactivity (no documented activity in 12 months: -5 immediately, then -1/month).

**Maximum**: 23 points.

### Partnership due diligence (pre-501(c)(3) and non-pursuing only; tiered)

| Evidence                                                                       | Points |
| ------------------------------------------------------------------------------ | ------ |
| No documented outreach to existing organizations                               | -10    |
| Vague mention of having "looked around"                                        | 0      |
| Named at least one existing organization considered                            | +3     |
| Documented outreach to 2+ orgs with conversation summaries                     | +8     |
| Documented outreach to 3+ orgs with specific reasons partnership wasn't viable | +12    |
| Existing org explicitly declined or referred submitter to start independently  | +15    |

**Maximum**: 15. **Minimum**: -10.

### Documents (varies by stage; additive)

| Document                         | Points (when applicable) |
| -------------------------------- | ------------------------ |
| Articles of incorporation        | +3                       |
| Bylaws                           | +5                       |
| State solicitation registrations | +3 each, max +15         |
| Brand assets attached or linked  | +3                       |

For 501(c)(3) charities at Gold+ Seal: Form 990, financial documents, strategic plan are implicit in the seal and do not score separately.

For pre-501(c)(3): same documents score as above; Candid Seal does not apply.

For non-pursuing: subset relevant to nonprofit-nature operations.

**Maximum**: ~30 points depending on stage.

### External integrations (varies by stage; additive at +3 each)

For 501(c)(3): **Zeffy, Idealist, Taproot, VolunteerMatch, Charity Navigator, Benevity, Network for Good** (max +21).

For pre-501(c)(3): subset (Idealist, Taproot, VolunteerMatch — typically the only ones accepting pre-501c3 orgs) (max +9).

For non-pursuing: small subset (Idealist, Taproot in some cases) (max +6).

### Policy pages (additive at +3 each)

The 5 FFC-recognized policies: **Donation Policy, Privacy Policy, Terms of Service, Vulnerability Disclosure Policy, Security Acknowledgement**.

**Maximum**: 15 points.

### Existing website (single, applied)

| Website state                    | Points |
| -------------------------------- | ------ |
| No existing website              | 0      |
| Placeholder or landing page only | +3     |
| Functional site with content     | +8     |

### Tier labels

| Score range | Tier label           |
| ----------- | -------------------- |
| < 0         | Just getting started |
| 0 – 89      | Foundational         |
| 90 – 179    | Developing           |
| 180 – 269   | Established          |
| 270+        | Mature               |

### Theoretical maximums by stage

- **Approved 501(c)(3), basic-needs mission, all infrastructure ideal**: ~375 points
- **Approved 501(c)(3), general mission, all infrastructure ideal**: ~325 points
- **Pre-501(c)(3), basic-needs mission, fully prepared, application submitted**: ~330 points
- **Non-pursuing nonprofit-nature, basic-needs mission, fully realized**: ~265 points

### FFC self-score estimate

Approximately **+280** based on FFC's actual current state:

- General mission category (FFC supports charities; not directly basic-needs or veterans): 0
- Independent: 0
- Approved 501(c)(3): +20
- 990-N filer: +20
- Plans to remain small: +10
- Donation-funded: +8
- Phones (assumed mix): ~+30
- Emails (mostly org-domain): ~+50
- Address (real office NC + state college PA + multi-state RAs): ~+25
- Board (5 roles with LinkedIn): +25
- Candid Platinum: +45
- External integrations (likely 5-6): +15-18
- Policy pages (all 5): +15
- Existing website: +8
- Documents: +14

Sum: approximately 280, solidly Mature.

---

## 17. Appendix B: Existing FFC content audit

Documentation of existing FFC content and where it lives. Phase 1A references rather than rewrites this content.

### freeforcharity.org (WordPress, being migrated to freeforcharity-web Next.js repo)

| Page                                                  | Status                                                                                   | Phase 1A action                                                    |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/free-for-charity-ffc-service-delivery-stages/`      | WordPress-era 8-stage process; some content still relevant, some refers to retired stack | Reference; freeforcharity-web migration updates                    |
| `/501c3/`                                             | 501(c)(3) onboarding requirements; pre-onboarding setup steps; documents/info needed     | Reference; canonical source for intake requirements                |
| `/pre501c3/`                                          | Pre-501(c)(3) onboarding                                                                 | Reference; canonical source for pre-501c3 requirements             |
| `/guidestar-guide/`                                   | Detailed GuideStar setup walkthrough                                                     | Reference; canonical                                               |
| `/help-for-charities/`                                | Old 9-component tech stack listing                                                       | Outdated; freeforcharity-web migration replaces with current stack |
| `/charity-validation-guide-...`                       | Validation process documentation                                                         | Reference; may need updating                                       |
| `/online-impacts-onboarding-guide/`                   | Online presence guide                                                                    | Reference; may need updating                                       |
| `/techstack/`                                         | Old WordPress-era tech stack                                                             | Outdated; defer to ffcadmin.org/tech-stack                         |
| `/free-for-charity-ffc-web-developer-training-guide/` | Web dev training                                                                         | Reference; may need migration                                      |
| `/ffc-volunteer-proving-ground-core-competencies/`    | Volunteer competencies                                                                   | Reference                                                          |
| `/volunteer/`                                         | Volunteer page                                                                           | Reference                                                          |

### ffcadmin.org (Next.js, current canonical)

| Page                     | Phase 1A action                                   |
| ------------------------ | ------------------------------------------------- |
| `/` (home)               | Existing; minor update to reference roadmap       |
| `/training-plan`         | Existing; canonical                               |
| `/canva-designer-path`   | Existing; canonical                               |
| `/contributor-ladder`    | Existing; canonical                               |
| `/get-involved`          | Existing; minor update                            |
| `/sites-list`            | Existing; pattern model for roadmap data pipeline |
| `/tech-stack`            | Existing; canonical current stack                 |
| `/guides`                | Existing                                          |
| `/blog`                  | Existing                                          |
| `/documentation`         | Existing                                          |
| `/testing`               | Existing                                          |
| `/volunteer`             | Existing; canonical                               |
| `/roadmap` and sub-pages | **NEW in Phase 1A**                               |
| `/intake-help/*`         | **NEW in Phase 1A**                               |

### FFC-Cloudflare-Automation

| File                                                | Phase 1A action                                                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `.github/ISSUE_TEMPLATE/01-purchase-new-domain.yml` | Unchanged                                                                                             |
| `.github/ISSUE_TEMPLATE/02-website-request.yml`     | Renamed to `_deprecated-02-website-request.yml`; replaced content directs to FFCadmin                 |
| `.github/ISSUE_TEMPLATE/03-06` (admin-only)         | Unchanged                                                                                             |
| `.github/labels.yml`                                | Phase 1A proposes additions in `docs/proposed-cloudflare-labels.yml` for Clarke to review/PR manually |
| `.github/workflows/15-website-provision.yml`        | Add `repository_dispatch` trigger alongside existing                                                  |
| `.github/workflows/update-sites-data.yml`           | Pattern model; unchanged                                                                              |

### Zeffy

| Resource                                          | Phase 1A action                                         |
| ------------------------------------------------- | ------------------------------------------------------- |
| FFC Charity Application & Verification form       | Expand to capture minimal fields specified in section 5 |
| Domain Name + Microsoft 365 Setup membership      | Existing                                                |
| Hosting + AI Design Support membership            | Existing                                                |
| Confirmation email template (currently "text us") | Rewrite with new instructions per section 5             |
| Future tier products                              | Out of scope for Phase 1A                               |

---

## End of v2

This document is intended to be checked into `docs/program-plan.md` in the `FFC-IN-ffcadmin.org` repo as the canonical reference for the program. Updates happen via PR.

The next step is for Clarke to review the open decisions in section 15, mark adjustments, and confirm scope. Once decisions are locked, this document feeds the Phase 1A implementation prompt for Claude Code.
