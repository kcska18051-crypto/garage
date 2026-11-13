import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { App } from '../app/App'
import { prototypeData } from '../data/prototypeData'
import { newCatalogProducts } from './NewProductsPage'

function LocationEcho() { const value = useLocation(); return <output aria-label="Адрес подборки">{value.pathname + value.search}</output> }
function open() { render(<MemoryRouter initialEntries={['/new']}><App /><LocationEcho /></MemoryRouter>) }

it('opens a real product collection from the existing novelties destination', () => {
  open()
  expect(screen.getByRole('heading', { level: 1, name: 'Новинки' })).toBeInTheDocument()
  expect(document.querySelector('.placeholder-page')).not.toBeInTheDocument()
  expect(document.querySelectorAll('.new-products-grid article')).toHaveLength(Math.min(12, newCatalogProducts.length))
  const homeIds = prototypeData.productCollections.find(item => item.id === 'new')!.products.map(item => item.id)
  for (const id of homeIds) expect(newCatalogProducts.some(item => item.id === id)).toBe(true)
})

it('sorts the collection and retains a shareable URL state', async () => {
  open()
  await userEvent.setup().selectOptions(screen.getByRole('combobox', { name: 'Сортировка новинок' }), 'price-asc')
  expect(screen.getByRole('status', { name: 'Адрес подборки' })).toHaveTextContent('/new?sort=price-asc')
  const first = document.querySelector('.new-products-grid article')!
  const cheapest = [...newCatalogProducts].sort((a, b) => a.price - b.price)[0]
  expect(first).toHaveTextContent(cheapest.name)
})

it('adds a novelty to the same cart used by the rest of the site', async () => {
  open()
  const grid = document.querySelector('.new-products-grid')! as HTMLElement
  const buy = within(grid).getAllByRole('button', { name: /^Добавить в корзину:/ })[0]
  await userEvent.setup().click(buy)
  expect(screen.getAllByRole('link', { name: 'Корзина: 1' }).length).toBeGreaterThan(0)
})


it.each(['service', 'bestsellers'] as const)('opens the intended homepage collection %s and keeps it when sorting', async collection => {
  render(<MemoryRouter initialEntries={['/catalog?collection=' + collection]}><App /><LocationEcho /></MemoryRouter>)
  const source = prototypeData.productCollections.find(item => item.id === collection)!
  expect(screen.getByRole('heading', { level: 1, name: source.label })).toBeInTheDocument()
  expect(document.querySelectorAll('.new-products-grid article')).toHaveLength(source.products.length)
  await userEvent.setup().selectOptions(screen.getByRole('combobox', { name: 'Сортировка подборки' }), 'price-asc')
  expect(screen.getByRole('status', { name: 'Адрес подборки' })).toHaveTextContent('collection=' + collection)
})
