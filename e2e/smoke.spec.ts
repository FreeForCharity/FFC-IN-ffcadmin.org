import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Free For Charity/)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('navigation links are present', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav.getByRole('link', { name: 'Tech Stack', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Documentation', exact: true })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Training Plan', exact: true })).toBeVisible()
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
    await expect(
      page.getByRole('heading', { name: 'Operation Digital Sovereignty' })
    ).toBeVisible()
  })

  test('privacy policy page loads', async ({ page }) => {
    await page.goto('/privacy-policy/')
    await expect(
      page.getByRole('heading', { name: 'Privacy Policy', exact: true })
    ).toBeVisible()
  })

  test('cookie policy page loads', async ({ page }) => {
    await page.goto('/cookie-policy/')
    await expect(
      page.getByRole('heading', { name: 'Cookie Policy', exact: true })
    ).toBeVisible()
  })
})
