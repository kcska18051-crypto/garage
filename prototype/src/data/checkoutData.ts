import type { AvailabilityStatus } from '../utils/availability'
import { prototypeData } from './prototypeData'
import { catalogProducts } from './catalogData'
import { equipmentOptions, companionProducts } from './productRelations'
import { productDetail } from './productDetailData'

export type CheckoutProduct = { id: string; name: string; sku: string; modification: string; price: number; availabilityStatus: AvailabilityStatus; storeCount: number; href: string }

export const checkoutProducts: CheckoutProduct[] = [
  ...prototypeData.products.map(product => ({ ...product, modification: 'Демонстрационный товар', price: Number(product.price.replace(/\D/g, '')) })),
  ...catalogProducts.map(product => ({ ...product, modification: 'Демонстрационная комплектация', availabilityStatus: product.availabilityLabel as AvailabilityStatus, href: `/product/${product.slug}` })),
  ...productDetail.offers.slice(1).map(offer => ({ ...offer, name: productDetail.name, modification: Object.values(offer.options).join(' · '), availabilityStatus: 'available' as const, storeCount: 2, href: `/product/${productDetail.id}` })),
  ...[...equipmentOptions, ...companionProducts].map(product => ({ ...product, modification: product.description, href: `/product/${productDetail.id}#${product.id.startsWith('option-') ? 'options' : 'companion-products'}` })),
]

export const money = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`

export function optionParentLabel(id: string) {
  const offer = productDetail.offers.find(offer => offer.id === id)
  if (offer) return `${Object.values(offer.options).join(' · ')} (${offer.sku})`
  const product = checkoutProducts.find(product => product.id === id)
  return product ? `${product.name} (${product.sku})` : id
}
