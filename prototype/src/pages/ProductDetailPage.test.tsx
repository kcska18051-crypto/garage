import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { App } from '../app/App'

const route = '/product/remeza-vk-10-gr-0001/'
const longName = 'Винтовой компрессор Remeza ВК 10-8 с ременным приводом, 380 В, 7,5 кВт'

const renderPage = () => render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)

describe('Remeza product detail redesign', () => {
  it('places the long product heading and compact metadata above the three-column hero', () => {
    const { container } = renderPage()
    const heading = screen.getByRole('heading', { level: 1, name: longName })
    const hero = container.querySelector('.product-hero')

    expect(hero).toBeInTheDocument()
    expect(heading.compareDocumentPosition(hero as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getByText(/Артикул GR-0001/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'В избранное' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Сравнить' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Поделиться' })).toBeInTheDocument()
  })

  it('selects a complete product offer and keeps unavailable combinations disabled', async () => {
    const user = userEvent.setup()
    renderPage()

    const variants = screen.getByRole('group', { name: 'Варианты товара' })
    expect(within(variants).getByText((_, element) => element?.tagName === 'P' && element.textContent === 'Напряжение: 380 В')).toBeInTheDocument()
    expect(within(variants).getByText((_, element) => element?.tagName === 'P' && element.textContent === 'Мощность: 7,5 кВт')).toBeInTheDocument()
    expect(within(variants).getByRole('button', { name: '11 кВт' })).toBeDisabled()

    await user.click(within(variants).getByRole('button', { name: '220 В' }))

    expect(within(variants).getByText((_, element) => element?.tagName === 'P' && element.textContent === 'Напряжение: 220 В')).toBeInTheDocument()
    expect(screen.getByText(/Артикул GR-220-55/)).toBeInTheDocument()
    expect(screen.getAllByText('169 000 ₽').length).toBeGreaterThan(0)
  })

  it('moves through gallery frames and keeps a purchase panel in enlarged view', async () => {
    const user = userEvent.setup()
    renderPage()

    const gallery = screen.getByRole('region', { name: 'Галерея товара' })
    expect(within(gallery).getByRole('button', { name: 'Предыдущее изображение' })).toBeInTheDocument()
    await user.click(within(gallery).getByRole('button', { name: 'Следующее изображение' }))
    expect(within(gallery).getByText(/2 из 5/)).toBeInTheDocument()
    expect(within(gallery).getByRole('button', { name: 'Видео о товаре' })).toBeInTheDocument()

    await user.click(within(gallery).getByRole('button', { name: 'Увеличить изображение' }))
    const modal = screen.getByRole('dialog', { name: 'Увеличенный просмотр товара' })
    expect(within(modal).getByRole('complementary', { name: 'Покупка в увеличенном просмотре' })).toBeInTheDocument()
    expect(within(modal).getByRole('button', { name: 'В корзину' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Увеличенный просмотр товара' })).not.toBeInTheDocument()
  })

  it.each([
    ['В наличии', 'В корзину'],
    ['Под заказ', 'Запросить срок'],
    ['Нет в наличии', 'Уведомить о поступлении'],
    ['Снят с производства', 'Показать аналоги'],
  ])('maps commercial state %s to the correct primary action', async (state, action) => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: state }))

    expect(screen.getAllByText(state).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: action }).length).toBeGreaterThan(0)
    expect(screen.getByText('Ярославль', { selector: '.product-stock__city' })).toBeInTheDocument()
    expect(screen.getByText('Вологда', { selector: '.product-stock__city' })).toBeInTheDocument()
  })

  it('opens a commercial proposal for the selected offer and reports prototype actions', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Коммерческое предложение' }))
    const modal = screen.getByRole('dialog', { name: 'Коммерческое предложение' })
    expect(within(modal).getByText(/GR-0001/)).toBeInTheDocument()
    expect(within(modal).getByText(/380 В · 7,5 кВт/)).toBeInTheDocument()

    await user.click(within(modal).getByRole('button', { name: 'Скачать PDF' }))
    expect(within(modal).getByRole('status')).toHaveTextContent('PDF подготовлен')
    await user.click(within(modal).getByRole('button', { name: 'Отправить на e-mail' }))
    expect(within(modal).getByRole('status')).toHaveTextContent('Отправка показана в демонстрационном режиме')
  })

  it('shares the product with visible feedback and keeps separate financing actions', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Поделиться' }))
    expect(writeText).not.toHaveBeenCalled()
    const shareMenu = screen.getByRole('menu', { name: 'Способы поделиться' })
    expect(within(shareMenu).getByRole('menuitem', { name: 'Отправить в Telegram' })).toBeInTheDocument()
    expect(within(shareMenu).getByRole('menuitem', { name: 'Отправить в WhatsApp' })).toBeInTheDocument()
    await user.click(within(shareMenu).getByRole('menuitem', { name: 'Скопировать ссылку' }))
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining(route))
    expect(screen.getByText('Ссылка на товар скопирована', { selector: '[role="status"]' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Купить в кредит' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'В рассрочку' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'В лизинг' })).toBeInTheDocument()
  })

  it('copies only the selected offer sku from the interactive article control', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    renderPage()

    await user.click(screen.getByRole('button', { name: '220 В' }))
    await user.click(screen.getByRole('button', { name: 'Скопировать артикул GR-220-55' }))

    expect(writeText).toHaveBeenCalledWith('GR-220-55')
    expect(screen.getByText('Артикул скопирован', { selector: '[role="status"]' })).toBeInTheDocument()
  })
})
