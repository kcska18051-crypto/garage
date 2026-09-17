import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

describe('profile orders', () => {
  it('switches personal and organization orders and repeats only available items', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/profile/orders']}><App /></MemoryRouter>)

    expect(screen.getByText('Получен')).toBeInTheDocument()
    expect(screen.getByText('Отменён')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'От организаций' }))
    expect(screen.getByText('ООО «АвтоПрофи»')).toBeInTheDocument()
    expect(screen.getByText('ИНН 7600000000')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Личные' }))
    const activeOrder = screen.getByTestId('order-order-102')
    await user.click(within(activeOrder).getByRole('button', { name: 'Повторить заказ' }))
    const dialog = screen.getByRole('dialog', { name: 'Повторить заказ' })
    expect(dialog).toHaveTextContent('цена, наличие и состав будут пересчитаны')
    expect(dialog).toHaveTextContent('Ресивер вертикальный')
    await user.click(within(dialog).getByRole('button', { name: 'Добавить доступные товары' }))
    expect(screen.getAllByRole('link', { name: 'Корзина: 2' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('status')).toHaveTextContent('2 товара добавлены в корзину')
  }, 15_000)

  it('creates a cancellation request instead of deleting the active order', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/profile/orders/order-102']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Заказ № GR-1024' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Отменить заказ' }))
    await user.click(within(screen.getByRole('dialog', { name: 'Отменить заказ' })).getByRole('button', { name: 'Отправить заявку' }))
    expect(screen.getByText('Заявка на отмену отправлена')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Отменить заказ' })).not.toBeInTheDocument()
  }, 15_000)

  it('edits the recipient and opens the delivery address on a demo map', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/profile/orders/order-102']}><App /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Изменить получателя' }))
    await user.clear(screen.getByLabelText('Имя получателя'))
    await user.type(screen.getByLabelText('Имя получателя'), 'Ирина')
    await user.click(screen.getByLabelText('Другой получатель'))
    await user.click(screen.getByRole('button', { name: 'Сохранить получателя' }))
    expect(screen.getByText('Получатель: Ирина Смирнов')).toBeInTheDocument()
    expect(screen.getByText('Заказ заберёт другой человек')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Показать на карте' }))
    expect(screen.getByRole('dialog', { name: 'Адрес на карте' })).toBeInTheDocument()
    await user.click(within(screen.getByRole('dialog', { name: 'Адрес на карте' })).getByRole('button', { name: 'Закрыть' }))

    await user.click(screen.getByRole('button', { name: 'Изменить адрес' }))
    await user.clear(screen.getByLabelText('Адрес доставки'))
    await user.type(screen.getByLabelText('Адрес доставки'), 'Свободы')
    await user.click(screen.getByRole('button', { name: 'Ярославль, ул. Свободы, 18' }))
    await user.click(screen.getByRole('button', { name: 'Сохранить адрес' }))
    expect(screen.getByText('Ярославль, ул. Свободы, 18')).toBeInTheDocument()
  }, 15_000)
})
