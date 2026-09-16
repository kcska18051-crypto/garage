import { expect, test } from '@playwright/test'

test('uses the approved widescreen container and product grid at 1920px', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')

  await expect(page.locator('.product-card:visible')).toHaveCount(20)
  const layout = await page.locator('.product-showcase').first().evaluate((section) => ({
    width: section.getBoundingClientRect().width,
    columns: getComputedStyle(section.querySelector('.product-grid')!).gridTemplateColumns.split(' ').length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))
  expect(layout).toEqual({ width: 1440, columns: 5, overflow: false })
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 900 }, { width: 390, height: 844 }, { width: 360, height: 800 }]) {
  test(`has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client)
    if (viewport.width < 768) {
      await expect(page.getByRole('navigation', { name: 'Мобильная навигация' })).toBeVisible()
      await expect(page.getByLabel('Открыть меню')).toBeVisible()
    }
  })
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 1024, height: 768 }, { width: 768, height: 900 }]) {
  test(`sticky header keeps all account actions at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const expandedFlowHeight = await page.locator('.site-header').evaluate((header) => header.getBoundingClientRect().height)
    await page.evaluate(() => window.scrollTo(0, 240))
    await expect(page.locator('.desktop-header--compact')).toBeVisible()
    const compactFlowHeight = await page.locator('.site-header').evaluate((header) => header.getBoundingClientRect().height)
    expect(Math.abs(compactFlowHeight - expandedFlowHeight)).toBeLessThan(1)

    for (const label of ['Профиль', 'Сравнение', 'Избранное', 'Корзина']) {
      await expect(page.locator(`.desktop-header--compact .header-action[aria-label^="${label}"]`)).toBeVisible()
    }

    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client)
  })
}

for (const width of [768, 390, 360]) {
  test(`catalog introduction does not overlap at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/catalog')

    const items = await page.locator('.catalog-page__header > *').evaluateAll((elements) => elements.map((element) => {
      const box = element.getBoundingClientRect()
      return { top: box.top, right: box.right, bottom: box.bottom, left: box.left }
    }))

    for (let index = 1; index < items.length; index += 1) {
      expect(items[index].top).toBeGreaterThanOrEqual(items[index - 1].bottom)
    }

    expect(items.every((item) => item.left >= 0 && item.right <= width)).toBe(true)
  })
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`catalog and detail imagery stays compact at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const mobile = viewport.width < 768

    await page.goto('/catalog')
    const rootCategory = await page.locator('.catalog-category-card > a').first().boundingBox()
    expect(rootCategory).not.toBeNull()
    expect(rootCategory!.height).toBeLessThanOrEqual(mobile ? 230 : 300)

    await page.goto('/catalog/compressor-equipment/screw-compressors/')
    const childCategory = await page.locator('.catalog-child-sections__grid > a').first().boundingBox()
    expect(childCategory).not.toBeNull()
    expect(childCategory!.height).toBeLessThanOrEqual(mobile ? 190 : 220)

    await page.goto('/product/remeza-vk-10-gr-0001/')
    const productGallery = await page.locator('.product-gallery__main').boundingBox()
    expect(productGallery).not.toBeNull()
    expect(productGallery!.height).toBeLessThanOrEqual(mobile ? 330 : 460)

    await page.goto('/brand/remeza/')
    const brandHero = await page.locator('.brand-detail-hero__art').boundingBox()
    const brandCategory = await page.locator('.brand-category-grid > *').first().boundingBox()
    expect(brandHero).not.toBeNull()
    expect(brandCategory).not.toBeNull()
    expect(brandHero!.height).toBeLessThanOrEqual(mobile ? 280 : 400)
    expect(brandCategory!.height).toBeLessThanOrEqual(mobile ? 210 : 230)
  })
}
