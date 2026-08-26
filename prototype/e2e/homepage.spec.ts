import { expect, test } from '@playwright/test'

test('homepage exposes the approved sections and working product actions', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Оборудование и материалы')
  await expect(page.locator('.hero__slide:visible')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Популярные категории' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Новинки' })).toBeVisible()
  await page.getByRole('button', { name: /Добавить в корзину/ }).first().click()
  await expect(page.locator('[aria-label="Корзина: 1"]:visible')).toBeVisible()
  await page.getByRole('button', { name: 'Получить консультацию' }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('all hero slides keep the same outer dimensions', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const hero = page.locator('.hero')
    const next = page.getByRole('button', { name: 'Следующий слайд' })
    await hero.hover()

    const baseline = await hero.boundingBox()
    expect(baseline).not.toBeNull()

    for (let index = 1; index < 3; index += 1) {
      await next.click()
      const current = await hero.boundingBox()
      expect(current).not.toBeNull()
      expect(Math.abs(current!.width - baseline!.width)).toBeLessThan(0.5)
      expect(Math.abs(current!.height - baseline!.height)).toBeLessThan(0.5)
    }
  }
})
