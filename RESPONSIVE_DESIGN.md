# Responsive Design Documentation

## Overview
This website is fully responsive and optimized for mobile, tablet, and desktop devices using Tailwind CSS breakpoints.

## Breakpoints
The site uses standard Tailwind CSS breakpoints:
- **Mobile**: < 640px (default)
- **Small (sm)**: ≥ 640px
- **Medium (md)**: ≥ 768px
- **Large (lg)**: ≥ 1024px

## Navigation Behavior

### Mobile (< 768px)
- Logo shows abbreviated "F" icon only
- Desktop navigation links are hidden
- Hamburger menu button is visible in top-right corner
- Clicking hamburger reveals slide-down menu with navigation links
- Menu closes when clicking any link or the X button

### Tablet & Desktop (≥ 768px)
- Full logo visible: "Free For Charity - Admin Portal"
- Desktop navigation links visible in header: Home, Tech Stack, GitHub
- Hamburger menu button is hidden
- Navigation is always visible

## Expected Responsive Behavior

### At 375px (iPhone SE, small phones)
✅ Logo: "F" icon only
✅ Navigation: Hamburger menu button
✅ Content: Single column layout
✅ Buttons: Full width, stacked vertically

### At 768px (iPad, tablets)
✅ Logo: Full text visible
✅ Navigation: Inline links in header
✅ Content: 2-column grid for features
✅ Buttons: Side-by-side horizontal layout

### At 1024px+ (Laptops, desktops)
✅ Logo: Full text visible
✅ Navigation: Inline links in header
✅ Content: 3-column grid for features
✅ Maximum width: 1280px (centered)

## Troubleshooting

### Issue: Desktop navigation visible on mobile
**Symptoms**: You see "Home Tech Stack GitHub" links on mobile instead of hamburger menu

**Possible causes**:
1. **Browser cache**: The CSS file isn't loading due to cached version
2. **CSS not loading**: Check browser console for 404 errors
3. **Wrong viewport**: Browser is rendering at desktop width

**Solutions**:
1. **Hard refresh** the page:
   - **Desktop - Chrome/Edge**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - **Desktop - Safari**: `Cmd+Option+R`
   - **Desktop - Firefox**: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
   - **iPhone/iPad**: Long press the refresh button in Safari → tap "Request Desktop Website" → reload
   - **Android - Chrome**: Tap the three dots menu → Settings → Privacy and security → Clear browsing data → select "Cached images and files" → Clear data

2. **Check CSS loading**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Refresh page
   - Look for CSS file loading (should be `/ffcadmin.org/_next/static/css/...`)
   - Should show status 200 (OK), not 404 (Not Found)

3. **Verify viewport**:
   - Open DevTools
   - Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
   - Select a mobile device (iPhone, Pixel, etc.)
   - Refresh page

4. **Clear browser cache**:
   - **Desktop - Chrome**: Settings → Privacy → Clear browsing data → Cached images and files
   - **Desktop - Safari**: Develop → Empty Caches (or Safari → Clear History)
   - **Desktop - Firefox**: Options → Privacy → Clear Data → Cached Web Content
   - **iPhone/iPad - Safari**: Settings → Safari → Clear History and Website Data
   - **Android - Chrome**: Chrome menu (three dots) → History → Clear browsing data → Cached images and files
   - **Android - Samsung Internet**: Menu → Settings → Privacy and security → Delete browsing data → Cache

### Issue: Styles not applied (plain HTML)
**Symptoms**: Page shows plain text without colors, no blue header, no styling

**Cause**: CSS file failed to load

**Solution**:
1. Check that `.nojekyll` file exists in the root (prevents Jekyll from ignoring `_next/` folder)
2. Verify GitHub Pages is deploying from GitHub Actions (not branch)
3. Check GitHub Actions workflow completed successfully
4. Wait 1-2 minutes for CDN propagation after deployment
5. Hard refresh browser (see above)

### Issue: Menu doesn't open on mobile
**Symptoms**: Hamburger button visible but clicking does nothing

**Cause**: JavaScript not loading or disabled

**Solution**:
1. Check browser console for JavaScript errors
2. Ensure JavaScript is enabled in browser settings
3. Try a different browser
4. Hard refresh page

## Testing Responsive Design

### Using Browser DevTools
1. Open the site in Chrome, Edge, or Firefox
2. Press F12 to open DevTools
3. Click the device toolbar icon (or press Ctrl+Shift+M / Cmd+Shift+M)
4. Select different devices from dropdown:
   - Mobile: iPhone SE, Pixel 5
   - Tablet: iPad, iPad Pro
   - Desktop: Responsive with custom dimensions

### Testing Breakpoints
You can test specific breakpoints by setting custom dimensions:
- 375px width: Mobile phone
- 768px width: Tablet (md breakpoint triggers)
- 1024px width: Desktop (lg breakpoint triggers)
- 1280px width: Large desktop

## Technical Implementation

### Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
This ensures the page scales correctly on mobile devices.

### Responsive CSS Classes
The navigation uses these Tailwind classes:
- `hidden md:flex` - Hidden on mobile, flex on tablet+
- `md:hidden` - Visible on mobile, hidden on tablet+
- `hidden sm:block` - Hidden on tiny mobile, visible on larger screens

### Mobile Menu State
The mobile menu uses React state to toggle visibility:
- Closed by default
- Opens when hamburger clicked
- Closes when link clicked or X button pressed

## Browser Compatibility
✅ Chrome/Edge 90+
✅ Safari 14+
✅ Firefox 88+
✅ Mobile Safari (iOS 14+)
✅ Chrome Mobile (Android 10+)

## GitHub Pages Configuration
The site is configured for GitHub Pages with:
- Static HTML export (`output: 'export'`)
- Base path: `/ffcadmin.org`
- `.nojekyll` file to prevent Jekyll processing
- Trailing slashes for proper routing

All assets are served from `/ffcadmin.org/_next/static/` path.
