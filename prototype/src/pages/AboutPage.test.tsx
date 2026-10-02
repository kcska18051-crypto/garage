import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

it('renders the compact temporary company page instead of a placeholder', () => {
  render(<MemoryRouter initialEntries={['/about']}><App /></MemoryRouter>)

  expect(screen.getByRole('heading', { level: 1, name: 'О компании' })).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toHaveTextContent(/Главная.*О компании/)
  expect(screen.getByText(/временный текст/i)).toBeInTheDocument()
  const features = screen.getByRole('list', { name: 'Основные направления работы' })
  expect(within(features).getAllByRole('listitem')).toHaveLength(3)
  expect(features).toHaveTextContent('Ассортимент')
  expect(features).toHaveTextContent('Подбор')
  expect(features).toHaveTextContent('Поддержка')
  expect(document.querySelector('.placeholder-page')).not.toBeInTheDocument()
})
