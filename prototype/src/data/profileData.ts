import { prototypeData } from './prototypeData'

export type ProfileOrderStatus = 'В обработке' | 'Получен' | 'Отменён' | 'Заявка на отмену отправлена'
export type ProfileOrderKind = 'personal' | 'organization'
export type ProfileOrderItem = { productId: string; name: string; quantity: number; available: boolean }
export type ProfileOrder = {
  id: string
  number: string
  date: string
  status: ProfileOrderStatus
  kind: ProfileOrderKind
  organization?: string
  inn?: string
  total: string
  delivery: string
  payment: string
  items: ProfileOrderItem[]
  recipient: { firstName: string; lastName: string; phone: string; relation: 'owner' | 'other' }
  address: string
  canEdit: boolean
  canCancel: boolean
  timeline: Array<{ label: string; complete: boolean; current?: boolean }>
}

export type ProfileOrganization = {
  id: string
  name: string
  inn: string
  kpp: string
  legalAddress: string
  bank: string
  account: string
  active: boolean
}

export const profileConfig = {
  showBonusCard: false,
  authMode: 'decision-pending' as const,
  cancelMode: 'request' as const,
  allowMultipleOrganizations: true,
}

const product = (id: string) => prototypeData.products.find((item) => item.id === id)!

export const profileData = {
  user: { firstName: 'Алексей', lastName: 'Смирнов', phone: '+7 900 000-00-00', email: 'demo@garage.example', phoneVerified: true },
  favoriteProductIds: ['product-1', 'product-4'],
  recentlyViewedProductIds: ['product-5', 'product-2', 'product-9', 'product-3', 'product-7'],
  orders: [
    {
      id: 'order-102', number: 'GR-1024', date: '15 сентября 2026', status: 'В обработке', kind: 'personal', total: '248 900 ₽', delivery: 'Доставка до мастерской', payment: 'При получении', address: 'Ярославль, ул. Промышленная, 12', canEdit: true, canCancel: true,
      recipient: { firstName: 'Алексей', lastName: 'Смирнов', phone: '+7 900 000-00-00', relation: 'owner' },
      items: [{ productId: 'product-1', name: product('product-1').name, quantity: 1, available: true }, { productId: 'product-4', name: product('product-4').name, quantity: 1, available: true }, { productId: 'product-10', name: product('product-10').name, quantity: 1, available: false }],
      timeline: [{ label: 'Заказ оформлен', complete: true }, { label: 'В обработке', complete: true, current: true }, { label: 'Готовится к передаче', complete: false }, { label: 'Получен', complete: false }],
    },
    {
      id: 'order-087', number: 'GR-0871', date: '2 августа 2026', status: 'Получен', kind: 'personal', total: '54 900 ₽', delivery: 'Самовывоз', payment: 'Оплачен', address: 'Пункт выдачи, Ярославль', canEdit: false, canCancel: false,
      recipient: { firstName: 'Алексей', lastName: 'Смирнов', phone: '+7 900 000-00-00', relation: 'owner' },
      items: [{ productId: 'product-5', name: product('product-5').name, quantity: 1, available: true }],
      timeline: [{ label: 'Заказ оформлен', complete: true }, { label: 'В обработке', complete: true }, { label: 'Готов к выдаче', complete: true }, { label: 'Получен', complete: true, current: true }],
    },
    {
      id: 'order-061', number: 'GR-0618', date: '18 июня 2026', status: 'Отменён', kind: 'personal', total: '27 900 ₽', delivery: 'Доставка', payment: 'Не оплачен', address: 'Ярославль', canEdit: false, canCancel: false,
      recipient: { firstName: 'Алексей', lastName: 'Смирнов', phone: '+7 900 000-00-00', relation: 'owner' },
      items: [{ productId: 'product-2', name: product('product-2').name, quantity: 1, available: true }],
      timeline: [{ label: 'Заказ оформлен', complete: true }, { label: 'Отменён', complete: true, current: true }],
    },
    {
      id: 'order-org-31', number: 'ORG-0312', date: '10 сентября 2026', status: 'В обработке', kind: 'organization', organization: 'ООО «АвтоПрофи»', inn: '7600000000', total: '438 600 ₽', delivery: 'Доставка до организации', payment: 'Счёт', address: 'Ярославль, пр-т Октября, 41', canEdit: true, canCancel: true,
      recipient: { firstName: 'Марина', lastName: 'Орлова', phone: '+7 900 111-22-33', relation: 'other' },
      items: [{ productId: 'product-9', name: product('product-9').name, quantity: 2, available: true }],
      timeline: [{ label: 'Заказ оформлен', complete: true }, { label: 'Счёт подтверждён', complete: true, current: true }, { label: 'Комплектация', complete: false }, { label: 'Получен', complete: false }],
    },
  ] satisfies ProfileOrder[],
  organizations: [
    { id: 'org-1', name: 'ООО «АвтоПрофи»', inn: '7600000000', kpp: '760001001', legalAddress: '150000, г. Ярославль, пр-т Октября, 41', bank: 'Демонстрационный банк', account: '40702 •••• 0042', active: true },
    { id: 'org-2', name: 'ООО «Мастерская Север»', inn: '7600000019', kpp: '760001002', legalAddress: '150010, г. Ярославль, ул. Индустриальная, 8', bank: 'Демонстрационный банк', account: '40702 •••• 0188', active: false },
  ] satisfies ProfileOrganization[],
  addresses: ['Ярославль, ул. Промышленная, 12', 'Ярославль, пр-т Октября, 41'],
  serviceRequests: [
    { id: 'SR-104', date: '16 сентября 2026', service: 'Подбор автоэмали', status: 'Принята', city: 'Ярославль', contact: '+7 900 000-00-00' },
    { id: 'SR-098', date: '12 сентября 2026', service: 'Сервисный центр', status: 'В работе', city: 'Ярославль', contact: '+7 900 000-00-00' },
    { id: 'SR-082', date: '27 августа 2026', service: 'Оснащение автосервиса', status: 'Требуется уточнение', city: 'Кострома', contact: '+7 900 000-00-00' },
    { id: 'SR-041', date: '4 июля 2026', service: 'Аренда оборудования', status: 'Завершена', city: 'Ярославль', contact: '+7 900 000-00-00' },
  ],
  reviews: [
    { id: 'review-1', product: product('product-1'), status: 'Опубликован', text: 'Подходит для демонстрации структуры отзыва.', canEdit: true },
    { id: 'review-2', product: product('product-4'), status: 'На модерации', text: 'Отзыв отправлен и ожидает проверки.', canEdit: true },
    { id: 'review-3', product: product('product-5'), status: 'Отклонён', text: 'Нужно уточнить опыт использования товара.', canEdit: true },
  ],
}
