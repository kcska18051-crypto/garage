import {useProfile} from '../../state/ProfileState'
import {searchCatalogProducts} from '../../data/searchResults'
import {designedProductIds} from '../../app/demoNavigation'
import {CatalogProductCard} from '../catalog/CatalogProductCard'

const products=searchCatalogProducts('')
export function ProductRecentlyViewed(){
 const {recentProductIds}=useProfile()
 const viewed=recentProductIds.flatMap(id=>{
  const product=products.find(item=>item.id===id)
  return product&&designedProductIds.includes(id)?[product]:[]
 }).slice(0,12)
 if(!viewed.length)return null
 return <section id="recently-viewed" className="product-content-section product-recently-viewed" aria-label="Вы недавно смотрели"><h2>Вы недавно смотрели</h2><div className="catalog-results product-recently-viewed__rail" role="group" aria-label="Недавно просмотренные товары" tabIndex={0}>{viewed.map((product,index)=><CatalogProductCard key={product.id} product={product} index={index}/>)}</div></section>
}
