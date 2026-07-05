# Agentic OS research summary

## 🗓️ Freshness

| Field           | Value                                  |
| --------------- | -------------------------------------- |
| Status          | 🟡 snapshot (verify before relying)    |
| Last verified   | 2026-07-05                             |
| Re-verify by    | 2026-10-05                             |
| Source of truth | The cited vendor docs and repositories |

**How to refresh:** re-check the cited docs (Claude Code features move fast),
correct what changed, and update this block.

---

## What "agentic OS" means

An **agentic operating system** is the coordination layer that lets many AI
agents run real work safely: shared memory and context, tool connections,
orchestration and routing, governance and guardrails, and observability. The
term is used two ways:

- **Academic / kernel-level** ("OS _for_ agents") — research on redesigning OS
  primitives (scheduling, isolation, observability) for agent workloads
  (AgenticOS workshops at ASPLOS/SOSP 2026). Context, not something FFC builds.
- **Practical / product-level** — a management layer over existing agents.
  **This is what FFC is building.**

The practical consensus architecture is a six-layer stack:

1. **Connections** — MCP servers, APIs, webhooks that give agents tools.
2. **Memory & shared context** — persistent state and instructions across sessions.
3. **Agents** — the identities, goals, and toolsets themselves.
4. **Orchestration** — routing, fan-out, human-in-the-loop checkpoints.
5. **Governance & guardrails** — permissions, approval gates, audit trails.
6. **Observability** — logs, inventories, cost and drift monitoring.

FFC already has real assets in every layer (see
[03-target-architecture](./03-target-architecture.md)); the OS work is
coordinating them, not green-fielding.

## Claude Code-native building blocks (mid-2026)

| Primitive                     | What it is                                                                                                                                                        | Where FFC uses it                                                                                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLAUDE.md` / `AGENTS.md`     | Project instructions agents auto-read                                                                                                                             | All managed repos (synced by AI-Management)                                                                                                         |
| Skills (`.claude/skills/`)    | Markdown workflows invoked as `/slash` commands                                                                                                                   | This repo: `/session-inventory-refresh`, `/agentic-os-status`                                                                                       |
| Subagents (`.claude/agents/`) | Isolated-context specialist agents                                                                                                                                | 8 agents in this repo                                                                                                                               |
| Hooks                         | Deterministic scripts on lifecycle events                                                                                                                         | Not yet used                                                                                                                                        |
| MCP servers                   | Tool/data connectors                                                                                                                                              | GitHub, Cloudflare, Playwright, Sentry, MS Learn                                                                                                    |
| Plugins + marketplaces        | Bundle skills+agents+hooks+MCP; `.claude-plugin/marketplace.json` in an org repo, auto-installed via `extraKnownMarketplaces` in per-repo `.claude/settings.json` | Not yet — the Phase 2 distribution mechanism                                                                                                        |
| `claude-code-action@v1`       | Runs Claude on GitHub events (`@claude` mentions or explicit prompts)                                                                                             | Not yet — Phase 2 candidate for the template repo                                                                                                   |
| Routines (research preview)   | Scheduled/API/GitHub-event cloud sessions                                                                                                                         | Not yet. **Caveat:** routines run as the creating user's identity, and a green run status means the infrastructure ran, not that the task succeeded |

## Session capture / institutional memory

- **PR-based audit trail is the backbone.** Every FFC agent session lands as a
  PR from a `claude/*` or `copilot/*` branch, so the PR record (description,
  diff, review, CI) _is_ the durable, searchable session archive — no separate
  database to maintain. The [session inventory](./02-session-inventory.md)
  indexes it.
- Claude Code writes full JSONL transcripts locally
  (`~/.claude/projects/…`); tooling exists to publish or mine them
  (`simonw/claude-code-transcripts`, `daaain/claude-code-log`). Worth adopting
  only if the reasoning (not just the result) needs archiving.
- **Reflection pattern:** periodically point a fresh session at recent merged
  agent PRs to mine recurring corrections and propose CLAUDE.md / agent-prompt
  updates. Cheapest continuous-improvement loop; adopted as a Phase 3 routine.

## Nonprofit-specific notes

- **GitHub for Nonprofits:** verified 501(c)(3) orgs get the GitHub Team plan
  free (unlimited private repos/users) — apply via
  [github.com/solutions/industry/nonprofits](https://github.com/solutions/industry/nonprofits).
- **Cost control for Actions-driven agents:** explicit prompts over broad
  triggers, `--max-turns` caps, workflow timeouts, concurrency limits.
- **Identity:** unattended automation should run under a dedicated bot/GitHub
  App identity rather than a volunteer's personal account, so the audit trail
  survives volunteer turnover (see [06-governance](./06-governance.md)).

## Sources

- Make — What Is an Agentic Operating System? <https://www.make.com/en/blog/agentic-operating-system>
- MindStudio — the six-layer agentic OS stack <https://www.mindstudio.ai/blog/what-is-agentic-operating-system>
- AgenticOS workshops (OS-for-agents research) <https://os-for-agent.github.io/>
- Claude Code docs — GitHub Actions <https://code.claude.com/docs/en/github-actions>, plugin marketplaces <https://code.claude.com/docs/en/plugin-marketplaces>, sessions <https://code.claude.com/docs/en/sessions>
- anthropics/claude-code-action <https://github.com/anthropics/claude-code-action>
- Transcript tooling: <https://github.com/simonw/claude-code-transcripts>, <https://github.com/daaain/claude-code-log>
- GitHub for Nonprofits <https://github.com/solutions/industry/nonprofits>, quickstart <https://docs.github.com/en/nonprofit/quickstart>
- Orchestrator landscape: crewAI <https://github.com/crewaiinc/crewai>, Composio agent-orchestrator <https://github.com/ComposioHQ/agent-orchestrator>, awesome-agent-orchestrators <https://github.com/andyrewlee/awesome-agent-orchestrators>
