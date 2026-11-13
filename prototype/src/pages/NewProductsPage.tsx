import { useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../features/catalog/Breadcrumbs'
import { CatalogProductCard } from '../features/catalog/CatalogProductCard'
import { paginateProducts, parseListingState, sortCatalogProducts } from '../features/catalog/catalogFilters'
import { formatProductCount } from '../data/catalogData'
import { prototypeData } from '../data/prototypeData'
import { searchCatalogProducts } from '../data/searchResults'
import type { CatalogSort } from '../data/catalogTypes'
import '../features/catalog/Catalog.css'
import './SearchResultsPage.css'
import './NewProductsPage.css'

const featuredIds = new Set(prototypeData.productCollections.find(item => item.id === 'new')?.products.map(item => item.id))
export const newCatalogProducts = searchCatalogProducts('').filter(item => item.isNew || featuredIds.has(item.id))

export function NewProductsPage({ collection = 'new' }: { collection?: 'new' | 'service' | 'bestsellers' }) {
  const [params, setParams] = useSearchParams()
  const heading = useRef<HTMLHeadingElement>(null)
  const state = parseListingState(params)
  const source = prototypeData.productCollections.find(item => item.id === collection)!
  const title = source.label
  const products = useMemo(() => {
    const ids = new Set(source.products.map(item => item.id))
    const items = collection === 'new' ? newCatalogProducts : searchCatalogProducts('').filter(item => ids.has(item.id))
    return sortCatalogProducts(items, state.sort)
  }, [collection, source, state.sort])
  const pagination = paginateProducts(products, state.page, 12)
  const update = (sort: CatalogSort, page: number) => {
    const next = new URLSearchParams()
    if (collection !== 'new') next.set('collection', collection)
    if (sort !== 'popular') next.set('sort', sort)
    if (page > 1) next.set('page', String(page))
    setParams(next)
  }
  const goPage = (page: number) => {
    update(state.sort, page)
    heading.current?.focus()
    heading.current?.scrollIntoView({ block: 'start' })
  }
  return <main className="new-products-page">
    <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: title }]} />
    <header className="new-products-heading"><h1>{title}</h1><p>{collection === 'new' ? 'Новые позиции оборудования, инструмента и материалов для мастерской.' : 'Подборка оборудования и инструмента для рабочего поста.'}</p></header>
    <section aria-labelledby="new-products-count">
      <div className="new-products-toolbar"><h2 id="new-products-count" ref={heading} tabIndex={-1}>{formatProductCount(products.length)}</h2><label>Сортировка<select aria-label={collection === 'new' ? 'Сортировка новинок' : 'Сортировка подборки'} value={state.sort} onChange={event => update(event.target.value as CatalogSort, 1)}><option value="popular">По популярности</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option><option value="available">По наличию</option></select></label></div>
      <div className="catalog-results new-products-grid">{pagination.items.map((product, index) => <CatalogProductCard key={product.id} product={product} index={index} quoteHref={product.purchaseMode === 'quote' ? '/product/' + product.slug : undefined} />)}</div>
      {pagination.pages > 1 && <nav className="search-results__pagination" aria-label="Страницы подборки"><button type="button" aria-label="Предыдущая страница" disabled={pagination.page === 1} onClick={() => goPage(pagination.page - 1)}>‹</button>{Array.from({ length: pagination.pages }, (_, index) => index + 1).map(page => <button key={page} type="button" aria-label={`Страница ${page}`} aria-current={page === pagination.page ? 'page' : undefined} onClick={() => goPage(page)}>{page}</button>)}<button type="button" aria-label="Следующая страница" disabled={pagination.page === pagination.pages} onClick={() => goPage(pagination.page + 1)}>›</button></nav>}
    </section>
  </main>
}
