# Roadmap — from inventory to operating system

## 🗓️ Freshness

| Field           | Value                                              |
| --------------- | -------------------------------------------------- |
| Status          | 🟡 snapshot (verify before relying)                |
| Last verified   | 2026-07-20                                         |
| Re-verify by    | 2026-10-18                                         |
| Source of truth | The issues filed from the table below, once opened |

**How to refresh:** mark delivered items, link the real issue numbers, update
this block.

---

## Phase 0 — Capture _(delivered by this PR)_

- Exhaustive 56-repo session inventory (879 sessions) as committed JSON +
  dashboard at `/agentic-os/session-inventory`.
- Blueprint docs (this directory), public pages, refreshed `repos.json`.
- Reference implementation: `session-archivist` / `org-inventory-auditor`
  agents and `/session-inventory-refresh` / `/agentic-os-status` skills.

## Phase 1 — Distribute (control plane)

Goal: what exists here becomes org standard, owned by FFC-IN-AI-Management.
Closes gaps 3, 6 (adoption), 10.

## Phase 2 — Automate (distribution + ops planes)

Goal: new repos are born with the toolkit; recurring work stops needing a
human to open a session. Closes gaps 4, 5, 7, 8.

**Progress (as of 2026-07-20):** the hub-led Agentic OS program shipped its
observability slice independently — the **Conductor loop** runs from
FFC-Cloudflare-Automation (log issue #719, migration umbrella #724), the
visibility epic (hub #723) is complete via workflow 502's daily
`agentic-os-status.json` feed (hub #732) rendered at `/agentic-os` (ffcadmin
PR #654). The `/ops-concierge` skill remains **manual-only**: its planned
unattended Routine was deliberately not armed to avoid duplicating the
Conductor's loop — see [07-autonomy.md](./07-autonomy.md).

Filed issues in this repo: [#572](https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/issues/572)
(quarterly refresh + reflection), [#573](https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/issues/573)
(cost/turn budgets), [#574](https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/issues/574)
(ops-concierge tracking).

## Phase 3 — Operate (observability plane)

Goal: the OS as routine operations with feedback loops. Closes gaps 9, 11, 12.

## Issues to file (per repo)

These are **listed, not filed** — filing them is the first Phase 1 action, done
from each owning repo. Labels suggested: `agentic-os`, plus phase.

| Repo                             | Issue title                                                      | Body summary                                                                                                                                                                                                      | Phase |
| -------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| FFC-IN-AI-Management             | Adopt agentic-os reference agents and skills into base templates | Template `session-archivist.md`, `org-inventory-auditor.md`, and the two skills from FFC-IN-ffcadmin.org into the base+overlay model; sync org-wide. Cross-link `docs/agentic-os/` as the architecture reference. | 1     |
| FFC-IN-AI-Management             | Version the MCP server baseline                                  | Single org-versioned MCP config (GitHub, Cloudflare, Playwright, Sentry, MS Learn) in the base template instead of per-repo copies.                                                                               | 1     |
| FFC-IN-AI-Management             | Adopt the org governance model                                   | Review/adopt `docs/agentic-os/06-governance.md`; add it (or a pointer) to the synced AGENTS.md baseline.                                                                                                          | 1     |
| FFC-IN-AI-Management             | Evaluate plugin-marketplace distribution                         | Prototype `.claude-plugin/marketplace.json` + `extraKnownMarketplaces` as the replacement for file-copy sync; keep PowerShell sync until parity.                                                                  | 2     |
| FFC-IN-FFC_Single_Page_Template  | Ship the agent toolkit in the template                           | New charity sites should be born with `.claude/` (agents subset, settings), AGENTS.md, and the CI budgets — so the 24 zero-session repos stop accumulating.                                                       | 2     |
| FFC-IN-FFC_Single_Page_Template  | Evaluate claude-code-action for @claude mentions                 | Site owners could request edits by mentioning the agent on an issue; needs the bot identity first.                                                                                                                | 2     |
| FFC-Cloudflare-Automation        | Create the FFC bot/GitHub-App identity                           | Dedicated identity for unattended agent runs (survives volunteer turnover, clean audit trail); wire into existing approval-gated environments.                                                                    | 2     |
| FFC-Cloudflare-Automation        | Charity-site maintenance sweep workflow                          | A numbered, read-first workflow that lists FFC-EX-* repos with stale deps/template drift and opens issues — feeding agents work instead of scanning from ffcadmin.                                                | 2     |
| FFC-IN-google_antigravity_agents | Report autonomous runs into the session inventory                | Emit a per-repo run summary the inventory schema can ingest (new `agents.antigravity` key, schemaVersion 2).                                                                                                      | 3     |
| FFC-IN-ffcadmin.org              | Quarterly inventory refresh + reflection session                 | Run `/session-inventory-refresh`; mine the quarter's merged agent PRs for recurring corrections; PR the CLAUDE.md/agent-prompt updates.                                                                           | 3     |
| FFC-IN-ffcadmin.org              | Add cost/turn budget guidance to governance                      | Document `--max-turns`, workflow timeouts, concurrency caps once automated runs exist.                                                                                                                            | 3     |

## Sequencing note

Phase 1 is deliberately just "copy what already works into the control plane" —
small, safe, high-leverage. Phase 2's bot identity is the gate for everything
event-driven; do it before claude-code-action. Phase 3 only matters once
Phases 1–2 generate enough automated activity to observe.
