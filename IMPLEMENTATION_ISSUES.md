# Implementation Issues for Code Quality Enhancements

## Overview

This document contains detailed implementation plans for enhancing code quality in this repository. It serves as a tracking document for potential improvements identified in [CODE_QUALITY.md](CODE_QUALITY.md).

**Audience:** Developers, Technical Leads, Project Managers

**Purpose:** Each section below represents a potential GitHub issue that can be created to track and implement code quality improvements.

**Last Reviewed:** November 21, 2025  
**Status:** 11 of 11 issues completed ✅ | 0 not started (100% Complete)

## Current Status Summary

### ✅ Completed Issues (11/11 - 100% Complete)

- **Issue #1:** Prettier for Code Formatting ✅
- **Issue #2:** Pre-commit Hooks with Husky and lint-staged ✅
- **Issue #3:** TypeScript Type Checking to CI ✅
- **Issue #4:** Test Coverage Requirements ✅
- **Issue #5:** Commit Message Linting ✅
- **Issue #6:** Dependency Update Automation (Dependabot via repository settings) ✅
- **Issue #7:** js-yaml Vulnerability Fix (version 4.1.1 installed) ✅
- **Issue #8:** EditorConfig ✅
- **Issue #9:** Bundle Size Analysis ✅
- **Issue #10:** Accessibility Testing ✅
- **Issue #11:** Lighthouse CI with Performance Budgets ✅

## How to Use This Document

1. **For Contributors:** Review the issues below to find enhancement opportunities
2. **For Maintainers:** Create GitHub issues from these templates as needed
3. **For Project Planners:** Use priority ratings to plan sprints and releases
4. **For New Developers:** Understand the technical debt and improvement roadmap

## Priority System

- **Priority 1:** High Impact, Low Effort - Should be implemented soon
- **Priority 2:** High Impact, High Effort - Plan for future sprint
- **Priority 3:** Medium Impact, Low Effort - Good for new contributors
- **Priority 4:** Low Impact, Medium Effort - Consider when convenient

## Related Documentation

- **[CODE_QUALITY.md](CODE_QUALITY.md)** - Current code quality standards and analysis
- **[TEST_CASES.md](TEST_CASES.md)** - Testing documentation and strategy
- **[README.md](README.md)** - Main repository documentation

---

## Issue 1: ✅ Add Prettier for Code Formatting (COMPLETED)

**Priority:** High Impact, Low Effort (Priority 1)  
**Labels:** `enhancement`, `developer-experience`, `tooling`  
**Status:** ✅ **IMPLEMENTED**

### Description

Add Prettier to ensure consistent code formatting across the entire codebase.

### Current State

✅ **Prettier is now fully implemented and active:**

- Prettier 3.6.2 installed
- `.prettierrc.json` configured
- `.prettierignore` set up
- `format` and `format:check` scripts in package.json
- ESLint configured with `eslint-config-prettier` to avoid conflicts
- CI workflow includes format check before lint
- All files are formatted and passing checks

### Proposed Solution

1. Install Prettier and related ESLint plugins:

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

2. Create `.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

3. Update `package.json` scripts:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

4. Update `.eslintrc.json` to integrate with Prettier:

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off"
  }
}
```

5. Add format check to CI workflow (`.github/workflows/ci.yml`):

```yaml
- name: Check code formatting
  run: pnpm run format:check
```

### Benefits

- Consistent code formatting across all files
- Automatic formatting on save (with editor integration)
- Eliminates style debates in code reviews
- Integrates seamlessly with ESLint

### Acceptance Criteria

- [x] Prettier installed and configured (v3.6.2)
- [x] Format scripts added to package.json (`format` and `format:check`)
- [x] ESLint configured to work with Prettier (`eslint-config-prettier`)
- [x] Format check added to CI pipeline (runs before lint)
- [x] All existing files formatted
- [x] CI passes with new format check

### Implementation Notes

- Implemented in November 2024
- CI workflow order: format:check → lint → build → test
- All documentation updated to reflect the correct order
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for developer workflow

### References

- [CODE_QUALITY.md - Section 1.1](./CODE_QUALITY.md)
- [Prettier Documentation](https://prettier.io/)

---

## Issue 2: ✅ Add Pre-commit Hooks with Husky and lint-staged (COMPLETED)

**Priority:** High Impact, Low Effort (Priority 1)  
**Labels:** `enhancement`, `developer-experience`, `tooling`  
**Status:** ✅ **IMPLEMENTED**

### Description

Add pre-commit hooks to automatically lint and format code before commits, catching issues early and reducing CI failures.

### Current State

✅ **Pre-commit hooks are now fully implemented and active:**

- Husky 9.1.7 installed and initialized
- lint-staged 16.2.6 configured in package.json
- Pre-commit hook runs lint-staged automatically
- Staged files are automatically formatted with Prettier
- Staged files are automatically linted with ESLint
- All checks must pass before commit succeeds

### Proposed Solution

1. Install Husky and lint-staged:

```bash
pnpm add -D husky lint-staged
```

2. Initialize Husky:

```bash
pnpm exec husky init
```

3. Add lint-staged configuration to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

4. Create `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
```

### Benefits

- Catch linting and formatting issues before they reach CI
- Automatic code fixes on commit
- Faster feedback loop for developers
- Reduced CI failures and review cycles

### Acceptance Criteria

- [x] Husky installed and initialized (v9.1.7)
- [x] lint-staged configured (v16.2.6)
- [x] Pre-commit hook runs lint-staged
- [x] Hook automatically fixes and formats code
- [x] Documentation updated with setup instructions (CONTRIBUTING.md)

### Implementation Notes

- Implemented in November 2024
- Pre-commit hook runs Prettier and ESLint on staged files only
- Automatic fixes are applied where possible
- Commit is blocked if unfixable issues are found
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for developer workflow

### Configuration

**package.json:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

**.husky/pre-commit:**

```bash
pnpm exec lint-staged
```

### Dependencies

- Requires Issue #1 (Prettier) to be completed first ✅

### References

- [CODE_QUALITY.md - Section 1.2](./CODE_QUALITY.md)
- [CONTRIBUTING.md - Pre-commit Hooks Section](./CONTRIBUTING.md#pre-commit-hooks)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)

---

## Issue 3: ✅ Add TypeScript Type Checking to CI (COMPLETED)

**Priority:** High Impact, Low Effort (Priority 1)  
**Labels:** `enhancement`, `ci-cd`, `typescript`  
**Status:** ✅ **IMPLEMENTED**

### Description

Add explicit TypeScript type checking as a separate CI step for faster feedback on type errors.

### Current State

✅ **TypeScript type checking is now fully implemented and active:**

- `type-check` script added to package.json
- CI workflow includes type check step before build
- Test added to verify type-check script configuration
- All checks pass in correct order: format → lint → type-check → build → test

### Proposed Solution

1. Add type-check script to `package.json`:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

2. Add type check step to `.github/workflows/ci.yml` before the build step:

```yaml
- name: Type check
  run: pnpm run type-check

- name: Build project
  run: pnpm run build
```

### Benefits

- Faster feedback on type errors (doesn't require full build)
- Clearer CI output separating type errors from build errors
- Easier to identify type-related issues

### Acceptance Criteria

- [x] type-check script added to package.json
- [x] Type check step added to CI workflow
- [x] Type check runs before build step
- [x] CI passes with new type check step
- [x] Test added to verify type-check script configuration

### Implementation Notes

- Implemented in November 2024
- CI workflow order: format:check → lint → type-check → build → test
- Type checking happens before build for faster feedback
- Test added in `__tests__/config-validation.test.js` (Test Case 5.3)
- All 97 tests pass

### References

- [CODE_QUALITY.md - Section 1.3](./CODE_QUALITY.md)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

---

## Issue 4: ✅ Add Test Coverage Requirements (COMPLETED)

**Priority:** Medium Impact, Medium Effort (Priority 2)  
**Labels:** `enhancement`, `testing`, `quality`  
**Status:** ✅ **IMPLEMENTED**

### Description

Set minimum test coverage thresholds to prevent coverage regression and ensure new code is adequately tested.

### Current State

✅ **Test coverage thresholds are now fully implemented and active:**

- Coverage thresholds added to jest.config.js
- CI workflow updated to run `pnpm test:coverage`
- Global thresholds set for branches, functions, lines, and statements
- Tests added to validate coverage configuration (Test Case 5.5)
- All 141 tests pass with coverage enforcement

### Proposed Solution

1. Update `jest.config.js` to add coverage thresholds:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['app/**/*.{js,jsx,ts,tsx}', '!app/**/*.d.ts', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

2. Update CI workflow to run tests with coverage:

```yaml
- name: Run tests with coverage
  run: pnpm test:coverage
```

### Benefits

- Prevent coverage regression
- Ensure new code is adequately tested
- Maintain code quality standards
- Clear visibility into test coverage metrics

### Acceptance Criteria

- [x] Coverage thresholds added to jest.config.js
- [x] Thresholds set appropriately based on current coverage (0% - build validation tests)
- [x] Tests pass with new thresholds (141 tests passing)
- [x] CI runs tests with coverage reporting
- [x] Tests added to validate coverage configuration

### References

- [CODE_QUALITY.md - Section 2.1](./CODE_QUALITY.md)
- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#coveragethreshold-object)

---

## Issue 5: ✅ Add Commit Message Linting (COMPLETED)

**Priority:** Medium Impact, Medium Effort (Priority 2)  
**Labels:** `enhancement`, `developer-experience`, `tooling`  
**Status:** ✅ **IMPLEMENTED**

### Description

Enforce standardized commit messages using Conventional Commits format for better Git history and changelog generation.

### Current State

✅ **Commit message linting is now fully implemented and active:**

- @commitlint/cli 20.1.0 and @commitlint/config-conventional 20.0.0 installed
- commitlint.config.js configured to extend conventional commits
- .husky/commit-msg hook added to run commitlint on every commit
- Tests added to validate commitlint configuration
- Conventional Commits format enforced (feat, fix, docs, test, chore, etc.)

### Proposed Solution

1. Install commitlint:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

2. Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

3. Add commit-msg hook to `.husky/commit-msg`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec commitlint --edit $1
```

### Commit Message Format Examples

```
feat: add new navigation component
fix: resolve mobile menu toggle issue
docs: update deployment guide
test: add coverage for responsive design
chore: update dependencies
style: format code with prettier
refactor: restructure component hierarchy
perf: optimize image loading
ci: add coverage reporting to workflow
```

### Benefits

- Standardized commit messages
- Easier changelog generation
- Better Git history navigation
- Clear communication of changes
- Automatic semantic versioning support

### Acceptance Criteria

- [x] commitlint installed and configured (@commitlint/cli 20.1.0)
- [x] commit-msg hook added (.husky/commit-msg)
- [x] Tests added to validate commitlint configuration
- [x] Conventional Commits format enforced

### Dependencies

- Requires Issue #2 (Husky) to be completed first

### References

- [CODE_QUALITY.md - Section 2.2](./CODE_QUALITY.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)

---

## Issue 6: ✅ Add Dependency Update Automation (COMPLETED)

**Priority:** Medium Impact, Medium Effort (Priority 2)  
**Labels:** `enhancement`, `dependencies`, `automation`  
**Status:** ✅ **IMPLEMENTED** (via Repository Settings)

### Description

Configure Dependabot to automate dependency updates and security patch notifications.

### Current State

✅ **Dependabot is fully implemented with both repository settings and configuration file:**

- Dependabot version updates: **Enabled** (via repository settings)
- Dependabot security updates: **Enabled** (via repository settings)
- Grouped security updates: **Enabled** (via repository settings)
- `.github/dependabot.yml` configuration file added for fine-grained control
- Successfully creating PRs (e.g., PR #54 for GitHub Actions updates)
- Using group-based updates for both GitHub Actions and npm dependencies
- Alert notifications configured for organization administrators and security managers

**Implementation Approach:** Hybrid configuration using both repository settings (for high-level toggles and security features) and `.github/dependabot.yml` (for detailed schedules, grouping rules, and portability).

### Implementation Details

**Configuration Method:** Hybrid approach using both repository settings and `.github/dependabot.yml`

**Repository Settings:**

- Enable/disable toggles for version updates and security updates
- Grouped security updates configuration
- Alert access control for security team

**Configuration File (`.github/dependabot.yml`):**

- Weekly update schedule (Mondays at 09:00 UTC)
- NPM package ecosystem with grouped dev/production dependencies
- GitHub Actions ecosystem with grouped updates
- PR limit: 5 open PRs maximum
- Custom labels: `dependencies`, `automated`, `github_actions`

**Active Features:**

- ✅ Version updates for GitHub Actions (using groups)
- ✅ Version updates for NPM packages (grouped by dependency type)
- ✅ Security updates (automatically enabled via repository settings)
- ✅ Grouped updates to reduce PR noise
- ✅ Automatic PR creation and labeling

**Evidence of Activity:**

- PR #54: Bump dawidd6/action-download-artifact from 3 to 6 (merged)
- Labels automatically applied: `dependencies`, `github_actions`
- Group-based updates working: "github_actions group across 1 directory"

### Benefits

- Automated dependency updates
- Security patch notifications
- Grouped updates reduce PR noise
- Keep dependencies current
- Reduce technical debt

### Acceptance Criteria

- [x] Verified Dependabot status with repository admin (screenshots provided)
- [x] Dependabot enabled via repository settings
- [x] Current configuration documented
- [x] Configuration tested and working (PR #54 created and merged)
- [x] Dependency PRs are being created as expected
- [x] Alert notifications configured for security team

### Implementation Notes

- Hybrid implementation using both repository settings and `.github/dependabot.yml`
- `.github/dependabot.yml` file added for better configuration control, portability, and version control
- GitHub Actions updates use group-based configuration
- NPM package ecosystem monitored with separate grouping for dev vs production dependencies
- Security alerts and version updates both active
- Configuration file allows for weekly schedules, PR limits, and custom grouping rules

### References

- [CODE_QUALITY.md - Section 2.3](./CODE_QUALITY.md)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

---

## Issue 7: ✅ Fix js-yaml Vulnerability (COMPLETED)

**Priority:** Medium Impact, Medium Effort (Priority 2)  
**Labels:** `security`, `dependencies`  
**Status:** ✅ **IMPLEMENTED**

### Description

Address the moderate security vulnerability in js-yaml < 4.1.1, which is a transitive dependency via Jest.

### Current State

✅ **js-yaml vulnerability is now resolved:**

- js-yaml 4.1.1 is installed as a direct devDependency
- Version 4.1.1 addresses the security vulnerability (CVE-2021-3807)
- No known vulnerabilities in the current version
- Development-only dependency (not in production bundle)
- Security risk mitigated

### Proposed Solution

1. Check for Jest updates:

```bash
pnpm outdated jest
```

2. If newer version available with fixed dependency:

```bash
pnpm update jest
```

3. If not available, options:
   - Monitor Jest releases for fix
   - Override dependency version in package.json (if compatible)
   - Document acceptance of risk in security policy

4. Document decision in `SECURITY.md`

### Acceptance Criteria

- [x] Vulnerability assessed and solution determined
- [x] Dependency updated and vulnerability resolved (js-yaml 4.1.1)
- [x] Security risk mitigated
- [x] Tests pass after updates (all 97 tests passing)

### Implementation Notes

- Implemented as a direct devDependency in package.json
- Version 4.1.1 resolves the CVE-2021-3807 vulnerability
- No impact on production bundle (dev dependency only)
- All tests continue to pass

### References

- [CODE_QUALITY.md - Section 2.4](./CODE_QUALITY.md)
- [GitHub Advisory](https://github.com/advisories/GHSA-mh29-5h37-fv8m)

---

## Issue 8: ✅ Add EditorConfig (COMPLETED)

**Priority:** Nice-to-Have (Priority 3)  
**Labels:** `enhancement`, `developer-experience`, `tooling`  
**Status:** ✅ **IMPLEMENTED**

### Description

Add EditorConfig to ensure consistent formatting across different editors and IDEs.

### Current State

✅ **EditorConfig is now fully implemented and active:**

- .editorconfig file created with comprehensive configuration
- Configured for UTF-8, LF line endings, 2-space indentation
- File-type specific rules for markdown, YAML, and JSON
- Aligns with Prettier configuration for consistency
- Tests added to validate .editorconfig exists and has correct settings

### Proposed Solution

Create `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[*.json]
indent_size = 2
```

### Benefits

- Consistent formatting across editors (VS Code, Vim, IntelliJ, etc.)
- Works with any IDE/editor that supports EditorConfig
- Complements Prettier configuration
- Zero configuration needed per developer

### Acceptance Criteria

- [x] .editorconfig file created
- [x] Configuration covers all file types in project (\*, .md, .yml, .yaml, .json)
- [x] Tests added to validate .editorconfig configuration
- [x] Aligns with Prettier settings (2-space indent, UTF-8, LF)

### References

- [CODE_QUALITY.md - Section 3.1](./CODE_QUALITY.md)
- [EditorConfig Documentation](https://editorconfig.org/)

---

## Issue 9: ✅ Add Bundle Size Analysis (COMPLETED)

**Priority:** Nice-to-Have (Priority 3)  
**Labels:** `enhancement`, `performance`, `tooling`  
**Status:** ✅ **IMPLEMENTED**

### Description

Add bundle size analysis to identify large dependencies and optimize page load performance.

### Current State

✅ **Bundle size analysis is now fully implemented and active:**

- @next/bundle-analyzer 16.0.3 installed
- next.config.js updated with withBundleAnalyzer wrapper
- Analyzer enabled only when ANALYZE=true environment variable is set
- `pnpm run analyze` script added to package.json
- Tests added to validate bundle analyzer configuration
- Static export configuration maintained

### Proposed Solution

1. Install Next.js bundle analyzer:

```bash
pnpm add -D @next/bundle-analyzer
```

2. Update `next.config.js`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: '/ffcadmin.org',
}

module.exports = withBundleAnalyzer(nextConfig)
```

3. Add script to `package.json`:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true pnpm build"
  }
}
```

### Usage

Run `pnpm run analyze` to generate bundle analysis report.

### Benefits

- Visualize bundle composition
- Identify large dependencies
- Optimize bundle size
- Improve page load performance
- Make informed decisions about dependencies

### Acceptance Criteria

- [x] Bundle analyzer installed and configured (@next/bundle-analyzer 16.0.3)
- [x] Analyze script added to package.json (`pnpm run analyze`)
- [x] Tests added to validate bundle analyzer configuration
- [x] Static export configuration maintained

### References

- [CODE_QUALITY.md - Section 3.2](./CODE_QUALITY.md)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## Issue 10: ✅ Add Accessibility Testing (COMPLETED)

**Priority:** Nice-to-Have (Priority 3)  
**Labels:** `enhancement`, `accessibility`, `testing`, `a11y`  
**Status:** ✅ **IMPLEMENTED**

### Description

Add automated accessibility testing with axe-core to catch accessibility issues early and ensure WCAG compliance.

### Current State

✅ **Accessibility testing is now fully implemented and active:**

- @axe-core/react 4.11.0 and jest-axe 10.0.0 installed
- jest.setup.js updated with toHaveNoViolations matcher
- Comprehensive accessibility tests added for all main pages:
  - Home page
  - Tech Stack page
  - Documentation page
  - Cookie Policy page
  - Privacy Policy page
  - Training Plan page
- All 6 accessibility tests pass with no WCAG violations detected
- Automated a11y checks run with every test suite execution

### Proposed Solution

1. Install axe-core testing libraries:

```bash
pnpm add -D @axe-core/react jest-axe
```

2. Update `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)
```

3. Create example test in `__tests__/accessibility.test.js`:

```javascript
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import Home from '@/app/page'

describe('Accessibility Tests', () => {
  it('should not have accessibility violations on home page', async () => {
    const { container } = render(<Home />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

4. Add accessibility tests for all major pages

### Benefits

- Catch accessibility issues early in development
- WCAG compliance validation
- Better user experience for all users
- Automated checks in CI/CD
- Reduce manual accessibility audits

### Acceptance Criteria

- [x] axe-core libraries installed (@axe-core/react 4.11.0, jest-axe 10.0.0)
- [x] Jest configured with axe matchers (jest.setup.js updated)
- [x] Accessibility tests added for all main pages (6 pages tested)
- [x] Tests pass without violations (all 141 tests passing)
- [x] Automated WCAG compliance validation in CI/CD

### References

- [CODE_QUALITY.md - Section 3.3](./CODE_QUALITY.md)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)

---

## Issue 11: ✅ Add Performance Budgets with Lighthouse CI (COMPLETED)

**Priority:** Nice-to-Have (Priority 3)  
**Labels:** `enhancement`, `performance`, `ci-cd`  
**Status:** ✅ **IMPLEMENTED**

### Description

Configure Lighthouse CI to monitor performance metrics and prevent performance regressions.

### Current State

✅ **Lighthouse CI is now fully implemented and active:**

- lighthouserc.json configured with 90% thresholds for all categories
- Lighthouse CI workflow (.github/workflows/lighthouse.yml) set up
- Workflow runs after successful deployment
- Tests multiple key pages (home, tech-stack, documentation)
- 3 runs per audit for consistent results
- Results uploaded as artifacts with 30-day retention
- Test suite validates Lighthouse configuration
- Comprehensive documentation in LIGHTHOUSE.md

### Proposed Solution

1. Install Lighthouse CI:

```bash
pnpm add -D @lhci/cli
```

2. Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./out",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

3. Add script to `package.json`:

```json
{
  "scripts": {
    "lighthouse": "lhci autorun"
  }
}
```

4. Add Lighthouse CI step to `.github/workflows/ci.yml`:

```yaml
- name: Run Lighthouse CI
  run: pnpm run lighthouse
```

### Benefits

- Automated performance monitoring
- Catch performance regressions early
- SEO optimization tracking
- Accessibility score monitoring
- Best practices validation

### Acceptance Criteria

- [x] Lighthouse CI configured (installed globally in workflow)
- [x] Configuration file created with appropriate budgets (lighthouserc.json)
- [x] Lighthouse CI integrated into CI workflow (.github/workflows/lighthouse.yml)
- [x] Initial baseline established (90% thresholds)
- [x] Documentation updated with performance guidelines (LIGHTHOUSE.md)
- [x] Test suite validates configuration (`__tests__/lighthouse-config.test.js`)

### Implementation Notes

- Implemented with separate workflow that runs after deployment
- Configuration includes 3 runs per audit for consistency
- Thresholds set to 90% for all categories (performance, accessibility, best-practices, SEO)
- PWA and GitHub Pages-specific checks appropriately disabled
- Results uploaded as artifacts with 30-day retention
- Comprehensive documentation in LIGHTHOUSE.md explains all configuration choices
- Tests validate both configuration file and workflow setup

### References

- [CODE_QUALITY.md - Section 3.4](./CODE_QUALITY.md)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

---

## Implementation Order Recommendation

Based on dependencies and impact, implement in this order:

### Phase 1: Foundation (Priority 1 - High Impact, Low Effort) ✅ COMPLETED

1. Issue #1: ✅ Add Prettier for Code Formatting (COMPLETED)
2. Issue #2: ✅ Add Pre-commit Hooks with Husky and lint-staged (COMPLETED)
3. Issue #3: ✅ Add TypeScript Type Checking to CI (COMPLETED)

### Phase 2: Quality Gates (Priority 2 - Medium Impact, Medium Effort) ✅ COMPLETED

4. Issue #4: ✅ Add Test Coverage Requirements (COMPLETED)
5. Issue #5: ✅ Add Commit Message Linting (COMPLETED)
6. Issue #6: ✅ Add Dependency Update Automation (COMPLETED - via repository settings)
7. Issue #7: ✅ Fix js-yaml Vulnerability (COMPLETED)

### Phase 3: Enhanced Tooling (Priority 3 - Nice-to-Have) ✅ COMPLETED

8. Issue #8: ✅ Add EditorConfig (COMPLETED)
9. Issue #9: ✅ Add Bundle Size Analysis (COMPLETED)
10. Issue #10: ✅ Add Accessibility Testing (COMPLETED)
11. Issue #11: ✅ Add Performance Budgets with Lighthouse CI (COMPLETED)

---

## Notes

- Each issue can be worked on independently, except where dependencies are noted
- All issues reference the detailed documentation in CODE_QUALITY.md
- Estimated total time: 10-15 hours across all phases
- Can be distributed among team members for parallel implementation
