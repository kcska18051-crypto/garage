import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

describe('lower homepage sections', () => {
  it('shows confirmed content, omits conditional blocks and validates consultation', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Услуги' })).toBeVisible()
    expect(screen.getByRole('tab', { name: 'Статьи' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByRole('heading', { name: 'Отзывы' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Подписка' })).not.toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Получить консультацию' })[0])
    await user.click(screen.getByRole('button', { name: 'Отправить запрос' }))
    expect(screen.getByText('Укажите имя')).toBeVisible()
    await user.type(screen.getByLabelText('Ваше имя'), 'Анна')
    await user.type(screen.getByLabelText('Телефон или электронная почта'), 'anna@example.ru')
    await user.click(screen.getByRole('button', { name: 'Отправить запрос' }))
    expect(screen.getByText('Спасибо! Ваше сообщение отправлено')).toBeVisible()
  })
})
