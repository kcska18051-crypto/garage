import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../../app/App'
import { UsefulSection } from './UsefulSection'

describe('lower homepage sections', () => {
  it('shows confirmed content, omits conditional blocks and validates consultation', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Услуги' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Новости, статьи, обзоры' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Новости' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByRole('heading', { name: 'Подписка' })).not.toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Получить консультацию' })[0])
    await user.click(screen.getByRole('button', { name: 'Отправить запрос' }))
    expect(screen.getByText('Укажите имя')).toBeVisible()
    await user.type(screen.getByLabelText('Ваше имя'), 'Анна')
    await user.type(screen.getByLabelText('Телефон или электронная почта'), 'anna@example.ru')
    await user.click(screen.getByRole('button', { name: 'Отправить запрос' }))
    expect(screen.getByText('Спасибо! Ваше сообщение отправлено')).toBeVisible()
  }, 10_000)

  it('switches the section action together with news, article and review tabs', async () => {
    const user = userEvent.setup()
    const items = [
      { id: 'news', kind: 'news' as const, title: 'Новость', text: 'Описание', meta: 'Демо', href: '/news/item' },
      { id: 'article', kind: 'article' as const, title: 'Статья', text: 'Описание', meta: 'Демо', href: '/articles/item' },
      { id: 'review', kind: 'review' as const, title: 'Обзор', text: 'Описание', meta: 'Демо', href: '/reviews' },
    ]
    render(<MemoryRouter><UsefulSection items={items} /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'Все новости' })).toHaveAttribute('href', '/news')
    await user.click(screen.getByRole('tab', { name: 'Статьи' }))
    expect(screen.getByRole('link', { name: 'Все статьи' })).toHaveAttribute('href', '/articles')
    await user.click(screen.getByRole('tab', { name: 'Обзоры' }))
    expect(screen.getByRole('link', { name: 'Все обзоры' })).toHaveAttribute('href', '/reviews')
  })
})
