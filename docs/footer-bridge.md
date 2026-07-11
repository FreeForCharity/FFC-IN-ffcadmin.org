# Footer-Config Bridge (WHMCS → FFC-EX footer)

Gate 3 of the gated charity journey requires each charity site's FFC-standard footer to be
generated from **validated** WHMCS application data — not hand-typed. The bridge is
`scripts/generate-footer-config.mjs`: a pure transform (no network calls) that turns one
application record from the existing WHMCS sync (`scripts/whmcs-applications.mjs`) into the footer
config file the charity's FFC-EX repo consumes. The canonical consumer is the footer component in
[FFC-IN-Footer-Only-Template](https://github.com/FreeForCharity/FFC-IN-Footer-Only-Template); both
site templates render the same block (endorsements/EIN, quick links + policy stack, contact,
social icons, copyright).

## What it does

- **Input**: one PII-safe application record as published by the sync's
  `buildApplicationRecords` — JSON on stdin, `--input <file>`, or `--sample` (a documented demo
  record). An array (e.g. `WHMCS_DRY_RUN` output) works with `--id ffc-<clientId>`.
- **Validation**: `charityName`, `ein` (NN-NNNNNNN), and `candidUrl` (Candid/GuideStar profile)
  are required, and `charityStage` must be `501c3` (the footer's copyright line asserts US
  501(c)(3) status). Anything missing means the application is **not validated** for footer
  generation: the script exits non-zero and lists every gap. It never emits a partial footer.
- **Output**: the footer config JSON on stdout, or `--output <file>` — provenance (`source`),
  `organization` (legal name, EIN, stage, mission), `endorsements` (GuideStar profile URL + EIN
  line), `contact` (volunteer-fill placeholders; see below), `socialLinks` (charity Facebook and
  LinkedIn **page** URLs, host-checked), the six-link FFC policy stack, and the `copyright` line.

Contact details (email, phone, address) are PII the WHMCS sync deliberately never surfaces, so
they are emitted as explicit `null`/empty placeholders for the provisioning volunteer to fill from
the charity's public website. The charity Facebook/LinkedIn page URLs collected by the hardened
onboarding forms are accepted (`facebookUrl`, `linkedinUrl`) but not yet published by the sync's
PII-safe allowlist — until the sync surfaces them, those links also need volunteer fill-in.

## How a volunteer uses it (website-provisioning work order)

1. Open the charity's `kind:intake` work-order issue; note the application id (`ffc-<clientId>`).
2. Get the application record: run the **WHMCS Intake** workflow with dry-run enabled and copy the
   record from the log, or save the JSON array to a file.
3. Generate the config (from the FFC-IN-ffcadmin.org repo root):

   ```bash
   node scripts/generate-footer-config.mjs --input applications.json --id ffc-90 \
     --output footer.config.json
   ```

   Try it without WHMCS data: `node scripts/generate-footer-config.mjs --sample`

4. If it fails, the listed gaps are onboarding gaps — send the application back for completion in
   WHMCS rather than guessing values.
5. Fill the `contact` placeholders (and any missing social links) from the charity's public
   website, then commit the file into the charity's FFC-EX repo where the footer component reads
   it.

## Future work

- **Auto-PR the generated file** into the charity's FFC-EX repo from the work-order workflow, so
  Gate 3's footer requirement is fully mechanical (generate → validate → PR → review → merge).
- **Surface the charity page URLs** (`facebookUrl`, `linkedinUrl`) and public contact fields from
  the hardened onboarding forms through the sync's allowlist so the volunteer fill-in step
  disappears.
- **Template consumption**: switch the Footer-Only-Template's footer component from hardcoded FFC
  values to reading this config file, so one shape drives every charity site.

Refs: FreeForCharity/FFC-Cloudflare-Automation#682 (part of epic #676).
