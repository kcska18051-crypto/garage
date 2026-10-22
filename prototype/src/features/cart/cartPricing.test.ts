import { priceCart } from './cartPricing'

describe('demo promo pricing in kopecks', () => {
  it('takes ten percent from current prices, not catalogue prices', () => {
    const result = priceCart([{ id: 'a', quantity: 2, unitPrice: 5000, oldPrice: 6000 }], '123')
    expect(result).toMatchObject({ currentCents: 1000000, referenceCents: 1200000, productDiscountCents: 200000, promoDiscountCents: 100000, totalCents: 900000 })
    expect(result.rows[0]).toMatchObject({ currentCents: 1000000, promoCents: 100000, totalCents: 900000 })
  })
  it('does not discount quote lines or invalid codes', () => {
    expect(priceCart([{ id: 'quote', quantity: 1, unitPrice: 185000, quote: true }], '123').totalCents).toBe(0)
    expect(priceCart([{ id: 'a', quantity: 1, unitPrice: 10000 }], 'wrong').promoDiscountCents).toBe(0)
    expect(priceCart([], '123').totalCents).toBe(0)
  })
  it('allocates rounded discount without losing kopecks', () => {
    const result = priceCart([{ id: 'a', quantity: 1, unitPrice: .05 }, { id: 'b', quantity: 1, unitPrice: .05 }], '123')
    expect(result.promoDiscountCents).toBe(1)
    expect(result.totalCents).toBe(9)
    expect(result.rows.reduce((sum, row) => sum + row.totalCents, 0)).toBe(9)
  })
})
