import type { Product } from '../../data/types'
import { ProductTeaserCard } from './ProductTeaserCard'

export function ProductCard({ product, index }: { product: Product; index: number }) {
  return <ProductTeaserCard className="product-card" index={index} product={{ id: product.id, name: product.name, href: product.href, sku: product.sku, price: product.price }} />
}
