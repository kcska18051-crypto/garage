import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

it('opens a category from an older homepage URL instead of a missing page', async () => {
  render(<MemoryRouter initialEntries={['/catalog/lifting']}><App /></MemoryRouter>)
  expect(await screen.findByRole('heading', { level: 1, name: 'Подъёмное оборудование' })).toBeInTheDocument()
  expect(screen.queryByText('Страница не найдена')).not.toBeInTheDocument()
})

it('opens the matching manufacturer in the directory from an older logo URL', async () => {
  render(<MemoryRouter initialEntries={['/brands/trommelberg']}><App /></MemoryRouter>)
  expect(await screen.findByRole('searchbox', { name: 'Поиск бренда' })).toHaveValue('Trommelberg')
  expect(screen.getByRole('article', { name: 'Trommelberg' })).toBeInTheDocument()
})

it('opens the existing offer from the homepage promotion destination', async () => {
  render(<MemoryRouter initialEntries={['/actions/service-tools']}><App /></MemoryRouter>)
  expect(await screen.findByRole('heading', { level: 1, name: 'Оснащение мастерской: выгода на комплект' })).toBeInTheDocument()
})
