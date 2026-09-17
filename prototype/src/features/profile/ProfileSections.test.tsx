import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

describe('profile secondary sections', () => {
  it('adds an organization from a demo INN lookup', async () => {
    const user = userEvent.setup(); open('/profile/organizations')
    await user.click(screen.getByRole('button', { name: 'Добавить организацию' }))
    await user.type(screen.getByLabelText('ИНН организации'), '7600000028')
    await user.click(screen.getByRole('button', { name: 'Найти по ИНН' }))
    expect(screen.getByText('ООО «Гараж Профи»')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Сохранить организацию' }))
    expect(screen.getAllByText('ООО «Гараж Профи»').length).toBeGreaterThan(0)
  })

  it('keeps favorites connected with the shared commerce state', async () => {
    const user = userEvent.setup(); open('/profile/favorites')
    const card = screen.getByTestId('profile-product-product-1')
    await user.click(within(card).getByRole('button', { name: 'Удалить из избранного' }))
    expect(screen.queryByTestId('profile-product-product-1')).not.toBeInTheDocument()
  })

  it('clears recently viewed products with an explicit confirmation', async () => {
    const user = userEvent.setup(); open('/profile/recently-viewed')
    await user.click(screen.getByRole('button', { name: 'Очистить историю' }))
    await user.click(within(screen.getByRole('dialog', { name: 'Очистить историю просмотров' })).getByRole('button', { name: 'Очистить' }))
    expect(screen.getByText('История просмотров пуста')).toBeInTheDocument()
  })

  it('shows service and review lifecycle states', () => {
    const { unmount } = open('/profile/services')
    for (const status of ['Принята', 'В работе', 'Требуется уточнение', 'Завершена']) expect(screen.getByText(status)).toBeInTheDocument()
    unmount(); open('/profile/reviews')
    for (const status of ['Опубликован', 'На модерации', 'Отклонён']) expect(screen.getByText(status)).toBeInTheDocument()
  })

  it('updates profile data and shows address management', async () => {
    const user = userEvent.setup(); open('/profile/data')
    await user.clear(screen.getByLabelText('Имя')); await user.type(screen.getByLabelText('Имя'), 'Иван')
    await user.click(screen.getByRole('button', { name: 'Сохранить данные' }))
    expect(screen.getByRole('status')).toHaveTextContent('Данные профиля сохранены')
    expect(screen.getByText('Ярославль, ул. Промышленная, 12')).toBeInTheDocument()
  })
})
