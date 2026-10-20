import { decodeCart } from './CartTools'
import { checkoutProducts } from '../../data/checkoutData'
import { formatAvailability } from '../../utils/availability'
import { encodeCart } from '../../data/sharedCartData'
import { mergeCartLines } from '../../state/CommerceState'
const encode = (value: unknown) => btoa(JSON.stringify(value))
describe('shared equipment option contract', () => {
  it('preserves two variant allocations rather than silently dropping their relationship', () => {
    const decoded = decodeCart(encode([{ id: 'option-dryer', quantity: 5, optionParents: { 'remeza-vk-10-gr-0001': 2, 'remeza-vk-10-220-55': 3 } }]))
    expect(decoded[0]).toMatchObject({ id: 'option-dryer', quantity: 5, optionParents: { 'remeza-vk-10-gr-0001': 2, 'remeza-vk-10-220-55': 3 } })
  })
  it.each([
    { 'not-a-variant': 1 },
    { 'product-1': 1 },
    { 'remeza-vk-10-gr-0001': 3 },
    { 'remeza-vk-10-gr-0001': -1 },
    { 'remeza-vk-10-gr-0001': 1.5 },
  ])('rejects invalid parent assignments %j', optionParents => {
    expect(decodeCart(encode([{ id: 'option-dryer', quantity: 2, optionParents }]))).toEqual([])
  })
  it('keeps old simple links usable and never imports personal fields', () => {
    expect(decodeCart(encode([{ id: 'product-2', quantity: 2, address: 'do not import' }]))).toEqual([{ id: 'product-2', quantity: 2 }])
  })
  it('rejects malformed relationship containers and non-option attachments', () => {
    for (const optionParents of [null, [], 'variant']) expect(decodeCart(encode([{ id: 'option-dryer', quantity: 1, optionParents }]))).toEqual([])
    expect(decodeCart(encode([{ id: 'supply-oil', quantity: 1, optionParents: { 'remeza-vk-10-gr-0001': 1 } }]))).toEqual([])
    expect(decodeCart(encode([{ id: 'option-dryer', quantity: 1, optionFor: 42 }]))).toEqual([])
  })
  it('merges quantities by stable variant SKU while retaining independently added units', () => {
    const existing = [{ id: 'option-dryer', quantity: 3, optionFor: 'remeza-vk-10-gr-0001', optionParents: { 'remeza-vk-10-gr-0001': 2 } }, { id: 'product-2', quantity: 1 }]
    const imported = decodeCart(encode([{ id: 'option-dryer', quantity: 6, optionParents: { 'remeza-vk-10-gr-0001': 2, 'remeza-vk-10-220-55': 3 } }]))
    const merged = mergeCartLines(existing,imported)
    expect(merged).toHaveLength(2)
    expect(merged[0]).toMatchObject({ quantity: 9, optionParents: { 'remeza-vk-10-gr-0001': 4, 'remeza-vk-10-220-55': 3 } })
    expect(merged[1]).toMatchObject({ id: 'product-2', quantity: 1 })
    expect(existing[0].quantity).toBe(3)
    const linkData = JSON.parse(atob(encodeCart(merged)))
    expect(linkData[0]).toEqual({ id: 'option-dryer', quantity: 9, optionParents: { 'remeza-vk-10-gr-0001': 4, 'remeza-vk-10-220-55': 3 } })
  })
  it('uses orderable status without invented store stock for options and consumables', () => {
    for (const id of ['option-dryer','option-control','supply-oil','supply-filter']) {
      const product = checkoutProducts.find(p=>p.id===id)!
      expect(formatAvailability(product.availabilityStatus,product.storeCount),id).toBe('Доступно для заказа')
    }
  })
})
