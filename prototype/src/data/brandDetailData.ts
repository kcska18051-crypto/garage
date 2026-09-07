import { catalogProducts, fullFilterGroups } from './catalogData'
import type { TagGroup } from './catalogTypes'

export const remezaProducts = catalogProducts.filter((product) => product.brandId === 'remeza')

export const remezaCategories = [
  { id: 'piston', name: 'Поршневые компрессоры', description: 'Оборудование для периодических рабочих циклов.', href: '/catalog/compressor-equipment/piston-compressors?brand=remeza' },
  { id: 'screw', name: 'Винтовые компрессоры', description: 'Решения для продолжительной нагрузки.', href: '/catalog/compressor-equipment/screw-compressors?brand=remeza' },
  { id: 'receivers', name: 'Воздушные ресиверы', description: 'Накопительные ёмкости для пневмосетей.', href: '/catalog/compressor-equipment/receivers?brand=remeza' },
  { id: 'dryers', name: 'Осушители воздуха', description: 'Подготовка сжатого воздуха.', href: '/catalog/compressor-equipment/dryers?brand=remeza' },
  { id: 'preparation', name: 'Системы подготовки воздуха', description: 'Состав направления уточняется по ассортименту.' },
  { id: 'air-tools', name: 'Пневмоинструмент', description: 'Состав направления уточняется по ассортименту.' },
  { id: 'consumables', name: 'Расходные материалы', description: 'Состав направления уточняется по ассортименту.' },
  { id: 'parts', name: 'Запасные части', description: 'Состав направления уточняется по ассортименту.' },
]

export const remezaQuickTags: TagGroup[] = [
  { id: 'voltage', label: 'По напряжению', seoIndexable: false, values: [{ value: '220', label: '220 В', count: 1 }, { value: '380', label: '380 В', count: 5 }] },
  { id: 'pressure', label: 'По рабочему давлению', seoIndexable: false, values: [{ value: '8', label: '8 бар', count: 2 }, { value: '10', label: '10 бар', count: 2 }, { value: '12', label: '12 бар', count: 2 }] },
]

export const remezaFilterGroups = fullFilterGroups.filter((group) => ['availability', 'price', 'performance', 'voltage', 'power', 'pressure', 'receiver', 'drive'].includes(group.id))
