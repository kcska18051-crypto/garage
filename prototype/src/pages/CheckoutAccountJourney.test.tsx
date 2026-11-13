import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { seedDemoSession } from '../test/auth'
import { demoIdentityKey, demoSessionKey } from '../state/AuthState'
import { orderHistoryStorageKey, readOrderHistory } from '../state/orderHistory'
import { contactPoints } from '../data/contactsData'

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}
function prepareCheckout(organization = false) {
  seedDemoSession()
  const point = contactPoints.find(item => item.city === 'Ярославль')!
  localStorage.setItem('garage-cart-v2', JSON.stringify([{ id:'product-1', quantity:1 }]))
  localStorage.setItem('garage-checkout-v2', JSON.stringify({
    customerType:organization ? 'organization' : 'personal', organization:'ООО «Гараж»', organizationInn:'7600000000',
    delivery:'pickup', store:`${point.city} — ${point.name}, ${point.address}`, storeId:point.id, pickupCity:point.city,
    payment:organization ? 'invoice' : 'card', otherRecipient:true,
    recipientName:'Иван', recipientLastName:'Петров', recipientPhone:'+7 999 111-22-33',
  }))
}

it('connects checkout, receipt and a persistent order owned by the signed-in account', async () => {
  const user = userEvent.setup()
  prepareCheckout()
  let view = renderAt('/checkout/review')
  await user.dblClick(screen.getByRole('button', { name:'Оформить заказ' }))
  expect(screen.getByRole('heading', { name:'Заказ принят' })).toBeInTheDocument()
  const [record] = readOrderHistory()
  expect(readOrderHistory()).toHaveLength(1)
  expect(JSON.parse(localStorage.getItem('garage-cart-v2')!)).toEqual([])
  expect(record.ownerPhone).toBe('79000000000')
  expect(record.order.recipient.phone).toBe('+7 999 111-22-33')
  expect(record.order.total).toBe('18 900 ₽')
  expect(screen.getByText(`Номер заказа: ${record.order.number}`)).toBeInTheDocument()
  await user.click(screen.getByRole('link', { name:'Посмотреть заказ' }))
  expect(screen.getByRole('heading', { name:`Заказ № ${record.order.number}` })).toBeInTheDocument()
  expect(screen.getByText('Домкрат подкатной профессиональный')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name:'Отменить заказ' }))
  await user.click(within(screen.getByRole('dialog', { name:'Отменить заказ' })).getByRole('button', { name:'Отправить заявку' }))
  view.unmount()
  view = renderAt(`/profile/orders/${record.order.id}`)
  expect(screen.getByText('Заявка на отмену отправлена')).toBeInTheDocument()
  expect(readOrderHistory()).toHaveLength(1)
  view.unmount()
  sessionStorage.setItem(demoIdentityKey, JSON.stringify({ phone:'79995554433', phoneConfirmed:true }))
  view = renderAt(`/profile/orders/${record.order.id}`)
  expect(screen.getByRole('heading', { name:'Заказ не найден' })).toBeInTheDocument()
  view.unmount()
  sessionStorage.removeItem(demoIdentityKey)
  renderAt(`/profile/orders/${record.order.id}`)
  expect(screen.getByRole('heading', { name:`Заказ № ${record.order.number}` })).toBeInTheDocument()
}, 15_000)

it('opens a corporate order directly and keeps its receipt snapshot after cart changes/reload', async () => {
  const user = userEvent.setup()
  prepareCheckout(true)
  let view = renderAt('/checkout/review')
  await user.click(screen.getByRole('button', { name:'Оформить заказ' }))
  const [record] = readOrderHistory()
  expect(record.order.kind).toBe('organization')
  expect(record.order.organization).toBe('ООО «Гараж»')
  expect(record.order.payment).toBe('Оплата по счёту')
  view.unmount()
  localStorage.setItem('garage-cart-v2', JSON.stringify([{ id:'product-4', quantity:7 }]))
  view = renderAt('/checkout/success')
  expect(screen.getByText(`Номер заказа: ${record.order.number}`)).toBeInTheDocument()
  expect(screen.getByRole('heading', { name:'Итог заказа' }).parentElement).toHaveTextContent('18 900 ₽')
  expect(readOrderHistory()).toHaveLength(1)
  await user.click(screen.getByRole('link', { name:'Посмотреть заказ' }))
  expect(screen.getByRole('heading', { name:`Заказ № ${record.order.number}` })).toBeInTheDocument()
  view.unmount()
  sessionStorage.setItem(demoIdentityKey, JSON.stringify({ phone:'79995554433', phoneConfirmed:true }))
  renderAt('/checkout/success')
  expect(screen.getByRole('heading', { name:'Заказ недоступен' })).toBeInTheDocument()
}, 15_000)

it('keeps a completed local journey usable when order history cannot be written', async () => {
  const user = userEvent.setup()
  prepareCheckout()
  const set = Storage.prototype.setItem
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, key, value) {
    if (key === orderHistoryStorageKey) throw new Error('storage unavailable')
    set.call(this, key, value)
  })
  try {
    renderAt('/checkout/review')
    await user.click(screen.getByRole('button', { name:'Оформить заказ' }))
    await user.click(screen.getByRole('link', { name:'Посмотреть заказ' }))
    expect(screen.getByRole('heading', { name:/Заказ № GR-/ })).toBeInTheDocument()
  } finally { spy.mockRestore() }
}, 15_000)

it('retains the old direct demo success screen without a saved confirmation', () => {
  renderAt('/checkout/success')
  expect(screen.getByRole('heading', { name:'Заказ принят' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name:'Активные заказы' })).toHaveAttribute('href','/profile/orders')
})

it('keeps checkout actionable and explains that guests can sign in after clicking', async () => {
  const user = userEvent.setup()
  prepareCheckout()
  sessionStorage.removeItem(demoSessionKey)
  sessionStorage.removeItem(demoIdentityKey)
  renderAt('/checkout/review')
  const submit = screen.getByTestId('checkout-submit')
  expect(submit).toBeEnabled()
  expect(submit).not.toHaveAttribute('aria-disabled')
  expect(submit).not.toHaveClass('is-inactive')
  expect(submit).toHaveAccessibleDescription('После нажатия можно войти или зарегистрироваться.')
  await user.click(submit)
  expect(screen.getByRole('dialog', {name:'Вход и регистрация'})).toBeInTheDocument()
})

it('removes only ordered lines and preserves the receipt and unselected goods across reloads', async () => {
  const user = userEvent.setup()
  prepareCheckout()
  localStorage.setItem('garage-cart-v2', JSON.stringify([{id:'product-1',quantity:1},{id:'product-4',quantity:2}]))
  const checkout = JSON.parse(localStorage.getItem('garage-checkout-v2')!)
  localStorage.setItem('garage-checkout-v2', JSON.stringify({...checkout,selectedCartIds:['product-1']}))
  let view = renderAt('/checkout/review')
  await user.click(screen.getByRole('button', {name:'Оформить заказ'}))
  expect(screen.getByRole('heading', {name:'Заказ принят'})).toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem('garage-cart-v2')!)).toEqual([{id:'product-4',quantity:2}])
  expect(JSON.parse(localStorage.getItem('garage-checkout-v2')!).selectedCartIds).toEqual([])
  expect(readOrderHistory()[0].order.items).toEqual([expect.objectContaining({productId:'product-1',quantity:1})])
  view.unmount()
  view = renderAt('/checkout/success')
  expect(screen.getByRole('heading', {name:'Итог заказа'}).parentElement).toHaveTextContent('18 900 ₽')
  expect(screen.getByRole('heading', {name:'Состав заказа'}).parentElement).toHaveTextContent('Домкрат подкатной профессиональный')
  expect(readOrderHistory()).toHaveLength(1)
  view.unmount()
  renderAt('/cart')
  expect(screen.getAllByTestId('cart-line')).toHaveLength(1)
  expect(screen.getByRole('checkbox', {name:'Выбрать все товары'})).not.toBeChecked()
  expect(JSON.parse(localStorage.getItem('garage-cart-v2')!)).toEqual([{id:'product-4',quantity:2}])
}, 15_000)
