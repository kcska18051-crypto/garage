import assert from 'node:assert/strict'

export async function verifyPaintServices(browser, { base, width, screenshotRoot, expectedAsset }) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 768 })
  try {
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const parent = '/services/paint-matching'
    const examples = [
      ['automotive', 'Подбор/колеровка автомобильных эмалей'],
      ['polyurethane', 'Подбор полиуретановых эмалей'],
    ]
    const goto = async route => {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' })
      await page.locator('main h1').waitFor()
      if (expectedAsset) {
        assert.equal(response.status(), route.endsWith('/unknown/') && new URL(base).hostname.endsWith('github.io') ? 404 : 200)
        assert((await page.locator('script[type=module]').getAttribute('src')).includes(expectedAsset))
      }
    }
    const layout = async () => {
      await page.evaluate(() => document.fonts.ready)
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Document overflow')
      const header = page.locator('.site-header')
      assert(await header.locator('.paint-service-link:visible').count() >= 1, 'No visible header paint CTA')
      for (const control of await header.locator('.main-header-row > a:visible,.main-header-row > button:visible,.header-actions > a:visible,.header-actions > button:visible').all()) {
        const box = await control.boundingBox()
        assert(box.x >= 0 && box.x + box.width <= width + 1, `Clipped header control: ${await control.innerText()}`)
      }
      if (width < 768) assert.equal(await page.locator('.mobile-bottom-nav a,.mobile-bottom-nav button').count(), 5)
    }
    const shot = async state => { if (screenshotRoot) await page.screenshot({ path: `${screenshotRoot}/${state}-${width}.png`, fullPage: true }) }
    const heading = title => page.waitForFunction(title => document.querySelector('main h1')?.textContent === title, title)
    const confirm = async phone => {
      const auth = page.getByRole('dialog', { name: 'Вход и регистрация' })
      assert.equal(await auth.getByRole('button', { name: 'По паролю' }).count(), 0)
      await auth.getByLabel('Номер телефона').fill(phone)
      await auth.getByRole('button', { name: 'Получить код' }).click()
      await auth.getByLabel('Код подтверждения').fill('1234')
      await auth.getByRole('button', { name: 'Войти', exact: true }).click()
      await auth.waitFor({ state: 'hidden' })
    }
    await goto('/services/')
    assert.equal(await page.locator('.services-grid article').count(), 3)
    await page.locator('.site-header .paint-service-link:visible').first().click()
    await heading('Подбор автоэмали')
    assert.equal(await page.locator('main h1').innerText(), 'Подбор автоэмали')
    assert.equal(await page.locator('.services-grid article').count(), 2)
    assert.equal(await page.getByRole('button', { name: 'Оставить заявку', exact: true }).count(), 0)
    await layout(); await shot('parent')
    if (width >= 768) {
      await page.evaluate(() => window.scrollTo(0, 300))
      await page.locator('.desktop-header--compact .paint-service-link').waitFor({ state: 'visible' })
      await layout(); await shot('compact')
      await page.locator('.desktop-header--compact .paint-service-link').focus()
      await page.keyboard.press('Enter')
      await page.evaluate(() => window.scrollTo(0, 0))
    }
    const cartBefore = await page.evaluate(() => localStorage.getItem('garage-cart-v2'))
    const createdIds = []
    for (const [index, [slug, title]] of examples.entries()) {
      await goto(`${parent}/`)
      await page.getByRole('main').getByRole('link', { name: title, exact: true }).click()
      await heading(title)
      assert(new URL(page.url()).pathname.replace(/\/$/, '').endsWith(`${parent}/${slug}`))
      assert.equal(await page.locator('main h1').innerText(), title)
      assert((await page.getByRole('navigation', { name: 'Хлебные крошки' }).innerText()).includes('Подбор автоэмали'))
      await page.reload({ waitUntil: 'domcontentloaded' })
      await heading(title)
      assert.equal(await page.locator('main h1').innerText(), title)
      await layout(); await shot(slug)
      const trigger = page.getByRole('button', { name: 'Оставить заявку', exact: true })
      await trigger.click()
      let dialog = page.getByRole('dialog', { name: 'Заявка на подбор автоэмали' })
      assert((await dialog.innerText()).includes(title))
      await page.keyboard.press('Shift+Tab')
      assert(await dialog.evaluate(el => el.contains(document.activeElement)))
      await page.keyboard.press('Escape')
      assert(await trigger.evaluate(el => el === document.activeElement))
      await trigger.click()
      dialog = page.getByRole('dialog', { name: 'Заявка на подбор автоэмали' })
      await dialog.getByRole('button', { name: 'Отправить заявку' }).click()
      assert.equal(await dialog.getByLabel('Ваше имя').getAttribute('aria-invalid'), 'true')
      await dialog.getByLabel('Ваше имя').fill('Демонстрационный клиент')
      await dialog.getByLabel('Телефон', { exact: true }).fill('+7 999 111-22-33')
      await dialog.getByLabel('Автомобиль', { exact: true }).fill(`Демоавтомобиль ${slug}`)
      await dialog.getByLabel('Комментарий', { exact: true }).fill(`Рыбная заявка ${slug}`)
      await dialog.locator('form').evaluate(el => { el.requestSubmit(); el.requestSubmit() })
      await page.locator('.service-request-number').waitFor()
      const number = (await page.locator('.service-request-number').innerText()).replace('Номер: ', '')
      const records = await page.evaluate(() => JSON.parse(localStorage.getItem('garage-service-requests-v1')).filter(item => !item.seed))
      assert.equal(records.length, index + 1)
      const created = records.find(item => item.number === number)
      assert.equal(created.title, title); assert.equal(created.itemId, `paint-${slug}`); assert.equal(created.kind, 'paint')
      createdIds.push(created.id)
      await page.getByRole('button', { name: 'Посмотреть заявку в личном кабинете' }).click()
      if (!index) {
        await confirm('+7 900 111-22-33')
        await heading('Заявка недоступна')
        assert.equal(await page.locator('main h1').innerText(), 'Заявка недоступна')
        assert(!(await page.locator('main').innerText()).includes(`Демоавтомобиль ${slug}`))
        await page.getByRole('button', { name: 'Подтвердить телефон заявки' }).click()
        await confirm('+7 999 111-22-33')
      }
      await page.getByRole('heading', { name: `Заявка № ${number}`, exact: true }).waitFor()
      assert.equal(new URL(page.url()).searchParams.get('id'), created.id)
      assert((await page.locator('main').innerText()).includes(title))
      await page.reload({ waitUntil: 'domcontentloaded' })
      await heading(`Заявка № ${number}`)
      assert((await page.locator('main').innerText()).includes(`Демоавтомобиль ${slug}`))
      await shot(`request-${slug}`)
      await page.getByRole('link', { name: 'Все заявки на услуги', exact: true }).click()
      await heading('Заявки на услуги')
      assert.equal(await page.locator('.profile-request').filter({ hasText: number }).count(), 1)
      assert.equal(await page.evaluate(() => localStorage.getItem('garage-cart-v2')), cartBefore)
    }
    assert.equal(new Set(createdIds).size, 2)
    await goto(`${parent}/polyurethane/`)
    await page.getByRole('link', { name: '← Вернуться к направлению' }).click()
    await heading('Подбор автоэмали')
    assert.equal(await page.locator('main h1').innerText(), 'Подбор автоэмали')
    await page.goBack()
    await heading(examples[1][1])
    assert.equal(await page.locator('main h1').innerText(), examples[1][1])
    await goto(`${parent}/unknown/`)
    assert.equal(await page.locator('main h1').innerText(), 'Страница не найдена')
    await layout()
    await goto(`/profile/services/request/?id=${createdIds[0]}`)
    await page.getByRole('button', { name: 'Выйти', exact: true }).click()
    assert(!(await page.locator('main').innerText()).includes('Демоавтомобиль automotive'))
    await page.reload({ waitUntil: 'domcontentloaded' })
    assert(!(await page.locator('main').innerText()).includes('Демоавтомобиль automotive'))
    assert.deepEqual(errors, [])
    return { width, parent: true, details: 2, requests: 2, ownership: true, reload: true, header: true, errors }
  } finally { await context.close() }
}
