export type MaterialKind = 'news' | 'article' | 'review'
export type MaterialSection = { id: string; title?: string; paragraphs: string[]; image?: boolean }
export type Material = {
  kind: MaterialKind
  slug: string
  category: string
  categoryLabel: string
  date: string
  dateLabel: string
  title: string
  summary: string
  intro: string
  coverTone: number
  videos?: { title: string }[]
  sections: MaterialSection[]
}

export const materialKinds = {
  news: { title: 'Новости', singular: 'Новость', all: 'Все новости', path: '/news' },
  article: { title: 'Статьи', singular: 'Статья', all: 'Все статьи', path: '/articles' },
  review: { title: 'Обзоры', singular: 'Обзор', all: 'Все обзоры', path: '/reviews' },
} as const

const section = (id: string, title: string, text: string, image = false): MaterialSection => ({ id, title, paragraphs: [text], image })
const baseSections = (subject: string): MaterialSection[] => [{
  id: 'body',
  paragraphs: [
    `${subject}. Материал собран как спокойный ориентир для предварительного знакомства с темой.`,
    'При выборе решения важно учитывать формат мастерской, регулярную нагрузку и доступное рабочее пространство.',
    'Характеристики оборудования и условия эксплуатации следует сопоставлять с рекомендациями производителя.',
    'Перед окончательным решением полезно проверить совместимость элементов и предусмотреть дальнейшее обслуживание.',
  ],
  image: true,
}]

export const materials: Material[] = [
  { kind: 'news', slug: 'assortment-update', category: 'company', categoryLabel: 'Компания', date: '2026-09-24', dateLabel: '24 сентября 2026', title: 'Обновление ассортимента оборудования', summary: 'В каталоге появились новые позиции для оснащения профессиональных рабочих зон.', intro: 'Мы расширили демонстрационный ассортимент оборудования для сервисных постов и собрали ключевые направления в одном материале.', coverTone: 0, videos: [{ title: 'Новое оборудование в каталоге' }], sections: baseSections('Новые позиции дополняют основные категории оборудования') },
  { kind: 'news', slug: 'professional-day', category: 'events', categoryLabel: 'События', date: '2026-09-18', dateLabel: '18 сентября 2026', title: 'День профессионального оборудования', summary: 'Встреча специалистов по оснащению и организации рабочих постов.', intro: 'На демонстрационной встрече специалисты разбирают компоновку сервисных зон и эксплуатацию оборудования.', coverTone: 1, sections: baseSections('Программа события объединяет короткие практические сессии') },
  { kind: 'news', slug: 'workshop-solutions', category: 'company', categoryLabel: 'Компания', date: '2026-08-30', dateLabel: '30 августа 2026', title: 'Новые решения для рабочих постов', summary: 'Обновили подход к подбору комплектов для мастерских разного формата.', intro: 'Новая структура подбора помогает быстрее сопоставить задачи поста и группы оборудования.', coverTone: 2, sections: baseSections('Подбор начинается с задач и доступной площади') },
  { kind: 'news', slug: 'service-solutions', category: 'service', categoryLabel: 'Сервис', date: '2026-08-12', dateLabel: '12 августа 2026', title: 'Сервисные решения для оборудования', summary: 'Собрали основные сценарии поддержки оборудования после покупки.', intro: 'Материал объясняет, какие данные подготовить перед обращением и как проходит первичная диагностика.', coverTone: 3, sections: baseSections('Сервисная поддержка начинается с корректной идентификации оборудования') },
  { kind: 'news', slug: 'season-equipment', category: 'events', categoryLabel: 'События', date: '2026-07-20', dateLabel: '20 июля 2026', title: 'Оборудование для сезонных работ', summary: 'Практическая встреча о подготовке сервисной зоны к пиковым нагрузкам.', intro: 'Участники обсуждают проверку оборудования и планирование расходных материалов перед сезоном.', coverTone: 4, videos: [{ title: 'Подготовка мастерской к сезону' }], sections: baseSections('Сезонная подготовка снижает риск незапланированных остановок') },
  { kind: 'news', slug: 'body-repair-materials', category: 'company', categoryLabel: 'Компания', date: '2026-06-14', dateLabel: '14 июня 2026', title: 'Материалы для кузовного ремонта', summary: 'Расширили демонстрационную подборку для подготовки и окраски.', intro: 'В подборку вошли совместимые группы материалов для последовательных этапов ремонта покрытия.', coverTone: 5, sections: baseSections('Подборка выстроена по этапам технологического процесса') },

  { kind: 'article', slug: 'work-area', category: 'guides', categoryLabel: 'Руководства', date: '2026-09-27', dateLabel: '27 сентября 2026', title: 'Как выбрать оборудование для новой рабочей зоны', summary: 'Ключевые вопросы перед подбором комплекта и планированием пространства.', intro: 'Начинайте со списка операций, нагрузки и ограничений помещения.', coverTone: 0, videos: [{ title: 'Планирование рабочей зоны' }], sections: [section('tasks', 'Определите задачи зоны', 'Зафиксируйте регулярные операции, поток автомобилей и доступ вокруг оборудования.', true), section('utilities', 'Проверьте коммуникации', 'Сопоставьте электросеть, пневмолинии, вентиляцию и нагрузку на пол.'), section('layout', 'Соберите план размещения', 'Учтите безопасные проходы, обслуживание и будущее расширение.') ] },
  { kind: 'article', slug: 'paint-materials', category: 'guides', categoryLabel: 'Руководства', date: '2026-08-22', dateLabel: '22 августа 2026', title: 'Что учесть при подборе материалов для окраски', summary: 'Базовые критерии выбора материалов под технологию ремонта покрытия.', intro: 'Совместимость слоёв и условия нанесения важнее выбора отдельного продукта.', coverTone: 1, sections: baseSections('Система материалов должна соответствовать технологии ремонта') },
  { kind: 'article', slug: 'workshop-layout', category: 'practice', categoryLabel: 'Практика', date: '2026-07-19', dateLabel: '19 июля 2026', title: 'Как организовать рабочий пост', summary: 'Практическая схема размещения инструмента и оборудования.', intro: 'Хорошая организация поста сокращает лишние перемещения и помогает поддерживать порядок.', coverTone: 2, videos: [{ title: 'Организация рабочего поста' }], sections: baseSections('Зонирование связывает хранение, оборудование и рабочую последовательность') },
  { kind: 'article', slug: 'equipment-setup', category: 'practice', categoryLabel: 'Практика', date: '2026-06-11', dateLabel: '11 июня 2026', title: 'Подготовка оборудования к работе', summary: 'Последовательность проверок перед первым запуском и сменой.', intro: 'Короткая проверка перед началом работы помогает вовремя обнаружить отклонения.', coverTone: 3, sections: baseSections('Проверка начинается с внешнего осмотра и рабочей зоны') },
  { kind: 'article', slug: 'tool-maintenance', category: 'service', categoryLabel: 'Обслуживание', date: '2026-05-06', dateLabel: '6 мая 2026', title: 'Уход за инструментом в мастерской', summary: 'Практические ориентиры для регулярного обслуживания инструмента.', intro: 'Регулярная очистка, осмотр и правильное хранение продлевают срок службы инструмента.', coverTone: 4, sections: baseSections('График обслуживания зависит от интенсивности эксплуатации') },
  { kind: 'article', slug: 'compressor-checklist', category: 'guides', categoryLabel: 'Руководства', date: '2026-04-15', dateLabel: '15 апреля 2026', title: 'Чек-лист выбора компрессора', summary: 'Как связать производительность, давление и режим работы.', intro: 'Параметры компрессора следует оценивать как единую систему, включая подготовку воздуха.', coverTone: 5, sections: baseSections('Запас производительности помогает компенсировать пики потребления') },

  { kind: 'review', slug: 'workshop-solutions', category: 'equipment', categoryLabel: 'Оборудование', date: '2026-09-29', dateLabel: '29 сентября 2026', title: 'Обзор решений для оснащения рабочего поста', summary: 'Сравниваем назначение основных групп оборудования для типового поста.', intro: 'В обзоре разбираем связку подъёмного оборудования, инструмента и систем подачи воздуха.', coverTone: 0, videos: [{ title: 'Оснащение рабочего поста' }], sections: baseSections('Комплект оборудования оценивается как единый рабочий процесс') },
  { kind: 'review', slug: 'compressor-types', category: 'comparison', categoryLabel: 'Сравнение', date: '2026-08-26', dateLabel: '26 августа 2026', title: 'Типы компрессорного оборудования', summary: 'Разбираем отличия решений для разных режимов нагрузки.', intro: 'Сравниваем не отдельные модели, а принципы работы и подходящие сценарии эксплуатации.', coverTone: 1, videos: [{ title: 'Типы компрессоров' }, { title: 'Сравнение режимов работы' }], sections: baseSections('Режим потребления воздуха определяет подходящий тип оборудования') },
  { kind: 'review', slug: 'lifting-equipment', category: 'equipment', categoryLabel: 'Оборудование', date: '2026-07-16', dateLabel: '16 июля 2026', title: 'Подъёмное оборудование для сервиса', summary: 'Основные форматы подъёмников и области их применения.', intro: 'Рассматриваем компоновку, ограничения помещения и типовые операции обслуживания.', coverTone: 2, sections: baseSections('Выбор подъёмника связан с геометрией помещения и профилем работ') },
  { kind: 'review', slug: 'body-tools', category: 'comparison', categoryLabel: 'Сравнение', date: '2026-06-08', dateLabel: '8 июня 2026', title: 'Инструмент для кузовных работ', summary: 'Сравнение групп инструмента для восстановления геометрии и подготовки.', intro: 'Инструмент сгруппирован по этапам ремонта, чтобы показать роль каждой категории.', coverTone: 3, sections: baseSections('Набор зависит от характера повреждений и принятой технологии') },
  { kind: 'review', slug: 'paint-zone', category: 'equipment', categoryLabel: 'Оборудование', date: '2026-05-03', dateLabel: '3 мая 2026', title: 'Оснащение зоны подготовки', summary: 'Как связать удаление пыли, освещение и рабочие поверхности.', intro: 'Обзор показывает, как отдельные элементы формируют управляемую зону подготовки.', coverTone: 4, videos: [{ title: 'Зона подготовки к окраске' }], sections: baseSections('Качество подготовки зависит от чистоты и стабильности условий') },
  { kind: 'review', slug: 'diagnostic-tools', category: 'comparison', categoryLabel: 'Сравнение', date: '2026-04-12', dateLabel: '12 апреля 2026', title: 'Диагностический инструмент мастерской', summary: 'Обзор базовых групп для первичной проверки автомобиля.', intro: 'Сравниваем назначение универсальных и специализированных инструментов.', coverTone: 5, sections: baseSections('Диагностический набор формируется от типовых обращений сервиса') },
]

export const materialsByKind = (kind: MaterialKind) => materials.filter((item) => item.kind === kind)
export const getMaterial = (kind: MaterialKind, slug?: string) => materials.find((item) => item.kind === kind && item.slug === slug)
