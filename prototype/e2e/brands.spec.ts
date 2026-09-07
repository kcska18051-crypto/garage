import { expect, test } from '@playwright/test'

test('brand directory links Remeza and keeps unapproved brands informational', async ({ page }) => {
  await page.goto('/brands/')
  await expect(page.getByRole('heading', { level: 1, name: 'Бренды' })).toBeVisible()
  const directory = page.getByRole('region', { name: 'Все бренды' })
  await expect(directory.getByRole('link', { name: /Remeza/ })).toHaveAttribute('href', '/brand/remeza/')
  await expect(directory.getByText('Rupes', { exact: true })).not.toHaveAttribute('href')

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

test('Remeza brand detail supports navigation, filters and consultation', async ({ page }) => {
  await page.goto('/brand/remeza/')
  await expect(page.getByRole('heading', { level: 1, name: 'Оборудование Remeza' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Хлебные крошки' })).toContainText('ГлавнаяБрендыRemeza')

  const categories = page.getByRole('region', { name: 'Категории товаров Remeza' })
  await expect(categories.getByRole('link')).toHaveCount(4)
  await expect(categories.getByRole('article')).toHaveCount(4)

  const popular = page.getByRole('region', { name: 'Популярные товары Remeza' })
  expect(await popular.getByRole('article').count()).toBeGreaterThanOrEqual(4)

  await page.getByRole('button', { name: 'Тег 380 В', exact: true }).click()
  await expect(page).toHaveURL(/tag=voltage%3A380/)
  await expect(page.getByRole('button', { name: 'Тег 380 В', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByLabel('Сортировка').selectOption('price-asc')
  await expect(page).toHaveURL(/sort=price-asc/)

  await page.getByRole('button', { name: 'Получить консультацию' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('Remeza brand detail has no horizontal overflow at control widths', async ({ page }) => {
  for (const width of [1920, 1440, 1280, 1024, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/brand/remeza/')
    const dimensions = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
    expect(dimensions.scroll, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(dimensions.client)
  }
})
