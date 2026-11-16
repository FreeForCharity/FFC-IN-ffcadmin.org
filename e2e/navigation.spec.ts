import { test, expect } from '@playwright/test'

test.describe('Desktop menu dropdowns', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('a click on the open panel background keeps it open', async ({ page }) => {
    await page.goto('/')
    const button = page.locator('#volunteer-dropdown-button')
    const panel = page.locator('#volunteer-dropdown-menu')
    // Retry the first click until the page has hydrated.
    await expect(async () => {
      if (!(await panel.isVisible())) await button.click()
      await expect(panel).toBeVisible({ timeout: 1000 })
    }).toPass({ timeout: 15_000 })
    await expect(button).toBeFocused()

    // Click the panel's padding, away from any link.
    const box = await panel.boundingBox()
    if (!box) throw new Error('panel has no box')
    await page.mouse.click(box.x + 4, box.y + 4)
    await expect(panel).toBeVisible()
    await expect(button).toHaveAttribute('aria-expanded', 'true')

    // A click outside still closes it.
    await page.mouse.click(5, 700)
    await expect(panel).toBeHidden()
  })
})
