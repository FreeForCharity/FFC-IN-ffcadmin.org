# Standards

This directory holds lightweight **coordination standards** for ffcadmin —
control-plane records that point at work owned by _other_ repos. ffcadmin
publishes and links these; it is not the source of truth for another repo's
build state, and it must not become a live scanner or workflow runner for them.

## Documents

- [Footer-template parity matrix](./footer-template-parity-matrix.md) — WS-A
  footer-only parity state: the completed first wave, the merged
  manifest/Lighthouse tail, and the next planned template contract.
- [Agentic OS blueprint](../agentic-os/README.md) — lives in `docs/agentic-os/`
  but follows this directory's freshness convention: snapshot docs of the
  org-wide agent-session inventory, architecture, and governance.

## Freshness convention (read this before trusting any file here)

These documents are **hand-maintained snapshots of other repos' state**, so they
go stale unless someone refreshes them. A lot of automation (and humans) misread
a snapshot as live status — so every standard in this directory **must** carry a
`## 🗓️ Freshness` block at the very top with these fields:

| Field           | Meaning                                                           |
| --------------- | ----------------------------------------------------------------- |
| Status          | 🟢 current · 🟡 snapshot (verify before relying) · 🔴 known-stale |
| Last verified   | the date someone last checked it against the source of truth      |
| Re-verify by    | the date after which it must be treated as stale                  |
| Source of truth | where the live state actually lives (the linked repos/issues/PRs) |

It must also include a short **How to refresh** procedure.

### For agents and maintainers

- **Treat a file as stale** when today's date is past its **Re-verify by**, _or_
  whenever you need to act on a forward-looking ("planned" / "draft") row —
  whichever comes first.
- **To refresh:** re-check each external link, correct only the cells you actually
  verified, then set **Last verified** to today and **Re-verify by** to 30 days
  out, and log the refresh in the coordination issue.
- **These files are pointers, not authority.** When a standard and its linked
  owning repo disagree, the owning repo wins — fix the standard.
