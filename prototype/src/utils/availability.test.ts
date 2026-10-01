import { describe, expect, it } from 'vitest'
import { formatAvailability } from './availability'

describe('formatAvailability', () => {
  it.each([[1, 'В наличии в 1 магазине'], [2, 'В наличии в 2 магазинах'], [5, 'В наличии в 5 магазинах'], [21, 'В наличии в 21 магазине']])('formats %s stores', (count, label) => {
    expect(formatAvailability('available', count)).toBe(label)
  })

  it.each(['Под заказ', 'Нет в наличии', 'Снят с производства'] as const)('keeps %s status', (status) => {
    expect(formatAvailability(status)).toBe(status)
  })

  it('does not present zero stores as in-stock', () => {
    expect(formatAvailability('available', 0)).toBe('Доступно для заказа')
  })
})
