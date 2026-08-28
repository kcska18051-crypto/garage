import type { CatalogBrand, CatalogCategory, CatalogProduct, CatalogSubcategory, FilterGroup, TagGroup } from './catalogTypes'

export const catalogBrands: CatalogBrand[] = [
  { id: 'remeza', name: 'Remeza', count: 8 }, { id: 'berg', name: 'Berg', count: 6 }, { id: 'dali', name: 'Dali', count: 5 },
  { id: 'comprag', name: 'Comprag', count: 4 }, { id: 'fiac', name: 'Fiac', count: 3 }, { id: 'garage-pro', name: 'Garage Pro', count: 4 },
]

export const catalogCategories: CatalogCategory[] = [
  { id: 'compressor-equipment', name: 'Компрессорное оборудование', href: '/catalog/compressor-equipment', count: 164, description: 'Компрессоры, подготовка воздуха и комплектующие для мастерских и производств.', childNames: ['Винтовые компрессоры', 'Поршневые компрессоры', 'Осушители'] },
  { id: 'lifting', name: 'Подъёмное оборудование', href: '/catalog/lifting', count: 238, description: 'Подъёмники, домкраты и оборудование рабочих постов.', childNames: ['Автоподъёмники', 'Домкраты', 'Стойки'] },
  { id: 'body', name: 'Кузовной ремонт', href: '/catalog/body', count: 412, description: 'Стапели, споттеры и инструмент для восстановления кузова.', childNames: ['Стапели', 'Споттеры', 'Рихтовка'] },
  { id: 'paint', name: 'Покраска и подготовка', href: '/catalog/paint', count: 527, description: 'Оборудование и материалы для подготовки и окраски.', childNames: ['Краскопульты', 'Камеры', 'Материалы'] },
  { id: 'diagnostics', name: 'Диагностическое оборудование', href: '/catalog/diagnostics', count: 296, description: 'Сканеры, стенды и измерительные приборы.', childNames: ['Сканеры', 'Стенды', 'Тестеры'] },
  { id: 'tools', name: 'Инструмент', href: '/catalog/tools', count: 1184, description: 'Ручной, пневматический и специальный инструмент.', childNames: ['Наборы', 'Пневмоинструмент', 'Тележки'] },
  { id: 'welding', name: 'Сварочное оборудование', href: '/catalog/welding', count: 184, description: 'Аппараты, расходные материалы и защита.', childNames: ['Полуавтоматы', 'Инверторы', 'Расходники'] },
  { id: 'cleaning', name: 'Мойка и уборка', href: '/catalog/cleaning', count: 231, description: 'Аппараты высокого давления и уборочная техника.', childNames: ['АВД', 'Пылесосы', 'Химия'] },
]

const screwTags: TagGroup[] = [
  { id: 'brand', label: 'По бренду', limit: 3, seoIndexable: false, values: [{ value: 'remeza', label: 'Remeza', count: 6 }, { value: 'berg', label: 'Berg', count: 4 }, { value: 'dali', label: 'Dali', count: 3 }, { value: 'comprag', label: 'Comprag', count: 2 }] },
  { id: 'voltage', label: 'По напряжению', seoIndexable: false, values: [{ value: '220', label: '220 В', count: 4 }, { value: '380', label: '380 В', count: 14 }] },
  { id: 'performance', label: 'По производительности', limit: 3, seoIndexable: false, values: [{ value: '10', label: '10 л/мин', count: 4 }, { value: '11', label: '11 л/мин', count: 5 }, { value: '15', label: '15 л/мин', count: 5 }, { value: '30', label: '30 л/мин', count: 4 }] },
  { id: 'pressure', label: 'По рабочему давлению', seoIndexable: false, values: [{ value: '8', label: '8 бар', count: 6 }, { value: '10', label: '10 бар', count: 8 }, { value: '12', label: '12 бар', count: 4 }] },
]

export const compressorSubcategories: CatalogSubcategory[] = [
  { id: 'screw-compressors', name: 'Винтовые компрессоры', href: '/catalog/compressor-equipment/screw-compressors', count: 48, description: 'Для продолжительной работы в мастерских и производственных линиях.', tagGroups: screwTags },
  { id: 'piston-compressors', name: 'Поршневые компрессоры', href: '/catalog/compressor-equipment/piston-compressors', count: 62, description: 'Для периодических работ и небольших пневмосетей.' },
  { id: 'oil-free-compressors', name: 'Безмасляные компрессоры', href: '/catalog/compressor-equipment/oil-free-compressors', count: 18, description: 'Чистый воздух без частиц масла; тот же шаблон категории без блока тегов.' },
  { id: 'receivers', name: 'Ресиверы', href: '/catalog/compressor-equipment/receivers', count: 16, description: 'Вертикальные и горизонтальные накопители сжатого воздуха.' },
  { id: 'dryers', name: 'Осушители', href: '/catalog/compressor-equipment/dryers', count: 12, description: 'Подготовка воздуха и удаление конденсата.' },
  { id: 'compressor-accessories', name: 'Комплектующие', href: '/catalog/compressor-equipment/compressor-accessories', count: 8, description: 'Фильтры, магистрали и сервисные наборы.' },
]

const option = (value: string, label: string): { value: string; label: string } => ({ value, label })
export const availabilityOptions = [option('in-stock', 'В наличии'), option('to-order', 'Доступно для заказа'), option('pickup-today', 'Можно забрать сегодня'), option('delivery', 'Доставка в выбранный город'), option('discount', 'Товары со скидкой')]
export const fullFilterGroups: FilterGroup[] = [
  { id: 'availability', label: 'Покупка и получение', type: 'checkbox', options: availabilityOptions, initiallyOpen: true },
  { id: 'price', label: 'Цена', type: 'price', initiallyOpen: true },
  { id: 'brand', label: 'Бренд', type: 'brand', limit: 4, initiallyOpen: true, options: catalogBrands.map(({ id, name }) => option(id, name)) },
  { id: 'performance', label: 'Производительность', type: 'checkbox', options: ['10', '11', '15', '30'].map((value) => option(value, `${value} л/мин`)) },
  { id: 'voltage', label: 'Напряжение', type: 'checkbox', options: [option('220', '220 В'), option('380', '380 В')] },
  { id: 'power', label: 'Мощность двигателя', type: 'checkbox', options: ['5.5', '7.5', '11', '15'].map((value) => option(value, `${value} кВт`)) },
  { id: 'pressure', label: 'Максимальное давление', type: 'checkbox', options: ['8', '10', '12'].map((value) => option(value, `${value} бар`)) },
  { id: 'receiver', label: 'Объём ресивера', type: 'checkbox', options: ['0', '300', '500'].map((value) => option(value, value === '0' ? 'Без ресивера' : `${value} л`)) },
  { id: 'lubrication', label: 'Тип смазки', type: 'checkbox', options: [option('oil', 'Масляный'), option('oil-free', 'Безмасляный')] },
  { id: 'drive', label: 'Тип привода', type: 'checkbox', options: [option('belt', 'Ременной'), option('direct', 'Прямой')] },
  { id: 'noise', label: 'Уровень шума', type: 'checkbox', options: [option('64', 'до 64 дБ'), option('68', 'до 68 дБ'), option('72', 'до 72 дБ')] },
  { id: 'country', label: 'Страна производства', type: 'checkbox', options: [option('belarus', 'Беларусь'), option('italy', 'Италия'), option('china', 'Китай'), option('russia', 'Россия')] },
]

export const reducedFilterGroups: FilterGroup[] = [
  { id: 'subcategory', label: 'Подкатегория', type: 'checkbox', options: compressorSubcategories.map(({ id, name }) => option(id, name)), initiallyOpen: true },
  ...fullFilterGroups.filter((group) => ['availability', 'price', 'brand'].includes(group.id)),
]

const brands = ['remeza', 'berg', 'dali', 'comprag', 'fiac', 'garage-pro']
const subcategories = ['screw-compressors', 'screw-compressors', 'screw-compressors', 'piston-compressors', 'oil-free-compressors', 'receivers', 'dryers', 'compressor-accessories']
const voltages = ['380', '380', '220']
const performances = ['10', '11', '15', '30']
const pressures = ['8', '10', '12']
const countries = ['belarus', 'italy', 'china', 'russia']

export const catalogProducts: CatalogProduct[] = Array.from({ length: 32 }, (_, index) => {
  const brandId = brands[index % brands.length]
  const subcategoryId = subcategories[index % subcategories.length]
  const price = 185000 + index * 23750
  return {
    id: `compressor-${index + 1}`,
    name: `${catalogBrands.find((brand) => brand.id === brandId)?.name} ${subcategoryId === 'screw-compressors' ? 'ВК' : 'Air'} ${10 + index}`,
    slug: `compressor-${index + 1}`,
    sku: `GR-${String(index + 1).padStart(4, '0')}`,
    brandId,
    subcategoryId,
    price,
    oldPrice: index % 5 === 0 ? Math.round(price * 1.12) : undefined,
    availability: index % 4 === 0 ? ['to-order', 'delivery'] : index % 3 === 0 ? ['in-stock', 'pickup-today', 'delivery'] : ['in-stock', 'delivery'],
    delivery: index % 4 === 0 ? 'Поставка от 7 дней' : 'Доставка от 2 дней',
    purchaseMode: index % 7 === 0 ? 'quote' : 'cart',
    popularity: 100 - index,
    isNew: index % 6 === 0,
    specs: {
      voltage: voltages[index % voltages.length], performance: performances[index % performances.length], pressure: pressures[index % pressures.length],
      power: ['5.5', '7.5', '11', '15'][index % 4], receiver: ['0', '300', '500'][index % 3], lubrication: subcategoryId === 'oil-free-compressors' ? 'oil-free' : 'oil',
      drive: index % 2 ? 'direct' : 'belt', noise: ['64', '68', '72'][index % 3], country: countries[index % countries.length],
    },
  }
})

export const getSubcategory = (slug: string | undefined) => compressorSubcategories.find((item) => item.id === slug)
