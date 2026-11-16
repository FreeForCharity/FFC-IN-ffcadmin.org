import { test, expect } from '@playwright/test'

/**
 * The Back to top button appears after 400px of scrolling (an
 * IntersectionObserver sentinel, not a scroll listener) and returns to the
 * top. Reduced motion makes the jump instant so the test is deterministic.
 */
test.use({ viewport: { width: 1280, height: 800 } })

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  // The first-visit cookie banner sits over the bottom of the page; answer it
  // the way a visitor would before using the button.
  await page.getByRole('button', { name: 'Decline All' }).click()
})

test('Back to top appears after scrolling and returns to the top', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Back to top' })
  await expect(button).toHaveCount(0)

  // Retry the scroll: until the page hydrates, Next.js may reset it to the top.
  await expect(async () => {
    await page.evaluate(() => window.scrollTo(0, 1200))
    await expect(button).toBeVisible({ timeout: 1000 })
  }).toPass({ timeout: 15_000 })

  await button.click()
  // With reduced motion the jump is instant: read the position once, with no
  // waiting, so a smooth scroll would fail here.
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await expect(button).toHaveCount(0)
})

test('Back to top shows only past 400px', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Back to top' })
  // Wait until the observer is running: the button must appear first, so a
  // later absence is about the threshold and not about hydration.
  await expect(async () => {
    await page.evaluate(() => window.scrollTo(0, 1200))
    await expect(button).toBeVisible({ timeout: 1000 })
  }).toPass({ timeout: 15_000 })

  await page.evaluate(() => window.scrollTo(0, 300))
  await expect(button).toHaveCount(0)
  await page.evaluate(() => window.scrollTo(0, 450))
  await expect(button).toBeVisible()
})

test('reduced motion turns off smooth scrolling for in-page links', async ({ page }) => {
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto'
  )
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'smooth'
  )
})
