import { checkoutProducts } from '../../data/checkoutData'
import { promotionPrice } from '../../data/promotionPricing'
import type { CartLine } from '../../state/CommerceState'

export type PriceLine = { id: string; quantity: number; unitPrice: number; oldPrice?: number; quote?: boolean }
export function priceCart(lines: PriceLine[], promoCode?: string) {
  const active = promoCode === '123'
  const rows = lines.map(line => {
    const currentCents = line.quote ? 0 : Math.max(0, Math.round(line.unitPrice * 100)) * line.quantity
    const referenceCents = line.quote ? 0 : Math.max(currentCents, Math.round((line.oldPrice ?? line.unitPrice) * 100) * line.quantity)
    return { id: line.id, currentCents, referenceCents, promoCents: active ? Math.floor(currentCents / 10) : 0, totalCents: currentCents, quote: Boolean(line.quote) }
  })
  const currentCents = rows.reduce((sum, row) => sum + row.currentCents, 0)
  const referenceCents = rows.reduce((sum, row) => sum + row.referenceCents, 0)
  const promoDiscountCents = active ? Math.floor((currentCents + 5) / 10) : 0
  let remainder = promoDiscountCents - rows.reduce((sum, row) => sum + row.promoCents, 0)
  for (const row of rows) {
    if (remainder && row.currentCents % 10) { row.promoCents++; remainder-- }
    row.totalCents = row.currentCents - row.promoCents
  }
  return { currentCents, referenceCents, productDiscountCents: referenceCents - currentCents, promoDiscountCents, totalCents: currentCents - promoDiscountCents, rows }
}

export const selectedCartLines = (lines: CartLine[], selectedIds?: string[]) => Array.isArray(selectedIds) ? lines.filter(line => selectedIds.includes(line.id)) : lines

export function getCartPricing(lines: CartLine[], promoCode?: string) {
  return priceCart(lines.map(line => {
    const product = checkoutProducts.find(p => p.id === line.id)
    const quote = !product || product.purchaseMode === 'quote'
    return { id: line.id, quantity: line.quantity, unitPrice: product?.price ?? 0, oldPrice: product ? promotionPrice(product.id, product.price, quote).oldPrice : undefined, quote }
  }), promoCode)
}
