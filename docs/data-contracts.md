# Dashboard data contracts (#337)

This site is a static export, so "live" operational data is **generated into
committed JSON by scheduled GitHub Actions**, then rendered statically. Dashboards
read the committed JSON at build time and **degrade gracefully** when the data is
missing or stale.

This is the **tier-1 (no external API)** pipeline. Richer, Cloudflare-API-powered
metrics are tracked as follow-ups (see #187).

## Files

| File                               | Produced by                            | Workflow                                       | Cadence                   |
| ---------------------------------- | -------------------------------------- | ---------------------------------------------- | ------------------------- |
| `public/data/ci-status.json`       | `scripts/generate-ci-status.mjs`       | `.github/workflows/update-ci-status.yml`       | After each CI run + daily |
| `public/data/domain-expiry.json`   | `scripts/generate-domain-expiry.mjs`   | `.github/workflows/update-domain-expiry.yml`   | Weekly                    |
| `public/data/volunteer-hours.json` | `scripts/generate-volunteer-hours.mjs` | `.github/workflows/update-volunteer-hours.yml` | On issue events + daily   |

Each generator writes a committed JSON file; its workflow opens a rolling pull
request with the refreshed data (same pattern as `update-sites-data.yml`). No
secrets are hardcoded — workflows use `${{ secrets.* }}` / the default
`GITHUB_TOKEN` only.

## `volunteer-hours.json`

The GitHub-as-data hours backend (#361/#362). Approved `volunteer-hours` issues
(program-lead certified via the `approved` label) are parsed into `HoursEntry`
records (see [`hours-evidence-model.md`](./hours-evidence-model.md)). Self-logged
via the `volunteer-hours` Issue Form; code work is auto-evidenced from GitHub.

```jsonc
{
  "generatedAt": "2026-06-06T05:00:00Z",
  "seed": false,
  "source": "github-issues",
  "summary": {
    "approvedCount": 12,
    "byChannel": { "education": 20, "teaching": 8, "work": 14 },
  },
  "entries": [/* HoursEntry[] — see src/data/hours-model.ts */],
}
```

Totals are queryable by channel for the CE documentation (#358), MOVSM (#335),
and recognition badges (#359/#336).

## `ci-status.json`

Latest GitHub Actions run, per tracked workflow, on `main`. Sourced from the
GitHub REST API using the workflow's built-in `GITHUB_TOKEN` (no extra secret).

```jsonc
{
  "generatedAt": "2026-06-06T14:00:00Z", // ISO-8601 UTC
  "seed": false, // true only for the committed placeholder
  "repo": "FreeForCharity/FFC-IN-ffcadmin.org",
  "workflows": [
    {
      "name": "Build, Test, and Verify",
      "status": "completed", // queued | in_progress | completed
      "conclusion": "success", // success | failure | cancelled | null
      "headBranch": "main",
      "runUrl": "https://github.com/.../actions/runs/123",
      "updatedAt": "2026-06-06T13:58:00Z",
    },
  ],
}
```

Rendered on **`/testing`** as a live CI status badge.

## `domain-expiry.json`

Domain expiration dates for FFC-managed apex domains, sourced from **RDAP**
(public, no API key) with WHOIS as the conceptual fallback. Domains are read from
`docs/sites_list.csv`.

```jsonc
{
  "generatedAt": "2026-06-06T08:00:00Z",
  "seed": false,
  "source": "RDAP",
  "summary": {
    "total": 50,
    "expired": 0, // daysRemaining < 0
    "expiring30": 1, // 0..30
    "expiring60": 2, // 31..60
    "expiring90": 3, // 61..90
    "ok": 40, // > 90
    "unknown": 4, // lookup failed / no expiration event
  },
  "domains": [
    {
      "domain": "ffcadmin.org",
      "expiresAt": "2027-01-15", // ISO date, or null when unknown
      "daysRemaining": 223, // integer, or null when unknown
      "registrar": "Example Registrar", // best-effort, may be ""
      "bucket": "ok", // expired|expiring30|expiring60|expiring90|ok|unknown
    },
  ],
}
```

Rendered on **`/sites-list`** as a domain-expiration tracker with 30/60/90-day
alerts.

## Graceful degradation

Dashboards must never crash on missing/stale data:

- **Missing file** → the loader returns `null`; the dashboard shows a neutral
  "data not yet available" state.
- **`seed: true`** → the dashboard shows the data but labels it as an
  awaiting-first-run placeholder.
- **Stale `generatedAt`** (older than the cadence above) → the dashboard shows a
  "may be out of date" note alongside the data.

## `docs/sites_list.csv` — optional enrichment columns (#418–#421, #425)

The Sites List reads these **optional** columns when the upstream
`FFC-Cloudflare-Automation` generator emits them, and renders nothing when it
doesn't (no empty columns):

| Column            | Shape        | Renders as                                        |
| ----------------- | ------------ | ------------------------------------------------- |
| `SSL Expiry`      | ISO date     | Badge (red ≤ 14 days, amber ≤ 30, green beyond)   |
| `NS Match`        | `Yes` / `No` | ⚠ NS flag next to the domain when `No`            |
| `Redirect Target` | URL          | "→ target" detail under the Redirect health badge |
| `Lighthouse`      | 0–100        | Badge (green ≥ 90, amber ≥ 50, red below)         |

**Refresh diff:** `update-sites-data.yml` copies the outgoing snapshot to
`docs/sites_list.prev.csv` before overwriting. At build time the page compares
Health/Status/Tier/Server per domain and marks changed rows with a Δ badge.
When no `.prev.csv` exists yet, diffing silently does nothing.

**Owners:** `src/data/site-owners.ts` (this repo) maps lowercase domain →
GitHub handle or display name; an Owner column appears in any tier table where
at least one row is mapped.

## `public/data/sites-alerts.json` (#427)

Build-time alerts feed for email/Teams automations to poll — regenerated by
`scripts/generate-sites-alerts.mjs` on every `pnpm run build` (gitignored:
derived, not source). Combines errored/unreachable managed sites (tier 6 and
left-FFC domains excluded) with expired / ≤ 60-day domain expirations from
`domain-expiry.json`.

```jsonc
{
  "generatedAt": "2026-06-12T00:00:00Z",
  "source": "docs/sites_list.csv + public/data/domain-expiry.json",
  "docs": "https://github.com/FreeForCharity/FFC-IN-ffcadmin.org/blob/main/docs/data-contracts.md",
  "summary": { "total": 12, "health": 9, "expiry": 3 },
  "alerts": [
    {
      "type": "health",
      "severity": "high",
      "domain": "x.org",
      "detail": "Error (3 - Needs Migration, server: HostPapa)",
    },
    {
      "type": "expiry",
      "severity": "medium",
      "domain": "y.org",
      "detail": "Domain expires 2026-08-01 (50 days)",
    },
  ],
}
```

A human-readable, print-friendly rendering of the same picture lives at
`/sites-list/summary`.

## `public/data/agent-session-inventory.json`

The org-wide inventory of AI-agent PR sessions across all public
FreeForCharity repos, rendered on **`/agentic-os/session-inventory`** and
documented in [docs/agentic-os/02-session-inventory.md](./agentic-os/02-session-inventory.md).

**Unlike the feeds above, this file is NOT produced by a scheduled workflow.**
ffcadmin is a snapshot-only plane (see [docs/standards/README.md](./standards/README.md));
the file is refreshed manually via the `/session-inventory-refresh` skill and
validated by `__tests__/agentic-os-data.test.ts`. Do not add an
`update-agent-sessions.yml` workflow — if a cadence is ever needed, the scanner
belongs in FFC-Cloudflare-Automation or FFC-IN-AI-Management, publishing a feed
this repo syncs.

```jsonc
{
  "schemaVersion": 1,
  "generatedAt": "2026-07-05T00:00:00Z", // authoritative "as of" marker
  "method": "public-web-pr-search", // provenance
  "window": { "from": "2026-02-01", "to": "2026-07-05" }, // analysis frame
  "orgTotals": {
    "repos": 56,
    "reposWithSessions": 32,
    "claudePrs": 464,
    "copilotPrs": 415,
    "totalSessions": 879, // claudePrs + copilotPrs (test-enforced)
  },
  "categories": [{ "id": "feature", "label": "Feature build" }],
  "repos": [
    {
      "name": "FFC-IN-ffcadmin.org",
      "url": "https://github.com/FreeForCharity/FFC-IN-ffcadmin.org",
      "kind": "internal", // internal|charity-site|template|tooling
      "agents": {
        "claude": {
          "total": 99,
          "open": 0,
          "closed": 99,
          "firstSeen": "2026-05-25",
          "lastSeen": "2026-07-01",
        },
        "copilot": {
          "total": 57,
          "open": 0,
          "closed": 57,
          "firstSeen": "2025-11-15",
          "lastSeen": "2026-01-08",
        },
      },
      "exampleTitles": ["feat(nav): global site search (⌘K command palette)"], // ≤ 5
      "categoryCounts": { "content": 3 }, // sampled page-1 tags, not exhaustive
      "surveyStatus": "ok", // ok|partial|unreachable — failed fetches surface here, never invented counts
      "notes": "",
    },
  ],
}
```

Loader: `src/lib/agenticOsData.ts` (null on missing/malformed file; the
dashboard shows a stale warning when `generatedAt` is older than 90 days).
