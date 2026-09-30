import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('actions routes', () => {
  it('renders active actions and a compact linked archive on one page', () => {
    render(<MemoryRouter initialEntries={['/actions']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Акции' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Архив акций' })).toHaveAttribute('id', 'archive')
    expect(screen.getAllByTestId('active-action-card').length).toBeGreaterThan(2)
    expect(screen.getAllByTestId('completed-action-card')).toHaveLength(2)
    expect(screen.getAllByTestId('completed-action-card')[0]).toHaveAttribute('href', '/actions/archive-one')
  })

  it('redirects the legacy completed route to the archive', () => {
    render(<MemoryRouter initialEntries={['/actions/completed']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Акции' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Архив акций' })).toBeInTheDocument()
  })

  it('renders the hybrid detail with shared catalog listing', () => {
    render(<MemoryRouter initialEntries={['/actions/professional-workshop']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Оснащение мастерской: выгода на комплект' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Условия участия' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Описание акции' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Описание и условия акции' })).toBeInTheDocument()
    expect(document.querySelector('.action-detail-status p')).toBeNull()
    expect(screen.getByRole('group', { name: 'Группы товаров акции' })).toBeInTheDocument()
    expect(document.querySelector('.catalog-tags')).not.toBeInTheDocument()
    expect(document.querySelector('.catalog-listing__sidebar')).not.toBeInTheDocument()
    expect(document.querySelector('[data-testid="catalog-results"]')).toBeInTheDocument()
  })

  it('opens a completed action detail with dates and without an active CTA', () => {
    render(<MemoryRouter initialEntries={['/actions/archive-one']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Комплекты для сервисного поста' })).toBeInTheDocument()
    expect(screen.getByText(/Акция завершена/)).toBeInTheDocument()
    expect(screen.getByText(/с 1 января 2025 года по 31 марта 2025 года/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Перейти к товарам|Участвовать|Купить/ })).not.toBeInTheDocument()
  })

  it('places only the action deadline between breadcrumbs and the title', () => {
    render(<MemoryRouter initialEntries={['/actions/professional-workshop']}><App /></MemoryRouter>)
    const breadcrumbs = screen.getByRole('navigation', { name: 'Хлебные крошки' })
    const deadline = document.querySelector<HTMLElement>('.action-detail-status')!
    const title = screen.getByRole('heading', { level: 1, name: 'Оснащение мастерской: выгода на комплект' })

    expect(deadline).toHaveTextContent(/^До \d{1,2} \p{L}+ \d{4} года$/u)
    expect(deadline).not.toHaveTextContent('Физическим и юридическим лицам')
    expect(breadcrumbs.compareDocumentPosition(deadline) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(deadline.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('removes the whole product area for an informational action', () => {
    render(<MemoryRouter initialEntries={['/actions/seven-days']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Неделя профессионального инструмента' })).toBeInTheDocument()
    expect(document.querySelector('#action-products')).toBeNull()
    expect(document.querySelector('.catalog-listing')).toBeNull()
  })
})
