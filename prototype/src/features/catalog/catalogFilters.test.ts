import { describe, expect, test } from 'vitest'
import type { CatalogProduct } from '../../data/catalogTypes'
import { filterCatalogProducts, paginateProducts, parseListingState, serializeListingState, sortCatalogProducts } from './catalogFilters'

const products: CatalogProduct[] = [
  {
    id: 'remeza-10', name: 'Remeza ВК10', slug: 'remeza-vk10', sku: 'RM-10', brandId: 'remeza', subcategoryId: 'screw-compressors',
    price: 420000, oldPrice: 450000, availability: ['in-stock', 'delivery'], delivery: 'Доставка от 2 дней', purchaseMode: 'cart', popularity: 90, isNew: false,
    specs: { voltage: '380', performance: '10', pressure: '10', power: '7.5', receiver: '500', lubrication: 'oil', drive: 'belt', noise: '68', country: 'belarus' },
  },
  {
    id: 'berg-15', name: 'Berg ВК15', slug: 'berg-vk15', sku: 'BG-15', brandId: 'berg', subcategoryId: 'screw-compressors',
    price: 510000, availability: ['to-order'], delivery: 'Срок по запросу', purchaseMode: 'quote', popularity: 70, isNew: true,
    specs: { voltage: '220', performance: '15', pressure: '8', power: '11', receiver: '300', lubrication: 'oil-free', drive: 'direct', noise: '64', country: 'china' },
  },
]

describe('catalog listing state', () => {
  test('round-trips ordinary filters, tag, sorting and view through query parameters', () => {
    const state = parseListingState(new URLSearchParams('brand=remeza&voltage=380&tag=pressure%3A10&sort=price-asc&view=list&page=2'))

    expect(state.brands).toEqual(['remeza'])
    expect(state.specs.voltage).toEqual(['380'])
    expect(state.tag).toEqual({ group: 'pressure', value: '10' })
    expect(state.sort).toBe('price-asc')
    expect(state.view).toBe('list')
    expect(state.page).toBe(2)
    expect(serializeListingState(state).toString()).toContain('tag=pressure%3A10')
  })

  test('combines regular filters with a separate tag criterion', () => {
    const state = parseListingState(new URLSearchParams('brand=remeza&availability=in-stock&tag=pressure%3A10'))
    expect(filterCatalogProducts(products, state).map((product) => product.id)).toEqual(['remeza-10'])
  })

  test('returns an empty collection for an impossible combination', () => {
    const state = parseListingState(new URLSearchParams('brand=berg&voltage=380'))
    expect(filterCatalogProducts(products, state)).toEqual([])
  })

  test('sorts and paginates without mutating the source collection', () => {
    const sorted = sortCatalogProducts(products, 'price-desc')
    expect(sorted.map((product) => product.id)).toEqual(['berg-15', 'remeza-10'])
    expect(products[0].id).toBe('remeza-10')
    expect(paginateProducts(sorted, 2, 1)).toEqual({ items: [products[0]], page: 2, pages: 2, total: 2 })
  })
})
