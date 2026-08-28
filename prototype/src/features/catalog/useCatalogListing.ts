import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CatalogProduct, CatalogSort, CatalogView, ListingCriterion, ListingState } from '../../data/catalogTypes'
import { filterCatalogProducts, paginateProducts, parseListingState, serializeListingState, sortCatalogProducts } from './catalogFilters'

function valuesForGroup(state: ListingState, group: string) {
  if (group === 'brand') return state.brands
  if (group === 'availability') return state.availability
  if (group === 'subcategory') return state.subcategories
  return state.specs[group] ?? []
}

function withGroupValues(state: ListingState, group: string, values: string[]): ListingState {
  if (group === 'brand') return { ...state, brands: values, page: 1 }
  if (group === 'availability') return { ...state, availability: values, page: 1 }
  if (group === 'subcategory') return { ...state, subcategories: values, page: 1 }
  return { ...state, specs: { ...state.specs, [group]: values }, page: 1 }
}

export function useCatalogListing({ products, pageSize = 12 }: { products: CatalogProduct[]; pageSize?: number }) {
  const [params, setParams] = useSearchParams()
  const state = useMemo(() => parseListingState(params), [params])
  const results = useMemo(() => sortCatalogProducts(filterCatalogProducts(products, state), state.sort), [products, state])
  const pagination = useMemo(() => paginateProducts(results, state.page, pageSize), [pageSize, results, state.page])
  const commit = (next: ListingState) => setParams(serializeListingState(next))

  const toggleFilter = (group: string, value: string) => {
    const current = valuesForGroup(state, group)
    commit(withGroupValues(state, group, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]))
  }
  const setPrice = (side: 'from' | 'to', value?: number) => commit({ ...state, [side === 'from' ? 'priceFrom' : 'priceTo']: value, page: 1 })
  const applyTag = (group: string, value: string) => commit({ ...state, tag: state.tag?.group === group && state.tag.value === value ? undefined : { group, value }, page: 1 })
  const setSort = (sort: CatalogSort) => commit({ ...state, sort, page: 1 })
  const setView = (view: CatalogView) => commit({ ...state, view })
  const setPage = (page: number) => commit({ ...state, page })
  const clearAll = () => commit({ availability: [], brands: [], subcategories: [], specs: {}, sort: state.sort, view: state.view, page: 1 })
  const removeCriterion = (criterion: ListingCriterion) => {
    if (criterion.kind === 'tag') return commit({ ...state, tag: undefined, page: 1 })
    if (criterion.kind === 'price') return setPrice(criterion.group === 'priceFrom' ? 'from' : 'to', undefined)
    const current = valuesForGroup(state, criterion.group)
    commit(withGroupValues(state, criterion.group, current.filter((item) => item !== criterion.value)))
  }

  return { state, results, pageItems: pagination.items, pagination, toggleFilter, setPrice, applyTag, setSort, setView, setPage, clearAll, removeCriterion, applyState: commit }
}
