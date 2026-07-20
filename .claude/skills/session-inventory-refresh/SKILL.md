---
name: session-inventory-refresh
description: Regenerate the org-wide agent session inventory snapshot (public/data/agent-session-inventory.json) by fanning out session-archivist workers over all FreeForCharity public repos, then merging, validating, and opening a refresh PR. Manual invocation only — never schedule this.
---

# Session inventory refresh

Regenerates the committed snapshot behind `/agentic-os/session-inventory`.
This is a **manual, human-initiated** procedure: ffcadmin.org is a
snapshot-only plane and must not run scheduled scans of other repos
(`docs/standards/README.md`).

## Procedure

### 1. Enumerate the org

Fetch `https://github.com/orgs/FreeForCharity/repositories?type=source`
(all pages) to get the current public repo list. Diff it against the `repos`
array in `public/data/agent-session-inventory.json` and against `repos.json`;
note additions, removals, and archived repos.

### 2. Fan out archivist workers

Split the repo list into ~4 batches of roughly equal size. For each batch,
launch a subagent following `.claude/agents/session-archivist.md` with the
batch's `name → kind` list. Workers run in parallel and each returns a JSON
fragment. Kind assignment: `FFC-EX-*` → `charity-site`; template repos
(`*Template*`) → `template`; automation/agent/config repos → `tooling`;
org sites and `.github` → `internal`.

### 3. Merge and validate

Follow `.claude/agents/org-inventory-auditor.md`: merge fragments, sort by
name, compute `orgTotals`, set `generatedAt`, then validate:

```bash
pnpm jest agentic-os-data
```

### 4. Refresh docs

- Update the findings numbers in `docs/agentic-os/02-session-inventory.md`.
- Set **Last verified** = today and **Re-verify by** = +90 days in the
  freshness blocks of every `docs/agentic-os/*.md` touched.
- Update `repos.json` if the org listing drifted.

### 5. Verify and ship

Run the pre-commit chain (`pnpm format`, `pnpm lint`, `pnpm type-check`,
`pnpm run build`, `pnpm test`, `pnpm run test:e2e` — 180s+ timeouts, never
cancel), then commit on a branch and open a PR:

```text
feat(data): refresh agent session inventory
```

## Guardrails

- Counts come only from actually-fetched pages; a worker that cannot reach a
  repo records `surveyStatus: "unreachable"` — it never guesses.
- Do not add a scheduled workflow for this skill. If refresh cadence becomes a
  problem, the automation belongs in FFC-Cloudflare-Automation or
  FFC-IN-AI-Management (the ops/control planes), publishing a feed this repo
  syncs — see `docs/agentic-os/03-target-architecture.md`.
