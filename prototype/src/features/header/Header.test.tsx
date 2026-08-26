import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'

function renderHeader() {
  return render(<MemoryRouter><Header counts={{ favorites: 2, compare: 1, cart: 3 }} /></MemoryRouter>)
}

describe('responsive header', () => {
  it('changes the selected region from the region dialog', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole('button', { name: 'Выбрать город' }))
    await user.click(screen.getByRole('button', { name: 'Вологда' }))
    expect(screen.getAllByText('Вологда').length).toBeGreaterThan(0)
  })

  it('shows useful search suggestions while typing', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.type(screen.getAllByRole('searchbox')[0], 'краск')
    expect(screen.getAllByRole('listbox').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Краскопульт/).length).toBeGreaterThan(0)
  })

  it('exposes the five approved mobile destinations and closes its menu with Escape', async () => {
    const user = userEvent.setup()
    renderHeader()
    const mobileNav = document.querySelector<HTMLElement>('[aria-label="Мобильная навигация"]')!
    expect(mobileNav.querySelectorAll('a')).toHaveLength(5)
    await user.click(screen.getByLabelText('Открыть меню'))
    expect(document.querySelector('[aria-label="Мобильное меню"]')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('navigation', { name: 'Мобильное меню' })).not.toBeInTheDocument()
  })
})
