import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { seedDemoSession } from '../test/auth'

function open(path = '/cart') {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}
beforeEach(() => {
  seedDemoSession()
  localStorage.setItem('garage-cart-v2', JSON.stringify([{ id: 'product-1', quantity: 1 }, { id: 'product-2', quantity: 1 }]))
})
async function apply(code = '123') {
  const user = userEvent.setup()
  await user.clear(screen.getByLabelText('Промокод'))
  await user.paste(code)
  await user.click(screen.getByRole('button', { name: 'Применить промокод' }))
  return user
}

describe('applied promo is a persisted calculation, not a message', () => {
  it('does not present quote-only orders as free in the mobile hint', () => {
    localStorage.setItem('garage-cart-v2', JSON.stringify([{ id: 'compressor-8', quantity: 1 }]))
    open('/checkout/review')
    expect(screen.getByTestId('mobile-checkout-hint')).toHaveTextContent('Уточняется')
    expect(screen.getByTestId('order-total')).toHaveTextContent('Уточняется')
  })
  it('freezes the accepted amount when cart and promo later change', async () => {
    localStorage.setItem('garage-checkout-v2', JSON.stringify({ promoCode: '123', delivery: 'pickup', pickupCity: 'Ярославль', storeId: 'store', store: 'Демо-магазин' }))
    const user = userEvent.setup()
    const view = open('/checkout/review')
    await user.click(screen.getByTestId('checkout-submit'))
    expect(screen.getByRole('heading', { name: 'Заказ принят' })).toBeInTheDocument()
    view.unmount()
    const stored = JSON.parse(localStorage.getItem('garage-checkout-v2')!)
    stored.promoCode = undefined
    localStorage.setItem('garage-checkout-v2', JSON.stringify(stored))
    localStorage.setItem('garage-cart-v2', JSON.stringify([{ id: 'product-1', quantity: 9 }]))
    open('/checkout/success')
    expect(screen.getByTestId('order-total')).toHaveTextContent(/42\s120/)
  }, 15000)
  it('shows before/after prices and carries the same discounted total to checkout and success', async () => {
    const view = open()
    const user = await apply(' 123 ')
    expect(screen.getByRole('status')).toHaveTextContent('Промокод 123 применён — скидка 10%')
    expect(screen.getByTestId('order-total')).toHaveTextContent(/42\s120/)
    expect(screen.getByTestId('total-before-promo')).toHaveTextContent(/46\s800/)
    expect(screen.getAllByTestId('line-old-price')).toHaveLength(2)
    await user.click(screen.getByRole('link', { name: 'Перейти к оформлению' }))
    expect(screen.getByRole('complementary', { name: 'Итоги заказа' })).toHaveTextContent(/42\s120/)
    view.unmount()
    const checkout = open('/checkout/review')
    expect(screen.getByTestId('order-total')).toHaveTextContent(/42\s120/)
    checkout.unmount()
    open('/checkout/success')
    expect(screen.getByTestId('order-total')).toHaveTextContent(/42\s120/)
  }, 15000)
  it('rejects invalid codes, never stacks discount, and restores prices on removal', async () => {
    open()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Применить промокод' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Введите промокод')
    await apply('wrong')
    expect(screen.getByRole('alert')).toHaveTextContent('Промокод не найден')
    expect(screen.getByTestId('order-total')).toHaveTextContent(/46\s800/)
    await apply()
    await user.click(screen.getByRole('button', { name: 'Применить промокод' }))
    expect(screen.getByTestId('order-total')).toHaveTextContent(/42\s120/)
    await apply('wrong')
    expect(screen.getByTestId('order-total')).toHaveTextContent(/42\s120/)
    await user.click(screen.getByRole('button', { name: 'Удалить промокод' }))
    expect(screen.getByTestId('order-total')).toHaveTextContent(/46\s800/)
    expect(screen.queryByTestId('promo-discount')).not.toBeInTheDocument()
  }, 15000)
  it('recalculates only selected lines and keeps zero selection through quantity changes', async () => {
    open()
    const user = await apply()
    const lines = screen.getAllByTestId('cart-line')
    await user.click(within(lines[1]).getByRole('checkbox'))
    expect(screen.getByTestId('order-total')).toHaveTextContent(/17\s010/)
    await user.click(within(lines[0]).getByRole('button', { name: 'Увеличить количество' }))
    expect(screen.getByTestId('order-total')).toHaveTextContent(/34\s020/)
    await user.click(within(lines[0]).getByRole('checkbox'))
    await user.click(within(lines[0]).getByRole('button', { name: 'Увеличить количество' }))
    expect(screen.getByTestId('order-total')).toHaveTextContent('0 ₽')
    expect(screen.queryByTestId('promo-discount')).not.toBeInTheDocument()
  }, 15000)
})
