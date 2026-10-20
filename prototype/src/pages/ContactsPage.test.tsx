import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { contactPoints } from '../data/contactsData'

const open = () => render(<MemoryRouter initialEntries={['/contacts']}><App /></MemoryRouter>)

describe('contacts page', () => {
  it('shows demo contacts, points and a schematic map', () => {
    open()
    expect(screen.getByRole('heading', { level: 1, name: 'Контакты' })).toBeInTheDocument()
    expect(screen.getByText(/Контактные данные на странице демонстрационные/i)).toBeInTheDocument()
    expect(screen.getAllByTestId('contact-point')).toHaveLength(1)
    expect(screen.getByRole('img', { name: 'Карта пунктов получения' })).toBeInTheDocument()
    expect(screen.getByText('contact@example.com')).toBeInTheDocument()
    expect(screen.queryByText(/маршрут построен/i)).not.toBeInTheDocument()
  })

  it('synchronizes city, header, filtered points and map', async () => {
    const user = userEvent.setup()
    open()
    expect(screen.getByText('Город сайта: Ярославль')).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Город контактов'), 'Вологда')
    expect(screen.getByRole('radio', { name: /Демо-пункт выдачи/ })).toBeChecked()
    expect(screen.getByRole('button', { name: 'На карте: Демо-пункт выдачи' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('link', { name: /Подробнее:|О магазине/ })).not.toBeInTheDocument()
    expect(screen.getByText('Город сайта: Вологда')).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /Демо-магазин/ })).not.toBeInTheDocument()
  })

  it('shows an empty state for a site city without contact points', async () => {
    const user = userEvent.setup(); open()
    await user.click(screen.getAllByRole('button', { name: 'Выбрать город' })[0])
    await user.click(screen.getByRole('button', { name: 'Другой город' }))
    expect(screen.getByLabelText('Город контактов')).toHaveValue('Другой город')
    expect(screen.queryByTestId('contact-point')).not.toBeInTheDocument()
    expect(screen.getByText(/контактные точки пока не указаны/)).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: /Демо-магазин/ })).not.toBeInTheDocument()
  })

  it('shows details of an unselected point without selecting it or changing checkout', async () => {
    const user = userEvent.setup()
    localStorage.setItem('garage-checkout-v2', JSON.stringify({ storeId: 'pickup', store: 'Сохранённый пункт заказа', comment: 'Не менять', delivery: 'courier' }))
    contactPoints.push({ ...contactPoints[0], id: 'test-second-point', name: 'Вторая демо-точка' })
    try {
    open()
    const before = localStorage.getItem('garage-checkout-v2')
    const trigger = screen.getByRole('button', { name: 'Фото и как добраться: Вторая демо-точка' })
    await user.click(trigger)
    const panel = screen.getByRole('dialog', { name: /Вторая демо-точка/ })
    expect(within(panel).getByText(/Демонстрационные данные/)).toBeInTheDocument()
    expect(within(panel).getByRole('link', { name: '+7 (000) 000-00-01' })).toHaveAttribute('href','tel:+70000000001')
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(screen.getByRole('radio', { name: /Демо-магазин/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Вторая демо-точка/ })).not.toBeChecked()
    await user.click(screen.getByRole('radio', { name: /Вторая демо-точка/ }))
    expect(screen.getByRole('radio', { name: /Вторая демо-точка/ })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'На карте: Демо-магазин' }))
    expect(screen.getByRole('radio', { name: /Демо-магазин/ })).toBeChecked()
    expect(localStorage.getItem('garage-checkout-v2')).toBe(before)
    } finally { contactPoints.pop() }
  })

  it('validates and completes a demo message without sending personal data', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: 'Написать сообщение' }))
    const dialog = screen.getByRole('dialog', { name: 'Написать сообщение' })
    await user.click(within(dialog).getByRole('button', { name: 'Отправить сообщение' }))
    expect(within(dialog).getByText('Укажите имя')).toBeInTheDocument()
    expect(within(dialog).getByText('Подтвердите согласие')).toBeInTheDocument()
    await user.type(within(dialog).getByLabelText('Ваше имя'), 'Анна')
    await user.click(within(dialog).getByRole('radio', { name: 'Email' }))
    await user.type(within(dialog).getByLabelText('Email для ответа'), 'anna@example.com')
    await user.type(within(dialog).getByLabelText('Сообщение'), 'Нужна консультация по оборудованию')
    await user.click(within(dialog).getByRole('checkbox', { name: /обработку персональных данных/i }))
    await user.click(within(dialog).getByRole('button', { name: 'Отправить сообщение' }))
    expect(within(dialog).getByRole('status')).toHaveTextContent('Сообщение сохранено в демонстрационном режиме')
  })

  it('reuses the callback form with required name and phone', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: 'Заказать звонок' }))
    const dialog = screen.getByRole('dialog', { name: 'Заказать звонок' })
    await user.click(within(dialog).getByRole('button', { name: 'Отправить запрос' }))
    expect(within(dialog).getByText('Укажите имя')).toBeInTheDocument()
    await user.type(within(dialog).getByLabelText('Ваше имя'), 'Иван')
    await user.type(within(dialog).getByLabelText('Телефон'), '+7 000 000-00-00')
    await user.click(within(dialog).getByRole('button', { name: 'Отправить запрос' }))
    expect(within(dialog).getByRole('status')).toHaveTextContent('Запрос звонка сохранён в демонстрационном режиме')
  })
})
