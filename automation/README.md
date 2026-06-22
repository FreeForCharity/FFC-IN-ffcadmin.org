# automation/

Back-office state for FFC automation. **Not web-served** — files here are
deliberately outside `public/`, so the static site never publishes them.

- `zeffy-sync-state.json` — dedup state for `scripts/sync-from-zeffy.mjs`.
  Stores only one-way fingerprints — a Zeffy contact id when available, else a
  **keyed HMAC-SHA256** of the email using a secret salt — never raw applicant
  email addresses (PII). The keyed HMAC (unlike a bare hash) can't be
  brute-forced back to an email without the secret.
