export type HeaderQuickLink = {
  id: string
  label: string
  href: string
  order: number
  tone?: 'default' | 'accent'
  visible?: boolean
  visibleOnMobile?: boolean
}

export type HeaderQuickLinksConfig = {
  enabled: boolean
  mobileEnabled: boolean
  items: HeaderQuickLink[]
}

export const headerQuickLinksConfig: HeaderQuickLinksConfig = {
  enabled: true,
  mobileEnabled: true,
  items: [
    { id: 'actions', label: 'Акции', href: '/actions', order: 0, tone: 'accent' },
    { id: 'compressors', label: 'Компрессоры', href: '/catalog/compressor-equipment', order: 10 },
    { id: 'lifting', label: 'Подъёмное оборудование', href: '/catalog/lifting', order: 20 },
    { id: 'body', label: 'Кузовной ремонт', href: '/catalog/body', order: 30 },
    { id: 'paint', label: 'Покраска', href: '/catalog/paint', order: 40 },
    { id: 'tools', label: 'Инструмент', href: '/catalog/tools', order: 50 },
    { id: 'new', label: 'Новинки', href: '/new', order: 60 },
    { id: 'workshop', label: 'Оснащение автосервиса', href: '/services/workshop', order: 80, visibleOnMobile: false },
    { id: 'remeza', label: 'Remeza', href: '/brand/remeza', order: 90 },
    { id: 'welding', label: 'Сварочное оборудование', href: '/catalog/welding', order: 100, visible: false },
  ],
}

export function getVisibleHeaderQuickLinks(config: HeaderQuickLinksConfig, mobile = false) {
  if (!config.enabled || (mobile && !config.mobileEnabled)) return []
  return config.items
    .filter((item) => item.visible !== false && (!mobile || item.visibleOnMobile !== false))
    .sort((first, second) => first.order - second.order)
}
