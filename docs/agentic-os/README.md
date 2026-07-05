# The FFC Agentic OS blueprint

## 🗓️ Freshness

| Field           | Value                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Status          | 🟡 snapshot (verify before relying)                                            |
| Last verified   | 2026-07-05                                                                     |
| Re-verify by    | 2026-10-05                                                                     |
| Source of truth | The linked FreeForCharity repos and `public/data/agent-session-inventory.json` |

**How to refresh:** run the `/agentic-os-status` skill to find what is stale,
then `/session-inventory-refresh` for the data and hand-edit the affected docs,
updating each file's freshness block.

---

This directory is the blueprint for the **FFC Agentic OS** — the management
layer around the hundreds of AI-agent sessions Free For Charity runs across
its ~56 public repositories. It captures what exists, defines the target
architecture, and lays out the roadmap to get there.

The public-facing rendering lives at [`/agentic-os`](https://ffcadmin.org/agentic-os)
(overview, session-inventory dashboard, architecture). These docs carry the
full detail.

## Reading order

| Doc                                                      | What it covers                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| [01-research-summary.md](./01-research-summary.md)       | What an agentic OS is; the building blocks available in mid-2026 |
| [02-session-inventory.md](./02-session-inventory.md)     | Methodology and findings of the org-wide agent session survey    |
| [03-target-architecture.md](./03-target-architecture.md) | The five planes × six layers target architecture                 |
| [04-gap-analysis.md](./04-gap-analysis.md)               | Current vs. target, per layer, with severity and effort          |
| [05-roadmap.md](./05-roadmap.md)                         | Phased plan and the per-repo issues to file                      |
| [06-governance.md](./06-governance.md)                   | The governance model for a volunteer-run 501(c)(3)               |

## Ground rules for this directory

- Every doc carries a `## 🗓️ Freshness` block per the
  [standards convention](../standards/README.md) — treat a doc as stale past
  its **Re-verify by** date.
- ffcadmin.org is a **snapshot-only plane**: these docs and the committed
  inventory JSON describe other repos but nothing here live-scans them, and no
  scheduled workflow may be added to do so. Live automation belongs to
  FFC-Cloudflare-Automation (ops) and FFC-IN-AI-Management (control).
- The machine-readable session data is
  [`public/data/agent-session-inventory.json`](../../public/data/agent-session-inventory.json),
  documented in [data-contracts](../data-contracts.md) and validated by
  `__tests__/agentic-os-data.test.ts`.
