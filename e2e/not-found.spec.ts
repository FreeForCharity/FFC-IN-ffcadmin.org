import { test, expect } from '@playwright/test'

test.describe('Custom 404 page', () => {
  test('unknown URL shows the recovery page with working search', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/')
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Public Roadmap/ })).toBeVisible()

    // The search button on the 404 page opens the global search modal.
    await page.getByRole('button', { name: 'Search the site' }).last().click()
    await expect(page.getByRole('dialog', { name: 'Search the site' })).toBeVisible()
  })
})
