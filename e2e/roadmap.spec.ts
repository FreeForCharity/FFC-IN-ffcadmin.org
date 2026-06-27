import { test, expect } from '@playwright/test'

test.describe('Public Roadmap', () => {
  test('roadmap page loads with hero CTAs and all sections', async ({ page }) => {
    await page.goto('/roadmap/')
    await expect(page).toHaveTitle(/Public Roadmap/)
    await expect(page.getByRole('link', { name: 'Submit a request' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Become a sponsoring admin' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Needs a sponsoring admin' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Active builds' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Launched charities' })).toBeVisible()
  })

  test('real portfolio renders: FFC scored, others readiness pending', async ({ page }) => {
    await page.goto('/roadmap/')
    await expect(page.getByRole('heading', { name: 'Free For Charity', exact: true })).toBeVisible()
    // FFC is scored Mature; portfolio sites show a "Readiness pending" badge.
    await expect(page.getByText('Mature').first()).toBeVisible()
    await expect(page.getByText('Readiness pending').first()).toBeVisible()
  })

  test('top-level Roadmap nav link works', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav a[href*="/roadmap"]').first().click()
    await expect(page).toHaveURL(/\/roadmap\/?$/)
  })

  test('submit page shows the three request paths and the fallback number', async ({ page }) => {
    await page.goto('/roadmap/submit/')
    await expect(page.getByRole('heading', { name: 'Apply for FFC service' })).toBeVisible()
    await expect(page.getByText('520-222-8104')).toBeVisible()
  })

  test('sponsor page shows the commitment section', async ({ page }) => {
    await page.goto('/roadmap/sponsor/')
    await expect(page.getByRole('heading', { name: 'The commitment' })).toBeVisible()
    await expect(page.getByText(/no more than 3 concurrent active sponsorships/)).toBeVisible()
  })

  test('methodology page renders scoring tables and tier labels', async ({ page }) => {
    await page.goto('/roadmap/methodology/')
    await expect(page.getByRole('heading', { name: 'How the queue is sorted' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Tier labels' })).toBeVisible()
    await expect(page.getByText('Mature').first()).toBeVisible()
  })
})

test.describe('Intake Help', () => {
  test('hub lists topics and links to a full guide', async ({ page }) => {
    await page.goto('/intake-help/')
    await expect(page).toHaveTitle(/Intake Help/)
    await page
      .getByRole('link', { name: /Board requirements/ })
      .first()
      .click()
    await expect(page).toHaveURL(/\/intake-help\/board-requirements\/?$/)
    await expect(page.getByRole('heading', { name: 'Board requirements', level: 1 })).toBeVisible()
  })

  test('leaf page shows the sidebar and back-to-intake link', async ({ page }) => {
    await page.goto('/intake-help/public-contact-info/')
    await expect(page.getByRole('navigation', { name: 'Intake help navigation' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Back to intake/ })).toBeVisible()
  })
})
