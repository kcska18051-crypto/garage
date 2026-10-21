import { prototypeData } from './prototypeData'
import { catalogProducts, catalogBrands, compressorSubcategories } from './catalogData'
import { productDetail } from './productDetailData'
import { equipmentOptions, companionProducts } from './productRelations'
import { formatTechnicalSpecs } from './productProperties'
import type { AvailabilityStatus } from '../utils/availability'
import type { Product } from './types'

export type DemoProduct = { id:string; name:string; sku:string; modification:string; price:number; availabilityStatus:AvailabilityStatus; storeCount:number; href:string; brand?:string; searchTerms?:string; specs:Record<string,string>; purchaseMode?:'cart'|'quote'; imageVariant:number }
export const money = (value:number) => `${value.toLocaleString('ru-RU')} ₽`
const raw:DemoProduct[] = [
  ...prototypeData.products.map((p,index)=>({...p,price:Number(p.price.replace(/\D/g,'')),modification:'Демонстрационный товар',specs:{},imageVariant:index%4})),
  ...catalogProducts.map((p,index)=>({...p,searchTerms:`Компрессорное оборудование ${compressorSubcategories.find(c=>c.id===p.subcategoryId)?.name??''}`,href:`/product/${p.id}`,availabilityStatus:p.availabilityLabel as AvailabilityStatus,modification:'Демонстрационные параметры, не подтверждены паспортом поставщика',brand:catalogBrands.find(b=>b.id===p.brandId)?.name,specs:{...(p.subcategoryId==='screw-compressors'?{'Тип компрессора':'Винтовой'}:p.subcategoryId==='piston-compressors'?{'Тип компрессора':'Поршневой'}:{}),...formatTechnicalSpecs(p.specs)},imageVariant:index%4})),
  ...productDetail.offers.slice(1).map(offer=>({...offer,name:productDetail.name,href:`/product/${offer.id}`,brand:productDetail.brand,modification:Object.values(offer.options).join(' · '),availabilityStatus:'available' as const,storeCount:2,specs:{...formatTechnicalSpecs(catalogProducts[0].specs),'Напряжение':offer.options.voltage,'Мощность':offer.options.power},imageVariant:offer.galleryIndex})),
  ...[...equipmentOptions,...companionProducts].map((p,index)=>({...p,href:`/product/${p.id}`,modification:p.description,specs:{},imageVariant:index%4})),
]
// Stable IDs, not the colliding demonstration articles, are the identity key.
export const demoProducts = [...new Map(raw.map(p=>[p.id,p])).values()]
export const getDemoProduct = (id?:string) => demoProducts.find(p=>p.id===id)
export const asProductCard = (p:DemoProduct):Product => ({...p,price:money(p.price)})
const compact = (text:string) => text.toLocaleLowerCase().replace(/[\s\-–—]+/g,'')
export const matchesSearch = (text:string,query:string) => compact(text).includes(compact(query))
export function findSearchProducts(query:string) {
  const needle=query.trim()
  return demoProducts.filter(p=>!needle || matchesSearch(`${p.name} ${p.sku} ${p.brand??''} ${p.searchTerms??''}`,needle))
}
