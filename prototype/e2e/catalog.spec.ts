import { expect, test } from '@playwright/test'

for (const viewport of [
  { width: 1920, height: 1080, columns: 3 },
  { width: 1440, height: 900, columns: 3 },
  { width: 1024, height: 900, columns: 2 },
  { width: 768, height: 900, columns: 2 },
]) {
  test(`catalog root uses ${viewport.columns} columns at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/catalog')

    await expect(page.locator('.catalog-root-desktop')).toBeVisible()
    const columns = await page.locator('.catalog-root-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(viewport.columns)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })
}

for (const width of [390, 360]) {
  test(`catalog root is a compact list at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/catalog')

    await expect(page.locator('.catalog-root-desktop')).toBeHidden()
    await expect(page.getByTestId('catalog-mobile-row')).toHaveCount(6)
    await expect(page.locator('.catalog-root-mobile')).not.toContainText(/\d+ товар/)
    await expect(page.locator('.catalog-root-mobile').getByRole('button')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })
}

test('one catalog card expands independently and a category opens its landing page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/catalog')

  const cards = page.getByTestId('catalog-root-card')
  const firstButton = cards.nth(0).getByRole('button')
  const secondButton = cards.nth(1).getByRole('button')
  await firstButton.click()
  await expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  await expect(secondButton).toHaveAttribute('aria-expanded', 'false')

  await cards.nth(1).locator('.catalog-root-card__title').click()
  await expect(page).toHaveURL(/\/catalog\/lifting-equipment$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Подъёмное оборудование' })).toBeVisible()
  await expect(page.getByTestId('catalog-section-row')).toHaveCount(6)
})

test('first-level compressor page contains only compact linked subcategories', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/catalog/compressor-equipment')

  await expect(page.getByRole('heading', { level: 1, name: 'Компрессоры' })).toBeVisible()
  await expect(page.getByTestId('catalog-subcategory-card')).toHaveCount(6)
  await expect(page.locator('.catalog-subcategory-card__art')).toHaveCount(6)
  await expect(page.locator('.catalog-listing')).toHaveCount(0)
  await expect(page.locator('.catalog-related-brands')).toHaveCount(0)
  await expect(page.getByLabel('Сортировка')).toHaveCount(0)

  const layout = await page.locator('.catalog-subcategory-grid').evaluate((grid) => ({
    columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
    cardHeight: grid.querySelector('a')!.getBoundingClientRect().height,
  }))
  expect(layout.columns).toBe(4)
  expect(layout.cardHeight).toBeLessThan(180)

  await page.getByRole('link', { name: 'Винтовые компрессоры, 48 товаров' }).click()
  await expect(page).toHaveURL(/\/catalog\/compressor-equipment\/screw-compressors$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Винтовые компрессоры' })).toBeVisible()
})

for (const viewport of [
  { width: 1440, height: 900, columns: 4 },
  { width: 1024, height: 900, columns: 3 },
  { width: 768, height: 900, columns: 2 },
]) {
  test(`first-level subcategories stay compact in ${viewport.columns} columns at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/catalog/compressor-equipment')

    const grid = page.locator('.catalog-subcategory-grid')
    const layout = await grid.evaluate((element) => ({
      columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
      heights: Array.from(element.querySelectorAll('a')).map((card) => card.getBoundingClientRect().height),
    }))
    expect(layout.columns).toBe(viewport.columns)
    expect(new Set(layout.heights).size).toBe(1)
    expect(Math.max(...layout.heights)).toBeLessThan(180)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })
}

test('mobile first-level category uses the compact vertical list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/catalog/compressor-equipment')

  await expect(page.locator('.catalog-subcategory-grid')).toBeHidden()
  await expect(page.getByTestId('catalog-section-row')).toHaveCount(6)
  await expect(page.locator('.catalog-section-list--mobile-only .catalog-row-art')).toHaveCount(6)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

for (const category of [
  { path: '/catalog/compressor-equipment', heading: 'Компрессоры' },
  { path: '/catalog/lifting-equipment', heading: 'Подъёмное оборудование' },
  { path: '/catalog/body-repair', heading: 'Кузовной ремонт' },
  { path: '/catalog/painting', heading: 'Покраска' },
  { path: '/catalog/tools', heading: 'Инструмент' },
  { path: '/catalog/service-station-equipment', heading: 'Оснащение автосервиса' },
]) {
  test(`first-level category route opens ${category.path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/catalog')
    await page.locator(`.catalog-root-mobile a[href="${category.path}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${category.path}$`))
    await expect(page.getByRole('heading', { level: 1, name: category.heading })).toBeVisible()
    await expect(page.getByTestId('catalog-section-row')).toHaveCount(6)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  })
}

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
  await expect(results).toHaveClass(/catalog-results--list/)
  const layout = await results.evaluate((grid) => ({
    columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
    overflow: grid.scrollWidth > grid.clientWidth,
  }))

  expect(layout).toEqual({ columns: 1, overflow: false })
})

test('list cards keep a compact readable price panel', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await page.getByRole('button', { name: 'Список' }).click()

  const card = page.locator('.catalog-product-card').first()
  await expect(card.locator('.product-teaser__bottom strong')).toContainText('₽')
  const metrics = await card.locator('.catalog-product-card__bottom').evaluate((panel) => {
    const price = panel.querySelector('strong')!
    const action = panel.querySelector('button')!
    return {
      panelWidth: panel.getBoundingClientRect().width,
      actionWidth: action.getBoundingClientRect().width,
      priceSize: Number.parseFloat(getComputedStyle(price).fontSize),
    }
  })

  expect(metrics.panelWidth).toBeGreaterThanOrEqual(120)
  expect(metrics.actionWidth).toBeLessThanOrEqual(120)
  expect(metrics.priceSize).toBeGreaterThanOrEqual(18)
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
  await expect(page.getByRole('heading', { name: 'Подбор оборудования' })).toHaveCount(0)
  await expect(page.getByText(/Найдено \d+ товар/)).toBeVisible()
})

test('counts appear on first-level section links and beside product results on the next level', async ({ page }) => {
  await page.goto('/catalog/compressor-equipment')
  await expect(page.locator('.catalog-page__header').getByText(/\d+ товар/)).toHaveCount(0)
  await expect(page.getByTestId('catalog-section-row')).toHaveCount(6)
  await expect(page.getByText('48 товаров')).toHaveCount(2)
  await expect(page.locator('.catalog-listing')).toHaveCount(0)

  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await expect(page.locator('.catalog-page__header').getByText('Показано 12 из 48')).toHaveCount(0)
  await expect(page.locator('.catalog-listing__toolbar').getByText(/Найдено \d+ товар/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Тег Remeza' })).toHaveText('Remeza')
  const fullFilterBrand = page.locator('.catalog-listing__sidebar').getByLabel('Remeza', { exact: true })
  await expect(fullFilterBrand.locator('xpath=..')).toContainText(/\d+/)
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

test('list view becomes a readable vertical card on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  await page.getByRole('button', { name: 'Список' }).click()
  const card = page.locator('.catalog-product-card').first()
  await expect(card.locator('.product-teaser__name')).toBeVisible()
  await expect.poll(() => card.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
})

test('screw-compressor page presents compact child navigation before one catalog work area', async ({ page }) => {
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  const children = page.getByRole('region', { name: 'Дочерние разделы' })
  const listing = page.getByRole('region', { name: 'Товарная выдача' })
  await expect(children.getByRole('link')).toHaveCount(4)
  await expect(children.getByRole('heading')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: 'Выберите тип оборудования' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Подбор оборудования' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Быстрый выбор по параметрам' })).toHaveCount(0)
  await children.getByRole('button', { name: 'Показать ещё 2' }).click()
  await expect(children.getByRole('link')).toHaveCount(6)
  await expect(children).toContainText('Винтовые компрессоры на ресивере')
  const order = await page.locator('.catalog-page').evaluate((root) => {
    const selectors = ['.catalog-child-sections', '.catalog-listing', '.catalog-seo-tail']
    return selectors.map((selector) => Array.from(root.children).indexOf(root.querySelector(selector)!))
  })
  expect(order).toEqual([...order].sort((a, b) => a - b))
  await expect(listing.locator('.catalog-listing__content > .catalog-tags')).toHaveCount(1)
  const firstCard = await page.locator('.catalog-product-card').first().boundingBox()
  expect(firstCard?.y).toBeLessThan((page.viewportSize()?.width ?? 1440) < 768 ? 1100 : 920)
})

test('shared product teaser offers hover frames and explicit mobile controls', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  const card = page.locator('.catalog-product-card').first()
  const gallery = card.getByTestId('product-gallery')
  const media = card.locator('.product-teaser__media')
  await media.scrollIntoViewIfNeeded()
  const box = await media.boundingBox()
  if (!box) throw new Error('Product media is not visible')
  await page.mouse.move(box.x + box.width * .85, box.y + box.height / 2)
  await expect(gallery).toHaveAttribute('data-frame', '2')
  await page.mouse.move(1, 1)
  await expect(gallery).toHaveAttribute('data-frame', '0')

  await page.setViewportSize({ width: 390, height: 844 })
  const secondFrame = card.getByRole('button', { name: /Показать кадр 2:/ })
  const tapTarget = await secondFrame.boundingBox()
  expect(tapTarget?.width).toBeGreaterThanOrEqual(44)
  expect(tapTarget?.height).toBeGreaterThanOrEqual(44)
  await secondFrame.click()
  await expect(gallery).toHaveAttribute('data-frame', '1')
})

test('shared product teaser keeps a compact vertical rhythm', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/catalog/compressor-equipment/screw-compressors')
  const card = page.locator('.catalog-product-card').first()
  await card.scrollIntoViewIfNeeded()

  const metrics = await card.evaluate((node) => {
    const name = node.querySelector('.product-teaser__name')!.getBoundingClientRect()
    const sku = node.querySelector('.product-teaser__sku')!.getBoundingClientRect()
    const priceRow = node.querySelector('.product-teaser__bottom')!.getBoundingClientRect()
    return {
      height: node.getBoundingClientRect().height,
      nameToSku: sku.top - name.bottom,
      skuToPrice: priceRow.top - sku.bottom,
    }
  })

  expect(metrics.height).toBeLessThanOrEqual(330)
  expect(metrics.nameToSku).toBeLessThanOrEqual(4)
  expect(metrics.skuToPrice).toBeLessThanOrEqual(5)
})
