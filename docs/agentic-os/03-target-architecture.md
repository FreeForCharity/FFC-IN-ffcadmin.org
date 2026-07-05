# Target architecture — five planes × six layers

## 🗓️ Freshness

| Field           | Value                               |
| --------------- | ----------------------------------- |
| Status          | 🟡 snapshot (verify before relying) |
| Last verified   | 2026-07-05                          |
| Re-verify by    | 2026-10-05                          |
| Source of truth | The five plane repos linked below   |

**How to refresh:** verify each plane repo still plays the stated role, correct
drift, update this block.

---

## The five planes

The FFC Agentic OS is not a new system — it is five existing repos playing
distinct, non-overlapping roles:

| Plane                    | Repo                                                                                                   | Responsibility                                                                                                                                                            | Must NOT do                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Control**              | [FFC-IN-AI-Management](https://github.com/FreeForCharity/FFC-IN-AI-Management)                         | Source of truth for agent configuration (CLAUDE.md, AGENTS.md, GEMINI.md, `.claude/`, Copilot/Gemini configs); base + overlay templates synced to ~30 repos across 3 orgs | Run site builds or live ops                         |
| **Observability & docs** | [FFC-IN-ffcadmin.org](https://github.com/FreeForCharity/FFC-IN-ffcadmin.org) (this repo)               | Publish committed snapshots: session inventory, blueprint docs, dashboards, standards                                                                                     | Live-scan or run workflows against other repos      |
| **Ops**                  | [FFC-Cloudflare-Automation](https://github.com/FreeForCharity/FFC-Cloudflare-Automation)               | The numbered workflow catalog driving Cloudflare/WHMCS/M365 writes behind approval gates and dry-runs                                                                     | Hold agent instruction configs (that's Control)     |
| **Distribution**         | [FFC-IN-FFC_Single_Page_Template](https://github.com/FreeForCharity/FFC-IN-FFC_Single_Page_Template)   | The template every FFC-EX-* site is created from; improvements propagate at creation time                                                                                 | Diverge from Control's agent-config baseline        |
| **Autonomous loop**      | [FFC-IN-google_antigravity_agents](https://github.com/FreeForCharity/FFC-IN-google_antigravity_agents) | Closed-loop Gemini reviewer/coder across org repos, complementing supervised Claude sessions                                                                              | Merge its own PRs (no-self-merge applies to it too) |

Everything else — the ~40 `FFC-EX-*` charity sites, the internal sites — are
**workload repos** the planes serve.

## The layer × plane matrix

| Layer               | Control (AI-Mgmt)             | Obs/Docs (ffcadmin)                             | Ops (CF-Automation)                | Distribution (Template)     | Autonomous (Antigravity) |
| ------------------- | ----------------------------- | ----------------------------------------------- | ---------------------------------- | --------------------------- | ------------------------ |
| 1 Connections (MCP) | Owns the MCP baseline         | Documents it                                    | Consumes (CF/M365 APIs)            | Ships baseline to new sites | Gemini API               |
| 2 Memory & context  | Owns instruction files        | Snapshot docs + PR-trail index                  | Workflow docs                      | Template CLAUDE.md          | Its own prompts          |
| 3 Agents            | Distributes agent definitions | Reference agents (archivist, auditor)           | —                                  | Site-focused agent subset   | Reviewer + coder agents  |
| 4 Orchestration     | Sync scripts                  | Skills (fan-out procedures)                     | Numbered workflows, approval gates | Repo-creation automation    | Its run loop             |
| 5 Governance        | Config as policy              | Governance doc, standards conventions           | Dry-run defaults, typed confirms   | Branch protection defaults  | Scoped write access      |
| 6 Observability     | Config inventory              | **Session inventory, dashboards, status skill** | Run logs, generated catalogs       | CI budgets                  | Status dashboard         |

## Distribution flow

```text
FFC-IN-AI-Management (control)
  └─ base + overlay templates ──sync──▶ all managed repos (.claude/, AGENTS.md, …)
FFC-IN-FFC_Single_Page_Template (distribution)
  └─ repo-from-template ──creates──▶ new FFC-EX-* charity sites (born with the toolkit)
FFC-IN-ffcadmin.org (observability)
  ◀── committed snapshots (inventory JSON, standards docs) — manual/skill refresh only
FFC-Cloudflare-Automation (ops)
  ──publishes──▶ data feeds (sites list, workflow catalog) that ffcadmin syncs
```

Phase 2 upgrades the sync mechanism from PowerShell file-copy to a Claude Code
**plugin marketplace** (one versioned install instead of N copied files) — see
[05-roadmap](./05-roadmap.md).

## Boundary rules (the ones that keep this safe)

1. **ffcadmin snapshots, never scans.** Restated from
   [docs/standards/README.md](../standards/README.md); the inventory refresh is
   a manual skill for exactly this reason.
2. **One source of truth per artifact.** Agent configs: AI-Management.
   Workflow catalog: CF-Automation. Session inventory: this repo's JSON.
   When copies disagree, the owner wins.
3. **Writes live behind the ops plane's gates.** Agents that need to mutate
   external systems (DNS, M365, WHMCS) go through the numbered workflows with
   dry-run defaults — never direct API access from a coding session.
