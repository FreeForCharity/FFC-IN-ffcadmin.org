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

Both generators write a committed JSON file; the workflows open a rolling pull
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
  "entries": [
    /* HoursEntry[] — see src/data/hours-model.ts */
  ],
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
