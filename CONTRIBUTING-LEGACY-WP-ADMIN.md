# Contributing to `/legacy-wordpress-administration/`

The Legacy WordPress Administration section under `src/app/legacy-wordpress-administration/` is the FFC operations-team reference for partner charities still on WordPress. This guide covers the four workflows that touch it.

> Hub URL: `https://ffcadmin.org/legacy-wordpress-administration/`
> Architecture overview: `docs/dns-cutover-site-plan.md`

## File layout cheat sheet

| Path                                                           | Purpose                                                                                                         |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `src/data/legacy-wordpress-administration.ts`                  | Single source of truth — page list, categories, cross-link map, `FFC_FOUNDER_CONTACT` constant, slug-union type |
| `src/app/legacy-wordpress-administration/page.tsx`             | Hub landing                                                                                                     |
| `src/app/legacy-wordpress-administration/layout.tsx`           | Section-level metadata + title template                                                                         |
| `src/app/legacy-wordpress-administration/wordpress-*/page.tsx` | One leaf per slug — every leaf renders through `<LeafPageShell page={page}>`                                    |
| `src/components/legacy-wordpress-administration/`              | `PageHeader`, `Sidebar`, `CategoryGrid`, `LeafPageShell`                                                        |
| `scripts/generate-legacy-wp-admin-stubs.ts`                    | Idempotent scaffolder for new leaves                                                                            |
| `__tests__/legacy-wordpress-administration.test.ts`            | Data-file contract tests                                                                                        |
| `__tests__/legacy-wp-admin-cross-references.test.ts`           | Scans every leaf for valid cross-leaf slugs                                                                     |
| `__tests__/components/LegacyWpAdminSidebar.test.tsx`           | Sidebar active-state behaviour                                                                                  |

## Workflow 1 — Add a new leaf

Use case: documenting a new procedure (e.g. `wordpress-cloudflare-page-rules`).

1. Append an entry to `LEGACY_WP_ADMIN_PAGES` in `src/data/legacy-wordpress-administration.ts`. Pick a category, fill `slug`, `title`, `shortLabel`, `summary`, `publicSourceUrl`, and optional `relatedFfcAdminPaths`.
2. Run the scaffolder: `pnpm tsx scripts/generate-legacy-wp-admin-stubs.ts`. It is idempotent — only creates files for slugs without an existing directory.
3. Edit the generated `src/app/legacy-wordpress-administration/<slug>/page.tsx` to replace the placeholder body with real content.
4. **Update the hardcoded counts in tests:**
   - `__tests__/legacy-wordpress-administration.test.ts` — bump `toHaveLength(12)` to the new count, and bump the category-count assertion (`5 / 3 / 4`).
   - `__tests__/route-generation.test.js` — add the new slug to the `leafSlugs` array.
5. Run `pnpm run format && pnpm run lint && pnpm run type-check && pnpm test && pnpm run build` before opening a PR.

Why the hardcoded counts: they are intentional guardrails. A drive-by edit that accidentally removes a leaf would otherwise pass tests silently.

## Workflow 2 — Rename a slug

Use case: `wordpress-domains` → `wordpress-domain-registration` (clearer name).

1. Update the `slug` field in `LEGACY_WP_ADMIN_PAGES`. The slug-union type `LegacyWpAdminSlug` re-derives automatically.
2. Rename the directory: `git mv src/app/legacy-wordpress-administration/<old-slug>/ src/app/legacy-wordpress-administration/<new-slug>/`.
3. Update the `SLUG` constant inside the new leaf's `page.tsx`.
4. The TypeScript compiler will flag every leaf that imports the old literal. Update each — TS catches them all because the parameter type is the slug union.
5. **Cross-leaf links in prose are not type-checked.** Run the cross-reference test (`pnpm test __tests__/legacy-wp-admin-cross-references.test.ts`); it will fail and list every leaf still referencing the old slug. Fix each.
6. Update `__tests__/route-generation.test.js` `leafSlugs` array (replace old → new).
7. Add a Cloudflare redirect entry in `docs/cloudflare-bulk-redirects-cutover.csv` so existing inbound links survive: `/legacy-wordpress-administration/<old>/` → `/legacy-wordpress-administration/<new>/`.

## Workflow 3 — Promote a leaf out of `/legacy-wordpress-administration/`

Use case: a procedure becomes evergreen and should live at a top-level URL (e.g. `wordpress-volunteer-proving-ground` graduates to `/contributor-ladder/proving-ground/`).

1. Remove the entry from `LEGACY_WP_ADMIN_PAGES`.
2. Delete the leaf directory: `rm -r src/app/legacy-wordpress-administration/<slug>/`.
3. Create the new destination route under `src/app/<new-path>/page.tsx`, copying over the page body and dropping the `LeafPageShell` import in favour of a top-level layout.
4. Add a Cloudflare redirect from the old slug to the new URL.
5. Find cross-references to the old slug in other leaves (`grep -rn '<slug>' src/app/legacy-wordpress-administration/`) and update them to the new URL.
6. Update the hardcoded test counts (workflow 1, step 4 — decrementing).

## Workflow 4 — Edit body content of an existing leaf

The common case.

1. Open `src/app/legacy-wordpress-administration/<slug>/page.tsx`.
2. Body content lives directly in JSX. Per-page data structures (e.g. the `stages` / `layers` / `tools` arrays) live as `const` declarations in the same file.
3. Update content. Avoid hardcoding founder contact info — use `FFC_FOUNDER_CONTACT` from the data file (see existing leaves for the pattern).
4. Run `pnpm run format && pnpm test && pnpm run build` before pushing.

Body content is **inline JSX, not a CMS.** A volunteer editor needs comfort with TypeScript + React. For non-technical content edits, consider opening an issue describing the change and letting a contributor land the PR.

## Type-safety guarantees

- `LegacyWpAdminSlug` is the literal union derived from the data file. Functions taking a slug are type-checked.
- `getLegacyWpAdminPageBySlug()` returns `LegacyWpAdminPage` (not optional) — the type system proves the lookup is total.
- Leaf-page directory existence is NOT validated by the type system (see issue #267 for a build-time check proposal).

## Tests that guard the section

| Test                                       | What it catches                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `legacy-wordpress-administration.test.ts`  | Page count, slug prefix, slug uniqueness, category counts, public-source URL shape             |
| `legacy-wp-admin-cross-references.test.ts` | Every `/legacy-wordpress-administration/<slug>/` link in any page.tsx resolves to a known slug |
| `route-generation.test.js`                 | Every documented leaf produces a built `index.html` with the audience callout + self-canonical |
| `components/LegacyWpAdminSidebar.test.tsx` | Active-state logic, including sibling-prefix regression                                        |

## Cross-references

- `AGENTS.md` — global project reference
- `CLAUDE.md` — Claude Code instructions
- `docs/dns-cutover-site-plan.md` — full architecture + audience boundary rules
- Tracking issue: [#248](https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/issues/248) — open follow-ups
