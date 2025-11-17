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

- **After successful completion** of both:
  - `CI - Build and Test` workflow
  - `CodeQL Security Analysis` workflow
- On manual trigger via `workflow_dispatch`

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
7. Uploads the `out/` directory as a Pages artifact
8. Deploys to GitHub Pages

### Output

The workflow exports a fully static site compatible with GitHub Pages, including:

- `.nojekyll` file to prevent Jekyll processing
- Static HTML files for all routes
- Optimized JavaScript bundles
- SEO files (robots.txt, sitemap.xml)

## Workflow Summary

| Workflow            | Trigger                              | Purpose                         | Dependencies                |
| ------------------- | ------------------------------------ | ------------------------------- | --------------------------- |
| ci.yml              | PRs and pushes to main               | Run tests and verify builds     | None                        |
| codeql-analysis.yml | PRs, pushes to main, and weekly      | Security vulnerability scanning | None                        |
| deploy.yml          | After CI and CodeQL complete on main | Deploy to GitHub Pages          | ci.yml, codeql-analysis.yml |

### Workflow Execution Order

When code is pushed to `main`:

1. **CI - Build and Test** and **CodeQL Security Analysis** run in parallel
2. Once **both** complete successfully, **Deploy to GitHub Pages** runs
3. If either CI or CodeQL fails, deployment is skipped

This sequential execution ensures:

- Code is fully validated before deployment
- No broken code reaches production
- Security vulnerabilities are caught before deployment

All workflows must pass for pull requests to be merged into the main branch.
