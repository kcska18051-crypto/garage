import {test,expect} from '@playwright/test'
// Development runs at /; production assets intentionally retain the Pages /garage prefix.
test.beforeEach(async({page})=>{
 await page.route('**/garage/style-check/**',route=>route.continue({url:route.request().url().replace('/garage/style-check/','/style-check/')}))
})
for(const width of [320,390,767])test(`compact hero, profile and phones work at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.addInitScript(()=>localStorage.setItem('garage-region-v1','Ярославль'));await page.goto('/')
 await expect(page.locator('.hero__slide:not([hidden])')).toHaveCSS('height','152px')
 const nav=page.getByRole('navigation',{name:'Мобильная навигация'})
 await expect(nav.getByRole('link',{name:'Услуги',exact:true})).toHaveCount(0)
 await nav.getByRole('button',{name:'Профиль',exact:true}).click();await expect(page.getByRole('dialog',{name:'Вход и регистрация'})).toBeVisible();await page.keyboard.press('Escape')
 await page.getByRole('button',{name:'Выбрать телефон магазина'}).first().click()
 const dialog=page.getByRole('dialog',{name:'Телефоны магазинов'})
 await expect(dialog.getByRole('link',{name:/Ярославль/})).toHaveAttribute('href','tel:+74852595980')
 await expect(dialog.getByRole('link',{name:/Вологда/})).toHaveAttribute('href','tel:+78172556650')
 await expect(dialog.getByRole('link',{name:/Череповец/})).toHaveAttribute('href','tel:+78202730201')
 await expect(dialog).toContainText('Единый номер уточняется')
 expect(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true)
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0)
 await page.evaluate(()=>scrollTo(0,900));await page.getByRole('button',{name:'Выбрать телефон магазина'}).first().click();await expect(dialog).toBeVisible()
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
test('signed-in mobile Profile opens the account directly',async({page})=>{
 await page.setViewportSize({width:390,height:900});await page.addInitScript(()=>sessionStorage.setItem('garage-auth-demo-session-v1','active'));await page.goto('/')
 await page.getByRole('navigation',{name:'Мобильная навигация'}).getByRole('link',{name:'Профиль',exact:true}).click();await expect(page).toHaveURL(/\/profile\/?$/)
 await expect(page.getByRole('dialog',{name:'Вход и регистрация'})).toHaveCount(0)
})
