import {useProfile} from '../../state/ProfileState'
import {searchCatalogProducts} from '../../data/searchResults'
import {CatalogProductCard} from '../catalog/CatalogProductCard'
import {CartProductImage} from './CartProductImage'

const availableProducts=searchCatalogProducts('')
export function CartViewed() {
 const {recentProductIds}=useProfile()
 const products=recentProductIds.map(id=>availableProducts.find(product=>product.id===id)).filter(product=>product!==undefined)
 if(!products.length)return null
 return <section className="cart-viewed" aria-label="Просмотренные товары"><h2>Просмотренные товары</h2><div className="catalog-results cart-viewed__rail">{products.map((product,index)=><CatalogProductCard key={product.id} product={product} index={index} quoteHref={product.purchaseMode==='quote'?'/product/'+product.slug:undefined} mediaFallback={<CartProductImage product={product}/>}/>)}</div></section>
}
