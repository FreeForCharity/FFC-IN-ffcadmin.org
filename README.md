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
**Status:** In Development  
**URL:** Not yet deployed to a live domain

The site is currently under development and is not yet publicly accessible.

## Development Status
**Current Status:** ⚠️ **Not Fully Functional**

This site is still in active development. The following items are pending:
- [ ] All links are functional
- [ ] All CTAs are clear and operational
- [ ] Live domain name configured for deployment
- [ ] Full functionality testing completed

Once all links work, CTAs are clear and functional, and the site has a live domain name as its deployment target, this status will be updated to "Fully Functional."

## Analytics

This site uses **Microsoft Clarity** for user behavior analytics to help improve the user experience.

### Microsoft Clarity Setup

Microsoft Clarity is integrated into all pages through the root layout (`app/layout.tsx`). To configure your Clarity project:

1. Sign up for a free Microsoft Clarity account at [https://clarity.microsoft.com/](https://clarity.microsoft.com/)
2. Create a new project and obtain your Clarity Project ID
3. Set the `NEXT_PUBLIC_CLARITY_PROJECT_ID` environment variable in your deployment environment or create a `.env.local` file with your Clarity Project ID:
   ```
   NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id_here
   ```
4. Rebuild and deploy the site

The Clarity tracking script is loaded using Next.js's `Script` component with the `afterInteractive` strategy to ensure it doesn't block page rendering.

**Note:** As documented in the [Technology Stack](./app/tech-stack/page.tsx), this site prioritizes privacy and compliance. In production deployments, analytics should be consent-gated according to CCPA/CPRA and GDPR requirements using Cloudflare Zaraz or similar consent management solutions.

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
