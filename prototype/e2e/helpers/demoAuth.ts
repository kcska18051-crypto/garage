import { expect, type Page } from '@playwright/test'

// Regression subjects that require a member account must sign in explicitly.
export async function signIntoDemoAccount(page: Page) {
  const gate=page.getByRole('region',{name:'Вход в личный кабинет'})
  const trigger=await gate.isVisible() ? gate.getByRole('button',{name:'Войти / зарегистрироваться'}) : page.getByRole('button',{name:'Войти или зарегистрироваться'})
  if (!(await trigger.isVisible())) return
  await trigger.click()
  const dialog=page.getByRole('dialog',{name:'Вход и регистрация'})
  await dialog.getByRole('button',{name:'По паролю'}).click()
  await expect(dialog).toContainText('Демонстрационный режим')
  await dialog.getByRole('button',{name:'Войти',exact:true}).click()
  await expect(dialog).toHaveCount(0)
}
