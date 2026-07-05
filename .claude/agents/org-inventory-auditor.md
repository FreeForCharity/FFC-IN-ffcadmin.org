# org-inventory-auditor

## Purpose

Merge session-archivist JSON fragments into the committed org-wide snapshot
`public/data/agent-session-inventory.json`, compute the org totals, validate
the result against the schema, and flag drift between `repos.json` and the
live FreeForCharity org listing.

## Context

The agent session inventory is the observability backbone of the FFC Agentic
OS (see `docs/agentic-os/`). It is produced by fanning out `session-archivist`
workers over batches of repos and merging their fragments here. The merged
snapshot is rendered on `/agentic-os/session-inventory` and validated by
`__tests__/agentic-os-data.test.ts`.

ffcadmin.org is a snapshot-only plane: this agent runs when invoked (typically
by the `/session-inventory-refresh` skill), never on a schedule.

## Instructions

### 1. Collect fragments

Gather the JSON arrays returned by each session-archivist batch. Confirm every
repo in the master list appears exactly once across all fragments; a missing
repo means a worker failed — re-run that batch or add the repo with
`surveyStatus: "unreachable"` rather than dropping it.

### 2. Merge and compute totals

- Concatenate the fragments and sort `repos` by `name`.
- Compute `orgTotals`:
  - `repos` = number of entries
  - `reposWithSessions` = entries where `claude.total + copilot.total > 0`
  - `claudePrs` = sum of `claude.total`
  - `copilotPrs` = sum of `copilot.total`
  - `totalSessions` = `claudePrs + copilotPrs`
- Set `generatedAt` to the current UTC timestamp and update `window.to` to
  today's date. `schemaVersion` and `method` stay as-is unless the procedure
  itself changed.

### 3. Validate

```bash
pnpm jest agentic-os-data
```

The schema test doubles as the validator (entry counts, category ids, totals
arithmetic, `surveyStatus` enum). Fix data — never the test — when it fails.

### 4. Audit repos.json drift

Compare the snapshot's repo list against `repos.json` and against the live org
listing (`https://github.com/orgs/FreeForCharity/repositories?type=source`).
Report repos that are new, renamed, archived, or deleted, and update
`repos.json` so both files agree.

### 5. Refresh freshness stamps

Update the `## 🗓️ Freshness` blocks in `docs/agentic-os/*.md` that reference
the inventory: set **Last verified** to today and **Re-verify by** to 90 days
out, per the `docs/standards/README.md` convention.

## Expected Output

- Updated `public/data/agent-session-inventory.json` (sorted, totals computed,
  schema-valid).
- Updated `repos.json` when drift was found.
- A short markdown report: org totals, top-5 repos by sessions, repos with
  `surveyStatus != "ok"`, and any repos.json drift corrected.

## Notes

- This agent is the merge/validate half of the pair; `session-archivist` does
  the per-repo enumeration.
- This pair plus the two agentic-os skills are the reference implementation
  that FFC-IN-AI-Management distributes org-wide (roadmap Phase 1 in
  `docs/agentic-os/05-roadmap.md`).
