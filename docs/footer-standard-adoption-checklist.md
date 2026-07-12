# Bringing an existing FFC-EX site to the footer standard

The operational checklist for retrofitting the ~30 **live** charity sites (FFC-EX-\* repos) that
went live before the footer standard existed. New charities pick the standard up automatically
through the gated journey; this document is for the back-catalog — one PR per site until the whole
fleet renders the same compliance footer.

Two companion documents define the standard itself; this checklist only sequences the work:

- [application-prerequisites-inventory.md](./application-prerequisites-inventory.md) Section 4b —
  the objective Gate-3 "website validated" checklist the footer is part of.
- The applicant-facing guide
  [Adopting the FFC Footer on an Existing Website](https://ffcadmin.org/guides/adopt-ffc-footer-on-existing-site/)
  (`src/app/guides/adopt-ffc-footer-on-existing-site/`) — the same retrofit described for a
  charity's own already-designed site.

---

## 1. What the standard requires

A retrofitted site is at standard when its footer (rendered on **every** page) carries all of the
following, populated from the charity's approved application data:

- **"Supported by Free For Charity" attribution** linking to
  [freeforcharity.org](https://freeforcharity.org).
- **EIN block** — the charity's legal name and EIN (NN-NNNNNNN format).
- **Hub login link** — the FFC hub at <https://freeforcharity.org/hub> (WHMCS, the system of
  record).
- **Candid / GuideStar link** — the charity's public Candid profile.
- **Policy pages, minimum set** — the legal/policy pages of
  [FFC-IN-Footer_Only_Template](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template)
  (privacy policy, cookie policy, terms of service, donation policies, vulnerability disclosure,
  security acknowledgements), each resolving and containing the charity's information rather than
  placeholder text.
- **Current-year copyright line** — computed at build time, never a hard-coded year.

The footer data must be **generated, not hand-typed**: run
[`scripts/generate-footer-config.mjs`](../scripts/generate-footer-config.mjs) against the charity's
application record per [footer-bridge.md](./footer-bridge.md). If the script exits non-zero listing
gaps, those are onboarding gaps — send the application back for completion in WHMCS instead of
guessing values.

## 2. Per-site retrofit steps

Worked example:
[FFC-EX-catnipandcattitude.org#29](https://github.com/FreeForCharity/FFC-EX-catnipandcattitude.org/pull/29)
— the pilot charity's footer retrofit, which took a localized clone of an existing site to the full
standard in one PR.

1. **Branch** off the site repo's `main` (e.g. `feat/ffc-footer-standard`).
2. **Generate the footer config** from the validated application data (Section 1 above) and wire it
   into the site's config. Never change or drop `supportedBy`.
3. **Adapt the footer to the site's design.** The standard fixes the _content_, not the look — keep
   the site's typography, palette, and layout so the footer reads as part of the site rather than a
   bolt-on. PR #29 above shows the pattern: standard links and EIN block restyled in the charity's
   own brand colors.
4. **Add the missing policy pages** from the Footer_Only_Template set, filled with the charity's
   details.
5. **Run the repo's full CI locally** (format, lint, build, tests) **including the Lighthouse
   accessibility check** — the Gate-3 bar is a score of **≥ 90** (Section 4b). _Lesson from the
   Catnip retrofit:_ restyling footer links in the charity's brand colors can silently break WCAG
   contrast against the footer background — check contrast ratios whenever you introduce
   brand-colored link text, and adjust the shade rather than the standard content.
6. **Open the PR** and merge through the repo's queue once CI is green; confirm GitHub Pages
   redeployed.

## 3. Verification

- **Gate-3 auto-validation** — dispatch the **Gate 3 Auto-Validation** workflow
  ([`.github/workflows/gate3-validate.yml`](../.github/workflows/gate3-validate.yml)) in this repo
  with the site's work-order issue number (or run `scripts/gate3-validate.mjs` directly against the
  live URL for sites that predate work orders). It live-verifies the footer markers — brand text,
  freeforcharity.org link, EIN — plus HTTP 200 and basePath sanity.
- **Manual spot-checks** the tool does not cover: browser console clean on every page, the 375 px
  mobile pass, and the charity-facing policy-page content.
- **Fleet audit re-run** — after each batch of retrofits, re-run the fleet audit so the fleet-wide
  report reflects the new state and the remaining-sites list shrinks accordingly.

## 4. Prioritization guidance

Work the fleet in audit-report order:

1. **Broken sites first** — anything the audit flags as failing to load (non-200, redirect loop,
   broken basePath) gets fixed and retrofitted in the same PR; a compliant footer on a broken site
   helps nobody.
2. **Highest-traffic sites next** — the attribution and policy links matter most where visitors
   actually are.
3. **The long tail in batches** — remaining sites in small batches, re-running the fleet audit and
   a Gate-3 validation pass after each batch rather than after each site.
