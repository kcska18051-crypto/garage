import { describe, expect, it } from 'vitest'
import { checkoutProducts } from './checkoutData'
import { prototypeData } from './prototypeData'
import { formatAvailability } from '../utils/availability'

describe('availability fixtures', () => {
  it('keeps available and unavailable demo products structurally valid', () => {
    for (const product of [...prototypeData.products, ...checkoutProducts]) {
      if (product.availabilityStatus === 'available') expect(product.storeCount).toBeGreaterThan(0)
      else expect(product.storeCount).toBe(0)
      expect(formatAvailability(product.availabilityStatus, product.storeCount)).not.toMatch(/\b0\s+магазин/)
    }
  })

  it('demonstrates 1, 2 and 5 store declensions plus every non-stock state', () => {
    const labels = prototypeData.products.map((product) => formatAvailability(product.availabilityStatus, product.storeCount))
    expect(labels).toEqual(expect.arrayContaining([
      'В наличии в 1 магазине',
      'В наличии в 2 магазинах',
      'В наличии в 5 магазинах',
      'Под заказ',
      'Нет в наличии',
      'Снят с производства',
    ]))
  })
})
