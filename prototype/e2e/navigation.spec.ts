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

test('pages and dialogs do not render small labels above headings', async ({ page }) => {
  for (const path of ['/', '/catalog', '/catalog/compressor-equipment', '/catalog/compressor-equipment/screw-compressors', '/about', '/not-in-map']) {
    await page.goto(path)
    await expect(page.locator('.eyebrow + :is(h1, h2, h3)')).toHaveCount(0)
  }

  await page.goto('/')
  await page.getByRole('button', { name: 'Получить консультацию' }).first().click()
  await expect(page.getByRole('dialog').locator('.eyebrow + :is(h1, h2, h3)')).toHaveCount(0)

  await page.goto('/')
  await page.getByRole('button', { name: 'Выбрать город' }).first().click()
  await expect(page.getByRole('dialog').locator('.eyebrow + :is(h1, h2, h3)')).toHaveCount(0)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await page.getByRole('button', { name: 'Фильтры' }).click()
  await expect(page.getByRole('dialog').locator('.eyebrow + :is(h1, h2, h3)')).toHaveCount(0)
})

test('unapproved shop and business destinations are absent from navigation and routing', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Магазины', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Юридическим лицам', exact: true })).toHaveCount(0)
  await expect(page.locator('a[href="/shops"], a[href="/business"]')).toHaveCount(0)

  for (const path of ['/shops', '/business']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible()
  }
})
