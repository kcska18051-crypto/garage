import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

const storageKey = 'garage-cookie-preference'
const open = (path = '/contacts') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

beforeEach(() => localStorage.clear())

it('offers one concise cookie action on a direct URL and persists the selected version', async () => {
  const user = userEvent.setup()
  const view = open()
  const banner = screen.getByRole('region', { name: 'Настройки cookie' })
  expect(within(banner).getByText(/Мы используем файлы cookie для вашего удобства/)).toHaveTextContent(
    'Мы используем файлы cookie для вашего удобства. Продолжая пользоваться сайтом, вы соглашаетесь с политикой использования cookie. Подробнее',
  )
  expect(within(banner).getAllByRole('button')).toHaveLength(1)
  expect(within(banner).getByRole('link', { name: 'Подробнее' })).toHaveAttribute('href', '/privacy')
  await user.click(within(banner).getByRole('button', { name: 'Я согласен' }))
  expect(screen.queryByRole('region', { name: 'Настройки cookie' })).not.toBeInTheDocument()
  expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual({ version: 1, choice: 'all' })

  view.unmount()
  open('/catalog')
  expect(screen.queryByRole('region', { name: 'Настройки cookie' })).not.toBeInTheDocument()
})

it('reopens settings from the footer and lets the user change the choice', async () => {
  localStorage.setItem(storageKey, JSON.stringify({ version: 1, choice: 'necessary' }))
  const user = userEvent.setup()
  open()
  await user.click(screen.getByRole('button', { name: 'Настройки cookie' }))
  const banner = screen.getByRole('region', { name: 'Настройки cookie' })
  await user.click(within(banner).getByRole('button', { name: 'Я согласен' }))
  expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual({ version: 1, choice: 'all' })
})

it('keeps the site usable when storage is unavailable', async () => {
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  const user = userEvent.setup()
  open()
  await user.click(screen.getByRole('button', { name: 'Я согласен' }))
  expect(screen.queryByRole('region', { name: 'Настройки cookie' })).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 1, name: 'Контакты' })).toBeVisible()
  write.mockRestore()
})
