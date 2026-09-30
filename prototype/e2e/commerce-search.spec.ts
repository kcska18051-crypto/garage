import { expect, test } from '@playwright/test'

test('cart quantity and checkout choices persist through success', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/cart')
  await expect(page.getByTestId('cart-line')).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Корзина: 3' })).toBeVisible()
  await page.getByTestId('cart-line').first().getByRole('button', { name: 'Увеличить количество' }).click()
  await expect(page.getByRole('link', { name: 'Корзина: 4' })).toBeVisible()
  await page.getByRole('link', { name: 'Перейти к оформлению' }).click()
  await page.getByLabel('Оформляет организация').click()
  await page.getByRole('link', { name: 'Продолжить оформление' }).click()
  await expect(page.getByLabel('Оплата по счёту')).toBeChecked()
  await page.getByRole('link', { name: 'Подтвердить заказ' }).click()
  await expect(page.getByRole('heading', { name: 'Заказ принят' })).toBeVisible()
})

test('search discovery, history and real result URL work together', async ({ page }) => {
  await page.goto('/')
  const search = page.getByRole('searchbox', { name: 'Поиск по товарам, брендам и артикулам' }).first()
  await search.click()
  await expect(page.getByText('Популярные запросы').first()).toBeVisible()
  await search.fill('компрессор')
  await search.press('Enter')
  await expect(page).toHaveURL(/\/search\?q=/)
  await expect(page.getByRole('heading', { name: /Результаты поиска/ })).toBeVisible()
  await expect(page.getByText('Компрессор поршневой')).toBeVisible()
})

test('new commerce and search pages do not overflow at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/cart', '/checkout/review', '/checkout/delivery', '/search?q=компрессор']) {
    await page.goto(path)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
  await page.goto('/cart')
  await expect(page.getByRole('link', { name: 'Перейти к оформлению' })).toBeVisible()
})
