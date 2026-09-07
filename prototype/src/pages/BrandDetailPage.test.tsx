import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('Remeza brand detail page', () => {
  it('renders the commercial brand structure and a reusable product listing', () => {
    render(<MemoryRouter initialEntries={['/brand/remeza/']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Оборудование Remeza' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toHaveTextContent('ГлавнаяБрендыRemeza')
    expect(screen.getByRole('link', { name: 'Перейти к товарам' })).toHaveAttribute('href', '#brand-products')
    expect(screen.getByRole('region', { name: 'Категории товаров Remeza' })).toBeInTheDocument()
    const popular = screen.getByRole('region', { name: 'Популярные товары Remeza' })
    expect(within(popular).getAllByRole('article').length).toBeGreaterThanOrEqual(4)
    expect(screen.getByRole('heading', { name: 'Все товары бренда' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'О бренде Remeza' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Преимущества покупки Remeza в Гараже' })).toHaveTextContent('требует согласования')
    expect(screen.getByRole('region', { name: 'Документы и материалы' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Полезные материалы о Remeza' })).toBeInTheDocument()
  })

  it('opens the existing consultation form and exposes brand metadata', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/brand/remeza/']}><App /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Получить консультацию' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.title).toContain('Remeza')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('Remeza')
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://kcska18051-crypto.github.io/garage/brand/remeza/')
  })

  it('links the product brand field to the approved brand page', () => {
    render(<MemoryRouter initialEntries={['/product/remeza-vk-10-gr-0001/']}><App /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Remeza' })).toHaveAttribute('href', '/brand/remeza/')
  })
})
