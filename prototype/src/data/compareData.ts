export type CompareProduct = {
  id: string
  categoryId: 'compressors' | 'tools'
  categoryLabel: string
  name: string
  sku: string
  price: number
  oldPrice?: number
  href: string
  availability: string
  specs: Record<string, string>
}

export const compareProducts: CompareProduct[] = [
  {
    id: 'product-1', categoryId: 'compressors', categoryLabel: 'Компрессоры', name: 'Remeza ВК 10', sku: 'GR-0001', price: 185000, oldPrice: 207200,
    href: '/product/remeza-vk-10-gr-0001', availability: 'В наличии в 2 магазинах',
    specs: { 'Тип компрессора': 'Винтовой', 'Производительность': '1 000 л/мин', 'Максимальное давление': '10 бар', 'Мощность': '7,5 кВт', 'Напряжение': '380 В', 'Тип привода': 'Ременной', 'Ресивер': 'Без ресивера', 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'product-4', categoryId: 'compressors', categoryLabel: 'Компрессоры', name: 'Berg ВК 11', sku: 'GR-0004', price: 208750,
    href: '/catalog/compressor-equipment/screw-compressors', availability: 'Получение ориентировочно завтра',
    specs: { 'Тип компрессора': 'Винтовой', 'Производительность': '1 250 л/мин', 'Максимальное давление': '10 бар', 'Мощность': '11 кВт', 'Напряжение': '380 В', 'Тип привода': 'Прямой', 'Ресивер': 'Без ресивера', 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'product-6', categoryId: 'compressors', categoryLabel: 'Компрессоры', name: 'Dali ВК 12', sku: 'GR-0006', price: 232500,
    href: '/catalog/compressor-equipment/screw-compressors', availability: 'Под заказ',
    specs: { 'Тип компрессора': 'Винтовой', 'Производительность': '1 600 л/мин', 'Максимальное давление': '13 бар', 'Мощность': '15 кВт', 'Напряжение': '380 В', 'Тип привода': 'Прямой', 'Ресивер': '500 л', 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'product-9', categoryId: 'compressors', categoryLabel: 'Компрессоры', name: 'Comaro Air 13', sku: 'GR-0009', price: 256250,
    href: '/catalog/compressor-equipment/screw-compressors', availability: 'В наличии в 1 магазине',
    specs: { 'Тип компрессора': 'Винтовой', 'Производительность': '1 800 л/мин', 'Максимальное давление': '13 бар', 'Мощность': '15 кВт', 'Напряжение': '380 В', 'Тип привода': 'Ременной', 'Ресивер': '500 л', 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'product-2', categoryId: 'tools', categoryLabel: 'Инструмент', name: 'Набор инструмента для мастерской', sku: 'GR-0002', price: 27900,
    href: '/catalog/tools', availability: 'В наличии в 3 магазинах',
    specs: { 'Тип набора': 'Универсальный', 'Количество предметов': '108', 'Материал': 'Хромованадиевая сталь', 'Привод': '1/4″ и 1/2″', 'Кейс': 'Да', 'Гарантия': 'Условия уточняются' },
  },
  {
    id: 'product-7', categoryId: 'tools', categoryLabel: 'Инструмент', name: 'Тележка инструментальная', sku: 'GR-0007', price: 72900,
    href: '/catalog/tools', availability: 'Получение ориентировочно через 3 дня',
    specs: { 'Тип набора': 'Тележка', 'Количество предметов': '196', 'Материал': 'Сталь', 'Привод': '1/4″, 3/8″ и 1/2″', 'Кейс': 'Нет', 'Гарантия': 'Условия уточняются' },
  },
]

export const demoCompareIds = ['product-1', 'product-4', 'product-6', 'product-2']

export const compareCategories = [
  { id: 'compressors' as const, label: 'Компрессоры' },
  { id: 'tools' as const, label: 'Инструмент' },
]

export const money = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
