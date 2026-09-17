import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

const routes = [
  ['/profile', 'Личный кабинет'],
  ['/profile/orders', 'Мои заказы'],
  ['/profile/organizations', 'Мои организации'],
  ['/profile/favorites', 'Избранное'],
  ['/profile/recently-viewed', 'Вы смотрели'],
  ['/profile/services', 'Заявки на услуги'],
  ['/profile/reviews', 'Отзывы'],
  ['/profile/data', 'Профиль'],
] as const

describe('profile route shell', () => {
  it.each(routes)('opens %s inside the shared account shell', (path, heading) => {
    render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(screen.getAllByText('+7 900 000-00-00').length).toBeGreaterThan(0)
    expect(screen.getByRole('navigation', { name: 'Разделы личного кабинета' })).toBeInTheDocument()
    expect(document.querySelector('.profile-section__heading p')).not.toBeInTheDocument()
  })

  it('keeps the bonus card feature completely hidden', () => {
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>)

    expect(screen.queryByText(/Бонусная карта/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Бонусный баланс/i)).not.toBeInTheDocument()
  })
})
