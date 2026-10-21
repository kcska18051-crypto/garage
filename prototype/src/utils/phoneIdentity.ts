/** Local demo identity only; this does not verify ownership of a phone. */
export function normalizePhoneIdentity(value: string): string {
  if (!/^[+\d\s().-]*$/.test(value)) return ''
  const phone = value.replace(/\D/g, '')
  if (phone.length < 10 || phone.length > 15) return ''
  if (phone.length === 10) return `7${phone}`
  if (phone.length === 11 && phone.startsWith('8')) return `7${phone.slice(1)}`
  return phone
}
