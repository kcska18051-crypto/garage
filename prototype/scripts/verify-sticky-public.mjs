import {chromium,expect} from '@playwright/test'
import {mkdir} from 'node:fs/promises'

const url='https://kcska18051-crypto.github.io/garage/catalog/compressor-equipment/screw-compressors/receiver/'
const version=process.argv[2]??'f914f38'
const browser=await chromium.launch({headless:true})
const samples=[]
try {
  await mkdir('../docs/project-history/screenshots/filter-page-boundary/public',{recursive:true})
  for(const width of [1024,1440,1920,2560]) {
    const context=await browser.newContext({viewport:{width,height:900}})
    const page=await context.newPage()
    await page.goto(`${url}?v=${version}&utm_source=review`)
    const sidebar=page.locator('.catalog-listing__sidebar')
    await expect(page.locator('.catalog-results .catalog-product-card').first()).toBeVisible()
    const count=await page.locator('.catalog-listing__toolbar>strong').innerText()
    for(const y of [650,900,1200]) {
      await page.evaluate(y=>scrollTo(0,y),y)
      await expect.poll(()=>sidebar.evaluate(el=>{
        return Math.abs(el.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height'))-12)
      })).toBeLessThan(2)
      samples.push(await sidebar.evaluate(el=>({width:innerWidth,scroll:scrollY,top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,height:el.getBoundingClientRect().height,gridBottom:el.closest('.catalog-listing__layout').getBoundingClientRect().bottom,mainBottom:el.closest('main').getBoundingClientRect().bottom,footerTop:document.querySelector('footer').getBoundingClientRect().top})))
      await page.screenshot({path:`../docs/project-history/screenshots/filter-page-boundary/public/${width}-${y}.png`})
    }
    const tail=await page.locator('.catalog-seo-tail').boundingBox(),column=await sidebar.boundingBox()
    expect(tail.x).toBeGreaterThanOrEqual(column.x+column.width+16)
    const footerY=await page.getByRole('contentinfo').evaluate(el=>el.getBoundingClientRect().top+scrollY)
    await page.evaluate(y=>scrollTo(0,y-860),footerY)
    await expect.poll(()=>sidebar.evaluate(el=>Math.abs(el.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height'))-12))).toBeLessThan(2)
    samples.push(await sidebar.evaluate(el=>({width:innerWidth,sample:'before-footer',scroll:scrollY,top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,height:el.getBoundingClientRect().height,mainBottom:el.closest('main').getBoundingClientRect().bottom,footerTop:document.querySelector('footer').getBoundingClientRect().top})))
    await page.screenshot({path:`../docs/project-history/screenshots/filter-page-boundary/public/${width}-before-footer.png`})
    await page.evaluate(()=>scrollTo(0,900))
    const scroll=sidebar.getByRole('region',{name:'Параметры фильтра'})
    for(const details of await sidebar.locator('details').all()) if(await details.getAttribute('open')===null) await details.locator('summary').click()
    await scroll.hover();await page.mouse.wheel(0,5000)
    await expect.poll(()=>scroll.evaluate(el=>el.scrollTop)).toBeGreaterThan(100)
    const country=sidebar.getByRole('checkbox',{name:'Беларусь',exact:true})
    await country.click()
    await expect(country).toBeChecked()
    await expect(page.locator('.catalog-listing__toolbar>strong')).not.toHaveText(count)
    await sidebar.getByRole('button',{name:'Сбросить фильтры',exact:true}).click()
    await expect(page.locator('.catalog-listing__toolbar>strong')).toHaveText(count)
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight))
    await expect.poll(()=>sidebar.evaluate(el=>el.getBoundingClientRect().bottom-el.closest('main').getBoundingClientRect().bottom)).toBeLessThanOrEqual(0)
    const side=await sidebar.boundingBox(),layout=await page.locator('main').boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
    expect(side.y+side.height).toBeLessThanOrEqual(layout.y+layout.height+1)
    expect(side.y+side.height).toBeLessThanOrEqual(footer.y)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    console.log(`PASS ${width} products/actual scroll/inner wheel/lower checkbox/reset/footer/overflow`)
    for(const query of ['brand=remeza','price-from=999999999']){
      await page.goto(`${url}?${query}&v=${version}`)
      if(query.startsWith('price')){await expect(page.getByRole('heading',{name:'Ничего не найдено'})).toBeVisible();await expect(page.locator('.catalog-results')).toHaveCount(0)}
      await page.evaluate(()=>scrollTo(0,1200))
      await expect.poll(()=>sidebar.evaluate(el=>Math.abs(el.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height'))-12))).toBeLessThan(2)
      const reset=sidebar.getByRole('button',{name:'Сбросить фильтры',exact:true})
      const resetBox=await reset.boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
      expect(resetBox.y).toBeGreaterThan(0);expect(resetBox.y+resetBox.height).toBeLessThanOrEqual(footer.y)
      for(const details of await sidebar.locator('details').all())if(await details.getAttribute('open')===null)await details.locator('summary').click()
      const inner=sidebar.getByRole('region',{name:'Параметры фильтра'})
      await inner.hover();await page.mouse.wheel(0,5000)
      await expect.poll(()=>inner.evaluate(el=>el.scrollTop)).toBeGreaterThan(100)
      await reset.click()
      await expect(page.locator('.catalog-listing__toolbar>strong')).not.toHaveText('Найдено 0 товаров')
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    }
    console.log(`PASS ${width} short/empty filter remains usable, no fake product rows`)
    await context.close()
  }
  for(const width of [360,390]) {
    const context=await browser.newContext({viewport:{width,height:900}})
    const page=await context.newPage()
    await page.goto(`${url}?v=${version}`)
    await expect(page.locator('.catalog-results .catalog-product-card').first()).toBeVisible()
    const count=await page.locator('.catalog-listing__toolbar>strong').innerText()
    await page.getByRole('button',{name:'Фильтры',exact:true}).click()
    const drawer=page.getByRole('dialog',{name:'Фильтры каталога'})
    const brand=drawer.getByRole('checkbox',{name:'Remeza',exact:true})
    await brand.click();await expect(brand).toBeChecked()
    await expect(page.locator('.catalog-listing__toolbar>strong')).toHaveText(count)
    await drawer.getByRole('button',{name:/Показать \d+ товаров/}).click()
    await expect(drawer).toBeHidden()
    await expect(page.locator('.catalog-listing__toolbar>strong')).not.toHaveText(count)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    console.log(`PASS ${width} versioned URL/mobile draft/apply/overflow`)
    await context.close()
  }
  console.log(JSON.stringify(samples,null,2))
} finally {await browser.close();console.log('Own browser closed')}
