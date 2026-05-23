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
clearly demarcated **Legacy Administration** section on ffcadmin.org that
re-homes the operations-flavored content for the volunteer / admin
audience.

| Site                | Repo                                  | Audience                              | Primary CTA                             |
| ------------------- | ------------------------------------- | ------------------------------------- | --------------------------------------- |
| freeforcharity.org  | `FreeForCharity/FreeForCharity.org`   | Donors, prospective charity clients   | **Apply for a free site** → backlog     |
| ffcadmin.org        | `FreeForCharity/FFC-IN-ffcadmin.org`  | Volunteers, admins, partner charities | **Start training / contribute**         |

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
Legacy Administration section** — not removals from freeforcharity.org.

### Keep on freeforcharity.org (donor / marketing / acquisition)

These pages are already built in the marketing repo per the URL mapping doc
and remain there. The cutover plan does not remove them.

| WordPress Slug                       | Why it stays                                  |
| ------------------------------------ | --------------------------------------------- |
| `/`                                  | Homepage — primary CTA = Apply                |
| `/about-us/`                         | About FFC, leadership, history                |
| `/contact-us/`                       | Donor / applicant contact                     |
| `/donate/`                           | Donation flow                                 |
| `/volunteer/`                        | Recruitment landing (links → ffcadmin.org)    |
| `/501c3/`                            | Charity-applicant marketing                   |
| `/pre501c3/`                         | Charity-applicant marketing                   |
| `/domains/`                          | Charity-applicant marketing                   |
| `/free-charity-web-hosting/`         | Charity-applicant marketing                   |
| `/help-for-charities/`               | Charity-applicant marketing                   |
| `/free-for-charity-endowment-fund/`  | Donor / sustainability story                  |
| `/consulting/`                       | Acquisition for paid consulting               |
| `/workforce-development/`            | Acquisition for volunteer / hire pipeline     |
| `/case-studies/`                     | Donor / applicant social proof                |
| `/technology-directory/`             | Public-facing partner / applicant resource    |
| `/service-directory/`                | Public-facing partner / applicant resource    |
| `/submit-information/`               | **Primary CTA target form** — apply for site  |
| `/blog/` (donor-facing posts only)   | Press / SEO                                   |
| `/privacy-policy/`                   | Required legal                                |
| `/free-for-charity-terms-of-service/`| Required legal                                |
| `/free-for-charity-donation-policy/` | Required legal                                |
| `/vulnerability-disclosure-policy/`  | Required legal                                |
| `/security-acknowledgements/`        | Required legal                                |

### Re-home on ffcadmin.org (Legacy Administration section)

These pages are operational. They **remain published** at their
freeforcharity.org URLs (rebuilt in Next.js) AND get a re-homed copy
under ffcadmin.org's new `/legacy-administration/` hub, framed for the
volunteer / admin audience. Each ffcadmin copy sets
`<link rel="canonical">` to itself (it's the operations-team copy) and
cross-links to the public-facing freeforcharity.org page for charity
visitors.

| WordPress Slug                                            | freeforcharity.org (kept)                                 | ffcadmin.org re-home                                                    |
| --------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| `/free-training-programs/`                                | `/free-training-programs/`                                | `/legacy-administration/training-programs/` + link from `/training-plan/` |
| `/free-for-charitys-tools-for-success/`                   | `/free-for-charitys-tools-for-success/`                   | `/legacy-administration/tools-for-success/`                             |
| `/guidestar-guide/`                                       | `/guidestar-guide/`                                       | `/legacy-administration/guidestar-guide/`                               |
| `/charity-validation-guide-.../`                          | `/charity-validation-guide-.../`                          | `/legacy-administration/charity-validation/`                            |
| `/online-impacts-onboarding-guide/`                       | `/online-impacts-onboarding-guide/`                       | `/legacy-administration/online-impacts-onboarding/`                     |
| `/ffc-volunteer-proving-ground-core-competencies/`        | `/ffc-volunteer-proving-ground-core-competencies/`        | `/legacy-administration/volunteer-proving-ground/` + link from `/contributor-ladder/` |
| `/free-for-charity-ffc-web-developer-training-guide/`     | `/free-for-charity-ffc-web-developer-training-guide/`     | `/legacy-administration/web-developer-training/` + link from `/training-plan/` |
| `/free-for-charity-ffc-service-delivery-stages/`          | `/free-for-charity-ffc-service-delivery-stages/`          | `/legacy-administration/service-delivery-stages/`                       |
| `/techstack/`                                             | `/techstack/`                                             | merge into existing `/tech-stack/` + summary in Legacy Administration   |
| `/ffcadmin/`                                              | `/ffcadmin/` (signpost page → links to ffcadmin.org)      | `/` (this site)                                                         |
| `/ffcadmin-free-for-charity-cpanel-backup-sop/`           | `/ffcadmin-free-for-charity-cpanel-backup-sop/`           | `/legacy-administration/cpanel-backup-sop/`                             |

### Drop (with redirects)

Per the URL mapping doc — keep these decisions:

| WordPress Slug              | Redirect target                |
| --------------------------- | ------------------------------ |
| `/sample-page/`             | `/`                            |
| `/codetest/`                | `/`                            |
| `/donor-dashboard/`         | `/donate/`                     |
| `/donation-failed/`         | `/donate/`                     |
| `/donation-confirmation/`   | `/donate/`                     |

### Blog posts (6)

The 6 legacy WP posts are largely GuideStar-seal updates and one cost FAQ.
Recommendation: keep on freeforcharity.org under `/blog/[slug]/` because
they are donor / trust-signal content. Do not move to ffcadmin.org's blog
(which is volunteer-focused per Issue #186).

---

## Changes Required on ffcadmin.org (this repo)

1. **Build the Legacy Administration hub** at `/legacy-administration/`
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
   Legacy Administration routes.

5. **Internal-link audit** — every in-body link from ffcadmin pages to
   freeforcharity.org should be reviewed: if it points to operations
   content, redirect to the ffcadmin Legacy Administration page; if it
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
