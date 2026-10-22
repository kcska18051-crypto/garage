import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { promotionPrice } from '../data/promotionPricing'

const open = () => render(<MemoryRouter initialEntries={['/cart']}><App /></MemoryRouter>)
const number = (element: HTMLElement) => Number(element.textContent?.replace(/[^\d,]/g, '').replace(',', '.'))
beforeEach(() => localStorage.setItem('garage-cart-v2', JSON.stringify([{ id: 'product-1', quantity: 1 }, { id: 'product-2', quantity: 1 }])))

it('keeps the seeded cart a mixed promotional and regular example', () => {
  expect(promotionPrice('product-1', 18900).oldPrice).toBe(21168)
  expect(promotionPrice('product-2', 27900).oldPrice).toBeUndefined()
})

it('shows seven unique existing recommendations only in the first enhanced block', () => {
  open()
  const rails = document.querySelectorAll('.line-accessories__rail')
  expect(rails[0].querySelectorAll('article')).toHaveLength(7)
  const ids = [...rails[0].querySelectorAll('article')].map(item => item.getAttribute('data-related-id'))
  expect(new Set(ids).size).toBe(7)
  expect(ids.every(id => id?.startsWith('supply-'))).toBe(true)
  expect(rails[1].querySelectorAll('article')).toHaveLength(5)
})

it('restores campaign and regular prices through the actual remove-code button without duplicate totals', async () => {
  const user = userEvent.setup(); const view = open()
  let lines = screen.getAllByTestId('cart-line')
  expect(number(within(lines[0]).getByTestId('line-old-price'))).toBe(21168)
  expect(within(lines[1]).queryByTestId('line-old-price')).not.toBeInTheDocument()
  expect(number(screen.getByTestId('order-total'))).toBe(46800)
  await user.click(screen.getByLabelText('Промокод')); await user.paste('123')
  await user.click(screen.getByRole('button', { name: 'Применить промокод' }))
  expect(number(within(lines[0]).getByTestId('line-old-price'))).toBe(21168)
  expect(number(within(lines[0]).getByTestId('line-new-price'))).toBe(17010)
  expect(number(within(lines[1]).getByTestId('line-old-price'))).toBe(27900)
  expect(number(within(lines[1]).getByTestId('line-new-price'))).toBe(25110)
  expect(screen.queryByTestId('total-before-promo')).not.toBeInTheDocument()
  expect(screen.queryByText('С промокодом −10%')).not.toBeInTheDocument()
  expect(number(screen.getByTestId('order-total'))).toBe(42120)
  const breakdown = screen.getByRole('group', { name: 'Расшифровка скидок' })
  expect(breakdown).toHaveTextContent(/2\s268/)
  expect(breakdown).toHaveTextContent(/4\s680/)
  await user.click(screen.getByRole('button', { name: 'Удалить промокод' }))
  expect(number(screen.getByTestId('order-total'))).toBe(46800)
  expect(screen.getByRole('status')).toHaveTextContent('Промокод удалён')
  expect(screen.queryByTestId('promo-discount')).not.toBeInTheDocument()
  expect(within(lines[1]).queryByTestId('line-old-price')).not.toBeInTheDocument()
  expect(number(within(lines[0]).getByTestId('line-new-price'))).toBe(18900)
  expect(number(within(lines[1]).getByTestId('line-new-price'))).toBe(27900)
  view.unmount(); open()
  expect(number(screen.getByTestId('order-total'))).toBe(46800)
  expect(screen.queryByTestId('promo-discount')).not.toBeInTheDocument()
}, 15000)
