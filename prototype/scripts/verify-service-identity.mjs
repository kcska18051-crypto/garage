import assert from 'node:assert/strict'

export async function verifyServiceIdentity(browser, {base, width, expectedAsset, screenshotRoot}) {
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
    const confirm = async phone => {
      const dialog = page.getByRole('dialog', {name: 'Вход и регистрация'})
      await dialog.getByLabel('Номер телефона').fill(phone)
      await dialog.getByRole('button', {name: 'Получить код'}).click()
      await dialog.getByLabel('Код подтверждения').fill('1234')
      await dialog.getByRole('button', {name: 'Войти', exact: true}).click()
      await dialog.waitFor({state: 'hidden'})
    }
    const shot = async state => {if (screenshotRoot) await page.screenshot({path: `${screenshotRoot}/${state}-${width}.png`, fullPage: true})}
    const checkPrivate = async text => {
      assert.equal(await page.getByRole('heading', {name: 'Заявка недоступна'}).count(), 1)
      assert(!(await page.locator('main').innerText()).includes(text))
    }
    await goto('/checkout/review/')
    await page.getByRole('button', {name: 'Войти или зарегистрироваться', exact: true}).click()
    await confirm('+79991234567')
    assert.equal(await page.getByLabel('Подтверждённый телефон').inputValue(), '+79991234567')
    await page.reload({waitUntil: 'domcontentloaded'})
    assert.equal(await page.getByLabel('Подтверждённый телефон').inputValue(), '+79991234567')
    await shot('checkout-current-phone')
    const submit = async (phone, comment) => {
      await goto('/services/paint-matching/automotive/')
      await page.getByRole('button', {name: 'Узнать стоимость', exact: true}).click()
      const form = page.getByRole('dialog', {name: 'Узнать стоимость'})
      await form.getByLabel('Имя').fill('Тест проверки')
      await form.getByLabel('Телефон', {exact: true}).fill(phone)
      await form.getByLabel('Марка авто', {exact: true}).fill('Демоавтомобиль')
      await form.getByLabel('Комментарий', {exact: true}).fill(comment)
      await form.getByRole('button', {name: 'Узнать стоимость'}).click()
      const records = await page.evaluate(() => JSON.parse(localStorage.getItem('garage-service-requests-v1')))
      const record = records.find(r => r.fields.comment === comment)
      assert(record)
      await form.getByRole('button', {name: 'Посмотреть заявку в личном кабинете'}).click()
      return {record, url: `/profile/services/request/?id=${record.id}`}
    }
    const foreignText = `Проверка automotive ${width}`
    const foreign = await submit('+79000000000', foreignText)
    assert.equal(foreign.record.ownerPhone, null)
    await page.getByRole('dialog', {name: 'Вход и регистрация'}).getByRole('button', {name: 'Закрыть', exact: true}).click()
    await checkPrivate(foreignText); await shot('foreign-request-hidden')
    await goto(foreign.url); await checkPrivate(foreignText)
    await page.reload({waitUntil: 'domcontentloaded'}); await checkPrivate(foreignText)
    // Reproduce a pre-fix locally stored misbound record: it must remain private.
    await page.evaluate(id => {
      const records = JSON.parse(localStorage.getItem('garage-service-requests-v1'))
      records.find(r => r.id === id).ownerPhone = '79991234567'
      localStorage.setItem('garage-service-requests-v1', JSON.stringify(records))
    }, foreign.record.id)
    await page.reload({waitUntil: 'domcontentloaded'}); await checkPrivate(foreignText)
    await page.getByRole('button', {name: 'Подтвердить телефон заявки'}).click()
    await confirm('+79000000000')
    await page.getByText(foreignText, {exact: true}).waitFor()
    await shot('matching-request-visible')
    await page.reload({waitUntil: 'domcontentloaded'})
    await page.getByText(foreignText, {exact: true}).waitFor()
    await goto('/checkout/review/')
    assert.equal(await page.getByLabel('Подтверждённый телефон').inputValue(), '+79000000000')
    await goto(foreign.url)
    await page.getByRole('button', {name: 'Выйти', exact: true}).click()
    assert(!(await page.locator('main').innerText()).includes(foreignText))
    await goto('/checkout/review/')
    await page.getByRole('button', {name: 'Войти или зарегистрироваться', exact: true}).click()
    await confirm('+79991234567')
    await goto(foreign.url); await checkPrivate(foreignText)
    const ownText = `Своя заявка ${width}`
    const own = await submit('+79991234567', ownText)
    assert.equal(own.record.ownerPhone, '79991234567')
    await page.getByText(ownText, {exact: true}).waitFor()
    await page.reload({waitUntil: 'domcontentloaded'})
    await page.getByText(ownText, {exact: true}).waitFor()
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('garage-service-requests-v1')))
    assert.equal(saved.filter(r => !r.seed).length, 2)
    assert.equal(saved.find(r => r.id === foreign.record.id).ownerPhone, '79000000000')
    assert.equal(saved.find(r => r.id === foreign.record.id).fields.comment, foreignText)
    await page.getByRole('button', {name: 'Выйти', exact: true}).click()
    assert(!(await page.locator('main').innerText()).includes(ownText))
    await page.reload({waitUntil: 'domcontentloaded'})
    assert(!(await page.locator('main').innerText()).includes(ownText))
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    assert.deepEqual(errors, [])
    return {width, checkoutIdentity: true, foreignHidden: true, legacyMisboundHidden: true, matchingConfirmed: true, ownRequest: true, logoutReloadPrivate: true, recordsPreserved: true, errors}
  } finally {await context.close()}
}
