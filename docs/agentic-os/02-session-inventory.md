# Agent session inventory — methodology & findings

## 🗓️ Freshness

| Field           | Value                                                                       |
| --------------- | --------------------------------------------------------------------------- |
| Status          | 🟡 snapshot (verify before relying)                                         |
| Last verified   | 2026-07-05                                                                  |
| Re-verify by    | 2026-10-05                                                                  |
| Source of truth | `public/data/agent-session-inventory.json` and the linked repos' PR history |

**How to refresh:** run the `/session-inventory-refresh` skill (manual only —
see ground rules), then update the findings numbers below.

---

## Methodology

Every FFC agent session lands as a pull request from an agent-named branch, so
**PR history is the session record**. The survey enumerates it per repo via
public GitHub PR-search pages:

- `pulls?q=is:pr head:claude/` → Claude Code sessions (open/closed counts,
  page-1 titles, newest date; `+sort:created-asc` for the oldest date)
- `pulls?q=is:pr head:copilot/` → GitHub Copilot coding-agent sessions
- Dependabot and human branches are excluded by the `head:` filters.

All 56 public FreeForCharity repos were surveyed individually (four parallel
`session-archivist` batches — no sampling or extrapolation), and the org
listing was independently re-fetched to confirm the 56-repo universe. Rules:

- **Counts are lifetime totals per agent** as of `generatedAt` — the `head:`
  search cannot be date-bounded reliably. `firstSeen`/`lastSeen` dates place
  the activity in time; the analysis window (2026-02-01 → 2026-07-05) is the
  narrative frame. Copilot totals notably include the pre-2026 era before FFC
  migrated to Claude.
- **No invented numbers.** A failed fetch produces `surveyStatus:
"partial"`/`"unreachable"`, never an estimate. (This survey: all 56 repos
  `"ok"`.)
- **Category tags are a sample** — keyword tags over each repo's most recent
  PR titles (≤5), not an exhaustive classification.
- The Gemini/Antigravity autonomous loop
  (`FFC-IN-google_antigravity_agents`) commits under its own identity and is
  **not** captured by these branch filters; its volume is additional.

Data: [`public/data/agent-session-inventory.json`](../../public/data/agent-session-inventory.json)
· Dashboard: [`/agentic-os/session-inventory`](https://ffcadmin.org/agentic-os/session-inventory)
· Schema validation: `__tests__/agentic-os-data.test.ts`

## Findings (as of 2026-07-05)

**879 agent PR sessions across the org: 464 Claude + 415 Copilot, in 32 of 56
public repos.**

### Top repos by agent sessions

| Repo                            | Claude | Copilot | Total | Note                            |
| ------------------------------- | -----: | ------: | ----: | ------------------------------- |
| FFC-IN-ffcadmin.org             |     99 |      57 |   156 | This site                       |
| FFC-EX-SRRN.net                 |      0 |     126 |   126 | Copilot-era content maintenance |
| FFC-IN-freeforcharity.org       |    104 |      10 |   114 | Flagship public site            |
| FFC-IN-FFC_Single_Page_Template |     53 |      57 |   110 | The charity-site template       |
| FFC-Cloudflare-Automation       |     72 |      24 |    96 | Ops workflow hub                |
| FFC-EX-freedomrisingusa.org     |     22 |      18 |    40 | Most active charity site        |
| FFC-EX-hclwellness.org          |     31 |       0 |    31 | Claude-native charity build     |
| FFC-EX-PAGboosters.org          |      0 |      31 |    31 | Copilot-era charity site        |

### The story in the timeline

1. **Copilot era (Sep 2025 – Mar 2026):** Copilot coding agents did the early
   heavy lifting — template hardening, SRRN.net content maintenance (126 PRs),
   the first charity-site waves. Copilot activity effectively ends by
   April 2026.
2. **Claude migration (Feb – May 2026):** Claude sessions begin on the
   flagship repos and, from May 2026, dominate: 464 sessions concentrated on
   the internal platform (ffcadmin, freeforcharity.org), the template, and the
   automation hub.
3. **Charity-site long tail:** 24 of 56 repos show zero agent PR sessions —
   mostly small `FFC-EX-*` sites created by automation and untouched since, or
   maintained by humans/direct commits. This is the biggest coverage gap the
   OS should close (see [04-gap-analysis](./04-gap-analysis.md)).

### What the agents worked on (sampled tags)

Content & copy and feature builds dominate the charity sites; infrastructure/CI
and config work dominate the internal repos. Migration tags mark the
WordPress/Wix → static conversions. Full distribution is on the dashboard.

## Ground rules

This file and its JSON are **committed snapshots**. ffcadmin.org must not
live-scan other repos, so refresh is manual via the skill — do **not** add a
scheduled workflow for it. If a cadence is ever needed, the scanner belongs in
FFC-Cloudflare-Automation or FFC-IN-AI-Management, publishing a feed this repo
syncs like the other data feeds.
