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

## The autonomy ladder

| Rung | Name                       | Initiator                                 | Status                                                        | Gate to climb                                                                 |
| ---- | -------------------------- | ----------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| L0   | Supervised sessions        | Human, per task                           | ✅ How the 879 inventoried sessions ran                       | —                                                                             |
| L1   | Scheduled sense/act/report | Cron / Conductor loop                     | 🟢 **Operating: the hub Conductor** (+ manual /ops-concierge) | —                                                                             |
| L2   | Event-driven conversation  | `@claude` mention on an issue/PR          | 📋 Prepared, not activated                                    | You: install the Claude GitHub app / add `ANTHROPIC_API_KEY`; see setup below |
| L3   | Cross-repo fleet           | Schedule + events, org-wide               | 🟡 Emerging via the hub (#724 migration umbrella)             | Dedicated bot/GitHub-App identity (roadmap: FFC-Cloudflare-Automation issue)  |
| L4   | Full concierge ("Jarvis")  | Anyone: intake forms, site owners, admins | 🔭 Vision                                                     | L2 + L3 + reflection loop (Phase 3)                                           |

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

### L2 — conversational entry (`@claude` on GitHub)

The dispatch half of Jarvis: anyone comments `@claude fix the footer link on
the volunteer page` on an issue, and an agent session answers with a PR.
Prepared but **not activated** — it needs credentials only a human admin holds:

1. Run `/install-github-app` from an interactive Claude Code session on this
   repo (or install the Claude GitHub app manually), which adds the
   `ANTHROPIC_API_KEY` secret and a `claude.yml` workflow using
   `anthropics/claude-code-action@v1`.
2. Keep the default mention trigger; set `--max-turns` and a workflow timeout
   (governance cost guardrails).
3. Scope it to this repo first; template-repo rollout is the Phase 2 item
   ("Evaluate claude-code-action for @claude mentions") and should wait for
   the bot identity.

### L3 — the fleet (org-wide, bot identity)

The same concierge pattern pointed at all 56 repos — but unattended cross-repo
writes under a personal account violate governance rule 5. The gate is the
Phase 2 roadmap item: create the FFC bot/GitHub-App identity
(FFC-Cloudflare-Automation), then move the Routine and any claude-code-action
installs onto it. The charity-site maintenance sweep (roadmap) becomes the
fleet's work-feeder.

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
is ever armed before the bot identity exists, it runs as a documented pilot
exception bounded to:

| Allowed while on personal identity                            | Gated on the bot identity         |
| ------------------------------------------------------------- | --------------------------------- |
| Reading published feeds and this repo                         | Anything cross-repo               |
| Creating/updating/closing `ops-concierge` issues in this repo | Triggering write workflows        |
| Posting run summaries + notifications                         | claude-code-action on other repos |

Exit criteria for any such exception: the bot identity exists → recreate the
Routine under it → remove the exception note.

## Cost bounds

One fresh session per day, single-repo scope, issue-only writes, 10-issue
circuit breaker. If the run count or scope grows (L3), adopt the Phase 3
budget guidance (max-turns caps, concurrency limits) before scaling.
