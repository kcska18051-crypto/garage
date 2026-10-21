import {test,expect} from '@playwright/test'
const receiver='/catalog/compressor-equipment/screw-compressors/receiver/'
for(const width of [1024,1440,1920,2560])test(`filter stays through category text until footer at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(receiver)
  const sidebar=page.locator('.catalog-listing__sidebar')
  for(const y of [650,900,1200]){
    await page.evaluate(y=>scrollTo(0,y),y)
    await expect.poll(async()=>Math.abs((await sidebar.boundingBox())!.y-((await page.locator('.desktop-header--compact').boundingBox())!.height+12))).toBeLessThan(2)
    const box=await sidebar.boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
    expect(box!.y+box!.height).toBeLessThanOrEqual(footer!.y)
    await page.screenshot({path:`test-results/filter-${width}-${y}.png`})
  }
  const tail=await page.locator('.catalog-seo-tail').boundingBox(),side=await sidebar.boundingBox()
  expect(tail!.x).toBeGreaterThanOrEqual(side!.x+side!.width+16)
  const footerY=await page.getByRole('contentinfo').evaluate(el=>el.getBoundingClientRect().top+scrollY)
  await page.evaluate(y=>scrollTo(0,y-860),footerY)
  await expect.poll(()=>sidebar.evaluate(el=>Math.abs(el.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height'))-12))).toBeLessThan(2)
  const end=await sidebar.boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
  expect(end!.y+end!.height).toBeLessThanOrEqual(footer!.y-10)
  await page.screenshot({path:`test-results/filter-${width}-before-footer.png`})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
for(const width of [1024,1440,1920,2560])test(`short and empty listing retains usable filter without fake rows at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:900})
  for(const query of ['brand=remeza','price-from=999999999']){
    await page.goto(receiver+'?'+query)
    const sidebar=page.locator('.catalog-listing__sidebar')
    if(query.startsWith('price')){
      await expect(page.getByRole('heading',{name:'Ничего не найдено'})).toBeVisible()
      await expect(page.locator('.catalog-results')).toHaveCount(0)
    }
    await page.evaluate(()=>scrollTo(0,1200))
    await expect.poll(()=>sidebar.evaluate(el=>Math.abs(el.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height'))-12))).toBeLessThan(2)
    const box=await sidebar.boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
    expect(box!.y+box!.height).toBeLessThanOrEqual(footer!.y)
    const reset=sidebar.getByRole('button',{name:'Сбросить фильтры',exact:true})
    const resetBox=await reset.boundingBox()
    expect(resetBox!.y).toBeGreaterThan(0);expect(resetBox!.y+resetBox!.height).toBeLessThan(900)
    for(const details of await sidebar.locator('details').all())if(await details.getAttribute('open')===null)await details.locator('summary').click()
    const scroll=sidebar.getByRole('region',{name:'Параметры фильтра'})
    await scroll.hover();await page.mouse.wheel(0,5000)
    await expect.poll(()=>scroll.evaluate(el=>el.scrollTop)).toBeGreaterThan(100)
    await expect(sidebar.getByRole('checkbox',{name:'Беларусь',exact:true})).toBeVisible()
    await reset.click()
    await expect(page.locator('.catalog-listing__toolbar>strong')).not.toHaveText('Найдено 0 товаров')
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
})
test('brand continuation has room for the same page-bounded filter',async({page})=>{
  for(const width of [1024,1440,1920,2560]){
    await page.setViewportSize({width,height:900});await page.goto('/brand/remeza/')
    const sidebar=page.locator('.catalog-listing__sidebar')
    const y=await page.locator('.brand-about').evaluate(el=>el.getBoundingClientRect().top+scrollY)
    await page.evaluate(y=>scrollTo(0,y),y)
    await expect.poll(()=>sidebar.evaluate(el=>Math.abs(el.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height'))-12))).toBeLessThan(2)
    const side=await sidebar.boundingBox(),about=await page.locator('.brand-about').boundingBox()
    expect(about!.x).toBeGreaterThanOrEqual(side!.x+side!.width+16)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
})
