import {test,expect} from '@playwright/test'
test.beforeEach(async({page})=>{await page.route('**/garage/style-check/**',route=>route.continue({url:route.request().url().replace('/garage/style-check/','/style-check/')}));await page.addInitScript(()=>{localStorage.setItem('garage-region-v1','Ярославль');localStorage.setItem('garage-cookie-preference',JSON.stringify({version:2,choice:'necessary'}))})})
for(const width of [1440,1024])test(`five brand cards with homepage edge controls at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/brand/remeza/')
 const section=page.getByRole('region',{name:'Популярные товары Remeza'}),rail=section.locator('.brand-popular-products__grid'),previous=section.getByRole('button',{name:'Предыдущие популярные товары'}),next=section.getByRole('button',{name:'Следующие популярные товары'})
 await rail.scrollIntoViewIfNeeded();await rail.evaluate(e=>e.scrollLeft=0)
 const bounds=(await rail.boundingBox())!,cards=section.getByRole('article');let visible=0
 for(const card of await cards.all()){const box=(await card.boundingBox())!;if(box.x>=bounds.x-1&&box.x+box.width<=bounds.x+bounds.width+1)visible++}
 expect(visible).toBe(5);await expect(rail).toHaveCSS('scrollbar-width','none');await expect(next).toHaveCSS('width','44px')
 const alignment=await section.evaluate(e=>{const r=e.querySelector('.brand-popular-products__grid')!.getBoundingClientRect(),a=e.querySelector('.brand-popular-controls button:last-child')!.getBoundingClientRect();return{offset:Math.abs(a.y+a.height/2-r.y-r.height/2),extends:a.right>r.right}});expect(alignment.offset).toBeLessThan(2);expect(alignment.extends).toBe(true)
 await expect(previous).toBeDisabled();await next.click();await expect.poll(()=>rail.evaluate(e=>e.scrollLeft)).toBeGreaterThan(100);await expect(next).toBeDisabled();await previous.click();await expect.poll(()=>rail.evaluate(e=>e.scrollLeft)).toBeLessThan(2)
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 await section.screenshot({path:`C:/Users/Admin/garage-audit/brand-five-${width}.png`})
})

