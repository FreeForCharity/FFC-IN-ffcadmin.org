import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Free For Charity/)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('navigation structure is correct', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav.locator('a[href="/"]').first()).toBeVisible()
    // Prominent charity-owner CTA button
    await expect(nav.locator('a[href*="/site-owner"]').first()).toBeVisible()
    // Audience-first mega-menus: Volunteer + Operate (Training folds into
    // Volunteer, Resources folds into Operate)
    await expect(nav.locator('button:has-text("Volunteer")')).toBeVisible()
    await expect(nav.locator('button:has-text("Operate")')).toBeVisible()
  })

  test('volunteer mega-menu links are accessible (incl. nested training)', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav button:has-text("Volunteer")').first().hover()
    await expect(page.locator('nav a[href*="/get-involved"]').first()).toBeVisible()
    await expect(page.locator('nav a[href*="/contributor-ladder"]').first()).toBeVisible()
    await expect(page.locator('nav a[href*="/continuing-education"]').first()).toBeVisible()
    // Training tracks now live under Volunteer
    await expect(page.locator('nav a[href*="/training/web-developer"]').first()).toBeVisible()
    await expect(page.locator('nav a[href*="/canva-designer-path"]').first()).toBeVisible()
  })

  test('operate mega-menu links are accessible (incl. nested resources)', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav button:has-text("Operate")').first().hover()
    await expect(page.locator('nav a[href*="/sites-list"]').first()).toBeVisible()
    await expect(page.locator('nav a[href*="/documentation"]').first()).toBeVisible()
    await expect(page.locator('nav a[href*="/testing"]').first()).toBeVisible()
    // Resources now live under Operate
    await expect(page.locator('nav a[href*="/guides"]').first()).toBeVisible()
    await expect(page.locator('nav a[href*="/what-ffc-delivers"]').first()).toBeVisible()
  })

  test('footer is visible on home page', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer.getByText('Free For Charity EIN')).toBeVisible()
  })

  test('tech stack page loads', async ({ page }) => {
    await page.goto('/tech-stack/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('training plan page loads', async ({ page }) => {
    await page.goto('/training-plan/')
    await expect(page.getByRole('heading', { name: 'Operation Digital Sovereignty' })).toBeVisible()
  })

  test('privacy policy page loads', async ({ page }) => {
    await page.goto('/privacy-policy/')
    await expect(page.getByRole('heading', { name: 'Privacy Policy', exact: true })).toBeVisible()
  })

  test('cookie policy page loads', async ({ page }) => {
    await page.goto('/cookie-policy/')
    await expect(page.getByRole('heading', { name: 'Cookie Policy', exact: true })).toBeVisible()
  })

  test('blog page loads with posts', async ({ page }) => {
    await page.goto('/blog/')
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible()
    await expect(page.getByText('Welcome to Free For Charity')).toBeVisible()
  })

  test('volunteer page loads', async ({ page }) => {
    await page.goto('/volunteer/')
    await expect(page.getByText('Volunteer Your Skills.')).toBeVisible()
  })

  test('breadcrumbs are visible on nested pages', async ({ page }) => {
    await page.goto('/blog/welcome-to-ffc/')
    await expect(page.getByLabel('Breadcrumb')).toBeVisible()
    await expect(page.getByLabel('Breadcrumb').getByText('Blog')).toBeVisible()
  })
})
