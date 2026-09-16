import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

describe('homepage merchandising stream', () => {
  it('renders four visible product shelves in configured order', () => {
    const { container } = render(<MemoryRouter><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 2, name: 'Хиты продаж' })).toBeVisible()
    expect(Array.from(container.querySelectorAll('.home-merchandising-stream > .product-showcase h2'), (heading) => heading.textContent))
      .toEqual(['Оборудование для автосервиса', 'Новинки', 'Хиты продаж', 'Товары Remeza'])
  })
})
