import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { App } from '../app/App'
import { materials, type Material } from '../data/materialsData'

const saved = [...materials]
function Address() { const location = useLocation(); return <output data-testid="address">{location.pathname}{location.search}</output> }
const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><App /><Address /></MemoryRouter>)
const cards = () => screen.queryAllByTestId('material-card')
beforeEach(() => {
  // jsdom has no viewport scrolling; real geometry is covered by the browser audit.
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  const fixtures: Material[] = (['news', 'article'] as const).flatMap(kind => Array.from({ length: 10 }, (_, i) => ({
    kind, slug: `fixture-${kind}-${i + 1}`, title: `Fixture ${kind} ${i + 1}`, category: kind === 'news' ? 'company' : 'guides', categoryLabel: 'Тестовая рубрика',
    date: `2026-10-${String(i + 1).padStart(2, '0')}`, dateLabel: `${i + 1} октября 2026`, summary: 'Test summary', intro: 'Test intro', coverTone: 0, sections: [],
  })))
  materials.splice(0, materials.length, ...saved.filter(item => item.kind === 'review'), ...fixtures)
})
afterEach(() => { materials.splice(0, materials.length, ...saved); vi.restoreAllMocks() })

it.each([['/news', 'news', 'company'], ['/articles', 'article', 'guides']])('paginates %s as 9 plus remainder and keeps the category in the URL', async (path, kind, category) => {
  const user = userEvent.setup()
  open(`${path}?category=${category}&tracking=kept`)
  expect(cards()).toHaveLength(9)
  const first = cards().map(card => within(card).getByRole('heading').textContent)
  expect(first[0]).toBe(`Fixture ${kind} 10`)
  await user.click(screen.getByRole('link', { name: 'Страница 2' }))
  expect(cards()).toHaveLength(1)
  expect(cards()[0]).toHaveTextContent(`Fixture ${kind} 1`)
  expect(first).not.toContain(`Fixture ${kind} 1`)
  expect(screen.getByRole('link', { name: 'Страница 2' })).toHaveAttribute('aria-current', 'page')
  expect(screen.getByTestId('address')).toHaveTextContent(`category=${category}`)
  expect(screen.getByTestId('address')).toHaveTextContent('page=2')
  expect(screen.getByTestId('address')).toHaveTextContent('tracking=kept')
  expect(document.querySelector('.materials-controls')).toHaveTextContent('10 материалов')
}, 15000)

it('resets the page on sorting and category changes without losing the sort', async () => {
  const user = userEvent.setup()
  open('/news?page=2')
  await user.selectOptions(screen.getByLabelText('Сортировка'), 'oldest')
  expect(cards()).toHaveLength(9)
  expect(cards()[0]).toHaveTextContent('Fixture news 1')
  expect(screen.getByTestId('address')).not.toHaveTextContent('page=')
  await user.click(screen.getByRole('link', { name: 'Страница 2' }))
  expect(cards()).toHaveLength(1)
  expect(cards()[0]).toHaveTextContent('Fixture news 10')
  await user.selectOptions(screen.getByLabelText('Рубрика'), 'company')
  expect(screen.getByTestId('address')).not.toHaveTextContent('page=')
  expect(screen.getByTestId('address')).toHaveTextContent('sort=oldest')
  expect(cards()[0]).toHaveTextContent('Fixture news 1')
}, 15000)

it.each(['0', '-1', '1.5', 'NaN', 'Infinity', '01', '99999999999999999999999'])('normalizes invalid page=%s to the first page', async value => {
  open(`/news?page=${value}&tracking=kept`)
  await waitFor(() => expect(screen.getByTestId('address')).not.toHaveTextContent('page='))
  expect(cards()).toHaveLength(9)
  expect(screen.getByTestId('address')).toHaveTextContent('tracking=kept')
})
it('normalizes an out of range page to the actual final page', async () => {
  open('/articles?page=999&sort=oldest')
  await waitFor(() => expect(screen.getByTestId('address')).toHaveTextContent('page=2'))
  expect(cards()).toHaveLength(1)
})
it.each([0, 1, 9])('does not invent pagination for %s records', count => {
  const fixtures = materials.filter(item => item.kind === 'news').slice(0, count)
  materials.splice(0, materials.length, ...fixtures)
  open('/news')
  expect(cards()).toHaveLength(count)
  expect(screen.queryByRole('navigation', { name: 'Пагинация материалов' })).not.toBeInTheDocument()
})
it('preserves the existing review page size and data', () => {
  open('/reviews')
  expect(cards()).toHaveLength(4)
  expect(screen.getByRole('link', { name: 'Страница 2' })).toBeInTheDocument()
  expect(materials.filter(item => item.kind === 'review')).toHaveLength(6)
})
