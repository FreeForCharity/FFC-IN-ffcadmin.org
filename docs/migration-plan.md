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

## 5. WHMCS note

None of the above depends on WHMCS. Provisioning uses Cloudflare's domain APIs
directly. The existing `update-sites-data.yml` continues exporting legacy data
until WHMCS is fully retired (program plan §13).
