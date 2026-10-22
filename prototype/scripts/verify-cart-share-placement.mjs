import assert from 'node:assert/strict'

export async function verifyCartSharePlacement(browser, {base, width, expectedAsset, screenshotRoot}) {
  const context = await browser.newContext({viewport: {width, height: 1000}})
  try {
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(`${base}/cart/`, {waitUntil: 'domcontentloaded'})
    await page.evaluate(() => {
      localStorage.setItem('garage-cart-v2', JSON.stringify([{id: 'product-1', quantity: 1}, {id: 'product-2', quantity: 2}]))
      localStorage.removeItem('garage-checkout-v2')
    })
    await page.reload({waitUntil: 'domcontentloaded'})
    const toolbar = page.getByRole('toolbar', {name: 'Действия с товарами'})
    await toolbar.waitFor()
    assert((await page.locator('script[type=module]').getAttribute('src')).includes(expectedAsset))
    const share = toolbar.getByRole('button', {name: 'Поделиться корзиной', exact: true})
    assert.equal(await page.getByRole('button', {name: 'Поделиться корзиной', exact: true}).count(), 1)
    const summary = page.getByRole('complementary', {name: 'Итоги заказа'})
    assert.equal(await summary.getByRole('button', {name: 'Поделиться корзиной', exact: true}).count(), 0)
    assert.equal(await summary.getByRole('button', {name: 'Коммерческое предложение'}).count(), 1)
    assert.equal(await summary.getByRole('button', {name: 'Купить в кредит'}).count(), 1)
    const tb = await toolbar.boundingBox(), sb = await share.boundingBox(), cb = await toolbar.locator('label').boundingBox()
    assert(sb.x >= tb.x && sb.x + sb.width <= tb.x + tb.width + 1)
    assert(sb.y >= tb.y && sb.y + sb.height <= tb.y + tb.height + 1)
    assert(sb.y >= cb.y + cb.height || sb.x >= cb.x + cb.width, 'Share overlaps checkbox label')
    assert(await share.evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'Share label is clipped')
    assert((await page.getByTestId('cart-line').first().boundingBox()).y >= tb.y + tb.height - 1)
    if (screenshotRoot) {
      await toolbar.evaluate(el => el.scrollIntoView({block: 'center', behavior: 'instant'}))
      await page.screenshot({path: `${screenshotRoot}/toolbar-${width}.png`})
    }
    await page.getByTestId('cart-line').nth(1).getByRole('checkbox').uncheck()
    await share.click()
    const dialog = page.getByRole('dialog', {name: 'Поделиться корзиной'})
    const url = await dialog.getByLabel('Ссылка на корзину').inputValue()
    assert.deepEqual(JSON.parse(atob(new URL(url).searchParams.get('shared'))), [{id: 'product-1', quantity: 1}])
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText: async text => {window.__shareCopied = text}}}))
    await dialog.getByRole('button', {name: 'Копировать ссылку'}).click()
    assert.equal(await page.evaluate(() => window.__shareCopied), url)
    const popupPromise = page.waitForEvent('popup')
    await dialog.getByRole('link', {name: 'Открыть общую корзину ↗'}).click()
    const popup = await popupPromise
    try {await popup.getByRole('heading', {name: 'Вам поделились корзиной'}).waitFor()} finally {await popup.close()}
    await page.keyboard.press('Escape')
    assert(await share.evaluate(el => document.activeElement === el))
    await page.getByTestId('cart-line').nth(0).getByRole('checkbox').uncheck()
    await share.click()
    assert((await toolbar.getByRole('status').innerText()).includes('Выберите хотя бы один товар'))
    assert.equal(await page.getByRole('dialog', {name: 'Поделиться корзиной'}).count(), 0)
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    assert.deepEqual(errors, [])
    return {width, toolbarShareOnly: true, responsiveNoOverlap: true, summaryToolsPreserved: true, selectedOnly: true, copy: true, openSharedPopup: true, emptySelection: true, focusRestored: true, errors}
  } finally {await context.close()}
}
