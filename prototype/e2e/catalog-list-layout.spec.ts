import {test,expect} from '@playwright/test'
test.beforeEach(async({page})=>{await page.route('**/garage/style-check/**',route=>route.continue({url:route.request().url().replace('/garage/style-check/','/style-check/')}));await page.addInitScript(()=>{localStorage.setItem('garage-region-v1','Ярославль');localStorage.setItem('garage-cookie-preference',JSON.stringify({version:2,choice:'necessary'}))})})
for(const width of [1440,1024,390])test(`list product composition and tile regression at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/catalog/compressor-equipment/screw-compressors?view=list')
 const card=page.locator('.catalog-rich-card').first(),name=card.locator('.catalog-rich-card__name')
 await expect(name).toHaveCSS('font-weight','600')
 const positions=await card.evaluate(e=>{const box=(s:string)=>{const r=e.querySelector(s)!.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}};return {name:box('.catalog-rich-card__name'),price:box('.catalog-rich-card__price'),cart:box('.catalog-rich-card__cart'),photo:box('.catalog-rich-card__media'),dt:box('dt'),dd:box('dd')}})
 expect(Math.abs(positions.dd.y-positions.dt.y)).toBeLessThan(2);expect(positions.dd.x-positions.dt.x-positions.dt.width).toBeLessThanOrEqual(6)
 if(width>=768){expect(Math.abs(positions.price.y-positions.name.y)).toBeLessThan(2);expect(positions.cart.y-positions.price.y).toBeLessThan(100);expect(positions.photo.width).toBeGreaterThanOrEqual(180)}
 await card.getByRole('button',{name:/Добавить в корзину:/}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('garage-cart-v2')!))).toContainEqual({id:'remeza-vk-10-gr-0001',quantity:1})
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
 await page.getByRole('button',{name:'Плитка',exact:true}).click();await expect(card.locator('.catalog-rich-card__purchase')).toHaveCSS('display','contents')
 const price=await card.locator('.catalog-rich-card__price').boundingBox(),title=await name.boundingBox();expect(price!.y).toBeLessThan(title!.y)
})
