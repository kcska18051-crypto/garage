import { expect, test } from '@playwright/test'

test('customer information pages form one connected section', async ({ page }) => {
  await page.goto('/delivery')
  const navigation = page.getByRole('navigation', { name: 'Информация для покупателей' })
  await expect(navigation.getByRole('link', { name: 'Доставка' })).toHaveAttribute('aria-current', 'page')

  await navigation.getByRole('link', { name: 'Оплата' }).click()
  await expect(page).toHaveURL(/\/payment$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Оплата' })).toBeVisible()

  await navigation.getByRole('link', { name: 'Гарантия на товар' }).click()
  await expect(page).toHaveURL(/\/warranty$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Гарантия на товар' })).toBeVisible()
})

test('footer and product page point to the independent information pages', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: 'Доставка' })).toHaveAttribute('href', '/delivery')
  await expect(footer.getByRole('link', { name: 'Оплата' })).toHaveAttribute('href', '/payment')
  await expect(footer.getByRole('link', { name: 'Гарантия на товар' })).toHaveAttribute('href', '/warranty')

  await page.goto('/product/remeza-vk-10-gr-0001')
  await expect(page.getByRole('link', { name: 'Подробнее о доставке' })).toHaveAttribute('href', '/delivery')
  await expect(page.getByRole('link', { name: 'Подробнее об оплате' })).toHaveAttribute('href', '/payment')
  await expect(page.getByRole('link', { name: 'Подробнее о гарантии' })).toHaveAttribute('href', '/warranty')
})

for (const width of [2560, 1920, 1440, 1024, 390, 360]) {
  test(`information pages remain readable without horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/delivery', '/payment', '/warranty']) {
      await page.goto(route)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true)
      await expect(page.getByTestId('info-section')).toHaveCount(3)
    }

    await page.goto('/delivery')
    const geometry = await page.evaluate(() => {
      const navigation = document.querySelector('.info-navigation')!.getBoundingClientRect()
      const main = document.querySelector('.info-main')!.getBoundingClientRect()
      return { navigation, main }
    })
    if (width > 900) expect(geometry.main.left).toBeGreaterThan(geometry.navigation.right)
    else expect(geometry.main.top).toBeGreaterThanOrEqual(geometry.navigation.bottom)
  })
}
