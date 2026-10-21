import {expect,test} from '@playwright/test'

for(const width of [360,390,1440,1920]) test(`UI offer selection survives reload and Back at ${width}`,async({page})=>{
  test.setTimeout(60000)
  await page.setViewportSize({width,height:900})
  await page.goto('/catalog')
  await page.goto('/product/remeza-vk-10-gr-0001/?campaign=demo#characteristics')
  for(const [voltage,power,id,sku,price] of [
    ['220 В','5,5 кВт','remeza-vk-10-220-55','GR-220-55','169 000 ₽'],
    ['380 В','5,5 кВт','remeza-vk-10-380-55','GR-380-55','176 500 ₽'],
    ['380 В','7,5 кВт','remeza-vk-10-gr-0001','GR-0001','185 000 ₽'],
  ]) {
    await page.getByRole('button',{name:voltage,exact:true}).click()
    await page.getByRole('button',{name:power,exact:true}).click()
    await expect(page).toHaveURL(new RegExp(`variant=${id}`))
    expect(new URL(page.url()).searchParams.get('campaign')).toBe('demo')
    expect(new URL(page.url()).hash).toBe('#characteristics')
    await page.reload()
    await expect(page.locator('#characteristics h2')).toBeInViewport()
    await expect(page.getByRole('button',{name:voltage,exact:true})).toHaveAttribute('aria-pressed','true')
    await expect(page.getByRole('button',{name:power,exact:true})).toHaveAttribute('aria-pressed','true')
    await expect(page.locator('.product-heading')).toContainText(`${voltage} · ${power}`)
    const purchase=page.getByRole('complementary',{name:'Покупка товара'})
    await expect(purchase.locator('.product-purchase__price strong')).toHaveText(price)
    await expect(page.getByRole('button',{name:`Скопировать артикул ${sku}`})).toBeAttached()
    await (width<600?page.locator('.product-mobile-purchase'):purchase).getByRole('button',{name:'В корзину',exact:true}).click()
    expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('garage-cart-v2')!))).toEqual(expect.arrayContaining([{id,quantity:1}]))
  }
  await page.goBack()
  await expect(page).toHaveURL(/\/catalog\/?$/)
  await page.goForward()
  await expect(page.getByRole('button',{name:'7,5 кВт',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.goto('/product/remeza-vk-10-220-55/')
  await expect(page.getByRole('button',{name:'220 В',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.goto('/product/remeza-vk-10-gr-0001/?variant=not-a-real-offer')
  await expect(page.getByRole('button',{name:'380 В',exact:true})).toHaveAttribute('aria-pressed','true')
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
