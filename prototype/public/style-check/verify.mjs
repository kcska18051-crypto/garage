import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const here = path.dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ reducedMotion: 'reduce' })
await context.addInitScript(() => localStorage.setItem('garage-cookie-preference', JSON.stringify({ version: 2, choice: 'necessary' })))
const page = await context.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
await mkdir(path.join(here, 'review'), { recursive: true })
const report = { widths: [], hero: [], alignment: [], images: [], interactions: [], errors }
try {
  await page.goto('http://127.0.0.1:4175/style-check/', { waitUntil: 'networkidle' })
  await page.locator('.sc-product').first().waitFor()
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r=>setTimeout(r,60)) } })
  await page.waitForFunction(() => [...document.images].every(image => image.complete))
  await page.evaluate(() => scrollTo(0,0))
  for (const width of [1920, 1440, 1366, 1280, 1024, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.evaluate(() => window.scrollTo(0, 0))
    const geometry = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, background: getComputedStyle(document.body).backgroundColor, cards: document.querySelectorAll('.sc-product').length, categories: document.querySelectorAll('.sc-category').length, overflow: [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed' && !el.closest('.sc-products,.sc-brands,.sc-promotions,.useful-grid,.third-level-nav__mobile,.third-level-nav__measure') }).slice(0,5).map(el=>el.className) }))
    report.widths.push(geometry)
    assert.equal(geometry.scrollWidth, width, `Page overflow at ${width}`)
    assert.equal(geometry.background, 'rgb(255, 255, 255)')
    assert.equal(geometry.cards, 20)
    assert.equal(geometry.categories, 6)
    const alignment = await page.locator('.sc-products').evaluateAll(rails => rails.map(rail => {
      const cards = [...rail.querySelectorAll('.sc-product')]
      const tops = selector => cards.map(card => Math.round(card.querySelector(selector).getBoundingClientRect().top))
      const spread = values => Math.max(...values) - Math.min(...values)
      return { priceSpread: spread(tops('.sc-product-price strong')), buttonSpread: spread(tops('.sc-buy')), buttonHeights: cards.map(card => Math.round(card.querySelector('.sc-buy').getBoundingClientRect().height)), contained: cards.every(card => getComputedStyle(card.querySelector('.sc-product-media img')).objectFit === 'contain') }
    }))
    report.alignment.push({ width, rows: alignment })
    for (const row of alignment) {
      assert.ok(row.priceSpread <= 1, `Prices not aligned at ${width}`)
      assert.ok(row.buttonSpread <= 1, `Purchase actions not aligned at ${width}`)
      assert.ok(row.buttonHeights.every(height => height === 44))
      assert.ok(row.contained)
    }
    const slideHeights = []
    const anchors = []
    for (const id of ['paint', 'intro', 'service']) {
      for (let attempt = 0; await page.locator('.sc-hero-panel').getAttribute('data-slide') !== id && attempt < 3; attempt++) await page.getByRole('button', { name: 'Следующий слайд', exact: true }).click()
      await page.waitForFunction(() => { const img = document.querySelector('.sc-hero-image'); return img.complete && img.naturalWidth > 0 })
      const hero = await page.locator('.sc-hero-panel').evaluate(panel => {
        const box = element => { const r = element.getBoundingClientRect(); return { top:r.top, bottom:r.bottom, left:r.left, right:r.right } }
        const copy = panel.querySelector('.sc-hero-copy')
        const cta = panel.querySelector('.sc-hero-cta')
        const media = panel.querySelector('.sc-hero-media')
        const controls = panel.querySelector('.sc-hero-controls')
        const heading = panel.querySelector('h2'), description = panel.querySelector('.sc-hero-description')
        return { id: panel.dataset.slide, copy:box(copy), cta:box(cta), heading:box(heading), description:box(description), textFits: heading.scrollHeight <= heading.clientHeight + 1 && description.scrollHeight <= description.clientHeight + 1, media:box(media), controls:box(controls), panel:box(panel), clip:getComputedStyle(panel,'::after').clipPath, ctaBackground:getComputedStyle(cta).backgroundColor }
      })
      report.hero.push({width,...hero})
      slideHeights.push(hero.panel.bottom - hero.panel.top)
      anchors.push([hero.heading.top - hero.panel.top, hero.description.top - hero.panel.top, hero.cta.top - hero.panel.top])
      assert.ok(hero.textFits, `Hero text overflows allocated rows at ${width}/${id}`)
      assert.equal(hero.clip, 'none')
      assert.equal(hero.ctaBackground, 'rgb(255, 204, 0)')
      assert.ok(hero.cta.bottom <= hero.copy.bottom && hero.cta.right <= hero.copy.right)
      assert.ok(hero.controls.top >= hero.copy.bottom - 1, `Hero controls overlap copy at ${width}/${id}`)
      if (width >= 768) assert.ok(hero.media.left >= hero.copy.right - 1)
      else assert.ok(hero.media.top >= hero.copy.bottom - 1)
      if ([1440, 375].includes(width)) await page.locator('.sc-hero-panel').screenshot({path:path.join(here,`review/hero-${id}-${width}.png`)})
    }
    assert.ok(Math.max(...slideHeights) - Math.min(...slideHeights) <= 1, `Hero height jumps at ${width}`)
    assert.ok(anchors.every(values => values.every((value,index) => Math.abs(value - anchors[0][index]) < 1)), `Hero text/CTA anchors shift at ${width}`)
    assert.equal(await page.locator('.sc-hero .sc-kicker').count(), 0)
    assert.equal(await page.locator('.sc-hero-controls button').count(), 2)
    for (let attempt = 0; await page.locator('.sc-hero-panel').getAttribute('data-slide') !== 'paint' && attempt < 3; attempt++) await page.getByRole('button', { name: 'Следующий слайд', exact: true }).click()
    await page.evaluate(() => scrollTo(0,0))
    if ([1440, 768, 390, 375].includes(width)) {
      await page.screenshot({ path: path.join(here, `review/${width}.png`), fullPage: true })
      await page.screenshot({ path: path.join(here, `review/${width}-viewport.png`) })
    }
  }
  for (const width of [1440, 1024, 768]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.evaluate(() => scrollTo(0,800))
    await page.locator('.desktop-header--compact').waitFor()
    await page.locator('.desktop-header--compact .paint-service-link').waitFor()
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, `Compact header overflow at ${width}`)
  }
  report.interactions.push('Compact header retains paint-matching access without overflow')
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 900) { scrollTo(0, y); await new Promise(r=>setTimeout(r,70)) } })
  await page.waitForTimeout(2000)
  report.images = await page.locator('img').evaluateAll(images => images.filter(img=>!img.complete || !img.naturalWidth).map(img=>({src:img.src,alt:img.alt})))
  assert.equal(report.images.length, 0, 'Broken images')
  const darkEquipment = await page.locator('.sc-promo--equipment').evaluate(promo => {
    const previous = promo.dataset.background
    promo.dataset.background = 'graphite'
    const blend = getComputedStyle(promo.querySelector('img')).mixBlendMode
    promo.dataset.background = previous
    return blend
  })
  assert.equal(darkEquipment, 'normal', 'Equipment must stay visible on a configured graphite surface')
  report.interactions.push('Configured graphite equipment promotion preserves normal image blending')
  await page.evaluate(() => scrollTo(0,0))
  await page.locator('.sc-product').first().getByRole('button', { name: /^Добавить в корзину:/ }).click()
  await page.locator('.sc-product').first().getByRole('link', { name: 'В корзине' }).waitFor()
  report.interactions.push('Cart state updates and full cart action appears')
  const favorite = page.locator('.sc-product').first().getByRole('button', { name: /избранно/ })
  const before = await favorite.getAttribute('aria-pressed')
  await favorite.click()
  assert.notEqual(await favorite.getAttribute('aria-pressed'), before)
  report.interactions.push('Favorite toggles')
  const compare = page.locator('.sc-product').first().getByRole('button', { name: /сравнен/ })
  await compare.click(); assert.equal(await compare.getAttribute('aria-pressed'), 'true')
  report.interactions.push('Comparison toggles')
  await page.getByRole('button', { name: 'Следующий слайд', exact: true }).click()
  assert.equal(await page.locator('.sc-hero h2').innerText(), 'Оборудование для автосервиса')
  report.interactions.push('Hero navigation works')
  await page.getByRole('button', { name: 'Получить консультацию', exact: true }).click()
  await page.getByRole('dialog').waitFor()
  await page.getByRole('button', { name: 'Закрыть форму' }).click()
  report.interactions.push('Consultation dialog opens and closes')
  await page.evaluate(() => scrollTo(0,0))
  await page.locator('.catalog-button').click()
  await page.locator('#header-catalog-panel').waitFor()
  await page.keyboard.press('Escape')
  await page.locator('#header-catalog-panel').waitFor({ state: 'hidden' })
  await page.waitForTimeout(100)
  report.interactions.push('Catalog opens and Escape closes it')
  const search = page.locator('.desktop-header input').first()
  await search.fill('компрессор')
  await page.locator('.search-panel').waitFor()
  await search.press('Escape')
  await page.locator('.search-panel').waitFor({ state: 'hidden' })
  report.interactions.push('Existing search opens suggestions')
  await page.locator('.sc-product-name').first().click()
  await page.waitForURL(/\/product\/product-1/)
  report.interactions.push('Product route opens')
  await page.goBack()
  await page.setViewportSize({ width: 375, height: 812 })
  await page.getByRole('button', { name: 'Открыть меню', exact: true }).click()
  await page.locator('.mobile-menu').waitFor()
  await page.keyboard.press('Escape')
  await page.locator('.sc-bottom-nav').getByRole('button', { name: 'Каталог', exact: true }).click()
  await page.locator('#header-catalog-panel').waitFor()
  await page.keyboard.press('Escape')
  report.interactions.push('Mobile menu and catalog work')
  assert.equal(errors.length, 0, JSON.stringify(errors))
} finally {
  await writeFile(path.join(here, 'review/report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ widths: report.widths, slidesChecked: report.hero.length, alignedRows: report.alignment.length * 4, images: report.images, interactions: report.interactions, errors }, null, 2))
  await browser.close()
}
