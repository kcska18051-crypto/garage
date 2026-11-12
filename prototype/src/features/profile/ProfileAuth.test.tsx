import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { App } from '../../app/App'
import { seedDemoSession } from '../../test/auth'

function LocationEcho() {
  const location = useLocation()
  return <output aria-label="Текущий маршрут">{location.pathname}</output>
}

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /><LocationEcho /></MemoryRouter>)

describe('auth dialog entry points', () => {
  it('opens from the account shell and returns focus after closing', async () => {
    const user = userEvent.setup(); open('/profile')
    const trigger = within(screen.getByRole('navigation', { name:'Разделы личного кабинета' })).getByRole('button', { name: 'Войти / зарегистрироваться' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Вход и регистрация' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Закрыть' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('opens from checkout and keeps checkout behind the dialog', async () => {
    const user = userEvent.setup(); open('/checkout/review')
    await user.click(screen.getByRole('button', { name: 'Войти или зарегистрироваться' }))
    expect(screen.getByRole('dialog', { name: 'Вход и регистрация' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Текущий маршрут' })).toHaveTextContent('/checkout/review')
  })

  it('opens from the approved mobile menu and keeps all six bottom destinations', async () => {
    const user = userEvent.setup(); open('/catalog')
    const navigation = document.querySelector<HTMLElement>('[aria-label="Мобильная навигация"]')!
    expect(navigation.querySelectorAll('a,button')).toHaveLength(6)
    await user.click(screen.getByRole('button', { name: 'Открыть меню', hidden: true }))
    await user.click(within(screen.getByRole('dialog', { name: 'Мобильное меню' })).getByRole('link', { name: /Профиль/ }))
    await user.click(within(screen.getByRole('navigation', { name: 'Разделы личного кабинета' })).getByRole('button', { name: 'Войти / зарегистрироваться' }))
    expect(screen.getByRole('dialog', { name: 'Вход и регистрация' })).toBeInTheDocument()
  })

  it('keeps the profile dashboard available by its direct route', () => {
    seedDemoSession()
    open('/profile')
    expect(screen.getByText('Здравствуйте, Алексей')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Активные заказы' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Последние просмотренные' })).toBeInTheDocument()
  })
})

it('keeps the overview selected with a trailing slash and closes account navigation after choosing a section',async()=>{
 seedDemoSession()
 const user=userEvent.setup()
 open('/profile/')
 const nav=screen.getByRole('navigation',{name:'Разделы личного кабинета'})
 expect(within(nav).getByRole('link',{name:'Обзор'})).toHaveAttribute('aria-current','page')
 const toggle=screen.getByText('Разделы кабинета').closest('button')!
 expect(toggle).toHaveAttribute('aria-expanded','false')
 fireEvent.click(toggle)
 expect(toggle).toHaveAttribute('aria-expanded','true')
 await user.click(within(nav).getByRole('link',{name:'Мои заказы'}))
 expect(toggle).toHaveAttribute('aria-expanded','false')
 expect(screen.getByRole('heading',{name:'Мои заказы'})).toBeInTheDocument()
})
