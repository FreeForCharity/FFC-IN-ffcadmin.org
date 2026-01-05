# Contributing to Free For Charity Admin Portal

Thank you for your interest in contributing to the Free For Charity Admin Portal! This guide will help you understand our development workflow and ensure your contributions can be smoothly integrated.

## Table of Contents

- [Quick Start](#quick-start)
- [Development Workflow](#development-workflow)
- [Order of Operations](#order-of-operations)
- [Code Quality Standards](#code-quality-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/FreeForCharity/ffcadmin.org.git
cd ffcadmin.org

# 2. Install pnpm (if not already installed)
npm install -g pnpm@9.0.0

# 3. Install dependencies
pnpm install --frozen-lockfile

# 4. Start development server
pnpm run dev

# 5. Open http://localhost:3000 in your browser
```

### Pre-commit Hooks

This project uses **Husky** and **lint-staged** to automatically format and lint your code before each commit.

**What happens when you commit:**

```bash
git commit -m "Your message"
# ✓ Automatically runs Prettier on changed files
# ✓ Automatically runs ESLint on changed files
# ✓ Fixes issues automatically where possible
# ✓ Commits only if all checks pass
```

**Benefits:**

- Catch formatting and linting issues before they reach CI
- Automatic code fixes on commit
- Faster feedback loop
- Reduced CI failures
- No need to manually run `pnpm run format` before committing

**What if checks fail?**

If pre-commit checks fail, the commit will be blocked. Fix the issues and try again:

```bash
# Fix the issues reported
# Then commit again
git commit -m "Your message"
```

## Development Workflow

### Making Changes

Follow this workflow when making changes to ensure CI/CD success:

#### Step 1: Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

#### Step 2: Make Your Changes

Edit files using your preferred code editor. The project uses:

- **TypeScript** for type safety
- **Next.js 14** (App Router) for the framework
- **Tailwind CSS** for styling
- **React 18** for UI components

#### Step 3: Format Your Code

**Always format before linting** to avoid conflicts:

```bash
pnpm run format
```

This uses Prettier to automatically format all files according to the project's style guide.

#### Step 4: Check Code Quality

```bash
pnpm run lint
```

This runs ESLint to check for code quality issues, best practices, and potential bugs.

#### Step 5: Type Check

```bash
pnpm run type-check
```

This runs TypeScript type checking to catch type errors before building.

#### Step 6: Build the Project

```bash
pnpm run build
```

This compiles TypeScript, builds the Next.js application, and generates the static export in the `out/` directory.

#### Step 7: Run Tests

```bash
pnpm test
```

This runs the Jest test suite to validate your changes.

#### Step 8: Commit Your Changes

```bash
git add .
git commit -m "Brief description of your changes"
git push origin feature/your-feature-name
```

**Pre-commit Hooks:** The project now uses Husky and lint-staged to automatically format and lint your code before each commit. This happens automatically when you run `git commit` and helps catch issues before they reach CI.

**Note:** All commits to `main` must be GPG-signed. For feature branches, signing is optional but recommended. The CI/CD pipeline will automatically sign commits when merging to `main`.

## Order of Operations

**Critical:** Always follow this order when developing locally. The CI/CD pipeline follows the same sequence:

```
1. Format → 2. Lint → 3. Type Check → 4. Build → 5. Test
```

### Why This Order?

1. **Format First** - Prettier fixes code style issues
   - Ensures consistent formatting before other checks
   - Prevents style conflicts with ESLint

2. **Lint Second** - ESLint checks code quality
   - Runs after formatting to avoid style rule conflicts
   - Checks for bugs, best practices, and accessibility

3. **Type Check Third** - TypeScript validates types
   - Faster feedback on type errors (doesn't require full build)
   - Clearer error messages for type-related issues
   - Runs independently before build

4. **Build Fourth** - Next.js builds the application
   - Compiles TypeScript and JavaScript
   - Generates static export for GitHub Pages
   - Validates all imports and dependencies

5. **Test Last** - Jest validates functionality
   - Tests the built output (not source files)
   - Validates build configuration
   - Ensures responsive design and routing work

### Quick Check Before Committing

Run all steps in one command:

```bash
pnpm run format && pnpm run lint && pnpm run type-check && pnpm run build && pnpm test
```

If this passes, your PR should pass CI checks.

## Code Quality Standards

### Prettier Configuration

All files are automatically formatted with Prettier:

- **No semicolons** (`semi: false`)
- **Single quotes** for strings
- **2-space indentation**
- **100-character line width**
- **ES5 trailing commas**

Configuration: `.prettierrc.json`

### ESLint Rules

We use Next.js recommended ESLint configuration:

- Next.js best practices
- React Hooks rules
- Core Web Vitals checks
- Accessibility validation
- Prettier integration (no style conflicts)

Configuration: `.eslintrc.json`

### TypeScript

- **Strict mode enabled** - All type checking rules enforced
- **No implicit any** - All types must be explicit
- **Null checks** - Handle null/undefined cases
- **Path aliases** - Use `@/*` for imports from project root

Configuration: `tsconfig.json`

## Commit Guidelines

### Commit Message Format

While not strictly enforced, we recommend clear, descriptive commit messages:

```
Brief summary (50 characters or less)

More detailed explanation if needed (wrap at 72 characters).
Explain the problem this commit solves and why you chose this solution.

- Bullet points are okay
- Use present tense ("Add feature" not "Added feature")
- Reference issues if applicable (#123)
```

### Examples of Good Commit Messages

```
Add responsive navigation for mobile devices

Add cookie consent banner for GDPR compliance

Fix build error in tech-stack page

Update documentation for development workflow
```

### Commit Requirements

- Follow conventional commit format (enforced by commitlint)
- Keep commits focused and atomic
- Write clear, descriptive commit messages

## Pull Request Process

### Before Opening a PR

1. ✅ Run all checks locally: `pnpm run format && pnpm run lint && pnpm run type-check && pnpm run build && pnpm test`
2. ✅ Test responsive design (mobile, tablet, desktop)
3. ✅ Update documentation if you changed functionality
4. ✅ Add tests for new features

### Opening a PR

1. **Title:** Clear, descriptive title explaining the change
2. **Description:** Explain:
   - What problem does this solve?
   - What changes did you make?
   - How did you test it?
3. **Link Issues:** Reference any related issues (#123)
4. **Request Review:** Tag relevant reviewers

### PR Review Checklist

Your PR must pass these automated checks:

- ✅ **Format Check** - All files formatted with Prettier
- ✅ **Lint Check** - No ESLint errors or warnings
- ✅ **Type Check** - TypeScript type checking passes
- ✅ **Build Check** - Next.js build succeeds
- ✅ **Test Check** - All tests pass
- ✅ **CodeQL** - Security scan passes

### After PR Approval

Once approved and all checks pass:

1. **Squash and Merge** (preferred) or **Rebase and Merge**
2. GitHub Actions will automatically:
   - GPG-sign the merge commit
   - Run final validation
   - Deploy to GitHub Pages (for `main` branch)

## CI/CD Pipeline

### Continuous Integration (ci.yml)

Runs on every PR and push to `main`:

```
1. Install dependencies (pnpm install --frozen-lockfile)
2. Check formatting (pnpm run format:check)
3. Run linter (pnpm run lint)
4. Type check (pnpm run type-check)
5. Build project (pnpm run build)
6. Verify output directory
7. Validate critical files exist
8. Run tests (pnpm test)
```

### Security Scanning (codeql-analysis.yml)

Runs on PRs, pushes to `main`, and weekly:

- Scans for security vulnerabilities
- Checks for common issues (XSS, SQL injection, etc.)
- Results appear in GitHub Security tab

### Deployment (deploy.yml)

Runs when changes are pushed to `main`:

```
1. Build project
2. Run tests
3. Upload static files
4. Deploy to GitHub Pages
```

Live site: https://ffcadmin.org

### What Gets Deployed

- Static HTML/CSS/JS files
- `.nojekyll` file (prevents Jekyll processing)
- `robots.txt` and `sitemap.xml` (SEO)
- All Next.js static assets

## Troubleshooting

### "Prettier check failed"

**Problem:** CI fails with formatting errors

**Solution:**

```bash
# Auto-fix formatting
pnpm run format

# Commit the changes
git add .
git commit -m "Fix formatting"
git push
```

### "ESLint errors"

**Problem:** CI fails with linting errors

**Solution:**

```bash
# Check what's wrong
pnpm run lint

# Some errors can be auto-fixed
pnpm run lint --fix

# Others need manual fixing
# Edit the files to fix the issues

# Commit the changes
git add .
git commit -m "Fix linting errors"
git push
```

### "Build failed"

**Problem:** CI fails during Next.js build

**Solution:**

```bash
# Run build locally to see the error
pnpm run build

# Common issues:
# - TypeScript errors: Fix type issues
# - Import errors: Check import paths
# - Missing dependencies: Run pnpm install

# After fixing
git add .
git commit -m "Fix build errors"
git push
```

### "Tests failed"

**Problem:** CI fails during test execution

**Solution:**

```bash
# Run tests locally
pnpm test

# Run specific test file
pnpm test __tests__/your-test.test.js

# Check what changed
# - Did you modify build output structure?
# - Did you change configuration files?
# - Did you update routes?

# Update tests or fix code
# Commit the changes
git add .
git commit -m "Fix failing tests"
git push
```

### "I ran all checks locally and they passed, but CI failed"

**Possible causes:**

1. **Outdated dependencies** - Run `pnpm install --frozen-lockfile` again
2. **Uncommitted files** - Check `git status` for unstaged changes
3. **Different Node version** - CI uses Node 20, ensure you're using the same
4. **Cached files** - Delete `node_modules`, `.next`, `out` and reinstall

### Getting Help

If you're stuck:

1. Check existing documentation:
   - [README.md](./README.md) - Overview and quick start
   - [CODE_QUALITY.md](./CODE_QUALITY.md) - Detailed quality standards
   - [.github/workflows/README.md](./.github/workflows/README.md) - CI/CD details
   - [ISSUE_RESOLUTION.md](./ISSUE_RESOLUTION.md) - Common issues

2. Search closed issues in GitHub

3. Open a new issue with:
   - What you tried to do
   - What error you encountered
   - Steps to reproduce
   - Your environment (OS, Node version, pnpm version)

## Additional Resources

### Documentation

- [Development Workflow](./README.md#development-workflow) - Quick workflow guide
- [Code Quality Standards](./CODE_QUALITY.md) - Detailed standards and tools
- [Testing Documentation](./TEST_CASES.md) - Test strategy and coverage
- [Deployment Guide](./DEPLOYMENT.md) - GitHub Pages deployment
- [Responsive Design](./RESPONSIVE_DESIGN.md) - Mobile/tablet/desktop support

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prettier Documentation](https://prettier.io/docs/)
- [ESLint Documentation](https://eslint.org/docs/latest/)

---

**Thank you for contributing to Free For Charity!** 🎉

Your contributions help us deliver free, secure, and scalable websites for charities worldwide.

---

**Document Version:** 1.0  
**Last Updated:** 2024-11-17  
**Maintained By:** Free For Charity Development Team
