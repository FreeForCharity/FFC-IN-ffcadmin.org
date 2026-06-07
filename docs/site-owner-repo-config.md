# Charity site-owner repo configuration (#306)

The Site Owner docs (`/site-owner`) promise a simple publish flow:

> read the change, click **Approve** → it publishes automatically.

For that to be literally true on a charity's **own** repository, the repo needs
a few settings — otherwise the owner approves a review and is left staring at an
un-mergeable PR. This runbook captures the **chosen policy** so the docs and the
charity/template repos stay aligned.

> Scope: this applies to the **charity site-owner repos** (and the template they
> are created from). It is **repository configuration**, not code in this repo.
> `FFC-IN-ffcadmin.org` is a multi-contributor example and intentionally keeps
> stricter rules.

## Chosen policy (single-owner charity repos)

Optimise for "approve → it ships" with a safety net of green checks. Low
friction, but never publish a broken build.

1. **Enable auto-merge** on the repository
   (Settings → General → Pull Requests → _Allow auto-merge_).
2. **Branch protection / ruleset on the default branch** (`main`):
   - **Require status checks to pass before merging** → select the existing
     **Build, Test, and Verify** check. (Require branches to be up to date.)
   - **Require a pull request before merging** with **1 approving review** — the
     site owner's approval. For a true single-owner repo where the owner is the
     only maintainer, a repository **ruleset** that requires checks (and treats
     the owner's approval/merge as the gate) is acceptable; do not require a
     _second_ reviewer that a solo owner can't satisfy.
   - Do **not** allow force-pushes or deletions of `main`.
3. **Confirm the site owner has write access** (the access level the
   prerequisites on `/site-owner` tell them to request).
4. With auto-merge on, the owner clicks **Enable auto-merge** (or it's enabled
   by the agent on the PR); once checks are green and the review is approved, the
   PR merges and GitHub Pages publishes automatically.

## How to apply (per repo)

Via the GitHub UI: Settings → General (auto-merge) and Settings → Rules →
Rulesets (or Branches → Branch protection). Or with the GitHub CLI / API as part
of the onboarding automation (cf. the `FFC-Cloudflare-Automation-` pattern):

```bash
# Enable auto-merge
gh api -X PATCH repos/<org>/<repo> -f allow_auto_merge=true

# Minimal ruleset: require the CI check + a PR before merging to main
# (configure via Settings → Rules → Rulesets, or the rulesets API)
```

## Outcome

After the owner approves, the PR auto-merges once **Build, Test, and Verify** is
green and the site publishes — matching what `/site-owner` promises. No code
change is required in this repository; this document is the source of truth for
the policy that the charity/template repos and the Site Owner docs follow.
