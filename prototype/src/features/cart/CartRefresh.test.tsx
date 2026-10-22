import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'

const open = () => render(<MemoryRouter initialEntries={['/cart']}><App/></MemoryRouter>)

describe('cart presentation refresh', () => {
  it('removes the provisional shipping row only from cart summary', () => {
    open()
    const summary = screen.getByRole('complementary', { name: 'Итоги заказа' })
    expect(within(summary).queryByText('Доставка')).not.toBeInTheDocument()
    expect(within(summary).queryByText('Рассчитаем при оформлении')).not.toBeInTheDocument()
    expect(summary).toHaveTextContent('Наличие и срок получения уточняются для выбранного города')
  })
  it('shows related products with cart icons and accessible add actions', () => {
    open()
    const rail = document.querySelector('.line-accessories__rail')!
    expect(rail).toBeInTheDocument()
    const buttons = within(rail as HTMLElement).getAllByRole('button', { name: /Добавить .* в корзину/ })
    expect(buttons).toHaveLength(7)
    for (const button of buttons) {
      expect(button.querySelector('svg')).toBeInTheDocument()
      expect(button).not.toHaveTextContent('+')
    }
  })
  it('copies a share link, handles denial and closes with Escape restoring focus', async () => {
    const user = userEvent.setup(); open()
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const trigger = screen.getByRole('button', { name: 'Поделиться корзиной' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Поделиться корзиной' })
    expect(dialog).toHaveTextContent('Поделитесь выбранными товарами. Личные данные не передаются')
    const input = within(dialog).getByLabelText('Ссылка на корзину')
    expect(input).toHaveAttribute('readonly')
    await user.click(within(dialog).getByRole('button', { name: 'Копировать ссылку' }))
    expect(write).toHaveBeenCalledWith((input as HTMLInputElement).value)
    expect(within(dialog).getByRole('status')).toHaveTextContent('Ссылка скопирована')
    write.mockRejectedValueOnce(new Error('denied'))
    await user.click(within(dialog).getByRole('button', { name: 'Копировать ссылку' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Скопируйте выделенную ссылку вручную')
    expect(input).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    write.mockRestore()
  })
})
