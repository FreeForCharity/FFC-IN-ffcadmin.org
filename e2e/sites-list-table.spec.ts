import { test, expect, type Locator } from '@playwright/test'

/** The domain names in a tier table, top to bottom. */
async function domainColumn(table: Locator) {
  return table
    .locator('tbody tr')
    .evaluateAll((rows) => rows.map((row) => row.querySelector('td a')?.textContent?.trim() ?? ''))
}

test.describe('sites list tables', () => {
  test('a column header sorts the table and reports the order', async ({ page }) => {
    await page.goto('/sites-list/')
    const table = page.locator('details[open] table').first()
    const header = table.getByRole('columnheader', { name: /^Domain/ })
    const button = header.getByRole('button')
    const before = await domainColumn(table)
    expect(before.length).toBeGreaterThan(1)

    // Retry the first press until the page has hydrated.
    await expect(async () => {
      await button.click()
      await expect(header).toHaveAttribute('aria-sort', 'ascending', { timeout: 1000 })
    }).toPass({ timeout: 15_000 })
    const ascending = await domainColumn(table)
    expect(ascending).toEqual(
      [...before].sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase(), undefined, { numeric: true })
      )
    )

    await button.click()
    await expect(header).toHaveAttribute('aria-sort', 'descending')
    expect(await domainColumn(table)).toEqual([...ascending].reverse())

    // A third press goes back to the tier's own order.
    await button.click()
    await expect(header).not.toHaveAttribute('aria-sort')
    expect(await domainColumn(table)).toEqual(before)
  })

  test('on a phone the tables scroll in their own box and take keyboard focus', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/sites-list/')
    const region = page.getByRole('region', { name: /^Tier 1/ })
    await expect(region).toHaveAttribute('tabindex', '0', { timeout: 15_000 })
    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(pageOverflow).toBeLessThanOrEqual(0)
    await region.focus()
    await page.keyboard.press('ArrowRight')
    await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
  })
})
