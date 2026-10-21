import {expect,test} from '@playwright/test'
import {aboutCities,aboutNews} from '../src/data/aboutData'

test('existing header and footer both lead to the approved company page',async({page})=>{
  await page.goto('/')
  await page.getByRole('contentinfo').getByRole('link',{name:'О компании',exact:true}).click()
  await expect(page.getByRole('heading',{level:1,name:'О компании'})).toBeVisible()
  await page.goto('/')
  await page.getByRole('banner').getByRole('link',{name:'О компании',exact:true}).click()
  await expect(page.getByRole('heading',{level:1,name:'О компании'})).toBeVisible()
  await expect(page.getByRole('region',{name:'Наши преимущества'}).getByRole('listitem')).toHaveCount(4)
})

test('contact city changed through the existing header survives reload',async({page})=>{
  await page.setViewportSize({width:390,height:900})
  await page.goto('/contacts?city='+encodeURIComponent('Вологда'))
  await page.getByRole('button',{name:'Выбрать город',exact:true}).filter({visible:true}).first().click()
  await page.getByRole('button',{name:'Череповец',exact:true}).click()
  await expect(page.getByRole('tab',{name:'Череповец'})).toHaveAttribute('aria-selected','true')
  expect(new URL(page.url()).searchParams.get('city')).toBe('Череповец')
  await page.reload()
  await expect(page.getByRole('tab',{name:'Череповец'})).toHaveAttribute('aria-selected','true')
})

for(const width of [360,390,1024,1440,1920,2560]) test(`approved about page and linked content at ${width}`,async({page})=>{
  test.setTimeout(60000)
  await page.setViewportSize({width,height:900})
  await page.goto('/about')
  await expect(page.getByRole('heading',{level:1,name:'О компании'})).toBeVisible()
  expect(await page.locator('main h2').allTextContents()).toEqual(['Компания в цифрах','Наши преимущества','Бренды и производители','География присутствия','Наши новости','Наши соцсети','Реквизиты'])
  for(const selector of ['html','.about-page','.about-figures','.about-advantages','.about-brands','.about-cities','.about-news','.about-social','.about-requisites']) {
    expect(await page.locator(selector).evaluate(el=>el.scrollWidth<=el.clientWidth+1),`${selector} overflow at ${width}`).toBe(true)
  }
  await expect(page.locator('main a[href="#"],main a:not([href]),main button')).toHaveCount(0)
  await expect(page.getByRole('region',{name:'Наши соцсети'}).getByRole('link')).toHaveCount(0)
  const photo=await page.locator('.about-photo>div').boundingBox()
  expect(photo!.height).toBeLessThanOrEqual(241)
  for(const selector of ['.about-brands a','.about-cities a','.about-more','.about-news h3 a']) for(const box of await page.locator(selector).evaluateAll(nodes=>nodes.map(el=>({h:el.getBoundingClientRect().height,w:el.getBoundingClientRect().width})))) expect(box.h).toBeGreaterThanOrEqual(44)
  if(width>=1440) {
    const box=await page.locator('.about-page').boundingBox()
    expect(Math.abs(box!.x-(width-box!.x-box!.width))).toBeLessThan(2)
  }
  if([390,1440,1920].includes(width)) await page.screenshot({path:`artifacts/about-${width}.png`,fullPage:true})
  await page.getByRole('region',{name:'Бренды и производители'}).getByRole('link',{name:'Berg',exact:true}).click()
  await expect(page.getByRole('searchbox',{name:'Поиск бренда'})).toHaveValue('Berg')
  await page.reload()
  await expect(page.getByRole('searchbox',{name:'Поиск бренда'})).toHaveValue('Berg')
  await page.goto('/about')
  await page.getByRole('region',{name:'Бренды и производители'}).getByRole('link',{name:'Remeza',exact:true}).click()
  await expect(page).toHaveURL(/\/brand\/remeza\/?$/)
  for(const city of aboutCities) {
    await page.goto('/about')
    await page.getByRole('region',{name:'География присутствия'}).getByRole('link',{name:city,exact:true}).click()
    await expect(page.getByRole('tab',{name:city,exact:true})).toHaveAttribute('aria-selected','true')
    await page.reload()
    await expect(page.getByRole('tab',{name:city,exact:true})).toHaveAttribute('aria-selected','true')
    expect(await page.locator('html').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)
  }
  for(const item of aboutNews) {
    await page.goto('/about')
    await page.getByRole('region',{name:'Наши новости'}).getByRole('link',{name:item.title,exact:true}).click()
    await expect(page.getByRole('heading',{level:1,name:item.title})).toBeVisible()
  }
  await page.goto('/contacts?city=not-a-city')
  await expect(page.getByRole('heading',{level:1,name:'Контакты'})).toBeVisible()
})
