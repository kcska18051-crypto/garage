import { expect, test } from '@playwright/test'

test('brand directory filters information cards without detail routes', async ({ page }) => {
  await page.goto('/brands/')
  await expect(page.getByRole('heading', { level: 1, name: 'Бренды' })).toBeVisible()
  const directory = page.getByRole('region', { name: 'Все бренды' })
  await expect(directory.getByText('Remeza', { exact: true })).toBeVisible()
  await expect(directory.getByRole('link')).toHaveCount(0)

  await page.getByRole('searchbox', { name: 'Поиск бренда' }).fill('Remeza')
  await expect(directory.getByText('Remeza', { exact: true })).toBeVisible()
  await expect(directory.getByText('Rupes', { exact: true })).toHaveCount(0)
  await page.getByRole('searchbox', { name: 'Поиск бренда' }).fill('')
  await page.getByRole('button', { name: 'Кузовной ремонт' }).click()
  await expect(directory.getByText('Rupes', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Все направления' }).click()
  await page.getByRole('button', { name: 'Буква R' }).click()
  await expect(directory.getByText('Berg', { exact: true })).toHaveCount(0)
})

test('Remeza brand detail URL is not registered', async ({ page }) => {
  await page.goto('/brands/remeza/')
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible()
})
