# automation/

Back-office state for FFC automation. **Not web-served** — files here are
deliberately outside `public/`, so the static site never publishes them.

- `applications-sync-state.json` — dedup state for `scripts/sync-applications.mjs`.
  Stores only the stable, **non-PII application ids** already present in the
  published applications feed (no emails or other personal data). PII stripping
  is the publishing repo's responsibility; FFCadmin never sees raw applicant
  email addresses.
