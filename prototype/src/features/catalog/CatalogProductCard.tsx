import type { CatalogProduct } from '../../data/catalogTypes'
import { ProductTeaserCard } from '../products/ProductTeaserCard'
import { formatAvailability } from '../../utils/availability'

import { useLocation } from 'react-router-dom'
import { compressorCategoryImages } from './compressorCategoryImages'
import { styleCheckProductPhotos } from '../../data/styleCheckAssets'

const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`
export function CatalogProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  const approved = useLocation().pathname.startsWith('/catalog/compressor-equipment/')
  return <ProductTeaserCard approved={approved} className="catalog-product-card" index={index} product={{ id: product.id, name: product.name, image: styleCheckProductPhotos[product.name] || compressorCategoryImages[product.subcategoryId], href: `/product/${product.slug}`, sku: product.sku, price: money(product.price), oldPrice: product.oldPrice ? money(product.oldPrice) : undefined, purchaseMode: product.purchaseMode, availability: formatAvailability(product.availabilityLabel, product.storeCount) }} />
}
