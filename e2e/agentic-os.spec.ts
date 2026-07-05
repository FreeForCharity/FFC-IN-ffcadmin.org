import { test, expect } from '@playwright/test'

test.describe('Agentic OS', () => {
  test('overview page loads with hero and plane links', async ({ page }) => {
    await page.goto('/agentic-os/')
    await expect(page).toHaveTitle(/Agentic OS/)
    await expect(page.getByRole('heading', { name: 'The FFC Agentic OS' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'The five planes' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'FFC-IN-AI-Management' })).toBeVisible()
  })

  test('session inventory dashboard renders repo tables', async ({ page }) => {
    await page.goto('/agentic-os/session-inventory/')
    await expect(page.getByRole('heading', { name: 'Agent Session Inventory' })).toBeVisible()
    // A stable internal repo always appears in the table (assert structure, not counts).
    await expect(page.getByRole('link', { name: 'FFC-IN-ffcadmin.org' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'How this data is collected' })).toBeVisible()
  })

  test('architecture page shows layers and roadmap', async ({ page }) => {
    await page.goto('/agentic-os/architecture/')
    await expect(page.getByRole('heading', { name: 'Agentic OS Architecture' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'The six layers' })).toBeVisible()
    await expect(page.getByText('Phase 0 — Capture (this site)')).toBeVisible()
  })

  test('Operate nav menu exposes the Agentic OS link', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav button:has-text("Operate")').first().hover()
    await expect(page.locator('nav a[href*="/agentic-os"]').first()).toBeVisible()
  })
})
