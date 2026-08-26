import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

describe('new products showcase', () => {
  it('updates shared header badges from real product actions', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><App /></MemoryRouter>)
    await user.click(screen.getAllByRole('button', { name: /Добавить в избранное/ })[0])
    expect(screen.getAllByLabelText('Избранное: 1').length).toBeGreaterThan(0)
    await user.click(screen.getAllByRole('button', { name: /Добавить в корзину/ })[0])
    expect(screen.getAllByLabelText('Корзина: 1').length).toBeGreaterThan(0)
  })
})
