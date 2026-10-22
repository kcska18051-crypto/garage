import assert from 'node:assert/strict'

export async function verifyCheckoutSeparation(browser, {base, width, expectedAsset, screenshotRoot}) {
  const context = await browser.newContext({viewport: {width, height: 1000}})
  try {
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    const goto = async route => {
      const response = await page.goto(`${base}${route}`, {waitUntil: 'domcontentloaded'})
      assert.equal(response.status(), 200)
      await page.locator('main h1').waitFor()
      assert((await page.locator('script[type=module]').getAttribute('src')).includes(expectedAsset))
    }
    const shot = async state => {if (screenshotRoot) {await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({path: `${screenshotRoot}/${state}-${width}.png`})}}
    await goto('/cart/')
    assert.equal(await page.locator('.cart-recipient input').count(), 0)
    assert((await page.locator('.cart-recipient h2').innerText()).includes('Войдите'))
    await goto('/checkout/review/')
    const notice = page.getByRole('region', {name: 'Вход и регистрация'})
    const recipient = page.getByRole('region', {name: 'Данные получателя'})
    assert.equal(await notice.locator('input').count(), 0)
    assert.equal(await recipient.getByRole('button', {name: 'Войти или зарегистрироваться'}).count(), 0)
    assert(await notice.evaluate(el => !el.closest('.checkout-layout')))
    const nb = await notice.boundingBox(), rb = await recipient.boundingBox()
    assert(rb.y - (nb.y + nb.height) >= 15, 'Login notice visually overlaps recipient card')
    const layout = await page.locator('.checkout-layout').boundingBox()
    assert(Math.abs(layout.x - nb.x) < 1 && Math.abs(layout.width - nb.width) < 1, 'Notice must align with full content container')
    await shot('guest-separated')
    const total = await page.getByTestId('order-total').innerText()
    await recipient.getByLabel('Заберёт другой человек').check()
    await recipient.getByLabel('Имя получателя', {exact: true}).fill('Анна')
    await recipient.getByLabel('Фамилия получателя', {exact: true}).fill('Демонстрационная')
    await recipient.getByLabel('Телефон получателя', {exact: true}).fill('+79991112233')
    await shot('other-recipient')
    await notice.getByRole('button', {name: 'Войти или зарегистрироваться'}).click()
    const auth = page.getByRole('dialog', {name: 'Вход и регистрация'})
    await auth.getByLabel('Номер телефона').fill('+79991234567')
    await auth.getByRole('button', {name: 'Получить код'}).click()
    await auth.getByLabel('Код подтверждения').fill('1234')
    await auth.getByRole('button', {name: 'Войти', exact: true}).click()
    await auth.waitFor({state: 'hidden'})
    assert.equal(await notice.count(), 0)
    assert.equal(await page.getByLabel('Подтверждённый телефон').inputValue(), '+79991234567')
    assert.equal(await recipient.getByLabel('Имя получателя', {exact: true}).inputValue(), 'Анна')
    assert.equal(await page.getByTestId('order-total').innerText(), total)
    await page.reload({waitUntil: 'domcontentloaded'})
    assert.equal(await page.getByLabel('Подтверждённый телефон').inputValue(), '+79991234567')
    assert.equal(await recipient.getByLabel('Имя получателя', {exact: true}).inputValue(), 'Анна')
    assert(await recipient.getByLabel('Заберёт другой человек').isChecked())
    await shot('signed-in')
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    assert.deepEqual(errors, [])
    return {width, separateFullWidthNotice: true, independentRecipient: true, loginPreservesFields: true, currentPhone: true, reload: true, totalUnchanged: true, errors}
  } finally {await context.close()}
}
