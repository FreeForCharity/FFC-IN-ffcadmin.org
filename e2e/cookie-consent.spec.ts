import { test, expect } from '@playwright/test'

test.describe('Cookie preferences dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('cookie-consent'))
    await page.reload()
    await page.getByRole('button', { name: 'Customize' }).click()
  })

  test('opens as a native modal dialog with focus inside', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Cookie Preferences' })
    await expect(dialog).toBeVisible()
    await expect(page.locator('dialog:modal')).toHaveCount(1)
    const focusInside = await page.evaluate(() =>
      Boolean(document.querySelector('dialog')?.contains(document.activeElement))
    )
    expect(focusInside).toBe(true)
    // The page behind is not scroll-locked by script.
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
  })

  test('Escape cancels and returns to the banner', async ({ page }) => {
    await page.keyboard.press('Escape')
    await expect(page.locator('dialog[open]')).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Cookie consent notice' })).toBeVisible()
  })

  test('a click on the backdrop cancels', async ({ page }) => {
    await page.mouse.click(5, 5)
    await expect(page.locator('dialog[open]')).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Cookie consent notice' })).toBeVisible()
  })

  test('Save stores the choice and closes everything', async ({ page }) => {
    await page.getByRole('button', { name: 'Save Preferences' }).click()
    await expect(page.locator('dialog[open]')).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Cookie consent notice' })).toHaveCount(0)
    const stored = await page.evaluate(() => localStorage.getItem('cookie-consent'))
    expect(stored).not.toBeNull()
  })
})
