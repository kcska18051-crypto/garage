import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

describe('new products showcase', () => {
  it('uses the compact shared product teaser contract', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    const card = document.querySelector<HTMLElement>('.product-card')!

    expect(card).toHaveClass('product-teaser')
    expect(card.querySelector('[data-testid="product-gallery"]')).toBeInTheDocument()
    expect(card.querySelectorAll('[data-testid="product-gallery-dot"]')).toHaveLength(3)
    expect(card).toHaveTextContent('Артикул:')
    expect(card.querySelector('.product-teaser__availability')).toHaveTextContent(/В наличии в \d+ магазин|Под заказ|Нет в наличии|Снят с производства/)
  })

  it('updates shared header badges from real product actions', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><App /></MemoryRouter>)
    const favoriteAction = screen.getAllByRole('link', { name: /^Избранное(?:: \d+)?$/ })[0]
    const initialFavoriteCount = Number(favoriteAction.getAttribute('aria-label')?.match(/\d+/)?.[0] ?? 0)
    await user.click(screen.getAllByRole('button', { name: /Добавить в избранное/ })[0])
    expect(screen.getAllByLabelText(`Избранное: ${initialFavoriteCount + 1}`).length).toBeGreaterThan(0)
    const cartAction = screen.getAllByRole('link', { name: /^Корзина(?:: \d+)?$/ })[0]
    const initialCartCount = Number(cartAction.getAttribute('aria-label')?.match(/\d+/)?.[0] ?? 0)
    await user.click(screen.getAllByRole('button', { name: /Добавить в корзину/ })[0])
    expect(screen.getAllByLabelText(`Корзина: ${initialCartCount + 1}`).length).toBeGreaterThan(0)
  }, 10_000)
})
