import { findSearchSuggestions } from './searchData'

describe('search suggestions', () => {
  it('finds products by article', () => {
    expect(findSearchSuggestions('GR-0001')).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'Товар', name: expect.stringContaining('Remeza') }),
    ]))
  })

  it('mixes products and categories for a subject query', () => {
    const results = findSearchSuggestions('компресс')
    expect(results.some((item) => item.kind === 'Товар')).toBe(true)
    expect(results.some((item) => item.kind === 'Категория')).toBe(true)
  })

  it('finds a brand and ignores queries shorter than two characters', () => {
    expect(findSearchSuggestions('remeza')).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'Бренд', name: 'Remeza' }),
    ]))
    expect(findSearchSuggestions('r')).toEqual([])
  })
})
