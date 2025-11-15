# GitHub Actions Workflows

## deploy.yml

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
