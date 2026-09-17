import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

describe('profile phone verification prototype', () => {
  it('keeps consents separate and demonstrates code errors, resend and success', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/profile/auth']}><App /></MemoryRouter>)

    expect(screen.getByRole('checkbox', { name: /обработку персональных данных/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /получать .*сообщения/i })).toBeInTheDocument()
    await user.type(screen.getByLabelText('Номер телефона'), '+7 900 123-45-67')
    await user.click(screen.getByRole('checkbox', { name: /обработку персональных данных/i }))
    await user.click(screen.getByRole('button', { name: 'Получить код' }))

    expect(screen.getByRole('heading', { name: 'Введите код из SMS' })).toBeInTheDocument()
    expect(screen.getByText(/повторно через 00:30/i)).toBeInTheDocument()
    await user.type(screen.getByLabelText('Код подтверждения'), '9999')
    await user.click(screen.getByRole('button', { name: 'Подтвердить' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Неверный код')

    await user.clear(screen.getByLabelText('Код подтверждения'))
    await user.type(screen.getByLabelText('Код подтверждения'), '0000')
    await user.click(screen.getByRole('button', { name: 'Подтвердить' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Код истёк')

    await user.click(screen.getByRole('button', { name: 'Отправить код повторно' }))
    expect(screen.getByRole('status')).toHaveTextContent('Новый код отправлен')
    await user.clear(screen.getByLabelText('Код подтверждения'))
    await user.type(screen.getByLabelText('Код подтверждения'), '1234')
    await user.click(screen.getByRole('button', { name: 'Подтвердить' }))
    expect(screen.getByRole('heading', { name: 'Номер подтверждён' })).toBeInTheDocument()
  })

  it('shows a compact working dashboard on the overview route', () => {
    render(<MemoryRouter initialEntries={['/profile']}><App /></MemoryRouter>)

    expect(screen.getByText('Здравствуйте, Алексей')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Активные заказы' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Последние просмотренные' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Мои организации' })).toHaveAttribute('href', '/profile/organizations')
  })
})
