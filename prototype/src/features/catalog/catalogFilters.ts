import type { CatalogProduct, CatalogSort, ListingState, PaginationResult } from '../../data/catalogTypes'

const reservedKeys = new Set(['availability', 'brand', 'subcategory', 'price-from', 'price-to', 'tag', 'sort', 'view', 'page'])
const asNumber = (value: string | null) => value && Number.isFinite(Number(value)) ? Number(value) : undefined

export function parseListingState(params: URLSearchParams): ListingState {
  const specs: Record<string, string[]> = {}
  params.forEach((_, key) => {
    if (!reservedKeys.has(key)) specs[key] = params.getAll(key)
  })
  const rawTag = params.get('tag')
  const [tagGroup, ...tagValue] = rawTag?.split(':') ?? []
  const page = Math.max(1, Math.floor(asNumber(params.get('page')) ?? 1))
  const sort = params.get('sort')
  const view = params.get('view')
  return {
    availability: params.getAll('availability'),
    brands: params.getAll('brand'),
    subcategories: params.getAll('subcategory'),
    specs,
    priceFrom: asNumber(params.get('price-from')),
    priceTo: asNumber(params.get('price-to')),
    tag: tagGroup && tagValue.length ? { group: tagGroup, value: tagValue.join(':') } : undefined,
    sort: sort === 'price-asc' || sort === 'price-desc' || sort === 'new' || sort === 'available' ? sort : 'popular',
    view: view === 'list' ? 'list' : 'grid',
    page,
  }
}

export function serializeListingState(state: ListingState) {
  const params = new URLSearchParams()
  state.availability.forEach((value) => params.append('availability', value))
  state.brands.forEach((value) => params.append('brand', value))
  state.subcategories.forEach((value) => params.append('subcategory', value))
  Object.entries(state.specs).forEach(([key, values]) => values.forEach((value) => params.append(key, value)))
  if (state.priceFrom !== undefined) params.set('price-from', String(state.priceFrom))
  if (state.priceTo !== undefined) params.set('price-to', String(state.priceTo))
  if (state.tag) params.set('tag', `${state.tag.group}:${state.tag.value}`)
  if (state.sort !== 'popular') params.set('sort', state.sort)
  if (state.view !== 'grid') params.set('view', state.view)
  if (state.page > 1) params.set('page', String(state.page))
  return params
}

function matchesTag(product: CatalogProduct, tag: ListingState['tag']) {
  if (!tag) return true
  if (tag.group === 'brand') return product.brandId === tag.value
  return product.specs[tag.group] === tag.value
}

export function filterCatalogProducts(products: CatalogProduct[], state: ListingState) {
  return products.filter((product) => {
    if (state.availability.length && !state.availability.some((value) => value === 'discount' ? product.oldPrice !== undefined : product.availability.includes(value))) return false
    if (state.brands.length && !state.brands.includes(product.brandId)) return false
    if (state.subcategories.length && !state.subcategories.includes(product.subcategoryId)) return false
    if (state.priceFrom !== undefined && product.price < state.priceFrom) return false
    if (state.priceTo !== undefined && product.price > state.priceTo) return false
    if (Object.entries(state.specs).some(([key, values]) => values.length && !values.includes(product.specs[key]))) return false
    return matchesTag(product, state.tag)
  })
}

export function sortCatalogProducts(products: CatalogProduct[], sort: CatalogSort) {
  const result = [...products]
  if (sort === 'price-asc') return result.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return result.sort((a, b) => b.price - a.price)
  if (sort === 'new') return result.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.popularity - a.popularity)
  if (sort === 'available') return result.sort((a, b) => Number(b.availability.includes('in-stock')) - Number(a.availability.includes('in-stock')) || b.popularity - a.popularity)
  return result.sort((a, b) => b.popularity - a.popularity)
}

export function paginateProducts<T>(items: T[], requestedPage: number, pageSize: number): PaginationResult<T> {
  const total = items.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, requestedPage), pages)
  return { items: items.slice((page - 1) * pageSize, page * pageSize), page, pages, total }
}
