# FFC CE documentation artifact (#358)

The verified record a volunteer self-reports to their certifying body: a signed
letter + an hours table, formatted to satisfy a body's CE audit (date, activity,
hours, category, provider contact). Fully data-driven — generated from the
approved-hours log, no manual per-volunteer editing.

- **Builder/template:** [`src/lib/ceDocumentation.ts`](../src/lib/ceDocumentation.ts)
  (`buildCeDocument` + `renderCeDocumentMarkdown`).
- **Generator CLI:** [`scripts/generate-ce-documentation.ts`](../scripts/generate-ce-documentation.ts).
- **Data source:** `public/data/volunteer-hours.json` (approved hours, #361/#362).
- **Categorization:** `src/data/ce-bodies.ts` (#356) via `creditability()`.

## What it contains

- Issuer block: FFC org name, 501(c)(3) tax status, EIN (supplied at generation
  time), signer name/role, verification email + phone, issue date.
- Per-activity rows: date, activity, channel, hours, **eligibility for the
  target body**, category/cap note, and the verifying approver.
- Eligible totals by channel (raw — the body applies its own numeric caps).
- The compliance disclaimer (verbatim from the epic).

## Generating one

```bash
pnpm tsx scripts/generate-ce-documentation.ts --body isc2 --handle janedoe
pnpm tsx scripts/generate-ce-documentation.ts --body pmi --volunteer "Jane Doe" --ein 12-3456789
```

The Markdown is printed to stdout (printable / attachable / convertible to PDF).

## Format

The MVP is an **audit-friendly Markdown letter** (model + renderer). The same
`CeDocument` model can drive future formats without rework:

- **PDF** — render the Markdown/HTML to PDF for a signed attachment.
- **Per-body CSV** — emit rows in a body's self-report import format.
- **Digital badge** (Open Badges) — complements, not replaces, the audit letter
  (ties to the recognition badges #359/#336).

## Relationship to MOVSM

This shares machinery with the MOVSM documentation-provider letter (#335) — same
hours engine, different template. A future shared generator can emit both.
