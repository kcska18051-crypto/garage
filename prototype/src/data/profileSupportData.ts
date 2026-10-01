export type ProfileDocument = {
  id: string; scope: 'personal' | 'organization'; organization?: string; type: string; title: string
  number: string; date: string; order: string; format: string; status: 'Доступен' | 'Формируется' | 'Требует уточнения'; period: '2026' | '2025'
}

export const profileDocuments: ProfileDocument[] = [
  { id: 'doc-1', scope: 'personal', type: 'Гарантийный документ', title: 'Гарантийный документ', number: 'GD-1024', date: '15.09.2026', order: 'GR-1024', format: 'PDF', status: 'Доступен', period: '2026' },
  { id: 'doc-2', scope: 'personal', type: 'Коммерческое предложение', title: 'Коммерческое предложение', number: 'KP-0871', date: '02.08.2026', order: 'GR-0871', format: 'PDF', status: 'Формируется', period: '2026' },
  { id: 'doc-3', scope: 'organization', organization: 'ООО «АвтоПрофи»', type: 'Счёт', title: 'Счёт на оплату', number: 'SC-0312', date: '10.09.2026', order: 'ORG-0312', format: 'PDF', status: 'Доступен', period: '2026' },
  { id: 'doc-4', scope: 'organization', organization: 'ООО «АвтоПрофи»', type: 'УПД / накладная', title: 'УПД / накладная', number: 'UPD-0312', date: '12.09.2026', order: 'ORG-0312', format: 'PDF', status: 'Требует уточнения', period: '2026' },
  { id: 'doc-5', scope: 'organization', organization: 'ООО «Мастерская Север»', type: 'Акт', title: 'Акт выполненных работ', number: 'AKT-0188', date: '18.12.2025', order: 'ORG-0188', format: 'PDF', status: 'Доступен', period: '2025' },
]

export const helpCategories = ['Заказы', 'Доставка и получение', 'Оплата', 'Возврат и гарантия', 'Профиль и организации', 'Услуги'] as const

export const helpQuestions = [
  { id: 'faq-orders', category: 'Заказы', question: 'Как проверить статус заказа?', answer: 'Статус и этапы обработки отображаются в разделе «Мои заказы».' },
  { id: 'faq-delivery', category: 'Доставка и получение', question: 'Как изменить способ получения?', answer: 'Если заказ ещё допускает изменения, откройте его и выберите доступное действие.' },
  { id: 'faq-payment', category: 'Оплата', question: 'Какие способы оплаты доступны?', answer: 'Доступные способы зависят от типа покупателя и выбранного способа получения.' },
  { id: 'faq-return', category: 'Возврат и гарантия', question: 'Как оформить возврат?', answer: 'Сохраните комплектность товара и создайте обращение, указав номер заказа и причину.' },
  { id: 'faq-profile', category: 'Профиль и организации', question: 'Как добавить организацию?', answer: 'Откройте «Мои организации» и выполните демонстрационный поиск по ИНН.' },
  { id: 'faq-services', category: 'Услуги', question: 'Где посмотреть заявку на услугу?', answer: 'Текущие обращения доступны в разделе «Заявки на услуги».' },
] as const
