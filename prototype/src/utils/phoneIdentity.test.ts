import { normalizePhoneIdentity } from './phoneIdentity'

describe('normalizePhoneIdentity', () => {
  it.each([
    ['+7 (999) 111-22-33', '79991112233'],
    ['8 999 111 22 33', '79991112233'],
    ['9991112233', '79991112233'],
    ['+44 20 1234 5678', '442012345678'],
    ['123456789012345', '123456789012345'],
    ['', ''], ['123456789', ''], ['1234567890123456', ''],
    ['call79991112233', ''], ['79991112233 ext 1', ''], ['7999/1112233', ''],
  ])('normalizes only plausible phone input %s', (input, expected) => {
    expect(normalizePhoneIdentity(input)).toBe(expected)
  })
})
