import { catalogCategories, compressorSubcategories, formatProductCount, getCatalogCategory } from './catalogData'

describe('first-level catalog data', () => {
  it('contains six routable categories with more than five linked subcategories', () => {
    expect(catalogCategories).toHaveLength(6)
    expect(catalogCategories.map(({ slug }) => slug)).toEqual([
      'compressor-equipment',
      'lifting-equipment',
      'body-repair',
      'painting',
      'tools',
      'service-station-equipment',
    ])

    for (const category of catalogCategories) {
      expect(category.href).toBe(`/catalog/${category.slug}`)
      expect(category.subcategories.length).toBeGreaterThan(5)
      expect(category.subcategories.every(({ href }) => href.startsWith(`${category.href}/`))).toBe(true)
    }
  })

  it.each([
    [1, '1 товар'],
    [2, '2 товара'],
    [5, '5 товаров'],
    [11, '11 товаров'],
    [21, '21 товар'],
    [114, '114 товаров'],
  ])('formats %i as %s', (count, expected) => {
    expect(formatProductCount(count)).toBe(expected)
  })

  it('finds a category by slug without inventing an unknown category', () => {
    expect(getCatalogCategory('tools')?.name).toBe('Инструмент')
    expect(getCatalogCategory('missing')).toBeUndefined()
  })

  it('uses the detailed compressor sections as the root category source', () => {
    expect(getCatalogCategory('compressor-equipment')?.subcategories).toBe(compressorSubcategories)
  })
})
