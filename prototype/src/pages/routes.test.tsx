import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    const desktopCatalog = document.querySelector<HTMLElement>('.catalog-root-desktop')!
    expect(within(desktopCatalog).getByRole('link', { name: 'Компрессоры' })).toHaveAttribute('href', '/catalog/compressor-equipment')
  })

  it('renders the catalog root from the normalized six-category model', () => {
    render(<MemoryRouter initialEntries={['/catalog']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Каталог' })).toBeInTheDocument()
    expect(document.querySelector('.catalog-page__header p')).toBeNull()
    expect(screen.getAllByTestId('catalog-mobile-row')).toHaveLength(6)
    expect(screen.getAllByTestId('catalog-root-card')).toHaveLength(6)
  })

  it('uses one category landing template for a generic first-level section', () => {
    render(<MemoryRouter initialEntries={['/catalog/lifting-equipment']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Подъёмное оборудование' })).toBeInTheDocument()
    expect(document.querySelector('.catalog-page__header p')).toHaveTextContent('Подъёмники, домкраты и оборудование рабочих постов.')
    expect(document.querySelector('.catalog-subcategory-grid')).toBeNull()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toBeInTheDocument()
    expect(screen.getAllByTestId('catalog-section-row').length).toBeGreaterThan(5)
  })

  it('shows 404 for an unknown first-level catalog slug', () => {
    render(<MemoryRouter initialEntries={['/catalog/not-a-category']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })

  it('shows only linked subcategories on the first-level compressor page', async () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Компрессоры' })).toBeInTheDocument()
    expect(document.querySelector('.catalog-page__header p')).toBeNull()
    const sectionGrid = document.querySelector<HTMLElement>('.catalog-subcategory-grid')!
    expect(within(sectionGrid).getAllByTestId('catalog-subcategory-card')).toHaveLength(6)
    expect(within(sectionGrid).getByRole('link', { name: 'Винтовые компрессоры, 48 товаров' })).toHaveAttribute('href', '/catalog/compressor-equipment/screw-compressors')
    expect(within(sectionGrid).getByText('48 товаров')).toBeInTheDocument()
    expect(sectionGrid.querySelectorAll('.catalog-subcategory-card__art')).toHaveLength(6)
    expect(document.querySelector('.catalog-listing')).toBeNull()
    expect(document.querySelector('.catalog-related-brands')).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Бренды категории' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Подбор оборудования' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Винтовые компрессоры, 48 товаров' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Винтовые компрессоры' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Подбор оборудования' })).not.toBeInTheDocument()
  })

  it('opens the reusable second-level category with catalog breadcrumbs', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/screw-compressors']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Винтовые компрессоры' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('href', '/catalog')
    expect(screen.getByRole('region', { name: 'Быстрые параметры' })).toBeInTheDocument()
  })

  it('orders child sections, quick tags, listing and SEO information', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/screw-compressors']}><App /></MemoryRouter>)

    const childSections = screen.getByRole('region', { name: 'Дочерние разделы' })
    const listing = screen.getByRole('region', { name: 'Товарная выдача' })
    const tags = screen.getByRole('region', { name: 'Быстрые параметры' })
    const seo = screen.getByRole('region', { name: 'О винтовых компрессорах' })
    expect(screen.getByRole('heading', { level: 1, name: 'Винтовые компрессоры' }).parentElement).not.toHaveTextContent('Показано 12 из 48')
    expect(screen.queryByRole('heading', { name: 'Выберите тип оборудования' })).not.toBeInTheDocument()
    expect(childSections.querySelectorAll('a')).toHaveLength(6)
    expect(childSections.querySelectorAll('.catalog-child-sections__art')).toHaveLength(6)
    expect(childSections).toHaveTextContent('Винтовые компрессоры на ресивере')
    expect(screen.queryByRole('button', { name: /Показать ещё|Свернуть/ })).not.toBeInTheDocument()
    expect(childSections.compareDocumentPosition(listing) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(listing).toContainElement(tags)
    expect(listing.compareDocumentPosition(seo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('uses compact shared product teasers on the third catalog level', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/screw-compressors']}><App /></MemoryRouter>)
    const card = document.querySelector<HTMLElement>('.catalog-product-card')!

    expect(card).toHaveClass('product-teaser')
    expect(card.querySelector('[data-testid="product-gallery"]')).toBeInTheDocument()
    expect(card.querySelectorAll('[data-testid="product-gallery-dot"]')).toHaveLength(3)
    expect(card.querySelector('dl')).toBeNull()
    expect(card).toHaveTextContent(/В наличии в \d+ магазин|Под заказ|Нет в наличии|Снят с производства/)
    expect(card).toHaveTextContent('Артикул:')
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

    const main = screen.getByRole('main')
    expect(within(main).getByText('404')).toBeInTheDocument()
    expect(within(main).getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
    expect(within(main).getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/')
    expect(within(main).getByRole('link', { name: 'В каталог' })).toHaveAttribute('href', '/catalog')
    expect(within(main).queryByText('Такого адреса нет в текущей карте прототипа.')).not.toBeInTheDocument()
  })
})
