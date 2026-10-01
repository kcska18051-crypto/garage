import { expect, test } from '@playwright/test'

test('comparison groups products and keeps controls interactive', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/compare')

  await expect(page.getByRole('heading', { level: 1, name: 'Сравнение товаров' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Компрессоры 3' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByTestId('compare-product-card')).toHaveCount(3)
  await expect(page.getByRole('rowheader', { name: 'Тип компрессора' })).toBeVisible()

  await page.getByRole('checkbox', { name: 'Показывать только различия' }).check()
  await expect(page.getByRole('rowheader', { name: 'Тип компрессора' })).toHaveCount(0)
  await expect(page.getByRole('rowheader', { name: 'Производительность' })).toBeVisible()

  await page.getByTestId('compare-product-card').first().getByRole('button', { name: /Убрать из сравнения/ }).click()
  await expect(page.getByTestId('compare-product-card')).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Сравнение: 3' })).toBeVisible()
})

test('comparison uses the same centered widescreen container as the header at 2560px', async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1440 })
  await page.goto('/compare')

  const main = await page.locator('main.compare-page').boundingBox()
  const header = await page.locator('.desktop-header').boundingBox()
  expect(main).not.toBeNull()
  expect(header).not.toBeNull()
  expect(main!.width).toBeLessThanOrEqual(1440)
  expect(Math.abs(main!.x - header!.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(main!.width - header!.width)).toBeLessThanOrEqual(1)
  expect(Math.abs(main!.x - (2560 - main!.x - main!.width))).toBeLessThanOrEqual(1)
})

for (const width of [2560, 1920, 1440, 1024, 390, 360]) {
  test(`comparison keeps the page viewport clean at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
    await page.goto('/compare')
    await expect(page.getByTestId('compare-product-card')).toHaveCount(3)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    if (width <= 390) {
      const rail = page.getByTestId('compare-scroll-area')
      await expect(rail).toHaveCSS('overflow-x', 'auto')
      expect(await rail.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true)
      await expect(page.getByText(/Проведите в сторону/)).toBeVisible()
    }
  })
}
