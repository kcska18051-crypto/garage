import { test, expect } from '@playwright/test'
import { publicRoutes } from '../src/data/publicRoutes'
const publicBase=process.env.GARAGE_LAYOUT_BASE ?? ''
const visit=(route:string)=>publicBase ? `${publicBase}${route}` : route

test('empty search shares header container and short pages keep footer at viewport bottom', async ({ page }) => {
  for (const width of [2560,1920,1440,1280,1024,768,390,360]) {
    await page.setViewportSize({width,height:1200})
    await page.goto(visit('/search?q=тест'),{waitUntil:'domcontentloaded'})
    if(process.env.GARAGE_LAYOUT_ASSET) await expect(page.locator(`script[src*="${process.env.GARAGE_LAYOUT_ASSET}"]`)).toHaveCount(1)
    const title=await page.locator('main h1').boundingBox()
    const logo=await page.locator(width<768?'.mobile-header .logo':'.desktop-header .logo').boundingBox()
    if(width>=768) expect(Math.abs(title!.x-logo!.x)).toBeLessThan(2)
    else expect(title!.x).toBeGreaterThanOrEqual(16)
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight))
    const footer=await page.getByRole('contentinfo').boundingBox()
    const nav=width<768?(await page.locator('.mobile-bottom-nav').boundingBox())!.height:0
    expect(footer!.y+footer!.height).toBeGreaterThanOrEqual(1200-nav-2)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    const spacing=await page.locator('main').evaluate(el=>{const s=getComputedStyle(el);return [parseFloat(s.paddingTop),parseFloat(s.paddingBottom)]})
    expect(spacing[0]).toBe(spacing[1]); expect(spacing[0]).toBeLessThanOrEqual(32)
    await page.screenshot({path:`test-results/layout-empty-search-${width}.png`})
  }
})

for(const width of [2560,1920,1440,1024,390,360]) test(`all implemented routes respect page geometry at ${width}`,async({context})=>{
  test.setTimeout(240000)
  const failures:string[]=[]
  for(const route of [...publicRoutes,'/missing-page','/search?q=тест','/search?q=компрессор']) {
    const page=await context.newPage()
    await page.setViewportSize({width,height:900})
    if(publicRoutes.indexOf(route)%25===0) console.log(`layout ${width}: ${route}`)
    try {
    await page.goto(visit(route),{waitUntil:'domcontentloaded'})
    await page.locator('main').waitFor({timeout:10000})
    await page.evaluate(()=>document.fonts.ready)
    const result=await page.locator('main').evaluate(el=>{
      const box=el.getBoundingClientRect(),s=getComputedStyle(el)
      const footer=document.querySelector('.site-footer')!.getBoundingClientRect()
      const nav=document.querySelector('.mobile-bottom-nav')!.getBoundingClientRect()
      const root=getComputedStyle(document.documentElement),token=root.getPropertyValue('--container').trim(),limit=parseFloat(token)*(token.endsWith('rem')?parseFloat(root.fontSize):1)
      return {x:box.x,width:box.width,right:box.right,overflow:document.documentElement.scrollWidth-innerWidth,center:Math.abs(box.x+box.width/2-innerWidth/2),top:parseFloat(s.paddingTop),bottom:parseFloat(s.paddingBottom),footerBottom:footer.bottom+scrollY,available:innerHeight-(nav.height||0),limit,constrained:el.hasAttribute('class')}
    })
    if(result.overflow>1||result.x<-.5||result.right>width+1||result.center>1||result.footerBottom<result.available-2||result.constrained&&(result.width>result.limit+1||result.top!==result.bottom||result.top>32)) failures.push(`${route}: ${JSON.stringify(result)}`)
    if([1920,390].includes(width)&&['/catalog','/services','/news','/profile','/product/remeza-vk-10-gr-0001'].includes(route)) await page.screenshot({path:`test-results/layout-${width}-${route.slice(1).replaceAll('/','-')}.png`})
    } finally {await page.close()}
  }
  expect(failures).toEqual([])
})

test('authenticated account and populated checkout preserve geometry',async({browser})=>{
  test.setTimeout(240000)
  for(const width of [2560,1920,1440,1024,390,360]){
    const context=await browser.newContext({viewport:{width,height:900}})
    await context.addInitScript(()=>{
      sessionStorage.setItem('garage-auth-demo-session-v1','active')
      localStorage.setItem('garage-cart-v2',JSON.stringify([{id:'remeza-vk-10-gr-0001',quantity:1}]))
    })
    try{
      for(const route of [...publicRoutes.filter(route=>route.startsWith('/profile')&&!['/profile/auth','/profile/recovery'].includes(route)),'/cart','/checkout/review','/checkout/delivery']){
        const page=await context.newPage()
        try{
          await page.goto(visit(route),{waitUntil:'domcontentloaded'})
          await expect(page.locator('main')).toBeVisible()
          await expect(page.locator('.profile-guest')).toHaveCount(0)
          const box=(await page.locator('main').boundingBox())!
          expect(Math.abs(box.x+box.width/2-width/2),`${route} ${width} centered`).toBeLessThan(1)
          expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),`${route} ${width} overflow`).toBeLessThanOrEqual(1)
          if([1920,390].includes(width)&&route==='/profile')await page.screenshot({path:`test-results/layout-account-${width}.png`})
        }finally{await page.close()}
      }
      console.log(`PASS authenticated account + filled cart/checkout ${width}`)
    }finally{await context.close()}
  }
})

test('footer remains at bottom after collapsing groups and resizing a short page',async({page})=>{
  await page.setViewportSize({width:390,height:1600})
  await page.goto(visit('/search?q=тест'),{waitUntil:'domcontentloaded'})
  for(const details of await page.locator('.site-footer details').all()) if(await details.getAttribute('open')!==null) await details.locator('summary').click()
  for(const viewport of [{width:390,height:1600},{width:360,height:640},{width:1440,height:1200}]){
    await page.setViewportSize(viewport)
    await page.evaluate(()=>scrollTo(0,0))
    await expect.poll(()=>page.locator('.site-footer').evaluate(el=>el.getBoundingClientRect().bottom+scrollY-innerHeight+(document.querySelector('.mobile-bottom-nav')?.getBoundingClientRect().height??0))).toBeGreaterThanOrEqual(-2)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
})
