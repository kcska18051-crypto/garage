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

  it('walks through review, delivery and success with a persistent summary', async () => {
    const user = userEvent.setup(); open('/checkout/review')
    expect(screen.getByRole('heading', { name: 'Проверка заказа' })).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Итоги заказа' })).toBeInTheDocument()
    await user.click(screen.getByLabelText('Оформляет организация'))
    expect(screen.getByLabelText('Организация')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Продолжить оформление' }))
    expect(screen.getByRole('heading', { name: 'Доставка и оплата' })).toBeInTheDocument()
    expect(screen.getByLabelText('Оплата по счёту')).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Подтвердить заказ' }))
    expect(screen.getByRole('heading', { name: 'Заказ принят' })).toBeInTheDocument()
    expect(screen.getByText(/Номер заказа/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Активные заказы' })).toHaveAttribute('href', '/profile/orders')
  })

  it('offers guest phone verification and another recipient', async () => {
    const user = userEvent.setup(); open('/checkout/review')
    await user.click(screen.getByLabelText('Оформить как гость'))
    expect(screen.getByLabelText('Имя покупателя')).toBeRequired()
    expect(screen.getByLabelText('Электронная почта')).toBeRequired()
    expect(screen.getByLabelText('Телефон покупателя')).toBeRequired()
    expect(screen.getByRole('button', { name: 'Получить код' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Получить код' }))
    expect(screen.getByRole('status')).toHaveTextContent('Код подтверждён')
    await user.click(screen.getByLabelText('Другой получатель'))
    expect(screen.getByLabelText('Имя получателя')).toBeInTheDocument()
    expect(screen.getByLabelText('Фамилия получателя')).toBeInTheDocument()
    expect(screen.getByLabelText('Телефон получателя')).toBeInTheDocument()
  })

  it('shows compact account data for personal and organization checkout', async () => {
    const user = userEvent.setup(); open('/checkout/review')
    expect(screen.getByLabelText('Телефон аккаунта')).toHaveAttribute('readonly')
    await user.click(screen.getByLabelText('Оформляет организация'))
    expect(screen.getByText('Реквизиты и ИНН загружены из профиля')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toHaveTextContent('Главная/Корзина/Проверка заказа')
  })
})
