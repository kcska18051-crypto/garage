import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('prototype routes', () => {
  it('opens a linked prototype section as a real route', () => {
    render(
      <MemoryRouter initialEntries={['/catalog']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Каталог' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Вернуться на главную' })).toHaveAttribute('href', '/')
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
