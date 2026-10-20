import type { CartLine } from '../state/CommerceState'
import { checkoutProducts } from './checkoutData'
import { equipmentOptions } from './productRelations'
import { productDetail } from './productDetailData'

const productIds = new Set(checkoutProducts.map(product => product.id))
const optionIds = new Set(equipmentOptions.map(product => product.id))
const variantIds = new Set(productDetail.offers.map(offer => offer.id))
const validQuantity = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 999

export function decodeCart(value: string): CartLine[] {
  try {
    if (value.length > 65536) return []
    const payload: unknown = JSON.parse(atob(value))
    if (!Array.isArray(payload) || payload.length > 100) return []
    const lines: CartLine[] = []
    const ids = new Set<string>()
    for (const item of payload) {
      if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !productIds.has(item.id) || ids.has(item.id) || !validQuantity(item.quantity)) return []
      ids.add(item.id)
      const line: CartLine = { id: item.id, quantity: item.quantity }
      if (Object.hasOwn(item,'optionFor') && typeof item.optionFor !== 'string') return []
      const rawParents: unknown = Object.hasOwn(item,'optionParents') ? item.optionParents : (typeof item.optionFor === 'string' ? { [item.optionFor]: item.quantity } : undefined)
      if (rawParents !== undefined) {
        if (!optionIds.has(item.id) || !rawParents || typeof rawParents !== 'object' || Array.isArray(rawParents)) return []
        const parents: Record<string, number> = {}
        let allocated = 0
        for (const [parentId, count] of Object.entries(rawParents)) {
          if (!variantIds.has(parentId) || !validQuantity(count)) return []
          parents[parentId] = count
          allocated += count
        }
        if (allocated > item.quantity) return []
        if (allocated > 0) { line.optionParents = parents; line.optionFor = Object.keys(parents)[0] }
      }
      lines.push(line)
    }
    return lines
  } catch { return [] }
}

export function encodeCart(lines: CartLine[]): string {
  // Stable SKU/variant identifiers only: no prices, stock, contacts or addresses.
  const payload = lines.map(line => {
    const parents = line.optionParents ?? (line.optionFor ? { [line.optionFor]: line.quantity } : undefined)
    return { id: line.id, quantity: line.quantity, ...(parents && Object.keys(parents).length ? { optionParents: parents } : {}) }
  })
  return btoa(JSON.stringify(payload))
}
