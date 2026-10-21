import { chromium, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
const base = 'https://kcska18051-crypto.github.io/garage'
const version = process.argv[2]
const asset = process.argv[3]
if (!version || !asset) throw Error('Expected commit and published JS asset')
const out = '../docs/project-history/screenshots/catalog-menu/public'
const browser = await chromium.launch({ headless: true })
try {
  await mkdir(out, { recursive: true })
  for (const width of [2560, 1920, 1440, 1024, 390, 360]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 768 })
    try {
      const page = await context.newPage(), errors = []
      page.on('pageerror', error => errors.push(error.message))
      expect((await page.goto(`${base}/?v=${version}`)).status()).toBe(200)
      expect(await page.locator(`script[src*="${asset}"]`).count()).toBe(1)
      const opener = width < 768 ? page.getByRole('navigation', { name: 'Мобильная навигация' }).getByRole('button', { name: 'Каталог', exact: true }) : page.locator('.catalog-button')
      const panel = page.getByRole('dialog', { name: 'Каталог товаров' })
      for (const y of width < 768 ? [650] : [0, 650]) {
        await page.evaluate(y => scrollTo(0, y), y)
        const before = await page.evaluate(() => scrollY)
        await opener.click(); await expect(panel).toBeVisible()
        if (width < 768) {
          await panel.getByRole('button', { name: 'Компрессоры', exact: true }).tap()
          await panel.getByRole('button', { name: 'Винтовые компрессоры', exact: true }).tap()
        }
        await expect(panel.getByRole('link', { name: 'Винтовые компрессоры на ресивере', exact: true })).toHaveAttribute('href', '/garage/catalog/compressor-equipment/screw-compressors/receiver')
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await page.screenshot({ path: `${out}/${width}-${y}.png` })
        await page.keyboard.press('Escape'); await expect(panel).toHaveCount(0)
        await expect(opener).toBeFocused(); expect(await page.evaluate(() => scrollY)).toBe(before)
      }
      await opener.click()
      if (width < 768) {
        await panel.getByRole('button', { name: 'Компрессоры', exact: true }).tap()
        await panel.getByRole('button', { name: 'Винтовые компрессоры', exact: true }).tap()
      } else {
        for (const name of ['Компрессоры','Подъёмное оборудование','Кузовной ремонт','Покраска','Инструмент','Оснащение автосервиса']) {
          await panel.getByRole('button', { name, exact: true }).click()
          const href = await panel.getByRole('link', { name: 'Все товары раздела' }).getAttribute('href')
          expect((await page.request.get(new URL(href, base).href)).status()).toBe(200)
        }
        await panel.getByRole('button', { name: 'Компрессоры', exact: true }).click()
      }
      await panel.getByRole('link', { name: 'Винтовые компрессоры на ресивере', exact: true }).click()
      await expect(page).toHaveURL(/\/catalog\/compressor-equipment\/screw-compressors\/receiver$/)
      await expect(page.locator('main h1')).toHaveText('Винтовые компрессоры')
      await expect(panel).toHaveCount(0)
      expect((await page.reload()).status()).toBe(200)
      if (width >= 768) {
        await page.evaluate(() => scrollTo(0, 1200))
        await expect.poll(() => page.locator('.catalog-listing__sidebar').evaluate(el => Math.abs(el.getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height')) - 12))).toBeLessThan(2)
      }
      expect(errors).toEqual([])
      console.log(`PASS public menu ${width}: bounds / links / close / focus / scroll / route / reload / filter`)
    } finally { await context.close() }
  }
} finally { await browser.close() }
