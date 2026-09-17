export type ProductSectionLink = { id: string; label: string }
export type ProductSpecGroup = { title: string; items: Array<[string, string]> }
export type GalleryItem = { label: string; type: 'image' | 'video' }
export type ProductVariantGroup = { id: string; label: string; values: string[] }
export type ProductOffer = {
  id: string
  sku: string
  options: Record<string, string>
  oldPrice: number
  price: number
  galleryIndex: number
}

export const productDetail = {
  id: 'remeza-vk-10-gr-0001',
  name: 'Винтовой компрессор Remeza ВК 10-8 с ременным приводом, 380 В, 7,5 кВт',
  brand: 'Remeza',
  rating: '4,8',
  reviewCount: '12 отзывов',
  questionCount: '5 вопросов',
  warranty: 'Официальная гарантия · условия уточняются',
  labels: ['Хит', 'Акция'],
  gallery: [
    { label: 'Общий вид', type: 'image' },
    { label: 'Панель управления', type: 'image' },
    { label: 'Компрессорный блок', type: 'image' },
    { label: 'Габаритная схема', type: 'image' },
    { label: 'Видео о товаре', type: 'video' },
  ] as GalleryItem[],
  variantGroups: [
    { id: 'voltage', label: 'Напряжение', values: ['220 В', '380 В'] },
    { id: 'power', label: 'Мощность', values: ['5,5 кВт', '7,5 кВт', '11 кВт'] },
  ] as ProductVariantGroup[],
  offers: [
    { id: 'remeza-vk-10-gr-0001', sku: 'GR-0001', options: { voltage: '380 В', power: '7,5 кВт' }, oldPrice: 207200, price: 185000, galleryIndex: 0 },
    { id: 'remeza-vk-10-380-55', sku: 'GR-380-55', options: { voltage: '380 В', power: '5,5 кВт' }, oldPrice: 194000, price: 176500, galleryIndex: 1 },
    { id: 'remeza-vk-10-220-55', sku: 'GR-220-55', options: { voltage: '220 В', power: '5,5 кВт' }, oldPrice: 188500, price: 169000, galleryIndex: 2 },
  ] as ProductOffer[],
  keySpecs: [
    ['Производительность', '10 л/мин'], ['Максимальное давление', '10 бар'], ['Тип привода', 'Ременной'],
    ['Исполнение', 'Напольное'], ['Ресивер', 'Без ресивера'],
  ] as Array<[string, string]>,
  sections: [
    { id: 'description', label: 'Описание' }, { id: 'characteristics', label: 'Характеристики' },
    { id: 'equipment', label: 'Комплектация' }, { id: 'video', label: 'Видео' },
    { id: 'documents', label: 'Документы' }, { id: 'reviews', label: 'Отзывы' },
    { id: 'questions', label: 'Вопросы' }, { id: 'delivery', label: 'Доставка и оплата' },
    { id: 'service', label: 'Сервис и гарантия' },
  ] as ProductSectionLink[],
  specGroups: [
    { title: 'Рабочие параметры', items: [['Производительность', '10 л/мин'], ['Максимальное давление', '10 бар'], ['Мощность двигателя', 'Зависит от варианта'], ['Напряжение питания', 'Зависит от варианта']] },
    { title: 'Конструкция', items: [['Тип компрессора', 'Винтовой'], ['Тип привода', 'Ременной'], ['Система смазки', 'Масляная'], ['Установка', 'Напольная']] },
    { title: 'Эксплуатация', items: [['Уровень шума', 'Данные уточняются'], ['Температурный диапазон', 'Данные уточняются'], ['Подключение', 'Данные уточняются']] },
  ] as ProductSpecGroup[],
}

export const defaultOffer = productDetail.offers[0]
export const offerSelections = (offer: ProductOffer) => ({ ...offer.options })
export const findOffer = (selections: Record<string, string>) => productDetail.offers.find((offer) => Object.entries(selections).every(([key, value]) => offer.options[key] === value))
export const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`
