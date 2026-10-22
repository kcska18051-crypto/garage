import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter} from 'react-router-dom'
import {App} from '../app/App'

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear()
  localStorage.setItem('garage-cart-v2', JSON.stringify([{id: 'product-1', quantity: 1}, {id: 'product-2', quantity: 2}]))
})
const open = () => render(<MemoryRouter initialEntries={['/cart']}><App/></MemoryRouter>)

it('shows the total discount beside the displayed prices and updates it on promo apply, deselection, removal and reload', async () => {
  const user = userEvent.setup(); let view = open()
  let [campaign, regular] = screen.getAllByTestId('cart-line').map(line => within(line))
  // Independently calculated: (21168-18900)/21168 = 10.714...%,
  // (21168-17010)/21168 = 19.642...%; the ordinary product receives only 10%.
  expect(campaign.getByTestId('line-discount-percent')).toHaveTextContent('−10,7%')
  expect(regular.queryByTestId('line-discount-percent')).not.toBeInTheDocument()
  await user.click(screen.getByLabelText('Промокод')); await user.paste('123')
  await user.click(screen.getByRole('button', {name: 'Применить промокод'}))
  expect(campaign.getByTestId('line-discount-percent')).toHaveTextContent('−19,6%')
  expect(campaign.getByTestId('line-discount-percent')).toHaveAccessibleName('Общая скидка 19,6%')
  expect(regular.getByTestId('line-discount-percent')).toHaveTextContent('−10%')
  expect(campaign.getByTestId('line-discount-percent').closest('.cart-line__price')).toContainElement(campaign.getByTestId('line-new-price'))
  await user.click(regular.getByRole('checkbox'))
  expect(regular.queryByTestId('line-discount-percent')).not.toBeInTheDocument()
  await user.click(regular.getByRole('checkbox'))
  await user.click(campaign.getByRole('button', {name: 'Увеличить количество'}))
  expect(campaign.getByTestId('line-discount-percent')).toHaveTextContent('−19,6%')
  await user.click(screen.getByRole('button', {name: 'Удалить промокод'}))
  expect(campaign.getByTestId('line-discount-percent')).toHaveTextContent('−10,7%')
  expect(regular.queryByTestId('line-discount-percent')).not.toBeInTheDocument()
  view.unmount(); view = open()
  ;[campaign, regular] = screen.getAllByTestId('cart-line').map(line => within(line))
  expect(campaign.getByTestId('line-discount-percent')).toHaveTextContent('−10,7%')
  expect(regular.queryByTestId('line-discount-percent')).not.toBeInTheDocument()
}, 15000)

it('does not invent a percentage for quote-only products', () => {
  localStorage.setItem('garage-cart-v2', JSON.stringify([{id: 'compressor-8', quantity: 1}]))
  localStorage.setItem('garage-checkout-v2', JSON.stringify({promoCode: '123'}))
  open()
  expect(screen.queryByTestId('line-discount-percent')).not.toBeInTheDocument()
  expect(screen.getByText('Цена по запросу')).toBeInTheDocument()
})
