import type { AvailabilityStatus } from '../utils/availability'
export type RelatedProduct = { id: string; name: string; sku: string; price: number; description: string; availabilityStatus: AvailabilityStatus; storeCount: number }

export const equipmentOptions: RelatedProduct[] = [
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'option-dryer', name: 'Модуль осушения воздуха', sku: 'OPT-01', price: 42000, description: 'Дополнительный узел подготовки воздуха для демонстрационной конфигурации ВК 10.' },
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'option-control', name: 'Модуль удалённого управления', sku: 'OPT-02', price: 18500, description: 'Узел контроля для выбранного оборудования. Совместимость подтвердит поставщик.' },
]
export const companionProducts: RelatedProduct[] = [
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'supply-oil', name: 'Компрессорное масло', sku: 'SUP-01', price: 3900, description: 'Расходный материал; марку и допуск уточнить по паспорту.' },
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'supply-filter', name: 'Сервисный фильтр', sku: 'SUP-02', price: 2400, description: 'Расходник для обслуживания компрессорной линии.' },
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'supply-organizer', name: 'Органайзер для инструмента', sku: 'SUP-03', price: 4600, description: 'Хранение инструмента рабочего поста.' },
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'supply-pad', name: 'Резиновая опора для домкрата', sku: 'SUP-04', price: 900, description: 'Защитная накладка; совместимость уточняется по размеру опоры.' },
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'supply-paint', name: 'Фильтры для краски', sku: 'SUP-05', price: 450, description: 'Принадлежности для подготовки материала к распылению.' },
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'supply-abrasive', name: 'Шлифовальные круги', sku: 'SUP-06', price: 1200, description: 'Расходники для шлифовальной машинки; размер уточняется.' },
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'supply-cable', name: 'Соединительный кабель', sku: 'SUP-07', price: 1800, description: 'Принадлежность для диагностического рабочего поста; разъём уточняется.' },
  { availabilityStatus: 'Доступно для заказа', storeCount: 0, id: 'supply-welding', name: 'Сварочная проволока', sku: 'SUP-08', price: 2400, description: 'Расходник для сварочного поста; тип проволоки уточняется.' },
]
const homeRelations: Record<string, number[]> = { 'product-1':[3], 'product-2':[0,1,2,4,5], 'product-3':[0,1,2,3,5,6], 'product-4':[0,1,2,3,4,5,6], 'product-5':[0,1,2,3,4,5,6,7], 'product-6':[5], 'product-7':[2], 'product-8':[7], 'product-9':[1], 'product-10':[1], 'option-control':[6], 'supply-oil':[1], 'supply-filter':[0], 'supply-organizer':[3], 'supply-pad':[2], 'supply-paint':[2], 'supply-abrasive':[2], 'supply-cable':[2], 'supply-welding':[2] }
export const relatedForCart = (id: string) => (homeRelations[id] ?? [0,1]).map(index => companionProducts[index]).filter(p => p.id !== id)
