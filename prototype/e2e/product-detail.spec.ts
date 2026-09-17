import { expect, test } from '@playwright/test'

test('product detail keeps the approved hierarchy and interactive buying flow', async ({ page }) => {
  await page.goto('/product/remeza-vk-10-gr-0001/')
  const heading = page.getByRole('heading', { level: 1, name: 'Винтовой компрессор Remeza ВК 10-8 с ременным приводом, 380 В, 7,5 кВт' })
  await expect(heading).toBeVisible()
  const headingBox = await heading.boundingBox()
  const heroBox = await page.locator('.product-hero').boundingBox()
  expect(headingBox!.y + headingBox!.height).toBeLessThan(heroBox!.y)
  await expect(page.getByRole('main').getByRole('link', { name: 'Remeza', exact: true })).toHaveAttribute('href', '/brand/remeza/')

  await page.getByRole('button', { name: 'Сравнить' }).click()
  await page.getByRole('button', { name: 'В избранное' }).click()
  await page.getByRole('button', { name: 'В корзину' }).first().click()
  if (page.viewportSize()!.width >= 768) await expect(page.getByRole('link', { name: 'Сравнение: 1' })).toBeVisible()
  else await expect(page.getByRole('button', { name: 'Сравнить' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('link', { name: 'Избранное: 1' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Корзина: 1' })).toBeVisible()

  await page.getByRole('button', { name: 'Следующее изображение' }).first().click()
  await expect(page.getByText('2 из 5').first()).toBeVisible()
  await page.getByRole('button', { name: 'Увеличить изображение' }).click()
  const galleryDialog = page.getByRole('dialog', { name: 'Увеличенный просмотр товара' })
  await expect(galleryDialog.getByRole('complementary', { name: 'Покупка в увеличенном просмотре' })).toBeVisible()
  await galleryDialog.getByRole('button', { name: 'Закрыть изображение' }).click()

  await page.getByRole('button', { name: '220 В' }).click()
  await expect(page.getByText(/Артикул GR-220-55/)).toBeVisible()
  await page.getByRole('button', { name: 'Коммерческое предложение' }).click()
  await expect(page.getByRole('dialog', { name: 'Коммерческое предложение' })).toContainText('GR-220-55')
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

for (const [device, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]] as const) {
  test(`${device} copies the selected sku and opens sharing options before copying the product URL`, async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:43991' })
    await page.setViewportSize({ width, height })
    await page.goto('/product/remeza-vk-10-gr-0001/')

    await page.getByRole('button', { name: '220 В' }).click()
    const skuControl = page.getByRole('button', { name: 'Скопировать артикул GR-220-55' })
    await expect(skuControl).toHaveAttribute('title', 'Скопировать артикул')
    await skuControl.click()
    await expect(page.getByRole('status').filter({ hasText: 'Артикул скопирован' })).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('GR-220-55')

    const share = page.getByRole('button', { name: 'Поделиться' })
    await expect(share).toHaveAttribute('title', 'Поделиться')
    await share.click()
    await expect(page.getByRole('status').filter({ hasText: 'Ссылка на товар скопирована' })).toHaveCount(0)
    const menu = page.getByRole('menu', { name: 'Способы поделиться' })
    await expect(menu.getByRole('menuitem', { name: 'Отправить в Telegram' })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: 'Отправить в WhatsApp' })).toBeVisible()
    if (width === 390) {
      const copyItem = await menu.getByRole('menuitem', { name: 'Скопировать ссылку' }).boundingBox()
      expect(copyItem?.width).toBeGreaterThanOrEqual(180)
    }
    await menu.getByRole('menuitem', { name: 'Скопировать ссылку' }).click()
    await expect(page.getByRole('status').filter({ hasText: 'Ссылка на товар скопирована' })).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('/product/remeza-vk-10-gr-0001/')
  })
}

for (const width of [1440, 1024, 768, 390, 360]) {
  test(`product detail has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/product/remeza-vk-10-gr-0001/')
    expect(await page.locator('body').evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
  })
}
