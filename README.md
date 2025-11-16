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
**Status:** ✅ Deployed to GitHub Pages with Custom Domain  
**Primary URL:** https://ffcadmin.org  
**Backup URL:** https://freeforcharity.github.io/ffcadmin.org/ (GitHub Pages default, for testing)

The site is deployed and accessible via a custom domain (ffcadmin.org) with GitHub Pages. The site is fully responsive and works on mobile, tablet, and desktop devices.

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

**Important:** Incognito/private browsing mode does NOT fix responsive design issues. If you see desktop navigation on mobile even in incognito mode, the CSS file may not be loading correctly from GitHub Pages.

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
