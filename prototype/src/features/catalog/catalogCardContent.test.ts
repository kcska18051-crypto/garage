import { catalogProducts } from '../../data/catalogData'
import { searchCatalogProducts } from '../../data/searchResults'
import { catalogCardContent } from './catalogCardContent'

describe('catalog card content', () => {
  it('shows at most seven formatted technical specs, excluding brand and raw configuration codes', () => {
    const content = catalogCardContent(catalogProducts[0])
    expect(content.specs.length).toBeLessThanOrEqual(7)
    expect(content.specs).toContainEqual({ label: 'Мощность', value: '7,5 кВт' })
    expect(content.specs.map(spec => spec.label)).not.toEqual(expect.arrayContaining(['Бренд', 'configuration', 'Страна производства']))
  })
  it('limits receivers to relevant existing volume and pressure values', () => {
    expect(catalogCardContent(catalogProducts.find(product => product.subcategoryId === 'receivers')!).specs.map(spec => spec.label)).toEqual(['Ресивер', 'Максимальное давление'])
  })
  it('uses the registered announcement for products without specs', () => {
    const product = searchCatalogProducts('Модуль осушения воздуха')[0]
    expect(catalogCardContent(product)).toEqual({ specs: [], announcement: 'Дополнительный узел подготовки воздуха для демонстрационной конфигурации ВК 10.' })
  })
  it('uses registered formatted offer values when search results have empty raw specs', () => {
    const product = searchCatalogProducts('').find(item => item.id === 'remeza-vk-10-220-55')!
    expect(product.specs).toEqual({})
    expect(catalogCardContent(product).specs).toContainEqual({ label: 'Напряжение', value: '220 В' })
    expect(catalogCardContent(product).specs).toContainEqual({ label: 'Мощность', value: '5,5 кВт' })
  })
})
