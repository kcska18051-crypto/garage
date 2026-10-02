import { expect, test } from '@playwright/test'

test('homepage materials open a review detail and start video on demand', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('tab', { name: 'Обзоры' }).click()
  await page.getByRole('link', { name: /Обзор решений для оснащения рабочего поста/ }).click()
  await expect(page).toHaveURL(/\/reviews\/workshop-solutions$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Обзор решений для оснащения рабочего поста' })).toBeVisible()
  await expect(page.getByText('Демонстрационное видео воспроизводится')).toBeHidden()
  await page.getByRole('button', { name: 'Воспроизвести видео: Оснащение рабочего поста' }).click()
  await expect(page.getByText('Демонстрационное видео воспроизводится')).toBeVisible()
})

test('footer links open independent material lists', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  await footer.getByRole('link', { name: 'Статьи' }).click()
  await expect(page).toHaveURL(/\/articles$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Статьи' })).toBeVisible()
})

test('article contents and section navigation stay separate', async ({ page }) => {
  await page.goto('/articles/work-area')
  await expect(page.getByRole('navigation', { name: 'Содержание статьи' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Разделы материалов' })).toBeVisible()
  await page.getByRole('link', { name: 'Определите задачи зоны' }).click()
  await expect(page).toHaveURL(/#tasks$/)
})

test('detail without video does not reserve a media block', async ({ page }) => {
  await page.goto('/news/service-solutions')
  await expect(page.locator('.material-video')).toHaveCount(0)
})

for (const width of [1920, 1440, 768, 390, 360]) {
  test(`materials lists and details have no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/news', '/articles/work-area', '/reviews/workshop-solutions']) {
      await page.goto(route)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true)
    }
  })
}
