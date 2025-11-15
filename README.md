# FFC Admin Webpage

## Organization
**Free For Charity (FFC)** - A charitable organization

## Purpose
This repository contains the administrative webpage for Free For Charity. The site serves as a central hub for FFC administrative functions and information.

### Main Calls to Action (CTAs)
- Access administrative dashboard
- View organizational information
- Manage charity operations

## Deployment
**Status:** ✅ Deployed to GitHub Pages  
**URL:** https://freeforcharity.github.io/ffcadmin.org/

The site is deployed and accessible via GitHub Pages. The site is fully responsive and works on mobile, tablet, and desktop devices.

## Responsive Design
**Status:** ✅ **Fully Responsive**

The site is optimized for all device sizes:
- ✅ Mobile phones (< 768px): Hamburger menu navigation
- ✅ Tablets (768px - 1024px): Full navigation, 2-column layout
- ✅ Desktops (> 1024px): Full navigation, 3-column layout

### Troubleshooting
If the site appears unstyled or shows desktop navigation on mobile:

**Desktop:**
1. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear cache**: Browser settings → Clear browsing data

**iPhone/iPad:**
1. Long press refresh button in Safari → "Request Desktop Website" → reload
2. Settings → Safari → Clear History and Website Data

**Android:**
1. Chrome menu (⋮) → Settings → Privacy → Clear browsing data → Cached images and files
2. Restart browser

See [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md) for detailed troubleshooting

### Testing Results
For detailed responsive design testing results, see [RESPONSIVE_TESTING_RESULTS.md](./RESPONSIVE_TESTING_RESULTS.md)

## Testing

This project includes comprehensive tests for the CI/CD pipeline and build output.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Coverage

The test suite covers:
- Build output validation (files and directory structure)
- GitHub Pages configuration (`.nojekyll`, Next.js config)
- SEO metadata (robots.txt, sitemap.xml)
- Static route generation (home page, tech stack page)
- Configuration validation (package.json, lock files)

For detailed test case documentation, see [TEST_CASES.md](./TEST_CASES.md).
