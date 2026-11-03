import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThirdLevelNavigation } from './ThirdLevelNavigation'
import { SearchBox } from './SearchBox'
import { activeActions } from '../../data/actionsData'

it('opens current actions on hover while retaining the all-actions link', async () => {
  render(<MemoryRouter><ThirdLevelNavigation compact={false} /></MemoryRouter>)
  const nav = within(screen.getByRole('navigation', { name: 'Быстрые ссылки' }))
  const link = nav.getByRole('link', { name: 'Акции' })
  expect(link).toHaveAttribute('href', '/actions')
  await userEvent.hover(link)
  const list = within(nav.getByRole('navigation', { name: 'Действующие акции' }))
  for (const action of activeActions()) expect(list.getByRole('link', { name: action.title })).toHaveAttribute('href', `/actions/${action.slug}`)
  expect(list.getByRole('link', { name: 'Все акции' })).toHaveAttribute('href', '/actions')
  await userEvent.keyboard('{Escape}')
  expect(nav.queryByRole('navigation', { name: 'Действующие акции' })).not.toBeInTheDocument()
})

it('opens the actions disclosure by pressing its separate button', async () => {
  render(<MemoryRouter><ThirdLevelNavigation compact={false} /></MemoryRouter>)
  const nav = within(screen.getByRole('navigation', { name: 'Быстрые ссылки' }))
  const button = nav.getByRole('button', { name: 'Показать список акций' })
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(nav.getByRole('navigation', { name: 'Действующие акции' })).toBeInTheDocument()
})

it('types examples only in the placeholder and stops when the user starts searching', () => {
  vi.useFakeTimers()
  try {
    render(<MemoryRouter><SearchBox /></MemoryRouter>)
    const input = screen.getByRole('searchbox')
    expect(input).toHaveAttribute('placeholder', 'Товары, бренды, артикулы')
    act(() => vi.advanceTimersByTime(1600))
    expect(input.getAttribute('placeholder')).toMatch(/^Ко?/)
    expect(input).toHaveValue('')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'мой товар' } })
    act(() => vi.advanceTimersByTime(5000))
    expect(input).toHaveValue('мой товар')
    expect(input).toHaveAttribute('placeholder', 'Товары, бренды, артикулы')
  } finally { vi.useRealTimers() }
})
