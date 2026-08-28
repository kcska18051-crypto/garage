import { expect, test } from '@playwright/test'

test('homepage, catalog and category cards form one navigation chain', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Весь каталог' }).click()
  await expect(page).toHaveURL(/\/catalog$/)
  await expect(page.getByRole('heading', { name: 'Каталог', exact: true })).toBeVisible()

  await page.getByRole('link', { name: /Компрессорное оборудование, 164 товаров/ }).click()
  await expect(page).toHaveURL(/\/catalog\/compressor-equipment$/)
  await expect(page.getByRole('heading', { name: 'Компрессорное оборудование', exact: true })).toBeVisible()

  await page.getByRole('link', { name: /Винтовые компрессоры, 48 товаров/ }).click()
  await expect(page).toHaveURL(/\/catalog\/compressor-equipment\/screw-compressors$/)
  await expect(page.getByRole('heading', { name: 'Винтовые компрессоры' })).toBeVisible()

  await page.getByRole('navigation', { name: 'Хлебные крошки' }).getByRole('link', { name: 'Каталог' }).click()
  await expect(page).toHaveURL(/\/catalog$/)
  await page.goto('/not-in-map')
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible()
})
