import {productSpecLink} from './productSpecLinks'
import {defaultOffer,productDetail} from '../../data/productDetailData'
import {catalogProducts} from '../../data/catalogData'
import {filterCatalogProducts,parseListingState} from '../catalog/catalogFilters'
it.each([
 ['Производительность','10 л/мин'],['Максимальное давление','10 бар'],['Тип компрессора','Винтовой'],['Тип привода','Ременной'],['Система смазки','Масляная'],['Мощность двигателя','Зависит от варианта'],['Напряжение питания','Зависит от варианта'],
])('links %s to a non-empty matching compressor selection',(name,value)=>{
 const spec=productSpecLink(name,value,defaultOffer)
 const url=new URL(spec.href!,'https://example.com')
 expect(url.pathname).toBe('/catalog/compressor-equipment');expect(url.searchParams.get('listing')).toBe('all')
 const products=catalogProducts.filter(p=>['screw-compressors','piston-compressors','oil-free-compressors'].includes(p.subcategoryId))
 const matches=filterCatalogProducts(products,parseListingState(url.searchParams,Object.keys(products[0].specs)))
 expect(matches.length).toBeGreaterThan(0);expect(matches.length).toBeLessThan(products.length)
})
it('uses the actually selected modification and leaves unknown properties without fake links',()=>{
 const offer=productDetail.offers.find(o=>o.id==='remeza-vk-10-220-55')!
 expect(productSpecLink('Напряжение питания','Зависит от варианта',offer)).toEqual({value:'220 В',href:'/catalog/compressor-equipment?listing=all&voltage=220'})
 expect(productSpecLink('Мощность двигателя','Зависит от варианта',offer)).toEqual({value:'5,5 кВт',href:'/catalog/compressor-equipment?listing=all&power=5.5'})
 expect(productSpecLink('Уровень шума','Данные уточняются',offer)).toEqual({value:'Данные уточняются'})
})
