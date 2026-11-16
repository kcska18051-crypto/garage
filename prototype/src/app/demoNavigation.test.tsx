import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DemoLink } from './DemoLink'
import { publicRoutes } from '../data/publicRoutes'
import { catalogProducts } from '../data/catalogData'
import { filterCatalogProducts, parseListingState } from '../features/catalog/catalogFilters'
import { designedProductIds, removedCatalogPaths, screwSelectionQueries, demoSelectionHref, screwListingPath } from './demoNavigation'

it('publishes only approved product pages and no unfinished category/child pages', () => {
 expect(publicRoutes.filter(path=>path.startsWith('/product/'))).toEqual(designedProductIds.map(id=>`/product/${id}`))
 for(const path of removedCatalogPaths) expect(publicRoutes).not.toContain(path)
 expect(publicRoutes.some(path=>path.startsWith(screwListingPath+'/'))).toBe(false)
})
it('keeps an unfinished product visible without a navigation target', () => {
 render(<MemoryRouter><DemoLink to="/product/product-1">Домкрат</DemoLink><DemoLink to="/product/remeza-vk-10-gr-0001">Remeza</DemoLink></MemoryRouter>)
 expect(screen.getByText('Домкрат')).not.toHaveAttribute('href')
 expect(screen.getByRole('link',{name:'Remeza'})).toHaveAttribute('href','/product/remeza-vk-10-gr-0001')
})
it.each(Object.entries(screwSelectionQueries))('filters selection %s instead of opening another page', (slug, query) => {
 expect(demoSelectionHref(`${screwListingPath}/${slug}`)).toBe(`${screwListingPath}?${query}`)
 const products=catalogProducts.filter(p=>p.subcategoryId==='screw-compressors')
 const result=filterCatalogProducts(products,parseListingState(new URLSearchParams(query),Object.keys(products[0].specs)))
 expect(result.length).toBeGreaterThan(0)
 expect(result.length).toBeLessThan(products.length)
})
