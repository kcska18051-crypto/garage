import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'

const open = () => render(<MemoryRouter initialEntries={['/compare']}><App /></MemoryRouter>)

describe('compare page', () => {
  it('groups demo products by category and renders product cards above characteristics', () => {
    open()

    expect(screen.getByRole('heading', { level: 1, name: 'Сравнение товаров' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Компрессоры 3' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Инструмент 1' })).toBeInTheDocument()
    expect(screen.getAllByTestId('compare-product-card')).toHaveLength(3)
    expect(screen.getByRole('table', { name: 'Сравнение характеристик' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Производительность' })).toBeInTheDocument()
  })

  it('shows only differing characteristics on demand', async () => {
    const user = userEvent.setup(); open()

    expect(screen.getByRole('rowheader', { name: 'Тип компрессора' })).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'Показывать только различия' }))
    expect(screen.queryByRole('rowheader', { name: 'Тип компрессора' })).not.toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Производительность' })).toBeInTheDocument()
  })

  it('removes, clears and adds products while keeping the header counter in sync', async () => {
    const user = userEvent.setup(); open()

    expect(screen.getByRole('link', { name: 'Сравнение: 4' })).toBeInTheDocument()
    const firstCard = screen.getAllByTestId('compare-product-card')[0]
    await user.click(within(firstCard).getByRole('button', { name: /Убрать из сравнения/ }))
    expect(screen.getByRole('link', { name: 'Сравнение: 3' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Очистить категорию' }))
    expect(screen.getByRole('heading', { name: 'В этой категории пока нет товаров' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Добавить товар' }))
    await user.click(screen.getByRole('button', { name: /Добавить Remeza ВК 10/ }))
    expect(screen.getAllByTestId('compare-product-card')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Сравнение: 2' })).toBeInTheDocument()
  })
})
