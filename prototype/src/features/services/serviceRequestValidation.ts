export function isServicePhoneValid(phone: string): boolean {
  return /^\+?[\d\s().-]+$/.test(phone.trim()) && /^\d{10,15}$/.test(phone.replace(/\D/g, ''))
}

export function localDateString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function validateRental(start: string, end: string, quantity: string, today: string): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!start || start < today) errors.start = 'Выберите дату начала не раньше сегодняшнего дня'
  if (!end || end < today || (start && end < start)) errors.end = 'Дата окончания должна быть не раньше начала и сегодняшнего дня'
  if (!/^\d+$/.test(quantity) || !Number.isSafeInteger(Number(quantity)) || Number(quantity) < 1) errors.quantity = 'Укажите целое положительное количество'
  return errors
}

export function validatePhoto(photo: { type: string; size: number }): string | undefined {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(photo.type)) return 'Выберите фото JPEG, PNG или WebP'
  if (photo.size > 5 * 1024 * 1024) return 'Размер фото не должен превышать 5 МиБ'
}
