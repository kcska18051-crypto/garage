import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

describe('Remeza VK 10 product detail', () => {
  it('renders the independent product route with informational brand and prototype commercial data', () => {
    render(<MemoryRouter initialEntries={['/product/remeza-vk-10-gr-0001/']}><App /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'Remeza ВК 10' })).toBeInTheDocument()
    expect(screen.getByText('Remeza', { selector: '.product-identity__brand' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Remeza' })).not.toBeInTheDocument()
    expect(screen.getAllByText(/демонстрацион/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('navigation', { name: 'Разделы товара' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Технические характеристики' })).toBeInTheDocument()
  })

  it('updates shared commerce counters and opens the gallery enlargement', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/product/remeza-vk-10-gr-0001/']}><App /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Добавить в сравнение' }))
    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
    await user.click(screen.getAllByRole('button', { name: 'В корзину' })[0])
    expect(screen.getAllByRole('link', { name: 'Сравнение: 1' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Избранное: 1' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Корзина: 1' }).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: 'Увеличить изображение' }))
    expect(screen.getByRole('dialog', { name: 'Увеличенное изображение товара' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Закрыть изображение' }))
    expect(screen.queryByRole('dialog', { name: 'Увеличенное изображение товара' })).not.toBeInTheDocument()
  })
})
