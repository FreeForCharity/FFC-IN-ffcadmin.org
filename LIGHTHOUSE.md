# Lighthouse CI Configuration

This document explains the Lighthouse CI configuration for the ffcadmin.org project.

## Configuration Overview

The project maintains **90% minimum score thresholds** for all categories:

- Performance: 90%
- Accessibility: 90%
- Best Practices: 90%
- SEO: 90%

These thresholds are set as warnings (not errors) to provide visibility into quality metrics while allowing flexibility for minor variations in CI environments.

## Disabled Assertions

### Progressive Web App (PWA) Features

The following PWA-specific assertions are disabled because ffcadmin.org is a **static informational website**, not a Progressive Web App:

- `installable-manifest` - Web app manifest not required for static sites
- `maskable-icon` - PWA icon features not applicable
- `splash-screen` - PWA splash screen not needed
- `themed-omnibox` - Browser theme color not critical for static content
- `service-worker` - Offline functionality not required
- `apple-touch-icon` - iOS PWA features not applicable
- `pwa-cross-browser` - PWA compatibility not relevant
- `pwa-page-transitions` - PWA navigation not applicable
- `pwa-each-page-has-url` - Handled by static site structure

### GitHub Pages Limitations

The following assertions are disabled due to GitHub Pages hosting limitations:

#### `csp-xss` (Content Security Policy)

**Why Disabled:** GitHub Pages does not allow setting custom HTTP headers, including Content Security Policy (CSP) headers. CSP headers must be set at the server/CDN level.

**Mitigation:**

- The site uses Google Tag Manager (GTM) which requires script execution
- All JavaScript is from trusted sources (GTM, Microsoft Clarity)
- Consider re-enabling this check if:
  - The site moves to a hosting platform that supports custom headers
  - A CDN like Cloudflare is used to add security headers

**Documentation:** See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages configuration details.

#### `third-party-cookies`

**Why Disabled:** The site uses Google Tag Manager and Microsoft Clarity for analytics, which require third-party cookies for proper functionality.

**Rationale:**

- Analytics are essential for understanding site usage
- Cookie consent is properly managed via the CookieConsent component
- Users can opt-out of analytics cookies
- Privacy policy clearly discloses cookie usage

**Documentation:** See [Cookie Policy](app/cookie-policy/page.tsx) and [Privacy Policy](app/privacy-policy/page.tsx).

### Performance Optimizations (Not Applicable)

The following performance-related assertions are disabled because they are either not applicable to the static site architecture or are handled automatically by Next.js:

#### `uses-http2`

**Why Disabled:** GitHub Pages does not provide configuration options for HTTP/2. The protocol version is determined by GitHub's infrastructure and cannot be controlled at the repository level.

#### `uses-rel-preconnect`

**Why Disabled:** Preconnect resource hints (`<link rel="preconnect">`) are not applicable for this static site architecture. All resources are served from the same origin (GitHub Pages), and external resources (GTM, Analytics) are loaded through GTM's optimized loading mechanism.

#### `offscreen-images`

**Why Disabled:** Image lazy loading and offscreen image optimization are handled automatically by Next.js defaults and the static export process. Manual configuration of this optimization is not necessary for this project.

## Checks Set to 'Warn' (Should Be Fixed in Future)

The following checks are configured with "warn" level in `lighthouserc.json`. They are non-blocking in CI, but represent real quality issues that should be fixed over time:

### Accessibility

- `color-contrast` - Must meet WCAG contrast requirements
- `label-content-name-mismatch` - Form accessibility is critical
- `link-in-text-block` - Link accessibility must be maintained

### Performance

- `total-byte-weight` - Bundle size should be optimized
- `unsized-images` - Images should have explicit dimensions
- `unused-javascript` - Unused JavaScript should be removed
- `uses-text-compression` - Text resources should be compressed

### Best Practices

- `errors-in-console` - Console errors indicate bugs that should be fixed
- `inspector-issues` - Browser DevTools issues should be resolved

## Improving Scores

To improve Lighthouse scores:

1. **Fix accessibility issues** - Use proper contrast ratios, labels, and ARIA attributes
2. **Optimize performance** - Reduce bundle size, minimize JavaScript, optimize images
3. **Fix console errors** - Address any JavaScript errors or warnings
4. **Monitor regularly** - Check Lighthouse reports after each deployment

## Related Documentation

- [CODE_QUALITY.md](CODE_QUALITY.md) - Quality standards and tooling
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment configuration
- [README.md](README.md) - Project overview and standards
- `.github/workflows/README.md` - CI/CD pipeline documentation
