# Implementation Issues for Code Quality Enhancements

## Overview

This document contains detailed implementation plans for enhancing code quality in this repository. It serves as a tracking document for potential improvements identified in [CODE_QUALITY.md](CODE_QUALITY.md).

**Audience:** Developers, Technical Leads, Project Managers

**Purpose:** Each section below represents a potential GitHub issue that can be created to track and implement code quality improvements.

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

## Issue 4: Add Test Coverage Requirements

**Priority:** Medium Impact, Medium Effort (Priority 2)  
**Labels:** `enhancement`, `testing`, `quality`

### Description

Set minimum test coverage thresholds to prevent coverage regression and ensure new code is adequately tested.

### Current State

Test coverage is tracked but no minimum thresholds are enforced.

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

- [ ] Coverage thresholds added to jest.config.js
- [ ] Thresholds set appropriately based on current coverage
- [ ] Tests pass with new thresholds
- [ ] CI runs tests with coverage reporting

### References

- [CODE_QUALITY.md - Section 2.1](./CODE_QUALITY.md)
- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#coveragethreshold-object)

---

## Issue 5: Add Commit Message Linting

**Priority:** Medium Impact, Medium Effort (Priority 2)  
**Labels:** `enhancement`, `developer-experience`, `tooling`

### Description

Enforce standardized commit messages using Conventional Commits format for better Git history and changelog generation.

### Current State

No commit message standards are enforced, leading to inconsistent commit history.

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

- [ ] commitlint installed and configured
- [ ] commit-msg hook added
- [ ] Documentation updated with commit message format
- [ ] Team members aware of new commit format

### Dependencies

- Requires Issue #2 (Husky) to be completed first

### References

- [CODE_QUALITY.md - Section 2.2](./CODE_QUALITY.md)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)

---

## Issue 6: Add Dependency Update Automation

**Priority:** Medium Impact, Medium Effort (Priority 2)  
**Labels:** `enhancement`, `dependencies`, `automation`

### Description

Configure Dependabot to automate dependency updates and security patch notifications.

### Current State

Dependency updates are performed manually, which can lead to outdated dependencies and missed security patches.

### Proposed Solution

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 5
    groups:
      development-dependencies:
        dependency-type: 'development'
        update-types:
          - 'minor'
          - 'patch'
      production-dependencies:
        dependency-type: 'production'
        update-types:
          - 'patch'
    labels:
      - 'dependencies'
      - 'automated'
```

### Configuration Details

- **Schedule**: Weekly updates to avoid overwhelming PRs
- **PR Limit**: Maximum 5 open PRs at a time
- **Grouping**: Groups minor/patch updates for dev dependencies
- **Security**: Always creates separate PRs for security updates

### Benefits

- Automated dependency updates
- Security patch notifications
- Grouped updates reduce PR noise
- Keep dependencies current
- Reduce technical debt

### Acceptance Criteria

- [ ] Dependabot configuration file created
- [ ] Configuration tested with a manual trigger
- [ ] First set of dependency PRs reviewed
- [ ] Documentation updated with Dependabot process

### References

- [CODE_QUALITY.md - Section 2.3](./CODE_QUALITY.md)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

---

## Issue 7: Fix js-yaml Vulnerability

**Priority:** Medium Impact, Medium Effort (Priority 2)  
**Labels:** `security`, `dependencies`

### Description

Address the moderate security vulnerability in js-yaml < 4.1.1, which is a transitive dependency via Jest.

### Current State

- 1 moderate vulnerability: js-yaml < 4.1.1
- Transitive dependency through Jest
- Development-only dependency (not in production bundle)
- Impact: Low (dev environment only)

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

- [ ] Vulnerability assessed and solution determined
- [ ] If fixable: dependency updated and vulnerability resolved
- [ ] If not fixable: risk acceptance documented
- [ ] Security audit passes or documented exceptions exist
- [ ] Tests pass after any updates

### References

- [CODE_QUALITY.md - Section 2.4](./CODE_QUALITY.md)
- [GitHub Advisory](https://github.com/advisories/GHSA-mh29-5h37-fv8m)

---

## Issue 8: Add EditorConfig

**Priority:** Nice-to-Have (Priority 3)  
**Labels:** `enhancement`, `developer-experience`, `tooling`

### Description

Add EditorConfig to ensure consistent formatting across different editors and IDEs.

### Current State

No editor configuration file exists, which can lead to inconsistent formatting between team members using different editors.

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

- [ ] .editorconfig file created
- [ ] Configuration covers all file types in project
- [ ] Documentation updated to mention EditorConfig
- [ ] Team members aware of EditorConfig support

### References

- [CODE_QUALITY.md - Section 3.1](./CODE_QUALITY.md)
- [EditorConfig Documentation](https://editorconfig.org/)

---

## Issue 9: Add Bundle Size Analysis

**Priority:** Nice-to-Have (Priority 3)  
**Labels:** `enhancement`, `performance`, `tooling`

### Description

Add bundle size analysis to identify large dependencies and optimize page load performance.

### Current State

No bundle size analysis is configured, making it difficult to identify and optimize large dependencies.

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

- [ ] Bundle analyzer installed and configured
- [ ] Analyze script added to package.json
- [ ] Successfully generates bundle analysis
- [ ] Documentation updated with usage instructions

### References

- [CODE_QUALITY.md - Section 3.2](./CODE_QUALITY.md)
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## Issue 10: Add Accessibility Testing

**Priority:** Nice-to-Have (Priority 3)  
**Labels:** `enhancement`, `accessibility`, `testing`, `a11y`

### Description

Add automated accessibility testing with axe-core to catch accessibility issues early and ensure WCAG compliance.

### Current State

No automated accessibility testing is configured.

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

- [ ] axe-core libraries installed
- [ ] Jest configured with axe matchers
- [ ] Accessibility tests added for main pages
- [ ] Tests pass without violations
- [ ] Documentation updated with a11y testing guidelines

### References

- [CODE_QUALITY.md - Section 3.3](./CODE_QUALITY.md)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)

---

## Issue 11: Add Performance Budgets with Lighthouse CI

**Priority:** Nice-to-Have (Priority 3)  
**Labels:** `enhancement`, `performance`, `ci-cd`

### Description

Configure Lighthouse CI to monitor performance metrics and prevent performance regressions.

### Current State

No automated performance monitoring is configured.

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

- [ ] Lighthouse CI installed and configured
- [ ] Configuration file created with appropriate budgets
- [ ] Lighthouse CI integrated into CI workflow
- [ ] Initial baseline established
- [ ] Documentation updated with performance guidelines

### References

- [CODE_QUALITY.md - Section 3.4](./CODE_QUALITY.md)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

---

## Implementation Order Recommendation

Based on dependencies and impact, implement in this order:

### Phase 1: Foundation (Priority 1 - High Impact, Low Effort)

1. Issue #1: ✅ Add Prettier for Code Formatting (COMPLETED)
2. Issue #2: ✅ Add Pre-commit Hooks with Husky and lint-staged (COMPLETED)
3. Issue #3: ✅ Add TypeScript Type Checking to CI (COMPLETED)

### Phase 2: Quality Gates (Priority 2 - Medium Impact, Medium Effort)

4. Issue #4: Add Test Coverage Requirements
5. Issue #5: Add Commit Message Linting
6. Issue #6: Add Dependency Update Automation
7. Issue #7: Fix js-yaml Vulnerability

### Phase 3: Enhanced Tooling (Priority 3 - Nice-to-Have)

8. Issue #8: Add EditorConfig
9. Issue #9: Add Bundle Size Analysis
10. Issue #10: Add Accessibility Testing
11. Issue #11: Add Performance Budgets with Lighthouse CI

---

## Notes

- Each issue can be worked on independently, except where dependencies are noted
- All issues reference the detailed documentation in CODE_QUALITY.md
- Estimated total time: 10-15 hours across all phases
- Can be distributed among team members for parallel implementation
