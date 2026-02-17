# FreeForCharity.org URL Mapping: WordPress → Next.js

> **Generated:** 2026-02-16
> **WordPress Pages:** 38 | **WordPress Posts:** 6 | **Next.js Routes:** 29
> **GitHub Issue:** FFC-IN-ffcadmin.org #136

---

## Summary

| Category                                                  | Count |
| --------------------------------------------------------- | ----- |
| WordPress pages with existing Next.js route (exact match) | 24    |
| WordPress pages needing new Next.js routes                | 9     |
| WordPress pages to DROP (not needed)                      | 5     |
| WordPress blog posts (all map to `/blog/`)                | 6     |
| Next.js routes with no WordPress equivalent               | 5     |

---

## Pages With Existing Next.js Routes (24 pages — MATCHED)

| #   | WordPress Slug                                        | Next.js Route                                         | Status   | Notes                        |
| --- | ----------------------------------------------------- | ----------------------------------------------------- | -------- | ---------------------------- |
| 1   | `/` (home)                                            | `/` (home-page/)                                      | ✅ Match | Homepage uses Figma redesign |
| 2   | `/about-us/`                                          | `/about-us/`                                          | ✅ Match |                              |
| 3   | `/contact-us/`                                        | `/contact-us/`                                        | ✅ Match |                              |
| 4   | `/donate/`                                            | `/donate/`                                            | ✅ Match |                              |
| 5   | `/volunteer/`                                         | `/volunteer/`                                         | ✅ Match |                              |
| 6   | `/501c3/`                                             | `/501c3/`                                             | ✅ Match |                              |
| 7   | `/pre501c3/`                                          | `/pre501c3/`                                          | ✅ Match |                              |
| 8   | `/domains/`                                           | `/domains/`                                           | ✅ Match |                              |
| 9   | `/free-charity-web-hosting/`                          | `/free-charity-web-hosting/`                          | ✅ Match |                              |
| 10  | `/help-for-charities/`                                | `/help-for-charities/`                                | ✅ Match |                              |
| 11  | `/free-for-charity-endowment-fund/`                   | `/free-for-charity-endowment-fund/`                   | ✅ Match |                              |
| 12  | `/free-for-charitys-tools-for-success/`               | `/free-for-charitys-tools-for-success/`               | ✅ Match |                              |
| 13  | `/guidestar-guide/`                                   | `/guidestar-guide/`                                   | ✅ Match |                              |
| 14  | `/charity-validation-guide-.../`                      | `/charity-validation-guide-.../`                      | ✅ Match | Very long slug               |
| 15  | `/online-impacts-onboarding-guide/`                   | `/online-impacts-onboarding-guide/`                   | ✅ Match |                              |
| 16  | `/ffc-volunteer-proving-ground-core-competencies/`    | `/ffc-volunteer-proving-ground-core-competencies/`    | ✅ Match |                              |
| 17  | `/free-for-charity-ffc-web-developer-training-guide/` | `/free-for-charity-ffc-web-developer-training-guide/` | ✅ Match |                              |
| 18  | `/free-for-charity-ffc-service-delivery-stages/`      | `/free-for-charity-ffc-service-delivery-stages/`      | ✅ Match |                              |
| 19  | `/techstack/`                                         | `/techstack/`                                         | ✅ Match |                              |
| 20  | `/ffcadmin/`                                          | `/ffcadmin/`                                          | ✅ Match | Admin dashboard              |
| 21  | `/privacy-policy/`                                    | `/privacy-policy/`                                    | ✅ Match |                              |
| 22  | `/vulnerability-disclosure-policy/`                   | `/vulnerability-disclosure-policy/`                   | ✅ Match |                              |
| 23  | `/security-acknowledgements/`                         | `/security-acknowledgements/`                         | ✅ Match |                              |
| 24  | `/free-for-charity-donation-policy/`                  | `/free-for-charity-donation-policy/`                  | ✅ Match |                              |

---

## Pages Needing NEW Next.js Routes (9 pages — TO BUILD)

| #   | WordPress Slug                                             | Proposed Next.js Route                          | Content Length | Priority | Notes                            |
| --- | ---------------------------------------------------------- | ----------------------------------------------- | -------------- | -------- | -------------------------------- |
| 1   | `/blog/`                                                   | `/blog/`                                        | 5,428          | Medium   | Blog listing page; 6 posts below |
| 2   | `/consulting/`                                             | `/consulting/`                                  | 5,116          | Medium   | Services page                    |
| 3   | `/free-training-programs/`                                 | `/free-training-programs/`                      | 29,182         | Medium   | Training programs listing        |
| 4   | `/workforce-development/`                                  | `/workforce-development/`                       | 11,626         | Medium   | Program page                     |
| 5   | `/charity-and-nonprofit-case-studies.../`                  | `/case-studies/`                                | 12,898         | Low      | Consider shorter slug            |
| 6   | `/charity-and-nonprofit-technology-directory/`             | `/technology-directory/`                        | 13,798         | Low      | Consider shorter slug            |
| 7   | `/charity-and-nonprofit-service-and-consultant-directory/` | `/service-directory/`                           | 9,047          | Low      | Consider shorter slug            |
| 8   | `/submit-information/`                                     | `/submit-information/`                          | 6,776          | Medium   | Form page                        |
| 9   | `/ffcadmin-free-for-charity-cpanel-backup-sop/`            | `/ffcadmin-free-for-charity-cpanel-backup-sop/` | —              | Low      | Already exists in repo           |

**Note on slug shortening:** Pages #5-7 have extremely long WordPress slugs. If shortened, Cloudflare Bulk Redirects should be configured for the old URLs.

---

## Pages to DROP (5 pages — NOT NEEDED)

| #   | WordPress Slug            | Reason                                         | Content Length |
| --- | ------------------------- | ---------------------------------------------- | -------------- |
| 1   | `/sample-page/`           | WordPress default sample page                  | 1,174          |
| 2   | `/codetest/`              | Developer test page                            | 732            |
| 3   | `/donor-dashboard/`       | External service (Zeffy/PayPal), empty content | 0              |
| 4   | `/donation-failed/`       | Transactional page for old payment flow        | 11,330         |
| 5   | `/donation-confirmation/` | Transactional page for old payment flow        | 17,609         |

**Redirects needed for dropped pages:**

- `/sample-page/` → No redirect needed (no SEO value)
- `/codetest/` → No redirect needed (no SEO value)
- `/donor-dashboard/` → Redirect to `/donate/`
- `/donation-failed/` → Redirect to `/donate/`
- `/donation-confirmation/` → Redirect to `/donate/`

---

## WordPress Blog Posts (6 posts — map to `/blog/`)

| #   | WordPress Slug                                                     | Title                               | Modified   |
| --- | ------------------------------------------------------------------ | ----------------------------------- | ---------- |
| 1   | `/we-just-updated-for-the-2022-guidestar-platinum-seal/`           | GuideStar Platinum Seal 2022 Update | 2024-01-28 |
| 2   | `/our-organization-earned-a-2021-platinum-seal-of-transparency/`   | 2021 Platinum Seal                  | 2024-01-28 |
| 3   | `/what-is-the-cost/`                                               | What is the cost?                   | 2024-01-28 |
| 4   | `/free-for-charity-just-earned-the-platinum-seal-of-transparency/` | Platinum Seal of Transparency       | 2021-07-27 |
| 5   | `/using-a-registered-agent-service-northwest-registered-agent/`    | Registered Agent Service            | 2024-01-28 |
| 6   | `/podio-sponsorship-program/`                                      | Podio Sponsorship Program           | 2024-01-28 |

**Decision needed:** These blog posts are old (2021-2024) and mostly about GuideStar seals. Options:

1. Build individual blog post pages under `/blog/[slug]/`
2. Consolidate into a single `/blog/` page with all content
3. Drop blog posts entirely (redirect all to `/blog/` or homepage)

---

## Next.js Routes With NO WordPress Equivalent (5 routes)

| #   | Next.js Route                                   | Purpose               | Notes                                             |
| --- | ----------------------------------------------- | --------------------- | ------------------------------------------------- |
| 1   | `/cookie-policy/`                               | Cookie consent policy | New page, not in WordPress                        |
| 2   | `/donation-policy/`                             | Donation policy       | Duplicate of `/free-for-charity-donation-policy/` |
| 3   | `/terms-of-service/`                            | Terms of service      | WP slug was `/free-for-charity-terms-of-service/` |
| 4   | `/home-old/`                                    | Legacy homepage       | Dev artifact, consider removing                   |
| 5   | `/ffcadmin-free-for-charity-cpanel-backup-sop/` | cPanel backup SOP     | Admin page, already built                         |

**Note on Terms of Service:** WordPress uses `/free-for-charity-terms-of-service/` but Next.js uses the shorter `/terms-of-service/`. A Cloudflare Bulk Redirect is needed: `/free-for-charity-terms-of-service/` → `/terms-of-service/`

---

## Cloudflare Bulk Redirects Required

These 301 redirects should be configured in Cloudflare (DNS-level, no CDN required):

| Old URL                               | New URL              | Reason         |
| ------------------------------------- | -------------------- | -------------- |
| `/free-for-charity-terms-of-service/` | `/terms-of-service/` | Slug shortened |
| `/donor-dashboard/`                   | `/donate/`           | Page dropped   |
| `/donation-failed/`                   | `/donate/`           | Page dropped   |
| `/donation-confirmation/`             | `/donate/`           | Page dropped   |
| `/sample-page/`                       | `/`                  | Page dropped   |
| `/codetest/`                          | `/`                  | Page dropped   |

**If slug shortening is approved for directory/case study pages:**

| Old URL                                                                  | New URL                  | Reason         |
| ------------------------------------------------------------------------ | ------------------------ | -------------- |
| `/charity-and-nonprofit-case-studies-to-help-your-organization-succeed/` | `/case-studies/`         | Slug shortened |
| `/charity-and-nonprofit-technology-directory/`                           | `/technology-directory/` | Slug shortened |
| `/charity-and-nonprofit-service-and-consultant-directory/`               | `/service-directory/`    | Slug shortened |

---

## Total Route Count After Migration

| Category                    | Count                        |
| --------------------------- | ---------------------------- |
| Existing matched routes     | 24                           |
| New routes to build         | 9                            |
| Routes to drop              | 5                            |
| New routes (not in WP)      | 5                            |
| **Total Next.js routes**    | **~33** (24 matched + 9 new) |
| Blog post routes (if built) | +6                           |

---

_Document maintained as part of Phase 1: Content Audit (Issue #136)_
