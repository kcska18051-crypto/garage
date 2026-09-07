import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('brands directory', () => {
  it('links only the approved Remeza example to its brand page', () => {
    render(<MemoryRouter initialEntries={['/brands/']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Бренды' })).toBeInTheDocument()
    const directory = screen.getByRole('region', { name: 'Все бренды' })
    expect(within(directory).getByRole('link', { name: /Remeza/ })).toHaveAttribute('href', '/brand/remeza/')
    expect(within(directory).getByText('Rupes').closest('a')).toBeNull()
  })

  it('filters brands by search, category and alphabet', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/brands/']}><App /></MemoryRouter>)

    await user.type(screen.getByRole('searchbox', { name: 'Поиск бренда' }), 'remeza')
    expect(screen.getByRole('region', { name: 'Все бренды' })).toHaveTextContent('Remeza')
    expect(screen.getByRole('region', { name: 'Все бренды' })).not.toHaveTextContent('Rupes')
    await user.clear(screen.getByRole('searchbox', { name: 'Поиск бренда' }))
    await user.click(screen.getByRole('button', { name: 'Кузовной ремонт' }))
    expect(screen.getByRole('region', { name: 'Все бренды' })).toHaveTextContent('Rupes')
    await user.click(screen.getByRole('button', { name: 'Все направления' }))
    await user.click(screen.getByRole('button', { name: 'Буква R' }))
    expect(screen.getByRole('region', { name: 'Все бренды' })).toHaveTextContent('Remeza')
    expect(screen.getByRole('region', { name: 'Все бренды' })).not.toHaveTextContent('Berg')
  })
})
