import { expect, test } from '@playwright/test'

const visibleSearch = (page: import('@playwright/test').Page) => page.getByRole('searchbox', { name: 'Поиск по товарам, брендам и артикулам' }).filter({ visible: true }).first()

async function openClean(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
}

test('desktop search opens history and a four-card managed promotion column', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openClean(page)
  await visibleSearch(page).click()

  await expect(page.getByRole('region', { name: 'История и подсказки поиска' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Специальные предложения' })).toBeVisible()
  await expect(page.getByTestId('search-promo-card')).toHaveCount(4)
  await expect(page.locator('.search-backdrop')).toBeVisible()

  const layout = await page.locator('.search-panel').evaluate((panel) => ({
    columns: getComputedStyle(panel).gridTemplateColumns.split(' ').length,
    insideViewport: panel.getBoundingClientRect().left >= 0 && panel.getBoundingClientRect().right <= innerWidth,
  }))
  expect(layout).toEqual({ columns: 2, insideViewport: true })

  await page.locator('.search-backdrop').click({ position: { x: 5, y: 5 } })
  await expect(page.locator('.search-panel')).toHaveCount(0)
})

test('history clears, stays empty, saves successful searches and avoids duplicates', async ({ page }) => {
  await openClean(page)
  const search = visibleSearch(page)
  await search.click()
  await expect(page.getByRole('button', { name: 'Компрессор', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Очистить историю' }).click()
  await expect(page.getByText('История поиска пока пуста')).toBeVisible()

  await page.reload()
  await visibleSearch(page).click()
  await expect(page.getByText('История поиска пока пуста')).toBeVisible()
  await visibleSearch(page).fill('компрессор')
  await visibleSearch(page).press('Enter')
  await expect(page).toHaveURL(/\/search\?q=/)
  await page.goto('/')
  await visibleSearch(page).click()
  await expect(page.locator('.search-history__query')).toHaveCount(1)
  await expect(page.locator('.search-history__query').first()).toHaveText(/компрессор/i)
})

test('typed search exposes mixed suggestions, keyboard selection and no-results state', async ({ page }) => {
  await openClean(page)
  const search = visibleSearch(page)
  await search.fill('remeza')
  const suggestions = page.getByRole('listbox', { name: 'Подсказки поиска' })
  await expect(suggestions.getByText('Remeza', { exact: true })).toBeVisible()
  await expect(suggestions.getByText(/Бренд/).first()).toBeVisible()
  await search.press('ArrowDown')
  await search.press('Enter')
  await expect(page).toHaveURL(/\/brand\/remeza\/?$/)

  await page.goto('/')
  await visibleSearch(page).fill('нет-такого-запроса')
  await expect(page.getByText('Совпадений не найдено')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Специальные предложения' })).toBeVisible()
  await visibleSearch(page).press('Escape')
  await expect(page.locator('.search-panel')).toHaveCount(0)
})

for (const width of [390, 360]) {
  test(`mobile search is a full-screen ordered panel at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    await visibleSearch(page).click()

    const searchBox = page.locator('.search-box--open')
    await expect(searchBox).toBeVisible()
    const geometry = await searchBox.evaluate((box) => ({
      position: getComputedStyle(box).position,
      width: box.getBoundingClientRect().width,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }))
    expect(geometry.position).toBe('fixed')
    expect(geometry.width).toBe(width)
    expect(geometry.overflow).toBe(false)
    await expect(page.getByRole('region', { name: 'История и подсказки поиска' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Специальные предложения' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Закрыть поиск' }).filter({ visible: true })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Мобильная навигация' })).toBeHidden()
  })
}
