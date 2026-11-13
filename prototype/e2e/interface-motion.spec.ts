import {test,expect} from '@playwright/test'
for(const motion of ['no-preference','reduce'] as const){
 test(`dialog opens and dismisses with focus restored: ${motion}`,async({page})=>{
  await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:motion});await page.goto('/')
  const opener=page.locator('.header-actions').getByRole('button',{name:'Профиль',exact:true});await opener.click()
  const dialog=page.getByRole('dialog',{name:'Вход и регистрация'});await expect(dialog).toBeVisible()
  expect(await dialog.evaluate(e=>getComputedStyle(e).animationName)).toBe(motion==='reduce'?'none':'garage-dialog-in')
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused()
 })
 test(`profile popup traps focus and closes on Escape: ${motion}`,async({page})=>{
  await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:motion})
  await page.addInitScript(()=>sessionStorage.setItem('garage-auth-demo-session-v1','active'));await page.goto('/profile/documents')
  const opener=page.getByRole('button',{name:'Посмотреть документ'}).first();await opener.click()
  const dialog=page.getByRole('dialog',{name:'Предпросмотр документа'});const close=dialog.getByRole('button',{name:'Закрыть диалог'});await expect(close).toBeFocused()
  await page.keyboard.press('Shift+Tab');await expect(close).toBeFocused();await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused()
 })
 test(`cart count feedback respects preference: ${motion}`,async({page})=>{
  await page.setViewportSize({width:1440,height:1000});await page.emulateMedia({reducedMotion:motion});await page.goto('/new')
  await page.getByRole('button',{name:/^Добавить в корзину:/}).first().click()
  const badge=page.locator('.header-actions a[href$="/cart"] b');await expect(badge).toHaveText('1')
  expect(await badge.evaluate(e=>getComputedStyle(e).animationName)).toBe(motion==='reduce'?'none':'garage-count')
 })
}
test('mobile filter dismissal restores its opener',async({page})=>{
 await page.setViewportSize({width:390,height:900});await page.goto('/catalog/compressor-equipment/screw-compressors')
 const opener=page.getByRole('button',{name:'Фильтры',exact:true});await opener.click();const dialog=page.getByRole('dialog',{name:'Фильтры каталога'});await expect(dialog).toBeVisible();await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused()
})

for(const motion of ['no-preference','reduce'] as const){
 test(`product gallery keeps keyboard focus inside and returns it: ${motion}`,async({page})=>{
  await page.emulateMedia({reducedMotion:motion});await page.goto('/product/remeza-vk-10-gr-0001')
  const opener=page.getByRole('button',{name:'Увеличить изображение',exact:true});await opener.click()
  const dialog=page.getByRole('dialog',{name:'Увеличенный просмотр товара'})
  const close=dialog.getByRole('button',{name:'Закрыть изображение'});await expect(close).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  expect(await dialog.evaluate(e=>e.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Tab');await expect(close).toBeFocused()
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused()
 })
}
