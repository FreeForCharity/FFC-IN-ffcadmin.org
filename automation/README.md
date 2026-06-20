# automation/

Back-office state for FFC automation. **Not web-served** — files here are
deliberately outside `public/`, so the static site never publishes them.

- `zeffy-sync-state.json` — dedup state for `scripts/sync-from-zeffy.mjs`.
  Stores only one-way fingerprints (Zeffy contact id or a SHA-256 of the
  email), never raw applicant email addresses (PII).
