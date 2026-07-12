# Site-Config Bridge (WHMCS → FFC-EX `siteConfig` partial)

Gate 3 of the gated charity journey requires each charity site's FFC-standard footer to be
generated from **validated** WHMCS application data — not hand-typed. The bridge is
`scripts/generate-footer-config.mjs`: a pure transform (no network calls) that turns one
application record from the existing WHMCS sync (`scripts/whmcs-applications.mjs`) into a
**`siteConfig` partial** for the charity's FFC-EX repo.

The partial uses the canonical shared shape both FFC site templates are converging on
([template convergence, FreeForCharity/FFC-Cloudflare-Automation#693](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/693)):
the typed `SiteConfig` in
[FFC-IN-FFC_Single_Page_Template](https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template)'s
`src/lib/site.config.ts`. Every emitted key is named and nested exactly as in that type, so the
output is **directly transcribable** — and, once
[FFC-IN-Footer_Only_Template](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template)
adopts the same shared shape, the one generated artifact serves **both** templates.

> **Consumption status (today):** no template imports this JSON file yet — both templates read
> their values from `src/lib/site.config.ts` in the charity repo. Until direct consumption lands
> (see Future work), the generated partial is the **source document a volunteer transcribes
> from**, not a file the site loads.

## What it does

- **Input**: one PII-safe application record as published by the sync's
  `buildApplicationRecords` — JSON on stdin, `--input <file>`, or `--sample` (a documented demo
  record). An array (e.g. `WHMCS_DRY_RUN` output) works with `--id ffc-<clientId>`.
- **Validation**: `charityName`, `ein` (NN-NNNNNNN), `candidUrl` (Candid/GuideStar profile), and
  `charityStage` are required, and `charityStage` must be `501c3` (the footer's copyright line
  asserts US 501(c)(3) status — a record that does not carry the stage explicitly is not
  validated). Anything missing means the application is **not validated** for footer generation:
  the script exits non-zero and lists every gap. It never emits a partial footer.
- **Output** (stdout, or `--output <file>`): a JSON object with three keys —
  - `source` — provenance: which validated application the partial derives from (id, system,
    generator, timestamp, and the validated `charityStage` the 501(c)(3) assertion rests on).
  - `manualFields` — every `SiteConfig` key the application could **not** supply, each with a
    note telling the volunteer where to get the value (see below).
  - `siteConfig` — the partial itself, in the shared `SiteConfig` shape.

### Field mapping (application record → `siteConfig`)

| Application record          | `siteConfig` key       | Notes                                                                                             |
| --------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| `charityName`               | `name`                 | Public organization legal name                                                                    |
| `missionExcerpt`            | `description`          | Omitted (and flagged manual) when the application predates the mission field                      |
| `ein`                       | `ein`                  | Validated NN-NNNNNNN                                                                              |
| `facebookUrl`/`linkedinUrl` | `social[]`             | `{ label, href }` entries; labels match the template's icon set; host-checked, dropped if invalid |
| `candidUrl`                 | `guidestar.profileUrl` | `guidestar.directProfileUrl` is emitted as `''` and flagged manual                                |
| _(constant)_                | `supportedBy`          | **Always** FFC: `{ name, url, hubUrl }` — the permanent footer attribution, never from the record |

### Manual fields

Contact details (email, phone, address) are PII the WHMCS sync deliberately never surfaces, and
some `SiteConfig` keys are simply not collected at application time. Those keys are **omitted**
from the partial (never emitted as placeholder values) and itemized in `manualFields` so the
provisioning volunteer knows exactly what to fill by hand:

- `contactEmail`, `phone`, `addresses` — from the charity's public website
- `guidestar.directProfileUrl` — the Candid "shared profile" direct link
- `integrations` — per-charity Zeffy / Idealist / SociableKit / Microsoft Forms endpoints
- `url` — the site's canonical production URL (set at provisioning/cutover)
- `tagline` — agreed with the charity
- `description` / `social` — only when the application record does not carry them

The charity Facebook/LinkedIn **page** URLs collected by the hardened onboarding forms (fields
`facebook-page` / `linkedin-page`) are surfaced by the sync as `facebookUrl` / `linkedinUrl` and
flow straight into `social`; only applications that predate those fields need volunteer fill-in
for social links.

## How a volunteer uses it (website-provisioning work order)

1. Open the charity's `kind:intake` work-order issue; note the application id (`ffc-<clientId>`).
2. Get the application record: run the **WHMCS Intake** workflow with dry-run enabled and copy the
   record from the log, or save the JSON array to a file.
3. Generate the partial (from the FFC-IN-ffcadmin.org repo root):

   ```bash
   node scripts/generate-footer-config.mjs --input applications.json --id ffc-90 \
     --output site.config.partial.json
   ```

   Try it without WHMCS data: `node scripts/generate-footer-config.mjs --sample`

4. If it fails, the listed gaps are onboarding gaps — send the application back for completion in
   WHMCS rather than guessing values.
5. Work through `manualFields`, gathering each value from the charity's public website (or the
   work order), then **transcribe the `siteConfig` object into the charity repo's
   `src/lib/site.config.ts`** — key names and nesting match one-for-one — and/or **attach the
   generated JSON to the work-order issue** (paste it in a comment or attach the file) so the
   provisioning volunteer has the validated source document. Do **not** commit the JSON into the
   charity repo expecting the footer to pick it up; no template consumes it directly yet. Never
   change or drop `supportedBy` — it is the permanent FFC footer attribution required on every
   supported charity site.

## Future work

- **Auto-PR the generated values** into the charity's FFC-EX repo from the work-order workflow, so
  Gate 3's footer requirement is fully mechanical (generate → validate → PR → review → merge).
- **Surface the remaining public contact fields** from the hardened onboarding forms through the
  sync's allowlist so the volunteer fill-in step shrinks further (the social page URLs already
  flow through).
- **Direct consumption — both templates**: once
  [FFC-IN-Footer_Only_Template](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template)
  adopts the shared `SiteConfig` shape
  ([FreeForCharity/FFC-Cloudflare-Automation#693](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/issues/693)),
  have the templates import the generated partial (or generate `site.config.ts` from it) so one
  artifact drives every charity site and the transcription step in Step 5 disappears.

Refs: FreeForCharity/FFC-Cloudflare-Automation#682 (part of epic #676);
FreeForCharity/FFC-Cloudflare-Automation#693 (template convergence — this bridge emits the shared
shape as phase 2).
