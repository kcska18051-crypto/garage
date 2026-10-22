import { useProfile } from '../../state/ProfileState'
import { getDemoProduct, asProductCard } from '../../data/productRegistry'
import { ProductCard } from '../products/ProductCard'

export function CartViewed() {
  const { recentProductIds } = useProfile()
  const products = recentProductIds.map(getDemoProduct).filter(product => product !== undefined)
  if (!products.length) return null
  return <section className="cart-viewed" aria-label="Просмотренные товары"><h2>Просмотренные товары</h2><div>{products.map((product, index) => <ProductCard key={product.id} product={asProductCard(product)} index={index}/>)}</div></section>
}
