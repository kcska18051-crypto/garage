import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { relatedForCart } from '../data/productRelations'

describe('remaining cart sections', () => {
  it.each([['product-1', 1], ['product-2', 5], ['product-3', 6], ['product-4', 7], ['product-5', 8]] as const)('has %s independent related products', (id, count) => {
    const products = relatedForCart(id)
    expect(products).toHaveLength(count)
    expect(new Set(products.map(p => p.id)).size).toBe(count)
    expect(products.some(p => p.id.startsWith('option-'))).toBe(false)
  })
  it('keeps entry voluntary and tools beside checkout', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/cart']}><App /></MemoryRouter>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Алексей Смирнов')).not.toBeInTheDocument()
    const summary = screen.getByRole('complementary', { name: 'Итоги заказа' })
    expect(within(summary).getByRole('button', { name: 'Коммерческое предложение' })).toBeInTheDocument()
    expect(within(summary).queryByRole('button', { name: 'Поделиться корзиной' })).not.toBeInTheDocument()
    expect(within(screen.getByRole('toolbar', {name: 'Действия с товарами'})).getByRole('button', { name: 'Поделиться корзиной' }).querySelector('svg')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Войти или зарегистрироваться' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  it('shows actual visited products, not a seeded recommendation list', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/cart']}><App /></MemoryRouter>)
    expect(screen.queryByRole('region', { name: 'Просмотренные товары' })).not.toBeInTheDocument()
    await user.click(document.querySelector('.cart-line__image')!)
    await user.click(screen.getAllByRole('link', { name: /^Корзина/ })[0])
    const viewed = screen.getByRole('region', { name: 'Просмотренные товары' })
    expect(viewed.querySelectorAll('.product-teaser')).toHaveLength(1)
    expect(within(viewed).queryByRole('button', { name: /Очистить/ })).not.toBeInTheDocument()
  })
  it('opens contextual stores without claiming stock for an unknown location', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/cart']}><App /></MemoryRouter>)
    await user.click(screen.getAllByRole('button', { name: /^Наличие в магазинах:/ })[0])
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Ярославль')
    expect(dialog).toHaveTextContent('Демонстрационный адрес, дом 1')
    expect(dialog).toHaveTextContent('Наличие в этой точке уточняется')
  })
})
