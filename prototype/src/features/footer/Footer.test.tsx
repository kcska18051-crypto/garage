import userEvent from '@testing-library/user-event'
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

it('links each customer information page and keeps privacy separate', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  const customers = screen.getByRole('navigation', { name: 'Покупателям' })
  expect(within(customers).getByRole('link', { name: 'Доставка' })).toHaveAttribute('href', '/delivery')
  expect(within(customers).getByRole('link', { name: 'Оплата' })).toHaveAttribute('href', '/payment')
  expect(within(customers).getByRole('link', { name: 'Гарантия на товар' })).toHaveAttribute('href', '/warranty')
  expect(screen.getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute('href', '/privacy')
})

it('keeps all footer navigation visible when its headings are clicked', async () => {
  render(<MemoryRouter><Footer /></MemoryRouter>)
  const footer = screen.getByRole('contentinfo')
  expect(footer.querySelector('details, summary')).toBeNull()
  for (const title of ['Каталог', 'Услуги', 'Покупателям', 'Материалы', 'Компания']) {
    await userEvent.setup().click(within(footer).getByRole('heading', { name: title }))
    for (const link of within(within(footer).getByRole('navigation', { name: title })).getAllByRole('link')) expect(link).toBeVisible()
  }
})
