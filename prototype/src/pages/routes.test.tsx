import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('prototype routes', () => {
  it('opens the catalog root with a real compressor category link', () => {
    render(
      <MemoryRouter initialEntries={['/catalog']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Компрессорное оборудование/ })).toHaveAttribute('href', '/catalog/compressor-equipment')
  })

  it('opens the first-level compressor category', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Компрессорное оборудование' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Винтовые компрессоры/ })).toHaveAttribute('href', '/catalog/compressor-equipment/screw-compressors')
  })

  it('opens the reusable second-level category with catalog breadcrumbs', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/screw-compressors']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Винтовые компрессоры' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('href', '/catalog')
    expect(screen.getByRole('heading', { name: 'Быстрый выбор по параметрам' })).toBeInTheDocument()
  })

  it('uses the same second-level template without reserving tag space', () => {
    render(<MemoryRouter initialEntries={['/catalog/compressor-equipment/oil-free-compressors']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Безмасляные компрессоры' })).toBeInTheDocument()
    expect(document.querySelector('.catalog-tags')).toBeNull()
  })

  it('shows the prototype 404 page for an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/missing']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })
})
