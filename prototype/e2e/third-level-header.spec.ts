import { expect, test } from '@playwright/test'

test('desktop quick links use overflow menu and keep real internal navigation', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto('/')

  const quickNav = page.getByRole('navigation', { name: 'Быстрые ссылки', exact: true })
  const more = quickNav.getByRole('button', { name: 'Ещё' })
  await expect(quickNav).toBeVisible()
  await expect(more).toBeVisible()
  await more.click()

  const overflow = page.getByRole('navigation', { name: 'Дополнительные быстрые ссылки' })
  await expect(overflow).toBeVisible()
  await overflow.getByRole('link', { name: 'Remeza' }).click()
  await expect(page).toHaveURL(/\/brand\/remeza\/?$/)
})

test('mobile quick links stay on one horizontally scrollable line', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const quickNav = page.getByRole('navigation', { name: 'Быстрые ссылки на мобильных' })
  await expect(quickNav).toBeVisible()
  const layout = await quickNav.evaluate((nav) => ({
    clientWidth: nav.clientWidth,
    scrollWidth: nav.scrollWidth,
    links: [...nav.querySelectorAll('a')].map((link) => ({
      height: link.getBoundingClientRect().height,
      whiteSpace: getComputedStyle(link).whiteSpace,
    })),
  }))

  expect(layout.scrollWidth).toBeGreaterThan(layout.clientWidth)
  expect(layout.links.every((link) => link.height >= 44 && link.whiteSpace === 'nowrap')).toBe(true)
})

test('quick links expose active and focus states but leave the compact header minimal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/catalog/compressor-equipment')

  const quickNav = page.getByRole('navigation', { name: 'Быстрые ссылки', exact: true })
  const activeLink = quickNav.getByRole('link', { name: 'Компрессоры' })
  await expect(activeLink).toHaveAttribute('aria-current', 'page')
  const idleLink = quickNav.getByRole('link', { name: 'Покраска' })
  const idleBackground = await idleLink.evaluate((link) => getComputedStyle(link).backgroundColor)
  await idleLink.hover()
  expect(await idleLink.evaluate((link) => getComputedStyle(link).backgroundColor)).not.toBe(idleBackground)
  await activeLink.focus()
  expect(await activeLink.evaluate((link) => getComputedStyle(link).outlineStyle)).not.toBe('none')

  await page.evaluate(() => window.scrollTo(0, 300))
  await expect(page.locator('.desktop-header--compact')).toBeVisible()
  await expect(quickNav).not.toBeVisible()
  await expect(page.locator('.desktop-header--compact .catalog-button')).toBeVisible()
  await expect(page.locator('.desktop-header--compact .search-box')).toBeVisible()
})

for (const width of [1920, 1440, 1280, 1024, 768, 390, 360]) {
  test(`third-level header remains contained at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')

    const pageWidth = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
    expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client)

    if (width >= 768) {
      const nav = page.getByRole('navigation', { name: 'Быстрые ссылки', exact: true })
      await expect(nav).toBeVisible()
      const contained = await nav.evaluate((element) => {
        const outer = element.getBoundingClientRect()
        return [...element.children].every((child) => {
          const box = child.getBoundingClientRect()
          return box.left >= outer.left && box.right <= outer.right
        })
      })
      expect(contained).toBe(true)
    } else {
      await expect(page.getByRole('navigation', { name: 'Быстрые ссылки на мобильных' })).toBeVisible()
      await expect(page.getByRole('navigation', { name: 'Быстрые ссылки', exact: true })).not.toBeVisible()
    }
  })
}
