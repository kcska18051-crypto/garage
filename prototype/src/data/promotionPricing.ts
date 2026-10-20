// Демонстрационная акция. Цена принадлежит товару, а не месту его показа.
export const promotionHref = '/actions/professional-workshop'
export function promotionPrice(id: string, price: number, quote = false) {
  const offerPrices: Record<string, number> = { 'remeza-vk-10-380-55': 194000, 'remeza-vk-10-220-55': 188500 }
  if (!quote && offerPrices[id]) return { price, oldPrice: offerPrices[id], promotionHref }
  const index = Number(id.match(/\d+$/)?.[0] ?? 0)
  const active = !quote && (id === 'remeza-vk-10-gr-0001' || (id.startsWith('product-') ? [1, 2, 4, 6, 8].includes(index) : id.startsWith('compressor-') && [4,5,6,7,9,12,13,14,16,21,23,24,26].includes(index)))
  return { price, oldPrice: active ? Math.round(price * 1.12) : undefined, promotionHref: active ? promotionHref : undefined }
}
