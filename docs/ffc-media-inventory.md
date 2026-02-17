# FreeForCharity.org Media Asset Inventory

> **Generated:** 2026-02-16
> **GitHub Issue:** FFC-IN-ffcadmin.org #137

---

## Summary

| Location                        | Count           | Notes                             |
| ------------------------------- | --------------- | --------------------------------- |
| WordPress `wp-content/uploads/` | 178 media items | 100 on page 1, 78 on page 2       |
| Next.js `public/Images/`        | 65 files        | Mostly `.webp` format (optimized) |
| Next.js `public/Svgs/`          | 20 SVG files    | Icons and illustrations           |
| Next.js `public/videos/`        | 2 files         | Mission video + poster            |
| Next.js `public/` (root)        | 7 files         | Favicons, manifest, icons         |

---

## Next.js Assets Already in Repo (public/Images/)

These are the production images already converted/optimized for the Next.js site:

| File                                             | Size            | Format   | Purpose                               |
| ------------------------------------------------ | --------------- | -------- | ------------------------------------- |
| `1.webp` - `4.webp`                              | ~1 KB each      | WebP     | Numbered icons                        |
| `About-FFC-Hosting.webp`                         | 67 KB           | WebP     | Hosting page                          |
| `about-us.webp`                                  | 47 KB           | WebP     | About page hero                       |
| `about-us-card-section-image.webp`               | 70 KB           | WebP     | About page card                       |
| `Be-a-volunteer.webp`                            | 2 KB            | WebP     | Volunteer icon                        |
| `card-image.png`                                 | 4 KB            | PNG      | **→ Convert to WebP**                 |
| `Card-section-1.webp` - `Card-section-5.webp`    | 16-64 KB        | WebP     | Card section images                   |
| `client-section-bg-image.webp`                   | 31 KB           | WebP     | Background                            |
| `domains-black-section.webp`                     | 57 KB           | WebP     | Domains page                          |
| `domains-blue-section.webp`                      | 68 KB           | WebP     | Domains page                          |
| `Domains-hero.webp`                              | 355 KB          | WebP     | Domains hero                          |
| `donate-now.webp`                                | 2 KB            | WebP     | Donate icon                           |
| `donation.webp`                                  | 69 KB           | WebP     | Donation page                         |
| `dragon-logo.webp`                               | 10 KB           | WebP     | FFC dragon logo                       |
| `Empowering-Charities.webp`                      | 24 KB           | WebP     | Empowering section                    |
| `Endowment-Features.webp`                        | 229 KB          | WebP     | Endowment section                     |
| `figma-hero-img.png`                             | 139 KB          | PNG      | **→ Convert to WebP**                 |
| `fiverr.webp`                                    | 5 KB            | WebP     | Partner logo                          |
| `free-for-charity.webp`                          | 76 KB           | WebP     | FFC brand image                       |
| `Free-For-Charity-card.webp`                     | 26 KB           | WebP     | Card image                            |
| `glass-paper-pen.webp`                           | 5 KB            | WebP     | Icon                                  |
| `google.webp` / `googleLogo.webp`                | 11 KB each      | WebP     | **Duplicate — remove one**            |
| `grantstationLogo.jpg` / `grantstationLogo.webp` | 19/6 KB         | JPG/WebP | **Duplicate — keep WebP only**        |
| `guidestar.webp`                                 | 5 KB            | WebP     | GuideStar logo                        |
| `heart-in-hands.webp`                            | 43 KB           | WebP     | Donation section                      |
| `help-team.webp`                                 | 40 KB           | WebP     | Help page                             |
| `help-us.webp`                                   | 52 KB           | WebP     | Help section                          |
| `hero-charity.webp`                              | 309 KB          | WebP     | Hero section                          |
| `hero-image.png`                                 | 310 KB          | PNG      | **→ Convert to WebP**                 |
| `hero-img.webp`                                  | 10 KB           | WebP     | Hero thumbnail                        |
| `LastPass-Logo-Color.webp`                       | 5 KB            | WebP     | Partner logo                          |
| `Linkedin-logo.webp`                             | 4 KB            | WebP     | Social icon                           |
| `logo.webp`                                      | 14 KB           | WebP     | FFC logo                              |
| `mailchimpLogo.webp`                             | 25 KB           | WebP     | Partner logo                          |
| `member1.png` - `member5.png`                    | 186-265 KB each | PNG      | **Team photos → Convert to WebP**     |
| `mint-logo.webp`                                 | 2 KB            | WebP     | Partner logo                          |
| `officeLogo.webp`                                | 12 KB           | WebP     | Microsoft Office logo                 |
| `our-mission.webp`                               | 303 KB          | WebP     | Mission section                       |
| `payment.gif`                                    | 3 KB            | GIF      | Payment animation                     |
| `preparing-to-share.webp`                        | 97 KB           | WebP     | Section image                         |
| `quickbooksLogo.webp`                            | 7 KB            | WebP     | Partner logo                          |
| `shoeboxed.webp`                                 | 2 KB            | WebP     | Partner logo                          |
| `support-free-for-charity.png`                   | 288 KB          | PNG      | **→ Convert to WebP**                 |
| `TechSouplogo.webp`                              | 6 KB            | WebP     | Partner logo                          |
| `upwork.webp`                                    | 5 KB            | WebP     | Partner logo                          |
| `volunteer.png`                                  | 71 KB           | PNG      | **→ Convert to WebP**                 |
| `Volunteer-Card.webp`                            | 3 KB            | WebP     | Card icon                             |
| `volunteer-hero.png`                             | 142 KB          | PNG      | **→ Convert to WebP**                 |
| `Volunteer-with-Us.png`                          | 708 KB          | PNG      | **→ Convert to WebP (largest file!)** |
| `Wave-logo.webp`                                 | 7 KB            | WebP     | Partner logo                          |

---

## Action Items

### 1. Convert PNGs to WebP (7 files, ~1.7 MB → est. ~500 KB)

| File                           | Current Size    | Priority            |
| ------------------------------ | --------------- | ------------------- |
| `Volunteer-with-Us.png`        | 708 KB          | High                |
| `hero-image.png`               | 310 KB          | High                |
| `support-free-for-charity.png` | 288 KB          | High                |
| `member1.png` - `member5.png`  | 186-265 KB each | High (Team section) |
| `volunteer-hero.png`           | 142 KB          | Medium              |
| `figma-hero-img.png`           | 139 KB          | Medium              |
| `volunteer.png`                | 71 KB           | Medium              |
| `card-image.png`               | 4 KB            | Low                 |

### 2. Remove Duplicates (2 sets)

- `google.webp` and `googleLogo.webp` — identical 11 KB each, keep one
- `grantstationLogo.jpg` (19 KB) and `grantstationLogo.webp` (6 KB) — keep WebP only

### 3. Rename Files to kebab-case

Current files use mixed PascalCase and camelCase. Should rename to kebab-case per FFC convention:

- `About-FFC-Hosting.webp` → `about-ffc-hosting.webp`
- `Be-a-volunteer.webp` → `be-a-volunteer.webp`
- `Card-section-1.webp` → `card-section-1.webp`
- `Domains-hero.webp` → `domains-hero.webp`
- `Empowering-Charities.webp` → `empowering-charities.webp`
- `Endowment-Features.webp` → `endowment-features.webp`
- `Free-For-Charity-card.webp` → `free-for-charity-card.webp`
- `LastPass-Logo-Color.webp` → `lastpass-logo-color.webp`
- `Linkedin-logo.webp` → `linkedin-logo.webp`
- `Volunteer-Card.webp` → `volunteer-card.webp`
- `Volunteer-with-Us.png` → `volunteer-with-us.webp`
- `TechSouplogo.webp` → `techsoup-logo.webp`
- `Wave-logo.webp` → `wave-logo.webp`

**Note:** Each rename requires updating the corresponding component import/reference.

### 4. WordPress Media NOT Needed in Next.js

Most WordPress media library items are Divi theme assets, construction/portfolio placeholder images, or duplicates. These categories are NOT needed:

- **Construction images** (IDs 160-170): Divi theme demo content
- **File format icons** (IDs 145-152, 244-249): Divi portfolio feature
- **Cyber security illustrations** (IDs 697-713): Used in vulnerability page (may already be rebuilt differently)
- **Duplicate portraits** (multiple copies at different sizes)

### 5. WordPress Media Potentially Needed

| WP ID | Filename                                           | Used On            | Status in Next.js               |
| ----- | -------------------------------------------------- | ------------------ | ------------------------------- |
| 643   | `FFC_Circle_500x500.png`                           | Logo/branding      | Already have `logo.webp`        |
| 645   | `FFC_Circle_500x500-removebg-preview.png`          | Transparent logo   | Already have `dragon-logo.webp` |
| 663   | `facebook-candid-seal-platinum-2022.png`           | Footer GuideStar   | Already have `footerImage.svg`  |
| 4116  | `facebook-seals-of-transparency-platinum-2024.png` | Footer (2024 seal) | **May need update**             |
| 5014  | `people-holding-rubber-heart.jpg`                  | Donation page      | Already have `donation.webp`    |
| 5019  | `hunters-race-MYbhN8KaaEc-unsplash.jpg`            | About page         | Already have `about-us.webp`    |

---

## SVG Assets (public/Svgs/)

| File                                 | Size   | Purpose                      |
| ------------------------------------ | ------ | ---------------------------- |
| `Be-a-Champion.svg`                  | 9 KB   | Endowment feature icon       |
| `down-arrow.svg` / `up-arrow.svg`    | ~200 B | Navigation arrows            |
| `FFC-Consulting.svg`                 | 47 KB  | Consulting page illustration |
| `FFC-Domains.svg`                    | 6 KB   | Domains icon                 |
| `FFC-Hosting.svg`                    | 18 KB  | Hosting icon                 |
| `footerImage.svg`                    | 13 KB  | GuideStar Platinum Seal      |
| `Goal-of-$1,000,000.svg`             | 6 KB   | Endowment goal graphic       |
| `heart.svg`                          | 700 B  | Donation icon                |
| `home.svg`                           | 1 KB   | Home icon                    |
| `linkedin-icon.svg`                  | 1 KB   | LinkedIn social icon         |
| `Long-Term-Impact.svg`               | 5 KB   | Endowment feature icon       |
| `minus.svg` / `plus.svg`             | ~300 B | Accordion icons              |
| `quote-left.svg` / `quote-right.svg` | ~600 B | Testimonial quote marks      |
| `start-icon.svg`                     | 800 B  | CTA icon                     |
| `sustainable-funding.svg`            | 6 KB   | Endowment feature icon       |
| `tickmark.svg`                       | 835 B  | Checkmark icon               |

**SVG Naming:** Should also be kebab-cased (e.g., `be-a-champion.svg`, `ffc-consulting.svg`)

---

## Video Assets (public/videos/)

| File                       | Purpose                  | Notes                 |
| -------------------------- | ------------------------ | --------------------- |
| `mission-video.mp4`        | Homepage mission section | Embedded video player |
| `mission-video-poster.png` | Video thumbnail/poster   | Displayed before play |

---

_Document maintained as part of Phase 1: Content Audit (Issue #137)_
