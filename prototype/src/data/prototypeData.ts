import type { PrototypeData } from './types'

export const prototypeData: PrototypeData = {
  slides: [
    { id: 'intro', eyebrow: 'Профессиональный выбор', title: 'Оборудование и материалы для тех, кто работает с автомобилями', text: 'Каталог для мастерских, автосервисов, производств и частных мастеров.', cta: 'Перейти в каталог', href: '/catalog' },
    { id: 'paint', eyebrow: 'Услуга', title: 'Подбор автоэмали под вашу задачу', text: 'Поможем определить решение и подготовить материалы для окраски.', cta: 'Подробнее об услуге', href: '/services/paint-matching' },
    { id: 'service', eyebrow: 'Проект под ключ', title: 'Комплексное оснащение автосервиса', text: 'Соберём требования и предложим состав оборудования для проекта.', cta: 'Обсудить проект', href: '/services/workshop' },
  ],
  benefits: [
    { id: 'delivery', title: 'Доставка по России', text: 'Условия и срок зависят от выбранного города.' },
    { id: 'pickup', title: 'Самовывоз', text: 'Доступность показывается для выбранного региона.' },
    { id: 'support', title: 'Гарантия и сервис', text: 'Помощь до покупки и после получения.' },
    { id: 'clients', title: 'Для бизнеса и частных клиентов', text: 'Розничные и профессиональные сценарии покупки.' },
  ],
  categories: [
    ['lifting', 'Подъёмное оборудование'], ['body', 'Кузовной ремонт'], ['paint', 'Покраска и подготовка'], ['diagnostics', 'Диагностическое оборудование'], ['tools', 'Инструмент'], ['welding', 'Сварочное оборудование'], ['cleaning', 'Мойка и уборка'], ['materials', 'Расходные материалы'],
  ].map(([id, name], index) => ({ id, name, href: `/catalog/${id}`, code: String(index + 1).padStart(2, '0') })),
  brands: ['Nordberg', 'Русская техника', 'JTC', 'Rupes', 'WiederKraft', 'Jonnesway', 'Sivik', 'Car-Tool'].map((name) => ({ id: name.toLowerCase().replaceAll(' ', '-'), name, href: `/brands/${encodeURIComponent(name.toLowerCase())}` })),
  products: Array.from({ length: 10 }, (_, index) => ({ id: `product-${index + 1}`, name: ['Домкрат подкатной профессиональный', 'Набор инструмента для мастерской', 'Краскопульт с верхним бачком', 'Компрессор поршневой', 'Стенд диагностический', 'Шлифовальная машинка', 'Тележка инструментальная', 'Сварочный аппарат', 'Осушитель рефрижераторный', 'Ресивер вертикальный'][index], price: `${(index + 2) * 9} 900 ₽`, availability: index % 3 === 0 ? 'Срок уточняется для вашего города' : 'Доступно к заказу', href: `/product/product-${index + 1}` })),
  services: [
    { id: 'paint-matching', name: 'Подбор автоэмали', text: 'Подберём цвет и подготовим решение для качественного ремонта покрытия.', cta: 'Узнать о подборе', href: '/services/paint-matching' },
    { id: 'workshop', name: 'Оснащение автосервиса', text: 'Поможем спроектировать, подобрать и запустить комплект оборудования.', cta: 'Обсудить оснащение', href: '/services/workshop' },
  ],
  useful: [
    { id: 'article-1', kind: 'article', title: 'Как выбрать оборудование для новой рабочей зоны', meta: 'Практическое руководство', href: '/articles/work-area' },
    { id: 'article-2', kind: 'article', title: 'Что учесть при подборе материалов для окраски', meta: 'Подбор и применение', href: '/articles/paint-materials' },
    { id: 'article-3', kind: 'article', title: 'Базовый набор инструмента для мастерской', meta: 'Чек-лист', href: '/articles/workshop-tools' },
  ],
  config: { showTestimonials: false, showNewsletter: false },
}
