import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { App } from '../../app/App'

function LocationEcho() {
  const location = useLocation()
  return <output aria-label="Текущий маршрут">{location.pathname}</output>
}

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /><LocationEcho /></MemoryRouter>)

describe('auth dialog entry points', () => {
  it('opens from the account shell and returns focus after closing', async () => {
    const user = userEvent.setup(); open('/profile')
    const trigger = screen.getByRole('button', { name: 'Войти / регистрация' })
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

  it('opens from mobile navigation and keeps all five destinations', async () => {
    const user = userEvent.setup(); open('/catalog')
    const navigation = document.querySelector<HTMLElement>('[aria-label="Мобильная навигация"]')!
    expect(navigation.querySelectorAll('a,button')).toHaveLength(5)
    await user.click(within(navigation).getByRole('button', { name: 'Профиль', hidden: true }))
    expect(screen.getByRole('dialog', { name: 'Вход и регистрация' })).toBeInTheDocument()
  })

  it('keeps the profile dashboard available by its direct route', () => {
    open('/profile')
    expect(screen.getByText('Здравствуйте, Алексей')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Активные заказы' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Последние просмотренные' })).toBeInTheDocument()
  })
})
