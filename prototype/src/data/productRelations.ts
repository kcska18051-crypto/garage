export const equipmentOptions = [
  { id: 'option-dryer', name: 'Модуль осушения воздуха', sku: 'OPT-01', price: 42000, description: 'Дополнительный узел подготовки воздуха для демонстрационной конфигурации ВК 10.' },
  { id: 'option-control', name: 'Модуль удалённого управления', sku: 'OPT-02', price: 18500, description: 'Узел контроля для выбранного оборудования. Совместимость подтвердит поставщик.' },
]
export const companionProducts = [
  { id: 'supply-oil', name: 'Компрессорное масло', sku: 'SUP-01', price: 3900, description: 'Расходный материал; марку и допуск уточнить по паспорту.' },
  { id: 'supply-filter', name: 'Сервисный фильтр', sku: 'SUP-02', price: 2400, description: 'Расходник для обслуживания компрессорной линии.' },
  { id: 'supply-organizer', name: 'Органайзер для инструмента', sku: 'SUP-03', price: 4600, description: 'Хранение инструмента рабочего поста.' },
  { id: 'supply-pad', name: 'Резиновая опора для домкрата', sku: 'SUP-04', price: 900, description: 'Защитная накладка; совместимость уточняется по размеру опоры.' },
]
export const relatedForCart = (id: string) => id === 'product-1' ? [companionProducts[3]] : id === 'product-2' || id.includes('organizer') ? [companionProducts[2]] : companionProducts.slice(0, 2)
