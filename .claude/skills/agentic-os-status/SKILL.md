---
name: agentic-os-status
description: Read-only health check of the FFC Agentic OS documentation and data - reports stale freshness blocks, snapshot age, repos.json drift, and overdue roadmap items. Use when asked "how is the agentic OS doing" or before planning agentic-os work.
---

# Agentic OS status

A read-only status report over the Agentic OS surfaces in this repo. Makes no
changes; safe to run any time.

## Procedure

### 1. Snapshot age

Read `public/data/agent-session-inventory.json`. Report `generatedAt`, the
survey `window`, `orgTotals`, and whether the snapshot is stale (older than
90 days), mirroring the `isStale` logic in `src/lib/agenticOsData.ts`. List
any repos with `surveyStatus` other than `"ok"`.

### 2. Doc freshness

For every `docs/agentic-os/*.md`, read the `## 🗓️ Freshness` block and flag
files whose **Re-verify by** date is past (treat those as stale per
`docs/standards/README.md`).

### 3. Registry drift

Compare `repos.json` against the snapshot's `repos[]` names. Optionally fetch
`https://github.com/orgs/FreeForCharity/repositories?type=source` to compare
both against the live org listing. Report additions/removals/renames.

### 4. Roadmap check

Read `docs/agentic-os/05-roadmap.md` and report each phase's status and any
items whose target dates have passed.

## Expected Output

A markdown status table:

```markdown
## Agentic OS status — YYYY-MM-DD

| Surface                    | Status | Detail                        |
| -------------------------- | ------ | ----------------------------- |
| Session inventory snapshot | 🟢/🔴  | generated N days ago          |
| docs/agentic-os freshness  | 🟢/🔴  | X of Y docs past re-verify-by |
| repos.json vs snapshot     | 🟢/🔴  | drift list                    |
| Roadmap                    | 🟢/🟡  | current phase, overdue items  |
```

Recommend `/session-inventory-refresh` when the snapshot or docs are stale.
