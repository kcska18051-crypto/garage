import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('actions routes', () => {
  it('renders only active actions and links to the archive', () => {
    render(<MemoryRouter initialEntries={['/actions']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Акции' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Завершённые акции' })).toHaveAttribute('href', '/actions/completed')
    expect(screen.getAllByTestId('active-action-card').length).toBeGreaterThan(2)
    expect(screen.queryByText('Акция завершена')).not.toBeInTheDocument()
  })

  it('renders completed cards without active calls to action', () => {
    render(<MemoryRouter initialEntries={['/actions/completed']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Завершённые акции' })).toBeInTheDocument()
    expect(screen.getAllByTestId('completed-action-card').length).toBeGreaterThan(1)
    expect(screen.getAllByText(/Акция завершена/).length).toBeGreaterThan(1)
    expect(screen.queryByRole('link', { name: /Участвовать|Купить по акции/ })).not.toBeInTheDocument()
  })

  it('renders the hybrid detail with shared catalog listing', () => {
    render(<MemoryRouter initialEntries={['/actions/professional-workshop']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Оснащение мастерской: выгода на комплект' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Условия участия' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Описание акции' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Описание и условия акции' })).toBeInTheDocument()
    expect(document.querySelector('.action-detail-status p')).toBeNull()
    expect(screen.getByRole('group', { name: 'Группы товаров акции' })).toBeInTheDocument()
    expect(document.querySelector('.catalog-tags')).toBeInTheDocument()
    expect(document.querySelector('.catalog-listing__sidebar')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="catalog-results"]')).toBeInTheDocument()
  })

  it('places only the action deadline between breadcrumbs and the title', () => {
    render(<MemoryRouter initialEntries={['/actions/professional-workshop']}><App /></MemoryRouter>)
    const breadcrumbs = screen.getByRole('navigation', { name: 'Хлебные крошки' })
    const deadline = document.querySelector<HTMLElement>('.action-detail-status')!
    const title = screen.getByRole('heading', { level: 1, name: 'Оснащение мастерской: выгода на комплект' })

    expect(deadline).toHaveTextContent('До 16 декабря 2026 года')
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
