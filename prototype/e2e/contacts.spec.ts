import { expect, test } from '@playwright/test'

test('header and footer open the complete contacts page', async ({ page }) => {
  await page.goto('/')
  const headerLink = page.getByRole('navigation', { name: 'Сервисная навигация' }).getByRole('link', { name: 'Контакты' })
  if (await headerLink.isVisible()) await headerLink.click()
  else await page.getByRole('contentinfo').getByRole('link', { name: 'Контакты' }).click()
  await expect(page).toHaveURL(/\/contacts$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Контакты' })).toBeVisible()
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Контакты' })).toHaveAttribute('href', '/contacts')
})

test('point selection updates the schematic map and message closes with Escape', async ({ page }) => {
  await page.goto('/contacts')
  await page.getByRole('button', { name: 'На карте: Демо-сервисная точка' }).click()
  await expect(page.getByRole('region', { name: 'Демонстрационная карта' }).getByRole('heading', { name: 'Демо-сервисная точка' })).toBeVisible()
  const trigger = page.getByRole('button', { name: 'Написать сообщение' })
  await trigger.click()
  await expect(page.getByRole('dialog', { name: 'Написать сообщение' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Написать сообщение' })).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

for (const width of [2560, 1920, 1440, 1024, 390, 360]) {
  test(`contacts stay contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/contacts')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true)
    await expect(page.getByRole('region', { name: 'Демонстрационная карта' })).toBeVisible()
    await page.getByRole('button', { name: 'Заказать звонок' }).click()
    await expect(page.getByRole('dialog', { name: 'Заказать звонок' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true)
  })
}
