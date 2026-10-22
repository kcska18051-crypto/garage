import assert from 'node:assert/strict'

export async function verifyCartPercent(browser, {base, width, expectedAsset, screenshotRoot}) {
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
    await page.getByTestId('cart-line').first().waitFor()
    assert((await page.locator('script[type=module]').getAttribute('src')).includes(expectedAsset))
    const first = page.getByTestId('cart-line').nth(0), second = page.getByTestId('cart-line').nth(1)
    const badge = first.getByTestId('line-discount-percent')
    const shot = async state => {if (screenshotRoot) {
      if (width > 650) await page.evaluate(() => scrollTo(0, 0))
      else await first.locator('.cart-line__price').evaluate(el => el.scrollIntoView({block: 'center', behavior: 'instant'}))
      await page.screenshot({path: `${screenshotRoot}/${state}-${width}.png`})
    }}
    const visiblePrice = async () => {
      await badge.waitFor({state: 'visible'})
      const price = await first.getByTestId('line-new-price').boundingBox(), b = await badge.boundingBox()
      assert(b.x >= 0 && b.x + b.width <= width + 1)
      assert(b.y >= price.y && b.y - (price.y + price.height) < 12, 'Percent must sit beside its price')
      assert.equal(await first.locator('.cart-line__price del').count(), 1)
      assert.equal(await first.locator('.cart-line__price strong').count(), 1)
    }
    assert.equal(await badge.innerText(), '−10,7%')
    assert.equal(await second.getByTestId('line-discount-percent').count(), 0)
    await visiblePrice(); await shot('before')
    await page.getByLabel('Промокод', {exact: true}).fill('123')
    await page.getByRole('button', {name: 'Применить промокод'}).click()
    assert.equal(await badge.innerText(), '−19,6%')
    assert.equal(await second.getByTestId('line-discount-percent').innerText(), '−10%')
    assert((await page.getByTestId('promo-discount').innerText()).includes('10%'))
    await visiblePrice(); await shot('applied')
    await first.getByRole('button', {name: 'Увеличить количество'}).click()
    assert.equal(await badge.innerText(), '−19,6%')
    await first.getByRole('button', {name: 'Уменьшить количество'}).click()
    await second.getByRole('checkbox').uncheck()
    assert.equal(await second.getByTestId('line-discount-percent').count(), 0)
    await second.getByRole('checkbox').check()
    await page.getByRole('button', {name: 'Удалить промокод'}).click()
    assert.equal(await badge.innerText(), '−10,7%')
    assert.equal(await second.getByTestId('line-discount-percent').count(), 0)
    await visiblePrice(); await shot('removed')
    await page.reload({waitUntil: 'domcontentloaded'})
    await badge.waitFor()
    assert.equal(await badge.innerText(), '−10,7%')
    assert.equal(await second.getByTestId('line-discount-percent').count(), 0)
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    assert.deepEqual(errors, [])
    return {width, visibleBadge: true, campaignAndPromo: true, quantityAndSelection: true, removalAndReload: true, twoPricesOnly: true, errors}
  } finally {await context.close()}
}
