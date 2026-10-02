import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

const open = () => render(<MemoryRouter initialEntries={['/contacts']}><App /></MemoryRouter>)

describe('contacts page', () => {
  it('shows demo contacts, points and a schematic map', () => {
    open()
    expect(screen.getByRole('heading', { level: 1, name: 'Контакты' })).toBeInTheDocument()
    expect(screen.getByText(/демонстрационные/i)).toBeInTheDocument()
    expect(screen.getAllByTestId('contact-point')).toHaveLength(3)
    expect(screen.getByRole('region', { name: 'Демонстрационная карта' })).toBeInTheDocument()
    expect(screen.getByText('contact@example.com')).toBeInTheDocument()
    expect(screen.queryByText(/маршрут построен/i)).not.toBeInTheDocument()
  })

  it('selects a point without changing the site region', async () => {
    const user = userEvent.setup()
    open()
    expect(screen.getByText('Город сайта: Ярославль')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'На карте: Демо-пункт выдачи' }))
    expect(screen.getByRole('button', { name: 'На карте: Демо-пункт выдачи' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(screen.getByRole('region', { name: 'Демонстрационная карта' })).getByRole('heading', { name: 'Демо-пункт выдачи' })).toBeInTheDocument()
    expect(screen.getByText('Город сайта: Ярославль')).toBeInTheDocument()
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
