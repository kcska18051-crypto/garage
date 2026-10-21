import {test,expect} from '@playwright/test'
const base=process.env.GARAGE_LAYOUT_BASE??''
test('long material and promotion headings stay inside mobile container',async({page})=>{
  for(const width of [360,390])for(const route of ['/news/professional-day','/actions/seven-days']){
    await page.setViewportSize({width,height:900})
    await page.goto(base?`${base}${route}`:route,{waitUntil:'domcontentloaded'})
    await expect(page.locator('main')).toBeVisible()
    await page.evaluate(()=>document.fonts.ready)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),`${route} ${width}`).toBeLessThanOrEqual(1)
    await page.screenshot({path:`test-results/layout-long-title-${width}-${route.slice(1).replaceAll('/','-')}.png`})
  }
})
