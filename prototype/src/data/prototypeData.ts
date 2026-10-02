import type { Product, PrototypeData } from './types'
import { materialKinds, materials } from './materialsData'

const availability = [
  { availabilityStatus: 'available' as const, storeCount: 1 },
  { availabilityStatus: 'available' as const, storeCount: 2 },
  { availabilityStatus: 'available' as const, storeCount: 5 },
  { availabilityStatus: 'Под заказ' as const, storeCount: 0 },
  { availabilityStatus: 'Нет в наличии' as const, storeCount: 0 },
  { availabilityStatus: 'Снят с производства' as const, storeCount: 0 },
]

const products: Product[] = Array.from({ length: 10 }, (_, index) => ({ id: `product-${index + 1}`, name: ['Домкрат подкатной профессиональный', 'Набор инструмента для мастерской', 'Краскопульт с верхним бачком', 'Компрессор поршневой', 'Стенд диагностический', 'Шлифовальная машинка', 'Тележка инструментальная', 'Сварочный аппарат', 'Осушитель рефрижераторный', 'Ресивер вертикальный'][index], sku: `GR-${String(index + 1).padStart(4, '0')}`, price: `${(index + 2) * 9} 900 ₽`, ...availability[index % availability.length], href: `/product/product-${index + 1}` }))

export const prototypeData: PrototypeData = {
  slides: [
    { id: 'intro', title: 'Оборудование для автосервиса', text: 'Всё необходимое для рабочих постов и мастерских.', cta: 'В каталог', href: '/catalog' },
    { id: 'paint', title: 'Подбор автоэмали', text: 'Материалы и помощь с подбором цвета под задачу.', cta: 'Об услуге', href: '/services/paint-matching', deadline: 'Условия уточняются' },
    { id: 'service', title: 'Оснащение мастерской', text: 'Соберём комплект оборудования для вашего проекта.', cta: 'Обсудить проект', href: '/services/workshop' },
  ],
  benefits: [
    { id: 'delivery', title: 'Доставка по России', text: 'Условия и срок зависят от выбранного города.' },
    { id: 'pickup', title: 'Самовывоз', text: 'Доступность показывается для выбранного региона.' },
    { id: 'support', title: 'Гарантия и сервис', text: 'Помощь до покупки и после получения.' },
    { id: 'clients', title: 'Для бизнеса и частных клиентов', text: 'Розничные и профессиональные сценарии покупки.' },
  ],
  categories: [
    ['lifting', 'Подъёмное оборудование'], ['body', 'Кузовной ремонт'], ['paint', 'Покраска и подготовка'], ['compressor-equipment', 'Компрессорное оборудование'], ['tools', 'Инструмент'], ['welding', 'Сварочное оборудование'],
  ].map(([id, name], index) => ({ id, name, href: `/catalog/${id}`, code: String(index + 1).padStart(2, '0') })),
  brands: ['Nordberg', 'Trommelberg', 'JTC', 'Rupes', 'WiederKraft', 'Jonnesway', 'Sivik', 'Car-Tool'].map((name) => ({ id: name.toLowerCase().replaceAll(' ', '-'), name, href: `/brands/${encodeURIComponent(name.toLowerCase())}` })),
  products,
  productCollections: [
    { id: 'service', label: 'Оборудование для автосервиса', href: '/catalog?collection=service', source: 'category', products: [products[0], products[1], products[4], products[6], products[7]] },
    { id: 'remeza', label: 'Товары Remeza', href: '/brand/remeza', source: 'brand', products: [products[3], products[8], products[9], products[1], products[4]] },
    { id: 'new', label: 'Новинки', href: '/new', source: 'automatic-new', products: [products[2], products[5], products[0], products[7], products[6]] },
    { id: 'bestsellers', label: 'Хиты продаж', href: '/catalog?collection=bestsellers', source: 'automatic-bestseller', products: [products[1], products[3], products[4], products[6], products[8]] },
  ],
  promoBanners: [
    { id: 'season', title: 'Подготовьте мастерскую к сезону', text: 'Оборудование для обновления рабочего поста.', cta: 'Смотреть подборку', href: '/actions/season-workshop', tone: 'light' },
    { id: 'compressors', title: 'Компрессорное оборудование', text: 'Решения для разных рабочих задач.', cta: 'Перейти в категорию', href: '/catalog/compressor-equipment', tone: 'mid' },
    { id: 'paint', title: 'Материалы для кузовных работ', text: 'Подборка для подготовки и окраски.', cta: 'Перейти в категорию', href: '/catalog/paint', tone: 'mid' },
    { id: 'workshop', title: 'Решения для рабочего поста', text: 'Компактная подборка оборудования и инструмента.', cta: 'Смотреть подборку', href: '/catalog?collection=service', tone: 'light' },
  ],
  homeMerchandising: [
    { id: 'service-row', collectionId: 'service', bannerIds: ['season', 'paint'], visible: true },
    { id: 'new-row', collectionId: 'new', bannerIds: ['compressors'], visible: true },
    { id: 'bestseller-row', collectionId: 'bestsellers', bannerIds: ['workshop'], visible: true },
    { id: 'remeza-row', collectionId: 'remeza', bannerIds: [], visible: true },
    { id: 'hidden-service-row', collectionId: 'service', bannerIds: [], visible: false },
  ],
  promotions: [
    { id: 'service-tools', title: 'Оборудование для сервисного поста', text: 'Демонстрационная подборка для главной страницы.', deadline: 'До 30 сентября · демонстрация', href: '/actions/service-tools', showOnHome: true },
    { id: 'paint-week', title: 'Неделя материалов для покраски', text: 'Условия и ассортимент уточняются клиентом.', deadline: 'Осталось 12 дней · демонстрация', href: '/actions/paint-week', showOnHome: true },
    { id: 'compressor-season', title: 'Компрессорное оборудование', text: 'Выбранное предложение для профессиональных задач.', deadline: 'Срок завершения · данные клиента', href: '/actions/compressor-season', showOnHome: true },
    { id: 'hidden-promotion', title: 'Скрытая акция', text: 'Не выводится на главной.', deadline: 'Данные клиента', href: '/actions/hidden', showOnHome: false },
  ],
  services: [
    { id: 'service-center', name: 'Сервисный центр', text: 'Диагностика и обслуживание оборудования.', cta: 'Подробнее', href: '/services/service-center' },
    { id: 'rental', name: 'Аренда оборудования', text: 'Техника для временных и проектных задач.', cta: 'Условия аренды', href: '/services/rental' },
    { id: 'paint-matching', name: 'Подбор автоэмали', text: 'Подбор цвета и материалов для ремонта покрытия.', cta: 'Узнать о подборе', href: '/services/paint-matching' },
  ],
  useful: (['news', 'article', 'review'] as const).flatMap((kind) => materials.filter((item) => item.kind === kind).slice(0, 5).map((item) => ({ id: `${item.kind}-${item.slug}`, kind: item.kind, title: item.title, text: item.summary, meta: `${materialKinds[item.kind].singular} · ${item.dateLabel}`, href: `${materialKinds[item.kind].path}/${item.slug}`, video: Boolean(item.videos?.length) }))),
  config: { showReviews: true, showNewsletter: false },
}
