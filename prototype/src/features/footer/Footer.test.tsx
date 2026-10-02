import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from './Footer'

it('links every materials section from the footer without mixing in product novelties', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  const materials = screen.getByRole('navigation', { name: 'Материалы' })
  expect(within(materials).getByRole('link', { name: 'Новости' })).toHaveAttribute('href', '/news')
  expect(within(materials).getByRole('link', { name: 'Статьи' })).toHaveAttribute('href', '/articles')
  expect(within(materials).getByRole('link', { name: 'Обзоры' })).toHaveAttribute('href', '/reviews')
  expect(within(materials).queryByRole('link', { name: 'Новинки' })).not.toBeInTheDocument()
})
