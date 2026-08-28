import { render, screen } from '@testing-library/react'
import { App, routerBasename } from './App'

describe('App shell', () => {
  it('provides a semantic main area for the interactive prototype', () => {
    render(<App />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Гараж, главная').length).toBeGreaterThan(0)
  })

  it('normalizes the GitHub Pages base URL for BrowserRouter', () => {
    expect(routerBasename('/garage/')).toBe('/garage')
    expect(routerBasename('/')).toBe('/')
  })
})
