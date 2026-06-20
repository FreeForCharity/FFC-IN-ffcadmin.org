# Coordination Repo & Phase 1A Prerequisites

This document covers the one-time setup that lives **outside** the FFCadmin
codebase. The Phase 1A automation (verification, provisioning dispatch, Zeffy
sync) is committed in a **guarded** state: each workflow skips cleanly until the
secrets and resources below exist, then activates automatically. Nothing here
blocks CI.

See `docs/program-plan.md` for the full program context.

## Prerequisite checklist (owner: Clarke)

- [ ] **Create the private coordination repo** `FreeForCharity/FFC-IN-ffcadmin-private`.
- [ ] **Create the `sponsoring-admins` GitHub team** in the `FreeForCharity` org.
- [ ] **Grant the team access** to the private repo (write).
- [ ] **Add Clarke + current verified admins** to the team.
- [ ] **Create/append `FreeForCharity/.github/SECURITY.md`** (org-level fallback).
- [ ] **Generate a Zeffy API key** from the Zeffy dashboard (free, read-only Beta).
- [ ] **Create/confirm a PAT** with scopes `repo`, `workflow`, `read:org`
      (`read:org` is required for the team-membership check).
- [ ] **Define the `cloudflare-automation` Actions environment** in FFCadmin repo
      settings and add the secrets below.
- [ ] **Update the Zeffy confirmation email** (see template below).
- [ ] **Apply the Cloudflare-side changes** in `docs/migration-plan.md`.

## Secrets

Add these in the FFCadmin repo (Settings → Secrets and variables → Actions). The
program plan groups them under one `cloudflare-automation` environment (§15 #4);
repo-level secrets also work.

| Secret          | Used by                                             | Scope / source                             |
| --------------- | --------------------------------------------------- | ------------------------------------------ |
| `GH_PAT`        | `verify-assignment.yml`, `trigger-provisioning.yml` | PAT with `repo`, `workflow`, `read:org`    |
| `ZEFFY_API_KEY` | `sync-from-zeffy.yml`                               | Zeffy dashboard → API key (read-only Beta) |

`build-roadmap-data.yml` and the Zeffy state PR use the **built-in
`GITHUB_TOKEN`** — no extra secret. Until `GH_PAT` / `ZEFFY_API_KEY` are set,
those workflows emit a `::warning::` and exit successfully.

> **Security:** never paste a real token into a file, commit, or comment. Add
> tokens only through GitHub's secrets UI. See `.claude/rules/01-security.md`.

## The `sponsoring-admins` team is the verification artifact

Membership in `sponsoring-admins` _is_ verification (program plan §8). The
`verify-assignment.yml` workflow checks
`GET /orgs/FreeForCharity/teams/sponsoring-admins/memberships/{login}` with the
PAT. Members get the `verified-assignment` label; non-members have the
assignment reverted with a pointer to `/roadmap/sponsor`.

## Coordination repo structure (Phase 1A creates the empty shell)

- `.github/ISSUE_TEMPLATE/` — sensitive escalation templates (same type/severity
  structure as the public one, but allowed to carry private detail).
- `volunteers/` — placeholder for the Phase 2 volunteer tracking data.
- `README.md` — access policy: team membership grants access; treat all content
  as confidential to the FFC community.

When a public escalation needs sensitive context, open a private issue here and
link it from the public one ("Continued in private channel; will post
non-sensitive resolution status").

## Updated Zeffy confirmation email (paste into the Zeffy dashboard)

> **Welcome to Free For Charity!** We've received your application.
>
> **What happens next:** our team reviews mission fit within **5 business days**.
> Your charity will appear on our public roadmap at https://ffcadmin.org/roadmap.
>
> **Complete your intake:** we'll follow up with a link to your intake issue on
> GitHub, where a short structured form captures the details that determine your
> readiness and next steps. Prefer not to use GitHub? Just **text 520-222-8104**
> and we'll complete it with you.
>
> Thank you for the work you do. — The FFC team
