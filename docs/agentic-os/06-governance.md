# Governance — running agents in a volunteer 501(c)(3)

## 🗓️ Freshness

| Field           | Value                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| Status          | 🟡 snapshot (verify before relying)                                          |
| Last verified   | 2026-07-05                                                                   |
| Re-verify by    | 2026-10-05                                                                   |
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
   agents (routines, claude-code-action) run under a dedicated bot/GitHub-App
   identity — never a volunteer's personal account. A volunteer leaving must
   not orphan or silently impersonate automation. (Routines caveat: they run
   as their creator's identity, and a green run means the infra ran, not that
   the task succeeded — verify outcomes via the PR, not the run status.)

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

- Prefer explicit, scoped prompts over broad always-on triggers.
- When automated runs arrive (Phase 2+): `--max-turns` caps, workflow
  timeouts, concurrency limits per repo.
- GitHub for Nonprofits keeps the platform itself free (Team plan for verified
  501(c)(3) orgs); the marginal cost is model usage — budget it per phase, not
  per repo.

## Escalation

Agent misbehavior (unexpected writes, secret exposure, runaway loops) follows
the existing security path: stop the run, revoke the narrowest credential,
document in an issue labeled `security`, and follow
[SECURITY.md](../../SECURITY.md). The PR-only rule means blast radius is
normally a branch, not production.
