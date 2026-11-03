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

  it.each(['/catalog', '/contacts', '/services', '/cart'])('shares approved navigation at %s without changing the page design', (path) => {
    render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
    expect(document.querySelector('.app-shell')).not.toHaveAttribute('data-style-check')
    expect(document.querySelector('.app-shell')).toHaveAttribute('data-approved-chrome', 'true')
    expect(document.querySelector('.style-check-footer')).toBeInTheDocument()
    expect(document.querySelector('.reference-mobile-header')).toBeInTheDocument()
    expect(document.querySelector('.reference-bottom-nav')).toBeInTheDocument()
    expect(screen.getByRole('main')).not.toHaveClass('review-home-v2')
    expect(document.querySelector('link[href*="approved-chrome.css"]')).toBeInTheDocument()
    expect(document.querySelector('link[href*="approved-layout-v43.css"]')).not.toBeInTheDocument()
  })
})
