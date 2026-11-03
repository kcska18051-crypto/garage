import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from './App'

describe('approved homepage promotion', () => {
  it.each(['/', '/style-check/'])('renders the approved design at %s', (path) => {
    render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
    expect(document.querySelector('.app-shell')).toHaveAttribute('data-style-check', 'true')
    expect(screen.getByRole('main')).toHaveClass('review-home-v2')
    expect(document.querySelector('.style-check-footer')).toBeInTheDocument()
    expect(document.querySelector('.reference-mobile-header')).toBeInTheDocument()
    expect(document.querySelector('.product-carousel')).toBeInTheDocument()
    expect(document.querySelector('.style-check-product-photo')).toBeInTheDocument()
    expect(document.querySelector('link[href*="approved-layout-v43.css"]')).toBeInTheDocument()
    expect(document.querySelector('.reference-bottom-nav a[href="/services"]')).toHaveTextContent('Услуги')
  })

  it('keeps the catalog on its existing design', () => {
    render(<MemoryRouter initialEntries={['/catalog']}><App /></MemoryRouter>)
    expect(document.querySelector('.app-shell')).not.toHaveAttribute('data-style-check')
    expect(screen.getByRole('heading', { level: 1, name: 'Каталог' })).toBeInTheDocument()
    expect(document.querySelector('link[href*="approved-layout-v43.css"]')).not.toBeInTheDocument()
  })
})
