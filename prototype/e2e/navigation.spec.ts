import { expect, test } from '@playwright/test'

test('catalog and unknown links resolve to meaningful prototype pages', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Весь каталог' }).click()
  await expect(page).toHaveURL(/\/catalog$/)
  await expect(page.getByRole('heading', { name: 'Каталог' })).toBeVisible()
  await page.goto('/not-in-map')
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible()
})
