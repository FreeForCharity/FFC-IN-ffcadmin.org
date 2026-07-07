---
name: ops-concierge
description: Autonomous daily ops sweep - fetch FFC's published health feeds (site alerts, domain expiry, CI status), triage against policy, file or update GitHub issues in THIS repo only, and post a run summary on the pilot tracking issue. Issue-only writes; safe to run unattended or manually.
---

# Ops Concierge

The FFC Agentic OS autonomy pilot (L1 on the autonomy ladder — see
`docs/agentic-os/07-autonomy.md`). One sense → decide → act → report loop,
scoped so tightly it cannot do damage: it reads published feeds and writes
**GitHub issues in FFC-IN-ffcadmin.org only**.

## Hard guardrails (read first)

- **Issue-only writes.** Never edit code, never commit or push, never touch
  another repo, never call an external write API. Remediation belongs to
  humans and the gated ops workflows.
- **Dedupe before create.** Never open a duplicate of an open
  `ops-concierge` issue; comment on the existing one instead.
- **Circuit breaker: max 10 new issues per run.** More than 10 actionable
  findings almost certainly means a feed is malformed — stop and report that
  on the tracking issue instead.
- **No guessing.** If a feed is unreachable after one retry, report the fetch
  failure in the run summary; do not infer what it might have said.

## Procedure

### 1. Sense

Fetch the live published feeds (production URLs, not local files):

- `https://ffcadmin.org/data/sites-alerts.json` — site health + expiry alerts
- `https://ffcadmin.org/data/domain-expiry.json` — full domain expiration data
- `https://ffcadmin.org/data/ci-status.json` — CI state on main

Then check local snapshot freshness: `public/data/agent-session-inventory.json`
`generatedAt` (stale past 90 days) and each `docs/agentic-os/*.md`
**Re-verify by** date.

### 2. Decide (triage policy)

| Finding                                                            | Severity | Action       |
| ------------------------------------------------------------------ | -------- | ------------ |
| `sites-alerts` entry with severity `high` (site error/unreachable) | high     | Issue        |
| Domain expired or `daysRemaining` ≤ 30                             | high     | Issue        |
| Domain `daysRemaining` 31–60                                       | medium   | Issue        |
| CI workflow on main with conclusion `failure`                      | medium   | Issue        |
| Inventory snapshot or agentic-os doc past its re-verify date       | low      | Issue        |
| Anything else notable (yellow-zone expiry, seed data, etc.)        | info     | Summary only |

### 3. Act (issue-only)

For each actionable finding, in **FreeForCharity/FFC-IN-ffcadmin.org** only:

1. Search open issues labeled `ops-concierge` for the same subject (match on
   domain/workflow/doc name in the title).
2. **Exists** → add a comment only if something changed (severity, days
   remaining, new evidence); otherwise leave it alone.
3. **New** → create an issue titled `[ops-concierge] <short finding>`, labeled
   `ops-concierge` + `agentic-os`, body containing: what was observed, the
   feed value and its `generatedAt`, the suggested next step (e.g., "renew via
   the domain workflow in FFC-Cloudflare-Automation — human/gated action"),
   and a line noting it was filed by the autonomous concierge run.
4. If a previously-reported finding is now resolved in the feeds, comment
   that on its issue and close it.

### 4. Report

Post one run-summary comment on the pilot tracking issue (the open issue
titled `[ops-concierge] Autonomy pilot — tracking issue`):

```markdown
## Concierge run — YYYY-MM-DD

- Feeds: sites-alerts ✅ / domain-expiry ✅ / ci-status ✅ (note any failures)
- Findings: N actionable (X new issues, Y updated, Z closed), M info-only
- New/updated: #123, #124
- All clear: <yes/no + one-line headline>
```

Keep it short — this comment plus the Routine's push/email notification is
the "Jarvis morning report."

## Notes

- Runs unattended via the daily "FFC Ops Concierge" Routine (identity pilot
  exception documented in `docs/agentic-os/06-governance.md`; kill switch on
  the tracking issue) — or manually any time via `/ops-concierge`.
- This skill deliberately does not violate the snapshot-only plane rule: the
  feeds it reads are published BY this repo's own data pipeline, and its only
  writes are issues in this repo.
