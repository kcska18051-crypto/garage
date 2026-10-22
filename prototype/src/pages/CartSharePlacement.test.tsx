import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'
import {decodeCart} from '../data/sharedCartData'

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear()
  localStorage.setItem('garage-cart-v2', JSON.stringify([{id: 'product-1', quantity: 1}, {id: 'product-2', quantity: 2}]))
})
const open = () => render(<MemoryRouter initialEntries={['/cart']}><App/></MemoryRouter>)

it('places one share action in the products toolbar while keeping proposal and credit in totals', async () => {
  const user = userEvent.setup(); open()
  const toolbar = screen.getByRole('toolbar', {name: 'Действия с товарами'})
  const share = within(toolbar).getByRole('button', {name: 'Поделиться корзиной'})
  expect(share.querySelector('svg')).toBeInTheDocument()
  expect(within(toolbar).getByRole('checkbox', {name: 'Выбрать все товары'})).toBeInTheDocument()
  expect(screen.getAllByRole('button', {name: 'Поделиться корзиной'})).toHaveLength(1)
  const summary = within(screen.getByRole('complementary', {name: 'Итоги заказа'}))
  expect(summary.queryByRole('button', {name: 'Поделиться корзиной'})).not.toBeInTheDocument()
  expect(summary.getByRole('button', {name: 'Коммерческое предложение'})).toBeInTheDocument()
  expect(summary.getByRole('button', {name: 'Купить в кредит'})).toBeInTheDocument()
  const second = within(screen.getAllByTestId('cart-line')[1])
  await user.click(second.getByRole('checkbox'))
  await user.click(share)
  const dialog = within(screen.getByRole('dialog', {name: 'Поделиться корзиной'}))
  const url = new URL((dialog.getByLabelText('Ссылка на корзину') as HTMLInputElement).value)
  expect(decodeCart(url.searchParams.get('shared')!)).toEqual([{id: 'product-1', quantity: 1}])
  await user.keyboard('{Escape}')
  expect(share).toHaveFocus()
})

it('retains empty-selection feedback at the relocated share control', async () => {
  const user = userEvent.setup(); open()
  const toolbar = within(screen.getByRole('toolbar', {name: 'Действия с товарами'}))
  await user.click(toolbar.getByRole('checkbox'))
  await user.click(toolbar.getByRole('button', {name: 'Поделиться корзиной'}))
  expect(toolbar.getByRole('status')).toHaveTextContent('Выберите хотя бы один товар')
  expect(screen.queryByRole('dialog', {name: 'Поделиться корзиной'})).not.toBeInTheDocument()
})
