import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const base = (process.env.STYLE_CHECK_BASE || 'http://127.0.0.1:4183/garage/').replace(/\/?$/, '/')
const output = resolve(process.env.STYLE_CHECK_OUTPUT || '../../../../../artifacts/style-check-v3-2026-10-27')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
page.setDefaultTimeout(15000)
const report = { base, widths: [], scenarios: [], textEqual: false }
const widths = [1440, 1366, 1280, 1024, 768, 390, 375]
async function open(path = '') {
  await page.goto(base + path, { waitUntil: 'domcontentloaded' })
  await page.locator('.product-showcase').first().waitFor()
  const cookie = page.locator('.cookie-banner__actions button')
  if (await cookie.isVisible()) await cookie.click()
}
async function geometry() {
  return page.evaluate(async () => {
    scrollTo({ top: 0, behavior: 'instant' })
    // Normalize both pages to the same rail origin. Native scroll snapping can
    // asynchronously move a rail during measurement, without any layout change.
    document.querySelectorAll('.product-grid,.brand-grid,.useful-grid,.service-cards,.promotions__grid,.compact-banner-group,.benefits-strip,.third-level-nav__mobile').forEach(e => {
      e.style.scrollSnapType = 'none'
      e.style.scrollBehavior = 'auto'
      e.scrollTo({ left: 0, behavior: 'instant' })
    })
    await new Promise(r => setTimeout(r, 300))
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    document.querySelectorAll('.product-grid,.brand-grid,.useful-grid,.service-cards,.promotions__grid,.compact-banner-group,.benefits-strip,.third-level-nav__mobile').forEach(e => e.scrollLeft = 0)
    const shell = document.querySelector('.app-shell')
    const excluded = '.hero__slide,.hero__slide *,.category-card__art *,.product-teaser__visual *,.divider-banner__art *,.promotion-card__art *,.service-cards__art *,.about-section__art *,.useful-grid__art span,.final-cta__art *,.cookie-banner,.cookie-banner *,script,style,svg,svg *,img,.sr-only'
    const path = e => {
      const parts = []
      while (e && e !== shell) {
        parts.unshift(e.tagName.toLowerCase() + ':nth-of-type(' + ([...e.parentElement.children].filter(x => x.tagName === e.tagName).indexOf(e) + 1) + ')')
        e = e.parentElement
      }
      return parts.join('>')
    }
    const rect = e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map(x => Math.round(x * 1000) / 1000) }
    const boxes = [...shell.querySelectorAll('*')].filter(e => !e.matches(excluded) && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0).map(e => ({ path: path(e), cls: typeof e.className === 'string' ? e.className : '', rect: rect(e) }))
    return { viewport: innerWidth, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, boxes }
  })
}
try {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 })
    await open()
    const original = await geometry()
    const originalText = await page.locator('main').textContent()
    await open('style-check/?v=geometry-audit')
    const styled = await geometry()
    const styledText = await page.locator('main').textContent()
    const before = new Map(original.boxes.map(x => [x.path, x]))
    const after = new Map(styled.boxes.map(x => [x.path, x]))
    const missing = original.boxes.filter(x => !after.has(x.path))
    const added = styled.boxes.filter(x => !before.has(x.path))
    const differences = styled.boxes.flatMap(x => {
      const b = before.get(x.path)
      if (!b) return []
      const delta = Math.max(...x.rect.map((v, i) => Math.abs(v - b.rect[i])))
      return delta > .25 ? [{ path: x.path, cls: x.cls, before: b.rect, after: x.rect, delta }] : []
    })
    const entry = { width, measured: styled.boxes.length, originalHeight: original.height, styledHeight: styled.height, client: styled.client, scroll: styled.scroll, textEqual: originalText === styledText, missing, added, differences }
    report.widths.push(entry)
    await writeFile(resolve(output, 'geometry-' + width + '.json'), JSON.stringify({ original, styled, result: entry }, null, 2))
    console.log(JSON.stringify({ width, measured: entry.measured, missing: missing.length, added: added.length, differences: differences.length, heightDelta: styled.height - original.height, textEqual: entry.textEqual }))
  }
  report.textEqual = report.widths.every(x => x.textEqual)
  assert(report.widths.every(x => !x.missing.length && !x.added.length && !x.differences.length && x.originalHeight === x.styledHeight && x.scroll === x.client && x.textEqual), 'Geometry or content mismatch; inspect JSON report')

  async function check(name, fn) {
    try { await fn(); report.scenarios.push({ name, passed: true }); console.log('PASS ' + name) }
    catch (error) { report.scenarios.push({ name, passed: false, error: String(error) }); console.error('FAIL ' + name + ': ' + error.message) }
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await check('hero pagination', async () => {
    await open('style-check/')
    const dot = page.locator('.hero__pagination button').nth(1)
    await dot.click()
    await expect(dot).toHaveAttribute('aria-current', 'true')
    await expect(page.locator('.hero__slide').nth(1)).toBeVisible()
  })
  await check('product gallery frames', async () => {
    const card = page.locator('.product-showcase .product-card').first()
    await card.locator('.product-teaser__dots button').nth(1).click()
    await expect(card.locator('[data-testid="product-gallery"]')).toHaveAttribute('data-frame', '1')
  })
  for (const [index, name] of [[0, 'favorites toggle'], [1, 'compare toggle']]) {
    await check(name, async () => {
      const button = page.locator('.product-showcase .product-card').first().locator('.product-teaser__actions button').nth(index)
      const before = await button.getAttribute('aria-pressed')
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', before === 'true' ? 'false' : 'true')
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', before)
    })
  }
  await check('product carousel', async () => {
    await page.locator('.product-showcase').first().getByRole('button', { name: 'Следующие товары:', exact: false }).click()
    await expect.poll(() => page.locator('.product-grid').first().evaluate(e => e.scrollLeft)).toBeGreaterThan(0)
  })
  await check('add to cart and cart navigation', async () => {
    await page.locator('.product-showcase .product-card').first().locator('.product-teaser__cart').click()
    await expect(page.locator('.product-showcase .product-card').first().locator('.product-teaser__cart')).toHaveText('✓')
    await page.goto(base + 'cart')
    await expect(page.getByRole('heading', { name: 'Корзина', exact: true })).toBeVisible()
    await expect(page.getByText('Домкрат подкатной профессиональный', { exact: true }).first()).toBeVisible()
  })
  await check('catalog drawer', async () => {
    await open('style-check/')
    await page.locator('.desktop-header .catalog-button').click()
    await expect(page.locator('#header-catalog-panel')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('#header-catalog-panel')).not.toBeVisible()
  })
  await check('desktop search and results', async () => {
    const input = page.locator('.desktop-header .search-box input')
    await input.fill('компрессор')
    await expect(page.locator('.search-panel')).toBeVisible()
    await input.press('Enter')
    await expect(page).toHaveURL(/\/search\?/)
    await expect(page.locator('main')).toContainText('компрессор')
  })
  await check('favorites route', async () => {
    await open('style-check/')
    await page.locator('.desktop-header .header-action[href$="/favorites"]').click()
    await expect(page).toHaveURL(/\/profile\/favorites/)
  })
  await check('compare route', async () => {
    await open('style-check/')
    await page.locator('.desktop-header .header-action[href$="/compare"]').click()
    await expect(page).toHaveURL(/\/compare/)
  })
  await check('paint matching navigation', async () => {
    await open('style-check/')
    await page.locator('.third-level-nav__desktop .paint-service-link').click()
    await expect(page).toHaveURL(/\/services\/paint-matching/)
    await expect(page.locator('main')).toContainText('Подбор автоэмали')
  })
  await check('profile dialog', async () => {
    await open('style-check/')
    await page.locator('.desktop-header button.header-action[aria-label="Профиль"]').click()
    await expect(page.locator('.auth-dialog')).toBeVisible()
    await page.locator('.auth-dialog button[aria-label="Закрыть"]').click()
  })
  await check('brand carousel', async () => {
    await page.getByRole('button', { name: 'Следующие бренды', exact: true }).click()
    await expect.poll(() => page.locator('.brand-grid').evaluate(e => e.scrollLeft)).toBeGreaterThan(0)
  })
  await check('material carousel', async () => {
    await page.getByRole('button', { name: 'Следующие материалы', exact: true }).click()
    await expect.poll(() => page.locator('.useful-grid').evaluate(e => e.scrollLeft)).toBeGreaterThan(0)
  })
  await check('consultation CTA opens existing form', async () => {
    await open('style-check/')
    await page.locator('.final-cta .button').first().click()
    await expect(page.locator('.contact-dialog')).toBeVisible()
    await page.locator('.contact-dialog .dialog__close').click()
  })
  await check('news/article/review tabs', async () => {
    await page.locator('.section-heading--with-tabs [role="tab"]').nth(1).click()
    await expect(page.locator('.section-heading--with-tabs [role="tab"]').nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('.useful-grid > a')).toHaveCount(5)
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await check('mobile menu', async () => {
    await open('style-check/')
    await page.getByRole('button', { name: 'Открыть меню', exact: true }).click()
    await expect(page.locator('.mobile-menu')).toBeVisible()
    await page.getByRole('button', { name: 'Закрыть меню', exact: true }).click()
  })
  await check('mobile catalog drawer', async () => {
    await page.locator('.mobile-bottom-nav button[aria-label="Каталог"]').click()
    await expect(page.locator('#header-catalog-panel')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('#header-catalog-panel')).not.toBeVisible()
  })
  await check('mobile search', async () => {
    const input = page.locator('.mobile-header .search-box input')
    await input.fill('домкрат')
    await expect(page.locator('.mobile-header .search-box')).toHaveClass(/search-box--open/)
    await input.press('Enter')
    await expect(page).toHaveURL(/\/search\?/)
  })
  await check('mobile paint matching link', async () => {
    await open('style-check/')
    await page.locator('.paint-service-link--mobile').click()
    await expect(page).toHaveURL(/\/services\/paint-matching/)
  })
  await check('delivery navigation', async () => {
    await open('style-check/')
    await page.locator('a[href$="/delivery"]').last().click()
    await expect(page).toHaveURL(/\/delivery/)
  })
  assert(report.scenarios.every(x => x.passed), 'Functional scenarios failed; inspect report')
} finally {
  await writeFile(resolve(output, 'verification-report.json'), JSON.stringify(report, null, 2))
  await browser.close()
}
