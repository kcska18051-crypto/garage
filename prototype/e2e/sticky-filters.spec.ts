import {expect,test} from '@playwright/test'

const receiver='/catalog/compressor-equipment/screw-compressors/receiver/'
for(const width of [1024,1440,1920,2560]) test(`versioned public review URL retains products and actual sticky geometry at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:900})
  await page.goto(receiver+'?v=f914f38&utm_source=review')
  await expect(page.locator('.catalog-results .catalog-product-card').first()).toBeVisible()
  const sidebar=page.locator('.catalog-listing__sidebar')
  for(const y of [450,750,1100]) {
    await page.evaluate(y=>scrollTo(0,y),y)
    await expect.poll(async()=>sidebar.evaluate(el=>{
      const box=el.getBoundingClientRect(),slot=el.parentElement!.getBoundingClientRect(),main=el.closest('main')!.getBoundingClientRect()
      const pinTop=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height'))+12
      const expected=slot.top>=pinTop?slot.top:Math.min(pinTop,main.bottom-12-Math.min(180,box.height))
      return Math.abs(box.top-expected)
    })).toBeLessThan(2)
  }
  await page.evaluate(()=>scrollTo(0,750))
  expect((await sidebar.boundingBox())!.y).toBeGreaterThan(0)
})
for(const width of [1024,1440,1920,2560]) test(`receiver filters stay bounded and usable at ${width}`,async({page})=>{
  test.setTimeout(60000)
  await page.setViewportSize({width,height:900})
  await page.goto(receiver)
  const sidebar=page.getByRole('complementary',{name:'Фильтры',exact:true})
  await expect(sidebar).toBeVisible()
  const layout=page.locator('.catalog-listing__layout')
  const layoutY=await layout.evaluate(el=>el.getBoundingClientRect().top+scrollY)
  await page.evaluate(y=>scrollTo(0,y+200),layoutY)
  const pinned=page.locator('.desktop-header--compact')
  await expect(pinned).toBeVisible()
  await expect.poll(async()=>Math.round((await sidebar.boundingBox())!.y-(await pinned.boundingBox())!.height)).toBe(12)
  const initialCount=await page.locator('.catalog-listing__toolbar>strong').innerText()
  for(const detail of await sidebar.locator('details').all()) if(!await detail.getAttribute('open').then(value=>value!==null)) await detail.locator('summary').click()
  const scroll=sidebar.getByRole('region',{name:'Параметры фильтра'})
  expect(await scroll.evaluate(el=>el.scrollHeight>el.clientHeight)).toBe(true)
  await scroll.evaluate(el=>el.scrollTop=0)
  const before=await page.evaluate(()=>scrollY)
  await scroll.hover();await page.mouse.wheel(0,5000)
  await expect.poll(()=>scroll.evaluate(el=>el.scrollTop)).toBeGreaterThan(100)
  expect(Math.abs(await page.evaluate(()=>scrollY)-before)).toBeLessThan(2)
  await sidebar.getByRole('checkbox',{name:'Беларусь',exact:true}).click()
  await expect(sidebar.getByRole('checkbox',{name:'Беларусь',exact:true})).toBeChecked()
  await expect(page.locator('.catalog-listing__toolbar>strong')).not.toHaveText(initialCount)
  await sidebar.getByRole('button',{name:'Сбросить фильтры',exact:true}).click()
  await expect(page.locator('.catalog-listing__toolbar>strong')).toHaveText(initialCount)
  await pinned.locator('.main-header-row').evaluate(el=>el.style.minHeight='110px')
  await expect.poll(async()=>Math.round((await sidebar.boundingBox())!.y-(await pinned.boundingBox())!.height)).toBe(12)
  await pinned.locator('.main-header-row').evaluate(el=>el.style.removeProperty('min-height'))
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight))
  await expect.poll(()=>sidebar.evaluate(el=>el.getBoundingClientRect().bottom-el.closest('main')!.getBoundingClientRect().bottom)).toBeLessThanOrEqual(0)
  const sideEnd=await sidebar.boundingBox(),layoutEnd=await page.locator('main').boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
  expect(sideEnd!.y+sideEnd!.height).toBeLessThanOrEqual(layoutEnd!.y+layoutEnd!.height+1)
  expect(sideEnd!.y+sideEnd!.height).toBeLessThanOrEqual(footer!.y)
  await page.evaluate(()=>scrollTo(0,119))
  await expect(page.locator('.desktop-header--compact')).toHaveCount(0)
  const beforeSwitch=await layout.evaluate(el=>el.getBoundingClientRect().top+scrollY)
  await page.evaluate(()=>scrollTo(0,121))
  await expect(page.locator('.desktop-header--compact')).toBeVisible()
  expect(Math.abs(await layout.evaluate(el=>el.getBoundingClientRect().top+scrollY)-beforeSwitch)).toBeLessThan(2)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})

for(const width of [360,390]) test(`receiver retains draft mobile drawer at ${width}`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(receiver)
  await expect(page.locator('.catalog-listing__sidebar')).toBeHidden()
  const count=await page.locator('.catalog-listing__toolbar>strong').innerText()
  await page.getByRole('button',{name:'Фильтры',exact:true}).click()
  const drawer=page.getByRole('dialog',{name:'Фильтры каталога'})
  await drawer.getByRole('checkbox',{name:'Remeza',exact:true}).check()
  await expect(page.locator('.catalog-listing__toolbar>strong')).toHaveText(count)
  await drawer.getByRole('button',{name:/Показать \d+ товаров/}).click()
  await expect(drawer).toBeHidden()
  await expect(page.locator('.catalog-listing__toolbar>strong')).not.toHaveText(count)
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})

test('the common sidebar is sticky in category and brand listings without changing action configuration',async({page})=>{
  await page.setViewportSize({width:1440,height:900})
  for(const route of ['/catalog/compressor-equipment/screw-compressors/','/brand/remeza/']) {
    await page.goto(route)
    const sidebar=page.getByRole('complementary',{name:'Фильтры',exact:true})
    await expect(sidebar).toBeVisible()
    await page.evaluate(y=>scrollTo(0,y+200),await page.locator('.catalog-listing__layout').evaluate(el=>el.getBoundingClientRect().top+scrollY))
    await expect(sidebar).toHaveCSS('position','fixed')
    await expect(page.getByRole('button',{name:'Сбросить фильтры',exact:true})).toBeAttached()
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
  await page.goto('/actions/professional-workshop/')
  await expect(page.locator('.catalog-listing__sidebar')).toHaveCount(0)
})

test('pinned sidebar follows live desktop-mobile resize and stops during the footer transition',async({page})=>{
  await page.goto(receiver)
  const sidebar=page.locator('.catalog-listing__sidebar'),layout=page.locator('.catalog-listing__layout')
  for(const width of [1440,1024,390,1920]) {
    await page.setViewportSize({width,height:900})
    if(width<768) {await expect(sidebar).toBeHidden();continue}
    await page.evaluate(y=>scrollTo(0,y+200),await layout.evaluate(el=>el.getBoundingClientRect().top+scrollY))
    const header=page.locator('.desktop-header--compact')
    await expect.poll(async()=>Math.round((await sidebar.boundingBox())!.y-(await header.boundingBox())!.height)).toBe(12)
  }
  const bottom=await page.locator('main').evaluate(el=>el.getBoundingClientRect().bottom+scrollY)
  const sideHeight=(await sidebar.boundingBox())!.height
  const top=await sidebar.evaluate(el=>parseFloat(getComputedStyle(el).top))
  for(const delta of [-20,20,120]) {
    await page.evaluate(y=>scrollTo(0,y),bottom-900+delta)
    await expect.poll(()=>sidebar.evaluate(el=>Math.abs(el.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--catalog-pinned-header-height'))-12))).toBeLessThan(2)
    const box=await sidebar.boundingBox(),end=await page.locator('main').boundingBox(),footer=await page.getByRole('contentinfo').boundingBox()
    expect(box!.y+box!.height).toBeLessThanOrEqual(end!.y+end!.height+1)
    expect(box!.y+box!.height).toBeLessThanOrEqual(footer!.y)
    expect(Math.abs(box!.y-top)).toBeLessThan(2)
    if(delta>0) expect(box!.height).toBeLessThan(sideHeight)
  }
})
