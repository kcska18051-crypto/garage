import { demoProducts,findSearchProducts } from './productRegistry'
import { findSearchSuggestions } from './searchData'
import { compareProducts } from './compareData'
import { catalogProducts,compressorSubcategories,fullFilterGroups } from './catalogData'
import { productDetail } from './productDetailData'

it('retains distinct demo IDs with a repeated article in both search consumers',()=>{
  const results=findSearchProducts('GR-0001')
  expect(results.map(p=>p.id)).toEqual(expect.arrayContaining(['product-1','remeza-vk-10-gr-0001']))
  expect(new Set(demoProducts.map(p=>p.id)).size).toBe(demoProducts.length)
  for(const p of results) expect(findSearchSuggestions('GR0001',100).some(item=>item.kind==='Товар' && item.href===p.href)).toBe(true)
})
it('normalizes joined model names and searches known category names without inventing stock',()=>{
  expect(findSearchProducts('вк10').map(p=>p.id)).toContain('remeza-vk-10-gr-0001')
  expect(findSearchProducts('КОМПРЕССОР').length).toBeGreaterThan(20)
  expect(findSearchProducts('нет-существующего-товара')).toEqual([])
})
it('keeps demo performance value and units aligned through tags, filters, PDP and compare',()=>{
  const model=catalogProducts.find(p=>p.id==='remeza-vk-10-gr-0001')!
  expect(model.specs.performance).toBe('10')
  expect(productDetail.keySpecs.find(([key])=>key==='Производительность')?.[1]).toBe('10 л/мин')
  expect(compareProducts.find(p=>p.id===model.id)?.specs['Производительность']).toBe('10 л/мин')
  expect(fullFilterGroups.find(group=>group.id==='performance')?.options?.find(item=>item.value==='10')?.label).toBe('10 л/мин')
  expect(compressorSubcategories[0].tagGroups?.find(group=>group.id==='performance')?.values.find(item=>item.value==='10')?.label).toBe('10 л/мин')
})
