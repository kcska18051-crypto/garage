export type AvailabilityStatus = 'available' | 'Под заказ' | 'Нет в наличии' | 'Снят с производства'

function storeWord(count: number) {
  const lastTwo = count % 100
  const last = count % 10
  if (lastTwo >= 11 && lastTwo <= 14) return 'магазинах'
  if (last === 1) return 'магазине'
  return 'магазинах'
}

export function formatAvailability(status: AvailabilityStatus, storeCount = 0) {
  if (status !== 'available') return status
  if (storeCount < 1) return 'Доступно для заказа'
  return `В наличии в ${storeCount} ${storeWord(storeCount)}`
}
