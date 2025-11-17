# Free For Charity Admin Portal

[![Deployed](https://img.shields.io/badge/status-deployed-success)](https://ffcadmin.org)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)

## Table of Contents
- [Overview](#overview)
- [Quick Links](#quick-links)
- [Deployment Status](#deployment-status)
- [Responsive Design](#responsive-design)
- [Understanding GitHub Pages Caching](#understanding-github-pages-caching)
- [Analytics](#analytics)
- [Testing](#testing)
- [Code Quality and Standards](#code-quality-and-standards)
- [Commit Signing](#commit-signing)
- [Documentation](#documentation)
- [Support](#support)

## Overview

**Free For Charity (FFC)** is a nonprofit technology initiative delivering free, secure, and scalable websites for charities.

This repository contains the administrative portal for Free For Charity, built with Next.js and deployed on GitHub Pages. The site serves as:
- A technology showcase demonstrating our approach to nonprofit web development
- Documentation hub for our technology stack and processes
- Administrative information center for FFC operations

**Live Site:** [https://ffcadmin.org](https://ffcadmin.org)

## Quick Links

**For New Contributors:**
- 📚 [Documentation Center](https://ffcadmin.org/documentation) - Browse all guides and READMEs
- 🚀 [Quick Start Guide](QUICK_START.md) - Set up GPG signing in 5 minutes
- 💻 [Code Quality Standards](CODE_QUALITY.md) - Development guidelines

**For Administrators:**
- 🌐 [Deployment Guide](DEPLOYMENT.md) - GitHub Pages deployment instructions
- 🔒 [GPG Signing Setup](SETUP_AUTO_SIGNING.md) - Configure automatic commit signing
- 🔧 [Issue Resolution](ISSUE_RESOLUTION.md) - Troubleshooting common problems

**For Understanding the Project:**
- 📖 [Technology Stack](https://ffcadmin.org/tech-stack) - Complete infrastructure documentation
- 🎨 [Responsive Design](RESPONSIVE_DESIGN.md) - Mobile, tablet, and desktop support
- ✅ [Test Cases](TEST_CASES.md) - Testing strategy and coverage

## Deployment Status

**Status:** ✅ **Live and Accessible**

| Environment | URL | Status |
|------------|-----|--------|
| **Production** | https://ffcadmin.org | ✅ Active (Custom Domain) |
| **Backup/Testing** | https://freeforcharity.github.io/ffcadmin.org/ | ✅ Available |

The site is automatically deployed via GitHub Actions when changes are pushed to the `main` branch. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment configuration and troubleshooting.

**Key Features:**
- ✅ Static site generation with Next.js 14
- ✅ Automatic deployment via GitHub Actions
- ✅ Global CDN delivery through GitHub Pages
- ✅ Custom domain with HTTPS
- ✅ Fully responsive design (mobile, tablet, desktop)

## Responsive Design
**Status:** ✅ **Fully Responsive**

The site is optimized for all device sizes:
- ✅ Mobile phones (< 768px): Hamburger menu navigation
- ✅ Tablets (768px - 1024px): Full navigation, 2-column layout
- ✅ Desktops (> 1024px): Full navigation, 3-column layout

## Understanding GitHub Pages Caching

### How GitHub Pages Serves Your Site

When you deploy to GitHub Pages, your static files (HTML, CSS, JavaScript) go through multiple layers of caching:

1. **GitHub's CDN (Content Delivery Network)**: GitHub Pages uses a global CDN (Fastly) to serve your site quickly worldwide. The CDN caches your files at edge locations near your users.

2. **Browser Cache**: Your browser stores copies of CSS and JavaScript files locally to avoid re-downloading them on every visit.

3. **Service Workers** (if configured): Can cache assets for offline access.

### Why You Might See Old Content

**Deployment Timeline:**
```
Your Push → GitHub Actions Build → GitHub Pages Deploy → CDN Propagation → Browser Cache
   (instant)     (1-2 minutes)         (instant)          (1-5 minutes)      (until cleared)
```

**Common Scenarios:**

**Scenario 1: Immediate After Deployment**
- You push code and immediately check the site
- GitHub Pages CDN may still be propagating the new files to edge servers
- **Result**: You see the old version for 1-5 minutes
- **Solution**: Wait 2-3 minutes, then hard refresh

**Scenario 2: Browser Cache**
- You visited the site before the latest deployment
- Your browser cached the old CSS/JS files with a long expiration time
- **Result**: You see old styles even though new files are deployed
- **Solution**: Hard refresh or clear site-specific cache

**Scenario 3: CDN Edge Cache**
- The CDN edge server nearest to you still has the old version
- Other users in different regions may already see the new version
- **Result**: Geographic differences in what version users see
- **Solution**: Wait for CDN propagation (usually < 5 minutes) or clear cache

**Scenario 4: DNS Propagation** (rare)
- When GitHub Pages settings change
- **Result**: Site might be inaccessible or show old content for up to 24 hours
- **Solution**: Wait for DNS propagation to complete

### For Administrators: Best Practices

**When Deploying Updates:**

1. **Deploy During Low-Traffic Times**: Make changes when fewer users are active to minimize impact of cache propagation

2. **Wait Before Testing**: After pushing to `main`, wait 2-3 minutes before testing to allow CDN propagation

3. **Test Systematically**:
   ```
   Step 1: Check GitHub Actions completed successfully
   Step 2: Wait 2 minutes
   Step 3: Open site in incognito mode (fresh cache)
   Step 4: If issues persist, clear site-specific cache
   Step 5: Test on multiple devices/browsers
   ```

4. **Monitor Deployment**:
   - GitHub Actions: Check build completed successfully
   - GitHub Pages: Settings → Pages → View deployment status
   - Verify the deployment timestamp matches your latest commit

5. **Communicate with Users**: After major updates, inform users they may need to clear cache or hard refresh

**Cache Headers in Next.js Static Export:**

Next.js adds cache headers to static assets:
- **HTML files**: No cache or short cache (immediate updates)
- **CSS/JS in `_next/static/`**: Long cache with fingerprinted filenames (hash in filename)
- **Why this matters**: When you update CSS, Next.js generates a NEW filename, so browsers should fetch it automatically. If they don't, it's usually a CDN or browser cache issue.

### Developer Workflow: Seeing Changes Immediately

**Quick Method (Desktop):**
1. Open DevTools: `F12`
2. Right-click refresh → "Empty Cache and Hard Reload"
3. This bypasses both browser and CDN cache

**Mobile Testing:**
1. Use browser DevTools device emulation on desktop (fastest)
2. Or: Connect phone to desktop for remote debugging
3. Or: Use site-specific cache clearing on mobile device

**Pro Tip for Active Development:**
- Keep DevTools open with "Disable cache" checked (Network tab)
- This ensures you always see the latest version during development
- Remember: End users won't have this enabled, so final testing should be with cache enabled

### Troubleshooting
If the site appears unstyled or shows desktop navigation on mobile:

**Important:** Incognito/private browsing mode does NOT fix responsive design issues. If you see desktop navigation on mobile even in incognito mode, the CSS file is not loading correctly from GitHub Pages.

#### Clear Cache for This Site Only

**Desktop - Chrome/Edge:**
1. Open DevTools: `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Right-click the refresh button → "Empty Cache and Hard Reload"
3. Or: Go to `chrome://settings/siteData` → Search for "ffcadmin.org" (or "freeforcharity.github.io" for backup URL) → Remove

**Desktop - Safari:**
1. `Cmd+Option+E` (Develop menu must be enabled in Preferences)
2. Or: Safari menu → Clear History → Select "the last hour" → Clear History

**Desktop - Firefox:**
1. `Ctrl+Shift+Delete` (Windows) / `Cmd+Shift+Delete` (Mac)
2. Time range: "Last Hour" → Select only "Cache" → Clear Now

**iPhone/iPad - Safari:**
1. Settings → Safari → Advanced → Website Data
2. Search for "ffcadmin.org" (or "freeforcharity.github.io" for backup) → Swipe left → Delete
3. Or: Settings → Safari → Clear History and Website Data (clears all sites)

**Android - Chrome:**
1. Chrome menu (⋮) → Settings → Privacy and security → Site settings
2. Search for "ffcadmin.org" (or "freeforcharity.github.io" for backup) → Clear & reset
3. Or: Chrome menu → History → Clear browsing data → "Last hour" → Cached images and files

**Android - Samsung Internet:**
1. Menu → Settings → Privacy and security → Delete browsing data
2. Select "Last hour" → Check only "Cache" → Delete

See [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md) for detailed troubleshooting

### What to Expect During Deployments

**Normal Deployment Behavior:**

1. **Push to `main` branch**: GitHub Actions automatically triggers
2. **Build phase** (1-2 minutes): Next.js builds static site
3. **Deploy phase** (instant): Files uploaded to GitHub Pages
4. **CDN propagation** (1-5 minutes): New files distributed to edge servers worldwide
5. **User sees changes**: Depends on their cache state

**If You See Desktop Navigation on Mobile:**

This indicates the CSS file is not loading. Check these items in order:

1. **Verify deployment completed**:
   - Go to repository → Actions tab
   - Latest workflow should show green checkmark
   - Click workflow → "deploy" job should be successful

2. **Check GitHub Pages is active**:
   - Repository → Settings → Pages
   - Should show "Your site is live at https://ffcadmin.org"
   - Backup/testing URL: https://freeforcharity.github.io/ffcadmin.org/
   - Note the last deployment time

3. **Verify CSS file exists**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for CSS file: `/_next/static/css/[hash].css`
   - Should return status `200 OK` not `404 Not Found`

4. **If CSS returns 404**:
   - Check that `.nojekyll` file exists in the `out/` directory (prevents Jekyll from ignoring `_next/`)
   - Verify custom domain configuration in GitHub Pages settings
   - Re-run GitHub Actions workflow

5. **If CSS returns 200 but styles don't apply**:
   - This is a cache issue - follow cache clearing instructions above

**Cache vs. CSS Not Loading:**

- **Cache issue**: Incognito mode works, old version visible in normal browsing
- **CSS not loading**: Even incognito shows unstyled HTML, Network tab shows 404 for CSS
- **CDN propagation**: Some users see new version, others see old (temporary, resolves in 5 min)

### Testing Results
For detailed responsive design testing results, see [RESPONSIVE_TESTING_RESULTS.md](./RESPONSIVE_TESTING_RESULTS.md)

## Analytics

This site uses **Google Tag Manager (GTM)** to manage analytics and tracking tools, including **Microsoft Clarity** for user behavior analytics.
This site uses **Google Tag Manager (GTM)** and **Microsoft Clarity** for user behavior analytics to help improve the user experience.

### Google Tag Manager Setup

Google Tag Manager (GTM-WMZH965Q) is integrated into all pages through the root layout (`app/layout.tsx`). The GTM implementation follows Google's official guidelines:

- **Head Script**: Placed in the `<head>` section as high as possible using Next.js's `Script` component with `strategy="afterInteractive"` for optimal loading performance
- **Body Noscript**: Fallback iframe placed immediately after the opening `<body>` tag for users with JavaScript disabled

GTM provides a centralized way to manage tracking tags, analytics, and marketing tools without modifying code.

### Google Tag Manager Setup

Google Tag Manager is configured with container ID **GTM-WMZH965Q** and is loaded on all pages via `app/layout.tsx`. GTM manages the following tools:
- **Microsoft Clarity**: User behavior analytics and session recordings
- Additional tracking tools can be configured within the GTM container

### Analytics Configuration

**Microsoft Clarity** and other analytics tools are managed entirely through Google Tag Manager:

1. **GTM Container**: `GTM-WMZH965Q` is hardcoded in `app/layout.tsx`
2. **Clarity Configuration**: Set up within GTM dashboard at [https://tagmanager.google.com/](https://tagmanager.google.com/)
3. **Consent Management**: The cookie consent banner (`app/components/CookieConsent.tsx`) pushes consent events to GTM's dataLayer:
   ```javascript
   window.dataLayer.push({
     event: 'consent_update',
     analytics_consent: 'granted' | 'denied',
     marketing_consent: 'granted' | 'denied'
   })
   ```
4. **GTM Triggers**: Configure tags in GTM to fire based on consent_update events

### Adding Microsoft Clarity to GTM

To configure Clarity in Google Tag Manager:

1. Sign up for Microsoft Clarity at [https://clarity.microsoft.com/](https://clarity.microsoft.com/)
2. Create a project and obtain your Clarity Project ID
3. In GTM, create a new Custom HTML tag with the Clarity tracking code
4. Set the tag to fire on consent_update events when analytics_consent = 'granted'
5. Publish the GTM container

**Privacy & Compliance:** This implementation is privacy-compliant and follows GDPR/CCPA requirements:
- All analytics tools load only after explicit user consent
- The cookie consent banner is displayed on first visit
- Users can customize their cookie preferences at any time
- Analytics cookies are deleted if consent is withdrawn
- Consent state is communicated to GTM via dataLayer events

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

## Code Quality and Standards

This project follows industry-standard practices for code quality, style guides, and automated checks. For a comprehensive overview of:
- Current linting and formatting configurations
- Type checking and security scanning
- Testing strategies and coverage
- Recommendations for enhancements

See [CODE_QUALITY.md](./CODE_QUALITY.md) for complete documentation.

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

### GPG Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[SETUP_AUTO_SIGNING.md](./SETUP_AUTO_SIGNING.md)** - Detailed setup instructions
- **[GPG_SIGNING.md](./GPG_SIGNING.md)** - Technical documentation and alternatives
- **[ISSUE_RESOLUTION.md](./ISSUE_RESOLUTION.md)** - Complete issue analysis

## Documentation

This repository contains comprehensive documentation organized by topic. For a complete, indexed view of all documentation:

**📚 Visit the [Documentation Center](https://ffcadmin.org/documentation)** - A public-facing page that:
- Lists all README files in the repository
- Explains what each document covers and why it's important
- Identifies the target audience for each guide
- Provides direct GitHub links to view the latest version
- Offers guidance on how to use the documentation effectively

### Documentation Categories

**Getting Started**
- [README.md](README.md) - This file, the main repository overview
- [QUICK_START.md](QUICK_START.md) - 5-minute GPG signing setup

**Deployment & Operations**
- [DEPLOYMENT.md](DEPLOYMENT.md) - GitHub Pages deployment guide
- [.github/workflows/README.md](.github/workflows/README.md) - CI/CD workflows documentation

**Development & Code Quality**
- [CODE_QUALITY.md](CODE_QUALITY.md) - Code standards and tooling
- [TEST_CASES.md](TEST_CASES.md) - Testing strategy and test documentation

**Security & Authentication**
- [GPG_SIGNING.md](GPG_SIGNING.md) - GPG technical documentation
- [SETUP_AUTO_SIGNING.md](SETUP_AUTO_SIGNING.md) - Detailed GPG setup
- [gpg-keys/README.md](gpg-keys/README.md) - GPG key information
- [AUTO_SIGN_TEST.md](AUTO_SIGN_TEST.md) - Testing GPG signatures

**Design & User Experience**
- [RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md) - Responsive design guide
- [RESPONSIVE_TESTING_RESULTS.md](RESPONSIVE_TESTING_RESULTS.md) - Test results

**Troubleshooting**
- [ISSUE_RESOLUTION.md](ISSUE_RESOLUTION.md) - Issue analysis and solutions
- [IMPLEMENTATION_ISSUES.md](IMPLEMENTATION_ISSUES.md) - Implementation challenges

### For New Developers

If you're new to this project:

1. **Start Here:** Read this README to understand the project structure
2. **Explore the Site:** Visit [ffcadmin.org](https://ffcadmin.org) to see the live portal
3. **Review Tech Stack:** Read the [Technology Stack page](https://ffcadmin.org/tech-stack) for infrastructure details
4. **Set Up Development:** Follow [DEPLOYMENT.md](DEPLOYMENT.md) for local development setup
5. **Understand Standards:** Review [CODE_QUALITY.md](CODE_QUALITY.md) before contributing
6. **Browse All Docs:** Visit the [Documentation Center](https://ffcadmin.org/documentation) for complete documentation

### For Global Administrators

If you're managing this infrastructure:

1. **Deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment procedures
2. **GPG Signing:** Follow [QUICK_START.md](QUICK_START.md) to enable automatic commit signing
3. **Monitoring:** Check [.github/workflows/README.md](.github/workflows/README.md) for CI/CD status
4. **Troubleshooting:** Refer to [ISSUE_RESOLUTION.md](ISSUE_RESOLUTION.md) for common problems
5. **Support Escalation:** Contact Clarke Moyer at (520) 222-8104 for emergencies (after 48 hours)

## Support

### General Support

Open a support ticket with Free For Charity for:
- General questions about the platform
- Feature requests or suggestions
- Non-urgent technical issues
- Documentation improvements

### Emergency Escalation

For urgent issues requiring immediate attention:

**Clarke Moyer:** [(520) 222-8104](tel:520-222-8104)
- Use only if not answered within 48 hours
- Reserved for critical production issues
- Available for infrastructure emergencies

### Contributing

Found an issue or want to contribute?
1. Review [CODE_QUALITY.md](CODE_QUALITY.md) for contribution guidelines
2. Open an issue in the [GitHub repository](https://github.com/FreeForCharity/ffcadmin.org)
3. Submit a pull request following our standards
4. Ensure all tests pass and commits are signed

---

**License:** [Apache 2.0](LICENSE)  
**Organization:** Free For Charity  
**Maintained by:** Global Admin (globaladmin@freeforcharity.org)
