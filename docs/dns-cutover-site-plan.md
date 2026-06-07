# DNS Cutover Site Plan: freeforcharity.org → GitHub Pages + ffcadmin.org Split

> **Generated:** 2026-05-23
> **Status:** Pre-cutover planning
> **Scope:** Content split between the two FFC-owned public sites once the
> WordPress install at freeforcharity.org is replaced by the static site in
> `FreeForCharity/FreeForCharity.org`.

---

## Goal

We are about to complete DNS cutover for `freeforcharity.org` from the
InterServer cPanel WordPress install to a GitHub Pages static site
(`FreeForCharity/FreeForCharity.org`). After cutover the marketing site
keeps **every major category** it has today — we are not pruning pages,
we are converting them to the Next.js / static architecture.

What changes is the **emphasis** on each site, and the addition of a
clearly demarcated **Legacy WordPress Administration** section on ffcadmin.org that
re-homes the operations-flavored content for the volunteer / admin
audience.

| Site               | Repo                                 | Audience                              | Primary CTA                         |
| ------------------ | ------------------------------------ | ------------------------------------- | ----------------------------------- |
| freeforcharity.org | `FreeForCharity/FreeForCharity.org`  | Donors, prospective charity clients   | **Apply for a free site** → backlog |
| ffcadmin.org       | `FreeForCharity/FFC-IN-ffcadmin.org` | Volunteers, admins, partner charities | **Start training / contribute**     |

ffcadmin.org also remains the **public training portal and Legacy
Administration archive for charities still running their own WordPress**
(FFC- or non-FFC-managed) so their staff can reference our procedures
without needing to be in our org.

---

## Persona Boundary Rules

Rules a reviewer can apply when deciding where a page belongs:

1. **Acquisition?** (donor, applicant charity, press, search engine) →
   freeforcharity.org
2. **Operations?** (how we do the work — training, SOPs, runbooks, tech
   stack, conversion guide) → ffcadmin.org
3. **Cross-domain links** are required in both directions in the global
   footer and on at least one in-body CTA per relevant page.
4. **Donate** lives only on freeforcharity.org. ffcadmin.org links to it,
   never hosts a donate flow itself.
5. **Apply for a free site** lives only on freeforcharity.org. ffcadmin.org
   links to it.
6. **Training paths, contributor ladder, conversion guides** live only on
   ffcadmin.org. freeforcharity.org links to them as "Volunteer" /
   "How we build sites".

---

## Content Disposition — WordPress freeforcharity.org (38 pages)

Source: `docs/ffc-content-audit.csv`, `docs/ffc-url-mapping.md`.

**Rule:** every major-category page stays addressable at its current
`freeforcharity.org/<slug>/` URL after cutover. The static Next.js
implementation in `FreeForCharity/FreeForCharity.org` is the new
authoritative copy. The "moves" below are **copies into ffcadmin.org's
Legacy WordPress Administration section** — not removals from freeforcharity.org.

### Keep on freeforcharity.org (donor / marketing / acquisition)

These pages are already built in the marketing repo per the URL mapping doc
and remain there. The cutover plan does not remove them.

| WordPress Slug                        | Why it stays                                 |
| ------------------------------------- | -------------------------------------------- |
| `/`                                   | Homepage — primary CTA = Apply               |
| `/about-us/`                          | About FFC, leadership, history               |
| `/contact-us/`                        | Donor / applicant contact                    |
| `/donate/`                            | Donation flow                                |
| `/volunteer/`                         | Recruitment landing (links → ffcadmin.org)   |
| `/501c3/`                             | Charity-applicant marketing                  |
| `/pre501c3/`                          | Charity-applicant marketing                  |
| `/domains/`                           | Charity-applicant marketing                  |
| `/free-charity-web-hosting/`          | Charity-applicant marketing                  |
| `/help-for-charities/`                | Charity-applicant marketing                  |
| `/free-for-charity-endowment-fund/`   | Donor / sustainability story                 |
| `/consulting/`                        | Acquisition for paid consulting              |
| `/workforce-development/`             | Acquisition for volunteer / hire pipeline    |
| `/case-studies/`                      | Donor / applicant social proof               |
| `/technology-directory/`              | Public-facing partner / applicant resource   |
| `/service-directory/`                 | Public-facing partner / applicant resource   |
| `/submit-information/`                | **Primary CTA target form** — apply for site |
| `/blog/` (donor-facing posts only)    | Press / SEO                                  |
| `/privacy-policy/`                    | Required legal                               |
| `/free-for-charity-terms-of-service/` | Required legal                               |
| `/free-for-charity-donation-policy/`  | Required legal                               |
| `/vulnerability-disclosure-policy/`   | Required legal                               |
| `/security-acknowledgements/`         | Required legal                               |

### Re-home on ffcadmin.org (Legacy WordPress Administration section)

These pages are operational. They **remain published** at their
freeforcharity.org URLs (rebuilt in Next.js) AND get a re-homed copy
under ffcadmin.org's new `/legacy-wordpress-administration/` hub, framed
for the volunteer / admin audience. Each ffcadmin copy sets
`<link rel="canonical">` to itself (it's the operations-team copy) and
cross-links to the public-facing freeforcharity.org page for charity
visitors.

**Slug convention:** every leaf page slug is prefixed `wordpress-` so the
URL itself disambiguates the legacy operations copy from the canonical
freeforcharity.org page. The slug naming holds up in breadcrumbs, nav
labels, search results, and any in-body cross-reference.

| WordPress Slug                                        | freeforcharity.org (kept)                             | ffcadmin.org re-home                                                    |
| ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `/techstack/`                                         | `/techstack/`                                         | `/legacy-wordpress-administration/wordpress-hosting-techstack/`         |
| `/free-charity-web-hosting/`                          | `/free-charity-web-hosting/`                          | `/legacy-wordpress-administration/wordpress-web-hosting/`               |
| `/domains/`                                           | `/domains/`                                           | `/legacy-wordpress-administration/wordpress-domains/`                   |
| `/ffcadmin-free-for-charity-cpanel-backup-sop/`       | `/ffcadmin-free-for-charity-cpanel-backup-sop/`       | `/legacy-wordpress-administration/wordpress-cpanel-backup-sop/`         |
| `/online-impacts-onboarding-guide/`                   | `/online-impacts-onboarding-guide/`                   | `/legacy-wordpress-administration/wordpress-online-impacts-onboarding/` |
| `/charity-validation-guide-.../`                      | `/charity-validation-guide-.../`                      | `/legacy-wordpress-administration/wordpress-charity-validation/`        |
| `/guidestar-guide/`                                   | `/guidestar-guide/`                                   | `/legacy-wordpress-administration/wordpress-guidestar-guide/`           |
| `/free-for-charity-ffc-service-delivery-stages/`      | `/free-for-charity-ffc-service-delivery-stages/`      | `/legacy-wordpress-administration/wordpress-service-delivery-stages/`   |
| `/free-training-programs/`                            | `/free-training-programs/`                            | `/legacy-wordpress-administration/wordpress-training-programs/`         |
| `/free-for-charity-ffc-web-developer-training-guide/` | `/free-for-charity-ffc-web-developer-training-guide/` | `/legacy-wordpress-administration/wordpress-web-developer-training/`    |
| `/free-for-charitys-tools-for-success/`               | `/free-for-charitys-tools-for-success/`               | `/legacy-wordpress-administration/wordpress-tools-for-success/`         |
| `/ffc-volunteer-proving-ground-core-competencies/`    | `/ffc-volunteer-proving-ground-core-competencies/`    | `/legacy-wordpress-administration/wordpress-volunteer-proving-ground/`  |
| `/ffcadmin/`                                          | `/ffcadmin/` (signpost page → links to ffcadmin.org)  | `/` (this site)                                                         |

### Section structure

The Legacy WordPress Administration hub is **one-level-deep**: a hub
landing plus twelve sibling pages. Categorization happens visually on
the hub landing and in the sidebar, driven by a single data file.

**URL tree:**

```
/legacy-wordpress-administration/                                 Hub landing
├── wordpress-hosting-techstack/                                   WordPress Operations
├── wordpress-web-hosting/                                         WordPress Operations
├── wordpress-domains/                                             WordPress Operations
├── wordpress-cpanel-backup-sop/                                   WordPress Operations
├── wordpress-online-impacts-onboarding/                           WordPress Operations
├── wordpress-charity-validation/                                  Charity Onboarding
├── wordpress-guidestar-guide/                                     Charity Onboarding
├── wordpress-service-delivery-stages/                             Charity Onboarding
├── wordpress-training-programs/                                   Volunteer Programs
├── wordpress-web-developer-training/                              Volunteer Programs
├── wordpress-tools-for-success/                                   Volunteer Programs
└── wordpress-volunteer-proving-ground/                            Volunteer Programs
```

**Categories (visual only, not URL segments):**

| Category             | Pages                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| WordPress Operations | wordpress-hosting-techstack, wordpress-web-hosting, wordpress-domains, wordpress-cpanel-backup-sop, wordpress-online-impacts-onboarding |
| Charity Onboarding   | wordpress-charity-validation, wordpress-guidestar-guide, wordpress-service-delivery-stages                                              |
| Volunteer Programs   | wordpress-training-programs, wordpress-web-developer-training, wordpress-tools-for-success, wordpress-volunteer-proving-ground          |

**File / component layout:**

```
src/app/legacy-wordpress-administration/
  layout.tsx                              Sidebar + breadcrumb wrapper for the whole section
  page.tsx                                Hub landing (intro, cross-link, category grid)
  wordpress-hosting-techstack/page.tsx
  wordpress-web-hosting/page.tsx
  wordpress-domains/page.tsx
  wordpress-cpanel-backup-sop/page.tsx
  wordpress-online-impacts-onboarding/page.tsx
  wordpress-charity-validation/page.tsx
  wordpress-guidestar-guide/page.tsx
  wordpress-service-delivery-stages/page.tsx
  wordpress-training-programs/page.tsx
  wordpress-web-developer-training/page.tsx
  wordpress-tools-for-success/page.tsx
  wordpress-volunteer-proving-ground/page.tsx

src/components/legacy-wordpress-administration/
  Sidebar.tsx                             Category-grouped left-rail nav, shared by every child
  PageHeader.tsx                          Top audience callout + public-version cross-link
  CategoryGrid.tsx                        Card grid for the hub landing

src/data/
  legacy-wordpress-administration.ts
                                          Single source of truth: pages, categories,
                                          freeforcharity.org cross-link map, summaries.
                                          Loaded by Sidebar, CategoryGrid, sitemap.ts,
                                          and each page's metadata export.
```

**Hub landing layout (`/legacy-wordpress-administration/`):**

1. Hero: title + one-paragraph audience framing.
2. "What this section is" callout: "Operations and SOP reference for
   FFC volunteers, admins, and partner charities still running their
   own WordPress. The public charity-facing versions of these pages
   live on freeforcharity.org."
3. Cross-link strip: "Looking for the charity-facing versions? →
   freeforcharity.org".
4. Three category sections, each a card grid:
   - **WordPress Operations** (5 cards)
   - **Charity Onboarding** (3 cards)
   - **Volunteer Programs** (4 cards)
5. "Why 'Legacy'?" — short explainer that the procedures stay
   published because many partner charities still run WordPress.
6. Bottom CTAs:
   - "Ready to move off WordPress? → `/guides/wordpress-to-nextjs-guide/`"
   - "Apply for FFC migration help → freeforcharity.org/submit-information"

**Child page template (every leaf page):**

1. Breadcrumb: Home → Legacy WordPress Administration → \<Category\> → \<Page\>.
2. `PageHeader` component:
   - Audience callout (one line).
   - "Public version for charity visitors →" link to the matching
     freeforcharity.org URL (from `legacy-wordpress-administration.ts`).
3. Body content (migrated from WP, rewritten for the volunteer / admin
   voice).
4. Sidebar (left rail on desktop, collapsed accordion on mobile) —
   category-grouped list of all 12 leaf pages with current page
   highlighted.
5. Bottom CTAs:
   - "Back to Legacy WordPress Administration hub →"
   - "Ready to move off WordPress? → `/guides/wordpress-to-nextjs-guide/`"

**Navigation (`src/data/navigation.ts`):**

Add a new top-level dropdown **"Legacy WP Admin"** (or place under
Resources — see issue discussion). Items: the three category names as
in-page anchors to the hub landing, plus "View all" linking to the hub.

**Sitemap (`src/app/sitemap.ts`):**

13 new URLs (hub + 12 children) at `priority: 0.6`, `changeFrequency:
'monthly'`. Driven from `src/data/legacy-wordpress-administration.ts` so
adding a page automatically adds a sitemap entry.

**Canonicals:**

Each ffcadmin page sets `metadata.alternates.canonical` to its own
ffcadmin.org URL. The matching freeforcharity.org page also canonicals
to itself. Both copies are intentional — different audience, different
voice, different slug — so duplicate-content risk is mitigated by
intent + naming + cross-links, not by canonical pointing across
domains.

### Drop (with redirects)

Per the URL mapping doc — keep these decisions:

| WordPress Slug            | Redirect target |
| ------------------------- | --------------- |
| `/sample-page/`           | `/`             |
| `/codetest/`              | `/`             |
| `/donor-dashboard/`       | `/donate/`      |
| `/donation-failed/`       | `/donate/`      |
| `/donation-confirmation/` | `/donate/`      |

### Blog posts (6)

The 6 legacy WP posts are largely GuideStar-seal updates and one cost FAQ.
Recommendation: keep on freeforcharity.org under `/blog/[slug]/` because
they are donor / trust-signal content. Do not move to ffcadmin.org's blog
(which is volunteer-focused per Issue #186).

---

## Changes Required on ffcadmin.org (this repo)

1. **Build the Legacy WordPress Administration hub** at
   `/legacy-wordpress-administration/`
   that receives the 11 re-homed pages (listed above). Each page must:
   - Be authored in Next.js / Tailwind matching the existing
     `src/app/guides/` and `src/app/training-plan/` patterns.
   - Carry a top callout: "Looking to apply for a free FFC site? Visit
     freeforcharity.org/submit-information."
   - Set `<link rel="canonical">` to its own ffcadmin.org URL — this is
     the operations-team copy, not a duplicate of the marketing page.
   - Link back to the public freeforcharity.org equivalent ("Public
     version for charity visitors") so SEO crawlers and human readers
     understand the relationship.

2. **Disambiguate the homepage and nav** so visitors who arrive at
   ffcadmin.org looking for donation / application are bounced to
   freeforcharity.org with a single click (banner + nav item "For
   Charities / Donors → freeforcharity.org").

3. **Footer cross-link block** — both sites' footers must include a "Sister
   site" block with one-line description and link.

4. **Sitemap update** — `src/app/sitemap.ts` must include the new
   Legacy WordPress Administration routes.

5. **Internal-link audit** — every in-body link from ffcadmin pages to
   freeforcharity.org should be reviewed: if it points to operations
   content, redirect to the ffcadmin Legacy WordPress Administration page; if it
   points to donor / applicant content, keep pointing to freeforcharity.

## Changes Required on freeforcharity.org (`FreeForCharity/FreeForCharity.org`)

Filed via companion issues / PRs in that repo, but coordinated from here:

1. **Homepage CTA hierarchy**: primary = "Apply for a free site" (form
   submit), secondary = "Donate", tertiary = "Volunteer (→ ffcadmin.org)".
2. **Convert WordPress pages to Next.js static** — every major-category
   page keeps its current URL but is reimplemented as a static route.
3. **Volunteer page**: keep the donor-facing recruitment copy, add a
   prominent "Already convinced? Start training at
   ffcadmin.org/get-involved →" CTA at the top.
4. **Sister-site footer block** linking to ffcadmin.org's Legacy
   Administration section and Get Involved page.
5. **Sitemap + robots**: confirm all kept routes are indexed and
   canonical to themselves.

## Cloudflare Bulk Redirects

Because every major-category page **stays** on freeforcharity.org under
its current slug, the cross-domain redirect set is no longer needed.
Only the WordPress-only drops and the slug-shortening redirects remain:

```
/free-for-charity-terms-of-service/   →  /terms-of-service/                       [same domain]
/donor-dashboard/                     →  /donate/                                  [same domain]
/donation-failed/                     →  /donate/                                  [same domain]
/donation-confirmation/               →  /donate/                                  [same domain]
/sample-page/                         →  /                                          [same domain]
/codetest/                            →  /                                          [same domain]
```

All redirects use **301 Permanent** and **preserve query strings**.

The ready-to-import Cloudflare Bulk Redirect List is committed at
[`docs/cloudflare-bulk-redirects-cutover.csv`](./cloudflare-bulk-redirects-cutover.csv)
(#244) — load it against the freeforcharity.org zone, then verify each row with
`curl -I` before and after the DNS cutover.

> Note: `/ffcadmin/` on freeforcharity.org stays as a thin signpost page
> linking to `https://ffcadmin.org/` — it is not a redirect.

---

## Cutover Day Checklist

- [ ] Cloudflare Bulk Redirects loaded and tested against the WordPress
      origin (so the redirects can be exercised before DNS is moved).
- [ ] `FreeForCharity/FreeForCharity.org` deployed to GitHub Pages and
      validated against staging hostname.
- [ ] All migrated ffcadmin.org pages live and indexed.
- [ ] Sitemaps refreshed on both sites; both submitted to Google Search
      Console.
- [ ] DNS A/AAAA records changed at registrar to GitHub Pages
      (`185.199.108-111.153`).
- [ ] WordPress origin gracefully shut down (read-only DB snapshot kept
      offline per `docs/ffc-simply-static-config.md`).
- [ ] Linkinator run against both sites — zero external 404s.
- [ ] Cloudflare cache purged.

---

## Issue Tracking

A tracking issue plus per-workstream child issues live in this repo —
search for label `dns-cutover-2026` once the issues below land.

_Document maintained for the DNS cutover. Will be archived once cutover is
complete and the issues close._
