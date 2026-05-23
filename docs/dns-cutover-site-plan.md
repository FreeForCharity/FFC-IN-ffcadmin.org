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
(`FreeForCharity/FreeForCharity.org`). At the same time we want a clean
audience split between the two sites so that each has a single primary
purpose.

| Site                | Repo                                  | Audience                              | Primary CTA                             |
| ------------------- | ------------------------------------- | ------------------------------------- | --------------------------------------- |
| freeforcharity.org  | `FreeForCharity/FreeForCharity.org`   | Donors, prospective charity clients   | **Apply for a free site** → backlog     |
| ffcadmin.org        | `FreeForCharity/FFC-IN-ffcadmin.org`  | Volunteers, admins, partner charities | **Start training / contribute**         |

ffcadmin.org also remains the **public training portal for charities still
running their own WordPress** (FFC- or non-FFC-managed) so their staff can
reference our procedures without needing to be in our org.

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

### Keep on freeforcharity.org (donor / marketing / acquisition)

These pages are already built in the marketing repo per the URL mapping doc
and should remain. The cutover plan does not move them.

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

### Move to ffcadmin.org (operations / training / procedures)

These pages are operational — they belong with the volunteers and the
partner-charity admins, not with donors. They should be migrated to
ffcadmin.org and the freeforcharity.org URL should 301 to the ffcadmin.org
equivalent.

| WordPress Slug                                            | Move target on ffcadmin.org                       | Reason                                            |
| --------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `/free-training-programs/`                                | `/training-plan/` (hub) + child pages             | Volunteer training                                |
| `/free-for-charitys-tools-for-success/`                   | `/guides/tools-for-success/`                      | Partner-charity SOP                               |
| `/guidestar-guide/`                                       | `/guides/guidestar-guide/`                        | Partner-charity SOP                               |
| `/charity-validation-guide-.../`                          | `/guides/charity-validation/`                     | Internal SOP, public for transparency             |
| `/online-impacts-onboarding-guide/`                       | `/guides/online-impacts-onboarding/`              | Partner-charity SOP                               |
| `/ffc-volunteer-proving-ground-core-competencies/`        | `/contributor-ladder/proving-ground/`             | Volunteer training                                |
| `/free-for-charity-ffc-web-developer-training-guide/`     | `/training-plan/web-developer/`                   | Volunteer training                                |
| `/free-for-charity-ffc-service-delivery-stages/`          | `/guides/service-delivery-stages/`                | Internal SOP, public for transparency             |
| `/techstack/`                                             | `/tech-stack/` (already exists — merge content)   | Operations                                        |
| `/ffcadmin/`                                              | `/` (already the ffcadmin.org home)               | Already the right place                           |
| `/ffcadmin-free-for-charity-cpanel-backup-sop/`           | `/guides/cpanel-backup-sop/`                      | Internal SOP                                      |

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

1. **Receive 11 migrated pages** from WordPress (listed above). Each page
   must:
   - Be authored in Next.js / Tailwind matching the existing
     `src/app/guides/` and `src/app/training-plan/` patterns.
   - Carry a top callout: "Looking to apply for a free FFC site? Visit
     freeforcharity.org/submit-information."
   - Include canonical link back to itself on ffcadmin.org.

2. **Disambiguate the homepage and nav** so visitors who arrive at
   ffcadmin.org looking for donation / application are bounced to
   freeforcharity.org with a single click (banner + nav item "For
   Charities / Donors → freeforcharity.org").

3. **Footer cross-link block** — both sites' footers must include a "Sister
   site" block with one-line description and link.

4. **Public "For Partner Charities" hub** at `/for-charities/` that
   collects the migrated procedures pages and explains: "Your charity may
   still be on WordPress while you wait for or evaluate a static
   migration. These procedures are kept public so your staff can use them."

5. **Sitemap update** — `src/app/sitemap.ts` must include the new
   guides / training routes.

6. **Internal-link sweep** — replace any in-body link to
   `freeforcharity.org/<moved-slug>` with the ffcadmin.org equivalent.

7. **Drop overlapping admin-only pages from freeforcharity.org**: the
   marketing repo should `noindex` or remove `/ffcadmin/`, `/techstack/`,
   `/ffc-volunteer-proving-ground.../`, etc. once the redirects below are
   in place.

## Changes Required on freeforcharity.org (`FreeForCharity/FreeForCharity.org`)

Filed via companion issues / PRs in that repo, but coordinated from here:

1. **Homepage CTA hierarchy**: primary = "Apply for a free site" (form
   submit), secondary = "Donate", tertiary = "Volunteer (→ ffcadmin.org)".
2. **Remove or stub the migrated pages** (see Move list). Each becomes a
   301 → ffcadmin.org equivalent.
3. **Volunteer page**: trim WordPress content, repurpose as a one-screen
   landing that funnels to ffcadmin.org/get-involved.
4. **Sister-site footer block** linking to ffcadmin.org.
5. **Sitemap + robots**: confirm no longer indexes the moved slugs.

## Cloudflare Bulk Redirects

Configure in Cloudflare for `freeforcharity.org` before DNS cutover so the
WordPress origin can be retired with no broken inbound links:

```
# Drops (existing — keep from ffc-url-mapping.md)
/free-for-charity-terms-of-service/   →  /terms-of-service/                       [same domain]
/donor-dashboard/                     →  /donate/                                  [same domain]
/donation-failed/                     →  /donate/                                  [same domain]
/donation-confirmation/               →  /donate/                                  [same domain]
/sample-page/                         →  /                                          [same domain]
/codetest/                            →  /                                          [same domain]

# Cross-domain moves (new for this cutover)
/free-training-programs/                                →  https://ffcadmin.org/training-plan/
/free-for-charitys-tools-for-success/                   →  https://ffcadmin.org/guides/tools-for-success/
/guidestar-guide/                                       →  https://ffcadmin.org/guides/guidestar-guide/
/charity-validation-guide-.../                          →  https://ffcadmin.org/guides/charity-validation/
/online-impacts-onboarding-guide/                       →  https://ffcadmin.org/guides/online-impacts-onboarding/
/ffc-volunteer-proving-ground-core-competencies/        →  https://ffcadmin.org/contributor-ladder/proving-ground/
/free-for-charity-ffc-web-developer-training-guide/     →  https://ffcadmin.org/training-plan/web-developer/
/free-for-charity-ffc-service-delivery-stages/          →  https://ffcadmin.org/guides/service-delivery-stages/
/techstack/                                             →  https://ffcadmin.org/tech-stack/
/ffcadmin/                                              →  https://ffcadmin.org/
/ffcadmin-free-for-charity-cpanel-backup-sop/           →  https://ffcadmin.org/guides/cpanel-backup-sop/
```

All redirects use **301 Permanent** and **preserve query strings**.

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
