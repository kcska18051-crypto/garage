import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const browser = await chromium.launch()
const context = await browser.newContext({ reducedMotion: 'reduce', viewport: {width:1440,height:1000} })
await context.addInitScript(() => localStorage.setItem('garage-cookie-preference', JSON.stringify({version:2,choice:'necessary'})))
const original = await context.newPage(), current = await context.newPage()
const report = { source:'Original rendered interactive prototype', checks:[] }
const content = (page, modern) => page.locator('main').evaluate((main, modern) => {
  const text = el => el.innerText.replace(/\s+/g,' ').trim()
  const href = el => new URL(el.href).pathname.replace(/^\/garage(?=\/)/,'') + new URL(el.href).search
  const links = [...new Set([...main.querySelectorAll('a[href]')].map(href))].sort()
  const products = [...main.querySelectorAll(modern?'.sc-product':'.product-teaser')].map(card=>({
    name:text(card.querySelector(modern?'.sc-product-name':'.product-teaser__name')),
    href:href(card.querySelector(modern?'.sc-product-name':'.product-teaser__name')),
    sku:text(card.querySelector(modern?'.sc-product-sku':'.product-teaser__sku')),
    price:text(card.querySelector(modern?'.sc-product-price strong':'.product-teaser__bottom strong')),
    stock:text(card.querySelector(modern?'.sc-product-stock':'.product-teaser__availability')),
  }))
  const headings=[...main.querySelectorAll('h2')].filter(el=>!el.closest('.sc-hero,.hero')).map(text)
  const entries = (selector, title) => [...main.querySelectorAll(selector)].map(el=>({name:text(el.querySelector(title)),href:href(el)}))
  const categories=entries(modern?'.sc-category':'.category-card','strong')
  const brands=[...main.querySelectorAll(modern?'.sc-brands a':'.brand-grid a')].map(el=>({name:text(el),href:href(el)}))
  const promos=[...main.querySelectorAll(modern?'.sc-promo':'.divider-banner')].map(el=>({title:text(el.querySelector('h2')),description:text(el.querySelector('p')),cta:text(el.querySelector(modern?'.sc-promo-cta':'.divider-banner__copy > span')).replace(/\s*[→↗]$/,''),href:href(el)}))
  const services=[...main.querySelectorAll(modern?'.sc-service':'.service-cards article')].map(el=>({title:text(el.querySelector('h3')),description:text(el.querySelector('p')),href:href(el.querySelector('a'))}))
  return {links,products,headings,categories,brands,promos,services}
},modern)
try {
  await original.goto('http://127.0.0.1:4176/garage/', {waitUntil:'domcontentloaded'})
  await current.goto('http://127.0.0.1:4176/garage/style-check/', {waitUntil:'domcontentloaded'})
  await original.locator('.product-teaser').first().waitFor()
  await current.locator('.sc-product').first().waitFor()
  const before=await content(original,false),after=await content(current,true)
  for(const field of ['headings','products','categories','brands','promos','services']) {assert.deepEqual(after[field],before[field],field);report.checks.push(`${field}: original content and order preserved (${before[field].length})`)}
  const missing=before.links.filter(href=>!after.links.includes(href));assert.deepEqual(missing,[]);report.checks.push(`All ${before.links.length} original main-content destinations preserved`)
  for(const tab of ['Новости','Статьи','Обзоры']) {
    await original.getByRole('tab',{name:tab,exact:true}).click();await current.getByRole('tab',{name:tab,exact:true}).click()
    const cards=page=>page.locator('.useful-grid > a').evaluateAll(links=>links.map(link=>({title:link.querySelector('h3').textContent,href:new URL(link.href).pathname.replace(/^\/garage(?=\/)/,''),description:link.querySelector('p').textContent})))
    assert.deepEqual(await cards(current),await cards(original));report.checks.push(`${tab}: same cards and destinations`)
  }
  report.passed=true
} finally {
  await writeFile(fileURLToPath(new URL('./review/prototype-comparison.json',import.meta.url)),JSON.stringify(report,null,2))
  console.log(JSON.stringify(report,null,2));await browser.close()
}
