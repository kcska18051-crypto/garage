import { chromium, expect } from '@playwright/test'
import assert from 'node:assert/strict'
import { loadPublicRoutes } from './create-spa-fallback.mjs'

const base='https://kcska18051-crypto.github.io/garage'
const routes=await loadPublicRoutes()
let cursor=0
await Promise.all(Array.from({length:6},async()=>{
  while(cursor<routes.length) {
    const route=routes[cursor++]
    const response=await fetch(`${base}${route==='/'?'/':`${route}/`}`,{signal:AbortSignal.timeout(30000)})
    assert.equal(response.status,200,`HTTP ${route}`)
    await response.text()
  }
}))
for(const route of ['/about','/news','/compare','/product/product-1','/product/remeza-vk-10-220-55']) {
  const response=await fetch(`${base}${route}`,{signal:AbortSignal.timeout(30000)})
  assert.equal(response.status,200,`no slash ${route}`)
}
console.log(`HTTP200: ${routes.length} implemented routes plus five no-slash URLs`)
const browser=await chromium.launch({headless:true})
try {
  for(const width of [360,390,1440,1920]) {
    const context=await browser.newContext({viewport:{width,height:900}})
    try {
      const page=await context.newPage()
      for(const q of ['Remeza','ВК10','GR-0001']) {
        await page.goto(`${base}/search/?q=${encodeURIComponent(q)}`)
        await expect(page.locator('.search-results a.product-teaser__name[href$="/product/remeza-vk-10-gr-0001"]').first()).toBeVisible()
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`search overflow ${width}`)
      }
      await page.goto(`${base}/search/?q=нет-такого-demo-запроса`)
      await expect(page.getByText('По вашему запросу ничего не найдено')).toBeVisible()
      for(const [id,name] of [['product-1','Домкрат подкатной профессиональный'],['product-2','Набор инструмента для мастерской'],['product-5','Стенд диагностический']]) {
        await page.goto(`${base}/product/${id}/`)
        await expect(page.getByRole('heading',{level:1,name})).toBeVisible()
        await page.getByRole('button',{name:'Добавить в корзину',exact:true}).click()
        assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('garage-cart-v2')))).some(item=>item.id===id))
      }
      await page.goto(`${base}/product/remeza-vk-10-gr-0001/`)
      await page.getByRole('button',{name:'220 В',exact:true}).click()
      assert.equal(new URL(page.url()).searchParams.get('variant'),'remeza-vk-10-220-55')
      await page.reload()
      await expect(page.locator('.product-heading')).toContainText('220 В · 5,5 кВт')
      await expect(page.locator('.product-key-specs')).toContainText('10 л/мин')
      const purchase=page.getByRole('complementary',{name:'Покупка товара'})
      await purchase.getByRole('button',{name:'Увеличить количество'}).click()
      await purchase.getByRole('button',{name:'Коммерческое предложение'}).click()
      const proposal=page.getByRole('dialog',{name:'Коммерческое предложение'})
      await expect(proposal).toContainText('338 000 ₽')
      await expect(proposal).toContainText('GR-220-55')
      await proposal.getByRole('button',{name:'Закрыть коммерческое предложение'}).click()
      await (width<600?page.locator('.product-mobile-purchase'):purchase).getByRole('button',{name:'В корзину',exact:true}).click()
      assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('garage-cart-v2')))).some(item=>item.id==='remeza-vk-10-220-55'&&item.quantity===2))
      for(const [power,id,sku,price] of [['5,5 кВт','remeza-vk-10-380-55','GR-380-55','176 500 ₽'],['7,5 кВт','remeza-vk-10-gr-0001','GR-0001','185 000 ₽']]) {
        await page.getByRole('button',{name:'380 В',exact:true}).click()
        await page.getByRole('button',{name:power,exact:true}).click()
        assert.equal(new URL(page.url()).searchParams.get('variant'),id)
        await page.reload()
        await expect(page.locator('.product-heading')).toContainText(`380 В · ${power}`)
        await expect(purchase.locator('.product-purchase__price strong')).toHaveText(price)
        await expect(page.getByRole('button',{name:`Скопировать артикул ${sku}`})).toBeAttached()
        await (width<600?page.locator('.product-mobile-purchase'):purchase).getByRole('button',{name:'В корзину',exact:true}).click()
        assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('garage-cart-v2')))).some(item=>item.id===id&&item.quantity===1))
      }
      await page.goto(`${base}/product/remeza-vk-10-220-55/#options`)
      await expect(page.locator('#options h2')).toBeInViewport()
      await page.reload()
      await expect(page.locator('#options h2')).toBeInViewport()
      await page.goto(`${base}/compare/`)
      await expect(page.getByRole('row').filter({hasText:'Производительность'}).locator('td').first()).toHaveText('10 л/мин')
      const unknown=await page.goto(`${base}/product/not-a-real-sku/`)
      assert.equal(unknown.status(),404)
      await expect(page.getByRole('heading',{name:'Страница не найдена'})).toBeVisible()
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`)
      console.log(`PASS ${width}: search, 3 own PDP/cart IDs, UI-selected 220/380 offers after reload/cart, quantity/CP, anchors/reload, units, unknown HTTP404/UI`)
    } finally {await context.close()}
  }
} finally {await browser.close()}
