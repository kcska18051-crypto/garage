import { expect, test, type Page } from '@playwright/test'

const storageKey = 'garage-cookie-preference'
const openWithoutCookieChoice = async (page: Page, path: string) => {
  await page.goto(path)
  await page.evaluate((key) => localStorage.removeItem(key), storageKey)
  await page.reload()
}

test('cookie choice survives reload and settings can change it', async ({ page }) => {
  await openWithoutCookieChoice(page, '/contacts')
  const banner = page.getByRole('region', { name: 'Настройки куки (cookie)' })
  await expect(banner).toBeVisible()
  await expect(banner).toContainText('Мы используем файлы куки (cookie) для вашего удобства. Продолжая пользоваться сайтом, вы соглашаетесь с политикой использования куки (cookie). Подробнее')
  await expect(banner.getByRole('button')).toHaveCount(1)
  await expect(banner.getByRole('link', { name: 'Подробнее' })).toHaveAttribute('href', '/privacy')
  await banner.getByRole('button', { name: 'Я согласен' }).click()
  await expect(banner).toBeHidden()
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), storageKey)).toEqual({ version: 1, choice: 'all' })

  await page.reload()
  await expect(banner).toBeHidden()
  await page.getByRole('button', { name: 'Настройки куки (cookie)' }).click()
  await banner.getByRole('button', { name: 'Я согласен' }).click()
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? 'null'), storageKey)).toEqual({ version: 1, choice: 'all' })
})

for (const document of [
  { path: '/privacy', title: 'Политика конфиденциальности' },
  { path: '/user-agreement', title: 'Пользовательское соглашение' },
  { path: '/personal-data-consent', title: 'Согласие на обработку персональных данных' },
]) {
  test(`opens legal document ${document.path}`, async ({ page }) => {
    await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ version: 1, choice: 'necessary' })), storageKey)
    await page.goto(document.path)
    await expect(page.getByRole('heading', { level: 1, name: document.title })).toBeVisible()
    await expect(page.getByText('Текст будет предоставлен заказчиком.')).toBeVisible()
  })
}

test('message form requires two independent consents', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ version: 1, choice: 'necessary' })), storageKey)
  await page.goto('/contacts')
  await page.getByRole('button', { name: 'Написать сообщение' }).click()
  const dialog = page.getByRole('dialog', { name: 'Написать сообщение' })
  await dialog.getByLabel('Ваше имя').fill('Анна')
  await dialog.getByRole('radio', { name: 'Email' }).check()
  await dialog.getByLabel('Email для ответа').fill('anna@example.com')
  await dialog.getByLabel('Сообщение').fill('Нужна консультация по оборудованию')
  await dialog.getByRole('button', { name: 'Отправить сообщение' }).click()
  await expect(dialog.getByText('Подтвердите согласие на обработку персональных данных')).toBeVisible()
  await expect(dialog.getByText('Примите пользовательское соглашение')).toBeVisible()

  const personal = dialog.getByRole('checkbox', { name: /даю согласие/i })
  const agreement = dialog.getByRole('checkbox', { name: /принимаю пользовательское соглашение/i })
  await expect(dialog.getByRole('link', { name: 'Текст согласия' })).toHaveAttribute('target', '_blank')
  await personal.check()
  await dialog.getByRole('button', { name: 'Отправить сообщение' }).click()
  await expect(dialog.getByText('Подтвердите согласие на обработку персональных данных')).toBeHidden()
  await expect(dialog.getByText('Примите пользовательское соглашение')).toBeVisible()
  await agreement.check()
  await dialog.getByRole('button', { name: 'Отправить сообщение' }).click()
  await expect(dialog.getByRole('status')).toContainText('Сообщение сохранено')
})

test('support modes start with two empty consents', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ version: 1, choice: 'necessary' })), storageKey)
  await page.goto('/profile/help')
  for (const action of ['Задать вопрос', 'Заказать звонок', 'Написать в чат']) {
    await page.getByRole('button', { name: action }).click()
    const form = page.getByRole('region', { name: 'Форма обращения' })
    await expect(form.getByRole('heading', { name: action })).toBeVisible()
    await expect(form.getByRole('checkbox')).toHaveCount(2)
    await expect(form.getByRole('checkbox').first()).not.toBeChecked()
    await expect(form.getByRole('checkbox').last()).not.toBeChecked()
  }
})

for (const viewport of [{ width: 1920, height: 1080 }, { width: 1440, height: 900 }, { width: 1024, height: 900 }, { width: 390, height: 844 }, { width: 360, height: 800 }]) {
  test(`cookie banner has no overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await openWithoutCookieChoice(page, '/contacts')
    await expect(page.getByRole('region', { name: 'Настройки куки (cookie)' })).toBeVisible()
    const bannerContent = page.getByRole('region', { name: 'Настройки куки (cookie)' })
    const text = await bannerContent.locator('p').boundingBox()
    const action = await bannerContent.getByRole('button', { name: 'Я согласен' }).boundingBox()
    expect(text && action && action.y >= text.y + text.height).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    if (viewport.width < 768) {
      const banner = await page.getByRole('region', { name: 'Настройки куки (cookie)' }).boundingBox()
      const mobileNav = await page.getByRole('navigation', { name: 'Мобильная навигация' }).boundingBox()
      expect(banner && mobileNav && banner.y + banner.height <= mobileNav.y).toBe(true)
    }
  })
}

test('auth and checkout remain available after the cookie choice', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ version: 1, choice: 'necessary' })), storageKey)
  await page.goto('/')
  await page.locator('button[aria-label="Профиль"]:visible').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.goto('/checkout/review')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
