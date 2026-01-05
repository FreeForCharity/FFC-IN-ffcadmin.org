# GitHub Actions Workflows

This repository uses three GitHub Actions workflows to ensure code quality, security, and automated deployment.

## ci.yml - Continuous Integration

Runs automated tests and build verification on all pull requests and pushes to main branch.

### When it runs:

- On pull requests targeting `main` branch
- On pushes to `main` branch

### What it does:

**Build, Test, and Verify Job:**

1. Checks out the code
2. Installs pnpm 9.0.0
3. Sets up Node.js 20 (LTS) with pnpm cache enabled
4. Installs dependencies with `pnpm install --frozen-lockfile`
5. Checks code formatting with `pnpm run format:check` (Prettier validation)
6. Runs linter with `pnpm run lint` (ESLint validation)
7. Builds the project with `pnpm run build` (Next.js build with TypeScript compilation)
8. Verifies build output directory is created
9. Validates critical files exist (index.html, .nojekyll, 404.html)
10. Runs tests with `pnpm test` (Jest test suite)

This workflow ensures that all code changes pass tests and build successfully before being merged. The pnpm cache significantly reduces CI time on subsequent runs.

### Order of Operations and Why It Matters

The CI steps run in a specific order to catch issues as early as possible:

1. **Format Check First**: Prettier validation runs before linting to ensure consistent code formatting. This catches style issues immediately.
2. **Lint Second**: ESLint runs after formatting to check code quality, best practices, and potential bugs.
3. **Build Third**: The Next.js build (including TypeScript compilation) runs after linting to catch type errors and build issues.
4. **Verify Fourth**: Build output validation ensures the static export is correct.
5. **Test Last**: Jest tests run after build to validate the generated output.

**Developer Workflow**: When developing locally, follow the same order:

```bash
pnpm run format        # Auto-fix formatting issues
pnpm run format:check  # Verify formatting (or skip if you ran format)
pnpm run lint          # Check code quality
pnpm run build         # Build the project
pnpm test              # Run tests
```

**Why format comes before lint**: Prettier and ESLint can conflict on style rules. Running format first ensures code style is consistent before ESLint checks other rules. The `eslint-config-prettier` package disables conflicting ESLint style rules.

## codeql-analysis.yml - Security Scanning

Performs automated security analysis using GitHub's CodeQL engine to detect security vulnerabilities in JavaScript/TypeScript code.

### When it runs:

- On pull requests targeting `main` branch
- On pushes to `main` branch
- Scheduled: Every Monday at 6:00 AM UTC

### What it does:

1. Checks out the code
2. Initializes CodeQL for JavaScript/TypeScript analysis
3. Automatically builds the project
4. Performs security analysis
5. Uploads results to GitHub Security tab

### Required Permissions:

- `actions: read` - Read workflow information
- `contents: read` - Read repository contents
- `security-events: write` - Upload security scan results

This workflow helps identify security vulnerabilities early in the development process.

## deploy.yml - Production Deployment

Automatically builds and deploys the Next.js static site to GitHub Pages **after** CI and security checks complete successfully.

### When it runs:

- Triggered when **either** `CI - Build and Test` or `CodeQL Security Analysis` workflow completes on main
- The first step explicitly verifies that **both** workflows have succeeded before proceeding
- On manual trigger via `workflow_dispatch`

**Note:** While `workflow_run` triggers when any listed workflow completes, the deployment includes an explicit verification step using GitHub Actions API to ensure both CI and CodeQL workflows have completed successfully on the same commit before proceeding with deployment.

This ensures code is never deployed without passing all quality and security checks.

### Prerequisites

1. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Set Source to "GitHub Actions"

2. No secrets or additional configuration needed - the workflow uses GitHub's built-in GITHUB_TOKEN with automatic permissions.

### Build Process

1. Checks out the code
2. Sets up Node.js 20 (LTS)
3. Installs pnpm 9.0.0
4. Installs dependencies with `pnpm install --frozen-lockfile`
5. Runs tests with `pnpm test` (validates build output and configuration)
6. Builds the site with `pnpm run build` (creates `out/` directory)
7. Uploads the `out/` directory as a build artifact (for Lighthouse workflow, retained for 1 day)
8. Uploads the `out/` directory as a Pages artifact (for GitHub Pages deployment)
9. Deploys to GitHub Pages

### Output

The workflow exports a fully static site compatible with GitHub Pages, including:

- `.nojekyll` file to prevent Jekyll processing
- Static HTML files for all routes
- Optimized JavaScript bundles
- SEO files (robots.txt, sitemap.xml)

## lighthouse.yml - Performance Auditing

Runs automated Lighthouse performance, accessibility, best practices, and SEO audits after successful deployments.

### When it runs:

- After successful completion of `Deploy to GitHub Pages` workflow on main
- On manual trigger via `workflow_dispatch`

### What it does:

**Lighthouse Audit Job:**

**When triggered by deployment workflow:**

1. Checks out the code
2. Downloads the build artifact from the deployment workflow (reuses already-built `out/` directory)
   - Uses `run_id` to download from the specific workflow run that triggered this workflow
   - Prevents "no artifacts found" errors by targeting the exact deployment run
3. Verifies the build output exists before proceeding
4. Installs Lighthouse CI globally
5. Runs Lighthouse audits on key pages (home, tech stack, documentation)
6. Each page is tested 3 times for consistent results
7. Checks if Lighthouse results were generated
8. Uploads results as GitHub artifacts (retained for 30 days)
   - Warns if no files are found instead of failing the workflow

**When manually triggered (`workflow_dispatch`):**

1. Checks out the code
2. Sets up Node.js and pnpm
3. Installs dependencies and builds the project
4. Installs Lighthouse CI globally
5. Runs Lighthouse audits on key pages (home, tech stack, documentation)
6. Each page is tested 3 times for consistent results
7. Uploads results as GitHub artifacts (retained for 30 days)

**Optimization:** When triggered by deployment, this workflow reuses the build output from the deployment workflow rather than rebuilding, saving CI/CD time and ensuring the exact deployed version is audited. Manual triggers build the project to ensure audits can run standalone.

### Configuration

**Location:** `lighthouserc.json`

**Audited Categories:**

- 🚀 **Performance**: Core Web Vitals, load times, optimization metrics
- ♿ **Accessibility**: WCAG compliance, ARIA attributes, color contrast
- 🏆 **Best Practices**: HTTPS, console errors, deprecated APIs
- 🔍 **SEO**: Meta tags, structured data, mobile-friendliness

**Minimum Scores:** 90% for all categories (warning mode only - doesn't fail builds)

### Viewing Results

1. Navigate to the [Actions tab](https://github.com/FreeForCharity/ffcadmin.org/actions)
2. Select the latest "Lighthouse CI" workflow run
3. Download the "lighthouse-results" artifact
4. Extract and open the HTML reports in a browser

### Benefits

- Proactive monitoring of site performance and quality
- Early detection of accessibility issues
- Validation of SEO optimizations
- Historical tracking without blocking deployments

**Note:** This workflow runs in "warn" mode - it provides informational reports but will not fail or block deployments. This ensures continuous monitoring without impeding the deployment process.

### Common Issues and Fixes

**Issue: "no artifacts found" when downloading build artifact**

- **Cause:** The deploy workflow runs multiple times due to workflow_run triggers from both CI and CodeQL workflows. The first run often skips building (waiting for all checks), so no artifacts are created. The lighthouse workflow was trying to download from the first (skipped) run instead of building its own artifact.
- **Fix:** Removed artifact download dependency. The lighthouse workflow now always builds its own artifact by checking out code, installing dependencies, and building the project. This ensures reliability regardless of deployment workflow timing or artifact retention.

**Issue: "No files were found with the provided path: .lighthouseci"**

- **Cause:** The `.lighthouseci` directory wasn't being created (Lighthouse CI didn't run) or was empty, but the workflow tried to upload it anyway. The initial fix using `hashFiles('.lighthouseci/**') != ''` didn't work correctly as the pattern might not match files at the root level of the directory.
- **Fix:** Removed the complex `hashFiles` conditional and instead use the built-in `if-no-files-found: warn` parameter of `actions/upload-artifact@v5`, which properly handles the case when no files exist. The step now runs with `if: success() || failure()` to always attempt upload, but gracefully warns if no files are found instead of failing.

**Issue: Workflow fails silently without clear error message**

- **Fix:** Added verification steps that check if build output exists and if Lighthouse results were generated, providing clear error messages for debugging

## update-sites-data.yml - Sites List Data Automation

Automatically updates the Sites List with data from WHMCS, Cloudflare, and WPMUDEV systems.

### When it runs:

- On manual trigger via `workflow_dispatch`
- Scheduled: Weekly on Mondays at 8:00 AM UTC

### What it does:

**Update Data Job:**

1. Checks out the code
2. Sets up Node.js 20 and installs CSV parsing dependencies
3. Authenticates with GitHub CLI using `GH_PAT` secret
4. Triggers remote workflows in `FFC-Cloudflare-Automation-` repository:
   - WHMCS domain export workflow
   - DNS/Cloudflare domain summary export workflow
   - WPMUDEV sites/domains export workflow
5. Waits for all three remote workflows to complete
6. Downloads artifacts from completed workflows:
   - `whmcs_domains.csv` to `tmp_data/whmcs_domains/`
   - `domain_summary.csv` to `tmp_data/domain_summary/`
   - `wpmudev_domains.csv` to `tmp_data/wpmudev/wpmudev-domain-inventory/`
7. Runs `scripts/update-sites-data.mjs` to merge and process data:
   - Merges data from all three sources
   - Performs automated site health checks (HTTP status, redirects, errors)
   - Categorizes sites by status (Active, Transferred, Expired, Fraud)
   - Updates `docs/sites_list.csv` with complete merged data
8. Creates a pull request with the updated data

### Data Sources and Integration:

**WHMCS Integration:**

- Provides domain registration status and customer information
- Maps to `In WHMCS` column and `Status` field

**Cloudflare Integration:**

- Provides DNS configuration and IP address information
- Maps to `In Cloudflare`, `Cloudflare IP`, and `Server In Use` columns
- Enables detection of proxy configurations and DNS issues

**WPMUDEV Integration:**

- Provides WordPress site management and hosting information
- Maps to `In WPMUDEV` column
- Helps identify WordPress-managed sites

**Site Health Automation:**

- Automated HTTP checks for each domain
- Reports status as: Live (200), Redirect (3xx), Error (4xx/5xx), or Unreachable
- Runs during data update process with 5-second timeout per site
- Processes sites in chunks of 10 to avoid overwhelming network

### Output:

The workflow generates an updated `docs/sites_list.csv` file with columns:

- Section, Domain, Status
- In WHMCS, In Cloudflare, In WPMUDEV
- Server In Use, Old Server Abandoned?, Notes
- Cloudflare IP, Repo URL, Site Health, Priority

The Sites List page (`/sites-list`) displays this data in categorized tables:

- **Active/Master List** - Active, Pending, and Unknown status domains
- **Transferred Away (TR)** - Domains transferred to another registrar
- **Expired/Cancelled (EX)** - Expired, cancelled, or terminated domains
- **Fraudulent/High Risk (FR)** - Domains marked as Fraud in WHMCS

### Benefits:

- **Automated data synchronization** from multiple sources
- **Real-time site health monitoring** with automated checks
- **Categorized organization** for better site management
- **Audit trail** via pull request workflow
- **Reduced manual data entry** and human error

### Required Secrets:

- `GH_PAT` - Personal Access Token with workflow and repo permissions for triggering remote workflows and creating pull requests

## Workflow Summary

| Workflow              | Trigger                              | Purpose                         | Dependencies                |
| --------------------- | ------------------------------------ | ------------------------------- | --------------------------- |
| ci.yml                | PRs and pushes to main               | Run tests and verify builds     | None                        |
| codeql-analysis.yml   | PRs, pushes to main, and weekly      | Security vulnerability scanning | None                        |
| deploy.yml            | After CI and CodeQL complete on main | Deploy to GitHub Pages          | ci.yml, codeql-analysis.yml |
| lighthouse.yml        | After successful deployment on main  | Performance and quality audits  | deploy.yml                  |
| update-sites-data.yml | Manual trigger, weekly schedule      | Update Sites List data          | External workflows          |

### Workflow Execution Order

When code is pushed to `main`:

1. **CI - Build and Test** and **CodeQL Security Analysis** run in parallel
2. When **either** workflow completes, **Deploy to GitHub Pages** is triggered
3. Deploy workflow's first step verifies **both** CI and CodeQL succeeded on the same commit
4. If verification passes, deployment proceeds; otherwise, deployment fails immediately
5. After successful deployment, **Lighthouse CI** runs to audit the deployed site

**Implementation Detail:** GitHub Actions `workflow_run` with multiple workflows triggers when any one completes. To ensure both workflows succeed before deployment, the deploy workflow includes an explicit API-based verification step that checks the status of both workflows on the current commit before proceeding.

This sequential execution ensures:

- Code is fully validated before deployment
- No broken code reaches production
- Security vulnerabilities are caught before deployment
- Performance and quality metrics are tracked after deployment

All workflows (except Lighthouse) must pass for pull requests to be merged into the main branch. Lighthouse runs post-deployment for monitoring and doesn't block deployments.
