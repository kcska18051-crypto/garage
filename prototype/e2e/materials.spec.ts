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

test('wide and desktop lists use the approved card density', async ({ page }) => {
  for (const [width, columns] of [[1920, 4], [1440, 3], [768, 2]] as const) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/news')
    const cards = page.getByTestId('material-card')
    const tops = await cards.evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)))
    expect(tops.filter((top) => top === tops[0])).toHaveLength(columns)
  }
})

test('balances wide detail composition and keeps video variants responsive', async ({ page }) => {
  for (const width of [1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/reviews/workshop-solutions')
    const geometry = await page.evaluate(() => {
      const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect()
      const main = box('.materials-main')
      const heading = box('.material-detail__heading')
      const cover = box('.material-detail__cover')
      const videos = box('.material-videos')
      const text = box('.material-intro')
      return {
        widths: [heading.width, cover.width, videos.width],
        mainWidth: main.width,
        textLeftGap: text.left - main.left,
        textRightGap: main.right - text.right,
      }
    })
    for (const mediaWidth of geometry.widths) expect(Math.abs(mediaWidth - geometry.mainWidth)).toBeLessThanOrEqual(2)
    expect(Math.abs(geometry.textLeftGap - geometry.textRightGap)).toBeLessThanOrEqual(2)
  }

  await page.goto('/reviews/compressor-types')
  const videos = page.locator('.material-video')
  await expect(videos).toHaveCount(2)
  const desktopBoxes = await videos.evaluateAll((items) => items.map((item) => item.getBoundingClientRect()))
  expect(Math.abs(desktopBoxes[0].top - desktopBoxes[1].top)).toBeLessThan(2)

  await page.setViewportSize({ width: 390, height: 844 })
  const mobileBoxes = await videos.evaluateAll((items) => items.map((item) => item.getBoundingClientRect()))
  expect(mobileBoxes[1].top).toBeGreaterThan(mobileBoxes[0].bottom)
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
