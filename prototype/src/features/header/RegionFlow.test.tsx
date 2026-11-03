import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RegionProvider } from '../../state/RegionState'
import { AuthProvider } from '../../state/AuthState'
import { Header } from './Header'

const renderHeader = () => render(<MemoryRouter><RegionProvider><AuthProvider><Header counts={{ favorites: 0, compare: 0, cart: 0 }} /></AuthProvider></RegionProvider></MemoryRouter>)
beforeEach(() => { localStorage.removeItem('garage-region-v1'); sessionStorage.removeItem('garage-region-dismissed-v1') })

it('asks once, remembers confirmation and does not ask again after remount', async () => {
  const view = renderHeader()
  expect(screen.getByRole('complementary', { name: 'Подтверждение города' })).toHaveTextContent('Ярославль')
  await userEvent.click(screen.getByRole('button', { name: 'Всё верно' }))
  expect(localStorage.getItem('garage-region-v1')).toBe('Ярославль')
  view.unmount()
  renderHeader()
  expect(screen.queryByRole('complementary', { name: 'Подтверждение города' })).not.toBeInTheDocument()
})

it('searches the city list, saves the selected city, and keeps it after remount', async () => {
  const view = renderHeader()
  await userEvent.click(screen.getByRole('button', { name: 'Выбрать другой' }))
  const dialog = within(screen.getByRole('dialog', { name: 'Выберите свой город' }))
  await userEvent.type(dialog.getByRole('searchbox'), '  волог ')
  expect(dialog.queryByRole('button', { name: 'Москва' })).not.toBeInTheDocument()
  await userEvent.click(dialog.getByRole('button', { name: 'Вологда' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(localStorage.getItem('garage-region-v1')).toBe('Вологда')
  view.unmount()
  renderHeader()
  expect(screen.getByRole('button', { name: 'Выбрать город' })).toHaveTextContent('Вологда')
  expect(screen.queryByRole('complementary', { name: 'Подтверждение города' })).not.toBeInTheDocument()
})

it('shows no-match feedback and closes with Escape without confirming a city', async () => {
  renderHeader()
  await userEvent.click(screen.getByRole('button', { name: 'Выбрать другой' }))
  const dialog = within(screen.getByRole('dialog', { name: 'Выберите свой город' }))
  await userEvent.type(dialog.getByRole('searchbox'), 'абвгд')
  expect(dialog.getByRole('status')).toHaveTextContent('Город не найден')
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(localStorage.getItem('garage-region-v1')).toBeNull()
})
