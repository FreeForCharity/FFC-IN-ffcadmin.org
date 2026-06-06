# DNS Cutover Runbook

In-repo support for the freeforcharity.org ↔ ffcadmin.org cutover (#240). The
code-side work (audience-split content, sitemap, canonicals, the redirect map in
`cloudflare-bulk-redirects-cutover.csv`) lives here; the **execution steps below
run in external systems** (Cloudflare, the host, Google Search Console) and are
the maintainer's to perform.

## Pre-cutover checklist (in-repo — already done)

- [x] Audience-split routing live on ffcadmin.org (SisterSiteBanner, nav + footer
      "For Charities & Donors", `/site-owner` for owners).
- [x] `app/sitemap.ts` includes all current routes; legacy leaves set self-canonicals.
- [x] Bulk-redirect map committed: `docs/cloudflare-bulk-redirects-cutover.csv`.

## Cutover day (external — maintainer)

1. **Load redirects (Cloudflare).** Import `cloudflare-bulk-redirects-cutover.csv`
   into the freeforcharity.org zone as a Bulk Redirect list, then enable the rule.
2. **Flip DNS.** Point the apex/records to the new origin per the host plan.
   Lower TTLs ~24h ahead so the change propagates quickly.
3. **Verify redirects.** Run `scripts/test-cutover-redirects.sh` (see below) once
   DNS resolves; every source URL must return `301` to its target.
4. **Smoke-test key pages** on both domains (home, donate, submit-information,
   a few migrated paths).
5. **Decommission the old WordPress origin** only after redirects + smoke tests pass.

## Google Search Console (external — maintainer)

1. Confirm both properties (`freeforcharity.org`, `ffcadmin.org`) are verified.
2. Submit the updated `sitemap.xml` for each property.
3. For any URL that **moved domains**, use the **Change of Address** tool
   (Settings → Change of Address) where applicable.
4. Spot-check **Coverage / Pages** for redirect (3xx) handling and crawl errors
   over the following days; re-submit the sitemap if needed.
5. Watch **Performance** for impression continuity on the top moved URLs.

## Redirect verification script

`scripts/test-cutover-redirects.sh` reads the CSV and curls each `source_url`,
asserting it returns the expected `status` and `Location`. Run it after the
redirect list is enabled:

```bash
bash scripts/test-cutover-redirects.sh
```

## Related

- Redirect map: [`cloudflare-bulk-redirects-cutover.csv`](./cloudflare-bulk-redirects-cutover.csv)
- Content split plan: [`dns-cutover-site-plan.md`](./dns-cutover-site-plan.md)
- Companion marketing-site changes live in the **FreeForCharity/FreeForCharity.org** repo (#246).
