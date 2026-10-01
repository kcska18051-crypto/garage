import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

describe('profile documents', () => {
  it('filters documents and previews only available files', async () => {
    const user = userEvent.setup(); open('/profile/documents')
    expect(screen.getByRole('link', { name: 'Документы' })).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: 'Организации' }))
    expect(screen.getAllByText(/ООО «АвтоПрофи»/).length).toBeGreaterThan(1)
    await user.type(screen.getByRole('searchbox', { name: 'Поиск документов' }), 'несуществующий')
    expect(screen.getByText('По вашему запросу документов нет')).toBeInTheDocument()
    await user.clear(screen.getByRole('searchbox', { name: 'Поиск документов' }))
    await user.click(screen.getByRole('tab', { name: 'Все' }))
    await user.click(screen.getAllByRole('button', { name: 'Посмотреть документ' })[0])
    expect(screen.getByRole('dialog', { name: 'Предпросмотр документа' })).toBeInTheDocument()
    expect(screen.getByText('Формируется').closest('article')).not.toHaveTextContent('Скачать')
  })

  it('shows a preparation state instead of a fake downloaded file', async () => {
    const user = userEvent.setup(); open('/profile/documents')
    await user.click(screen.getAllByRole('button', { name: 'Скачать документ' })[0])
    expect(screen.getByRole('status')).toHaveTextContent('Подготавливаем демонстрационный файл')
  })
})

describe('profile help', () => {
  it('searches questions, opens an answer and validates a request', async () => {
    const user = userEvent.setup(); open('/profile/help')
    await user.type(screen.getByRole('searchbox', { name: 'Поиск по вопросам' }), 'возврат')
    expect(screen.getByRole('button', { name: /Как оформить возврат/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Как оформить возврат/ }))
    expect(screen.getByText(/сохраните комплектность/i)).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Задать вопрос' }))
    await user.click(screen.getByRole('button', { name: 'Отправить обращение' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Введите текст вопроса')
    await user.type(screen.getByLabelText('Текст вопроса'), 'Нужна консультация по заказу')
    await user.click(screen.getByRole('button', { name: 'Отправить обращение' }))
    expect(screen.getByRole('status')).toHaveTextContent('Спасибо! Ваше обращение отправлено')
    expect(screen.getByRole('link', { name: 'Перейти к обращениям' })).toHaveAttribute('href', '/profile/services')
  })
})

describe('profile recovery', () => {
  it('supports neutral phone, invalid, expired, resend and successful code states', async () => {
    const user = userEvent.setup(); open('/profile/recovery')
    await user.type(screen.getByLabelText('Номер телефона'), '+7 999 000-00-00')
    await user.click(screen.getByRole('button', { name: 'Получить код' }))
    expect(screen.getByText(/Если номер связан с профилем/)).toBeInTheDocument()
    await user.type(screen.getByLabelText('Код подтверждения'), '9999')
    await user.click(screen.getByRole('button', { name: 'Подтвердить доступ' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Неверный код')
    await user.clear(screen.getByLabelText('Код подтверждения')); await user.type(screen.getByLabelText('Код подтверждения'), '0000')
    await user.click(screen.getByRole('button', { name: 'Подтвердить доступ' }))
    expect(screen.getByRole('alert')).toHaveTextContent('истёк')
    await user.click(screen.getByRole('button', { name: 'Отправить код повторно' }))
    expect(screen.getByRole('status')).toHaveTextContent('Новый код отправлен')
    await user.type(screen.getByLabelText('Код подтверждения'), '1234')
    await user.click(screen.getByRole('button', { name: 'Подтвердить доступ' }))
    expect(screen.getByRole('heading', { name: 'Доступ подтверждён' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Перейти в личный кабинет' })).toHaveAttribute('href', '/profile')
  })
})

describe('profile addresses', () => {
  it('adds, edits, maps, promotes and deletes addresses with confirmation', async () => {
    const user = userEvent.setup(); open('/profile/addresses')
    await user.click(screen.getByRole('button', { name: 'Добавить адрес' }))
    await user.click(screen.getByRole('button', { name: 'Сохранить адрес' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Заполните город, улицу и дом')
    await user.type(screen.getByLabelText('Название адреса'), 'Склад')
    await user.type(screen.getByLabelText('Город'), 'Ярославль')
    await user.type(screen.getByLabelText('Улица'), 'Свободы')
    await user.click(screen.getByRole('button', { name: /Ярославль, ул. Свободы/ }))
    await user.type(screen.getByLabelText('Дом'), '18')
    await user.click(screen.getByRole('button', { name: 'Сохранить адрес' }))
    const card = screen.getByTestId('address-card').lastElementChild as HTMLElement
    expect(within(card).getByText('Склад')).toBeInTheDocument()
    await user.click(within(card).getByRole('button', { name: 'Показать на карте' }))
    expect(screen.getByRole('dialog', { name: 'Адрес на карте' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Закрыть диалог' }))
    await user.click(within(card).getByRole('button', { name: 'Сделать основным' }))
    expect(within(card).getByText('Основной')).toBeInTheDocument()
    await user.click(within(card).getByRole('button', { name: 'Удалить адрес' }))
    await user.click(within(screen.getByRole('dialog', { name: 'Удалить адрес' })).getByRole('button', { name: 'Удалить' }))
    expect(screen.queryByText('Склад')).not.toBeInTheDocument()
  })

  it('makes saved addresses available in courier checkout', async () => {
    const user = userEvent.setup(); open('/profile/addresses')
    await user.click(screen.getByRole('link', { name: /Корзина/ }))
    await user.click(screen.getByRole('link', { name: 'Перейти к оформлению' }))
    await user.click(screen.getByRole('tab', { name: /Курьером/ }))
    expect(screen.getByRole('button', { name: /Дом — Ярославль/ })).toBeInTheDocument()
  })
})
