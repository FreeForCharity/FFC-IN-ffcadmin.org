# Sites List — ARCHIVED

> **This file is archived and no longer maintained.** It used to hold a
> hand-edited table of FFC domains, but the sites list is now machine-generated.

## Where the live data lives

- **Page:** [`/sites-list`](https://ffcadmin.org/sites-list) — plus the
  volunteer views (Migration / Maintenance / Development).
- **Data consumed by this site:** `docs/sites_list.csv` (and `sites_list.json`),
  synced weekly from the canonical source.
- **Canonical source / generator:**
  [`FreeForCharity/FFC-Cloudflare-Automation`](https://github.com/FreeForCharity/FFC-Cloudflare-Automation/tree/main/sites-list)
  — merges the WHMCS / Cloudflare / WPMUDEV exports with the curated base list,
  runs health checks, and computes the Work Tiers and persona scores.

Nothing reads this file at build or runtime; it is kept only as a pointer.
