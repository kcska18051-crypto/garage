import { expect, test } from '@playwright/test'

test('shared option retains two variant allocations, standalone units and availability after merge and reload', async ({ page, browser }) => {
  await page.goto('/product/remeza-vk-10-gr-0001')
  const option = page.locator('#options article').filter({ hasText: 'OPT-01' })
  await expect(option).toContainText('Доступно для заказа')
  await option.getByLabel('Выбрать опцию Модуль осушения воздуха').check()
  await option.getByLabel('Количество Модуль осушения воздуха').fill('2')
  await page.getByRole('button', { name: 'Добавить товар с выбранными опциями' }).click()
  await page.getByRole('button', { name: '220 В', exact: true }).click()
  await option.getByLabel('Количество Модуль осушения воздуха').fill('3')
  await page.getByRole('button', { name: 'Добавить товар с выбранными опциями' }).click()
  await page.goto('/cart')
  const senderOption = page.getByTestId('cart-line').filter({ hasText: 'OPT-01' })
  await expect(senderOption.locator('.cart-line__availability')).toHaveText('Доступно для заказа')
  await expect(senderOption.locator('.cart-option-link p')).toHaveCount(2)
  await expect(senderOption.locator('.cart-option-link')).toContainText('380 В · 7,5 кВт (GR-0001)')
  await expect(senderOption.locator('.cart-option-link')).toContainText('220 В · 5,5 кВт (GR-220-55)')
  await page.getByRole('button', { name: 'Поделиться корзиной', exact: true }).click()
  const share = await page.getByLabel('Ссылка на корзину').inputValue()
  const payload = JSON.parse(Buffer.from(new URL(share).searchParams.get('shared')!, 'base64').toString())
  expect(payload.find((line: { id: string }) => line.id === 'option-dryer')).toMatchObject({ quantity: 5, optionParents: { 'remeza-vk-10-gr-0001': 2, 'remeza-vk-10-220-55': 3 } })
  expect(Object.keys(payload.find((line: { id: string }) => line.id === 'option-dryer')).sort()).toEqual(['id','optionParents','quantity'])

  for (const nonempty of [false,true]) {
    const context = await browser.newContext()
    const receiver = await context.newPage()
    try {
      if(nonempty) {
        await receiver.goto('/product/remeza-vk-10-gr-0001'.replace(/^\//, new URL(share).origin + '/'))
        await receiver.getByRole('button', { name: 'В корзину отдельно' }).first().click()
        await receiver.locator('#companion-products').getByRole('button', { name: /Компрессорное масло/ }).click()
      }
      await receiver.goto(share)
      await expect(receiver.getByRole('heading', { name: 'Вам поделились корзиной' })).toBeVisible()
      await receiver.getByRole('button', { name: 'Добавить в мою корзину' }).click()
      const imported = receiver.getByTestId('cart-line').filter({ hasText: 'OPT-01' })
      await expect(imported.getByLabel('Количество', { exact: true })).toHaveText(nonempty ? '6' : '5')
      await expect(imported.locator('.cart-option-link p')).toHaveCount(2)
      await expect(imported.locator('.cart-option-link')).toContainText('220 В · 5,5 кВт (GR-220-55)')
      const stored = await receiver.evaluate(() => JSON.parse(localStorage.getItem('garage-cart-v2')!))
      expect(stored.find((line: { id: string }) => line.id === 'option-dryer').optionParents).toEqual({ 'remeza-vk-10-gr-0001': nonempty ? 3 : 2, 'remeza-vk-10-220-55': 3 })
      await receiver.reload()
      await expect(imported.locator('.cart-option-link p')).toHaveCount(2)
      await expect(imported.locator('.cart-option-link')).toContainText('380 В · 7,5 кВт (GR-0001)')
      await expect(imported.locator('.cart-option-link')).toContainText('220 В · 5,5 кВт (GR-220-55)')
      await expect(imported.locator('.cart-line__availability')).toHaveText('Доступно для заказа')
      if(nonempty) await expect(receiver.getByTestId('cart-line').filter({ hasText: 'SUP-01' }).locator('.cart-line__availability')).toHaveText('Доступно для заказа')
      await expect(receiver.getByRole('complementary', { name: 'Итоги заказа' })).toContainText(nonempty ? '609 900 ₽' : '564 000 ₽')
    } finally { await context.close() }
  }
})
