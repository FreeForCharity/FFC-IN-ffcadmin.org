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
5. Runs linter with `pnpm run lint`
6. Builds the project with `pnpm run build`
7. Verifies build output directory is created
8. Validates critical files exist (index.html, .nojekyll, 404.html)
9. Runs tests with `pnpm test`

This workflow ensures that all code changes pass tests and build successfully before being merged. The pnpm cache significantly reduces CI time on subsequent runs.

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

Automatically builds and deploys the Next.js static site to GitHub Pages when changes are pushed to the `main` branch.

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
7. Uploads the `out/` directory as a Pages artifact
8. Deploys to GitHub Pages

### Output

The workflow exports a fully static site compatible with GitHub Pages, including:
- `.nojekyll` file to prevent Jekyll processing
- Static HTML files for all routes
- Optimized JavaScript bundles
- SEO files (robots.txt, sitemap.xml)

## Workflow Summary

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| ci.yml | PRs and pushes to main | Run tests and verify builds |
| codeql-analysis.yml | PRs, pushes to main, and weekly | Security vulnerability scanning |
| deploy.yml | Pushes to main only | Deploy to GitHub Pages |

All workflows must pass for pull requests to be merged into the main branch.
