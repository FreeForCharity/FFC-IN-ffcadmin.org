# Gap analysis — current vs. target

## 🗓️ Freshness

| Field           | Value                                              |
| --------------- | -------------------------------------------------- |
| Status          | 🟡 snapshot (verify before relying)                |
| Last verified   | 2026-07-20                                         |
| Re-verify by    | 2026-10-18                                         |
| Source of truth | The plane repos and the session inventory snapshot |

**How to refresh:** re-verify each row's "current" cell against the owning
repo; close rows the roadmap has delivered.

---

Severity: 🔴 blocks scaling · 🟠 causes rework/risk · 🟡 quality-of-life.
Effort: S (< 1 session) · M (a few sessions) · L (multi-repo program).

| #   | Layer          | Gap                                                                                                                                                | Severity | Effort | Closed by |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | --------- |
| 1   | Observability  | ~~No org-wide record of agent sessions~~ — **closed by this PR** (879 sessions inventoried, dashboard + JSON)                                      | 🔴       | M      | Phase 0   |
| 2   | Memory/context | ~~repos.json stale (21 of 56 repos)~~ — **closed by this PR**                                                                                      | 🟠       | S      | Phase 0   |
| 3   | Agents         | The new archivist/auditor agents + agentic-os skills exist only in this repo                                                                       | 🟠       | M      | Phase 1   |
| 4   | Orchestration  | Config sync is PowerShell file-copy; no versioned plugin marketplace, so drift between repos is invisible                                          | 🟠       | L      | Phase 2   |
| 5   | Orchestration  | No event-driven agent runs (Routine GitHub triggers / subscription-auth claude-code-action); every session is manually initiated                   | 🟡       | M      | Phase 2   |
| 6   | Governance     | Governance was implicit (scattered across settings.json, runbooks); now written but not yet adopted org-wide                                       | 🟠       | M      | Phase 1–2 |
| 7   | Governance     | No dedicated automation account (single-owner Max account / Team seat) for unattended runs; automation would run as a volunteer's personal account | 🟠       | M      | Phase 2   |
| 8   | Observability  | 24 of 56 repos show zero agent sessions — no maintenance loop touches them (stale content, unpatched template drift)                               | 🟠       | L      | Phase 2–3 |
| 9   | Memory/context | No reflection loop: lessons from 879 sessions aren't mined back into CLAUDE.md/agent prompts                                                       | 🟡       | M      | Phase 3   |
| 10  | Connections    | MCP baseline defined per-repo, not org-versioned; server list drifts                                                                               | 🟡       | M      | Phase 1   |
| 11  | Agents         | Antigravity loop and Claude sessions don't share the inventory — autonomous runs are invisible to the dashboard                                    | 🟡       | M      | Phase 3   |
| 12  | Observability  | No session/run budgets on agent runs (subscription capacity: Routine runs/day, sessions per window); usage is bounded only by human attention      | 🟡       | S      | Phase 3   |

The numbered gaps map to concrete actions in [05-roadmap](./05-roadmap.md).
