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

for (const width of [1920, 1440, 1024, 390, 360]) {
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
