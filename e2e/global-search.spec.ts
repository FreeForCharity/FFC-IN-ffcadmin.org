import { test, expect } from '@playwright/test'

test.describe('Global site search', () => {
  test('opens with Ctrl+K, finds a page, and navigates to it', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')

    const dialog = page.getByRole('dialog', { name: 'Search the site' })
    await expect(dialog).toBeVisible()

    await dialog.getByRole('searchbox').fill('methodology')
    await dialog.getByRole('button', { name: /Readiness methodology/ }).click()

    await expect(page).toHaveURL(/\/roadmap\/methodology\/?$/)
  })

  test('trigger button opens the modal and Escape closes it', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Search the site' }).first().click()

    const dialog = page.getByRole('dialog', { name: 'Search the site' })
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  })

  test('shows a no-match state for gibberish', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog', { name: 'Search the site' })
    await dialog.getByRole('searchbox').fill('zzzznotapage')
    await expect(dialog.getByText(/No pages match/)).toBeVisible()
  })

  test('modal links through to the full /search results page', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog', { name: 'Search the site' })
    await dialog.getByRole('searchbox').fill('guide')
    await dialog.getByRole('button', { name: /See all results/ }).click()
    await expect(page).toHaveURL(/\/search\/?\?q=guide$/)
    await expect(page.getByRole('heading', { name: 'Search the site' })).toBeVisible()
  })
})

test.describe('Search results page', () => {
  test('deep link /search?q= renders ranked results', async ({ page }) => {
    await page.goto('/search/?q=methodology')
    await expect(page.getByRole('searchbox')).toHaveValue('methodology')
    await expect(page.getByRole('link', { name: /Readiness methodology/ })).toBeVisible()
  })
})
