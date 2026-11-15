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

  test('Save keeps the toggles the visitor changed', async ({ page }) => {
    // The toggle input is visually hidden; its styled label is what people click.
    await page.getByLabel('Enable analytics cookies').check({ force: true })
    await page.getByRole('button', { name: 'Save Preferences' }).click()
    await expect(page.locator('dialog[open]')).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Cookie consent notice' })).toHaveCount(0)
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('cookie-consent') ?? '{}')
    )
    expect(stored.analytics).toBe(true)
  })

  test('Escape discards toggles the visitor changed', async ({ page }) => {
    await page.getByLabel('Enable analytics cookies').check({ force: true })
    await page.keyboard.press('Escape')
    await expect(page.locator('dialog[open]')).toHaveCount(0)
    expect(await page.evaluate(() => localStorage.getItem('cookie-consent'))).toBeNull()
    await page.getByRole('button', { name: 'Customize' }).click()
    await expect(page.getByLabel('Enable analytics cookies')).not.toBeChecked()
  })
})

test.describe('Cookie preferences dialog without native closedby', () => {
  test('the script fallback closes it on a backdrop click', async ({ page }) => {
    await page.addInitScript(() => {
      delete (HTMLDialogElement.prototype as unknown as Record<string, unknown>).closedBy
    })
    await page.goto('/')
    await page.evaluate(() => localStorage.removeItem('cookie-consent'))
    await page.reload()
    expect(await page.evaluate(() => 'closedBy' in HTMLDialogElement.prototype)).toBe(false)
    await page.getByRole('button', { name: 'Customize' }).click()
    await expect(page.locator('dialog:modal')).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(page.locator('dialog[open]')).toHaveCount(0)
  })
})
