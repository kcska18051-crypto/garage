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

test('phone authorization handles an expired code and a valid demo code', async ({ page }) => {
  await page.goto('/profile/auth')
  await page.getByLabel('Номер телефона').fill('+7 900 000-00-00')
  await page.getByLabel(/обработку персональных данных/).check()
  await page.getByLabel(/информационные и рекламные сообщения/).check()
  await page.getByRole('button', { name: 'Получить код' }).click()
  await page.getByLabel('Код подтверждения').fill('0000')
  await page.getByRole('button', { name: 'Подтвердить' }).click()
  await expect(page.getByRole('alert')).toContainText('истёк')
  await page.getByLabel('Код подтверждения').fill('1234')
  await page.getByRole('button', { name: 'Подтвердить' }).click()
  await expect(page.getByText('Номер подтверждён')).toBeVisible()
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

test('recovery handles an error and confirms access with the demo code', async ({ page }) => {
  await page.goto('/profile/recovery')
  await page.getByLabel('Номер телефона').fill('+7 900 000-00-00')
  await page.getByRole('button', { name: 'Получить код' }).click()
  await page.getByLabel('Код подтверждения').fill('9999')
  await page.getByRole('button', { name: 'Подтвердить доступ' }).click()
  await expect(page.getByRole('alert')).toContainText('Неверный код')
  await page.getByLabel('Код подтверждения').fill('1234')
  await page.getByRole('button', { name: 'Подтвердить доступ' }).click()
  await expect(page.getByRole('heading', { name: 'Доступ подтверждён' })).toBeVisible()
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
  await page.getByRole('link', { name: /Корзина/ }).click()
  await page.getByRole('link', { name: 'Перейти к оформлению' }).click()
  await page.getByRole('tab', { name: /Курьером/ }).click()
  await expect(page.getByRole('button', { name: /Склад — Ярославль, ул. Свободы, д. 19/ })).toBeVisible()
  await page.getByRole('link', { name: 'Профиль' }).click()
  await page.getByRole('link', { name: 'Адреса', exact: true }).click()
  const savedCard = page.locator('.profile-address-card').filter({ hasText: 'Склад' })
  await savedCard.getByRole('button', { name: 'Удалить адрес' }).click()
  await page.getByRole('dialog', { name: 'Удалить адрес' }).getByRole('button', { name: 'Удалить' }).click()
  await expect(page.getByText('Склад')).toHaveCount(0)
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
