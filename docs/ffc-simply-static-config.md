# FFC Simply Static Pro Configuration Guide

Standard configuration for Simply Static Pro exports across all FFC charity site conversions.

## Problem Statement

Simply Static Pro uses the GitHub Trees API to commit exported files in batches of ~50. Two issues cause HTML pages to be silently dropped:

1. **GitHub Push Protection** - Enabled by default on all public repos. WordPress HTML pages contain embedded tokens (tawk.to widget IDs, Google Maps API keys, reCAPTCHA site keys, Zeffy embed tokens) that trigger GitHub's secret scanner. When a batch contains a flagged file, the **entire batch is rejected** but Simply Static still counts those files as "committed."

2. **GitHub Secondary Rate Limiting** - Pushing 5,000+ files via the API in rapid succession triggers rate limits, causing further batch failures.

The result: Simply Static reports "Done!" with all files committed, but the branch contains only CSS/JS/images with **zero HTML pages**.

## One-Time Org Setup

### 1. Create Push Protection Bypass Ruleset

Go to: https://github.com/organizations/FreeForCharity/settings/rules/new

| Setting        | Value                                           |
| -------------- | ----------------------------------------------- |
| Name           | `FFC Simply Static Export Bypass`               |
| Enforcement    | Active                                          |
| Target         | Branch                                          |
| Branch pattern | `simply-static-export`                          |
| Bypass actors  | Organization Admin (Always)                     |
| Rules          | Do NOT enable "Require secret scanning results" |

Or via CLI (requires `admin:org` scope):

```bash
gh auth refresh -h github.com -s admin:org

gh api orgs/FreeForCharity/rulesets \
  --method POST \
  -f name="FFC Simply Static Export Bypass" \
  -f target=branch \
  -f enforcement=active \
  -f 'conditions[ref_name][include][]=refs/heads/simply-static-export' \
  -f 'bypass_actors[][actor_type]=OrganizationAdmin' \
  -f 'bypass_actors[][actor_id]=0' \
  -f 'bypass_actors[][bypass_mode]=always'
```

### 2. Dedicated Fine-Grained PAT

Create a fine-grained PAT per-repo for Simply Static:

- **Settings > Developer settings > Personal access tokens > Fine-grained tokens**
- **Name:** `simply-static-REPONAME`
- **Expiration:** 90 days (set calendar reminder to rotate)
- **Repository access:** Only selected repositories (the target repo)
- **Permissions:** Contents (Read and write) only
- **Never** reuse a PAT across repos or share it in chat/issues/docs

## Per-Site Simply Static Settings

### Deploy Tab

| Setting           | Value                                            |
| ----------------- | ------------------------------------------------ |
| Deployment Method | GitHub                                           |
| Account Type      | Organization                                     |
| User/Org          | `FreeForCharity`                                 |
| Email             | Converter's FFC email                            |
| PAT               | Dedicated fine-grained token (see above)         |
| Repository        | Target repo name (e.g., `FFC-EX-DomainName.com`) |
| Visibility        | Public                                           |
| Branch            | `simply-static-export`                           |
| Folder            | (leave empty)                                    |
| Throttle Requests | **Checked** (critical for large sites)           |

### General Tab

| Setting              | Value                                     |
| -------------------- | ----------------------------------------- |
| Destination URL Type | Relative                                  |
| Destination Scheme   | `https://`                                |
| Force Replace URL    | Checked                                   |
| Debugging Mode       | Checked (for first export, disable after) |

### Enhanced Crawl Tab — Plugins to Include

Only include plugins that produce frontend-visible output. Remove all admin-only, analytics, and security plugins — they contain embedded tokens that trigger GitHub's push protection.

**Keep:**
| Plugin | Reason |
|--------|--------|
| Simply Static | Required for export process |
| Simply Static Pro | Required for export process |
| Strong Testimonials | Frontend CSS/JS for testimonial display |

**Remove (admin-only or token-bearing):**
| Plugin | Reason to exclude |
|--------|-------------------|
| Broken Link Checker | Admin tool, no frontend assets |
| Divi Dash | WPMUDEV admin dashboard |
| Hustle Pro | Popup/opt-in — embeds tracking tokens |
| Microsoft Clarity | Analytics — **embeds project ID tokens** |
| Shipper Pro | Migration tool, no frontend output |
| Snapshot Pro | Backup tool, no frontend output |
| Tawk.to Live Chat | Chat widget — **embeds API tokens (primary push protection trigger)** |
| Branda Pro | Admin branding only |
| Defender Pro | Security — **ships webauthn/JWT JS with token patterns** |
| WPMU DEV Dashboard | Admin-only hub plugin |

### URLs to Exclude

Add these to reduce export size and avoid exporting admin-only plugin assets:

```
/wp-admin/
/wp-content/plugins/snapshot-backups/
/wp-content/plugins/shipper/
/wp-content/plugins/wp-defender/
/wp-content/plugins/hustle/
/wp-content/plugins/broken-link-checker/
/wp-content/plugins/ultimate-branding/
/wp-content/plugins/beehive-analytics/
/wp-content/plugins/smartcrawl-wpmu-dev/
/wp-content/plugins/tawkto-live-chat/
/wp-content/plugins/microsoft-clarity/
/wp-content/plugins/branda/
/wp-content/plugins/wpmudev-dashboard/
/wp-content/plugins/divi-dash/
/wp-login.php
/xmlrpc.php
```

### Pre-Export Checklist

1. Disable caching/optimization plugins (Hummingbird, Smush Pro)
2. Disable analytics plugins (Beehive Analytics)
3. Disable SEO plugins that inject dynamic scripts (SmartCrawl)
4. Clear Divi Builder cache: Divi > Theme Options > Builder > Advanced > Static CSS > Clear
5. Create the target branch: `gh api repos/FreeForCharity/REPO-NAME/git/refs -f ref=refs/heads/simply-static-export -f sha=$(gh api repos/FreeForCharity/REPO-NAME/git/refs/heads/main --jq .object.sha)`
6. Run Simply Static > Diagnostics first

### Post-Export Verification

After export completes, verify HTML pages actually made it to the branch:

```bash
gh api "repos/FreeForCharity/REPO-NAME/git/trees/simply-static-export?recursive=1" \
  | python -c "
import json, sys
d = json.load(sys.stdin)
html = [i['path'] for i in d['tree'] if i['path'].endswith('.html')]
print(f'HTML files: {len(html)}')
for f in html[:10]: print(f'  {f}')
if not html: print('WARNING: No HTML files found! Check GitHub push protection settings.')
"
```

If zero HTML files are found, the push protection ruleset needs to be configured (see One-Time Org Setup above).

## Troubleshooting

### "Repository rule violations found - Secret detected in content"

**Cause:** GitHub's push protection flagged content in an HTML page (embedded API keys, widget tokens, etc.)

**Fix:** Create the org-level ruleset to bypass push protection on `simply-static-export` branches (see above).

### "You have exceeded a secondary rate limit"

**Cause:** Too many GitHub API calls in a short period.

**Fix:** Enable "Throttle GitHub Requests" in Simply Static Pro settings. For very large sites (10,000+ URLs), consider splitting the export into multiple runs using Simply Static's single export feature.

### Export says "Done!" but branch has fewer files than expected

**Cause:** Simply Static counts files as "committed" even when the API call fails. The progress counter is unreliable.

**Fix:** Always run the post-export verification script above. Compare the HTML file count against the WordPress page count from the content audit.

### 1 file failed to commit (6104 of 6105)

**Cause:** Usually a file with special characters in the path, or a file that exceeds GitHub's 100MB size limit.

**Fix:** Check the debug log for the specific file. The pattern `Total pages: XXXX; Pages remaining: 1` near the end of the log indicates which file was left over.

## Reference

- Simply Static Pro docs: https://developer.developer.developer.developer.developer.developer.developer
- GitHub Push Protection: https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations
- GitHub API Rate Limits: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- FFC Conversion Guide: https://ffcadmin.org/wordpress-to-nextjs-guide

---

_Created: February 2026 | Based on FreeForCharity.org export analysis_
