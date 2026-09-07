import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'
import { RegionProvider, useRegion } from '../../state/RegionState'

function renderHeader() {
  return render(<MemoryRouter><RegionProvider><Header counts={{ favorites: 2, compare: 1, cart: 3 }} /></RegionProvider></MemoryRouter>)
}

function RegionEcho() {
  const { region } = useRegion()
  return <output aria-label="Регион страницы">{region}</output>
}

describe('responsive header', () => {
  it('changes the selected region from the region dialog', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><RegionProvider><Header counts={{ favorites: 2, compare: 1, cart: 3 }} /><RegionEcho /></RegionProvider></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: 'Выбрать город' }))
    await user.click(screen.getByRole('button', { name: 'Вологда' }))
    expect(screen.getByRole('status', { name: 'Регион страницы' })).toHaveTextContent('Вологда')
  })

  it('shows useful search suggestions while typing', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.type(screen.getAllByRole('searchbox')[0], 'краск')
    expect(screen.getAllByRole('listbox').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Краскопульт/).length).toBeGreaterThan(0)
  })

  it('keeps search input identifiers unique across adaptive header variants', () => {
    renderHeader()
    const ids = screen.getAllByRole('searchbox', { hidden: true }).map((input) => input.id)
    expect(new Set(ids).size).toBe(ids.length)
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
