# FreeForCharity.org Content Ownership Matrix

> **Generated:** 2026-02-16
> **GitHub Issue:** FFC-IN-ffcadmin.org #138

---

## Overview

All content in the FreeForCharity.org Next.js site is **hardcoded** — there is no CMS. Content lives in two locations:

1. **JSON Data Files** (`src/data/`) — Structured data loaded by TypeScript modules
2. **Component Files** (`src/components/`, `src/app/`) — Inline content in React components

---

## JSON Data Files (Structured Content)

### Team Members (`src/data/team/`)

| File                   | Member          | Role              |
| ---------------------- | --------------- | ----------------- |
| `clarke-moyer.json`    | Clarke Moyer    | Founder/President |
| `chris-rae.json`       | Chris Rae       | Vice President    |
| `tyler-carlotto.json`  | Tyler Carlotto  | Secretary         |
| `brennan-darling.json` | Brennan Darling | Treasurer         |
| `rebecca-cook.json`    | Rebecca Cook    | Member at Large   |

**Loader:** `src/data/team.ts`
**Used by:** `src/components/home-page/TheFreeForCharityTeam/`

### FAQs (`src/data/faqs/`)

| File                                                 | Question                                       |
| ---------------------------------------------------- | ---------------------------------------------- |
| `what-is-the-organization-aiming-to-accomplish.json` | What is the organization aiming to accomplish? |
| `are-you-really-a-charity.json`                      | Are you really a charity?                      |

**Loader:** `src/data/faqs.ts` (also contains additional inline FAQ entries)
**Used by:** `src/components/home-page/FrequentlyAskedQuestions/`

### Testimonials (`src/data/testimonials/`)

| File                 | Content             |
| -------------------- | ------------------- |
| `testimonial-1.json` | Testimonial entry 1 |
| `testimonial-2.json` | Testimonial entry 2 |
| `testimonial-3.json` | Testimonial entry 3 |

**Loader:** `src/data/testimonials.ts`
**Used by:** `src/components/home-page/VoicesofGratitude/` (Figma redesign testimonials section)

---

## Component-Inline Content (Per Page)

### Homepage (`src/app/home-page/index.tsx`)

| Section                  | Component Location                                   | Content Type                    |
| ------------------------ | ---------------------------------------------------- | ------------------------------- |
| Hero                     | `src/components/home-page/Hero/`                     | Headlines, CTA text, hero image |
| Mission                  | `src/components/home-page/Mission/`                  | Mission statement, stats, video |
| SupportFreeForCharity    | `src/components/home-page/SupportFreeForCharity/`    | Donation messaging, amounts     |
| EndowmentFeatures        | `src/components/home-page/EndowmentFeatures/`        | Feature cards, descriptions     |
| OurPrograms              | `src/components/home-page/OurPrograms/`              | Program cards, links            |
| VolunteerWithUs          | `src/components/home-page/VolunteerWithUs/`          | Volunteer CTA, stats            |
| Results2023              | `src/components/home-page/Results2023/`              | Animated statistics             |
| VoicesofGratitude        | `src/components/home-page/VoicesofGratitude/`        | Uses testimonials JSON          |
| TheFreeForCharityTeam    | `src/components/home-page/TheFreeForCharityTeam/`    | Uses team JSON                  |
| FrequentlyAskedQuestions | `src/components/home-page/FrequentlyAskedQuestions/` | Uses FAQs JSON + inline         |

### Global Components

| Component     | Location                          | Content                                                 |
| ------------- | --------------------------------- | ------------------------------------------------------- |
| Header        | `src/components/header/index.tsx` | Navigation links, logo, CTA buttons                     |
| Footer        | `src/components/footer/index.tsx` | Quick links, contact info, social links, EIN, copyright |
| CookieConsent | `src/components/cookie-consent/`  | Cookie banner text, preferences                         |

### Program Pages (Content Inline in Components)

| Page Route                          | Component/Page File                                | WordPress Content Length |
| ----------------------------------- | -------------------------------------------------- | ------------------------ |
| `/501c3/`                           | `src/app/501c3/page.tsx`                           | 34,902 chars             |
| `/pre501c3/`                        | `src/app/pre501c3/page.tsx`                        | 50,921 chars             |
| `/domains/`                         | `src/app/domains/page.tsx`                         | 93,338 chars             |
| `/free-charity-web-hosting/`        | `src/app/free-charity-web-hosting/page.tsx`        | 43,522 chars             |
| `/help-for-charities/`              | `src/app/help-for-charities/page.tsx`              | 48,997 chars             |
| `/free-for-charity-endowment-fund/` | `src/app/free-for-charity-endowment-fund/page.tsx` | 60,433 chars             |

### Resource & Training Pages (Content Inline)

| Page Route                                            | Component/Page File                                      | WordPress Content Length |
| ----------------------------------------------------- | -------------------------------------------------------- | ------------------------ |
| `/free-for-charitys-tools-for-success/`               | `src/app/free-for-charitys-tools-for-success/page.tsx`   | 95,926 chars             |
| `/guidestar-guide/`                                   | `src/app/guidestar-guide/page.tsx`                       | 24,831 chars             |
| `/charity-validation-guide.../`                       | `src/app/charity-validation-guide.../page.tsx`           | 10,382 chars             |
| `/online-impacts-onboarding-guide/`                   | `src/app/online-impacts-onboarding-guide/page.tsx`       | 32,512 chars             |
| `/ffc-volunteer-proving-ground.../`                   | `src/app/ffc-volunteer-proving-ground.../page.tsx`       | 37,835 chars             |
| `/free-for-charity-ffc-web-developer-training-guide/` | `src/app/free-for-charity-ffc-web-developer.../page.tsx` | 49,131 chars             |
| `/free-for-charity-ffc-service-delivery-stages/`      | `src/app/free-for-charity-ffc-service.../page.tsx`       | 25,255 chars             |
| `/techstack/`                                         | `src/app/techstack/page.tsx`                             | 7,466 chars              |

### Policy Pages (Content Inline)

| Page Route                           | Component/Page File                                 | WordPress Content Length |
| ------------------------------------ | --------------------------------------------------- | ------------------------ |
| `/privacy-policy/`                   | `src/app/privacy-policy/page.tsx`                   | 11,076 chars             |
| `/terms-of-service/`                 | `src/app/terms-of-service/page.tsx`                 | 6,869 chars              |
| `/cookie-policy/`                    | `src/app/cookie-policy/page.tsx`                    | N/A (new)                |
| `/donation-policy/`                  | `src/app/donation-policy/page.tsx`                  | N/A (dup)                |
| `/free-for-charity-donation-policy/` | `src/app/free-for-charity-donation-policy/page.tsx` | 9,184 chars              |
| `/vulnerability-disclosure-policy/`  | `src/app/vulnerability-disclosure-policy/page.tsx`  | 10,759 chars             |
| `/security-acknowledgements/`        | `src/app/security-acknowledgements/page.tsx`        | 4,877 chars              |

### Action Pages

| Page Route     | Component/Page File           | WordPress Content Length |
| -------------- | ----------------------------- | ------------------------ |
| `/donate/`     | `src/app/donate/page.tsx`     | 21,009 chars             |
| `/volunteer/`  | `src/app/volunteer/page.tsx`  | 15,176 chars             |
| `/about-us/`   | `src/app/about-us/page.tsx`   | 18,275 chars             |
| `/contact-us/` | `src/app/contact-us/page.tsx` | 11,527 chars             |

### Admin Pages

| Page Route                                      | Component/Page File                             | WordPress Content Length |
| ----------------------------------------------- | ----------------------------------------------- | ------------------------ |
| `/ffcadmin/`                                    | `src/app/ffcadmin/page.tsx`                     | 165 chars                |
| `/ffcadmin-free-for-charity-cpanel-backup-sop/` | `src/app/ffcadmin-free-for-charity.../page.tsx` | N/A                      |

---

## Content Update Procedures

### To Update Team Members

1. Edit JSON file in `src/data/team/[name].json`
2. Update photo in `public/Images/member[N].png` (→ should be `.webp`)
3. If adding new member, create new JSON file and update `src/data/team.ts` loader

### To Update FAQs

1. Edit JSON files in `src/data/faqs/`
2. For inline FAQs, edit `src/data/faqs.ts`
3. Rebuild site

### To Update Testimonials

1. Edit JSON files in `src/data/testimonials/`
2. Rebuild site

### To Update Page Content

1. Edit the corresponding `page.tsx` file in `src/app/[route]/`
2. Content is directly in the React component JSX
3. Rebuild site

### To Update Navigation / Footer

1. Header: Edit `src/components/header/index.tsx`
2. Footer: Edit `src/components/footer/index.tsx`
3. Rebuild site

---

## SEO Metadata Ownership

| Metadata                   | Location                                | Notes                                     |
| -------------------------- | --------------------------------------- | ----------------------------------------- | ----------------- |
| Global title template      | `src/app/layout.tsx`                    | `%s                                       | Free For Charity` |
| Global description         | `src/app/layout.tsx`                    | Site-wide default                         |
| Per-page title/description | Each `page.tsx` `export const metadata` | Some pages may be missing                 |
| Open Graph defaults        | `src/app/layout.tsx`                    | Site-wide OG tags                         |
| Sitemap                    | `src/app/sitemap.ts`                    | Currently homepage only — needs expansion |
| Robots                     | `src/app/robots.ts`                     | Search engine indexing rules              |

---

## Pages NOT YET BUILT (Content Needs WordPress Reference)

These 9 pages exist in WordPress but have no Next.js route. Content must be extracted from the Simply Static export or WordPress REST API and built as new components:

| WordPress Slug             | WP Content Length | Content Source               |
| -------------------------- | ----------------- | ---------------------------- |
| `/blog/`                   | 5,428             | REST API + 6 post entries    |
| `/consulting/`             | 5,116             | REST API page content        |
| `/free-training-programs/` | 29,182            | REST API page content        |
| `/workforce-development/`  | 11,626            | REST API page content        |
| `/case-studies.../`        | 12,898            | REST API page content        |
| `/technology-directory/`   | 13,798            | REST API page content        |
| `/service-directory/`      | 9,047             | REST API page content        |
| `/submit-information/`     | 6,776             | REST API page content (form) |

---

_Document maintained as part of Phase 1: Content Audit (Issue #138)_
