export type CheckoutProduct = { id: string; name: string; sku: string; modification: string; price: number; storeCount: number; href: string }

export const checkoutProducts: CheckoutProduct[] = [
  { id: 'product-1', name: 'Компрессор поршневой Remeza', sku: 'GR-0001', modification: '220 В · ресивер 100 л', price: 185000, storeCount: 1, href: '/product/remeza-vk-10-gr-0001' },
  { id: 'product-2', name: 'Набор инструмента для мастерской', sku: 'GR-0002', modification: 'Комплектация 108 предметов', price: 27900, storeCount: 3, href: '/product/product-2' },
]

export const money = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
