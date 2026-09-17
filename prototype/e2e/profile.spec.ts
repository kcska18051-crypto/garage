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
