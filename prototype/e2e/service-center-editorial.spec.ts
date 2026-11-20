import {test,expect} from '@playwright/test'
for(const width of [1440,1024,390,320])test(`service center full content and directions at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.route('**/garage/style-check/**',route=>route.continue({url:route.request().url().replace('/garage/style-check/','/style-check/')}));await page.addInitScript(()=>{localStorage.setItem('garage-region-v1','Ярославль');localStorage.setItem('garage-cookie-preference',JSON.stringify({version:2,choice:'necessary'}))})
 await page.goto('/services/service-center')
 const main=page.getByRole('main');await expect(main.getByRole('heading',{name:'Сервисный центр по ремонту',level:1})).toBeVisible()
 await expect(main.locator('.service-editorial-process>li')).toHaveCount(5)
 for(const img of await main.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate((i:HTMLImageElement)=>i.decode())}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 await main.screenshot({path:`C:/Users/Admin/garage-audit/center-${width}.png`})
 await main.getByText('Аккумуляторный инструмент',{exact:true}).click()
 await main.getByRole('link',{name:'Оставить заявку: Аккумуляторный инструмент'}).click()
 await expect(page.getByRole('heading',{level:2,name:'Ремонт аккумуляторного инструмента'})).toBeVisible()
 await page.getByRole('link',{name:'Вернуться к услуге'}).click()
 await main.getByRole('link',{name:'Обсудить ремонт',exact:true}).click()
 await expect(page.getByRole('heading',{level:2,name:'Ремонт инструмента и оборудования'})).toBeVisible()
 await page.getByRole('link',{name:'Вернуться к услуге'}).click()
 await main.getByRole('link',{name:/Шланги для моек высокого давления/}).click()
 await expect(page).toHaveURL(/pressure-washer-hoses/)
})
