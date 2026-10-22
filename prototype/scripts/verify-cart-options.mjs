import assert from 'node:assert/strict'

export async function verifyCartOptions(browser, { base, width }) {
  const sender = await browser.newContext({ viewport: { width, height: 1000 } })
  try {
    const page = await sender.newPage()
    await page.goto(`${base}/product/remeza-vk-10-gr-0001/`, { waitUntil: 'domcontentloaded' })
    const option = page.locator('#options article').filter({ hasText: 'OPT-01' })
    await option.getByLabel('Выбрать опцию Модуль осушения воздуха').check()
    await option.getByLabel('Количество Модуль осушения воздуха').fill('2')
    await page.getByRole('button', { name: 'Добавить товар с выбранными опциями', exact: true }).click()
    await page.getByRole('button', { name: '220 В', exact: true }).click()
    await option.getByLabel('Количество Модуль осушения воздуха').fill('3')
    await page.getByRole('button', { name: 'Добавить товар с выбранными опциями', exact: true }).click()
    await page.goto(`${base}/cart/`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Поделиться корзиной', exact: true }).click()
    const link = await page.getByLabel('Ссылка на корзину', { exact: true }).inputValue()
    const payload = JSON.parse(atob(new URL(link).searchParams.get('shared')))
    const shared = payload.find(line => line.id === 'option-dryer')
    assert.equal(shared.quantity, 5)
    assert.deepEqual(shared.optionParents, { 'remeza-vk-10-gr-0001': 2, 'remeza-vk-10-220-55': 3 })
    assert.deepEqual(Object.keys(shared).sort(), ['id', 'optionParents', 'quantity'])
    for (const nonempty of [false, true]) {
      const receiver = await browser.newContext({ viewport: { width, height: 1000 } })
      try {
        const p = await receiver.newPage()
        if (nonempty) {
          await p.goto(`${base}/product/remeza-vk-10-gr-0001/`, { waitUntil: 'domcontentloaded' })
          await p.getByRole('button', { name: 'В корзину отдельно', exact: true }).first().click()
          await p.locator('#companion-products').getByRole('button', { name: /Компрессорное масло/ }).click()
        }
        await p.goto(link, { waitUntil: 'domcontentloaded' })
        await p.getByRole('button', { name: 'Добавить в мою корзину', exact: true }).click()
        await p.getByTestId('cart-line').first().waitFor()
        const line = p.getByTestId('cart-line').filter({ hasText: 'OPT-01' })
        assert.equal(await line.getByLabel('Количество', { exact: true }).innerText(), nonempty ? '6' : '5')
        assert.equal(await line.locator('.cart-option-link p').count(), 2)
        const saved = await p.evaluate(() => JSON.parse(localStorage.getItem('garage-cart-v2')))
        assert.deepEqual(saved.find(item => item.id === 'option-dryer').optionParents, { 'remeza-vk-10-gr-0001': nonempty ? 3 : 2, 'remeza-vk-10-220-55': 3 })
        await p.reload({ waitUntil: 'domcontentloaded' })
        await p.getByTestId('cart-line').first().waitFor()
        assert.equal(await line.locator('.cart-option-link p').count(), 2)
        assert.equal(await line.locator('.cart-line__availability').innerText(), 'Доступно для заказа')
        assert.equal(Number((await p.getByTestId('order-total').innerText()).replace(/\D/g, '')), nonempty ? 609900 : 564000)
        assert.equal(await p.getByTestId('promo-discount').count(), 0)
        assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      } finally { await receiver.close() }
    }
    return { width, optionAllocations: true, mergeAndReload: true, cleanShare: true }
  } finally { await sender.close() }
}
