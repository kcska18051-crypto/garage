import type { Product, PrototypeData } from './types'

const products: Product[] = Array.from({ length: 10 }, (_, index) => ({ id: `product-${index + 1}`, name: ['Домкрат подкатной профессиональный', 'Набор инструмента для мастерской', 'Краскопульт с верхним бачком', 'Компрессор поршневой', 'Стенд диагностический', 'Шлифовальная машинка', 'Тележка инструментальная', 'Сварочный аппарат', 'Осушитель рефрижераторный', 'Ресивер вертикальный'][index], price: `${(index + 2) * 9} 900 ₽`, availability: index % 3 === 0 ? 'Срок уточняется для вашего города' : 'Доступно к заказу', href: `/product/product-${index + 1}` }))

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
  ],
  promoBanners: [
    { id: 'season', title: 'Подготовьте мастерскую к сезону', text: 'Оборудование для обновления рабочего поста.', cta: 'Смотреть подборку', href: '/actions/season-workshop', tone: 'light' },
    { id: 'compressors', title: 'Компрессорное оборудование', text: 'Решения для разных рабочих задач.', cta: 'Перейти в категорию', href: '/catalog/compressor-equipment', tone: 'mid' },
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
  useful: [
    { id: 'news-1', kind: 'news', title: 'Обновление ассортимента оборудования', meta: 'Новости компании · демонстрация', href: '/news/assortment-update' },
    { id: 'news-2', kind: 'news', title: 'Новые решения для рабочих постов', meta: 'Новости компании · демонстрация', href: '/news/workshop-solutions' },
    { id: 'article-1', kind: 'article', title: 'Как выбрать оборудование для новой рабочей зоны', meta: 'Практическое руководство', href: '/articles/work-area' },
    { id: 'article-2', kind: 'article', title: 'Что учесть при подборе материалов для окраски', meta: 'Подбор и применение', href: '/articles/paint-materials' },
    { id: 'review-1', kind: 'testimonial', title: 'Отзыв о подборе оборудования', meta: 'Текст и источник будут добавлены после согласования', href: '/reviews' },
    { id: 'review-2', kind: 'testimonial', title: 'Отзыв о сервисном обслуживании', meta: 'Текст и источник будут добавлены после согласования', href: '/reviews' },
  ],
  config: { showTestimonials: true, showNewsletter: false },
}
