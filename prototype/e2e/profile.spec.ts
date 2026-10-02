import { expect, test } from '@playwright/test'

test('profile connects the overview, orders and organization flows', async ({ page }) => {
  await page.goto('/profile')
  await expect(page.getByRole('heading', { level: 1, name: 'Личный кабинет' })).toBeVisible()
  await page.getByRole('link', { name: 'Мои заказы' }).click()
  await expect(page.getByText('Получен', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'От организаций' }).click()
  await expect(page.getByText('ООО «АвтоПрофи»')).toBeVisible()
  await page.getByRole('link', { name: 'Мои организации' }).click()
  await page.getByRole('button', { name: 'Добавить организацию' }).click()
  await page.getByLabel('ИНН организации').fill('7600000028')
  await page.getByRole('button', { name: 'Найти по ИНН' }).click()
  await expect(page.getByText('ООО «Гараж Профи»')).toBeVisible()
})

test('unified auth dialog supports SMS and password login without leaving the source page', async ({ page }) => {
  await page.goto('/catalog')
  await page.getByRole('button', { name: 'Профиль' }).click()
  const dialog = page.getByRole('dialog', { name: 'Вход и регистрация' })
  await dialog.getByLabel('Номер телефона').fill('+7 999 111-22-33')
  await dialog.getByRole('button', { name: 'Получить код' }).click()
  await dialog.getByLabel('Код подтверждения').fill('0000')
  await dialog.getByRole('button', { name: 'Войти' }).click()
  await expect(dialog.getByRole('alert')).toContainText('истёк')
  await dialog.getByRole('button', { name: 'Отправить код повторно' }).click()
  await dialog.getByLabel('Код подтверждения').fill('1234')
  await dialog.getByRole('button', { name: 'Войти' }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/catalog$/)

  await page.getByRole('button', { name: 'Профиль' }).click()
  await dialog.getByRole('button', { name: 'По паролю' }).click()
  await dialog.getByLabel('Номер телефона').fill('+7 900 000-00-00')
  await dialog.getByLabel('Пароль').fill('garage123')
  await dialog.getByRole('button', { name: 'Войти' }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/catalog$/)
})

test('documents and help are real account sections with working actions', async ({ page }) => {
  await page.goto('/profile')
  await page.getByRole('link', { name: 'Документы' }).click()
  await expect(page).toHaveURL(/\/profile\/documents/)
  await page.getByRole('tab', { name: 'Организации' }).click()
  await expect(page.getByText('Счёт на оплату')).toBeVisible()
  await page.getByRole('button', { name: 'Посмотреть документ' }).first().click()
  await expect(page.getByRole('dialog', { name: 'Предпросмотр документа' })).toBeVisible()
  await page.getByRole('button', { name: 'Закрыть диалог' }).click()
  await page.getByRole('link', { name: 'Помощь' }).click()
  await expect(page).toHaveURL(/\/profile\/help/)
  await page.getByRole('searchbox', { name: 'Поиск по вопросам' }).fill('возврат')
  await page.getByRole('button', { name: /Как оформить возврат/ }).click()
  await expect(page.getByText(/сохраните комплектность/i)).toBeVisible()
  await page.getByRole('button', { name: 'Задать вопрос' }).click()
  await page.getByLabel('Текст вопроса').fill('Нужна помощь с заказом')
  await page.getByRole('button', { name: 'Отправить обращение' }).click()
  await expect(page.getByText('Спасибо! Ваше обращение отправлено')).toBeVisible()
})

test('legacy recovery route opens both recovery choices in the unified dialog', async ({ page }) => {
  await page.goto('/profile/recovery')
  const dialog = page.getByRole('dialog', { name: 'Вход и регистрация' })
  await expect(dialog.getByRole('heading', { name: 'Восстановление доступа' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Восстановить пароль' }).click()
  await dialog.getByLabel('Номер телефона').fill('+7 900 000-00-00')
  await dialog.getByRole('button', { name: 'Получить код' }).click()
  await dialog.getByLabel('Код подтверждения').fill('1234')
  await dialog.getByRole('button', { name: 'Подтвердить' }).click()
  await dialog.getByLabel('Новый пароль').fill('garage-new')
  await dialog.getByLabel('Повторите пароль').fill('garage-new')
  await dialog.getByRole('button', { name: 'Сохранить пароль и войти' }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
})

test('company registration returns to checkout after connecting an organization', async ({ page }) => {
  await page.goto('/checkout/review')
  await page.getByRole('button', { name: 'Войти или зарегистрироваться' }).click()
  const dialog = page.getByRole('dialog', { name: 'Вход и регистрация' })
  await dialog.getByRole('tab', { name: 'Регистрация' }).click()
  await dialog.getByLabel('Имя').fill('Ирина')
  await dialog.getByLabel('Номер телефона').fill('+7 999 555-66-77')
  await dialog.getByLabel('Для компании').check()
  await dialog.getByLabel(/обработку персональных данных/).check()
  await dialog.getByLabel(/условия сервиса/).check()
  await dialog.getByRole('button', { name: 'Продолжить' }).click()
  await dialog.getByLabel('Код подтверждения').fill('1234')
  await dialog.getByRole('button', { name: 'Подтвердить' }).click()
  await dialog.getByLabel('ИНН организации').fill('7600000028')
  await dialog.getByRole('button', { name: 'Найти организацию' }).click()
  await expect(dialog.getByText('ООО «Гараж Профи»')).toBeVisible()
  await dialog.getByRole('button', { name: 'Подключить организацию' }).click()
  await dialog.getByRole('button', { name: 'Продолжить без пароля' }).click()
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/checkout\/review$/)
})

test('address CRUD stays connected to courier checkout', async ({ page }) => {
  await page.goto('/profile/addresses')
  await page.getByRole('button', { name: 'Добавить адрес' }).click()
  await page.getByLabel('Название адреса').fill('Склад')
  await page.getByRole('textbox', { name: 'Город', exact: true }).fill('Ярославль')
  await page.getByRole('textbox', { name: 'Улица', exact: true }).fill('Свободы')
  await page.getByRole('textbox', { name: 'Дом', exact: true }).fill('18')
  await page.getByRole('button', { name: 'Сохранить адрес' }).click()
  const card = page.locator('.profile-address-card').filter({ hasText: 'Склад' })
  await card.getByRole('button', { name: 'Изменить' }).click()
  await page.getByRole('textbox', { name: 'Дом', exact: true }).fill('19')
  await page.getByRole('button', { name: 'Сохранить адрес' }).click()
  await expect(card).toContainText('д. 19')
  await card.getByRole('button', { name: 'Сделать основным' }).click()
  await expect(card).toContainText('Основной')

  await page.reload()
  const persistedCard = page.locator('.profile-address-card').filter({ hasText: 'Склад' })
  await expect(persistedCard).toContainText('д. 19')
  await expect(persistedCard).toContainText('Основной')

  await page.goto('/checkout/review')
  await page.getByRole('tab', { name: /Курьером/ }).click()
  await expect(page.getByRole('button', { name: /Склад — Ярославль, ул. Свободы, д. 19/ })).toBeVisible()
  await page.goto('/profile/addresses')
  const savedCard = page.locator('.profile-address-card').filter({ hasText: 'Склад' })
  await savedCard.getByRole('button', { name: 'Удалить адрес' }).click()
  await page.getByRole('dialog', { name: 'Удалить адрес' }).getByRole('button', { name: 'Удалить' }).click()
  await page.reload()
  await expect(page.getByText('Склад')).toHaveCount(0)
  await expect(page.locator('.profile-address-card').filter({ has: page.getByText('Дом', { exact: true }) })).toContainText('Основной')
})

for (const route of ['/profile/documents', '/profile/help', '/profile/recovery', '/profile/addresses']) {
  for (const width of [1440, 1024, 390, 360]) {
    test(`${route} has no document overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 500 ? 844 : 900 })
      await page.goto(route)
      expect(await page.locator('body').evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
    })
  }
}

for (const viewport of [{ width: 1920, height: 1080 }, { width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 900 }, { width: 390, height: 844 }, { width: 360, height: 800 }]) {
  test(`profile has no horizontal page overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/profile/favorites')
    expect(await page.locator('body').evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
    if (viewport.width < 768) {
      await expect(page.getByRole('navigation', { name: 'Мобильная навигация' })).toBeVisible()
      expect(await page.locator('.profile-product-grid').evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true)
    }
  })
}

for (const width of [390, 360]) {
  test(`mobile profile form actions stay above navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })

    const expectActionAboveNavigation = async (actionName: string) => {
      const action = page.getByRole('button', { name: actionName })
      await action.evaluate((node) => node.scrollIntoView({ block: 'end' }))
      const actionBox = await action.boundingBox()
      const navigationBox = await page.getByRole('navigation', { name: 'Мобильная навигация' }).boundingBox()
      expect(actionBox).not.toBeNull()
      expect(navigationBox).not.toBeNull()
      expect(actionBox!.y + actionBox!.height).toBeLessThanOrEqual(navigationBox!.y - 8)
    }

    await page.goto('/profile/addresses')
    await page.getByRole('button', { name: 'Добавить адрес' }).click()
    await expectActionAboveNavigation('Сохранить адрес')

    await page.goto('/profile/help')
    await page.getByRole('button', { name: 'Задать вопрос' }).click()
    await expectActionAboveNavigation('Отправить обращение')
  })
}

for (const viewport of [{ width: 1440, height: 800 }, { width: 390, height: 844 }]) {
  test(`help actions reveal their matching form at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)

    for (const action of ['Задать вопрос', 'Заказать звонок', 'Написать в чат']) {
      await page.goto('/profile/help')
      await page.getByRole('button', { name: action, exact: true }).click()
      await expect(page.getByRole('region', { name: 'Форма обращения' }).getByRole('heading', { name: action, exact: true })).toBeInViewport()
    }
  })
}
