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

## Commit Signing

This repository requires all commits to be signed with GPG signatures before merging into `main`. This is enforced through branch protection rules.

**Official Key:** Free For Charity (globaladmin@freeforcharity.org)
- Key ID: B5C1FBB290F87E9D
- Type: RSA 4096-bit  
- Valid: 11/16/2025 - 11/16/2028

### 🚀 Quick Setup

**Enable auto-signing for GitHub Actions:**

See **[QUICK_START.md](./QUICK_START.md)** for step-by-step instructions.

### For Repository Admins

To enable automatic commit signing for GitHub Actions:
1. Add the public key from `gpg-keys/public-key.asc` to https://github.com/settings/gpg/new
2. Obtain the private key from the key owner (created with Kleopatra)
3. Add the private key as repository secret `GPG_PRIVATE_KEY`
4. Done! The workflows will automatically sign commits from bots

### Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[SETUP_AUTO_SIGNING.md](./SETUP_AUTO_SIGNING.md)** - Detailed setup instructions
- **[GPG_SIGNING.md](./GPG_SIGNING.md)** - Technical documentation and alternatives
- **[ISSUE_RESOLUTION.md](./ISSUE_RESOLUTION.md)** - Complete issue analysis
