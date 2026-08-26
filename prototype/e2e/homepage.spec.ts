import { expect, test } from '@playwright/test'

test('homepage exposes the approved sections and working product actions', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Оборудование и материалы')
  await expect(page.locator('.hero__slide:visible')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Популярные категории' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Новинки' })).toBeVisible()
  await page.getByRole('button', { name: /Добавить в корзину/ }).first().click()
  await expect(page.locator('[aria-label="Корзина: 1"]:visible')).toBeVisible()
  await page.getByRole('button', { name: 'Получить консультацию' }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
})
