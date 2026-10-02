import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { App } from '../../app/App'

function LocationEcho() {
  const location = useLocation()
  return <output aria-label="Текущий маршрут">{location.pathname}</output>
}

const open = (path = '/catalog') => render(<MemoryRouter initialEntries={[path]}><App /><LocationEcho /></MemoryRouter>)
const openFromHeader = async (user: ReturnType<typeof userEvent.setup>) => {
  open()
  await user.click(screen.getAllByRole('button', { name: 'Профиль' })[0])
  return screen.getByRole('dialog', { name: 'Вход и регистрация' })
}

beforeEach(() => localStorage.clear())

describe('unified auth dialog', () => {
  it('logs in by SMS from the header and opens the personal account', async () => {
    const user = userEvent.setup()
    const dialog = await openFromHeader(user)

    await user.type(within(dialog).getByLabelText('Номер телефона'), '+7 999 111-22-33')
    await user.click(within(dialog).getByRole('button', { name: 'Получить код' }))
    await user.type(within(dialog).getByLabelText('Код подтверждения'), '0000')
    await user.click(within(dialog).getByRole('button', { name: 'Войти' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Код истёк')
    await user.click(within(dialog).getByRole('button', { name: 'Отправить код повторно' }))
    expect(within(dialog).getByRole('status')).toHaveTextContent('Новый код отправлен')
    await user.type(within(dialog).getByLabelText('Код подтверждения'), '1234')
    await user.click(within(dialog).getByRole('button', { name: 'Войти' }))

    expect(screen.queryByRole('dialog', { name: 'Вход и регистрация' })).not.toBeInTheDocument()
    expect(screen.getByText(/Вы вошли в демонстрационный профиль/)).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Текущий маршрут' })).toHaveTextContent('/profile')
    expect(screen.getAllByRole('link', { name: 'Профиль' })[0]).toHaveAttribute('href', '/profile')
  })

  it('opens the personal account from the demo password tab without credentials', async () => {
    const user = userEvent.setup()
    const dialog = await openFromHeader(user)
    await user.click(within(dialog).getByRole('button', { name: 'По паролю' }))
    expect(within(dialog).getByText('Демонстрационный режим: нажмите «Войти», чтобы открыть личный кабинет. Заполнять поля не нужно.')).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Войти' }))
    expect(screen.getByRole('status', { name: 'Текущий маршрут' })).toHaveTextContent('/profile')
  })

  it('keeps checkout open after demo password entry without credentials', async () => {
    const user = userEvent.setup()
    open('/checkout/review')
    await user.click(screen.getByRole('button', { name: 'Войти или зарегистрироваться' }))
    const dialog = screen.getByRole('dialog', { name: 'Вход и регистрация' })
    await user.click(within(dialog).getByRole('button', { name: 'По паролю' }))
    await user.click(within(dialog).getByRole('button', { name: 'Войти' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Текущий маршрут' })).toHaveTextContent('/checkout/review')
  })

  it('supports both forgot-password choices without storing a password', async () => {
    const user = userEvent.setup()
    let dialog = await openFromHeader(user)
    await user.click(within(dialog).getByRole('button', { name: 'По паролю' }))
    await user.type(within(dialog).getByLabelText('Номер телефона'), '+7 900 000-00-00')
    await user.click(within(dialog).getByRole('button', { name: 'Забыли пароль?' }))
    await user.click(within(dialog).getByRole('button', { name: 'Войти по SMS' }))
    expect(within(dialog).getByText(/Код отправлен на \+7 900 000-00-00/)).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: /Назад/ }))

    await user.click(within(dialog).getByRole('button', { name: 'По паролю' }))
    await user.click(within(dialog).getByRole('button', { name: 'Забыли пароль?' }))
    await user.click(within(dialog).getByRole('button', { name: 'Восстановить пароль' }))
    await user.click(within(dialog).getByRole('button', { name: 'Получить код' }))
    await user.type(within(dialog).getByLabelText('Код подтверждения'), '1234')
    await user.click(within(dialog).getByRole('button', { name: 'Подтвердить' }))
    await user.type(within(dialog).getByLabelText('Новый пароль'), 'garage-new')
    await user.type(within(dialog).getByLabelText('Повторите пароль'), 'garage-other')
    await user.click(within(dialog).getByRole('button', { name: 'Сохранить пароль и войти' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Пароли не совпадают')
    await user.clear(within(dialog).getByLabelText('Повторите пароль'))
    await user.type(within(dialog).getByLabelText('Повторите пароль'), 'garage-new')
    await user.click(within(dialog).getByRole('button', { name: 'Сохранить пароль и войти' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const storedValues = Object.keys(localStorage).map((key) => localStorage.getItem(key)).join(' ')
    expect(storedValues).not.toContain('garage-new')
    expect(storedValues).not.toContain('garage-other')
  })

  it('registers a person, keeps non-secret fields on back and allows continuing without a password', async () => {
    const user = userEvent.setup()
    const dialog = await openFromHeader(user)
    await user.click(within(dialog).getByRole('tab', { name: 'Регистрация' }))
    await user.type(within(dialog).getByLabelText('Имя'), 'Ирина')
    await user.type(within(dialog).getByLabelText('Номер телефона'), '+7 999 222-33-44')
    await user.click(within(dialog).getByRole('checkbox', { name: /обработку персональных данных/i }))
    await user.click(within(dialog).getByRole('checkbox', { name: /условия сервиса/i }))
    await user.click(within(dialog).getByRole('button', { name: 'Продолжить' }))
    await user.click(within(dialog).getByRole('button', { name: /Назад/ }))
    expect(within(dialog).getByLabelText('Имя')).toHaveValue('Ирина')
    expect(within(dialog).getByLabelText('Номер телефона')).toHaveValue('+7 999 222-33-44')
    await user.click(within(dialog).getByRole('button', { name: 'Продолжить' }))
    await user.type(within(dialog).getByLabelText('Код подтверждения'), '1234')
    await user.click(within(dialog).getByRole('button', { name: 'Подтвердить' }))
    expect(within(dialog).getByRole('heading', { name: 'Создайте пароль — по желанию' })).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Продолжить без пароля' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Регистрация завершена', { exact: true })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Текущий маршрут' })).toHaveTextContent('/profile')
  })

  it('offers login for an existing phone and connects a company by INN', async () => {
    const user = userEvent.setup()
    let dialog = await openFromHeader(user)
    await user.click(within(dialog).getByRole('tab', { name: 'Регистрация' }))
    await user.type(within(dialog).getByLabelText('Имя'), 'Алексей')
    await user.type(within(dialog).getByLabelText('Номер телефона'), '+7 900 000-00-00')
    await user.click(within(dialog).getByRole('checkbox', { name: /обработку персональных данных/i }))
    await user.click(within(dialog).getByRole('checkbox', { name: /условия сервиса/i }))
    await user.click(within(dialog).getByRole('button', { name: 'Продолжить' }))
    await user.type(within(dialog).getByLabelText('Код подтверждения'), '1234')
    await user.click(within(dialog).getByRole('button', { name: 'Подтвердить' }))
    expect(within(dialog).getByRole('heading', { name: 'Аккаунт уже существует' })).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Войти по SMS' }))
    expect(within(dialog).getByRole('heading', { name: 'Введите код из SMS' })).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Закрыть' }))

    await user.click(screen.getAllByRole('button', { name: 'Профиль' })[0])
    dialog = screen.getByRole('dialog', { name: 'Вход и регистрация' })
    await user.click(within(dialog).getByRole('tab', { name: 'Регистрация' }))
    await user.type(within(dialog).getByLabelText('Имя'), 'Ирина')
    await user.type(within(dialog).getByLabelText('Номер телефона'), '+7 999 555-66-77')
    await user.click(within(dialog).getByRole('checkbox', { name: 'Для компании' }))
    await user.click(within(dialog).getByRole('checkbox', { name: /обработку персональных данных/i }))
    await user.click(within(dialog).getByRole('checkbox', { name: /условия сервиса/i }))
    await user.click(within(dialog).getByRole('button', { name: 'Продолжить' }))
    await user.type(within(dialog).getByLabelText('Код подтверждения'), '1234')
    await user.click(within(dialog).getByRole('button', { name: 'Подтвердить' }))
    await user.type(within(dialog).getByLabelText('ИНН организации'), '7600000028')
    await user.click(within(dialog).getByRole('button', { name: 'Найти организацию' }))
    expect(within(dialog).getByText('ООО «Гараж Профи»')).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Подключить организацию' }))
    await user.click(within(dialog).getByRole('button', { name: 'Продолжить без пароля' }))
    expect(screen.getByText(/Компания подключена, регистрация завершена/)).toBeInTheDocument()
  })

  it('opens legacy routes in the dialog and routes loss of phone access to help', async () => {
    const user = userEvent.setup()
    open('/profile/recovery')
    const dialog = await screen.findByRole('dialog', { name: 'Вход и регистрация' })
    expect(within(dialog).getByRole('heading', { name: 'Восстановление доступа' })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Текущий маршрут' })).toHaveTextContent('/')
    await user.click(within(dialog).getByRole('button', { name: 'Нет доступа к телефону' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Текущий маршрут' })).toHaveTextContent('/profile/help')
  })

  it('asks for a phone before SMS login opened from the direct recovery route', async () => {
    const user = userEvent.setup()
    open('/profile/recovery')
    const dialog = await screen.findByRole('dialog', { name: 'Вход и регистрация' })

    await user.click(within(dialog).getByRole('button', { name: 'Войти по SMS' }))

    expect(within(dialog).getByRole('heading', { name: 'Войдите в профиль' })).toBeInTheDocument()
    expect(within(dialog).getByLabelText('Номер телефона')).toHaveValue('')
    expect(within(dialog).getByRole('button', { name: 'Получить код' })).toBeInTheDocument()
  })
})
