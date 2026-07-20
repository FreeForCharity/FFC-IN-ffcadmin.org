# Autonomy — the ladder from supervised sessions to a working "Jarvis"

## 🗓️ Freshness

| Field           | Value                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Status          | 🟡 snapshot (verify before relying)                                                                                                 |
| Last verified   | 2026-07-20                                                                                                                          |
| Re-verify by    | 2026-10-18                                                                                                                          |
| Source of truth | The Conductor log (FFC-Cloudflare-Automation #719), tracking issue #574, `.claude/skills/ops-concierge/SKILL.md`, hub umbrella #724 |

**How to refresh:** check the Conductor log and tracking issue for what
actually runs, update rung statuses, correct drift.

---

The popular mental model for this is Iron Man's Jarvis. Stripped to
engineering, a Jarvis is two things:

1. A **sense → decide → act → report loop** that runs without a human
   starting it, and
2. A **conversational dispatch point** — you ask for something, the right
   agent does it, you get an answer.

Neither requires new infrastructure at FFC. Every rung below reuses assets
the Agentic OS already has; what changes per rung is _who initiates_ and _how
much the agent may do before a human sees it_.

## Funding model: Max subscription only (no API)

FFC's standing decision: agent work is funded by the **Claude Max
subscription**, never the pay-per-token Anthropic API. Every rung below is
achievable with Anthropic's first-party subscription tooling:

| Need                       | Max-subscription mechanism                                                                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Interactive + remote work  | Claude Code CLI and Claude Code on the web (<https://claude.ai/code>) — included in Max, one shared usage pool                                                                                               |
| Scheduled unattended runs  | **Routines** (cron ≥ 1 hour, a per-routine HTTP trigger endpoint — a subscription-funded Routines feature, not Anthropic API billing — or GitHub triggers) — 15 runs/day on Max; requires subscription login |
| Event-driven automation    | **Routine GitHub triggers** — PR and Release events with author/branch/label/regex filters (Claude GitHub App per repo)                                                                                      |
| `@claude` comment mentions | `anthropics/claude-code-action` authenticated with **`CLAUDE_CODE_OAUTH_TOKEN`** from `claude setup-token` (Pro/Max supported)                                                                               |

**Off-limits (these are API-billed or ToS-prohibited — do not adopt):** Agent
SDK server deployments; Bedrock/Vertex/Foundry; feeding a subscription OAuth
token to any third-party runner (only Anthropic's own action/Routines may use
it); and **metered overage / usage credits** — that is pay-per-token billing,
keep it disabled so a busy day degrades to "wait for the window" instead of a
bill. Budgets under this model are **session and run counts** (daily Routine
caps, 5-hour windows, weekly caps), not tokens; seats cannot be pooled, so
plan per-account.

_Routines and Claude Code on the web are research preview — caps and trigger
types may change; re-verify at this doc's freshness date. If Anthropic adds an
issue-comment Routine trigger, Routines could absorb the `@claude` use case
and the action would no longer be needed._

## The autonomy ladder

| Rung | Name                       | Initiator                                                     | Status                                                        | Gate to climb                                                                                                                                    |
| ---- | -------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| L0   | Supervised sessions        | Human, per task                                               | ✅ How the 879 inventoried sessions ran                       | —                                                                                                                                                |
| L1   | Scheduled sense/act/report | Cron / Conductor loop                                         | 🟢 **Operating: the hub Conductor** (+ manual /ops-concierge) | —                                                                                                                                                |
| L2   | Event-driven entry         | GitHub PR/Release events, or `@claude` mention on an issue/PR | 📋 Prepared, not activated                                    | You: install the Claude GitHub App (Routine triggers) and/or `claude setup-token` → `CLAUDE_CODE_OAUTH_TOKEN` secret (mentions); see setup below |
| L3   | Cross-repo fleet           | Schedule + events, org-wide                                   | 🟡 Emerging via the hub (#724 migration umbrella)             | Dedicated automation account (roadmap: FFC-Cloudflare-Automation issue)                                                                          |
| L4   | Full concierge ("Jarvis")  | Anyone: intake forms, site owners, admins                     | 🔭 Vision                                                     | L2 + L3 + reflection loop (Phase 3)                                                                                                              |

### L1 — operating today: the Conductor, plus the manual Ops Concierge

The org's live L1 system is the **Conductor loop** in the
FFC-Cloudflare-Automation hub: it grooms the `agentic-os` backlog, logs every
run to issue #719, and workflow 502 publishes the daily
`agentic-os-status.json` feed rendered at `/agentic-os` (hub #732 + ffcadmin
PR #654). That is the sense → decide → act → report loop, running.

[`/ops-concierge`](../../.claude/skills/ops-concierge/SKILL.md) is its
**manual, ffcadmin-local complement**: the same loop over this repo's own
feeds (`sites-alerts.json`, `domain-expiry.json`, `ci-status.json`, snapshot
freshness), issue-only writes, run summaries on tracking issue #574. A daily
unattended Routine for it was designed and **deliberately not armed** — two
autonomous systems filing overlapping issues is worse than one — and stays
un-armed until it is reconciled with the Conductor under hub umbrella #724
(either the Conductor absorbs its triage table, or the Routine is scoped to
what the Conductor doesn't watch).

### L2 — event-driven entry (subscription-funded, two mechanisms)

The dispatch half of Jarvis, on the Max subscription. Prepared but **not
activated** — both mechanisms need setup only a human admin can do:

**Mechanism A — Routine GitHub triggers** (for PR and Release events): install
the Claude GitHub App on the repo, then create a Routine at
<https://claude.ai/code> →
Routines with a GitHub trigger (filter by author, branch, labels, draft state,
or regex). Covers PR-review, label-gated, and release automation with no
workflow file and no secret at all. Limits: PR/Release events only (no
issue-comment trigger yet), 15 routine runs/day on Max.

**Mechanism B — `@claude` comment mentions** (the gap A doesn't cover):
`anthropics/claude-code-action@v1` authenticated with the **subscription**,
not an API key:

1. As the automation account, run `claude setup-token` locally and store the
   result as the `CLAUDE_CODE_OAUTH_TOKEN` repository secret (never
   `ANTHROPIC_API_KEY` — FFC does not use API billing). The token is handled
   under governance rule 4 like any secret, and needs periodic re-generation.
2. Add the `claude.yml` workflow using the action with that token; keep the
   default mention trigger, set `--max-turns` and a workflow timeout as
   runaway guards (they protect the shared subscription usage pool).
3. Skip action features that require an API key (e.g., inline-comment
   classification) — they stay off under the no-API rule.
4. Scope to this repo first; template-repo rollout is the Phase 2 item and
   should wait for the automation-account identity.

Usage from both mechanisms draws down the same subscription pool as
interactive sessions — see Cost bounds below.

### L3 — the fleet (org-wide, automation-account identity)

The same concierge pattern pointed at all 56 repos — but unattended cross-repo
writes under a volunteer's personal account violate governance rule 5. Under
the Max-only model, the automation account is a **dedicated, single-owner Claude
account** (e.g., automation@freeforcharity.org) with its own GitHub identity,
used exclusively through Anthropic's first-party tooling (Routines,
claude-code-action via its own setup-token). Cautions: never share its login
between people (prohibited account sharing), keep volumes within ordinary use,
and **confirm the arrangement with Anthropic in writing before scaling** — a
role account on a consumer plan is a ToS gray area, and a Team/Enterprise seat
is the cleaner alternative if FFC outgrows it. The charity-site maintenance
sweep (roadmap) becomes the fleet's work-feeder.

### L4 — the vision

With L2 + L3 live and the Phase 3 reflection loop mining merged agent PRs
back into instruction files, the composite behaves like the movie version:
charity intake gets triaged on arrival, site owners ask for edits in plain
English and get PRs, domains never lapse silently, and every action is still
an auditable issue/PR a human approved. The "voice" is push/email today;
Teams/M365 chat is possible later (the ms365 connector requires interactive
authorization before any of that can be wired).

## Identity policy for unattended runs (governance rule 5)

Rule 5 requires unattended runs to use a dedicated identity. **No
personal-identity Routine is currently armed.** If the ops-concierge Routine
is ever armed before the automation account exists, it runs as a documented
pilot exception bounded to:

| Allowed while on personal identity                            | Gated on the automation account   |
| ------------------------------------------------------------- | --------------------------------- |
| Reading published feeds and this repo                         | Anything cross-repo               |
| Creating/updating/closing `ops-concierge` issues in this repo | Triggering write workflows        |
| Posting run summaries + notifications                         | claude-code-action on other repos |

Exit criteria for any such exception: the automation account exists →
recreate the Routine under it → remove the exception note.

## Cost bounds (subscription math, not token budgets)

Everything — interactive sessions, web sessions, Routines, action runs,
subagents — draws one shared pool per Max account (5-hour rolling windows plus
weekly caps), and Routines add a hard **15 runs/day** ceiling on Max. Practical
rules: one concierge-style run per day per repo scope; `--max-turns` and
workflow timeouts as runaway guards on action runs; the 10-issue circuit
breaker on sweeps; **overage/usage credits stay disabled** so exhaustion means
waiting, never a per-token bill. If L3 scale exhausts one account's pool, the
answer is a second dedicated account or a Team seat — not the API.
