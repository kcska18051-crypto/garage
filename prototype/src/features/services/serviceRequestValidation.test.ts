import { describe, expect, it } from 'vitest'
import { isServicePhoneValid, localDateString, validateRental, validatePhoto } from './serviceRequestValidation'

describe('service request validation', () => {
  it.each(['+7 (999) 123-45-67', '1234567890', '123456789012345'])('accepts phone %s', (phone) => expect(isServicePhoneValid(phone)).toBe(true))
  it.each(['call 79991234567', '123456789', '1234567890123456', '7/999/1234567', ''])('rejects phone %s', (phone) => expect(isServicePhoneValid(phone)).toBe(false))
  it('uses the local calendar date', () => {
    expect(localDateString(new Date(2026, 0, 2, 0, 1))).toBe('2026-01-02')
  })
  it('allows same-day rental and a positive integer', () => {
    expect(validateRental('2026-10-21', '2026-10-21', '1', '2026-10-21')).toEqual({})
  })
  it.each([
    ['', '', '1', ['start', 'end']],
    ['2026-10-20', '2026-10-21', '1', ['start']],
    ['2026-10-22', '2026-10-21', '1', ['end']],
    ['2026-10-21', '2026-10-21', '0', ['quantity']],
    ['2026-10-21', '2026-10-21', '1.5', ['quantity']],
    ['2026-10-21', '2026-10-21', 'abc', ['quantity']],
  ])('rejects invalid rental values %s / %s / %s', (start, end, qty, keys) => {
    expect(Object.keys(validateRental(start as string, end as string, qty as string, '2026-10-21'))).toEqual(keys)
  })
  it('accepts supported photos at the size limit', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) expect(validatePhoto({ type, size: 5 * 1024 * 1024 })).toBeUndefined()
  })
  it('rejects unsupported and oversized photos', () => {
    expect(validatePhoto({ type: 'image/gif', size: 5 })).toMatch(/JPEG/)
    expect(validatePhoto({ type: 'image/jpeg', size: 5 * 1024 * 1024 + 1 })).toMatch(/5 МиБ/)
  })
})
