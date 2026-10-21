import {chromium,expect} from '@playwright/test'
import assert from 'node:assert/strict'

const base='https://kcska18051-crypto.github.io/garage'
for(const route of ['/about','/about/']) {
  const response=await fetch(base+route)
  assert.equal(response.status,200,route)
}
const browser=await chromium.launch()
try {
  for(const width of [360,390,1024,1440,1920,2560]) {
    const context=await browser.newContext({viewport:{width,height:900}})
    try {
      const page=await context.newPage()
      await page.goto(base+'/about/')
      await page.reload()
      await expect(page.getByRole('heading',{level:1,name:'О компании'})).toBeVisible()
      assert.equal(await page.locator('main h2').count(),7)
      await expect(page.getByText('XX лет на рынке',{exact:true})).toBeVisible()
      for(const selector of ['html','.about-page','.about-figures','.about-advantages','.about-brands']) assert(await page.locator(selector).evaluate(el=>el.scrollWidth<=el.clientWidth+1),`${width} overflow ${selector}`)
      assert.equal(await page.locator('main a[href="#"],main a:not([href]),main button').count(),0)
      assert.equal(await page.getByRole('region',{name:'Наши соцсети'}).getByRole('link').count(),0)
      const links=await page.locator('main a').evaluateAll(nodes=>nodes.map(node=>node.href))
      for(const href of new Set(links)) {const response=await fetch(href);assert.equal(response.status,200,href)}
      for(const city of ['Ярославль','Вологда','Череповец']) {
        await page.goto(base+'/about/')
        await page.getByRole('region',{name:'География присутствия'}).getByRole('link',{name:city,exact:true}).click()
        await expect(page.getByRole('tab',{name:city,exact:true})).toHaveAttribute('aria-selected','true')
        await page.reload()
        await expect(page.getByRole('tab',{name:city,exact:true})).toHaveAttribute('aria-selected','true')
      }
      await page.goto(base+'/about/')
      await page.getByRole('region',{name:'Бренды и производители'}).getByRole('link',{name:'Berg',exact:true}).click()
      await expect(page.getByRole('searchbox',{name:'Поиск бренда'})).toHaveValue('Berg')
      await page.reload()
      await expect(page.getByRole('searchbox',{name:'Поиск бренда'})).toHaveValue('Berg')
      console.log(`PASS about ${width}: HTTP/reload, 8 blocks/demo masks, valid links, cities/reload, brand query, no overflow/fake actions`)
    } finally {await context.close()}
  }
} finally {await browser.close()}
