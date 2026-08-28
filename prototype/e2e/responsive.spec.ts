import { expect, test } from '@playwright/test'

test('uses the approved widescreen container and product grid at 1920px', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')

  await expect(page.locator('.product-card:visible')).toHaveCount(10)
  const layout = await page.locator('.product-showcase').evaluate((section) => ({
    width: section.getBoundingClientRect().width,
    columns: getComputedStyle(section.querySelector('.product-grid')!).gridTemplateColumns.split(' ').length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }))
  expect(layout).toEqual({ width: 1536, columns: 5, overflow: false })
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
    await page.evaluate(() => window.scrollTo(0, 240))
    await expect(page.locator('.desktop-header--compact')).toBeVisible()

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
