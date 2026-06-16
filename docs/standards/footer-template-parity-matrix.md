# Footer-Template Parity Matrix

This matrix is the ffcadmin control-plane record for WS-A footer-template parity.
It has been refreshed for the current state of the footer-only repo: the initial
footer parity wave is clean on `main` at
`99b4d3390614c26905651b286452d3918f927883`.

ffcadmin is a static control-plane reader for this workstream. It should publish
this matrix and coordination links, but it must not become a live scanner,
workflow runner, or source of truth for another repository's build state. Each
implementation issue owns its own repo changes and validation evidence.

## Current State

- Initial footer parity wave: clean on footer-only `main` at
  `99b4d3390614c26905651b286452d3918f927883`.
- ffcadmin role: documentation-only coordination for PR #443 / issue #442.
- Generated fleet data and `docs/SITES_LIST.md`: out of scope for this PR.
- Next planned wave: template contract plus the footer manifest/Lighthouse tail.

## Operating Rules

- Agents do not merge FFC PRs. Maintainers review and merge if acceptable.
- No production, repository settings, branch protection, secrets, DNS, Pages, or
  cPanel changes are part of this matrix or the linked footer-template issues.
- Keep footer-only changes scoped to footer-only behavior. Adapt full-template
  surfaces where useful; do not blindly copy homepage or full-site features.
- File claims belong in the linked implementation issues and PRs before edits.
- Validation evidence belongs in each PR body, with exact command results.
- ffcadmin must not infer footer-only status from live infrastructure or generated
  fleet data.

## Dependency Order

The first wave has landed cleanly on footer-only `main`; this order is retained
as historical coordination context for the completed parity work.

1. Drift guard first: establish checks that prevent later template work from
   drifting silently.
2. Runtime shell and site config second: create shared metadata and URL contracts
   that later security, smoke, and link checks can rely on.
3. Security artifacts third: ship static headers and security.txt after metadata
   and URL contracts are stable.
4. Smoke and uptime fourth: validate the deployed artifact surface after the core
   static artifacts exist.
5. Supply-chain visibility fifth: add independent advisory and Scorecard checks
   without overlapping app files.
6. Link-check parity sixth: align static-export link validation once the route
   and artifact surfaces have settled.
7. Phantom-revert guard last: protect critical paths after the first parity wave
   has declared which files are critical.

## Completed First-Wave Matrix

| Order | Tracking                                                                                                                                                               | Current state                                             | Class | Target repo                                  | Full-template source evidence                                                                                                                                   | Footer-only file claims                                                                                                                                                                                                                                                    | Validation expectations                                                                                                                                                  | Dependency notes                                                                                                                                                                    |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | [Issue #41](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template/issues/41) / [PR #42](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template/pull/42) | Landed in clean footer-only `main` baseline `99b4d339...` | Port  | `FreeForCharity/FFC-IN-Footer_Only_Template` | `scripts/check-drift.mjs`, `.github/workflows/drift-check.yml`, `package.json` `check:drift`                                                                    | `scripts/check-drift.mjs`, `.github/workflows/drift-check.yml`, `package.json`, `package-lock.json`; PR #42 also touched small drift fixes surfaced by validation                                                                                                          | Run footer-only format, lint, build, tests, and `npm run check:drift`; CI drift workflow should run on PRs and `main`                                                    | First drift-guard item. Do not duplicate this work in later issues; only adjust after landing if an import/path change is required.                                                 |
| 2     | [Issue #43](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template/issues/43)                                                                                   | Landed in clean footer-only `main` baseline `99b4d339...` | Adapt | `FreeForCharity/FFC-IN-Footer_Only_Template` | `src/lib/site.config.ts`, `src/app/layout.tsx`, `src/app/manifest.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/components/footer/index.tsx`             | `src/lib/site.config.ts`, optional `src/lib/siteMetadata.ts` wrapper/removal, `src/app/layout.tsx`, `src/app/manifest.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/globals.css`, `src/components/footer/index.tsx`, related unit and Playwright metadata tests | Run footer-only format, lint, build, unit tests, relevant Playwright tests, and `npm run check:drift`                                                                    | Established the metadata contract needed by security, smoke, uptime, and link-check work.                                                                                           |
| 3     | [Issue #44](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template/issues/44)                                                                                   | Landed in clean footer-only `main` baseline `99b4d339...` | Adapt | `FreeForCharity/FFC-IN-Footer_Only_Template` | `public/_headers`, `public/.well-known/security.txt`, `public/security.txt`, `.github/workflows/security-txt-expiry.yml`, drift checks for CSP and security.txt | `public/_headers`, `public/.well-known/security.txt`, `public/security.txt`, `.github/workflows/security-txt-expiry.yml`, `scripts/check-drift.mjs`, artifact/head metadata test                                                                                           | Run footer-only format, lint, build, tests, `npm run check:drift`, and artifact checks for both security.txt paths                                                       | Depended on site config and metadata from #43. No DNS, Cloudflare, Pages, branch protection, or secrets changes.                                                                    |
| 4     | [Issue #45](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template/issues/45)                                                                                   | Landed in clean footer-only `main` baseline `99b4d339...` | Adapt | `FreeForCharity/FFC-IN-Footer_Only_Template` | `scripts/smoke-check.mjs`, `.github/workflows/deploy.yml`, `.github/workflows/uptime.yml`                                                                       | `scripts/smoke-check.mjs`, `.github/workflows/deploy.yml`, `.github/workflows/uptime.yml`, `tests/smoke.spec.ts` only for small alignment or de-duplication                                                                                                                | Run footer-only format, lint, build, tests, smoke checker, and relevant Playwright smoke coverage; workflow validation should avoid opening live incident issues locally | Depended on routes, manifest, sitemap, robots, security.txt, and footer artifacts being present before smoke checks codified them. No live DNS, Pages settings, or secrets changes. |
| 5     | [Issue #46](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template/issues/46)                                                                                   | Landed in clean footer-only `main` baseline `99b4d339...` | Port  | `FreeForCharity/FFC-IN-Footer_Only_Template` | `.github/workflows/security-audit.yml`, `.github/workflows/scorecard.yml`, optional full-template `audit:high` script                                           | `.github/workflows/security-audit.yml`, `.github/workflows/scorecard.yml`, `package.json` only if maintainers prefer a script wrapper                                                                                                                                      | Run footer-only format, lint, build, tests if touched files require it; validate workflow YAML and run direct audit command locally when dependencies are available      | Followed drift guard and avoided unrelated dependency, Dependabot, and branch-protection changes.                                                                                   |
| 6     | [Issue #47](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template/issues/47)                                                                                   | Landed in clean footer-only `main` baseline `99b4d339...` | Adapt | `FreeForCharity/FFC-IN-Footer_Only_Template` | `scripts/check-links.mjs`, `package.json` `check-links`, `.github/workflows/ci.yml` soft-fail link-check job, `.linkinatorrc.json`                              | `scripts/check-links.mjs`, `package.json`, `.github/workflows/ci.yml`, `.linkinatorrc.json`                                                                                                                                                                                | Run footer-only format, lint, build, tests, and `npm run check-links`; confirm GitHub-Pages-style `.html` resolution works against `out/`                                | Followed route metadata plus smoke/security artifact work to avoid churn in the link surface. Kept existing sharded Playwright behavior.                                            |
| 7     | [Issue #48](https://github.com/FreeForCharity/FFC-IN-Footer_Only_Template/issues/48)                                                                                   | Landed in clean footer-only `main` baseline `99b4d339...` | Port  | `FreeForCharity/FFC-IN-Footer_Only_Template` | `.github/workflows/phantom-revert-guard.yml`                                                                                                                    | `.github/workflows/phantom-revert-guard.yml`                                                                                                                                                                                                                               | Validate workflow YAML and compare protected paths against footer-only critical files; run standard footer-only checks if workflow changes require package install       | Protected first-wave critical paths. Did not update stale PR branches, merge Dependabot PRs, or change branch protection.                                                           |

## Next Planned Wave

The next footer-only parity wave should start after the clean `99b4d339...`
baseline and should stay outside this ffcadmin PR except for coordination docs.

| Order | Focus                | Scope                                                                                                                                                                                                                   | Expected evidence                                                                                     |
| ----- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1     | Template contract    | Define the reusable footer-template contract that future footer-only sites should consume. Keep it explicit about inputs, required routes/artifacts, validation commands, and what remains intentionally site-specific. | Issue/PR in the footer-only template repo with file claims and local validation output.               |
| 2     | Footer manifest tail | Finish/verify the footer-specific manifest tail after the template contract is stable, avoiding generated fleet data and production-setting changes.                                                                    | Artifact/file validation in the footer-only repo; no ffcadmin live scanning.                          |
| 3     | Lighthouse tail      | Align the remaining Lighthouse expectations with the footer-only static export and contract, without turning ffcadmin into a CI runner.                                                                                 | Footer-only CI/local validation evidence; any ffcadmin changes limited to static documentation links. |

## Skipped Full-Template Surfaces

These full-template surfaces are intentionally skipped for footer-only parity
unless a later issue explicitly scopes them:

- Full homepage sections, hero variants, marketing blocks, donation widgets, and
  event/content modules.
- Full header or navigation architecture beyond what footer-only needs for its
  footer, team, policy, and static artifact routes.
- Live fleet scanning, Cloudflare/DNS inspection, WHM/cPanel checks, and GitHub
  Pages/settings inspection from ffcadmin.
- Repository governance expansion beyond lightweight coordination links.
- Generated fleet outputs, including `docs/SITES_LIST.md` and generated site
  data, unless a separate ffcadmin issue scopes that work.

## ffcadmin Scope

This PR only updates documentation under `docs/standards/`. ffcadmin may later
read or link this static matrix, but it should not poll GitHub, run checks for
the footer-only repo, or infer production status from live infrastructure. The
footer-only repo remains responsible for implementation, tests, CI, and artifact
validation.

Refreshed by ci for issue #442 / PR #443. Agents should open draft PRs and must
not merge.
