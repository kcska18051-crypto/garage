import { render, screen } from '@testing-library/react'
import { App } from './App'

describe('App shell', () => {
  it('provides a semantic main area for the interactive prototype', () => {
    render(<App />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Интерактивный прототип')).toBeInTheDocument()
  })
})
