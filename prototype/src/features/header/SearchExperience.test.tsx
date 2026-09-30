import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SearchBox } from './SearchBox'
import { SearchResultsPage } from '../../pages/SearchResultsPage'
import { CommerceProvider } from '../../state/CommerceState'

const Location = () => <span data-testid="location">{useLocation().pathname}{useLocation().search}</span>

describe('search experience', () => {
  beforeEach(() => localStorage.clear())
  it('shows discovery content, suggestions and submits a searchable URL', async () => {
    const user = userEvent.setup(); render(<MemoryRouter><SearchBox/><Location/></MemoryRouter>)
    const input = screen.getByRole('searchbox'); await user.click(input)
    expect(screen.getByText('Популярные запросы')).toBeInTheDocument()
    await user.type(input, 'компрессор')
    expect(screen.getByRole('listbox', { name: 'Подсказки поиска' })).toBeInTheDocument()
    await user.keyboard('{Enter}')
    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=')
  })
  it('renders actual results for q', () => {
    render(<MemoryRouter initialEntries={['/search?q=компрессор']}><CommerceProvider><Routes><Route path="/search" element={<SearchResultsPage/>}/></Routes></CommerceProvider></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /Результаты поиска/ })).toBeInTheDocument()
    expect(screen.getByText('Компрессор поршневой')).toBeInTheDocument()
  })
})
