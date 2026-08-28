import { expect, test } from '@playwright/test'

test('catalog result grid uses three columns at 1440 and four at 1920', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900, columns: 3 }, { width: 1920, height: 1080, columns: 4 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/catalog/compressor-equipment/screw-compressors')
    const columns = await page.getByTestId('catalog-results').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(viewport.columns)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
})

test('list view stays a single readable column at 1920', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await page.getByRole('button', { name: 'Список' }).click()

  const results = page.getByTestId('catalog-results')
  const layout = await results.evaluate((grid) => ({
    columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
    overflow: grid.scrollWidth > grid.clientWidth,
  }))

  expect(layout).toEqual({ columns: 1, overflow: false })
})

test('mobile filter keeps a draft until the explicit apply action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')

  await page.getByRole('button', { name: 'Фильтры' }).click()
  const dialog = page.getByRole('dialog', { name: 'Фильтры каталога' })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Remeza').check()
  await expect(page).not.toHaveURL(/brand=remeza/)

  await dialog.getByRole('button', { name: /Показать \d+ товаров/ }).click()
  await expect(page).toHaveURL(/brand=remeza/)
  await expect(page.getByRole('button', { name: 'Удалить фильтр Remeza' })).toBeVisible()
})

test('mobile tag groups use one readable column', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  const columns = await page.locator('.catalog-tags__groups').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)
  expect(columns).toBe(1)
})

test('second-level template removes the optional tag block without a gap', async ({ page }) => {
  await page.goto('/catalog/compressor-equipment/oil-free-compressors')
  await expect(page.locator('.catalog-tags')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Подбор оборудования' })).toBeVisible()
})

for (const viewport of [{ width: 768, height: 900 }, { width: 390, height: 844 }, { width: 360, height: 800 }]) {
  test(`catalog chain has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    for (const path of ['/catalog', '/catalog/compressor-equipment', '/catalog/compressor-equipment/screw-compressors']) {
      await page.goto(path)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    }
  })
}

test('catalog card actions update the shared header commerce counters', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await page.getByRole('button', { name: /Добавить в корзину:/ }).first().click()
  await expect(page.locator('[aria-label="Корзина: 1"]:visible')).toBeVisible()
})
