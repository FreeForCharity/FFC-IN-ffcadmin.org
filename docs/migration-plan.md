# Cloudflare Repo Migration & Cross-Repo Contract

This document describes the changes needed in
`FreeForCharity/FFC-Cloudflare-Automation` to receive provisioning triggers from
FFCadmin, plus the deprecation of the old public website-request template. These
changes are applied **in the Cloudflare repo** (out of scope for this FFCadmin
PR) — they are documented here so they can be PR'd there directly.

See `docs/program-plan.md` §12–13 for context.

## 1. `repository_dispatch` contract

FFCadmin's `trigger-provisioning.yml` sends this after an intake issue passes
verification:

- **Target repo:** `FreeForCharity/FFC-Cloudflare-Automation`
- **Event type:** `ffcadmin-website-provision`
- **`client_payload`:**
  - `ffcadmin_issue` — FFCadmin intake issue number
  - `charity_title` — issue title (`[Intake] <charity name>`)
  - `issue_url` — link back to the FFCadmin issue
  - `sponsor` — assigned sponsoring admin's GitHub login
  - `domain` — the applicant's desired apex domain from the intake form (may be
    empty if left blank; the provision workflow should fall back to its `domain`
    input / an admin prompt when empty)

## 2. Add the trigger to `15-website-provision.yml` (Cloudflare repo)

Add `repository_dispatch` alongside the existing triggers:

```yaml
on:
  issues:
    types: [assigned] # legacy path during transition
  repository_dispatch:
    types: [ffcadmin-website-provision]
  workflow_dispatch:
    inputs:
      charity_title:
        description: Charity name
        required: true
```

Read the payload inside the job, e.g.:

```yaml
- name: Resolve inputs
  run: |
    echo "CHARITY=${{ github.event.client_payload.charity_title || inputs.charity_title }}" >> "$GITHUB_ENV"
    echo "FFCADMIN_ISSUE=${{ github.event.client_payload.ffcadmin_issue }}" >> "$GITHUB_ENV"
```

The provisioning steps (per-charity repo creation, Cloudflare DNS, Microsoft 365
email) are unchanged; only the trigger and input-resolution are added.

## 3. Deprecate the public website-request template

- Rename `.github/ISSUE_TEMPLATE/02-website-request.yml` →
  `_deprecated-02-website-request.yml`.
- Replace its body with a notice pointing to the new FFCadmin intake flow
  (`https://ffcadmin.org/roadmap/submit`).
- Leave admin-only templates `03`–`06` and `01-purchase-new-domain.yml`
  unchanged.
- Phase 1B retires `_deprecated-02-website-request.yml` entirely.

## 4. Proposed labels for the Cloudflare repo

See `docs/proposed-cloudflare-labels.yml` for label additions to PR into the
Cloudflare repo so cross-repo automation can apply consistent labels.

## 5. Applications feed (optional fallback intake source)

The **primary** intake path is local: FFCadmin's `whmcs-intake.yml` queries WHMCS
directly using credentials fetched at runtime from Azure Key Vault (see
`docs/azure-keyvault-setup.md`), and opens a `kind:intake` issue per new applicant.
No long-lived WHMCS/Zeffy secrets are stored in GitHub.

As an **optional fallback**, the repo that owns those upstream flows
(`FFC-Cloudflare-Automation`) can extract genuine applicants and **publish a
PII-safe `applications.json`**, the same way it already publishes `sites-list`.
FFCadmin's `sync-applications.yml` reads that public file daily and opens a
`kind:intake` issue per new applicant; `build-roadmap-data.yml` then scores and
renders them on the roadmap. The schema and producer responsibilities below
describe that fallback feed.

**Where to publish:** a public raw path in the Cloudflare repo, e.g.
`applications/applications.json` (override via the `APPLICATIONS_SRC_URL` repo
variable on FFCadmin if you choose a different path).

**Producer responsibilities (in the Cloudflare repo, where the access lives):**

- **Product-gate upstream** — include only real charity applicants (the right
  WHMCS product / Zeffy application form), never donors/members.
- **Strip PII** — no raw emails or personal data. Provide a stable, non-PII
  `id` (e.g. a hashed WHMCS client id) for dedup.

**Schema:**

```json
{
  "generatedAt": "2026-06-01T00:00:00Z",
  "source": "whmcs",
  "applications": [
    {
      "id": "whmcs-7f3a…", // stable, non-PII id (required)
      "charityName": "Example Org", // required
      "serviceTier": "Tier 2 — Domain + Microsoft 365", // optional
      "status": "intake", // optional; one of the status:* values, default intake
      "submittedAt": "2026-05-20" // optional
    }
  ]
}
```

FFCadmin dedups on `id` (tracked in `automation/applications-sync-state.json`
and via an `ffc-application-id` marker in each stub issue), so re-publishing the
full list is safe and idempotent.

## 6. WHMCS note

Provisioning uses Cloudflare's domain APIs directly. The existing
`update-sites-data.yml` continues exporting legacy data until WHMCS is fully
retired (program plan §13).
