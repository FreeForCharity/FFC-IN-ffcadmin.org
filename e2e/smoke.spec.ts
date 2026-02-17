import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Free For Charity/)
    await expect(page.locator('nav')).toBeVisible()
  })

  test('navigation links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /tech stack/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /documentation/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /training/i })).toBeVisible()
  })

  test('footer is visible on home page', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer.getByText(/Free For Charity/)).toBeVisible()
  })

  test('tech stack page loads', async ({ page }) => {
    await page.goto('/tech-stack/')
    await expect(page).toHaveTitle(/Tech Stack/)
  })

  test('training plan page loads', async ({ page }) => {
    await page.goto('/training-plan/')
    await expect(page.getByText(/Operation Digital Sovereignty/)).toBeVisible()
  })

  test('privacy policy page loads', async ({ page }) => {
    await page.goto('/privacy-policy/')
    await expect(page.getByText(/Privacy Policy/)).toBeVisible()
  })

  test('cookie policy page loads', async ({ page }) => {
    await page.goto('/cookie-policy/')
    await expect(page.getByText(/Cookie Policy/)).toBeVisible()
  })
})
