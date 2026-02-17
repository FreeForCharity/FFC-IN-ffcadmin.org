# GitHub Pages Deployment Guide

## Configuration Summary

This Next.js site is configured for static export and deployment to GitHub Pages.

## Next.js Configuration (`next.config.ts`)

```javascript
const nextConfig = {
  output: 'export', // Enables static HTML export
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Ensures URLs work properly on GitHub Pages
}
```

### Key Settings Explained

1. **`output: 'export'`**: Tells Next.js to generate a static HTML export in the `out/` directory
   - All pages are pre-rendered at build time
   - No Node.js server required
   - Compatible with GitHub Pages static hosting

2. **`images: { unoptimized: true }`**: Disables Next.js Image Optimization API
   - Required because GitHub Pages doesn't support dynamic image optimization
   - Images are served as-is from the static export

3. **`trailingSlash: true`**: Adds trailing slashes to all URLs
   - Ensures `/tech-stack/` works correctly on GitHub Pages
   - Prevents 404 errors when navigating directly to routes

### Custom Domain Configuration

The site is configured to use a **custom domain** instead of a repository-based path:

- No `basePath` is set in the configuration
- **Primary URL**: `https://ffcadmin.org` (custom domain configured in GitHub Pages)
- **Backup URL**: `https://freeforcharity.github.io/ffcadmin.org/` (GitHub Pages default path, for testing)
- All routes and assets are served from the root path (e.g., `/_next/static/...`)
- Custom domain configured in GitHub Pages settings (Repository → Settings → Pages → Custom domain)

## GitHub Pages Requirements

### 1. `.nojekyll` File (✅ Included)

Located in `public/.nojekyll`, this empty file is automatically copied to the `out/` directory during build.

**Why it's needed**:

- GitHub Pages uses Jekyll by default to process sites
- Jekyll ignores files/folders starting with underscore (like `_next/`)
- The `.nojekyll` file disables Jekyll processing
- Without it, the site's JavaScript and CSS won't load

### 2. GitHub Actions Workflow (✅ Included)

Located at `.github/workflows/deploy.yml`, this workflow:

- Triggers on push to `main` branch
- Uses Node.js 20 LTS and pnpm 9.0.0
- Builds the site with `pnpm run build`
- Uses `actions/upload-pages-artifact@v3` to create the GitHub Pages artifact
  - **Note**: Version 3 is used (not v4) because v4 excludes dotfiles by default
  - The `.nojekyll` file is required for GitHub Pages to serve the `_next` directory correctly
- Deploys the `out/` directory to GitHub Pages

### 3. Repository Settings

To enable deployment:

1. Go to repository Settings > Pages
2. Under "Build and deployment", set Source to **"GitHub Actions"**
3. The workflow will automatically deploy on the next push to `main`

## Build Output Structure

```
out/
├── .nojekyll              # Prevents Jekyll processing
├── index.html             # Home page
├── tech-stack/
│   └── index.html         # Tech stack page
├── _next/                 # JavaScript/CSS bundles
│   ├── static/
│   └── [build-id]/
├── robots.txt             # Search engine directives
├── sitemap.xml            # Site map for SEO
└── 404.html               # Custom 404 page
```

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build (requires a static server)
npx serve out
```

## Verification Checklist

- ✅ `output: 'export'` configured in `next.config.ts`
- ✅ `images: { unoptimized: true }` configured
- ✅ `trailingSlash: true` configured
- ✅ `.nojekyll` file in `public/` directory
- ✅ GitHub Actions workflow in `.github/workflows/deploy.yml`
- ✅ All pages render as static HTML
- ✅ SEO files (robots.txt, sitemap.xml) included
- ✅ No server-side features used (all static)

## Troubleshooting

### CSS/JS not loading

- Ensure `.nojekyll` file is present in the output
- Check that GitHub Pages source is set to "GitHub Actions"

### 404 errors on page refresh

- Verify `trailingSlash: true` is set in `next.config.ts`
- Check that routes use trailing slashes (e.g., `/tech-stack/` not `/tech-stack`)

### Deployment fails

- Check GitHub Actions logs for build errors
- Ensure pnpm lockfile is committed
- Verify Node.js version is 20 or higher

## References

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Deploying Next.js to GitHub Pages](https://nextjs.org/docs/app/building-your-application/deploying#github-pages)
