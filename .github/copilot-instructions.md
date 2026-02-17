# Copilot Agent Instructions for ffcadmin.org

This repository contains the **Free For Charity (FFC) Admin Portal**, a Next.js 14 static site deployed to GitHub Pages. This document provides essential guidance for Copilot coding agents to work efficiently with this codebase.

## Table of Contents

- [Project Overview](#project-overview)
- [Development Environment](#development-environment)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Code Style & Quality Standards](#code-style--quality-standards)
- [Development Workflow](#development-workflow)
- [Testing Strategy](#testing-strategy)
- [Build & Deployment](#build--deployment)
- [Common Patterns & Conventions](#common-patterns--conventions)
- [Important Constraints](#important-constraints)
- [Troubleshooting](#troubleshooting)
- [Documentation Structure](#documentation-structure)

## Project Overview

**Purpose:** Administrative portal and technology showcase for Free For Charity, a nonprofit technology initiative.

**Live Site:** https://ffcadmin.org

**Key Characteristics:**

- Static site generation (no server-side rendering)
- Deployed to GitHub Pages with custom domain
- Fully responsive design (mobile, tablet, desktop)
- GPG-signed commits required for all merges to main
- Comprehensive CI/CD with automated testing and security scanning

## Development Environment

### Prerequisites

```bash
# Required versions (specified in package.json)
Node.js >= 20.0.0
pnpm 9.0.0
```

### Quick Start

```bash
# Install pnpm globally if needed
npm install -g pnpm@9.0.0

# Install dependencies (always use frozen lockfile)
pnpm install --frozen-lockfile

# Run development server
pnpm run dev

# Build for production (generates /out directory)
pnpm run build

# Preview production build
npx serve out
```

### Available Commands

```bash
pnpm run dev              # Development server on localhost:3000
pnpm run format           # Format code with Prettier (run FIRST)
pnpm run format:check     # Check code formatting (used in CI)
pnpm run lint             # ESLint validation (run AFTER format)
pnpm run build            # Production build (static export to /out)
pnpm run test             # Run Jest test suite
pnpm run test:watch       # Jest in watch mode
pnpm run test:coverage    # Generate coverage report
```

### Critical: Order of Operations

When making changes, **always** follow this order (matches CI pipeline):

```bash
pnpm run format        # 1. Format first
pnpm run lint          # 2. Lint second
pnpm run build         # 3. Build third
pnpm test              # 4. Test last
```

**Why this order?**

- Prettier formats code before ESLint checks it (avoids style conflicts)
- ESLint validates code quality before building
- Build compiles TypeScript and generates static export
- Tests validate the final build output

**Never** run lint before format, as this causes conflicts between Prettier and ESLint style rules.

## Architecture & Tech Stack

### Core Technologies

- **Framework:** Next.js 14.2 (App Router)
- **UI Library:** React 18.3
- **Styling:** Tailwind CSS 3.4
- **Language:** TypeScript 5 (strict mode enabled)
- **Package Manager:** pnpm 9.0.0
- **Testing:** Jest 30 + React Testing Library
- **Linting:** ESLint (next/core-web-vitals) + Prettier
- **Analytics:** Google Tag Manager (GTM-WMZH965Q) with Microsoft Clarity

### Static Site Generation

**Critical:** This is a **static export** site configured with:

```javascript
// next.config.ts
{
  output: 'export',              // Static HTML generation
  images: { unoptimized: true }, // No dynamic image optimization
  trailingSlash: true,           // Required for GitHub Pages routing
}
```

**Implications:**

- ❌ No server-side rendering (SSR)
- ❌ No API routes
- ❌ No dynamic image optimization
- ❌ No ISR (Incremental Static Regeneration)
- ✅ All pages pre-rendered at build time
- ✅ Deploy as static files to any CDN

### Directory Structure

```
/src                      # Source code root
  /app                   # Next.js App Router pages
    /[route-name]        # Route-based pages (tech-stack, documentation, etc.)
    layout.tsx           # Root layout with GTM integration
    page.tsx             # Home page
    globals.css          # Global styles and Tailwind imports
  /components            # Shared React components (Navigation, Footer, CookieConsent)
  /data                  # Shared data files (training-plan-data.ts)
  /lib                   # Utility functions (assetPath.ts)
/public                  # Static assets (copied to /out during build)
  /Images               # Image assets (PNG, WebP)
  /Svgs                 # SVG assets (logos)
  .nojekyll             # CRITICAL: Prevents Jekyll processing on GitHub Pages
  robots.txt            # SEO configuration
  sitemap.xml           # Site map
/__tests__               # Jest test files (*.test.js)
/.github/workflows       # CI/CD pipelines (ci.yml, deploy.yml, codeql-analysis.yml)
/scripts                 # Utility scripts
```

## Code Style & Quality Standards

### TypeScript

- **Strict mode enabled** (`tsconfig.json`)
- All React components use `.tsx` extension
- Type safety enforced at build time
- Path aliases configured: `@/*` maps to `./src/*`

### ESLint Configuration

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off"
  }
}
```

**What's enforced:**

- Next.js best practices
- React Hooks rules
- Core Web Vitals performance
- Accessibility checks
- Prettier integration (no style conflicts)

### Prettier Configuration

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

**Automatic formatting on save is expected.** Always run `pnpm run format:check` before committing.

### Commit Requirements

**CRITICAL:** All commits to `main` branch **must be GPG-signed**. This is enforced by branch protection rules.

- Repository uses automated commit signing via GitHub Actions
- Private key stored in `GPG_PRIVATE_KEY` repository secret
- Public key in `gpg-keys/public-key.asc`
- See `QUICK_START.md` for setup instructions

## Development Workflow

### Making Changes

1. **Create a feature branch** (never commit directly to main)
2. **Make minimal, focused changes** (this is a small, well-documented project)
3. **Run checks in the correct order (matches CI pipeline):**
   ```bash
   pnpm run format        # 1. Format code first
   pnpm run lint          # 2. Check code quality
   pnpm run build         # 3. Build and compile
   pnpm test              # 4. Run tests
   ```
   **Critical:** Always run format BEFORE lint to avoid Prettier/ESLint conflicts.
4. **Commit with descriptive messages** (GPG signing handled automatically by CI)

### CI/CD Pipeline

**Three workflows run automatically:**

1. **ci.yml** (Build & Test)
   - Triggers: PRs and pushes to main
   - Steps: Install deps → Format check → Lint → Build → Verify output → Test
   - Must pass before merge

2. **codeql-analysis.yml** (Security Scanning)
   - Triggers: PRs, pushes to main, weekly schedule
   - Performs security vulnerability scanning
   - Results in GitHub Security tab

3. **deploy.yml** (GitHub Pages Deployment)
   - Triggers: Pushes to main only
   - Steps: Build → Test → Deploy to GitHub Pages
   - Deploys `/out` directory to https://ffcadmin.org

**All workflows must pass for PRs to be mergeable.**

### Code Review Guidelines

When reviewing or modifying code:

- **Preserve existing patterns** (this project has established conventions)
- **Maintain responsiveness** (test mobile, tablet, desktop breakpoints)
- **Keep bundle size small** (this is a static site)
- **Update documentation** if changing architecture or workflows
- **Add tests** for new functionality (see `__tests__/` for patterns)

## Testing Strategy

### Test Framework: Jest + React Testing Library

**Current coverage:** 62 tests across 7 test suites, all passing

### Test Categories

1. **Build Output Validation** (`build-output.test.js`)
   - Verifies `/out` directory structure
   - Checks critical files exist
   - Validates static asset generation

2. **Configuration Validation** (`config-validation.test.js`)
   - Package.json integrity
   - Lock file validation

3. **GitHub Pages Config** (`github-pages-config.test.js`)
   - `.nojekyll` file presence
   - Next.js static export config

4. **Responsive Design** (`responsive-design.test.js`, `mobile-responsiveness.test.js`)
   - Tailwind breakpoints
   - Mobile navigation
   - Responsive layout validation

5. **Route Generation** (`route-generation.test.js`)
   - Static page generation
   - Route structure validation

6. **SEO Metadata** (`seo-metadata.test.js`)
   - robots.txt validation
   - sitemap.xml presence

### Running Tests

```bash
# Run all tests (fast)
pnpm test

# Watch mode (for development)
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Writing New Tests

**Pattern:** Tests focus on **build output validation**, not component behavior. This ensures the static export is correct.

Example:

```javascript
test('verifies critical file exists', () => {
  expect(fs.existsSync('out/index.html')).toBe(true)
})
```

## Build & Deployment

### Production Build Process

```bash
pnpm run build
```

**What happens:**

1. Next.js compiles TypeScript
2. Tailwind CSS processes styles
3. Static HTML generated for all routes
4. JavaScript bundles optimized and fingerprinted
5. Assets copied to `/out` directory
6. `.nojekyll` file included (prevents Jekyll on GitHub Pages)

### Deployment

**Automatic:** Pushing to `main` triggers deployment via `deploy.yml` workflow.

**Manual verification:**

1. Check GitHub Actions for successful build
2. Wait 2-3 minutes for CDN propagation
3. Test site in incognito mode (fresh cache)
4. Verify on multiple devices/browsers

### GitHub Pages Configuration

**Critical files for GitHub Pages:**

- `public/.nojekyll` - Prevents Jekyll from ignoring `_next/` directory
- `next.config.ts` - Configures static export
- `out/` directory - Generated by build, deployed to Pages

**URLs:**

- Primary: https://ffcadmin.org (custom domain)
- Backup: https://freeforcharity.github.io/ffcadmin.org/

**DNS Configuration:**

- Custom domain DNS is routed by CloudFlare in proxy mode
- CloudFlare acts as a CDN and provides additional caching layer
- DNS changes may take additional time to propagate through CloudFlare's network

## Common Patterns & Conventions

### Component Structure

```tsx
// All components follow this pattern:
import type { ComponentProps } from 'react'

export default function ComponentName() {
  return <div className="tailwind-classes">{/* Component content */}</div>
}
```

### Layout Components

- **Navigation** (`src/components/Navigation.tsx`): Responsive nav with hamburger menu
- **Footer** (`src/components/Footer.tsx`): Copyright and links
- **CookieConsent** (`src/components/CookieConsent.tsx`): GDPR-compliant cookie banner

### Tailwind CSS Usage

**Responsive Design Pattern:**

```jsx
<div className="
  px-4 py-8              {/* Mobile: base styles */}
  md:px-8                {/* Tablet: 768px+ */}
  lg:px-16               {/* Desktop: 1024px+ */}
">
```

**Breakpoints:**

- Mobile: `< 768px` (base styles, no prefix)
- Tablet: `768px - 1024px` (use `md:` prefix)
- Desktop: `> 1024px` (use `lg:` prefix)

### Page Structure

Every page follows this pattern:

```tsx
// src/app/[route-name]/page.tsx
export default function PageName() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Page Title</h1>
      {/* Page content */}
    </div>
  )
}
```

### Analytics Integration

Google Tag Manager is loaded in `src/app/layout.tsx`:

- Container ID: `GTM-WMZH965Q`
- Cookie consent managed by `CookieConsent` component
- Consent events pushed to `dataLayer` for GDPR compliance

## Important Constraints

### What You CANNOT Do

❌ **Use server-side features:**

- No API routes (`/app/api`)
- No server components with dynamic data fetching
- No `getServerSideProps` or server actions
- No middleware with dynamic logic

❌ **Use Next.js Image Optimization:**

- `unoptimized: true` is required for static export
- Use standard `<img>` tags or unoptimized `<Image>` component

❌ **Deploy without `.nojekyll`:**

- GitHub Pages uses Jekyll by default
- Jekyll ignores `_next/` directories
- Without `.nojekyll`, CSS and JS won't load

❌ **Remove `trailingSlash: true`:**

- Required for proper routing on GitHub Pages
- Prevents 404 errors on page refresh

❌ **Commit unsigned commits to main:**

- Branch protection requires GPG signatures
- Use GitHub Actions for automated signing

### What You SHOULD Do

✅ **Keep it static:**

- All data must be embedded at build time
- Use static imports for content
- Pre-render all pages

✅ **Test the build output:**

- Always run `pnpm run build` before committing
- Verify critical files in `/out` directory
- Check for console errors in production build

✅ **Maintain responsive design:**

- Test all breakpoints (mobile, tablet, desktop)
- Use Tailwind's responsive utilities
- Check mobile navigation works

✅ **Update documentation:**

- Comprehensive docs exist in repository root
- Update relevant `.md` files when changing architecture
- Keep `README.md` accurate

✅ **Follow existing patterns:**

- Match component structure
- Use established naming conventions
- Maintain code style consistency

## Troubleshooting

### Common Issues

**Problem:** CSS/JS not loading after deployment

- **Cause:** Missing `.nojekyll` file
- **Solution:** Verify `public/.nojekyll` exists and is copied to `out/`

**Problem:** 404 errors on page refresh

- **Cause:** Missing `trailingSlash: true`
- **Solution:** Check `next.config.ts` has `trailingSlash: true`

**Problem:** Build fails with type errors

- **Cause:** TypeScript strict mode violation
- **Solution:** Fix type errors, don't disable strict mode

**Problem:** Tests fail after changes

- **Cause:** Build output doesn't match expected structure
- **Solution:** Run `pnpm run build` and check `out/` directory

**Problem:** Responsive design broken

- **Cause:** Tailwind breakpoints not applied correctly
- **Solution:** Use `md:` for tablet, `lg:` for desktop, base for mobile

**Problem:** Commit rejected (unsigned)

- **Cause:** Direct commit to main or missing GPG signature
- **Solution:** Use PRs (CI will sign automatically)

### Cache Issues on GitHub Pages

**GitHub Pages uses aggressive caching:**

- CDN propagation takes 1-5 minutes
- Browser cache may show old version
- Always test in incognito mode after deployment
- See `README.md` "Understanding GitHub Pages Caching" section for details

### Getting Help

**Documentation:**

- `README.md` - Main overview
- `QUICK_START.md` - 5-minute GPG setup
- `CODE_QUALITY.md` - Standards and tooling
- `DEPLOYMENT.md` - GitHub Pages configuration
- `RESPONSIVE_DESIGN.md` - Mobile/tablet/desktop guide
- `TEST_CASES.md` - Testing documentation
- `.github/workflows/README.md` - CI/CD documentation

**For Issues:**

- Check existing documentation first
- Review `ISSUE_RESOLUTION.md` for known problems
- Search closed issues in GitHub
- Open new issue with detailed description

## Documentation Structure

**This repository has excellent documentation.** Always read relevant docs before making changes:

### Getting Started

- `README.md` - Project overview, deployment status, features
- `QUICK_START.md` - GPG signing setup (5 minutes)

### Development

- `CODE_QUALITY.md` - Linting, testing, tooling standards
- `TEST_CASES.md` - Test strategy and documentation
- `IMPLEMENTATION_ISSUES.md` - Known technical debt

### Deployment

- `DEPLOYMENT.md` - GitHub Pages setup and configuration
- `.github/workflows/README.md` - CI/CD pipeline documentation

### Security

- `GPG_SIGNING.md` - Technical GPG documentation
- `SETUP_AUTO_SIGNING.md` - Detailed GPG setup guide
- `AUTO_SIGN_TEST.md` - Testing GPG signatures
- `gpg-keys/README.md` - GPG key information

### Design

- `RESPONSIVE_DESIGN.md` - Mobile/tablet/desktop support
- `RESPONSIVE_TESTING_RESULTS.md` - Test results

### Troubleshooting

- `ISSUE_RESOLUTION.md` - Known issues and solutions

### Public Pages

The site itself has documentation pages:

- `/documentation` - Public documentation center
- `/tech-stack` - Technology stack overview
- `/privacy-policy` - Privacy policy
- `/cookie-policy` - Cookie policy

## Quick Reference

### Most Important Files

```
next.config.ts          # Static export configuration (DO NOT CHANGE)
public/.nojekyll        # Required for GitHub Pages (DO NOT DELETE)
src/app/layout.tsx      # Root layout with GTM
tsconfig.json           # TypeScript strict mode
.eslintrc.json          # Linting rules
.prettierrc.json        # Code formatting
jest.config.js          # Test configuration
package.json            # Dependencies and scripts
```

### Most Important Commands

```bash
# Development
pnpm run dev            # Start dev server
pnpm run lint           # Check code quality
pnpm run format         # Format all files
pnpm test               # Run tests
pnpm run build          # Build for production

# Verification (run before committing)
pnpm run format:check   # Verify formatting
pnpm run lint           # Verify linting
pnpm test               # Verify tests pass
pnpm run build          # Verify build succeeds
```

### Decision Matrix: When to Modify What

| Scenario          | Action                        | Files to Modify                             |
| ----------------- | ----------------------------- | ------------------------------------------- |
| Add new page      | Create route directory        | `src/app/[route-name]/page.tsx`             |
| Update navigation | Modify Navigation component   | `src/components/Navigation.tsx`             |
| Change styles     | Update global CSS or Tailwind | `src/app/globals.css`, `tailwind.config.ts` |
| Add dependency    | Use pnpm                      | `package.json`, `pnpm-lock.yaml`            |
| Modify build      | Update Next.js config         | `next.config.ts` (BE CAREFUL)               |
| Add test          | Create test file              | `__tests__/[name].test.js`                  |
| Update CI/CD      | Modify workflow               | `.github/workflows/[workflow].yml`          |
| Change GPG key    | Update key files              | `gpg-keys/`, repository secrets             |

## Final Notes

**This is a well-structured, well-documented project.** The key to working efficiently here is:

1. **Read the documentation first** - Everything is documented
2. **Follow established patterns** - Consistency is valued
3. **Test frequently** - Build, lint, test before committing
4. **Keep it static** - No server-side features
5. **Maintain responsiveness** - Mobile-first approach
6. **Respect constraints** - GitHub Pages limitations are real
7. **Update docs** - Keep documentation in sync with code

**When in doubt:**

- Check `README.md` first
- Look at existing code for patterns
- Run `pnpm run build && pnpm test` to verify changes
- Review relevant documentation before making architectural changes

---

**Document Version:** 1.0
**Last Updated:** 2025-11-17
**Maintained By:** Free For Charity Development Team
