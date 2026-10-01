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

test('cart uses a centered two-column workspace with selection, totals and recommendations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/cart')
  const layout = page.locator('.cart-layout')
  const box = await layout.boundingBox()
  expect(box?.width).toBeLessThanOrEqual(1280)
  await expect(page.getByRole('checkbox', { name: 'Выбрать все товары' })).toBeChecked()
  await page.getByRole('checkbox', { name: /Выбрать Компрессор поршневой Remeza/ }).uncheck()
  await expect(page.getByRole('complementary', { name: 'Итоги заказа' })).toContainText('55 800 ₽')
  await expect(page.getByTestId('cart-recommendation')).toHaveCount(3)
  await page.getByRole('textbox', { name: 'Промокод' }).fill('GARAGE-DEMO')
  await page.getByRole('button', { name: 'Применить промокод' }).click()
  await expect(page.getByRole('status')).toContainText('Промокод применён')
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
