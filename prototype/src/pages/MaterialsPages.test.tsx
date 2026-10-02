import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { App } from '../app/App'

function LocationEcho() { const location = useLocation(); return <output aria-label="Текущий адрес">{location.pathname}{location.search}</output> }
const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /><LocationEcho /></MemoryRouter>)

describe('materials pages', () => {
  it.each([
    ['/news', 'Новости', 'Новости'],
    ['/articles', 'Статьи', 'Статьи'],
    ['/reviews', 'Обзоры', 'Обзоры'],
  ])('renders %s with shared section navigation', (path, title, active) => {
    open(path)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Разделы материалов' })
    expect(within(nav).getByRole('link', { name: 'Новости' })).toHaveAttribute('href', '/news')
    expect(within(nav).getByRole('link', { name: 'Статьи' })).toHaveAttribute('href', '/articles')
    expect(within(nav).getByRole('link', { name: 'Обзоры' })).toHaveAttribute('href', '/reviews')
    expect(within(nav).getByRole('link', { name: active })).toHaveAttribute('aria-current', 'page')
  })

  it('filters news by the Events category and keeps controls in the URL', async () => {
    const user = userEvent.setup()
    open('/news')
    await user.selectOptions(screen.getByLabelText('Рубрика'), 'events')
    expect(screen.getAllByTestId('material-card')).not.toHaveLength(0)
    expect(screen.getAllByTestId('material-card').every((card) => card.textContent?.includes('События'))).toBe(true)
    expect(screen.getByRole('status', { name: 'Текущий адрес' })).toHaveTextContent('category=events')
  })

  it('sorts materials and opens the second numbered page', async () => {
    const user = userEvent.setup()
    open('/articles')
    await user.selectOptions(screen.getByLabelText('Сортировка'), 'oldest')
    expect(screen.getAllByTestId('material-card')[0]).toHaveTextContent('15 апреля 2026')
    await user.click(screen.getByRole('link', { name: 'Страница 2' }))
    expect(screen.getByRole('link', { name: 'Страница 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('marks video announcements but leaves regular cards clean', () => {
    open('/reviews')
    const cards = screen.getAllByTestId('material-card')
    expect(cards.some((card) => within(card).queryByText('Видео'))).toBe(true)
    expect(cards.some((card) => !within(card).queryByText('Видео'))).toBe(true)
  })

  it.each([
    ['/news/assortment-update', 'Обновление ассортимента оборудования', 'Все новости'],
    ['/articles/work-area', 'Как выбрать оборудование для новой рабочей зоны', 'Все статьи'],
    ['/reviews/workshop-solutions', 'Обзор решений для оснащения рабочего поста', 'Все обзоры'],
  ])('renders the detail route %s', (path, title, backLabel) => {
    open(path)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Хлебные крошки' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: backLabel })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Связанные материалы' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Читайте дальше' })).toBeInTheDocument()
  })

  it('uses regular article copy without a table of contents', () => {
    open('/articles/work-area')
    expect(screen.queryByRole('navigation', { name: 'Содержание статьи' })).not.toBeInTheDocument()
    expect(screen.queryByText('Содержание')).not.toBeInTheDocument()
    expect(screen.getByTestId('material-detail-note')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Разделы материалов' })).toBeInTheDocument()
  })

  it('starts an optional video only after a click', async () => {
    const user = userEvent.setup()
    open('/reviews/workshop-solutions')
    expect(screen.queryByText('Демонстрационное видео воспроизводится')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Воспроизвести видео: Оснащение рабочего поста' }))
    expect(screen.getByText('Демонстрационное видео воспроизводится')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Приостановить видео: Оснащение рабочего поста' })).toBeInTheDocument()
    expect(document.querySelector('.material-video__copy')).toBeNull()
  })

  it('shows two compact video covers without a side description', () => {
    open('/reviews/compressor-types')
    const videos = screen.getByRole('region', { name: 'Видео материала' })
    expect(within(videos).getAllByRole('button', { name: /Воспроизвести видео:/ })).toHaveLength(2)
    expect(videos.querySelectorAll('.material-video')).toHaveLength(2)
    expect(videos.querySelector('.material-video__copy')).toBeNull()
  })

  it('uses neutral body copy instead of the removed explanatory blocks', () => {
    open('/news/assortment-update')
    expect(screen.queryByRole('heading', { name: 'Что изменилось' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Практическое применение' })).not.toBeInTheDocument()
    expect(screen.getAllByTestId('material-body-paragraph')).toHaveLength(4)
  })

  it.each([
    '/news/service-solutions',
    '/articles/tool-maintenance',
    '/reviews/lifting-equipment',
  ])('does not reserve video space on %s', (path) => {
    open(path)
    expect(document.querySelector('.material-video')).toBeNull()
  })

  it('shows the prototype 404 for an unknown material', () => {
    open('/news/missing-material')
    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument()
  })
})
