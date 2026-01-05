# Sites List Documentation

## Overview

The **Sites List** is an automated domain and site inventory management system for Free For Charity. It provides real-time monitoring, health checks, and categorized organization of all managed domains with integrated data from multiple sources.

**Live Page:** [https://ffcadmin.org/sites-list](https://ffcadmin.org/sites-list)

## Key Features

### 1. Categorized Tables

Sites are automatically organized into four categories based on their status:

#### Active / Master List

- **Status:** Active, Pending, Unknown
- **Description:** Primary working inventory of all operational domains
- **Use Case:** Daily site management and monitoring

#### Transferred Away (TR)

- **Status:** Transferred Away
- **Description:** Domains that have been transferred to another registrar
- **Use Case:** Historical record of domains no longer under FFC management

#### Expired / Cancelled (EX)

- **Status:** Expired, Cancelled, Terminated
- **Description:** Domains that are no longer active or have been terminated
- **Use Case:** Cleanup planning and renewal decision tracking

#### Fraudulent / High Risk (FR)

- **Status:** Fraud
- **Description:** Domains marked as fraudulent or high risk in WHMCS
- **Use Case:** Security monitoring and fraud prevention

### 2. Site Health Check Automation

Every domain undergoes automated HTTP health checks with the following status indicators:

| Status          | HTTP Code   | Description                                |
| --------------- | ----------- | ------------------------------------------ |
| **Live**        | 200 OK      | Site is accessible and responding normally |
| **Redirect**    | 3xx         | Site redirects to another location         |
| **Error**       | 4xx/5xx     | Site returns client or server error        |
| **Unreachable** | Timeout/DNS | Site cannot be reached or DNS fails        |

**Technical Details:**

- Health checks run during data update process
- 5-second timeout per site
- Processes sites in chunks of 10 to avoid network throttling
- Results stored in `Site Health` column of sites_list.csv

### 3. WPMUDEV Data Integration

The Sites List integrates data from three primary sources:

#### WHMCS (Domain Registration)

- Domain registration status
- Customer information
- Billing status
- Maps to: `In WHMCS`, `Status` columns

#### Cloudflare (DNS/CDN)

- DNS configuration
- IP address assignments
- Proxy settings
- Maps to: `In Cloudflare`, `Cloudflare IP`, `Server In Use` columns

#### WPMUDEV (WordPress Hosting)

- WordPress site management
- Hosting information
- Site availability
- Maps to: `In WPMUDEV` column

## Data Structure

The `docs/sites_list.csv` file contains the following columns:

| Column                | Description                               | Source                |
| --------------------- | ----------------------------------------- | --------------------- |
| Section               | Category/grouping of the domain           | Manual classification |
| Domain                | Domain name                               | All sources           |
| Status                | Active, Transferred, Expired, Fraud, etc. | WHMCS + Manual        |
| In WHMCS              | Yes/No - Domain exists in WHMCS           | WHMCS export          |
| In Cloudflare         | Yes/No - Domain exists in Cloudflare      | Cloudflare export     |
| In WPMUDEV            | Yes/No - Site exists in WPMUDEV           | WPMUDEV export        |
| Server In Use         | Hosting server/platform                   | Cloudflare + Manual   |
| Old Server Abandoned? | Migration status                          | Manual                |
| Notes                 | Additional information                    | Manual                |
| Cloudflare IP         | IP address from Cloudflare DNS            | Cloudflare export     |
| Repo URL              | GitHub repository link                    | Manual                |
| Site Health           | Live, Redirect, Error, Unreachable        | Automated checks      |
| Priority              | Standard, High, Highest, Low              | Manual + Inherited    |

## Automated Update Process

### Weekly Automation

The Sites List is automatically updated every Monday at 8:00 AM UTC via the `update-sites-data.yml` GitHub Actions workflow.

**Workflow Steps:**

1. **Trigger Remote Workflows**
   - WHMCS domain export workflow
   - Cloudflare DNS summary export workflow
   - WPMUDEV sites/domains export workflow

2. **Wait for Completion**
   - Monitors all three remote workflows
   - Waits for successful completion
   - Maximum 30-minute timeout per workflow

3. **Download Artifacts**
   - `whmcs_domains.csv` → `tmp_data/whmcs_domains/`
   - `domain_summary.csv` → `tmp_data/domain_summary/`
   - `wpmudev_domains.csv` → `tmp_data/wpmudev/wpmudev-domain-inventory/`

4. **Process and Merge Data**
   - Runs `scripts/update-sites-data.mjs`
   - Merges data from all three sources
   - Performs automated site health checks
   - Applies sorting and pairing logic
   - Generates updated `docs/sites_list.csv`

5. **Create Pull Request**
   - Automated PR with updated data
   - Includes commit message: "feat(data): Automated sites list update"
   - Requires review and approval before merge

### Manual Trigger

Administrators can manually trigger the update workflow via GitHub Actions:

1. Go to **Actions** tab in GitHub
2. Select **Update Sites List Data** workflow
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow** button

## Update Script Details

**File:** `scripts/update-sites-data.mjs`

**Language:** Node.js (ESM)

**Dependencies:**

- `csv-parse` - Parse CSV files
- `csv-stringify` - Generate CSV output
- Node.js `fetch` API - HTTP health checks

**Key Functions:**

### Data Reading

```javascript
readCSV(path) // Parse CSV files with headers
readJSON(path) // Read and parse JSON files
```

### Site Health Checks

```javascript
checkSiteAvailability(domain)
// Returns: 'Live', 'Redirect', 'Error', or 'Unreachable'
// Timeout: 5 seconds
// Method: GET with manual redirect handling
```

### Data Processing

```javascript
main()
// 1. Read all data sources
// 2. Create domain index maps (WHMCS, Cloudflare, WPMUDEV)
// 3. Collect unique domains from all sources
// 4. Process sites in chunks with health checks
// 5. Apply pairing logic for .org/.com domains
// 6. Sort by priority and domain name
// 7. Write output to sites_list.csv
```

## Display Features

The `/sites-list` page includes:

### Visual Indicators

- **Color-coded status badges** for In WHMCS, In Cloudflare, In WPMUDEV
- **Health status badges** with color coding (Green=Live, Yellow=Redirect, Red=Error/Unreachable)
- **Category-specific table headers** with distinct colors

### Priority Section Legend

Visual guide explaining the seven priority sections:

- For-Profit (Purple)
- Org-WPAdmin (Green)
- Org-NoWP (Yellow)
- InterServer-Org (Blue)
- Subdomain (Gray)
- Cloudflare-Only (Orange)
- Krystal-New (Indigo)

### Migrated Sites Table

Special table showing fully migrated sites (Apex domain + Cloudflare + GitHub Pages)

### Table Features

- Clickable domain names linking to live sites
- Repository links (when available)
- Truncated notes with hover tooltips
- Total count footer for each category
- Responsive design for mobile/tablet/desktop

## Maintenance

### Adding New Data Sources

To add a new data source:

1. Add export workflow to the `FFC-Cloudflare-Automation-` repository (private automation repository)
2. Update `update-sites-data.yml` to trigger and download new artifact
3. Update `scripts/update-sites-data.mjs`:
   - Add new path constant
   - Add `readCSV()` call for new source
   - Add mapping logic in main data processing
   - Update output columns if needed
4. Update `app/sites-list/page.tsx` to display new columns
5. Update this documentation

### Modifying Categories

Edit the filtering logic in `app/sites-list/page.tsx`:

```typescript
const fraudSites = sites.filter((s) => s.status.toLowerCase() === 'fraud')
const expiredSites = sites.filter((s) =>
  ['expired', 'cancelled', 'terminated'].includes(s.status.toLowerCase())
)
// Add new categories as needed
```

### Changing Update Schedule

Edit `.github/workflows/update-sites-data.yml`:

```yaml
on:
  schedule:
    - cron: '0 8 * * 1' # Monday at 8am UTC
```

Use [crontab.guru](https://crontab.guru/) for cron syntax.

## Troubleshooting

### Common Issues

**Issue: Health checks show all sites as Unreachable**

- **Cause:** Network connectivity issues or timeout too short
- **Solution:** Check network, increase timeout in `checkSiteAvailability()`

**Issue: WPMUDEV data missing**

- **Cause:** Remote workflow failed or artifact not found
- **Solution:** Check `FFC-Cloudflare-Automation-` workflow runs, verify artifact name

**Issue: Duplicate entries in Sites List**

- **Cause:** Domain exists in multiple sources with different capitalization
- **Solution:** Check `toLowerCase()` normalization in script

**Issue: Pull request not created**

- **Cause:** No changes detected or insufficient permissions
- **Solution:** Verify `GH_PAT` secret has repo and PR permissions

### Debugging

Enable verbose logging in `scripts/update-sites-data.mjs`:

```javascript
console.log(`Processing ${allDomains.size} domains...`)
// Add more console.log statements as needed
```

View workflow logs:

1. Go to **Actions** tab
2. Select failed workflow run
3. Click on job name
4. Expand steps to view detailed logs

## Security Considerations

### Secrets Required

- `GH_PAT` - Personal Access Token with:
  - `repo` scope (for creating pull requests)
  - `workflow` scope (for triggering remote workflows)
  - `read:org` scope (for accessing organization data)

### Data Privacy

- CSV files contain domain names (public information)
- No customer PII is stored in the Sites List
- WHMCS customer data is not exported to this repository
- All data processing happens in secure GitHub Actions runners

### Audit Trail

- All updates create pull requests (reviewable)
- Commit history tracks all changes
- Automated commits are GPG-signed
- Manual changes require PR review

## Related Documentation

- **Workflow Documentation:** [.github/workflows/README.md](../.github/workflows/README.md#update-sites-datayml---sites-list-data-automation)
- **Tech Stack:** [https://ffcadmin.org/tech-stack](https://ffcadmin.org/tech-stack#sites-list-management)
- **Documentation Center:** [https://ffcadmin.org/documentation](https://ffcadmin.org/documentation#sites-management--monitoring)
- **Update Script:** [scripts/update-sites-data.mjs](../scripts/update-sites-data.mjs)
- **Sites List Page:** [app/sites-list/page.tsx](../app/sites-list/page.tsx)

## Future Enhancements

Potential improvements for the Sites List system:

1. **Real-time Health Monitoring**
   - Scheduled health checks independent of data updates
   - Alert notifications for site outages

2. **Historical Tracking**
   - Store health check history
   - Generate uptime reports

3. **Advanced Filtering**
   - Search by domain name
   - Filter by server, status, health
   - Export filtered results

4. **Dashboard Widgets**
   - Summary statistics (total sites, health distribution)
   - Recent changes timeline
   - Migration progress tracking

5. **API Integration**
   - REST API for programmatic access
   - Webhook notifications for status changes

## Support

For questions or issues with the Sites List:

1. **Review this documentation** for common scenarios
2. **Check workflow logs** in GitHub Actions for errors
3. **Open a GitHub issue** with details and error messages
4. **Contact:** globaladmin@freeforcharity.org

---

**Last Updated:** January 2026  
**Maintained By:** Free For Charity Global Admin Team
