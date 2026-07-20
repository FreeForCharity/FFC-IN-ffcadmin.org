# Governance — running agents in a volunteer 501(c)(3)

## 🗓️ Freshness

| Field           | Value                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| Status          | 🟡 snapshot (verify before relying)                                          |
| Last verified   | 2026-07-20                                                                   |
| Re-verify by    | 2026-10-18                                                                   |
| Source of truth | `.claude/settings.json`, `docs/agent-issue-pr-workflow.md`, `.claude/rules/` |

**How to refresh:** confirm each rule still matches the enforcing artifact
(settings, runbooks, branch protection), correct drift, update this block.

---

FFC's constraint is unusual: the operators are volunteers with limited hours,
and the org's credibility with the charities it serves depends on every change
being explainable. The governance model optimizes for **auditability at
volunteer-sized effort**, not maximum automation.

## Roles

| Role               | Who                               | Authority over agents                                       |
| ------------------ | --------------------------------- | ----------------------------------------------------------- |
| Global Admin       | FFC core (verified admins)        | Approves write-workflow runs, owns bot identity and secrets |
| Maintainer         | Trusted volunteers per repo       | Reviews and merges agent PRs; can initiate agent sessions   |
| Contributor        | Any volunteer                     | Runs agent sessions on branches; cannot merge               |
| Agent (supervised) | Claude Code / Copilot sessions    | Proposes changes as PRs only                                |
| Agent (autonomous) | Antigravity loop, future routines | Same PR-only rule, plus explicit scope and identity (below) |

## The seven rules

1. **Every agent change is a pull request.** No agent pushes to `main`. The PR
   (description, diff, review, CI) is the audit record — this is what makes
   the [session inventory](./02-session-inventory.md) possible at zero extra
   bookkeeping cost.
2. **No self-merge.** The identity that authored a change never approves it
   (restates the No-Merge Policy in
   [docs/agent-issue-pr-workflow.md](../agent-issue-pr-workflow.md)). Applies
   to autonomous agents too.
3. **Write actions go through gated workflows.** External mutations (DNS,
   M365, WHMCS, domain registration) happen only via the ops plane's numbered
   workflows: reader/writer credential split, environment approval gates,
   `dry_run` defaults, typed confirmation for the highest stakes.
4. **Secrets never touch agent context.** Enforced by `.claude/settings.json`
   deny rules and [.claude/rules/01-security.md](../../.claude/rules/01-security.md):
   no tokens in files, prompts, or logs; GitHub Secrets / Azure Key Vault only.
5. **Unattended runs need their own identity.** Scheduled or event-driven
   agents (Routines, claude-code-action) run under a **dedicated automation
   account** — a single-owner Claude Max account (or Team seat) with its own
   GitHub identity — never a volunteer's personal account. A volunteer leaving
   must not orphan or silently impersonate automation; the account's login is
   never shared between people, and it is used only through Anthropic's
   first-party tooling. (Routines caveat: they run as their creator's
   identity, and a green run means the infra ran, not that the task
   succeeded — verify outcomes via the PR, not the run status.)

   > **Status:** no personal-identity Routine is currently armed. The
   > designed Ops Concierge Routine was deliberately deferred pending
   > reconciliation with the hub Conductor loop — see
   > [07-autonomy.md](./07-autonomy.md) for the bounded pilot-exception terms
   > that would apply if it is ever armed before the bot identity exists.

6. **Snapshot, don't scan.** This repo documents other repos via committed,
   freshness-stamped snapshots (see [standards](../standards/README.md)).
   Live scanning belongs to the ops/control planes.
7. **Volunteer-sized cadence.** Refresh rhythms are commitments, so they are
   sized to be kept: 90-day inventory/blueprint re-verification, 30-day
   standards re-verification, quarterly reflection. A stale-but-stamped doc is
   honest; an unstamped doc is a trap.

## Cost & capacity guardrails

- **Subscription-funded only.** All Claude usage runs on the Max subscription
  through Anthropic's first-party tooling (Claude Code CLI/web, Routines,
  claude-code-action with a `setup-token` OAuth token). Never adopt
  `ANTHROPIC_API_KEY`, the Agent SDK, Bedrock/Vertex, or third-party runners
  fed by subscription OAuth; keep **metered overage/usage credits disabled**
  so exhaustion means waiting for the window, never a per-token bill.
- The subscription OAuth token (`CLAUDE_CODE_OAUTH_TOKEN`) is a secret under
  rule 4: GitHub Secrets only, rotated periodically, never in files or logs.
- Prefer explicit, scoped prompts over broad always-on triggers. Budgets are
  **session/run counts** against the shared per-account pool (5-hour windows,
  weekly caps, 15 Routine runs/day on Max — no pooling across seats); keep
  `--max-turns` caps and workflow timeouts as runaway guards on action runs.
- GitHub for Nonprofits keeps the platform itself free (Team plan for verified
  501(c)(3) orgs); model usage is a flat subscription cost — capacity, not
  spend, is the thing to budget.

## Escalation

Agent misbehavior (unexpected writes, secret exposure, runaway loops) follows
the existing security path: stop the run, revoke the narrowest credential,
document in an issue labeled `security`, and follow
[SECURITY.md](../../SECURITY.md). The PR-only rule means blast radius is
normally a branch, not production.
