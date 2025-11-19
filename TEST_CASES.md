# Test Cases Documentation

## Overview

This document outlines the test cases for the FFC Admin CI/CD pipeline and static site generation.

## CI/CD Pipeline Overview

The deployment pipeline is defined in `.github/workflows/deploy.yml` and consists of:

1. **Build Job**: Checks out code, installs dependencies, builds Next.js site
2. **Deploy Job**: Deploys the built site to GitHub Pages

## Test Categories

### 1. Build Output Tests

These tests verify that the build process produces the correct output structure.

#### Test Case 1.1: Build Creates Output Directory

- **Purpose**: Verify that `pnpm run build` creates the `out/` directory
- **Expected Result**: `out/` directory exists after build
- **Rationale**: The build must produce output for deployment to succeed

#### Test Case 1.2: Build Output Contains Required Files

- **Purpose**: Verify all essential files are present in the build output
- **Expected Result**: `out/` directory contains:
  - `index.html` (home page)
  - `tech-stack/index.html` (tech stack page)
  - `_next/` directory (Next.js assets)
  - `404.html` (error page)
- **Rationale**: Missing files would break the deployed site

### 2. GitHub Pages Configuration Tests

These tests ensure the site is properly configured for GitHub Pages deployment.

#### Test Case 2.1: .nojekyll File Exists

- **Purpose**: Verify `.nojekyll` file is present in build output
- **Expected Result**: `out/.nojekyll` file exists
- **Rationale**: Without this file, GitHub Pages Jekyll processing would break Next.js assets (files starting with `_next`)

#### Test Case 2.2: Next.js Export Configuration

- **Purpose**: Verify Next.js is configured for static export
- **Expected Result**: `next.config.js` contains:
  - `output: 'export'`
  - `images: { unoptimized: true }`
  - `trailingSlash: true`
- **Rationale**: Incorrect configuration would prevent static site generation or cause routing issues

### 3. SEO and Metadata Tests

These tests verify that SEO-related files are properly generated.

#### Test Case 3.1: robots.txt Exists

- **Purpose**: Verify `robots.txt` is present in build output
- **Expected Result**: `out/robots.txt` file exists
- **Rationale**: Required for search engine crawling directives

#### Test Case 3.2: sitemap.xml Exists

- **Purpose**: Verify `sitemap.xml` is present in build output
- **Expected Result**: `out/sitemap.xml` file exists
- **Rationale**: Required for search engine indexing

### 4. Route Generation Tests

These tests verify that all defined routes are properly generated as static pages.

#### Test Case 4.1: Home Page Generation

- **Purpose**: Verify home page is generated as static HTML
- **Expected Result**: `out/index.html` exists and contains expected content
- **Rationale**: Home page is the entry point to the site

#### Test Case 4.2: Tech Stack Page Generation

- **Purpose**: Verify tech stack page is generated as static HTML
- **Expected Result**: `out/tech-stack/index.html` exists
- **Rationale**: All app routes must be statically generated

### 5. Configuration Validation Tests

These tests validate the project configuration files.

#### Test Case 5.1: Package.json Node Version

- **Purpose**: Verify Node.js version requirement matches CI
- **Expected Result**: `package.json` specifies `node >= 20.0.0`
- **Rationale**: Ensures consistency between local dev and CI environment

#### Test Case 5.2: Package Manager Lock File

- **Purpose**: Verify `pnpm-lock.yaml` is present and valid
- **Expected Result**: `pnpm-lock.yaml` exists and is parseable
- **Rationale**: Ensures reproducible builds in CI

### 6. Lighthouse Configuration Tests

These tests verify that the Lighthouse CI performance monitoring is properly configured.

#### Test Case 6.1: Lighthouse Configuration File Exists

- **Purpose**: Verify `lighthouserc.json` configuration file is present
- **Expected Result**: `lighthouserc.json` exists and is valid JSON
- **Rationale**: Required for Lighthouse CI to run audits

#### Test Case 6.2: Lighthouse Configuration Structure

- **Purpose**: Verify Lighthouse configuration has correct structure
- **Expected Result**: Configuration includes:
  - `ci.collect` with `staticDistDir: './out'`
  - `ci.assert` with assertions for performance, accessibility, best practices, and SEO
  - `ci.collect.numberOfRuns >= 3` for consistent results
  - Multiple URL paths for key pages
- **Rationale**: Proper configuration ensures meaningful performance audits

#### Test Case 6.3: Lighthouse Workflow Exists

- **Purpose**: Verify Lighthouse CI workflow file is present and properly configured
- **Expected Result**: `.github/workflows/lighthouse.yml` exists and:
  - Contains `name: Lighthouse CI`
  - Triggers on `workflow_run` after deployment
  - Includes steps to build project and run Lighthouse
- **Rationale**: Ensures automated performance monitoring runs after deployments

## Test Execution

### Running Tests Locally

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch
```

### Running Tests in CI

Tests are automatically run as part of the GitHub Actions workflow before deployment.

## Test Implementation

### Framework

- **Jest**: JavaScript testing framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom DOM matchers

### Test File Structure

```
__tests__/
├── build-output.test.js        # Build output tests
├── github-pages-config.test.js # GitHub Pages configuration tests
├── seo-metadata.test.js        # SEO and metadata tests
├── route-generation.test.js    # Route generation tests
├── config-validation.test.js   # Configuration validation tests
└── lighthouse-config.test.js   # Lighthouse configuration tests
```

## Coverage Goals

- Minimum 80% code coverage
- 100% coverage of critical configuration files
- All CI/CD pipeline steps verified by tests

## Maintenance

- Tests should be run before every commit
- Add new tests when adding new pages or routes
- Update tests when modifying CI/CD pipeline configuration
- Review and update test cases quarterly

## References

- [Next.js Testing Documentation](https://nextjs.org/docs/testing)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library Documentation](https://testing-library.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
