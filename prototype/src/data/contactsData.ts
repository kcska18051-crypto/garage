export type ContactPoint = {
  id: string
  name: string
  kind: string
  address: string
  hours: string
  phone: string
  email: string
  mapPosition: { x: number; y: number }
}

export const contactPoints: ContactPoint[] = [
  { id: 'store', name: 'Демо-магазин', kind: 'Торговая точка', address: 'Демонстрационный адрес, дом 1', hours: 'Демо-график: будни и выходные', phone: '+7 (000) 000-00-01', email: 'store@example.com', mapPosition: { x: 28, y: 35 } },
  { id: 'pickup', name: 'Демо-пункт выдачи', kind: 'Получение заказов', address: 'Демонстрационный адрес, дом 2', hours: 'Демо-график: уточняется', phone: '+7 (000) 000-00-02', email: 'pickup@example.com', mapPosition: { x: 65, y: 28 } },
  { id: 'service', name: 'Демо-сервисная точка', kind: 'Консультации', address: 'Демонстрационный адрес, дом 3', hours: 'Демо-график: по предварительному обращению', phone: '+7 (000) 000-00-03', email: 'service@example.com', mapPosition: { x: 54, y: 68 } },
]

export const primaryContacts = {
  phone: '+7 (000) 000-00-00',
  email: 'contact@example.com',
  address: 'Демонстрационный адрес компании',
  hours: 'Демо-график работы уточняется',
}
