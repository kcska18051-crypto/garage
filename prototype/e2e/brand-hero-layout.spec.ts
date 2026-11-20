import {test,expect} from '@playwright/test'
test.beforeEach(async({page})=>{await page.route('**/garage/style-check/**',route=>route.continue({url:route.request().url().replace('/garage/style-check/','/style-check/')}));await page.addInitScript(()=>{localStorage.setItem('garage-region-v1','Ярославль');localStorage.setItem('garage-cookie-preference',JSON.stringify({version:2,choice:'necessary'}))})})
for(const width of [1440,390,320])test(`brand identity and expandable hero at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/brand/remeza/')
 const hero=page.locator('.brand-detail-hero'),copy=hero.locator('.brand-detail-hero__copy'),logo=hero.getByRole('img',{name:'Remeza',exact:true}),certificate=hero.getByRole('button',{name:'Сертификат дилера',exact:true})
 await expect(hero.getByRole('img')).toHaveCount(1);await expect(logo).toBeVisible();await expect(certificate).toBeVisible()
 const l=(await logo.boundingBox())!,c=(await certificate.boundingBox())!,t=(await copy.boundingBox())!
 expect(c.y).toBeGreaterThan(l.y+l.height)
 if(width>=768)expect(l.x).toBeGreaterThan(t.x+t.width);else expect(l.y).toBeLessThan(t.y)
 const initial=(await hero.boundingBox())!.height
 await expect(hero.locator('#brand-hero-description')).toBeHidden()
 await hero.getByRole('button',{name:'Развернуть описание бренда'}).click();await expect(hero.locator('#brand-hero-description')).toBeVisible();expect((await hero.boundingBox())!.height).toBeGreaterThan(initial+100)
 await hero.getByRole('button',{name:'Свернуть описание бренда'}).click();await expect(hero.locator('#brand-hero-description')).toBeHidden()
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 await hero.screenshot({path:`C:/Users/Admin/garage-audit/brand-hero-final-${width}.png`})
 await certificate.click();await expect(page.getByRole('dialog',{name:'Сертификат дилера Remeza'})).toBeVisible();await page.keyboard.press('Escape')
})
