import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { App } from '../app/App'

function LocationEcho() { const location = useLocation(); return <output aria-label="Текущий адрес">{location.pathname}</output> }
const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /><LocationEcho /></MemoryRouter>)

describe('customer information pages', () => {
  it.each([
    ['/delivery', 'Доставка'],
    ['/payment', 'Оплата'],
    ['/warranty', 'Гарантия на товар'],
  ])('renders %s in the shared information template', (path, title) => {
    open(path)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toHaveTextContent(title)
    const navigation = screen.getByRole('navigation', { name: 'Информация для покупателей' })
    expect(within(navigation).getByRole('link', { name: title })).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByTestId('info-section')).toHaveLength(3)
    expect(document.querySelector('.info-page__banner')).toBeNull()
  })

  it('moves between sections without leaving the shared template', async () => {
    const user = userEvent.setup()
    open('/delivery')
    const navigation = screen.getByRole('navigation', { name: 'Информация для покупателей' })
    await user.click(within(navigation).getByRole('link', { name: 'Оплата' }))
    expect(screen.getByRole('status', { name: 'Текущий адрес' })).toHaveTextContent('/payment')
    expect(screen.getByRole('heading', { level: 1, name: 'Оплата' })).toBeInTheDocument()
  })
})
