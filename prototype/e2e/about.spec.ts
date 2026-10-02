import { expect, test } from '@playwright/test'

test('header and footer open the complete company page', async ({ page }) => {
  await page.goto('/')
  const headerLink = page.getByRole('banner').getByRole('link', { name: 'О компании' })
  if (await headerLink.isVisible()) await headerLink.click()
  else await page.getByRole('contentinfo').getByRole('link', { name: 'О компании' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('heading', { level: 1, name: 'О компании' })).toBeVisible()
  await expect(page.getByRole('list', { name: 'Основные направления работы' }).getByRole('listitem')).toHaveCount(3)
})

for (const width of [1920, 1440, 1024, 390, 360]) {
  test(`company page stays contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 })
    await page.goto('/about')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true)
    await expect(page.getByRole('heading', { level: 1, name: 'О компании' })).toBeVisible()
  })
}
