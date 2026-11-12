import {formatAvailability} from '../../utils/availability'
import { useProfile } from '../../state/ProfileState'
import { getDemoProduct, asProductCard } from '../../data/productRegistry'
import { ProductTeaserCard } from '../products/ProductTeaserCard'
import {cartProductPhoto} from './CartProductImage'

export function CartViewed() {
  const { recentProductIds } = useProfile()
  const products = recentProductIds.map(getDemoProduct).filter(product => product !== undefined)
  if (!products.length) return null
  return <section className="cart-viewed" aria-label="Просмотренные товары"><h2>Просмотренные товары</h2><div>{products.map((product, index) => <ProductTeaserCard approved key={product.id} product={{...asProductCard(product),image:cartProductPhoto(product),availability:formatAvailability(product.availabilityStatus,product.storeCount)}} index={index}/>)}</div></section>
}
