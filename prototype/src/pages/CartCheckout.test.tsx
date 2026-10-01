import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

describe('cart and checkout', () => {
  it('shows detailed cart lines and syncs the badge to total quantity', async () => {
    const user = userEvent.setup(); open('/cart')
    expect(screen.getByRole('heading', { name: 'Корзина' })).toBeInTheDocument()
    expect(screen.getAllByTestId('cart-line')).toHaveLength(2)
    expect(screen.getByText('В наличии в 1 магазине')).toBeInTheDocument()
    expect(screen.getByText('В наличии в 3 магазинах')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Корзина: 3' })).toBeInTheDocument()
    expect(screen.getByText('3 товара на сумму')).toBeInTheDocument()
    await user.click(within(screen.getAllByTestId('cart-line')[0]).getByRole('button', { name: 'Увеличить количество' }))
    expect(screen.getByRole('link', { name: 'Корзина: 4' })).toBeInTheDocument()
    expect(screen.getByText('Итого к оформлению')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Выбрать все товары' })).toBeChecked()
    expect(screen.getByText('4 товара на сумму')).toBeInTheDocument()
    expect(screen.getAllByTestId('cart-recommendation')).toHaveLength(3)
  })

  it('recalculates selected goods and applies a demonstration promo code', async () => {
    const user = userEvent.setup(); open('/cart')
    await user.click(screen.getByRole('checkbox', { name: /Выбрать Компрессор поршневой Remeza/ }))
    expect(screen.getByText('2 товара на сумму')).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Итоги заказа' })).toHaveTextContent('55 800 ₽')
    await user.type(screen.getByLabelText('Промокод'), 'GARAGE-DEMO')
    await user.click(screen.getByRole('button', { name: 'Применить промокод' }))
    expect(screen.getByRole('status')).toHaveTextContent('Промокод применён для демонстрации')
  })

  it('moves a cart line to favorites and supports the empty state', async () => {
    const user = userEvent.setup(); open('/cart')
    await user.click(within(screen.getAllByTestId('cart-line')[0]).getByRole('button', { name: 'Перенести в избранное' }))
    expect(screen.getAllByTestId('cart-line')).toHaveLength(1)
    await user.click(within(screen.getByTestId('cart-line')).getByRole('button', { name: 'Удалить товар' }))
    expect(screen.getByRole('heading', { name: 'Корзина пуста' })).toBeInTheDocument()
  })

  it('renders one-page checkout for an authorized customer without guest or stepper UI', () => {
    open('/checkout/review')
    expect(screen.getByRole('heading', { name: 'Оформление заказа' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Вернуться в корзину' })).toHaveAttribute('href', '/cart')
    expect(screen.getByLabelText('Имя пользователя')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Подтверждённый телефон')).toHaveAttribute('readonly')
    expect(screen.queryByLabelText('Оформить как гость')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Этапы оформления')).not.toBeInTheDocument()
    expect(screen.queryByText(/Спасибо/i)).not.toBeInTheDocument()
  })

  it('switches recipient and legal entity states without losing the compact account flow', async () => {
    const user = userEvent.setup(); open('/checkout/review')
    await user.click(screen.getByLabelText('Заберёт другой человек'))
    expect(screen.getByLabelText('Имя получателя')).toBeRequired()
    expect(screen.getByLabelText('Фамилия получателя')).toBeRequired()
    expect(screen.getByLabelText('Телефон получателя')).toBeRequired()
    expect(screen.getByText(/код подтверждения/i)).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Купить как юридическое лицо' }))
    expect(screen.getByLabelText('Организация')).toBeInTheDocument()
    expect(screen.getByLabelText('Поиск организации по ИНН')).toBeInTheDocument()
    expect(screen.getByLabelText('Оплата по счёту')).toBeChecked()
  })

  it('switches all delivery modes, preserves selections and updates summary and payments', async () => {
    const user = userEvent.setup(); open('/checkout/review')
    await user.click(screen.getByRole('tab', { name: /Самовывоз/ }))
    await user.click(screen.getByRole('button', { name: 'Выбрать пункт выдачи' }))
    expect(screen.getByText('Пункт выдачи в выбранном городе')).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Итоги заказа' })).toHaveTextContent('Самовывоз')
    await user.click(screen.getByRole('tab', { name: /Курьером/ }))
    await user.click(screen.getByRole('button', { name: 'Указать адрес доставки' }))
    await user.type(screen.getByLabelText('Адрес доставки'), 'ул. Примерная, 10')
    expect(screen.getByRole('complementary', { name: 'Итоги заказа' })).toHaveTextContent('Курьером')
    await user.click(screen.getByRole('tab', { name: /Транспортная компания/ }))
    expect(screen.getByLabelText('При получении')).toBeDisabled()
    await user.click(screen.getByRole('tab', { name: /Курьером/ }))
    expect(screen.getByLabelText('Адрес доставки')).toHaveValue('ул. Примерная, 10')
    expect(screen.queryByText(/Спасибо/i)).not.toBeInTheDocument()
  })

  it('validates the first incomplete block and completes a valid order', async () => {
    const user = userEvent.setup(); open('/checkout/review')
    await user.click(screen.getByRole('button', { name: 'Оформить заказ' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Выберите способ получения')
    await user.click(screen.getByRole('tab', { name: /Самовывоз/ }))
    await user.click(screen.getByRole('button', { name: 'Выбрать пункт выдачи' }))
    await user.click(screen.getByLabelText('Картой онлайн'))
    await user.click(screen.getByRole('button', { name: 'Оформить заказ' }))
    expect(screen.getByRole('heading', { name: 'Заказ принят' })).toBeInTheDocument()
  })
})
