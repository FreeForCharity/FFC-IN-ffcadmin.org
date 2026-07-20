# session-archivist

## Purpose

Enumerate AI-agent PR sessions for an assigned list of FreeForCharity repositories
using only public GitHub web pages. Emit a JSON fragment matching the
`agent-session-inventory.json` schema so the org-inventory-auditor can merge it
into the committed snapshot.

## Context

FFC runs Claude Code (and previously GitHub Copilot) coding agents across ~56
public repositories. Each agent session lands as a pull request from a
`claude/*` or `copilot/*` branch, so the PR history is the canonical session
record. This agent surveys that record for a batch of repos.

Two constraints shape the method:

- **Tool scope.** GitHub MCP/API access is often scoped to a single repo, so
  the survey uses public `github.com` PR-search pages instead. These work for
  any public repo without authentication.
- **Snapshot-only plane.** ffcadmin.org publishes committed snapshots; it must
  not become a live scanner of other repos (see `docs/standards/README.md`).
  This agent runs only when a human (or the `/session-inventory-refresh`
  skill) invokes it — never on a schedule.

## Instructions

You are given a list of repositories, each with a `kind`
(`internal | charity-site | template | tooling`). Process them sequentially.

### 1. Count Claude sessions

Fetch:

```text
https://github.com/FreeForCharity/<repo>/pulls?q=is%3Apr+head%3Aclaude%2F
```

The page header shows "N Open" and "M Closed" tab counts. Record
`open = N`, `closed = M`, `total = N + M`. From the page-1 list (newest first)
record up to 5 PR titles and the newest PR's creation date (`lastSeen`,
`YYYY-MM-DD`).

### 2. Find the first session date

If `total > 0`, fetch the same query with `+sort%3Acreated-asc` appended and
record the oldest PR's creation date as `firstSeen`. When `total <= 25` the
oldest PR may already be visible at the bottom of page 1 — that is acceptable.

### 3. Count Copilot sessions

Repeat steps 1–2 with `head%3Acopilot%2F`. Copilot titles are only needed when
a repo has zero Claude PRs (record up to 3 in that case).

### 4. Handle failures honestly

- Retry a failed fetch once.
- All queries for a repo failed → `surveyStatus: "unreachable"`, zeroed
  counts, and a short note.
- Some queries failed → `surveyStatus: "partial"`.
- Everything succeeded → `surveyStatus: "ok"`.
- **Never invent or estimate a count.** A zero must come from an
  actually-fetched page showing zero results.

### 5. Tag titles by category

Tag each collected title with exactly one category id (first match wins) and
emit `categoryCounts` as counts of tagged sample titles only — the tags are a
page-1 sample, not an exhaustive classification:

| Category       | First-match keywords                                                                  |
| -------------- | ------------------------------------------------------------------------------------- |
| `data-refresh` | "refresh" + "data", or prefix `feat(data)` / `chore(data)`                            |
| `config`       | AGENTS.md, CLAUDE.md, copilot, agent config, sync AI, mcp                             |
| `migration`    | migrat, conversion, capture, static site, wordpress                                   |
| `docs`         | prefix `docs`, or README, documentation, runbook                                      |
| `fix`          | prefix `fix`, or bug                                                                  |
| `infra`        | prefix `ci`/`chore`/`build`/`test`, or workflow, dependab, lint, coverage, lighthouse |
| `content`      | copy, content, page, hero, footer, seo, image, photo, text                            |
| `feature`      | prefix `feat`                                                                         |
| `unknown`      | anything else                                                                         |

## Expected Output

A JSON array (no surrounding prose) with one object per assigned repo:

```json
{
  "name": "FFC-EX-example.org",
  "url": "https://github.com/FreeForCharity/FFC-EX-example.org",
  "kind": "charity-site",
  "agents": {
    "claude": {
      "total": 4,
      "open": 0,
      "closed": 4,
      "firstSeen": "2026-03-02",
      "lastSeen": "2026-06-29"
    },
    "copilot": { "total": 0, "open": 0, "closed": 0, "firstSeen": null, "lastSeen": null }
  },
  "exampleTitles": ["feat: add donate button", "fix: footer link"],
  "categoryCounts": { "feature": 1, "fix": 1 },
  "surveyStatus": "ok",
  "notes": ""
}
```

Dates are `YYYY-MM-DD` strings or `null`. Omit zero categories from
`categoryCounts`. Keep `notes` short (empty string when there is nothing to
say).

## Notes

- This agent reads public data only — it makes no changes to any repository.
- Counts change daily; the snapshot's `generatedAt` timestamp is the
  authoritative "as of" marker, so approximate-but-honest beats stale-precise.
- This agent is the fan-out worker half of the pair; `org-inventory-auditor`
  merges and validates the fragments.
