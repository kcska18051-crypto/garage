import assert from 'node:assert/strict'

const points = [
  { id: 'store', city: 'Ярославль', name: 'Демо-магазин', phone: '+70000000001', email: 'store@example.com', coordinates: '57.626, 39.893' },
  { id: 'pickup', city: 'Вологда', name: 'Демо-пункт выдачи', phone: '+70000000002', email: 'pickup@example.com', coordinates: '59.22, 39.89' },
  { id: 'service', city: 'Череповец', name: 'Демо-сервисная точка', phone: '+70000000003', email: 'service@example.com', coordinates: '59.128, 37.909' },
]

export async function verifyContactPages(browser, { base, width, screenshotRoot }) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width < 600 })
  try {
    await context.addInitScript(() => {
      sessionStorage.setItem('garage-auth-demo-session-v1', 'active')
      if (!localStorage.getItem('garage-cart-v2')) localStorage.setItem('garage-cart-v2', JSON.stringify([{ id: 'product-1', quantity: 2 }]))
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route('https://tile.openstreetmap.org/**', route => route.abort())
    const goto = route => page.goto(`${base.replace(/\/$/, '')}${route}`, { waitUntil: 'domcontentloaded' })
    const heading = text => page.waitForFunction(text => document.querySelector('main h1')?.textContent === text, text)
    const selectedCity = city => page.waitForFunction(city => [...document.querySelectorAll('[role=tab]')].some(el => el.textContent === city && el.getAttribute('aria-selected') === 'true'), city)
    const savedState = () => page.evaluate(() => ({ checkout: JSON.parse(localStorage.getItem('garage-checkout-v2')), cart: JSON.parse(localStorage.getItem('garage-cart-v2')) }))
    const layout = async () => {
      await page.evaluate(() => document.fonts.ready)
      const metrics = await page.evaluate(() => {
        const main = document.querySelector('main').getBoundingClientRect()
        return { overflow: document.documentElement.scrollWidth - innerWidth, left: main.left, width: main.width, viewport: innerWidth }
      })
      assert(metrics.overflow <= 1, `Overflow: ${JSON.stringify(metrics)}`)
      assert(metrics.left >= 0 && metrics.width <= metrics.viewport + 1)
    }
    await goto('/checkout/review')
    await page.getByLabel('Город самовывоза').selectOption('Вологда')
    await page.getByRole('radio', { name: /Демо-пункт выдачи/ }).check()
    await page.getByLabel('Комментарий к заказу').fill('Сохранённый заказ')
    const saved = await savedState()
    let navigations = 0
    for (const point of points) {
      const contacts = `/contacts?city=${encodeURIComponent(point.city)}`
      for (const method of ['card', 'name', 'details']) {
        await goto(contacts)
        await selectedCity(point.city)
        assert.equal(await page.locator('.contact-point input[type=radio]').count(), 0)
        assert.equal(await page.locator('.contact-point a a').count(), 0)
        const card = page.getByTestId('contact-point')
        assert.equal(await card.locator('a[href^="tel:"]').getAttribute('href'), `tel:${point.phone}`)
        assert.equal(await card.locator('a[href^="mailto:"]').getAttribute('href'), `mailto:${point.email}`)
        // Cancel native protocol dispatch, then prove it does not trigger card navigation.
        await card.locator('a[href^="tel:"], a[href^="mailto:"]').evaluateAll(links => links.forEach(link => link.addEventListener('click', e => e.preventDefault(), { once: true })))
        const beforeProtocol = page.url()
        await card.locator('a[href^="tel:"]').click()
        await card.locator('a[href^="mailto:"]').click()
        assert.equal(page.url(), beforeProtocol)
        await page.getByRole('button', { name: `На карте: ${point.name}` }).click()
        assert(new URL(page.url()).pathname.endsWith('/contacts'))
        if (method === 'card') {
          const strip = card.locator('.contact-point__links')
          await strip.scrollIntoViewIfNeeded()
          const bounds = await strip.boundingBox()
          const x = bounds.x + bounds.width - 8, y = bounds.y + 10
          assert.equal(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.className, { x, y }), 'contact-point__page-link')
          if (width < 600) await page.touchscreen.tap(x, y)
          else await page.mouse.click(x, y)
        } else if (method === 'name') await card.locator('strong').click()
        else await card.getByRole('link', { name: `Фото и как добраться: ${point.name}` }).click()
        await heading(`${point.name} — ${point.city}`)
        assert(new URL(page.url()).pathname.endsWith(`/contacts/${point.id}`))
        assert.equal(await page.getByRole('dialog').count(), 0)
        assert.equal(await page.locator('.store-gallery figure').count(), 3)
        assert.equal(await page.locator('.store-gallery figure[hidden]').count(), 0)
        assert((await page.locator('main').innerText()).includes(point.coordinates))
        assert.equal(await page.locator('main a[href^="tel:"]').getAttribute('href'), `tel:${point.phone}`)
        assert.equal(await page.locator('main a[href^="mailto:"]').getAttribute('href'), `mailto:${point.email}`)
        assert.equal(await page.getByRole('link', { name: /Построить маршрут/ }).getAttribute('target'), '_blank')
        const routeStyle = await page.getByRole('link', { name: /Построить маршрут/ }).evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor }))
        assert(routeStyle.color !== routeStyle.background, `Invisible route label: ${JSON.stringify(routeStyle)}`)
        assert.equal(await page.getByRole('link', { name: /Построить маршрут/ }).getAttribute('href'), `https://www.openstreetmap.org/directions?to=${point.coordinates.replace(', ', ',')}`)
        await page.locator('.store-gallery figure').last().scrollIntoViewIfNeeded()
        assert(await page.locator('.store-gallery figure').last().isVisible())
        await layout()
        if (method === 'name') {
          await page.reload({ waitUntil: 'domcontentloaded' })
          await heading(`${point.name} — ${point.city}`)
          assert((await page.getByRole('button', { name: 'Выбрать город', exact: true }).allTextContents()).some(text => text.includes(point.city)))
          if (screenshotRoot) await page.screenshot({ path: `${screenshotRoot}/${point.id}-${width}.png`, fullPage: true })
        }
        if (method === 'card') await page.goBack({ waitUntil: 'domcontentloaded' })
        else if (method === 'name') await page.getByRole('navigation', { name: 'Хлебные крошки' }).getByRole('link', { name: 'Контакты', exact: true }).click()
        else await page.getByRole('link', { name: 'Вернуться к контактам' }).click()
        await selectedCity(point.city)
        assert.deepEqual(await savedState(), saved)
        await layout()
        navigations++
      }
      await goto(`/contacts/${point.id}/`)
      await heading(`${point.name} — ${point.city}`)
      await page.getByRole('link', { name: 'Вернуться к контактам' }).click()
      await selectedCity(point.city)
    }
    if (screenshotRoot) await page.screenshot({ path: `${screenshotRoot}/contacts-${width}.png`, fullPage: true })
    await goto('/checkout/review')
    assert.equal(await page.getByLabel('Комментарий к заказу').inputValue(), 'Сохранённый заказ')
    assert.equal(await page.getByLabel('Город самовывоза').inputValue(), 'Вологда')
    assert(await page.getByRole('radio', { name: /Демо-пункт выдачи/ }).isChecked())
    for (const point of points) {
      await page.getByLabel('Город самовывоза').selectOption(point.city)
      const radio = page.getByRole('radio', { name: new RegExp(point.name) })
      await radio.check()
      const before = await savedState(), beforeURL = page.url()
      const trigger = page.getByRole('button', { name: `Фото и как добраться: ${point.name}` })
      await trigger.click()
      const dialog = page.getByRole('dialog', { name: `${point.name} — ${point.city}` })
      await dialog.waitFor({ state: 'visible' })
      assert.equal(page.url(), beforeURL)
      assert(await radio.isChecked())
      await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'hidden' })
      assert(await trigger.evaluate(el => el === document.activeElement))
      assert.deepEqual(await savedState(), before)
      await layout()
    }
    if (screenshotRoot) await page.screenshot({ path: `${screenshotRoot}/checkout-${width}.png`, fullPage: true })
    await goto('/contacts/unknown-point/')
    await heading('Страница не найдена')
    assert.deepEqual(errors, [])
    return { width, navigations, direct: 3, reload: 3, checkoutDialogs: 3, errors }
  } finally { await context.close() }
}
