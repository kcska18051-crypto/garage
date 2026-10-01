import { expect, test } from '@playwright/test'

test('cart quantity and checkout choices persist through success', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/cart')
  await expect(page.getByTestId('cart-line')).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Корзина: 3' })).toBeVisible()
  await page.getByTestId('cart-line').first().getByRole('button', { name: 'Увеличить количество' }).click()
  await expect(page.getByRole('link', { name: 'Корзина: 4' })).toBeVisible()
  await page.getByRole('link', { name: 'Перейти к оформлению' }).click()
  await page.getByRole('tab', { name: /Самовывоз/ }).click()
  await page.getByRole('button', { name: 'Выбрать пункт выдачи' }).click()
  await page.getByLabel('Картой онлайн').click()
  await page.getByRole('button', { name: 'Оформить заказ' }).click()
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

test('one-page checkout switches recipient, customer, delivery and payment states', async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1440 })
  await page.goto('/checkout/review')
  const header = await page.locator('.desktop-header').boundingBox()
  const main = await page.locator('main.checkout-page').boundingBox()
  expect(header).not.toBeNull()
  expect(main).not.toBeNull()
  expect(main!.width).toBeLessThanOrEqual(1440)
  expect(Math.abs(main!.x - header!.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(main!.width - header!.width)).toBeLessThanOrEqual(1)
  expect(Math.abs(main!.x - (2560 - main!.x - main!.width))).toBeLessThanOrEqual(1)
  await expect(page.getByRole('heading', { name: 'Оформление заказа' })).toBeVisible()
  await expect(page.getByLabel('Оформить как гость')).toHaveCount(0)
  await page.getByLabel('Заберёт другой человек').check()
  await expect(page.getByLabel('Фамилия получателя')).toBeVisible()
  await page.getByRole('tab', { name: 'Купить как юридическое лицо' }).click()
  await expect(page.getByLabel('Оплата по счёту')).toBeChecked()
  await page.getByRole('tab', { name: /Курьером/ }).click()
  await page.getByRole('button', { name: 'Указать адрес доставки' }).click()
  await page.getByLabel('Адрес доставки').fill('ул. Примерная, 10')
  await expect(page.getByRole('complementary', { name: 'Итоги заказа' })).toContainText('Курьером')
  await page.getByRole('tab', { name: 'Покупка для себя' }).click()
  await page.getByRole('tab', { name: /Транспортная компания/ }).click()
  await expect(page.getByLabel('При получении')).toBeDisabled()
  await expect(page.getByText(/Спасибо/i)).toHaveCount(0)
})

test('mobile checkout hint scrolls to the main CTA and hides when it is visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/checkout/review')
  const hint = page.getByTestId('mobile-checkout-hint')
  await expect(hint).toBeVisible()
  await hint.getByRole('button', { name: 'Перейти к оформлению заказа' }).click()
  await expect(page.getByTestId('checkout-submit')).toBeInViewport()
  await expect(hint).toBeHidden()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

for (const width of [2560, 1920, 1440, 1024, 768, 390, 360]) {
  test(`checkout review is centered without document overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
    await page.goto('/checkout/review')
    const box = await page.locator('main.checkout-page').boundingBox()
    expect(box).not.toBeNull()
    const viewport = await page.evaluate(() => document.documentElement.clientWidth)
    const left = box!.x
    const right = viewport - box!.x - box!.width
    expect(Math.abs(left - right)).toBeLessThanOrEqual(1)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })
}

for (const width of [2560, 1920, 1440, 1024, 390, 360]) {
  test(`cart main container is centered without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
    await page.goto('/cart')
    const box = await page.locator('main.cart-page').boundingBox()
    expect(box).not.toBeNull()
    const left = box!.x
    const right = width - box!.x - box!.width
    expect(Math.abs(left - right)).toBeLessThanOrEqual(1)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })
}

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
