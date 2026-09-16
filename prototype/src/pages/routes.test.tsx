import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('prototype routes', () => {
  it('opens the catalog root with a real compressor category link', () => {
    render(
      <MemoryRouter initialEntries={['/catalog']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
    const desktopCatalog = document.querySelector('.catalog-root-desktop')!
    expect(within(desktopCatalog).getByRole('link', { name: 'Компрессоры' })).toHaveAttribute('href', '/catalog/compressor-equipment')
  })

  it('renders the catalog root from the normalized six-category model', () => {
    render(<MemoryRouter initialEntries={['/catalog']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Каталог' })).toBeInTheDocument()
    expect(screen.getAllByTestId('catalog-mobile-row')).toHaveLength(6)
    expect(screen.getAllByTestId('catalog-root-card')).toHaveLength(6)
  })

  it('uses one category landing template for a generic first-level section', () => {
    render(<MemoryRouter initialEntries={['/catalog/lifting-equipment']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Подъёмное оборудование' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toBeInTheDocument()
    expect(screen.getAllByTestId('catalog-section-row').length).toBeGreaterThan(5)
  })

  it('shows 404 for an unknown first-level catalog slug', () => {
    render(<MemoryRouter initialEntries={['/catalog/not-a-category']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })

  it('opens the first-level compressor category', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Компрессорное оборудование' })).toBeInTheDocument()
    const desktopDetail = document.querySelector('.catalog-category-detail')!
    expect(within(desktopDetail).getByRole('link', { name: /Винтовые компрессоры/ })).toHaveAttribute('href', '/catalog/compressor-equipment/screw-compressors')
  })

  it('opens the reusable second-level category with catalog breadcrumbs', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/screw-compressors']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Винтовые компрессоры' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('href', '/catalog')
    expect(screen.getByRole('heading', { name: 'Быстрый выбор по параметрам' })).toBeInTheDocument()
  })

  it('orders child sections, quick tags, listing and SEO information', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/screw-compressors']}><App /></MemoryRouter>)

    const childSections = screen.getByRole('region', { name: 'Дочерние разделы' })
    const tags = screen.getByRole('heading', { name: 'Быстрый выбор по параметрам' }).closest('section')!
    const listing = screen.getByRole('heading', { name: 'Подбор оборудования' }).closest('section')!
    const seo = screen.getByRole('region', { name: 'О винтовых компрессорах' })
    expect(childSections.querySelectorAll('a')).toHaveLength(6)
    expect(childSections).toHaveTextContent('Винтовые компрессоры на ресивере')
    expect(childSections.compareDocumentPosition(tags) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(tags.compareDocumentPosition(listing) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(listing.compareDocumentPosition(seo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('uses the same second-level template without reserving tag space', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/oil-free-compressors']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Безмасляные компрессоры' })).toBeInTheDocument()
    expect(document.querySelector('.catalog-tags')).toBeNull()
  })

  it('shows the prototype 404 page for an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/missing']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })
})
