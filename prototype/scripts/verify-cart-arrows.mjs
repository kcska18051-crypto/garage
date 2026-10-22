import assert from 'node:assert/strict'

export async function verifyCartArrows(browser, {base, width, expectedAsset, screenshotRoot}) {
  const context = await browser.newContext({viewport: {width, height: 1000}})
  try {
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(`${base}/cart/`, {waitUntil: 'domcontentloaded'})
    await page.getByTestId('cart-line').first().waitFor()
    if (expectedAsset) assert((await page.locator('script[type=module]').getAttribute('src')).includes(expectedAsset))
    const controls = page.locator('.cart-rail-controls').first()
    const next = controls.getByRole('button', {name: 'Следующие сопутствующие товары'})
    await next.waitFor()
    const size = await next.evaluate(el => {const s = getComputedStyle(el), r = el.getBoundingClientRect(); return {width: r.width, height: r.height, font: parseFloat(s.fontSize), radius: parseFloat(s.borderRadius)}})
    assert.equal(size.width, 33)
    assert.equal(size.height, 33)
    assert.equal(size.font, 12)
    assert(Math.abs(size.radius - 7.2) < .01)
    const rail = page.locator('.line-accessories__rail').first()
    const add = rail.getByRole('button').first()
    const addSize = await add.boundingBox()
    assert.equal(addSize.width, 44)
    assert.equal(addSize.height, 44)
    await next.click()
    await page.waitForFunction(() => document.querySelector('.line-accessories__rail').scrollLeft > 20)
    await controls.getByRole('button', {name: 'Предыдущие сопутствующие товары'}).click()
    await page.waitForFunction(() => document.querySelector('.line-accessories__rail').scrollLeft < 2)
    await rail.focus(); await page.keyboard.press('ArrowRight')
    await page.waitForFunction(() => document.querySelector('.line-accessories__rail').scrollLeft > 20)
    if (screenshotRoot) {
      await controls.evaluate(el => el.scrollIntoView({block: 'center', behavior: 'instant'}))
      await page.screenshot({path: `${screenshotRoot}/arrows-${width}.png`})
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    assert.deepEqual(errors, [])
    return {width, arrows: '33×33', glyph: 12, addButtons: '44×44 unchanged', previousNextKeyboard: true, errors}
  } finally {await context.close()}
}
