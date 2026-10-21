import {chromium,expect} from '@playwright/test'
import {mkdir} from 'node:fs/promises'

const url='https://kcska18051-crypto.github.io/garage/catalog/compressor-equipment/screw-compressors/receiver/'
const version=process.argv[2]??'f914f38'
const browser=await chromium.launch({headless:true})
const samples=[]
try {
  await mkdir('../docs/project-history/screenshots/sticky-query-fix',{recursive:true})
  for(const width of [1024,1440,1920,2560]) {
    const context=await browser.newContext({viewport:{width,height:900}})
    const page=await context.newPage()
    await page.goto(`${url}?v=${version}&utm_source=review`)
    const sidebar=page.locator('.catalog-listing__sidebar')
    await expect(page.locator('.catalog-results .catalog-product-card').first()).toBeVisible()
    const count=await page.locator('.catalog-listing__toolbar>strong').innerText()
    for(const y of [450,750,1100]) {
      await page.evaluate(y=>scrollTo(0,y),y)
      await expect.poll(()=>sidebar.evaluate(el=>{
        const r=el.getBoundingClientRect(),l=el.parentElement.getBoundingClientRect()
        return Math.abs(r.top-Math.min(Math.max(l.top,parseFloat(getComputedStyle(el).top)),l.bottom-r.height))
      })).toBeLessThan(2)
      samples.push(await sidebar.evaluate(el=>({width:innerWidth,scroll:scrollY,top:el.getBoundingClientRect().top,cssTop:getComputedStyle(el).top,layoutHeight:el.parentElement.getBoundingClientRect().height})))
    }
    await page.evaluate(()=>scrollTo(0,750))
    expect((await sidebar.boundingBox()).y).toBeGreaterThan(0)
    if(width===1440) await page.screenshot({path:'../docs/project-history/screenshots/sticky-query-fix/receiver-v-1440.png'})
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
    const side=await sidebar.boundingBox(),layout=await sidebar.locator('..').boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
    expect(side.y+side.height).toBeLessThanOrEqual(layout.y+layout.height+1)
    expect(side.y+side.height).toBeLessThanOrEqual(footer.y)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    console.log(`PASS ${width} products/actual scroll/inner wheel/lower checkbox/reset/footer/overflow`)
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
