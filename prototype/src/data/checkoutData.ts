import type { AvailabilityStatus } from '../utils/availability'
import { demoProducts } from './productRegistry'
import { productDetail } from './productDetailData'

export type CheckoutProduct = { id: string; name: string; sku: string; modification: string; price: number; availabilityStatus: AvailabilityStatus; storeCount: number; href: string }

export const checkoutProducts = demoProducts

export const money = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`

export function optionParentLabel(id: string) {
  const offer = productDetail.offers.find(offer => offer.id === id)
  if (offer) return `${Object.values(offer.options).join(' · ')} (${offer.sku})`
  const product = checkoutProducts.find(product => product.id === id)
  return product ? `${product.name} (${product.sku})` : id
}
