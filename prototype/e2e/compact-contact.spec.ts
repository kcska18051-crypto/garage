import {test,expect} from '@playwright/test'
for(const path of ['/','/about'])test(`compact header contact opens callback without navigation at ${path}`,async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto(path)
 await page.evaluate(()=>window.scrollTo(0,900))
 const trigger=page.getByRole('button',{name:/Связаться с нами/});await expect(trigger).toBeVisible()
 const url=page.url(),scroll=await page.evaluate(()=>scrollY)
 await trigger.click();const dialog=page.getByRole('dialog',{name:'Заказать звонок'});await expect(dialog).toBeVisible()
 expect(page.url()).toBe(url);expect(Math.abs(await page.evaluate(()=>scrollY)-scroll)).toBeLessThanOrEqual(1)
 await expect(dialog.getByLabel('Ваше имя')).toBeVisible();await expect(dialog.getByLabel('Телефон',{exact:true})).toBeVisible()
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();expect(page.url()).toBe(url)
})
