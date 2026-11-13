import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'
import { seedDemoSession } from '../../test/auth'

function open(path: string) {
  seedDemoSession()
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

it('distinguishes an active organization from one awaiting confirmation', () => {
  open('/profile/organizations')
  expect(screen.getByText('Активна')).toHaveAttribute('data-status-tone', 'success')
  expect(screen.getByText('Требует подтверждения')).toHaveAttribute('data-status-tone', 'attention')
})

it('keeps published, moderated and rejected reviews visibly distinct', () => {
  open('/profile/reviews')
  expect(screen.getByText('Опубликован')).toHaveAttribute('data-status-tone', 'success')
  expect(screen.getByText('На модерации')).toHaveAttribute('data-status-tone', 'warning')
  expect(screen.getByText('Отклонён')).toHaveAttribute('data-status-tone', 'danger')
})

it('does not present an agreed service request as completed', () => {
  open('/profile/services')
  expect(screen.getByText('Согласовано')).toHaveAttribute('data-status-tone', 'info')
  for (const status of screen.getAllByText('Уточняем детали')) {
    expect(status).toHaveAttribute('data-status-tone', 'attention')
  }
  expect(screen.getByText('Выполнено')).toHaveAttribute('data-status-tone', 'success')
})

it('uses the same order state on the overview and in its visual row marker', () => {
  open('/profile')
  const rows = document.querySelectorAll('.profile-order-row')
  expect(rows).toHaveLength(2)
  for (const row of rows) {
    expect(row).toHaveAttribute('data-status-tone', 'warning')
    expect(row.querySelector('.profile-status')).toHaveAttribute('data-status-tone', 'warning')
    expect(row).toHaveTextContent('В обработке')
  }
})
