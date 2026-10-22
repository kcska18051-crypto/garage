import assert from 'node:assert/strict'

export async function verifyServiceInquiries(browser, {base, width, expectedAsset, screenshotRoot}) {
  const context = await browser.newContext({viewport: {width, height: 1000}})
  try {
    const page = await context.newPage(), errors = []
    page.on('pageerror', error => errors.push(error.message))
    const goto = async path => {
      const response = await page.goto(`${base}${path}`, {waitUntil: 'domcontentloaded'})
      assert.equal(response.status(), 200)
      await page.locator('main h1').waitFor()
      if (expectedAsset) assert((await page.locator('script[type=module]').getAttribute('src')).includes(expectedAsset))
    }
    const noOverflow = async () => {
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Document overflow')
      for (const dialog of await page.locator('.service-request-dialog').all()) assert(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'Dialog overflow')
    }
    const shot = async name => {if (screenshotRoot) await page.screenshot({path: `${screenshotRoot}/${name}-${width}.png`, fullPage: !(await page.getByRole('dialog').count())})}
    const confirm = async phone => {
      const auth = page.getByRole('dialog', {name: 'Вход и регистрация'})
      await auth.getByLabel('Номер телефона').fill(phone)
      await auth.getByRole('button', {name: 'Получить код'}).click()
      await auth.getByLabel('Код подтверждения').fill('1234')
      await auth.getByRole('button', {name: 'Войти', exact: true}).click()
      await auth.waitFor({state: 'hidden'})
    }
    const latest = async () => page.evaluate(() => JSON.parse(localStorage.getItem('garage-service-requests-v1')).find(r => !r.seed))
    const paints = [
      ['', 'paint-matching', 'Подбор автоэмали'],
      ['/automotive', 'paint-automotive', 'Подбор/колеровка автомобильных эмалей'],
      ['/polyurethane', 'paint-polyurethane', 'Подбор полиуретановых эмалей'],
    ]
    const ids = []
    for (const [index, [suffix, itemId, title]] of paints.entries()) {
      await goto(`/services/paint-matching${suffix}/`)
      await noOverflow()
      if (!index) {assert.equal(await page.locator('.services-grid article').count(), 2); await shot('paint-parent')}
      await page.getByRole('main').getByRole('button', {name: 'Узнать стоимость', exact: true}).click()
      const form = page.getByRole('dialog', {name: 'Узнать стоимость'})
      assert.equal(await form.locator('input,textarea').count(), 5)
      assert((await form.innerText()).includes(title))
      for (const name of ['Имя', 'Телефон']) assert.equal(await form.getByLabel(name, {exact: true}).getAttribute('required'), '')
      for (const name of ['Марка авто', 'Код краски', 'Комментарий']) assert.equal(await form.getByLabel(name, {exact: true}).getAttribute('required'), null)
      await noOverflow(); await shot(`paint-form-${index}`)
      await form.getByRole('button', {name: 'Узнать стоимость', exact: true}).click()
      assert.equal(await form.getByLabel('Имя', {exact: true}).getAttribute('aria-invalid'), 'true')
      assert.equal(await form.getByLabel('Телефон', {exact: true}).getAttribute('aria-invalid'), 'true')
      const name = `Демо paint ${index} ${width}`
      await form.getByLabel('Имя', {exact: true}).fill(name)
      await form.getByLabel('Телефон', {exact: true}).fill('call79991234567')
      await form.getByRole('button', {name: 'Узнать стоимость'}).click()
      assert.equal(await form.getByLabel('Телефон', {exact: true}).getAttribute('aria-invalid'), 'true')
      await form.getByLabel('Телефон', {exact: true}).fill('8 (999) 123-45-67')
      if (index === 1) {
        await form.getByLabel('Марка авто').fill('Демо марка')
        await form.getByLabel('Код краски').fill('DEMO-CODE-123')
        await form.getByLabel('Комментарий').fill('Комментарий для подбора')
      }
      await noOverflow()
      await form.getByRole('button', {name: 'Узнать стоимость'}).click()
      await page.locator('.service-request-number').waitFor()
      const record = await latest()
      assert.equal(record.kind, 'paint'); assert.equal(record.itemId, itemId); assert.equal(record.title, title)
      assert.equal(record.fields.phone, '+79991234567')
      assert.equal(record.fields.paintCode, index === 1 ? 'DEMO-CODE-123' : '')
      assert.equal(record.fields.car, index === 1 ? 'Демо марка' : '')
      assert.equal(record.fields.comment, index === 1 ? 'Комментарий для подбора' : '')
      ids.push(record.id)
      await page.getByRole('button', {name: 'Посмотреть заявку в личном кабинете'}).click()
      if (!index) {
        await confirm('+79001112233')
        assert.equal(await page.locator('main h1').innerText(), 'Заявка недоступна')
        assert(!(await page.locator('main').innerText()).includes(name))
        await page.reload({waitUntil: 'domcontentloaded'})
        assert(!(await page.locator('main').innerText()).includes(name))
        await page.getByRole('button', {name: 'Подтвердить телефон заявки'}).click()
        await confirm('+79991234567')
      }
      await page.getByRole('heading', {name: `Заявка № ${record.number}`, exact: true}).waitFor()
      assert.equal(new URL(page.url()).searchParams.get('id'), record.id)
      await page.reload({waitUntil: 'domcontentloaded'})
      await page.getByText(name, {exact: true}).waitFor()
      if (index === 1) await page.getByText('DEMO-CODE-123', {exact: true}).waitFor()
      await noOverflow()
    }
    const repairs = [['compressor-repair', 'Ремонт компрессоров'], ['impact-wrench-repair', 'Ремонт гайковёрта'], ['angle-grinder-repair', 'Ремонт болгарки'], ['polisher-repair', 'Ремонт полировальной машинки'], ['pressure-washer-repair', 'Ремонт аппарата высокого давления']]
    for (const [itemId, title] of repairs) {
      await goto('/services/service-center/')
      assert.equal(await page.locator('.services-grid article').count(), 5)
      assert.equal(await page.locator('.services-grid a[href*="compressor-repair"]').count(), 2)
      if (itemId === 'compressor-repair') await shot('repair-center')
      await page.getByRole('button', {name: `Оставить заявку: ${title}`, exact: true}).click()
      const form = page.getByRole('dialog', {name: 'Заявка на ремонт'})
      assert((await form.innerText()).includes(title))
      assert.equal(await form.getByLabel('Код краски').count(), 0)
      assert.equal(await form.getByLabel('Марка авто').count(), 0)
      await form.getByRole('button', {name: 'Отправить заявку'}).click()
      for (const label of ['Ваше имя', 'Телефон', 'Модель оборудования', 'Описание неисправности']) assert.equal(await form.getByLabel(label, {exact: true}).getAttribute('aria-invalid'), 'true')
      await form.getByLabel('Ваше имя').fill('Демо ремонт')
      await form.getByLabel('Телефон', {exact: true}).fill('+79991234567')
      await form.getByLabel('Модель оборудования').fill(`Модель ${itemId}`)
      await form.getByLabel('Описание неисправности').fill('Не включается')
      await noOverflow()
      if (itemId === 'polisher-repair') await shot('repair-form')
      await form.getByRole('button', {name: 'Отправить заявку'}).click()
      await page.locator('.service-request-number').waitFor()
      const record = await latest()
      assert.equal(record.kind, 'repair'); assert.equal(record.itemId, itemId); assert.equal(record.title, title)
      assert.equal(record.fields.model, `Модель ${itemId}`)
      ids.push(record.id)
      await page.getByRole('button', {name: 'Посмотреть заявку в личном кабинете'}).click()
      await page.getByRole('heading', {name: `Заявка № ${record.number}`, exact: true}).waitFor()
      await page.reload({waitUntil: 'domcontentloaded'})
      await page.getByText(`Модель ${itemId}`, {exact: true}).waitFor()
      await noOverflow()
    }
    for (const slug of ['screw', 'piston', 'diesel']) {
      await goto(`/services/service-center/compressor-repair/${slug}/`)
      await page.getByRole('button', {name: 'Оставить заявку', exact: true}).click()
      assert.equal(await page.getByRole('dialog', {name: 'Заявка на ремонт'}).count(), 1)
      await page.keyboard.press('Escape')
    }
    assert.equal(new Set(ids).size, 8)
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('garage-service-requests-v1')))
    assert.equal(saved.filter(r => !r.seed).length, 8)
    assert.equal(saved.filter(r => r.seed).length, 4)
    await goto(`/profile/services/request/?id=${ids[1]}`)
    await page.getByRole('button', {name: 'Выйти', exact: true}).click()
    assert(!(await page.locator('main').innerText()).includes('DEMO-CODE-123'))
    await page.reload({waitUntil: 'domcontentloaded'})
    assert(!(await page.locator('main').innerText()).includes('DEMO-CODE-123'))
    assert.deepEqual(errors, [])
    return {width, paintDirections: 3, requiredOnlyNamePhone: true, normalizedPhone: true, codeAndOptionalFields: true, repairDirections: 5, compressorHierarchy: true, exactAccountAndReload: true, wrongPhonePrivate: true, oldHistoryPreserved: true, errors}
  } finally {await context.close()}
}
