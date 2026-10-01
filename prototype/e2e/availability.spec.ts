import { expect, test } from '@playwright/test'

const validAvailability = /В наличии в \d+ магазин(?:е|ах)|Под заказ|Доступно для заказа|Нет в наличии|Снят с производства/

test('availability stays consistent across public and account product surfaces', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })

  await page.goto('/')
  await expect(page.locator('.product-card').first().locator('.product-teaser__availability')).toHaveText('В наличии в 1 магазине')

  await page.goto('/search?q=компрессор')
  await expect(page.locator('.product-card').first().locator('.product-teaser__availability')).toHaveText('Под заказ')

  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await expect(page.locator('.catalog-product-card').first().locator('.product-teaser__availability')).toHaveText(validAvailability)
  await page.getByRole('button', { name: 'Список' }).click()
  await expect(page.locator('.catalog-product-card').first().locator('.product-teaser__availability')).toHaveText(validAvailability)

  await page.goto('/brand/remeza/')
  await expect(page.locator('.brand-popular-products .product-teaser__availability').first()).toHaveText(validAvailability)

  await page.goto('/actions/professional-workshop')
  await expect(page.locator('#action-products .product-teaser__availability').first()).toHaveText(validAvailability)

  await page.goto('/product/remeza-vk-10-gr-0001/')
  await expect(page.getByText('В наличии в 2 магазинах').first()).toBeVisible()

  await page.goto('/profile/favorites')
  await expect(page.getByTestId('profile-product-product-1')).toContainText('В наличии в 1 магазине')

  await page.goto('/profile/recently-viewed')
  await expect(page.getByTestId('profile-product-product-5')).toContainText('Нет в наличии')

  await page.goto('/cart')
  await expect(page.getByTestId('cart-line').first()).toContainText('В наличии в 1 магазине')
  await expect(page.getByTestId('cart-line').nth(1)).toContainText('В наличии в 3 магазинах')
})

for (const width of [390, 360]) {
  test(`availability remains readable without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    for (const [path, selector] of [
      ['/', '.product-teaser__availability'],
      ['/catalog/compressor-equipment/screw-compressors', '.product-teaser__availability'],
      ['/product/remeza-vk-10-gr-0001/', '.product-status'],
      ['/search?q=компрессор', '.product-teaser__availability'],
      ['/cart', '.cart-line'],
    ] as const) {
      await page.goto(path)
      await expect(page.locator(selector).first()).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    }
  })
}
