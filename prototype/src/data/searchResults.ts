import {catalogProducts,catalogBrands,compressorSubcategories} from './catalogData'
import type {CatalogProduct} from './catalogTypes'
import {findSearchProducts} from './productRegistry'
import {productDetail} from './productDetailData'

export function searchCatalogProducts(query:string):CatalogProduct[] {
  return findSearchProducts(query).map((item,index)=>{
    const catalog=catalogProducts.find(product=>product.id===item.id)
    if(catalog)return {...catalog,popularity:1000-index}
    const offer=productDetail.offers.find(offer=>offer.id===item.id)
    const available=item.availabilityStatus==='available'&&item.storeCount>0
    const unavailable=item.availabilityStatus==='Нет в наличии'||item.availabilityStatus==='Снят с производства'
    const section=offer?'screw-compressors':item.name==='Компрессор поршневой'?'piston-compressors':item.name==='Ресивер вертикальный'?'receivers':item.name==='Осушитель рефрижераторный'||item.id==='option-dryer'?'dryers':'other-products'
    return {id:item.id,name:item.name,slug:item.href.replace('/product/',''),sku:item.sku,
      brandId:catalogBrands.find(brand=>brand.name===item.brand)?.id??'',
      subcategoryId:section,price:item.price,
      availability:available?['in-stock']:unavailable?[]:['to-order'],storeCount:Math.min(3,item.storeCount),
      availabilityLabel:available?'available':unavailable?item.availabilityStatus as 'Нет в наличии'|'Снят с производства':'Под заказ',delivery:'Уточняется',
      purchaseMode:item.purchaseMode??'cart',popularity:1000-index,isNew:false,specs:{}}
  })
}
export const searchSectionLabel=(id:string)=>compressorSubcategories.find(item=>item.id===id)?.name??'Другие товары'
