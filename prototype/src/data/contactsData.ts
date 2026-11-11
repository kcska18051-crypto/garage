export type ContactPoint = {
  id: string
  slug: string
  city: string
  coordinates: { lat: number; lng: number }
  name: string
  kind: string
  address: string
  hours: string
  phone: string
  email: string
  mapPosition: { x: number; y: number }
}

export const contactPoints: ContactPoint[] = [
  { id: 'store', slug:'yaroslavl', city: 'Ярославль', coordinates: { lat: 57.626, lng: 39.893 }, name: 'Магазин «Гараж»', kind: 'Торговая точка', address: 'Адрес уточняется', hours: 'График уточняется', phone: '+7 (000) 000-00-01', email: 'store@example.com', mapPosition: { x: 28, y: 35 } },
  { id: 'pickup', slug:'vologda', city: 'Вологда', coordinates: { lat: 59.22, lng: 39.89 }, name: 'Пункт выдачи «Гараж»', kind: 'Получение заказов', address: 'Адрес уточняется', hours: 'График уточняется', phone: '+7 (000) 000-00-02', email: 'pickup@example.com', mapPosition: { x: 65, y: 28 } },
  { id: 'service', slug:'cherepovets', city: 'Череповец', coordinates: { lat: 59.128, lng: 37.909 }, name: 'Сервисная точка «Гараж»', kind: 'Консультации', address: 'Адрес уточняется', hours: 'График уточняется', phone: '+7 (000) 000-00-03', email: 'service@example.com', mapPosition: { x: 54, y: 68 } },
]

export const primaryContacts = {
  phone: '+7 (000) 000-00-00',
  email: 'contact@example.com',
  address: 'Адрес уточняется',
  hours: 'График уточняется',
}
