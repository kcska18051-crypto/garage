import { expect, test } from '@playwright/test'

test('actions are first in quick navigation and use a neutral accent', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/actions')
  const nav = page.getByRole('navigation', { name: 'Быстрые ссылки', exact: true })
  const first = nav.getByRole('link').first()
  await expect(first).toHaveText('Акции')
  await expect(first).toHaveClass(/third-level-nav__link--accent/)
  await expect(first).toHaveAttribute('aria-current', 'page')
  expect(await first.evaluate((link) => getComputedStyle(link).borderStyle)).toBe('solid')
})

test('active, hybrid detail and completed routes form one action journey', async ({ page }) => {
  await page.goto('/actions')
  await expect(page.getByTestId('active-action-card')).toHaveCount(4)
  await page.getByTestId('active-action-card').first().click()
  await expect(page).toHaveURL(/\/actions\/professional-workshop$/)
  await expect(page.getByRole('heading', { name: 'Товары по акции' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Все товары' })).toHaveAttribute('aria-pressed', 'true')
  const initialCount = await page.locator('[data-testid="catalog-results"] article').count()
  await page.getByRole('button', { name: 'Инструмент' }).click()
  expect(await page.locator('[data-testid="catalog-results"] article').count()).toBeLessThan(initialCount)
  await page.goto('/actions/completed')
  await expect(page.getByTestId('completed-action-card')).toHaveCount(2)
  await expect(page.getByText(/Акция завершена/)).toHaveCount(2)
})

test('action detail follows the approved content hierarchy without duplicated description', async ({ page }) => {
  await page.goto('/actions/professional-workshop')
  const main = page.locator('main')
  const title = main.getByRole('heading', { level: 1 })
  const hero = main.locator('.action-hero')
  const features = main.locator('.action-feature-grid')
  const content = main.locator('.action-content')
  const status = main.locator('.action-detail-status')

  await expect(status).toBeVisible()
  await expect(main.getByText('Описание акции', { exact: true })).toHaveCount(0)
  await expect(main.getByText('Условия участия', { exact: true })).toHaveCount(0)
  expect(await title.evaluate((node, other) => Boolean(node.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING), await hero.elementHandle())).toBeTruthy()
  expect(await hero.evaluate((node, other) => Boolean(node.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING), await features.elementHandle())).toBeTruthy()
  expect(await features.evaluate((node, other) => Boolean(node.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING), await content.elementHandle())).toBeTruthy()
})

for (const width of [1440, 1024, 390]) {
  test(`action pages have no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/actions', '/actions/professional-workshop', '/actions/completed']) {
      await page.goto(path)
      const sizes = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
      expect(sizes.scroll).toBeLessThanOrEqual(sizes.client)
    }
  })
}
