import { test, expect } from '@playwright/test'

const missing = ['/unknown-test-path', '/catalog/unknown', '/catalog/compressor-equipment/unknown', '/catalog/compressor-equipment/screw-compressors/unknown', '/catalog/lifting-equipment/unknown/deeper', '/product/unknown', '/brands/unknown', '/brand/unknown', '/news/unknown', '/articles/unknown', '/reviews/unknown', '/actions/unknown', '/actions/unknown/deeper', '/services/unknown', '/services/rental/unknown', '/services/service-center/compressor-repair/unknown', '/contacts/unknown']

for (const width of [1920, 1440, 390, 360]) {
  test(`missing records preserve address and layout at ${width}`, async ({ page }) => {
    test.setTimeout(120000)
    await page.setViewportSize({ width, height: 1000 })
    for (const route of missing) for (const suffix of ['', '/']) {
      await page.goto(`${route}${suffix}?check=404`)
      await expect(page.locator('main h1')).toHaveText('Страница не найдена')
      expect(new URL(page.url()).pathname).toBe(`${route}${suffix}`)
      expect(new URL(page.url()).search).toBe('?check=404')
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
      await expect(page.locator('.site-header')).toBeVisible()
      const bounds = await page.locator('main').boundingBox()
      expect(bounds!.x).toBeGreaterThanOrEqual(0)
      expect(bounds!.width).toBeLessThanOrEqual(width)
      expect(await page.locator('.site-footer').evaluate(el => el.getBoundingClientRect().bottom + scrollY)).toBeGreaterThanOrEqual(999)
    }
    await page.reload()
    await expect(page.locator('main h1')).toHaveText('Страница не найдена')
    await page.screenshot({ path: `test-results/not-found-${width}.png`, fullPage: true })
  })
}

test('404 exit links, history and header search work', async ({ page }) => {
  await page.goto('/unknown-test-path/')
  await page.locator('main').getByRole('link', { name: 'В каталог', exact: true }).click()
  await expect(page.locator('main h1')).toHaveText('Каталог')
  await page.goBack()
  await expect(page.locator('main h1')).toHaveText('Страница не найдена')
  await page.goForward()
  await expect(page.locator('main h1')).toHaveText('Каталог')
  await page.goBack()
  await page.locator('main').getByRole('link', { name: 'На главную', exact: true }).click()
  await expect(page.locator('.home-page, main')).toBeVisible()
  expect(new URL(page.url()).pathname).toBe('/')
  await page.goBack()
  const input = page.locator('input[type="search"]:visible').first()
  await input.fill('Remeza')
  await input.press('Enter')
  await expect(page).toHaveURL(/\/search\?q=Remeza/)
  await expect(page.locator('main h1')).toContainText('Результаты поиска')
  expect(await page.title()).not.toContain('Страница не найдена')
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
})

test('implemented category and brand URLs do not become 404', async ({ page }) => {
  for (const route of ['/catalog/compressor-equipment/screw-compressors/receiver', '/brand/remeza', '/product/remeza-vk-10-gr-0001', '/services', '/news', '/actions', '/contacts']) {
    await page.goto(route)
    await expect(page.locator('main h1')).not.toHaveText('Страница не найдена')
    await expect(page.locator('main h1')).toBeVisible()
  }
})
