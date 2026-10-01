import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SearchBox } from './SearchBox'
import { SearchResultsPage } from '../../pages/SearchResultsPage'
import { CommerceProvider } from '../../state/CommerceState'

const Location = () => <span data-testid="location">{useLocation().pathname}{useLocation().search}</span>

describe('search experience', () => {
  beforeEach(() => localStorage.clear())
  it('opens a two-part discovery panel with demo history and managed promotions', async () => {
    const user = userEvent.setup(); render(<MemoryRouter><SearchBox/><Location/></MemoryRouter>)
    const input = screen.getByRole('searchbox'); await user.click(input)
    expect(screen.getByRole('region', { name: 'История и подсказки поиска' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Специальные предложения' })).toBeInTheDocument()
    expect(screen.getByText('Компрессор')).toBeInTheDocument()
    expect(screen.getAllByTestId('search-promo-card')).toHaveLength(4)
    expect(document.querySelector('.search-backdrop')).toBeInTheDocument()
  })

  it('clears history into an explicit empty state', async () => {
    const user = userEvent.setup(); render(<MemoryRouter><SearchBox/></MemoryRouter>)
    await user.click(screen.getByRole('searchbox'))
    await user.click(screen.getByRole('button', { name: 'Очистить историю' }))
    expect(screen.getByText('История поиска пока пуста')).toBeInTheDocument()
    expect(screen.queryByText('Компрессор', { selector: '.search-history__query' })).not.toBeInTheDocument()
  })

  it('replaces history with typed suggestions across product, category and brand data', async () => {
    const user = userEvent.setup(); render(<MemoryRouter><SearchBox/><Location/></MemoryRouter>)
    const input = screen.getByRole('searchbox'); await user.click(input)
    await user.type(input, 'remeza')
    const list = screen.getByRole('listbox', { name: 'Подсказки поиска' })
    expect(within(list).getByText('Remeza', { exact: true })).toBeInTheDocument()
    expect(within(list).getByText(/Бренд/)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Специальные предложения' })).toBeInTheDocument()
  })

  it('shows no-result feedback, closes with Escape and submits a searchable URL', async () => {
    const user = userEvent.setup(); render(<MemoryRouter><SearchBox/><Location/></MemoryRouter>)
    const input = screen.getByRole('searchbox'); await user.click(input)
    await user.type(input, 'нет-такого-запроса')
    expect(screen.getByText('Совпадений не найдено')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: 'История и подсказки поиска' })).not.toBeInTheDocument()
    await user.click(input)
    await user.clear(input)
    await user.type(input, 'компрессор')
    await user.keyboard('{Enter}')
    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=')
  })
  it('renders actual results for q', () => {
    render(<MemoryRouter initialEntries={['/search?q=компрессор']}><CommerceProvider><Routes><Route path="/search" element={<SearchResultsPage/>}/></Routes></CommerceProvider></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /Результаты поиска/ })).toBeInTheDocument()
    expect(screen.getByText('Компрессор поршневой')).toBeInTheDocument()
    expect(screen.getByText('Под заказ')).toBeInTheDocument()
  })
})
