import { expect, test } from '@playwright/test'

test('product detail supports gallery, commerce actions, anchors and request modes', async ({ page }) => {
  await page.goto('/product/remeza-vk-10-gr-0001/')
  await expect(page.getByRole('heading', { level: 1, name: 'Remeza ВК 10' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Remeza', exact: true })).toHaveAttribute('href', '/brand/remeza/')
  await expect(page.locator('.product-purchase__notice:visible, .product-mobile-purchase small:visible')).toHaveText('Демонстрационные данные прототипа')

  await page.getByRole('button', { name: 'Добавить в сравнение' }).click()
  await page.getByRole('button', { name: 'Добавить в избранное' }).click()
  await page.getByRole('button', { name: 'В корзину' }).first().click()
  if (page.viewportSize()!.width >= 768) await expect(page.getByRole('link', { name: 'Сравнение: 1' })).toBeVisible()
  else await expect(page.getByRole('button', { name: 'Убрать из сравнения' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('link', { name: 'Избранное: 1' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Корзина: 1' })).toBeVisible()

  await page.getByRole('button', { name: 'Миниатюра 2' }).click()
  await expect(page.locator('.product-gallery__main')).toHaveAttribute('data-image', '2')
  await page.getByRole('button', { name: 'Увеличить изображение' }).click()
  await expect(page.getByRole('dialog', { name: 'Увеличенное изображение товара' })).toBeVisible()
  await page.getByRole('button', { name: 'Закрыть изображение' }).click()

  await page.getByRole('button', { name: 'Получить коммерческое предложение' }).click()
  await expect(page.getByRole('status')).toContainText('коммерческого предложения')
})

test('mobile product detail keeps the purchase action above bottom navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/product/remeza-vk-10-gr-0001/')
  const purchaseBar = page.locator('.product-mobile-purchase')
  const bottomNav = page.getByRole('navigation', { name: 'Мобильная навигация' })
  await expect(purchaseBar).toBeVisible()
  const purchaseBox = await purchaseBar.boundingBox()
  const navBox = await bottomNav.boundingBox()
  expect(purchaseBox).not.toBeNull()
  expect(navBox).not.toBeNull()
  expect(purchaseBox!.y + purchaseBox!.height).toBeLessThanOrEqual(navBox!.y + 1)
})
