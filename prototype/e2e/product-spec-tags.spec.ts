import {test,expect} from '@playwright/test'
for(const width of [390,1440])test(`specification tag filters the general compressor list at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/product/remeza-vk-10-gr-0001')
 await page.getByRole('link',{name:'Показать компрессоры: Максимальное давление — 10 бар',exact:true}).click()
 await expect(page).toHaveURL(/catalog\/compressor-equipment\?listing=all&pressure=10/)
 await expect(page.getByRole('heading',{level:1,name:'Компрессоры'})).toBeVisible()
 await expect(page.getByRole('button',{name:'Удалить фильтр 10 бар',exact:true})).toBeVisible()
 await expect(page.locator('.catalog-results article').first()).toBeVisible()
 await page.getByRole('combobox',{name:'Сортировка'}).selectOption('price-asc');await expect(page).toHaveURL(/listing=all/)
 await page.getByRole('button',{name:'Очистить всё',exact:true}).click();await expect(page).toHaveURL(/listing=all/)
 await expect(page.locator('.catalog-results article').first()).toBeVisible()
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
})
