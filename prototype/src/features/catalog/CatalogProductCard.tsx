import type { CatalogProduct } from '../../data/catalogTypes'
import { ProductTeaserCard } from '../products/ProductTeaserCard'

const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`
export function CatalogProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  return <ProductTeaserCard className="catalog-product-card" index={index} product={{ id: product.id, name: product.name, href: `/product/${product.slug}`, sku: product.sku, price: money(product.price), oldPrice: product.oldPrice ? money(product.oldPrice) : undefined, purchaseMode: product.purchaseMode }} />
}
