import type { CatalogBrand, CatalogProduct, CatalogRootCategory, CatalogRootSubcategory, CatalogSubcategory, FilterGroup, TagGroup } from './catalogTypes'

export const catalogBrands: CatalogBrand[] = [
  { id: 'remeza', name: 'Remeza', count: 8 }, { id: 'berg', name: 'Berg', count: 6 }, { id: 'dali', name: 'Dali', count: 5 },
  { id: 'comprag', name: 'Comprag', count: 4 }, { id: 'fiac', name: 'Fiac', count: 3 }, { id: 'garage-pro', name: 'Garage Pro', count: 4 },
]

const createSubcategories = (parent: string, names: Array<[string, string]>): CatalogRootSubcategory[] => names.map(([id, name], index) => ({
  id,
  name,
  href: `/catalog/${parent}/${id}`,
  artVariant: index % 4,
}))

const createCategory = (
  slug: string,
  name: string,
  count: number,
  description: string,
  artVariant: number,
  subcategoryNames: Array<[string, string]>,
): CatalogRootCategory => {
  const subcategories = createSubcategories(slug, subcategoryNames)
  return {
    id: slug,
    slug,
    name,
    href: `/catalog/${slug}`,
    count,
    description,
    artVariant,
    subcategories,
    childNames: subcategories.map((subcategory) => subcategory.name),
  }
}

export const catalogCategories: CatalogRootCategory[] = [
  createCategory('compressor-equipment', 'Компрессоры', 164, 'Компрессоры, подготовка воздуха и комплектующие для мастерских и производств.', 0, [
    ['screw-compressors', 'Винтовые компрессоры'],
    ['piston-compressors', 'Поршневые компрессоры'],
    ['oil-free-compressors', 'Безмасляные компрессоры'],
    ['receivers', 'Ресиверы'],
    ['dryers', 'Осушители'],
    ['compressor-accessories', 'Комплектующие'],
  ]),
  createCategory('lifting-equipment', 'Подъёмное оборудование', 238, 'Подъёмники, домкраты и оборудование рабочих постов.', 1, [
    ['car-lifts', 'Автоподъёмники'],
    ['jacks', 'Домкраты'],
    ['stands', 'Стойки'],
    ['cranes', 'Краны'],
    ['presses', 'Прессы'],
    ['wheel-lifters', 'Колёсные подъёмники'],
  ]),
  createCategory('body-repair', 'Кузовной ремонт', 412, 'Оборудование и инструмент для восстановления геометрии кузова.', 2, [
    ['frame-machines', 'Стапели'],
    ['spotters', 'Споттеры'],
    ['straightening-tools', 'Рихтовочный инструмент'],
    ['welding', 'Сварочное оборудование'],
    ['measuring', 'Измерительные системы'],
    ['body-clamps', 'Зажимы и захваты'],
  ]),
  createCategory('painting', 'Покраска', 527, 'Оборудование и материалы для подготовки и окраски.', 3, [
    ['spray-guns', 'Краскопульты'],
    ['paint-booths', 'Покрасочные камеры'],
    ['sanders', 'Шлифовальные машинки'],
    ['preparation', 'Подготовка поверхности'],
    ['drying', 'Сушка'],
    ['painting-accessories', 'Малярные принадлежности'],
  ]),
  createCategory('tools', 'Инструмент', 1184, 'Ручной, пневматический и специальный инструмент.', 0, [
    ['hand-tools', 'Ручной инструмент'],
    ['pneumatic-tools', 'Пневмоинструмент'],
    ['power-tools', 'Электроинструмент'],
    ['tool-sets', 'Наборы инструментов'],
    ['storage', 'Тележки и хранение'],
    ['special-tools', 'Специальный инструмент'],
  ]),
  createCategory('service-station-equipment', 'Оснащение автосервиса', 296, 'Рабочие посты, диагностика и оснащение сервисных зон.', 1, [
    ['diagnostics', 'Диагностика'],
    ['tire-service', 'Шиномонтаж'],
    ['oil-service', 'Замена масла'],
    ['cleaning', 'Мойка и уборка'],
    ['workbenches', 'Верстаки'],
    ['service-furniture', 'Мебель для сервиса'],
  ]),
]

export function formatProductCount(count: number) {
  const lastTwo = count % 100
  const last = count % 10
  const word = lastTwo >= 11 && lastTwo <= 14
    ? 'товаров'
    : last === 1
      ? 'товар'
      : last >= 2 && last <= 4
        ? 'товара'
        : 'товаров'
  return `${count} ${word}`
}

export const getCatalogCategory = (slug: string | undefined) => catalogCategories.find((category) => category.slug === slug)

const screwTags: TagGroup[] = [
  { id: 'brand', label: 'По бренду', limit: 3, seoIndexable: false, values: [{ value: 'remeza', label: 'Remeza', count: 6 }, { value: 'berg', label: 'Berg', count: 4 }, { value: 'dali', label: 'Dali', count: 3 }, { value: 'comprag', label: 'Comprag', count: 2 }] },
  { id: 'voltage', label: 'По напряжению', seoIndexable: false, values: [{ value: '220', label: '220 В', count: 4 }, { value: '380', label: '380 В', count: 14 }] },
  { id: 'performance', label: 'По производительности', limit: 3, seoIndexable: false, values: [{ value: '10', label: '10 л/мин', count: 4 }, { value: '11', label: '11 л/мин', count: 5 }, { value: '15', label: '15 л/мин', count: 5 }, { value: '30', label: '30 л/мин', count: 4 }] },
  { id: 'pressure', label: 'По рабочему давлению', seoIndexable: false, values: [{ value: '8', label: '8 бар', count: 6 }, { value: '10', label: '10 бар', count: 8 }, { value: '12', label: '12 бар', count: 4 }] },
]

export const compressorSubcategories: CatalogSubcategory[] = [
  { id: 'screw-compressors', name: 'Винтовые компрессоры', href: '/catalog/compressor-equipment/screw-compressors', count: 48, description: 'Для продолжительной работы в мастерских и производственных линиях.', tagGroups: screwTags, childSections: [
    { id: 'receiver', name: 'Винтовые компрессоры на ресивере', href: '/catalog/compressor-equipment/screw-compressors/receiver', description: 'Компактное решение с накопительной ёмкостью для готового рабочего поста.' },
    { id: 'dryer', name: 'Винтовые компрессоры с осушителем', href: '/catalog/compressor-equipment/screw-compressors/dryer', description: 'Подготовка сжатого воздуха в составе единой установки.' },
    { id: 'stations', name: 'Компрессорные станции', href: '/catalog/compressor-equipment/screw-compressors/stations', description: 'Комплексные установки для мастерских и производственных линий.' },
    { id: 'direct-drive', name: 'С прямым приводом', href: '/catalog/compressor-equipment/screw-compressors/direct-drive', description: 'Передача мощности без ременного узла для продолжительной нагрузки.' },
    { id: 'belt-drive', name: 'С ременным приводом', href: '/catalog/compressor-equipment/screw-compressors/belt-drive', description: 'Конфигурации с ременной передачей для разных рабочих сценариев.' },
    { id: 'turnkey', name: 'Комплектные компрессорные решения', href: '/catalog/compressor-equipment/screw-compressors/turnkey', description: 'Подбор связанных компонентов как единой рабочей системы.' },
  ] },
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
  { id: 'power', label: 'Мощность двигателя', type: 'checkbox', options: ['5.5', '7.5', '11', '15', '22'].map((value) => option(value, `${value} кВт`)) },
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
    id: index === 0 ? 'remeza-vk-10-gr-0001' : `compressor-${index + 1}`,
    name: `${catalogBrands.find((brand) => brand.id === brandId)?.name} ${subcategoryId === 'screw-compressors' ? 'ВК' : 'Air'} ${10 + index}`,
    slug: index === 0 ? 'remeza-vk-10-gr-0001' : `compressor-${index + 1}`,
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
