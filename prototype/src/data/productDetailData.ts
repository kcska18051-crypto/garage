export type ProductSectionLink = { id: string; label: string }
export type ProductSpecGroup = { title: string; items: Array<[string, string]> }

export const productDetail = {
  id: 'remeza-vk-10-gr-0001',
  name: 'Remeza ВК 10',
  sku: 'GR-0001',
  brand: 'Remeza',
  status: 'Доступно для заказа',
  rating: '4,8',
  reviewCount: '12 отзывов',
  warranty: 'Условия гарантии уточняются',
  oldPrice: 207200,
  price: 185000,
  gallery: ['Общий вид', 'Панель управления', 'Компрессорный блок', 'Габаритная схема'],
  keySpecs: [
    ['Производительность', '10 л/мин'], ['Рабочее давление', '10 бар'], ['Мощность', '7,5 кВт'],
    ['Напряжение', '380 В'], ['Тип привода', 'Ременной'], ['Ресивер', 'Без ресивера'], ['Исполнение', 'Напольное'],
  ] as Array<[string, string]>,
  features: ['Для продолжительных рабочих циклов', 'Компактная компоновка', 'Доступ к сервисным узлам', 'Подключение к существующей пневмосети'],
  sections: [
    { id: 'description', label: 'Описание' }, { id: 'characteristics', label: 'Характеристики' },
    { id: 'equipment', label: 'Комплектация' }, { id: 'documents', label: 'Документы' },
    { id: 'delivery', label: 'Доставка и самовывоз' }, { id: 'reviews', label: 'Отзывы' },
    { id: 'questions', label: 'Вопросы' }, { id: 'service', label: 'Сервис и гарантия' },
    { id: 'analogs', label: 'Аналоги' },
  ] as ProductSectionLink[],
  specGroups: [
    { title: 'Рабочие параметры', items: [['Производительность', '10 л/мин'], ['Максимальное давление', '10 бар'], ['Мощность двигателя', '7,5 кВт'], ['Напряжение питания', '380 В']] },
    { title: 'Конструкция', items: [['Тип компрессора', 'Винтовой'], ['Тип привода', 'Ременной'], ['Система смазки', 'Масляная'], ['Установка', 'Напольная']] },
    { title: 'Эксплуатация', items: [['Уровень шума', 'Данные уточняются'], ['Температурный диапазон', 'Данные уточняются'], ['Подключение', 'Данные уточняются']] },
  ] as ProductSpecGroup[],
}

export const money = (value: number) => `${value.toLocaleString('ru-RU')} ₽`
