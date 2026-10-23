import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

beforeEach(() => localStorage.setItem('garage-cookie-preference', JSON.stringify({ version: 2, choice: 'necessary' })))

it.each([
  ['/privacy', 'Политика конфиденциальности'],
  ['/user-agreement', 'Пользовательское соглашение'],
  ['/personal-data-consent', 'Согласие на обработку персональных данных'],
])('renders the dedicated legal document at %s', (path, title) => {
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
  expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  expect(screen.getByText('Текст будет предоставлен заказчиком.')).toBeInTheDocument()
  expect(screen.getByText(/не является утверждённым юридическим документом/i)).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toHaveTextContent(`Главная${title}`)
})

it('links every legal destination and cookie settings from the footer', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)
  const footer = screen.getByRole('contentinfo')
  expect(within(footer).getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute('href', '/privacy')
  expect(within(footer).getByRole('link', { name: 'Пользовательское соглашение' })).toHaveAttribute('href', '/user-agreement')
  expect(within(footer).getByRole('link', { name: 'Согласие на обработку персональных данных' })).toHaveAttribute('href', '/personal-data-consent')
  expect(within(footer).getByRole('button', { name: 'Настройки куки (cookie)' })).toBeInTheDocument()
})
