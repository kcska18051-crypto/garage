import {test,expect} from '@playwright/test'
test.beforeEach(async({page})=>{await page.route('**/garage/style-check/**',route=>route.continue({url:route.request().url().replace('/garage/style-check/','/style-check/')}));await page.addInitScript(()=>{localStorage.setItem('garage-region-v1','Ярославль');localStorage.setItem('garage-cookie-preference',JSON.stringify({version:2,choice:'necessary'}))})})
for(const width of [320,390,1440])test(`brand carousel hint and list-only specs at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/brand/remeza/')
 const categories=page.getByRole('region',{name:'Категории товаров Remeza'}),arrow=categories.locator('.brand-category-grid > a > span').first()
 if(width<768)await expect(arrow).toBeHidden();else await expect(arrow).toBeVisible()
 const popular=page.getByRole('region',{name:'Популярные товары Remeza'}),rail=popular.locator('.brand-popular-products__grid')
 await expect(popular.locator('.catalog-rich-card__specs')).toHaveCount(0)
 await rail.scrollIntoViewIfNeeded();await rail.evaluate(e=>e.scrollLeft=0)
 if(width<768){const r=(await rail.boundingBox())!,cards=popular.getByRole('article'),second=(await cards.nth(1).boundingBox())!,third=(await cards.nth(2).boundingBox())!;expect(second.x+second.width).toBeLessThanOrEqual(r.x+r.width+1);expect(third.x).toBeLessThan(r.x+r.width-15);expect(third.x+third.width).toBeGreaterThan(r.x+r.width+15);await popular.screenshot({path:`C:/Users/Admin/garage-audit/brand-carousel-peek-${width}.png`})}
 const listing=page.locator('#brand-products');await expect(listing.locator('.catalog-rich-card__specs')).toHaveCount(0)
 await listing.getByRole('button',{name:'Список',exact:true}).click();await expect(listing.locator('.catalog-rich-card__specs').first()).toBeVisible();await expect(popular.locator('.catalog-rich-card__specs')).toHaveCount(0)
 await listing.getByRole('button',{name:'Плитка',exact:true}).click();await expect(listing.locator('.catalog-rich-card__specs')).toHaveCount(0)
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
