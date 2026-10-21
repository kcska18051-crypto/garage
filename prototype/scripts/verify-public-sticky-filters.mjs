import {chromium,expect} from '@playwright/test'
import assert from 'node:assert/strict'

const base='https://kcska18051-crypto.github.io/garage'
const path='/catalog/compressor-equipment/screw-compressors/receiver/'
assert.equal((await fetch(base+path)).status,200)
const browser=await chromium.launch()
try {
  for(const width of [1024,1440,1920,2560,360,390]) {
    const context=await browser.newContext({viewport:{width,height:900}})
    try {
      const page=await context.newPage();await page.goto(base+path)
      const sidebar=page.locator('.catalog-listing__sidebar')
      const count=await page.locator('.catalog-listing__toolbar>strong').innerText()
      if(width>=1024) {
        await expect(sidebar).toHaveCSS('position','sticky')
        const layout=page.locator('.catalog-listing__layout')
        await page.evaluate(y=>scrollTo(0,y+200),await layout.evaluate(el=>el.getBoundingClientRect().top+scrollY))
        const header=page.locator('.desktop-header--compact')
        await expect.poll(async()=>Math.round((await sidebar.boundingBox()).y-(await header.boundingBox()).height)).toBe(12)
        for(const detail of await sidebar.locator('details').all()) if(await detail.getAttribute('open')===null) await detail.locator('summary').click()
        const scroll=sidebar.getByRole('region',{name:'Параметры фильтра'})
        assert(await scroll.evaluate(el=>el.scrollHeight>el.clientHeight))
        await scroll.evaluate(el=>el.scrollTop=0)
        const pageY=await page.evaluate(()=>scrollY)
        await scroll.hover();await page.mouse.wheel(0,5000)
        await expect.poll(()=>scroll.evaluate(el=>el.scrollTop)).toBeGreaterThan(100)
        assert(Math.abs(await page.evaluate(()=>scrollY)-pageY)<2)
        if(width===1440) await page.screenshot({path:'artifacts/sticky-filters-public-1440.png'})
        await sidebar.getByRole('checkbox',{name:'Беларусь',exact:true}).click()
        await expect(sidebar.getByRole('checkbox',{name:'Беларусь',exact:true})).toBeChecked()
        await expect(page.locator('.catalog-listing__toolbar>strong')).not.toHaveText(count)
        await sidebar.getByRole('button',{name:'Сбросить фильтры'}).click()
        await expect(page.locator('.catalog-listing__toolbar>strong')).toHaveText(count)
        await header.locator('.main-header-row').evaluate(el=>el.style.minHeight='110px')
        await expect.poll(async()=>Math.round((await sidebar.boundingBox()).y-(await header.boundingBox()).height)).toBe(12)
        await header.locator('.main-header-row').evaluate(el=>el.style.removeProperty('min-height'))
        await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight))
        const side=await sidebar.boundingBox(),end=await layout.boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
        assert(side.y+side.height<=end.y+end.height+1)
        assert(side.y+side.height<=footer.y)
        await page.evaluate(()=>scrollTo(0,119));await expect(page.locator('.desktop-header--compact')).toHaveCount(0)
        const before=await layout.evaluate(el=>el.getBoundingClientRect().top+scrollY)
        await page.evaluate(()=>scrollTo(0,121));await expect(page.locator('.desktop-header--compact')).toBeVisible()
        assert(Math.abs(await layout.evaluate(el=>el.getBoundingClientRect().top+scrollY)-before)<2)
      } else {
        await expect(sidebar).toBeHidden()
        await page.getByRole('button',{name:'Фильтры',exact:true}).click()
        const drawer=page.getByRole('dialog',{name:'Фильтры каталога'})
        await drawer.getByRole('checkbox',{name:'Remeza',exact:true}).check()
        await expect(page.locator('.catalog-listing__toolbar>strong')).toHaveText(count)
        await drawer.getByRole('button',{name:/Показать \d+ товаров/}).click()
        await expect(drawer).toBeHidden()
        await expect(page.locator('.catalog-listing__toolbar>strong')).not.toHaveText(count)
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
      console.log(`PASS sticky receiver ${width}: ${width>=1024?'sticky/header/internal scroll/filter/reset/footer/full-compact':'mobile draft/apply'}; no overflow`)
    } finally {await context.close()}
  }
} finally {await browser.close()}
