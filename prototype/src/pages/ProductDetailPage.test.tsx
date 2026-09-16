import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('Remeza VK 10 product detail', () => {
  it('renders the independent product route with informational brand and prototype commercial data', () => {
    render(<MemoryRouter initialEntries={['/product/remeza-vk-10-gr-0001/']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Remeza ВК 10' })).toBeInTheDocument()
    const productBrand = screen.getByText('Remeza', { selector: '.product-identity__brand' })
    expect(productBrand).toBeInTheDocument()
    expect(productBrand).toHaveAttribute('href', '/brand/remeza/')
    expect(screen.getAllByText(/демонстрацион/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('navigation', { name: 'Разделы товара' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Технические характеристики' })).toBeInTheDocument()
  })

  it('updates shared commerce counters and opens the gallery enlargement', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/product/remeza-vk-10-gr-0001/']}><App /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Добавить в сравнение' }))
    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
    await user.click(screen.getAllByRole('button', { name: 'В корзину' })[0])
    expect(screen.getAllByRole('link', { name: 'Сравнение: 1' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Избранное: 1' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Корзина: 1' }).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Увеличить изображение' }))
    expect(screen.getByRole('dialog', { name: 'Увеличенное изображение товара' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Закрыть изображение' }))
    expect(screen.queryByRole('dialog', { name: 'Увеличенное изображение товара' })).not.toBeInTheDocument()
  })

  it('switches between purchase and price-request states without changing the product URL', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/product/remeza-vk-10-gr-0001/']}><App /></MemoryRouter>)

    expect(screen.getByRole('group', { name: 'Демонстрация коммерческого состояния' })).toBeInTheDocument()
    expect(screen.getByText('185 000 ₽')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Уменьшить количество' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Увеличить количество' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Купить в один клик' })).toBeInTheDocument()
    expect(screen.getByText(/Доставка в городе/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Цена по запросу' }))

    expect(screen.getAllByText('Цена по запросу').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Запросить цену' })).toBeInTheDocument()
    expect(screen.getByText(/менеджер подтвердит цену и срок поставки/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Купить в один клик' })).not.toBeInTheDocument()
    expect(window.location.pathname).not.toContain('purchase')
    expect(window.location.search).toBe('')
  })

  it('shows the complete first-screen product information and gallery video entry', () => {
    render(<MemoryRouter initialEntries={['/product/remeza-vk-10-gr-0001/']}><App /></MemoryRouter>)

    expect(screen.getByText('Хит')).toBeInTheDocument()
    expect(screen.getByText('Новинка')).toBeInTheDocument()
    expect(screen.getByText('Акция')).toBeInTheDocument()
    expect(screen.getByText('Официальная гарантия')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5 вопросов · демо' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Видео о товаре' })).toBeInTheDocument()
    expect(screen.getByText('Объём ресивера')).toBeInTheDocument()
    expect(screen.getByText(/Физическим лицам и организациям/i)).toBeInTheDocument()
  })
})
