import { expect, test } from '@playwright/test'

test('direct unknown route shows the minimal 404 and both actions work', async ({ page }) => {
  await page.goto('/missing-direct-route')
  const main = page.getByRole('main')
  await expect(main.getByText('404')).toBeVisible()
  await expect(main.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible()
  await expect(main.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/')
  const catalogLink = main.getByRole('link', { name: 'В каталог' })
  await expect(catalogLink).toHaveAttribute('href', '/catalog')
  expect(await catalogLink.evaluate((element) => getComputedStyle(element).color)).toBe('rgb(32, 32, 30)')

  await catalogLink.click()
  await expect(page).toHaveURL(/\/catalog$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Каталог' })).toBeVisible()

  await page.goto('/another-missing-route')
  await page.getByRole('main').getByRole('link', { name: 'На главную' }).click()
  await expect(page).toHaveURL(/\/$/)
})

for (const width of [1920, 390, 360]) {
  test(`404 has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/missing-responsive-route')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true)
    await expect(page.locator('.not-found-page')).toBeVisible()
    const alignment = await page.evaluate(() => {
      const main = document.querySelector('.not-found-page')!.getBoundingClientRect()
      const items = [...document.querySelector('.not-found-page')!.children].map((item) => item.getBoundingClientRect())
      const content = {
        left: Math.min(...items.map((item) => item.left)),
        right: Math.max(...items.map((item) => item.right)),
        top: Math.min(...items.map((item) => item.top)),
        bottom: Math.max(...items.map((item) => item.bottom)),
      }
      return {
        horizontalDelta: Math.abs((content.left + content.right) / 2 - (main.left + main.right) / 2),
        verticalDelta: Math.abs((content.top + content.bottom) / 2 - (main.top + main.bottom) / 2),
        centeredText: getComputedStyle(document.querySelector('.not-found-page')!).textAlign,
      }
    })
    expect(alignment.horizontalDelta).toBeLessThanOrEqual(2)
    expect(alignment.verticalDelta).toBeLessThanOrEqual(8)
    expect(alignment.centeredText).toBe('center')
  })
}
